<script lang="ts">
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { page } from '$app/stores';

	import Stepper from '$lib/components/Stepper.svelte';
	import Button from '$lib/components/Button.svelte';
	import ImageOption from '$lib/components/ImageOption.svelte';
	import VisibilityScore from '$lib/components/VisibilityScore.svelte';
	import WaitingScreen from '$lib/components/WaitingScreen.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';

	import {
		step_1,
		step_2,
		step_3,
		step_4,
		step_5,
		step_6,
		step_7,
		step_8,
		step_9,
		last_step,
		type FormData,
		type StepSchema,
		FORM_STEPS,
		formOptions,
		TOTAL_STEPS
	} from '$lib/schema';

	interface PageData {
		form: FormData;
	}

	let { data } = $props<{ data: PageData }>();

	let currentStep = $state(1);
	let validSteps = $state<number[]>([]);
	let calculatedScore = $state(0);

	const stepSchemas = [
		step_1,
		step_2,
		step_3,
		step_4,
		step_5,
		step_6,
		step_7,
		step_8,
		step_9,
		last_step
	];

	const { form, errors, enhance, delayed, validateForm, options } = superForm(data.form, {
		dataType: 'json',
		validators: zod(stepSchemas[currentStep - 1]),
		taintedMessage: 'The data you have entered will be lost. Are you sure you want to leave?',
		onSubmit: async ({ cancel }) => {
			const result = await validateForm();

			if (!result.valid) {
				cancel();
				return;
			}

			validSteps = [...validSteps, currentStep];
			if (currentStep < TOTAL_STEPS) {
				// If it's the last step (contact form), trigger calculation
				if (currentStep === TOTAL_STEPS - 1) {
					cancel();
					currentStep = currentStep + 1;
					options.validators = zod(stepSchemas[currentStep - 1]);
				} else {
					calculatedScore = calculateVisibilityScore($form);
					cancel();
					currentStep = currentStep + 1; // Move to step 11
				}
			}
		},
		onUpdate: async ({ result }) => {
			if (result.type === 'success') {
				validSteps = [];
				currentStep = 1;
			}
		},
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				document.scrollingElement?.scrollTo({
					top: 0,
					behavior: 'smooth'
				});
			}
		}
	});

	function handleStepChange(step: number): void {
		if (step <= Math.max(...validSteps, currentStep)) {
			currentStep = step;
			options.validators = zod(stepSchemas[currentStep - 1]);
		}
	}

	function previousStep(): void {
		if (currentStep > 1) {
			currentStep = currentStep - 1;
			options.validators = zod(stepSchemas[currentStep - 1]);
		}
	}

	function calculateVisibilityScore(formData: FormData): number {
		// This is a placeholder - you'll want to implement actual scoring logic
		// based on the weights in your schema.ts
		const scores = [
			formData.visibility,
			formData.advertising_frequency,
			formData.goals,
			formData.campaign_management,
			formData.online_reviews,
			formData.previous_campaigns,
			formData.business_phase,
			formData.implementation_time
		].map((value) => {
			// Find the corresponding option and its weight
			const option = formOptions[value];
			return option?.weight || 0;
		});

		// Calculate average score
		const totalScore = scores.reduce((sum, score) => sum + score, 0);
		return Math.round((totalScore / scores.length) * 100);
	}

	const getCurrentStepData = $derived(FORM_STEPS[currentStep - 1]);
	const getCurrentStepKey = $derived(getCurrentStepData.title.toLowerCase());

	const getButtonLabel = () => {
		if ($delayed) return 'Speichere...';
		if (currentStep < TOTAL_STEPS) return 'Weiter';
		return 'Versenden';
	};

	// Schema für den Form-Prozess
	const formSchema = {
		'@type': 'Service',
		'@id': 'https://digitalpusher.de/assessment/#service',
		name: 'Digital Marketing Assessment',
		description:
			'Kostenlose Analyse Ihrer digitalen Marketing-Präsenz mit personalisierten Empfehlungen',
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

	onMount(() => {
		// Schema Markup für die Seite hinzufügen
		const script = document.createElement('script');
		script.setAttribute('type', 'application/ld+json');
		script.innerHTML = JSON.stringify({
			'@context': 'https://schema.org',
			'@graph': [formSchema, breadcrumbSchema]
		});
		document.head.appendChild(script);
	});
</script>

<svelte:head>
	<title>Kostenloses Digital Marketing Assessment | Digital Pusher</title>
	<meta
		name="description"
		content="Analysieren Sie Ihre digitale Präsenz mit unserem kostenlosen Marketing-Assessment. Erhalten Sie personalisierte Empfehlungen für mehr Online-Erfolg."
	/>
	<meta
		name="keywords"
		content="Digital Marketing Assessment, Online Marketing Analyse, Marketing Strategie, Digitale Präsenz, Marketing Beratung"
	/>
	<link rel="canonical" href="https://digitalpusher.de/assessment/" />
</svelte:head>

<!-- Breadcrumb Navigation für SEO -->
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

<div class="p-lg-4 mx-auto mb-8 max-w-4xl" itemscope itemtype="https://schema.org/Service">
	<header class="mb-8">
		<h1 class="mb-6 text-3xl font-bold text-gray-900" itemprop="name">
			Digital Marketing Assessment
		</h1>
		<p class="text-lg text-gray-600" itemprop="description">
			Ermitteln Sie Ihren digitalen Marketing-Score und erhalten Sie personalisierte Empfehlungen
			für Ihr Unternehmen.
		</p>

		<main class="mt-8 w-full">
			<Stepper steps={FORM_STEPS} {currentStep} {validSteps} on:change={handleStepChange} />
		</main>
	</header>

	<form
		id="multistep_form"
		method="POST"
		action="?/new"
		use:enhance
		class="space-y-6"
		aria-label="Multi-step form"
	>
		<section class="space-y-4" aria-labelledby={`step-${currentStep}-heading`}>
			<h2 id={`step-${currentStep}-heading`} class="text-xl font-semibold text-gray-900">
				{getCurrentStepData.description}
			</h2>

			{#if currentStep <= 8}
				{#if currentStep === 1}
					<div in:slide out:slide>
						<ImageOption
							name="visibility"
							bind:value={$form.visibility}
							options={formOptions.visibility}
							error={$errors.visibility}
							onSelect={() => handleStepChange(2)}
						/>
					</div>
				{:else if currentStep === 2}
					<div in:slide out:slide>
						<ImageOption
							name="advertising_frequency"
							bind:value={$form.advertising_frequency}
							options={formOptions.advertising_frequency}
							error={$errors.advertising_frequency}
							onSelect={() => handleStepChange(3)}
						/>
					</div>
				{:else if currentStep === 3}
					<div in:slide out:slide>
						<ImageOption
							name="goals"
							bind:value={$form.goals}
							options={formOptions.goals}
							error={$errors.goals}
							onSelect={() => handleStepChange(4)}
						/>
					</div>
				{:else if currentStep === 4}
					<div in:slide out:slide>
						<ImageOption
							name="campaign_management"
							bind:value={$form.campaign_management}
							options={formOptions.campaign_management}
							error={$errors.campaign_management}
							onSelect={() => handleStepChange(5)}
						/>
					</div>
				{:else if currentStep === 5}
					<div in:slide out:slide>
						<ImageOption
							name="online_reviews"
							bind:value={$form.online_reviews}
							options={formOptions.online_reviews}
							error={$errors.online_reviews}
							onSelect={() => handleStepChange(6)}
						/>
					</div>
				{:else if currentStep === 6}
					<div in:slide out:slide>
						<ImageOption
							name="previous_campaigns"
							bind:value={$form.previous_campaigns}
							options={formOptions.previous_campaigns}
							error={$errors.previous_campaigns}
							onSelect={() => handleStepChange(7)}
						/>
					</div>
				{:else if currentStep === 7}
					<div in:slide out:slide>
						<ImageOption
							name="business_phase"
							bind:value={$form.business_phase}
							options={formOptions.business_phase}
							error={$errors.business_phase}
							onSelect={() => handleStepChange(8)}
						/>
					</div>
				{:else if currentStep === 8}
					<div in:slide out:slide>
						<ImageOption
							name="implementation_time"
							bind:value={$form.implementation_time}
							options={formOptions.implementation_time}
							error={$errors.implementation_time}
							onSelect={() => handleStepChange(9)}
						/>
					</div>
				{/if}
			{:else if currentStep === 9}
				<div in:slide out:slide>
					<div class="space-y-4">
						<div class="form-group">
							<label for="company_name" class="block text-sm font-medium text-gray-900">
								Unternehmensname
							</label>
							<input
								type="text"
								id="company_name"
								name="company_name"
								bind:value={$form.company_name}
								class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							/>
							{#if $errors.company_name}
								<p class="text-sm text-red-600">{$errors.company_name}</p>
							{/if}

							<label for="company_url" class="block text-sm font-medium text-gray-900">
								Unternehmens-URL
							</label>
							<input
								type="url"
								id="company_url"
								name="company_url"
								bind:value={$form.company_url}
								class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							/>
							{#if $errors.company_url}
								<p class="text-sm text-red-600">{$errors.company_url}</p>
							{/if}
						</div>
					</div>
				</div>
			{:else if currentStep === 10}
				<div in:slide out:slide>
					<div class="space-y-4">
						<ContactForm {form} {errors} />
					</div>
				</div>
			{:else if currentStep === 11}
				<div in:slide out:slide>
					<WaitingScreen autoAdvance={7} nextStep={() => (currentStep = 12)} />
				</div>
			{:else if currentStep === 12}
				<div in:slide out:slide>
					<VisibilityScore
						score={calculatedScore}
						autoAdvance={5}
						nextStep={() => {
							// Reset form and steps
							currentStep = 1;
							validSteps = [];
							$form = initialFormData; // Add this if you have initial data
						}}
					/>
				</div>
			{/if}
		</section>

		<div class="flex justify-between space-x-4 pt-6">
			{#if currentStep > 1 && currentStep < 11}
				<Button label="Züruck" variant="outline" on:click={previousStep} />
			{:else}
				<div></div>
			{/if}

			{#if currentStep < 11}
				<Button type="submit" variant="primary" disabled={$delayed} label={getButtonLabel()} />
			{/if}
		</div>
	</form>
</div>

{#if import.meta.env.DEV}
	<SuperDebug data={$form} />
{/if}
