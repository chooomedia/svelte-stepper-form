<script lang="ts">
	import { fade } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms';
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Button from '$lib/components/Button.svelte';
	import ImageOption from '$lib/components/ImageOption.svelte';
	import WaitingScreen from '$lib/components/WaitingScreen.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import ResultsPage from '$lib/components/ResultsPage.svelte';
	import { scoreStore } from '$lib/utils/scoring';
	import WebsiteUrlForm from '$lib/components/WebsiteUrlForm.svelte';
	import FormTransitioner from '$lib/components/FormTransitioner.svelte';
	import { last_step, TOTAL_STEPS } from '$lib/schema';

	// Import stores
	import { stepperStore, jumpToStep } from '$lib/stores/stepperStore';
	import { formData, calculatedScore, updateFormField } from '$lib/stores/formStore';
	import { formSubmitting } from '$lib/stores/loadingStore';

	// Import schema and options
	import { FORM_STEPS, formOptions, type FormData } from '$lib/schema';

	const { data } = $props();
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

	$effect(() => {
		$formData = { ...$form };

		const unsubscribe = scoreStore.subscribe((data) => {
			scoreStoreData = data;
		});

		return unsubscribe;
	});

	// Website analysis function
	async function handleAnalysisComplete(data: any, score: number) {
		if (data) {
			// Store analysis results, update score
			updateFormField('visibility_score', score);

			// Move to next step after analysis
			setTimeout(() => {
				stepperStore.markStepValid($stepperStore.current.index);
				stepperStore.nextStep();
			}, 1000);
		}
	}

	// Function to handle image option selection
	function handleImageOptionSelect(fieldName: string, value: string) {
		updateFormField(fieldName, value);
		$form[fieldName] = value;

		// Automatically move to next step on selection
		setTimeout(() => {
			stepperStore.markStepValid($stepperStore.current.index);
			stepperStore.nextStep();
		}, 500);
	}

	// Restart assessment
	function restartAssessment() {
		stepperStore.goToStep(1);
	}

	// Component display logic based on current step
	$effect(() => {
		// Update step validation
		const currentStepKey = FORM_STEPS[$stepperStore.current.index - 1]?.title;
		const isValid = currentStepKey && $form[currentStepKey];

		if (isValid && !$stepperStore.status[$stepperStore.current.index - 1].isValid) {
			stepperStore.markStepValid($stepperStore.current.index);
		}
	});

	let debugStepNumber = $stepperStore.current.index;

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
</script>

<svelte:head>
	<title>Kostenloses Digital Marketing Assessment | Digital Pusher</title>
	<meta
		name="description"
		content="Analysiere Deine digitale Präsenz mit unserem kostenlosen Marketing-Assessment. Erhalte personalisierte Empfehlungen für mehr Online-Erfolg."
	/>
	<meta
		name="keywords"
		content="Digital Marketing Assessment, Online Marketing Analyse, Marketing Strategie, Digitale Präsenz, Marketing Beratung"
	/>
	<link rel="canonical" href="https://digitalpusher.de/assessment/" />
</svelte:head>

<div class="form-container" itemscope itemtype="https://schema.org/WebApplication">
	<header>
		<div
			class={$stepperStore.current.index > 1 ? 'sr-only' : 'text-center'}
			aria-hidden={$stepperStore.current.index > 1}
		>
			<h1 class="mb-6 text-5xl font-bold text-gray-900" itemprop="name" id="assessment-title">
				Marketing Check Quiz
			</h1>

			<p
				class="mx-auto max-w-[33rem] text-base text-gray-600"
				itemprop="description"
				id="assessment-description"
			>
				Jetzt <strong>Onlinesichtbarkeit berechnen</strong> lassen,
				<strong>Reichweite erhöhen</strong> sowie
				<strong>Ressourcen sparen</strong> und <strong>Umsätze steigern</strong>.
			</p>
			<!-- Page Meta -->
			<PageMeta totalSteps={FORM_STEPS.length} />
		</div>
	</header>

	<!-- Step Content -->
	<div class="form-wrapper">
		<!-- Dynamic step content based on current step -->
		<h2 class="mb-6 text-center text-xl font-semibold text-gray-700">
			{$stepperStore.current.description}
		</h2>
		{#key $stepperStore.current.index}
			<div transition:fade={{ duration: 500 }} class="form-card">
				<FormTransitioner currentStep={$stepperStore.current.index} minHeight="500px">
					<!-- Step 1: Visibility -->
					{#if $stepperStore.current.index === 1}
						<ImageOption
							value={$form.visibility}
							options={formOptions.visibility}
							error={$errors.visibility}
							onSelect={(value) => handleImageOptionSelect('visibility', value)}
						/>

						<!-- Step 2: Website URL -->
					{:else if $stepperStore.current.index === 2}
						<div itemprop="step" itemscope itemtype="https://schema.org/HowToStep">
							<meta itemprop="position" content="2" />
							<meta itemprop="name" content="Website Analysis" />
							<div
								itemprop="itemListElement"
								itemscope
								itemtype="https://schema.org/HowToDirection"
							>
								<WebsiteUrlForm
									{form}
									errors={$errors}
									onAnalysisComplete={handleAnalysisComplete}
									onclick={() => {
										stepperStore.markStepValid($stepperStore.current.index);
										stepperStore.nextStep();
									}}
								/>
							</div>
						</div>

						<!-- Step 3: Advertising Frequency -->
					{:else if $stepperStore.current.index === 3}
						<ImageOption
							value={$form.advertising_frequency}
							options={formOptions.advertising_frequency}
							error={$errors.advertising_frequency}
							onSelect={(value) => handleImageOptionSelect('advertising_frequency', value)}
						/>

						<!-- Step 4: Goals -->
					{:else if $stepperStore.current.index === 4}
						<ImageOption
							value={$form.goals}
							options={formOptions.goals}
							error={$errors.goals}
							onSelect={(value) => handleImageOptionSelect('goals', value)}
						/>

						<!-- Step 5: Campaign Management -->
					{:else if $stepperStore.current.index === 5}
						<ImageOption
							value={$form.campaign_management}
							options={formOptions.campaign_management}
							error={$errors.campaign_management}
							onSelect={(value) => handleImageOptionSelect('campaign_management', value)}
						/>

						<!-- Step 6: Online Reviews -->
					{:else if $stepperStore.current.index === 6}
						<ImageOption
							value={$form.online_reviews}
							options={formOptions.online_reviews}
							error={$errors.online_reviews}
							onSelect={(value) => handleImageOptionSelect('online_reviews', value)}
						/>

						<!-- Step 7: Previous Campaigns -->
					{:else if $stepperStore.current.index === 7}
						<ImageOption
							value={$form.previous_campaigns}
							options={formOptions.previous_campaigns}
							error={$errors.previous_campaigns}
							onSelect={(value) => handleImageOptionSelect('previous_campaigns', value)}
						/>

						<!-- Step 8: Business Phase -->
					{:else if $stepperStore.current.index === 8}
						<ImageOption
							value={$form.business_phase}
							options={formOptions.business_phase}
							error={$errors.business_phase}
							onSelect={(value) => handleImageOptionSelect('business_phase', value)}
						/>

						<!-- Step 9: Implementation Time -->
					{:else if $stepperStore.current.index === 9}
						<ImageOption
							value={$form.implementation_time}
							options={formOptions.implementation_time}
							error={$errors.implementation_time}
							onSelect={(value) => handleImageOptionSelect('implementation_time', value)}
						/>

						<!-- Step 10: Company Form -->
					{:else if $stepperStore.current.index === 10}
						<ContactForm
							{form}
							errors={$errors}
							onValidation={(isValid) => {
								contactFormValid = isValid;
							}}
						/>

						<!-- Step 12: Results -->
					{:else if $stepperStore.current.index === 12 && last_step}
						<ResultsPage
							score={$calculatedScore}
							formData={$formData}
							auditData={$scoreStore?.auditData || null}
							nextStep={() => stepperStore.goToStep(1)}
							{restartAssessment}
						/>
						<!-- Fallback: Loading screen -->
					{:else if $stepperStore.current.index === 11}
						<WaitingScreen
							autoAdvance={7}
							nextStep={() => {
								console.log('Moving to step 12');
								stepperStore.markStepValid($stepperStore.current.index);
								stepperStore.nextStep();
							}}
						/>
					{/if}

					<!-- Navigation Buttons (except for specific steps) -->
					{#if ![1, 3, 4, 5, 6, 7, 8, 9, 11].includes($stepperStore.current.index)}
						<div class="mt-8 flex justify-between">
							<Button
								label="Zurück"
								type="button"
								variant="secondary"
								disabled={$stepperStore.current.index === 1}
								on:click={() => stepperStore.prevStep()}
							/>

							<Button
								label="Weiter"
								type="button"
								variant="primary"
								disabled={$stepperStore.current.index === 10 && !contactFormValid}
								on:click={() => {
									stepperStore.markStepValid($stepperStore.current.index);
									stepperStore.nextStep();
								}}
							/>
						</div>
					{/if}
				</FormTransitioner>
			</div>
		{/key}
	</div>
</div>

<!-- In your template -->
{#if isDev}
	<div class="mt-8 rounded border bg-gray-100 p-4">
		<h3 class="font-semibold">🔧 Debugging-Steuerung</h3>
		<label for="jumpStep" class="mt-2 block text-sm text-gray-700">Springe zu Schritt:</label>

		<div class="flex items-center">
			<input
				id="jumpStep"
				type="number"
				min="1"
				max={TOTAL_STEPS}
				value={debugStepNumber}
				on:input={handleStepChange}
				class="w-16 rounded border p-2 text-center"
			/>

			<div class="ml-4 flex space-x-2">
				<button
					on:click={prevStep}
					class="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
					aria-label="Vorheriger Schritt"
				>
					◀
				</button>

				<button
					on:click={nextStep}
					class="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
					aria-label="Nächster Schritt"
				>
					▶
				</button>
			</div>
		</div>
	</div>
	<SuperDebug data={form} />
{/if}
