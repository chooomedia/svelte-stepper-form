<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { formData, calculatedScore } from '$lib/stores/formStore';
	import { scoreStore } from '$lib/utils/ScoreManager';
	import { fade } from 'svelte/transition';

	// Props
	interface Props {
		currentStep: number;
	}

	let { currentStep } = $props<Props>();

	// State
	let scoreValue = $state(0);
	let showScoreIndicator = $state(false);
	let unsubscribe: () => void;

	// When the step changes, check if we should update/show the score
	$effect(() => {
		// For steps after the website analysis (step 2)
		if (currentStep > 2) {
			// Get latest score and decide if we should show it
			scoreValue = $calculatedScore;
			showScoreIndicator = scoreValue > 0;
		} else {
			showScoreIndicator = false;
		}
	});

	// Monitor score changes
	onMount(() => {
		unsubscribe = scoreStore.subscribe(($scoreStore) => {
			if ($scoreStore.finalScore > 0 && currentStep > 2) {
				scoreValue = $scoreStore.finalScore;
				showScoreIndicator = true;
			}
		});
	});

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});
</script>

{#if showScoreIndicator}
	<div
		class="score-indicator absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 text-white shadow-md"
		transition:fade={{ duration: 300 }}
	>
		<span class="text-xs font-medium">Visibilitäts-Score</span>
		<span
			class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white font-bold text-blue-600"
		>
			{scoreValue}
		</span>
	</div>
{/if}
