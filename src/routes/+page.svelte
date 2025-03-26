<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Button from '$lib/components/Button.svelte';
	import ImageOption from '$lib/components/ImageOption.svelte';
	import WaitingScreen from '$lib/components/WaitingScreen.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import SeoTips from '$lib/components/SeoTips.svelte';
	import ResultsPage from '$lib/components/ResultsPage.svelte';
	import { websiteLoading, formSubmitting } from '$lib/stores/loadingStore';

	import {
		setSteps,
		setCurrentStep,
		markStepValid,
		markStepInvalid,
		markStepIncomplete
	} from '$lib/stores/stepperStore';

	// Instead of local state, use the stores
	$effect(() => {
		$websiteLoading = isWebsiteLoading;
		$formSubmitting = isSubmitting;
	});

	import {
		FORM_STEPS,
		last_step,
		TOTAL_STEPS,
		formOptions,
		getFormOptionWeight
	} from '$lib/schema';

	let formSteps = FORM_STEPS;

	$effect(() => {
		setCurrentStep(currentStep);
	});

	function validateCurrentStep(step: number, formData: FormData): boolean {
		const stepData = FORM_STEPS[step - 1];
		if (!stepData) return false;

		const stepKey = stepData.title.toLowerCase() as keyof FormData;
		const currentStepData = formData[stepKey];

		if (step <= 9) {
			if (!currentStepData) {
				if (validSteps.includes(step)) {
					// Was valid, now incomplete
					markStepIncomplete(step);
					incompleteSteps = [...incompleteSteps, step].filter((v, i, a) => a.indexOf(v) === i);
					validSteps = validSteps.filter((s) => s !== step);
				} else {
					// Required but invalid
					markStepInvalid(step);
					invalidRequiredSteps = [...invalidRequiredSteps, step].filter(
						(v, i, a) => a.indexOf(v) === i
					);
				}
				return false;
			} else {
				// Valid step
				markStepValid(step);
				validSteps = [...validSteps, step].filter((v, i, a) => a.indexOf(v) === i);
				incompleteSteps = incompleteSteps.filter((s) => s !== step);
				invalidRequiredSteps = invalidRequiredSteps.filter((s) => s !== step);
				return true;
			}
		}
		return true;
	}

	onMount(() => {
		// Set up initial steps
		setSteps(formSteps);
		validateCurrentStep(currentStep, $form);

		const script = document.createElement('script');
		script.setAttribute('type', 'application/ld+json');
		script.innerHTML = JSON.stringify({
			'@context': 'https://schema.org',
			'@graph': [formSchema, breadcrumbSchema]
		});
		document.head.appendChild(script);

		// Listen for navigation events from the Stepper
		const handleNavigateToStep = (event) => {
			const targetStep = event.detail.step;
			navigateToStep(targetStep);
		};

		window.addEventListener('navigateToStep', handleNavigateToStep);

		return () => {
			window.removeEventListener('navigateToStep', handleNavigateToStep);
		};
	});

	function handleImageOptionSelect(step: number, value: string) {
		const stepData = FORM_STEPS[step - 1];
		const stepKey = stepData.title.toLowerCase();
		$form[stepKey] = value;

		if (validateCurrentStep(step, $form)) {
			markStepValid(step);
			currentStep = step + 1;
			setCurrentStep(step + 1);
		}
	}

	// Set steps when page loads
	$effect(() => {
		setCurrentStep(currentStep);
	});

	// Debug mode detection
	const isDev = import.meta.env.DEV;

	// Debug function to jump to specific steps
	interface PageData {
		form: FormData;
	}

	let { data } = $props<{ data: PageData }>();

	// State variables
	let currentStep = $state(1);
	let validSteps = $state<number[]>([]);
	let invalidRequiredSteps = $state<number[]>([]);
	let incompleteSteps = $state<number[]>([]);
	let calculatedScore = $state(0);

	// Website analysis state
	let isWebsiteLoading = $state(false);
	let isSubmitting = $state(false);
	let websiteHealthData = $state(null);
	let showSeoTips = $state(false);
	let websiteAnalysisError = $state('');

	// Prüfen, ob der aktuelle Step ein ImageOption-Step ist
	const getCurrentStepData = $derived(FORM_STEPS[currentStep - 1]);
	const getCurrentStepKey = $derived(getCurrentStepData.title.toLowerCase());

	const { form, errors, enhance, delayed } = superForm(data.form, {
		validators: zod(last_step),
		onSubmit: async ({ form, data, cancel }) => {
			// Call our custom handler
			await handleFormSubmit();
			// Cancel the default form submission
			cancel();
		}
	});

	// Website URL analysis function
	async function handleWebsiteAnalysis(url: string) {
		if (!url) return;

		// Ensure URL has proper format
		let formattedUrl = url;
		if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
			formattedUrl = 'https://' + formattedUrl;
			$form.company_url = formattedUrl;
		}

		isWebsiteLoading = true;
		showSeoTips = true;
		websiteAnalysisError = '';

		try {
			// Call the webhook
			const formattedUrl = $form.company_url.trim().endsWith('/')
				? $form.company_url.trim().slice(0, -1)
				: $form.company_url.trim();

			const encodedUrl = encodeURIComponent(formattedUrl);

			const response = await fetch(
				`https://n8n.chooomedia.com/webhook/websitehealth?url=${encodedUrl}`
			);

			if (!response.ok) {
				throw new Error(`API error: ${response.status}`);
			}

			const data = await response.json();
			websiteHealthData = data;
			console.log('Website analysis data:', data);

			// Calculate score based on the response data
			let overallScore = 10; // Default score

			// Extract overall_score from response if available
			if (data && Array.isArray(data) && data.length > 0) {
				const scoreObject = data.find((item) => 'overall_score' in item);
				if (scoreObject && typeof scoreObject.overall_score === 'number') {
					overallScore = scoreObject.overall_score;
				}
			}

			// Update the form with the score
			$form.visibility_score = overallScore;
			calculatedScore = overallScore;

			// Add to valid steps and move forward
			if (!validSteps.includes(2)) {
				validSteps = [...validSteps, 2];
			}
		} catch (error) {
			console.error('Website analysis failed:', error);
			websiteAnalysisError = 'Analyse fehlgeschlagen. Bitte manuell fortfahren.';
			$form.visibility_score = calculateVisibilityScore($form);
			currentStep = 3;

			// Still consider the step completed
			if (!validSteps.includes(2)) {
				validSteps = [...validSteps, 2];
			}

			setTimeout(() => {
				currentStep = 3;
			}, 2000);
		} finally {
			isWebsiteLoading = false;
			markStepValid($form.step);
			currentStep = $form.step + 1;
			setCurrentStep($form.step + 1);

			// Keep SEO tips visible for a moment
			setTimeout(() => {
				showSeoTips = false;
			}, 2000);
		}

		function getFallbackMetrics(score: number): Metric[] {
			return [
				{ label: 'SEO', value: score * 0.9, color: '#4CAF50', category: 'lighthouse' }
				// ... other metrics ...
			].map((m) => ({ ...m, value: Math.min(Math.max(m.value, 0), 100) }));
		}
	}

	function previousStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	function getButtonLabel() {
		if (delayed) return 'Speichere...';
		return currentStep < TOTAL_STEPS ? 'Weiter' : 'Versenden';
	}

	function calculateVisibilityScore(formData: FormData): number {
		if (!formData) return 0;

		const relevantFields: (keyof typeof formOptions)[] = [
			'visibility',
			'advertising_frequency',
			'goals',
			'campaign_management',
			'online_reviews',
			'previous_campaigns',
			'business_phase',
			'implementation_time'
		];

		let totalWeight = 0;
		let count = 0;

		for (const field of relevantFields) {
			const value = formData[field]; // String aus dem Formular
			if (typeof value === 'string' && value.trim() !== '') {
				const weight = getFormOptionWeight(field, value);
				console.log(`Feld: ${field}, Wert: ${value}, Gewicht: ${weight}`);
				totalWeight += weight;
				count++;
			}
		}

		if (count === 0) return 0; // Falls nichts ausgefüllt wurde

		const finalScore = Math.round((totalWeight / count) * 10); // Gewichtung auf 100 skalieren
		console.log(`📊 Endgültiger Sichtbarkeits-Score: ${finalScore}`);
		return finalScore;
	}

	// Function to handle final form submission
	async function handleFormSubmit() {
		// Calculate the score based on form values if not set from website analysis

		calculatedScore = calculateFinalScore($form.visibility_score, $form);
		$form.visibility_score = calculatedScore;
		try {
			// Prepare data to send to the webhook
			const submissionData = {
				...$form,
				websiteHealth: websiteHealthData
			};

			console.log('Submitting form data:', submissionData);

			// Send data to the final webhook
			const response = await fetch('https://n8n.chooomedia.com/webhook/websitehealth__done', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(submissionData)
			});

			if (!response.ok) {
				throw new Error('Failed to submit form data');
			}

			// Process to waiting screen
			currentStep = 11;
		} catch (error) {
			console.error('Error submitting form:', error);
			alert(
				'Es gab ein Problem beim Absenden des Formulars. Bitte versuchen Sie es später erneut.'
			);
		}
	}

	// In +page.svelte, add this function for better score calculation
	function calculateFinalScore(websiteScore: any, formData: any) {
		// Use website score if available, with a weight of 70%
		if (websiteScore && websiteScore > 0) {
			const formScore = calculateVisibilityScore(formData);
			return Math.round(websiteScore * 0.7 + formScore * 0.3);
		}
		// Fall back to just form-based score
		return calculateVisibilityScore(formData);
	}

	// Schema for SEO
	const formSchema = {
		'@type': 'Service',
		'@id': 'https://digitalpusher.de/assessment/#service',
		name: 'Digital Marketing Assessment',
		description:
			'Kostenlose Analyse Deiner digitalen Marketing-Präsenz mit personalisierten Empfehlungen',
		provider: {
			'@id': 'https://digitalpusher.de/#organization'
		},
		areaServed: 'DE',
		serviceType: 'Digital Marketing Analysis'
	};

	// Schema für die BreadcrumbList
	const breadcrumbSchema = {
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				item: {
					'@id': 'https://digitalpusher.de/',
					name: 'Home'
				}
			},
			{
				'@type': 'ListItem',
				position: 2,
				item: {
					'@id': 'https://digitalpusher.de/assessment/',
					name: 'Marketing Assessment'
				}
			}
		]
	};
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

<!-- Breadcrumb Navigation für SEO -->
<div class="p-lg-2 sr-only mx-auto mb-8 max-w-4xl">
	<nav aria-label="Breadcrumb" class="mb-4">
		<ol class="flex text-sm text-gray-500" itemscope itemtype="https://schema.org/BreadcrumbList">
			<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
				<a href="/" itemprop="item" class="hover:text-gray-700">
					<span itemprop="name">Home</span>
				</a>
				<meta itemprop="position" content="1" />
			</li>
			<li class="mx-2">/</li>
			<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
				<span itemprop="name" class="text-gray-900">Marketing Assessment</span>
				<meta itemprop="position" content="2" />
			</li>
		</ol>
	</nav>
</div>

<div class="p-lg-4 mx-auto mb-8" itemscope itemtype="https://schema.org/Service">
	<!-- Updated header with different visibility conditions for each section -->
	<header class="my-4 text-center {currentStep >= 11 ? 'sr-only' : ''}">
		<div class={currentStep > 1 ? 'sr-only' : ''}>
			<h1 class="mb-6 text-5xl font-bold text-gray-900" itemprop="name">Marketing Check Quiz</h1>
			<p class="mx-auto max-w-[33rem] text-base text-gray-600" itemprop="description">
				Jetzt <strong>Onlinesichtbarkeit berechnen</strong> lassen,
				<strong>Reichweite erhöhen</strong> sowie
				<strong>Ressourcen sparen</strong> und <strong>Umsätze steigern</strong>.
			</p>
			<PageMeta />
		</div>

		{#if currentStep !== 1}
			<main class="w-full"></main>
		{/if}
	</header>

	<form
		id="multistep_form"
		method="POST"
		action="?/new"
		use:enhance
		class="space-y-6"
		aria-label="Multi-step form"
	>
		<div class="relative">
			{#key currentStep}
				<section
					class="form-wrapper space-y-4"
					aria-labelledby={`step-${currentStep}-heading`}
					in:fade={{ duration: 550, delay: 550 }}
					out:fade={{ duration: 550 }}
				>
					<h2
						class="mb-6 text-center {currentStep !== 1
							? 'text-4xl font-bold text-gray-800'
							: 'font-base text-base text-gray-500'}"
						itemprop="question"
					>
						{currentStep === 12
							? 'Deine Onlinemarketing Bewertung'
							: currentStep === 11
								? 'Deine Daten werden verarbeitet...'
								: `${FORM_STEPS[currentStep - 1].description}`}
					</h2>
					{#if currentStep === 1}
						<div class="form-card">
							<ImageOption
								name="visibility"
								bind:value={$form.visibility}
								options={structuredClone(formOptions.visibility)}
								error={$errors.visibility ? $errors.visibility[0] : undefined}
								onSelect={(value) => handleImageOptionSelect(currentStep, value)}
							/>
						</div>
					{:else if currentStep === 2}
						<div class="form-card">
							<!-- Website URL Form Component -->
							<div class="space-y-4">
								<p class="text-gray-600">
									Gib die URL Deiner Website ein, um eine sofortige SEO-Analyse zu erhalten.
								</p>

								<div class="form-group">
									<label for="company_url" class="form-label">Website URL</label>
									<div class="flex space-x-2">
										<input
											type="url"
											id="company_url"
											bind:value={$form.company_url}
											class="input-field flex-grow {$errors.company_url ? 'error' : ''}"
											placeholder="https://www.deinewebseite.com"
											disabled={isWebsiteLoading}
										/>
										<button
											type="button"
											class="btn btn-primary"
											disabled={isWebsiteLoading || !$form.company_url}
											on:click={() => handleWebsiteAnalysis($form.company_url)}
										>
											{#if isWebsiteLoading}
												<span class="loading loading-spinner loading-sm"></span>
												Analysiere...
											{:else}
												Analysieren
											{/if}
										</button>
									</div>
									{#if $errors.company_url}
										<p class="error-text" id="company_url-error" role="alert">
											{$errors.company_url[0]}
										</p>
									{/if}
									{#if websiteAnalysisError}
										<p class="mt-2 text-sm text-red-600" role="alert">
											{websiteAnalysisError}
										</p>
									{/if}
									{#if !$errors.company_url && $form.company_url && !isWebsiteLoading && !websiteAnalysisError}
										<p class="mt-1 text-sm text-gray-500" id="company_url-description">
											Klicke auf "Analysieren", um Deine Website zu prüfen
										</p>
									{/if}
								</div>

								{#if showSeoTips}
									<div transition:fade={{ duration: 300 }}>
										<SeoTips />
									</div>
								{/if}
							</div>
						</div>
					{:else if currentStep === 3}
						<div class="form-card">
							<ImageOption
								name="advertising_frequency"
								bind:value={$form.advertising_frequency}
								options={formOptions.advertising_frequency}
								error={$errors[getCurrentStepKey]?.[0]}
								onSelect={(value) => handleImageOptionSelect(currentStep, value)}
							/>
						</div>
					{:else if currentStep === 4}
						<div class="form-card">
							<ImageOption
								name="goals"
								bind:value={$form.goals}
								options={formOptions.goals}
								error={$errors[getCurrentStepKey]?.[0]}
								onSelect={(value) => handleImageOptionSelect(currentStep, value)}
							/>
						</div>
					{:else if currentStep === 5}
						<div class="form-card">
							<ImageOption
								name="campaign_management"
								bind:value={$form.campaign_management}
								options={formOptions.campaign_management}
								error={$errors[getCurrentStepKey]?.[0]}
								onSelect={(value) => handleImageOptionSelect(currentStep, value)}
							/>
						</div>
					{:else if currentStep === 6}
						<div class="form-card">
							<ImageOption
								name="online_reviews"
								bind:value={$form.online_reviews}
								options={formOptions.online_reviews}
								error={$errors[getCurrentStepKey]?.[0]}
								onSelect={(value) => handleImageOptionSelect(currentStep, value)}
							/>
						</div>
					{:else if currentStep === 7}
						<div>
							<ImageOption
								name="previous_campaigns"
								bind:value={$form.previous_campaigns}
								options={formOptions.previous_campaigns}
								error={$errors[getCurrentStepKey]?.[0]}
								onSelect={(value) => handleImageOptionSelect(currentStep, value)}
							/>
						</div>
					{:else if currentStep === 8}
						<div class="form-card">
							<ImageOption
								name="business_phase"
								bind:value={$form.business_phase}
								options={formOptions.business_phase}
								error={$errors[getCurrentStepKey]?.[0]}
								onSelect={(value) => handleImageOptionSelect(currentStep, value)}
							/>
						</div>
					{:else if currentStep === 9}
						<div class="form-card">
							<ImageOption
								name="implementation_time"
								bind:value={$form.implementation_time}
								options={formOptions.implementation_time}
								error={$errors[getCurrentStepKey]?.[0]}
								onSelect={(value) => handleImageOptionSelect(currentStep, value)}
							/>
						</div>
					{:else if currentStep === 10}
						<div class="form-card">
							<div class="space-y-4">
								<ContactForm {form} {errors} />
							</div>
						</div>
					{:else if currentStep === 11}
						<div class="form-card">
							<WaitingScreen
								autoAdvance={7}
								nextStep={() => {
									setTimeout(() => {
										currentStep = 12;
									}, 500);
								}}
							/>
						</div>
					{:else if currentStep === 12}
						<div class="form-card">
							<ResultsPage score={$form.visibility_score || calculatedScore} formData={$form} />
						</div>
					{/if}
				</section>

				{#if currentStep === 2}
					<!-- Manual navigation buttons for WebsiteUrl step -->
					<div
						class="flex items-center justify-between space-x-4 pt-6"
						role="navigation"
						aria-label="Form navigation"
					>
						<Button
							label="Zurück"
							variant="outline"
							on:click={previousStep}
							aria-label={`Zurück zu Schritt ${currentStep - 1}`}
						/>

						<Button
							label="Überspringen"
							variant="primary"
							on:click={() => {
								if (!validSteps.includes(2)) {
									validSteps = [...validSteps, 2];
								}
								currentStep = 3;
							}}
							aria-label="Diesen Schritt überspringen"
						/>
					</div>
				{:else if currentStep === 10 || currentStep === 11}
					<!-- Navigation buttons for company/contact info steps -->
					<div
						class="flex items-center justify-between space-x-4 pt-6"
						role="navigation"
						aria-label="Form navigation"
					>
						<Button
							label="Zurück"
							variant="outline"
							on:click={previousStep}
							aria-label={`Zurück zu Schritt ${currentStep - 1}`}
						/>

						<Button
							type={currentStep === 11 ? 'submit' : 'button'}
							variant="primary"
							disabled={$delayed}
							label={getButtonLabel()}
							on:click={() => {
								if (currentStep === 10) {
									// Validate fields before moving on
									if ($form.company_name && $form.company_url) {
										if (!validSteps.includes(10)) {
											validSteps = [...validSteps, 10];
										}
										currentStep = 11;
									}
								}
							}}
							aria-label={currentStep === 11
								? 'Formular absenden'
								: `Weiter zu Schritt ${currentStep + 1}`}
						/>
					</div>
				{/if}
			{/key}
		</div>
	</form>
</div>

{#if isDev}
	<div class="my-10">
		<div class="mb-3 mt-8 rounded-lg bg-[#1e293b26] p-4" style="border:1px solid #999999">
			<div
				class="flex flex-row justify-between"
				style="font-family: Inconsolata, Monaco, Consolas, 'Lucida Console', 'Courier New', Courier, monospace;"
			>
				<div class="flex flex-col">
					<h3 class="font-semibold">🔧 Debugging-Steuerung</h3>
					<label for="jumpStep" class="block text-sm text-gray-700">Springe zu Schritt:</label>
				</div>
				<input
					id="jumpStep"
					type="number"
					min="1"
					max={TOTAL_STEPS}
					bind:value={currentStep}
					style="border:1px solid #1e293bb0;"
					class="w-16 rounded bg-[#1e293b] p-2 text-center text-[#eab308]"
				/>
			</div>
		</div>
		<SuperDebug data={$form} />
	</div>
{/if}
