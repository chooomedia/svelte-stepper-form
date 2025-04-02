<!-- src/lib/components/steps/WebsiteAnalysisStep.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { loadingStore } from '$lib/stores/loadingStore';
	import SeoTips from '$lib/components/SeoTips.svelte';
	import FormStep from './FormStep.svelte';
	import WebsiteUrlForm from '$lib/components/WebsiteUrlForm.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormData } from '$lib/schema';

	// Props
	interface Props {
		form: SuperValidated<FormData>;
		errors?: Record<string, string>;
		title?: string;
		subtitle?: string;
		minDisplayTime?: number;
		autoNavigate?: boolean;
	}

	const {
		form,
		errors = {},
		title = '',
		subtitle = '',
		minDisplayTime = 8,
		autoNavigate = true
	} = $props<Props>();

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		analysisComplete: { score: number; data: any };
		navigate: { step: number };
	}>();

	// State
	let isAnalyzing = $state(false);
	let analysisComplete = $state(false);
	let score = $state(0);
	let resultData = $state<any>(null);

	// Analysis event handlers
	function handleAnalysisStart() {
		isAnalyzing = true;
		$loadingStore.websiteLoading = true;
	}

	function handleAnalysisEnd() {
		isAnalyzing = false;
		$loadingStore.websiteLoading = false;
	}

	function handleAnalysisComplete(data: any, analysisScore: number) {
		analysisComplete = true;
		score = analysisScore;
		resultData = data;

		// Dispatch completion event
		dispatch('analysisComplete', {
			score: analysisScore,
			data
		});

		// Auto-navigate after completion
		if (autoNavigate) {
			// Delay to show results briefly
			setTimeout(() => {
				dispatch('navigate', { step: 1 }); // Advance 1 step
			}, minDisplayTime * 1000);
		}
	}
</script>

<FormStep {title} {subtitle} fullWidth={true}>
	<WebsiteUrlForm
		{form}
		error={errors}
		onAnalysisComplete={handleAnalysisComplete}
		onAnalysisStart={handleAnalysisStart}
		onAnalysisEnd={handleAnalysisEnd}
	/>

	{#if isAnalyzing}
		<div class="mt-6">
			<SeoTips {minDisplayTime} isResponseReceived={analysisComplete} />
		</div>
	{/if}

	{#if analysisComplete && !isAnalyzing}
		<div class="mt-6 rounded-lg bg-green-50 p-4 text-green-800">
			<p class="font-medium">Analysis complete! Score: {score}/100</p>
			<p class="mt-2 text-sm">
				We've analyzed your website and prepared recommendations for improvement.
			</p>
		</div>
	{/if}
</FormStep>
