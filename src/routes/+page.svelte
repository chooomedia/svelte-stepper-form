<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Button from '$lib/components/Button.svelte';
	import ImageOption from '$lib/components/ImageOption.svelte';
	import WaitingScreen from '$lib/components/WaitingScreen.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import SeoTips from '$lib/components/SeoTips.svelte';
	import ResultsPage from '$lib/components/ResultsPage.svelte';
	import CompanyForm from '$lib/components/CompanyForm.svelte';
	import SuperDebug from 'sveltekit-superforms';
	import Transition from '$lib/components/TransitionScale.svelte';

	// Stores
	import { websiteLoading, formSubmitting } from '$lib/stores/loadingStore';
	import { stepperStore } from '$lib/stores/stepperStore';
	import { currentStepIndex, currentStep } from '$lib/stores/stepperStore';
	import { formData, setAnalysisResults } from '$lib/stores/formStore';

	// Vereinfachte State-Handling
	let { data } = $props<{ data: { form: FormData } }>();
	let form = $state(data.form);
	let analysisData = $state(null);
	let stepper = stepperStore;

	// Automatisierte Step-Validierung
	$effect(() => {
		const isValid = validateStep(stepper.current.index);
		stepper.validate(stepper.current.index, isValid ? 'valid' : 'invalid');
	});

	function validateStep(step: number) {
		const stepKey = FORM_STEPS[step - 1].title.toLowerCase();
		return !!form[stepKey];
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

<div class="min-h-screen bg-base-200 p-4">
	<!-- Stepper Visualisierung -->
	<div class="mx-auto mb-8 max-w-3xl">
		<ul class="steps steps-horizontal">
			{#each stepper.status as step}
				<li
					class="step"
					class:step-primary={step.isValid}
					class:step-error={!step.isValid}
					class:step-warning={step.index === stepper.current.index}
					data-content={step.isValid ? '✓' : ''}
				>
					<span class="text-sm">{step.index}</span>
				</li>
			{/each}
		</ul>
	</div>

	<!-- Dynamic Step Content -->
	<div class="card mx-auto max-w-3xl bg-base-100 shadow-xl">
		<div class="card-body">
			{#key stepper.current.index}
				<h2 class="card-title mb-6 text-3xl">
					{stepper.current.description}
				</h2>
			{/key}

			<!-- Unified Navigation -->
			<div class="mt-8 flex justify-between">
				<button
					class="btn btn-outline"
					on:click={stepper.prev}
					disabled={stepper.current.index === 1}
				>
					Zurück
				</button>

				{#if stepper.current.index < 12}
					<button
						class="btn btn-primary"
						on:click={stepper.next}
						disabled={!stepper.status[stepper.current.index - 1].isValid}
					>
						Weiter
					</button>
				{:else}
					<button class="btn btn-success" on:click={restart}> Neu starten </button>
				{/if}
			</div>
		</div>
	</div>
</div>
