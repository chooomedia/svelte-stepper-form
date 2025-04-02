<!-- src/routes/+page.svelte - Improved version -->
<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Button from '$lib/components/Button.svelte';
	import ImageOption from '$lib/components/ImageOption.svelte';
	import WaitingScreen from '$lib/components/WaitingScreen.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import ResultsPage from '$lib/components/ResultsPage.svelte';
	import WebsiteUrlForm from '$lib/components/WebsiteUrlForm.svelte';
	import FormTransitioner from '$lib/components/FormTransitioner.svelte';
	import { FORM_STEPS, TOTAL_STEPS } from '$lib/schema';
	import { i18n } from '$lib/i18n';
	import { browser } from '$app/environment';

	// Import stores
	import { stepperStore, jumpToStep } from '$lib/stores/stepperStore';
	import { formStore, calculatedScore } from '$lib/stores/formStore';
	import { formSubmitting } from '$lib/stores/loadingStore';
	import { scoreStore } from '$lib/utils/scoring';

	// Import schema and options
	import { formOptions, type FormData } from '$lib/schema';

	// Props
	const { data } = $props();

	// Is in development mode?
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

	// State management
	let contactFormValid = $state(false);
	let showDebugSidebar = $state(false);
	let isWebsiteAnalysisInProgress = $state(false);
	let debugStepNumber = $state($stepperStore.current.index);

	// Subscribe to form and sync with formStore
	$effect(() => {
		formStore.updateFields($form);
	});

	// Analysis event handlers
	function handleAnalysisStart() {
		isWebsiteAnalysisInProgress = true;
	}

	function handleAnalysisEnd() {
		isWebsiteAnalysisInProgress = false;
	}

	function handleAnalysisComplete(data: any, score: number) {
		if (data) {
			// Update form store with results
			formStore.updateField('visibility_score', score);

			// Navigate to next step after a short delay
			setTimeout(() => {
				stepperStore.markStepValid($stepperStore.current.index);
				stepperStore.nextStep();
			}, 1000);
		}
	}

	// Image option navigation handler
	function handleImageOptionNavigation(
		event: CustomEvent<{ fieldName: string; values: string[] }>
	) {
		const { fieldName, values } = event.detail;

		// Update form data
		formStore.updateField(fieldName, values);
		$form[fieldName] = values;

		// Navigate to next step
		stepperStore.markStepValid($stepperStore.current.index);
		stepperStore.nextStep();
	}

	// Handle selection of an image option
	function handleImageOptionSelect(fieldName: string, value: string | string[]) {
		// Update form data
		formStore.updateField(fieldName, value);
		$form[fieldName] = value;

		// For single selection, auto-advance
		if (!Array.isArray(value)) {
			setTimeout(() => {
				stepperStore.markStepValid($stepperStore.current.index);
				stepperStore.nextStep();
			}, 500);
		}
	}

	// Restart assessment
	function restartAssessment() {
		stepperStore.goToStep(1);
		formStore.reset();
	}

	// Debug controls
	function handleStepChange(event: Event) {
		const newStep = parseInt((event.target as HTMLInputElement).value, 10);
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

	function toggleDebugSidebar() {
		showDebugSidebar = !showDebugSidebar;
	}
</script>

<div
	class="form-container relative mx-auto w-full"
	itemscope
	itemtype="https://schema.org/WebApplication"
>
	<header>
		<div
			class={$stepperStore.current.index > 1 ? 'sr-only' : 'text-center'}
			aria-hidden={$stepperStore.current.index > 1}
		>
			<h1 class="mb-6 text-5xl font-bold text-secondary-900" itemprop="name" id="assessment-title">
				{$i18n.start.title}
			</h1>

			<p
				class="mx-auto max-w-[33rem] text-base text-secondary-300"
				itemprop="description"
				id="assessment-description"
			>
				{@html $i18n.start.text}
			</p>

			<!-- Page Meta Information -->
			<PageMeta totalSteps={FORM_STEPS.length} />
		</div>
	</header>

	<!-- Dynamic Form Content -->
	<div class="form-wrapper">
		<!-- Step Title Header -->
		<h2 class="mb-4 text-center text-xl font-semibold text-secondary-700">
			{#if $stepperStore.current.index === TOTAL_STEPS}
				<!-- Title for results step -->
				{$i18n.schema.steps.result.description}
				{#if $formStore.formData?.company_url}
					{$i18n.start.meta.rating.from}
					<span class="text-primary-600">
						{$formStore.formData.company_url.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
					</span>
				{/if}
			{:else}
				<!-- Title for regular steps -->
				{$i18n.schema.steps[$stepperStore.current.title]?.description ||
					$stepperStore.current.description}
			{/if}
		</h2>

		{#key $stepperStore.current.index}
			<div transition:fade={{ duration: 500 }} class="form-card">
				<FormTransitioner currentStep={$stepperStore.current.index} height="40vh">
					<!-- Dynamic step content based on current step index -->
					{#if $stepperStore.current.index === 1}
						<!-- Step 1: Visibility -->
						<ImageOption
							value={$form.visibility}
							options={formOptions.visibility}
							error={$errors.visibility}
							onSelect={(value) => handleImageOptionSelect('visibility', value)}
							on:navigate={handleImageOptionNavigation}
							fieldName="visibility"
							multiple={true}
							maxSelections={4}
						/>
					{:else if $stepperStore.current.index === 2}
						<!-- Step 2: Website URL Analysis -->
						<WebsiteUrlForm
							{form}
							error={$errors}
							onAnalysisComplete={handleAnalysisComplete}
							onAnalysisStart={handleAnalysisStart}
							onAnalysisEnd={handleAnalysisEnd}
						/>
					{:else if $stepperStore.current.index === 3}
						<!-- Step 3: Advertising Frequency -->
						<ImageOption
							value={$form.advertising_frequency}
							options={formOptions.advertising_frequency}
							error={$errors.advertising_frequency}
							onSelect={(value) => handleImageOptionSelect('advertising_frequency', value)}
							fieldName="advertising_frequency"
							multiple={false}
						/>
						<!-- Continue for steps 4-12... -->

						<!-- Step 10: Contact Form -->
					{:else if $stepperStore.current.index === 10}
						<ContactForm
							{form}
							error={$errors}
							onValidation={(isValid) => {
								contactFormValid = isValid;
								if (isValid) {
									stepperStore.markStepValid($stepperStore.current.index);
								} else {
									stepperStore.markStepIncomplete($stepperStore.current.index);
								}
							}}
						/>
						<!-- Step 11: Waiting Screen -->
					{:else if $stepperStore.current.index === 11}
						<WaitingScreen
							autoAdvance={7}
							nextStep={() => {
								stepperStore.markStepValid($stepperStore.current.index);
								stepperStore.nextStep();
							}}
						/>
						<!-- Step 12: Results Page -->
					{:else if $stepperStore.current.index === 12}
						<ResultsPage
							score={$calculatedScore}
							formData={$formStore.formData}
							auditData={$scoreStore.auditData}
							nextStep={() => stepperStore.goToStep(1)}
							{restartAssessment}
						/>
					{/if}

					<!-- Navigation Buttons -->
					{#if ![1, 3, 4, 5, 6, 7, 8, 9, 11, 12].includes($stepperStore.current.index)}
						<div class="mt-8 flex justify-between">
							<Button
								label={$i18n.common.back}
								variant="outline"
								disabled={$stepperStore.current.index === 1}
								onClick={() => stepperStore.prevStep()}
							/>

							<Button
								label={$stepperStore.current.index === 2 ? 'Überspringen' : $i18n.common.next}
								variant="primary"
								disabled={($stepperStore.current.index === 10 && !contactFormValid) ||
									($stepperStore.current.index === 2 && isWebsiteAnalysisInProgress)}
								onClick={() => {
									if ($stepperStore.current.index === 10) {
										if (contactFormValid) {
											stepperStore.markStepValid($stepperStore.current.index);
											stepperStore.nextStep();
										} else {
											stepperStore.markStepIncomplete($stepperStore.current.index);
										}
									} else if ($stepperStore.current.index === 2) {
										stepperStore.nextStep();
									} else {
										stepperStore.markStepValid($stepperStore.current.index);
										stepperStore.nextStep();
									}
								}}
							/>
						</div>
					{/if}
				</FormTransitioner>
			</div>
		{/key}
	</div>
</div>

<!-- Debug Panel (dev mode only) -->
{#if isDev}
	<button
		class="fixed left-4 top-4 z-50 rounded-full bg-gray-800 p-2 text-white shadow-lg hover:bg-gray-700"
		on:click={toggleDebugSidebar}
		aria-label="Toggle Debug Panel"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6">
			<path
				fill="currentColor"
				d="M4.6 15c-.9-2.6-.6-4.6-.5-5.4 2.4-1.5 5.3-2 8-1.3.7-.3 1.5-.5 2.3-.6-.1-.3-.2-.5-.3-.8h2l1.2-3.2-.9-.4-1 2.6h-1.8C13 4.8 12.1 4 11.1 3.4l2.1-2.1-.7-.7L10.1 3c-.7 0-1.5 0-2.3.1L5.4.7l-.7.7 2.1 2.1C5.7 4.1 4.9 4.9 4.3 6H2.5l-1-2.6-.9.4L1.8 7h2C3.3 8.3 3 9.6 3 11H1v1h2c0 1 .2 2 .5 3H1.8L.6 18.3l.9.3 1-2.7h1.4c.4.8 2.1 4.5 5.8 3.9-.3-.2-.5-.5-.7-.8-2.9 0-4.4-3.5-4.4-4zM9 3.9c2 0 3.7 1.6 4.4 3.8-2.9-1-6.2-.8-9 .6.7-2.6 2.5-4.4 4.6-4.4zm14.8 19.2l-4.3-4.3c2.1-2.5 1.8-6.3-.7-8.4s-6.3-1.8-8.4.7-1.8 6.3.7 8.4c2.2 1.9 5.4 1.9 7.7 0l4.3 4.3c.2.2.5.2.7 0 .2-.2.2-.5 0-.7zm-8.8-3c-2.8 0-5.1-2.3-5.1-5.1s2.3-5.1 5.1-5.1 5.1 2.3 5.1 5.1-2.3 5.1-5.1 5.1z"
			/>
			<path fill="none" d="M0 0h24v24H0z" />
		</svg>
	</button>

	{#if showDebugSidebar}
		<div
			class="fixed left-0 top-0 h-full w-80 overflow-y-auto bg-gray-100 p-4 shadow-2xl transition-transform duration-300"
			style="transform: translateX({showDebugSidebar ? '0' : '100%'});"
			transition:slide={{ duration: 300, axis: 'x' }}
		>
			<div class="flex items-center justify-between border-b border-gray-300 py-1">
				<h3 class="ml-12 text-lg font-semibold text-gray-800">Debug Panel</h3>
				<button
					class="rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
					on:click={toggleDebugSidebar}
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
				<label for="jumpStep" class="block text-sm font-medium text-gray-700">Jump to Step:</label>
				<div class="mt-2 flex items-center">
					<input
						id="jumpStep"
						type="number"
						min="1"
						max={TOTAL_STEPS}
						value={$stepperStore.current.index}
						on:input={handleStepChange}
						class="w-16 rounded border border-gray-300 p-2 text-center shadow-sm"
					/>

					<div class="ml-2 flex space-x-2">
						<button
							on:click={prevStep}
							class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
							aria-label="Previous Step"
							disabled={debugStepNumber <= 1}
						>
							◀
						</button>

						<button
							on:click={nextStep}
							class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
							aria-label="Next Step"
							disabled={debugStepNumber >= TOTAL_STEPS}
						>
							▶
						</button>
					</div>
				</div>
			</div>

			<div class="mt-6">
				<h4 class="mb-2 font-medium text-gray-700">
					Current Step: {$stepperStore.current.index}
				</h4>
				<div class="rounded bg-gray-200 p-2">
					<p class="text-sm">{$stepperStore.current.description || 'No description'}</p>
				</div>
			</div>

			<div class="mt-6">
				<h4 class="mb-2 font-medium text-gray-700">Form Data</h4>
				<div class="rounded border border-gray-300 bg-white p-3">
					<pre class="max-h-40 overflow-auto text-xs">
              {JSON.stringify($formStore.formData, null, 2)}
            </pre>
				</div>
			</div>

			<div class="mt-4">
				<h4 class="mb-2 font-medium text-gray-700">Score Data</h4>
				<div class="rounded border border-gray-300 bg-white p-3">
					<p class="text-xs">Calculated Score: {$calculatedScore}</p>
					<p class="text-xs">Form Score: {$scoreStore ? $scoreStore.formScore : 'N/A'}</p>
					<p class="text-xs">Website Score: {$scoreStore ? $scoreStore.websiteScore : 'N/A'}</p>
				</div>
			</div>

			<div class="mt-4">
				<h4 class="mb-2 font-medium text-gray-700">Step Status</h4>
				<div class="rounded border border-gray-300 bg-white p-3 text-xs">
					<ul class="space-y-1">
						{#each $stepperStore.status as status}
							<li class="flex justify-between">
								<span>Step {status.index}</span>
								<span
									class={status.isValid
										? 'text-green-600'
										: status.isInvalid
											? 'text-red-600'
											: status.isIncomplete
												? 'text-orange-500'
												: status.isCurrent
													? 'font-bold text-blue-600'
													: 'text-gray-500'}
								>
									{status.isValid
										? 'Valid'
										: status.isInvalid
											? 'Invalid'
											: status.isIncomplete
												? 'Incomplete'
												: status.isCurrent
													? 'Current'
													: 'Untouched'}
								</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	{/if}
{/if}
