<!-- src/lib/components/steps/ResultStep.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { formStore } from '$lib/stores/formStore';
	import { scoreStore } from '$lib/utils/scoring';
	import ResultsPage from '$lib/components/ResultsPage.svelte';
	import { i18n } from '$lib/i18n';

	// Props
	interface Props {
		title?: string;
		subtitle?: string;
		showRestartButton?: boolean;
		showReportButton?: boolean;
	}

	const {
		title = '',
		subtitle = '',
		showRestartButton = true,
		showReportButton = true
	} = $props<Props>();

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		restart: void;
		getReport: void;
	}>();

	// Get form data and score from stores
	const formData = $derived(formStore.getState().formData);
	const calculatedScore = $derived(
		formStore.getState().analysis.score > 0
			? formStore.getState().analysis.score
			: formStore.getState().formData.visibility_score || 0
	);

	// Get audit data from score store
	const auditData = $derived(scoreStore.getState().auditData);

	// Handle restart button click
	function handleRestart() {
		dispatch('restart');
	}

	// Handle get report button click
	function handleGetReport() {
		dispatch('getReport');
	}
</script>

<div class="results-container w-full">
	<ResultsPage
		score={calculatedScore}
		{formData}
		{auditData}
		nextStep={handleGetReport}
		restartAssessment={handleRestart}
	/>
</div>
