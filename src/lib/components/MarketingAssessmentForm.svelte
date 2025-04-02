<!-- src/lib/components/MarketingAssessmentForm.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import MultiStepForm from './steps/MultiStepForm.svelte';
	import SelectOptionStep from './steps/SelectOptionStep.svelte';
	import WebsiteAnalysisStep from './steps/WebsiteAnalysisStep.svelte';
	import ContactInfoStep from './steps/ContactInfoStep.svelte';
	import WaitingStep from './steps/WaitingStep.svelte';
	import ResultStep from './steps/ResultStep.svelte';
	import PageMeta from './PageMeta.svelte';

	import { formStore } from '$lib/stores/formStore';
	import { stepperStore } from '$lib/stores/stepperStore';
	import { formOptions } from '$lib/schema';
	import { i18n } from '$lib/i18n';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormData } from '$lib/schema';

	// Props
	interface Props {
		form: SuperValidated<FormData>;
		errors?: Record<string, string>;
	}

	const { form, errors = {} } = $props<Props>();

	// Create form steps configuration
	const formSteps = [
		{
			id: 'visibility',
			title: $i18n.schema.steps.visibility.title,
			description: $i18n.schema.steps.visibility.description,
			component: SelectOptionStep,
			props: {
				fieldName: 'visibility',
				options: formOptions.visibility,
				multiple: true,
				maxSelections: 4
			}
		},
		{
			id: 'company_url',
			title: $i18n.schema.steps.company_url.title,
			description: $i18n.schema.steps.company_url.description,
			component: WebsiteAnalysisStep,
			props: {
				form,
				errors,
				minDisplayTime: 8,
				autoNavigate: true
			}
		},
		{
			id: 'advertising_frequency',
			title: $i18n.schema.steps.advertising_frequency.title,
			description: $i18n.schema.steps.advertising_frequency.description,
			component: SelectOptionStep,
			props: {
				fieldName: 'advertising_frequency',
				options: formOptions.advertising_frequency,
				multiple: false,
				autoAdvance: true
			}
		},
		{
			id: 'goals',
			title: $i18n.schema.steps.goals.title,
			description: $i18n.schema.steps.goals.description,
			component: SelectOptionStep,
			props: {
				fieldName: 'goals',
				options: formOptions.goals,
				multiple: false,
				autoAdvance: true
			}
		},
		{
			id: 'campaign_management',
			title: $i18n.schema.steps.campaign_management.title,
			description: $i18n.schema.steps.campaign_management.description,
			component: SelectOptionStep,
			props: {
				fieldName: 'campaign_management',
				options: formOptions.campaign_management,
				multiple: false,
				autoAdvance: true
			}
		},
		{
			id: 'online_reviews',
			title: $i18n.schema.steps.online_reviews.title,
			description: $i18n.schema.steps.online_reviews.description,
			component: SelectOptionStep,
			props: {
				fieldName: 'online_reviews',
				options: formOptions.online_reviews,
				multiple: false,
				autoAdvance: true
			}
		},
		{
			id: 'previous_campaigns',
			title: $i18n.schema.steps.previous_campaigns.title,
			description: $i18n.schema.steps.previous_campaigns.description,
			component: SelectOptionStep,
			props: {
				fieldName: 'previous_campaigns',
				options: formOptions.previous_campaigns,
				multiple: false,
				autoAdvance: true
			}
		},
		{
			id: 'business_phase',
			title: $i18n.schema.steps.business_phase.title,
			description: $i18n.schema.steps.business_phase.description,
			component: SelectOptionStep,
			props: {
				fieldName: 'business_phase',
				options: formOptions.business_phase,
				multiple: false,
				autoAdvance: true
			}
		},
		{
			id: 'implementation_time',
			title: $i18n.schema.steps.implementation_time.title,
			description: $i18n.schema.steps.implementation_time.description,
			component: SelectOptionStep,
			props: {
				fieldName: 'implementation_time',
				options: formOptions.implementation_time,
				multiple: false,
				autoAdvance: true
			}
		},
		{
			id: 'company_info',
			title: $i18n.schema.steps.company_info.title,
			description: $i18n.schema.steps.company_info.description,
			component: ContactInfoStep,
			props: {
				form,
				errors
			},
			validate: () => {
				// Here you would implement actual form validation
				// For now, we'll just check if at least the company name is set
				const formData = formStore.getState().formData;
				return !!formData.company_name;
			}
		},
		{
			id: 'waiting',
			title: $i18n.schema.steps.waitingscreen.title,
			description: $i18n.schema.steps.waitingscreen.description,
			component: WaitingStep,
			props: {
				autoAdvance: 7
			}
		},
		{
			id: 'result',
			title: $i18n.schema.steps.result.title,
			description: $i18n.schema.steps.result.description,
			component: ResultStep,
			props: {
				showRestartButton: true,
				showReportButton: true
			}
		}
	];

	// Handle form completion
	function handleFormComplete(formData: FormData) {
		console.log('Form completed with data:', formData);
		// Here you would typically submit the form data to your backend
		// For now, we'll just log it and consider it successful

		return Promise.resolve();
	}

	// Handle form restart
	function handleRestart() {
		formStore.reset();
		stepperStore.reset();
	}

	// Initialize on mount
	onMount(() => {
		// Reset the stepper and form store to ensure a clean start
		stepperStore.reset();
	});
</script>

<div class="marketing-assessment-form mx-auto max-w-4xl px-4 py-8">
	<!-- Header for first step only -->
	{#if $stepperStore.current?.index === 1}
		<header in:fade={{ duration: 500 }}>
			<h1 class="mb-6 text-center text-4xl font-bold text-secondary-900">
				{$i18n.start.title}
			</h1>

			<p class="mx-auto mb-8 max-w-2xl text-center text-base text-gray-600">
				{@html $i18n.start.text}
			</p>

			<PageMeta totalSteps={formSteps.length} />
		</header>
	{/if}

	<!-- Multi-step form -->
	<MultiStepForm
		steps={formSteps}
		onComplete={handleFormComplete}
		navigationConfig={{
			showBackButton: true,
			nextButtonLabel: $i18n.common.next,
			completeButtonLabel: $i18n.common.submit
		}}
	/>
</div>
