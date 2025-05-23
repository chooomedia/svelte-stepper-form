<script lang="ts">
	import { slide } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms';
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Button from '$lib/components/Button.svelte';
	import ImageOption from '$lib/components/ImageOption.svelte';
	import WaitingScreen from '$lib/components/WaitingScreen.svelte';
	import ContactForm from '$lib/components/forms/ContactForm.svelte';
	import ResultsPage from '$lib/components/ResultsPage.svelte';
	import { scoreStore } from '$lib/utils/scoring';
	import WebsiteUrlForm from '$lib/components/forms/WebsiteUrlForm.svelte';
	import { last_step, TOTAL_STEPS } from '$lib/schema';
	import { i18n } from '$lib/i18n';

	// Import stores
	import {
		currentStepIndex,
		stepperStore,
		currentStep,
		jumpToStep
	} from '$lib/stores/stepperStore';
	import { formData, calculatedScore, updateFormField } from '$lib/stores/formStore';
	import { formSubmitting } from '$lib/stores/loadingStore';

	// Import schema and options
	import { FORM_STEPS, formOptions, type FormData } from '$lib/schema';

	const { data = Array, fieldName = [] } = $props<{
		fieldName?: string;
	}>();

	const isDev = import.meta.env.DEV;

	// Initialize the form with SuperForms
	const { form, enhance, errors, submitting } = superForm(data.form, {
		dataType: 'json',
		resetForm: false,
		onSubmit: () => {
			$formSubmitting = true;
		},
		onResult: ({ result }) => {
			$formSubmitting = false;
			if (result.type === 'success') {
				stepperStore.nextStep();
			}
		}
	});

	// Store subscription to update our form data store when form changes
	let scoreStoreData = $state(null);
	let contactFormValid = $state(false);
	let showDebugSidebar = $state(false);
	let isWebsiteAnalysisInProgress = $state(false);
	let isSkipButtonEnabled = $state(false);
	let skipButtonTimer: number | undefined;

	$effect(() => {
		$formData = { ...$form };

		const unsubscribe = scoreStore.subscribe((data) => {
			scoreStoreData = data;
		});

		return unsubscribe;
	});

	function handleAnalysisStart() {
		isWebsiteAnalysisInProgress = true;
		isSkipButtonEnabled = false; // Reset button state

		// Set a timer to enable the skip button after 30 seconds
		if (skipButtonTimer) clearTimeout(skipButtonTimer);
		skipButtonTimer = setTimeout(() => {
			isSkipButtonEnabled = true;
		}, 30000); // 30 seconds
	}

	function handleAnalysisEnd() {
		isWebsiteAnalysisInProgress = false;

		// Clear the skip button timer if it exists
		if (skipButtonTimer) {
			clearTimeout(skipButtonTimer);
			skipButtonTimer = undefined;
		}
	}

	// Website analysis function
	async function handleAnalysisComplete(data: any, score: number) {
		if (data) {
			// Store analysis results, update score
			updateFormField('visibility_score', score);

			// Move to next step after analysis
			setTimeout(() => {
				stepperStore.markStepValid($currentStepIndex);
				stepperStore.nextStep();
			}, 1000);
		}
	}

	// Aktualisierter Event-Handler für ImageOption navigation events
	function handleImageOptionNavigation(
		event: CustomEvent<{ fieldName: string; values: string[] }>
	) {
		const { fieldName, values } = event.detail;
		console.log(`RECEIVED Navigation event for ${fieldName} with values:`, values);

		// Aktualisiere das Formular
		updateFormField(fieldName, values);
		$form[fieldName] = values;

		// Navigiere zum nächsten Schritt - direkt ohne setTimeout
		console.log(`Navigating to next step from ${fieldName}`);
		stepperStore.markStepValid($currentStepIndex);

		// Explizit die Schrittnummer für die Konsole ausgeben
		console.log(`Current step before navigation: ${$currentStepIndex}`);

		// Zum nächsten Schritt gehen
		stepperStore.nextStep();

		// Nach der Navigation die neue Schrittnummer ausgeben
		setTimeout(() => {
			console.log(`Current step after navigation: ${$currentStepIndex}`);
		}, 0);
	}

	// Function to handle image option selection
	function handleImageOptionSelect(fieldName: string, value: string | string[]) {
		// Formularwerte aktualisieren
		updateFormField(fieldName, value);
		$form[fieldName] = value;

		// Bei Einzelauswahl direkt weiterleiten
		if (!Array.isArray(value)) {
			console.log(`Einfachauswahl für ${fieldName}: ${value} - navigiere weiter`);
			setTimeout(() => {
				stepperStore.markStepValid($currentStepIndex);
				stepperStore.nextStep();
			}, 500);
		}
	}

	// Restart assessment
	function restartAssessment() {
		stepperStore.goToStep(1);
	}

	// Component display logic based on current step
	$effect(() => {
		// Update step validation
		const currentStepKey = FORM_STEPS[$currentStepIndex - 1]?.title;
		const isValid = currentStepKey && $form[currentStepKey];

		if (isValid && !$stepperStore.stepValidity[$currentStepIndex] === 'valid') {
			stepperStore.markStepValid($currentStepIndex);
		}
	});

	let debugStepNumber = $currentStepIndex;

	function handleStepChange(event) {
		const newStep = parseInt(event.target.value, 10);
		if (newStep >= 1 && newStep <= TOTAL_STEPS) {
			debugStepNumber = newStep;
			jumpToStep(newStep);
		}
	}

	function prevStep() {
		if (debugStepNumber > 1) {
			debugStepNumber--;
			jumpToStep(debugStepNumber);
		}
	}

	function nextStep() {
		if (debugStepNumber < TOTAL_STEPS) {
			debugStepNumber++;
			jumpToStep(debugStepNumber);
		}
	}

	function formatUrl(url: string): string {
		if (!url) return '';

		// Remove protocol and www
		return url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/+$/, ''); // Also remove trailing slashes
	}
</script>

<div class="form-container" itemscope itemtype="https://schema.org/WebApplication">
	{#if $currentStepIndex === 1}
		<header>
			<div
				class={$currentStepIndex > 1 ? 'sr-only' : 'text-center'}
				aria-hidden={$currentStepIndex > 1}
			>
				<h1
					class="mb-6 text-3xl font-bold text-secondary-900 lg:text-5xl"
					itemprop="name"
					id="assessment-title"
				>
					{$i18n.start.title}
				</h1>

				<p
					class="mx-auto max-w-[33rem] text-base text-secondary-300"
					itemprop="description"
					id="assessment-description"
				>
					{@html $i18n.start.text}
				</p>
				<!-- Page Meta -->
				<PageMeta totalSteps={FORM_STEPS.length} />
			</div>
		</header>
	{/if}

	<!-- Step Content -->

	<!-- Dynamic step content based on current step -->
	<h2
		class="{$currentStepIndex !== 1
			? 'mb-6'
			: ''} text-center text-xl font-semibold text-secondary-700"
	>
		{#if $currentStepIndex === 12}
			{$i18n.schema.steps.result?.description || 'Deine Website-Analyse für'}
			{#if $formData?.company_url}
				{$i18n.start.meta.rating.from}
				<span class="text-primary-600">
					{formatUrl($formData.company_url)}
				</span>
			{/if}
		{:else}
			{$i18n.schema.steps[FORM_STEPS[$currentStepIndex - 1]?.title]?.description || ''}
		{/if}
	</h2>

	{#key $currentStepIndex}
		<!-- Step 1: Visibility -->
		{#if $currentStepIndex === 1}
			<ImageOption
				value={$form.visibility}
				options={formOptions.visibility}
				error={$errors.visibility}
				onSelect={(value) => handleImageOptionSelect('visibility', value)}
				on:navigate={handleImageOptionNavigation}
				fieldName="visibility"
				multiple={true}
				maxSelections={4}
				special={true}
			/>

			<!-- Step 2: Website URL -->
		{:else if $currentStepIndex === 2}
			<WebsiteUrlForm
				{form}
				error={$errors}
				onAnalysisComplete={handleAnalysisComplete}
				onAnalysisStart={handleAnalysisStart}
				onAnalysisEnd={handleAnalysisEnd}
				onclick={() => {
					stepperStore.markStepValid($currentStepIndex);
					stepperStore.nextStep();
				}}
			/>

			<!-- Step 3: Advertising Frequency -->
		{:else if $currentStepIndex === 3}
			<ImageOption
				value={$form.advertising_frequency}
				options={formOptions.advertising_frequency}
				error={$errors.advertising_frequency}
				onSelect={(value) => handleImageOptionSelect('advertising_frequency', value)}
				fieldName="advertising_frequency"
				multiple={false}
			/>

			<!-- Step 4: Goals -->
		{:else if $currentStepIndex === 4}
			<ImageOption
				value={$form.goals}
				options={formOptions.goals}
				error={$errors.goals}
				onSelect={(value) => handleImageOptionSelect('goals', value)}
				fieldName="goals"
				multiple={false}
			/>

			<!-- Step 5: Campaign Management -->
		{:else if $currentStepIndex === 5}
			<ImageOption
				value={$form.campaign_management}
				options={formOptions.campaign_management}
				error={$errors.campaign_management}
				onSelect={(value) => handleImageOptionSelect('campaign_management', value)}
				fieldName="campaign_management"
				multiple={false}
			/>

			<!-- Step 6: Online Reviews -->
		{:else if $currentStepIndex === 6}
			<ImageOption
				value={$form.online_reviews}
				options={formOptions.online_reviews}
				error={$errors.online_reviews}
				onSelect={(value) => handleImageOptionSelect('online_reviews', value)}
				fieldName="online_reviews"
				multiple={false}
			/>

			<!-- Step 7: Previous Campaigns -->
		{:else if $currentStepIndex === 7}
			<ImageOption
				value={$form.previous_campaigns}
				options={formOptions.previous_campaigns}
				error={$errors.previous_campaigns}
				onSelect={(value) => handleImageOptionSelect('previous_campaigns', value)}
				fieldName="previous_campaigns"
				multiple={false}
			/>

			<!-- Step 8: Business Phase -->
		{:else if $currentStepIndex === 8}
			<ImageOption
				value={$form.business_phase}
				options={formOptions.business_phase}
				error={$errors.business_phase}
				onSelect={(value) => handleImageOptionSelect('business_phase', value)}
				fieldName="business_phase"
				multiple={false}
			/>

			<!-- Step 9: Implementation Time -->
		{:else if $currentStepIndex === 9}
			<ImageOption
				value={$form.implementation_time}
				options={formOptions.implementation_time}
				error={$errors.implementation_time}
				onSelect={(value) => handleImageOptionSelect('implementation_time', value)}
				fieldName="implementation_time"
				multiple={false}
			/>

			<!-- Step 10: Company Form -->
		{:else if $currentStepIndex === 10}
			<ContactForm
				{form}
				error={$errors}
				onValidation={(isValid) => {
					contactFormValid = isValid;

					// Wenn das Formular gültig ist, markiere diesen Schritt als abgeschlossen
					if (isValid) {
						stepperStore.markStepValid($currentStepIndex);
					} else {
						// Wenn nicht gültig, markiere als unvollständig
						stepperStore.markStepIncomplete($currentStepIndex);
					}
				}}
			/>

			<!-- Step 12: Results -->
		{:else if $currentStepIndex === 12 && last_step}
			<ResultsPage
				score={$calculatedScore}
				formData={$formData}
				auditData={$scoreStore?.auditData || null}
				nextStep={() => stepperStore.goToStep(1)}
				{restartAssessment}
			/>
			<!-- Fallback: Loading screen -->
		{:else if $currentStepIndex === 11}
			<WaitingScreen
				autoAdvance={7}
				nextStep={() => {
					console.log('Moving to step 12');
					stepperStore.markStepValid($currentStepIndex);
					stepperStore.nextStep();
				}}
			/>
		{/if}

		<!-- Navigation Buttons (except for specific steps) -->
		{#if ![1, 3, 4, 5, 6, 7, 8, 9, 11, 12].includes($currentStepIndex)}
			<div class="mt-8 flex justify-between">
				<Button
					label={$i18n.common.back}
					type="button"
					variant="primary"
					disabled={$currentStepIndex === 1}
					on:click={() => stepperStore.prevStep()}
				/>

				<Button
					label={$currentStepIndex === 2 ? $i18n.common.skip : $i18n.common.next}
					type="button"
					variant="primary"
					disabled={($currentStepIndex === 10 && !contactFormValid) ||
						($currentStepIndex === 2 && isWebsiteAnalysisInProgress && !isSkipButtonEnabled)}
					on:click={() => {
						// Für Schritt 10: Prüfen ob das Kontaktformular gültig ist
						if ($currentStepIndex === 10) {
							if (contactFormValid) {
								stepperStore.markStepValid($currentStepIndex);
								stepperStore.nextStep();
							} else {
								stepperStore.markStepIncomplete($currentStepIndex);
							}
						}
						// Für Schritt 2: Einfach überspringen ohne Validierung
						else if ($currentStepIndex === 2) {
							stepperStore.nextStep();
						}
						// Für alle anderen Schritte: Normales Verhalten
						else {
							stepperStore.markStepValid($currentStepIndex);
							stepperStore.nextStep();
						}
					}}
				/>
			</div>
		{/if}
	{/key}
</div>

{#if isDev}
	<!-- Debug-Toggle Button -->
	<button
		class="fixed left-4 top-4 z-50 rounded-full bg-gray-800 p-2 text-white shadow-lg hover:bg-gray-700"
		onclick={() => (showDebugSidebar = !showDebugSidebar)}
		aria-label="Testing-Panel anzeigen/verbergen"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6"
			><path
				fill="currentColor"
				d="M4.6 15c-.9-2.6-.6-4.6-.5-5.4 2.4-1.5 5.3-2 8-1.3.7-.3 1.5-.5 2.3-.6-.1-.3-.2-.5-.3-.8h2l1.2-3.2-.9-.4-1 2.6h-1.8C13 4.8 12.1 4 11.1 3.4l2.1-2.1-.7-.7L10.1 3c-.7 0-1.5 0-2.3.1L5.4.7l-.7.7 2.1 2.1C5.7 4.1 4.9 4.9 4.3 6H2.5l-1-2.6-.9.4L1.8 7h2C3.3 8.3 3 9.6 3 11H1v1h2c0 1 .2 2 .5 3H1.8L.6 18.3l.9.3 1-2.7h1.4c.4.8 2.1 4.5 5.8 3.9-.3-.2-.5-.5-.7-.8-2.9 0-4.4-3.5-4.4-4zM9 3.9c2 0 3.7 1.6 4.4 3.8-2.9-1-6.2-.8-9 .6.7-2.6 2.5-4.4 4.6-4.4zm14.8 19.2l-4.3-4.3c2.1-2.5 1.8-6.3-.7-8.4s-6.3-1.8-8.4.7-1.8 6.3.7 8.4c2.2 1.9 5.4 1.9 7.7 0l4.3 4.3c.2.2.5.2.7 0 .2-.2.2-.5 0-.7zm-8.8-3c-2.8 0-5.1-2.3-5.1-5.1s2.3-5.1 5.1-5.1 5.1 2.3 5.1 5.1-2.3 5.1-5.1 5.1z"
			/><path fill="none" d="M0 0h24v24H0z" /></svg
		>
	</button>

	<!-- Debug Sidebar -->
	{#if showDebugSidebar}
		<div
			class="fixed left-0 top-0 h-full w-80 overflow-y-auto bg-gray-100 p-4 shadow-2xl transition-transform duration-300"
			style="transform: translateX({showDebugSidebar ? '0' : '100%'});"
			transition:slide={{ duration: 300, axis: 'x' }}
		>
			<div class="flex items-center justify-between border-b border-gray-300 py-1">
				<h3 class="text-grayto-sky-800 ml-12 text-lg font-semibold">Testing-Panel</h3>
				<button
					class="rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
					onclick={() => (showDebugSidebar = false)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<div class="mt-4">
				<label for="jumpStep" class="block text-sm font-medium text-gray-700"
					>Springe zu Schritt:</label
				>
				<div class="mt-2 flex items-center">
					<input
						id="jumpStep"
						type="number"
						min="1"
						max={TOTAL_STEPS}
						value={$currentStepIndex}
						oninput={handleStepChange}
						class="w-16 rounded border border-gray-300 p-2 text-center shadow-sm"
					/>

					<div class="ml-2 flex space-x-2">
						<button
							onclick={prevStep}
							class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
							aria-label="Vorheriger Schritt"
							disabled={debugStepNumber <= 1}
						>
							◀
						</button>

						<button
							onclick={nextStep}
							class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
							aria-label="Nächster Schritt"
							disabled={debugStepNumber >= TOTAL_STEPS}
						>
							▶
						</button>
					</div>
				</div>
			</div>

			<div class="mt-6">
				<h4 class="mb-2 font-medium text-gray-700">
					Aktueller Schritt: {$currentStepIndex}
				</h4>
				<div class="rounded bg-gray-200 p-2">
					<p class="text-sm">
						{$currentStep?.description || 'No description available'}
					</p>
				</div>
			</div>

			<div class="mt-6">
				<h4 class="mb-2 font-medium text-gray-700">Formular-Status</h4>
				<div class="rounded border border-gray-300 bg-white p-3">
					<div class="text-xs">
						<SuperDebug data={form} />
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}
