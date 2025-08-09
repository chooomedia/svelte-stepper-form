<script lang="ts">
	import { slide } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms';

	// Konsolidierte Imports - Redundanzen entfernt
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Button from '$lib/components/Button.svelte';
	import ImageOption from '$lib/components/ImageOption.svelte';
	import WaitingScreen from '$lib/components/WaitingScreen.svelte';
	import ContactForm from '$lib/components/forms/ContactForm.svelte';
	import ResultsPage from '$lib/components/ResultsPage.svelte';
	import WebsiteUrlForm from '$lib/components/forms/WebsiteUrlForm.svelte';

	// Store-Imports konsolidiert
	import { scoreStore } from '$lib/utils/scoring';
	import {
		currentStepIndex,
		stepperStore,
		currentStep,
		jumpToStep
	} from '$lib/stores/stepperStore';
	import { formSubmitting } from '$lib/stores/loadingStore';
	import {
		calculatedScore,
		updateFormData,
		hasContactData,
		hasCompanyData,
		isFormComplete,
		formProgress
	} from '$lib/stores/formStore';

	// Schema-Imports konsolidiert
	import { last_step, TOTAL_STEPS, FORM_STEPS, formOptions, defaultValues } from '$lib/schema';
	import { i18n } from '$lib/i18n';
	import { env } from '$lib/config/env';

	const { data } = $props();
	const isDev = import.meta.env.DEV;

	// Demo-URL Konstante - aus zentraler Konfiguration
	const DEMO_URL = env.DEMO_URL;

	// Initialize the form with SuperForms - korrigiert für data-Objekt
	const { form, errors } = superForm(data?.form || { data: defaultValues }, {
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

	// State variables - konsolidiert
	let contactFormValid = $state(false);
	let showDebugSidebar = $state(false);
	let isWebsiteAnalysisInProgress = $state(false);
	let isSkipButtonEnabled = $state(false);
	let skipButtonTimer: ReturnType<typeof setTimeout> | undefined;
	let formSubmissionAttempted = $state(false);
	let formInitialized = $state(false);
	let lastStep = $state(0);
	let lastValidatedStep = $state(0);
	let debugStepNumber = $state($currentStepIndex);

	// Konsolidierter Form-Initialisierungs-Effect - korrigiert für data-Objekt
	$effect(() => {
		if ($form?.data) {
			// Setze Demo-URL nur für Step 2 (Website Analysis) - nicht für andere Steps
			if ($currentStepIndex === 2 && (!$form.data.company_url || $form.data.company_url === '')) {
				console.log('🔍 Setting demo URL for Step 2 testing');
				form.update((current) => ({
					...current,
					data: {
						...current.data,
						company_url: DEMO_URL
					}
				}));
			}

			// Update calculatedScore store when visibility_score changes
			if ($form.data.visibility_score !== undefined) {
				calculatedScore.set($form.data.visibility_score);
			}

			// Sync SuperForm data to formStore - nur data-Objekt
			console.log('🔍 Syncing SuperForm data to formStore');
			updateFormData($form.data);

			// Mark form as initialized
			if (!formInitialized) {
				formInitialized = true;
			}
		}
	});

	// Development test data for step 10 - korrigiert für data-Objekt
	$effect(() => {
		if (isDev && $currentStepIndex === 10 && lastStep !== 10) {
			lastStep = 10;
			// Initialisiere Demo-Daten nur einmal beim Erreichen von Step 10
			const demoData = {
				salutation: 'Herr' as const,
				first_name: 'Test',
				last_name: 'User',
				email: env.DEMO_EMAIL,
				phone: env.DEMO_PHONE,
				company_name: env.DEMO_COMPANY_NAME,
				company_url: DEMO_URL,
				privacy_agreement: false,
				marketing_consent: false
			};

			form.update((current) => ({
				...current,
				data: {
					...current.data,
					...demoData
				}
			}));
			console.log('Development test data loaded for step 10');
		} else if ($currentStepIndex !== 10) {
			lastStep = $currentStepIndex;
		}
	});

	// Debug logging - konsolidiert
	console.log('🔍 Form data loaded:', $form);
	console.log('🔍 Form errors:', $errors);
	console.log('🔍 Form store:', form);
	console.log('🔍 Default values:', defaultValues);
	console.log('🔍 Form structure check:', {
		hasData: !!$form?.data,
		companyUrl: $form?.data?.company_url,
		visibilityScore: $form?.data?.visibility_score,
		formKeys: $form ? Object.keys($form) : []
	});
	console.log('🔍 FormStore status:', {
		hasContactData: $hasContactData,
		hasCompanyData: $hasCompanyData,
		isComplete: $isFormComplete,
		progress: $formProgress
	});

	// Event handlers - konsolidiert
	function handleAnalysisStart() {
		isWebsiteAnalysisInProgress = true;
		isSkipButtonEnabled = false;

		if (skipButtonTimer) clearTimeout(skipButtonTimer);
		skipButtonTimer = setTimeout(() => {
			isSkipButtonEnabled = true;
		}, 30000);
	}

	function handleAnalysisEnd() {
		isWebsiteAnalysisInProgress = false;

		if (skipButtonTimer) {
			clearTimeout(skipButtonTimer);
			skipButtonTimer = undefined;
		}
	}

	async function handleAnalysisComplete(data: any, score: number) {
		if (data) {
			form.update((current) => ({
				...current,
				data: {
					...current.data,
					visibility_score: score
				}
			}));

			setTimeout(() => {
				stepperStore.markStepValid($currentStepIndex);
				stepperStore.nextStep();
			}, 1000);
		}
	}

	function handleImageOptionNavigation(
		event: CustomEvent<{ fieldName: string; values: string[] }>
	) {
		const { fieldName, values } = event.detail;
		console.log(`RECEIVED Navigation event for ${fieldName} with values:`, values);

		form.update((current) => ({
			...current,
			data: {
				...current.data,
				[fieldName]: values
			}
		}));

		console.log(`Navigating to next step from ${fieldName}`);
		stepperStore.markStepValid($currentStepIndex);
		stepperStore.nextStep();
	}

	function handleImageOptionSelect(fieldName: string, value: string | string[]) {
		console.log(`🔍 handleImageOptionSelect: ${fieldName} =`, value);

		form.update((current) => ({
			...current,
			data: {
				...current.data,
				[fieldName]: value
			}
		}));

		// Update formStore - nur data-Objekt
		updateFormData({ [fieldName]: value });

		// Nur bei Einzelauswahl automatisch zum nächsten Step navigieren
		// Bei Mehrfachauswahl (wie visibility) wird die Navigation über handleImageOptionNavigation gesteuert
		if (fieldName !== 'visibility') {
			stepperStore.markStepValid($currentStepIndex);
			stepperStore.nextStep();
		}
	}

	function restartAssessment() {
		stepperStore.goToStep(1);
	}

	// Component display logic based on current step
	$effect(() => {
		if ($currentStepIndex === lastValidatedStep) return;

		const currentStepKey = FORM_STEPS[$currentStepIndex - 1]?.title;
		if (!currentStepKey) return;

		const formValue = $form?.data;
		if (!formValue) return;

		// Prüfe, ob das Feld in der data-Struktur existiert und einen Wert hat
		let isValid = false;

		if (currentStepKey in formValue) {
			const fieldValue = formValue[currentStepKey as keyof typeof formValue];
			isValid = fieldValue !== undefined && fieldValue !== '' && fieldValue !== null;

			// Für Arrays prüfen, ob sie nicht leer sind
			if (Array.isArray(fieldValue)) {
				isValid = fieldValue.length > 0 && fieldValue.some((item: any) => item !== '');
			}
		}

		lastValidatedStep = $currentStepIndex;

		if (isValid && $stepperStore.stepValidity[$currentStepIndex] !== 'valid') {
			console.log(`🔍 Marking step ${$currentStepIndex} as valid for ${String(currentStepKey)}`);
			stepperStore.markStepValid($currentStepIndex);
		}
	});

	function handleStepChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target) {
			const newStep = parseInt(target.value, 10);
			if (newStep >= 1 && newStep <= TOTAL_STEPS) {
				debugStepNumber = newStep;
				jumpToStep(newStep);
			}
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
		return url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/+$/, '');
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
				<PageMeta totalSteps={FORM_STEPS.length} />
			</div>
		</header>
	{/if}

	<!-- Step Content -->
	<h2
		class="{$currentStepIndex !== 1
			? 'mb-6'
			: ''} text-center text-xl font-semibold text-secondary-700"
	>
		{#if $currentStepIndex === 12}
			{$i18n.schema.steps.result?.description || 'Deine Website-Analyse für'}
			{#if $form?.data?.company_url}
				{$i18n.start.meta.rating.from}
				<span class="text-primary-600">
					{formatUrl($form.data.company_url)}
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
				value={$form?.data?.visibility as any}
				options={formOptions.visibility as any}
				error={$errors?.data?.visibility}
				onSelect={(value: any) => handleImageOptionSelect('visibility', value)}
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
				errors={$errors}
				onAnalysisComplete={handleAnalysisComplete}
				onAnalysisStart={handleAnalysisStart}
				onAnalysisEnd={handleAnalysisEnd}
			/>

			<!-- Step 3: Advertising Frequency -->
		{:else if $currentStepIndex === 3}
			<ImageOption
				value={$form?.data?.advertising_frequency as any}
				options={formOptions.advertising_frequency as any}
				error={$errors?.data?.advertising_frequency}
				onSelect={(value: any) => handleImageOptionSelect('advertising_frequency', value)}
				fieldName="advertising_frequency"
				multiple={false}
			/>

			<!-- Step 4: Goals -->
		{:else if $currentStepIndex === 4}
			<ImageOption
				value={$form?.data?.goals as any}
				options={formOptions.goals as any}
				error={$errors?.data?.goals}
				onSelect={(value: any) => handleImageOptionSelect('goals', value)}
				fieldName="goals"
				multiple={false}
			/>

			<!-- Step 5: Campaign Management -->
		{:else if $currentStepIndex === 5}
			<ImageOption
				value={$form?.data?.campaign_management as any}
				options={formOptions.campaign_management as any}
				error={$errors?.data?.campaign_management}
				onSelect={(value: any) => handleImageOptionSelect('campaign_management', value)}
				fieldName="campaign_management"
				multiple={false}
			/>

			<!-- Step 6: Online Reviews -->
		{:else if $currentStepIndex === 6}
			<ImageOption
				value={$form?.data?.online_reviews as any}
				options={formOptions.online_reviews as any}
				error={$errors?.data?.online_reviews}
				onSelect={(value: any) => handleImageOptionSelect('online_reviews', value)}
				fieldName="online_reviews"
				multiple={false}
			/>

			<!-- Step 7: Previous Campaigns -->
		{:else if $currentStepIndex === 7}
			<ImageOption
				value={$form?.data?.previous_campaigns as any}
				options={formOptions.previous_campaigns as any}
				error={$errors?.data?.previous_campaigns}
				onSelect={(value: any) => handleImageOptionSelect('previous_campaigns', value)}
				fieldName="previous_campaigns"
				multiple={false}
			/>

			<!-- Step 8: Business Phase -->
		{:else if $currentStepIndex === 8}
			<ImageOption
				value={$form?.data?.business_phase as any}
				options={formOptions.business_phase as any}
				error={$errors?.data?.business_phase}
				onSelect={(value: any) => handleImageOptionSelect('business_phase', value)}
				fieldName="business_phase"
				multiple={false}
			/>

			<!-- Step 9: Implementation Time -->
		{:else if $currentStepIndex === 9}
			<ImageOption
				value={$form?.data?.implementation_time as any}
				options={formOptions.implementation_time as any}
				error={$errors?.data?.implementation_time}
				onSelect={(value: any) => handleImageOptionSelect('implementation_time', value)}
				fieldName="implementation_time"
				multiple={false}
			/>

			<!-- Step 10: Company Form -->
		{:else if $currentStepIndex === 10 && last_step}
			<ContactForm
				{form}
				errors={$errors}
				onValidation={(isValid) => {
					contactFormValid = isValid;
				}}
				{formSubmissionAttempted}
			/>

			<!-- Step 12: Results -->
		{:else if $currentStepIndex === 12 && last_step}
			<ResultsPage
				score={$calculatedScore}
				formData={$form?.data}
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
						if ($currentStepIndex === 10) {
							formSubmissionAttempted = true;
							if (contactFormValid) {
								stepperStore.markStepValid($currentStepIndex);
								stepperStore.nextStep();
							} else {
								stepperStore.markStepIncomplete($currentStepIndex);
							}
						} else if ($currentStepIndex === 2) {
							stepperStore.nextStep();
						} else {
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
