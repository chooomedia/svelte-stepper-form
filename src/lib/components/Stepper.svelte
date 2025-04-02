<!-- src/lib/components/Stepper.svelte - Improved version -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { stepStatuses, currentStepIndex, goToStep } from '$lib/stores/stepperStore';
	import { websiteLoading, formSubmitting } from '$lib/stores/loadingStore';
	import { derived, get } from 'svelte/store';

	// Create an event dispatcher for navigation events
	const dispatch = createEventDispatcher<{
		stepChange: { step: number };
	}>();

	// Compute progress percentage (1-based indexing)
	const progressValue = derived(
		[currentStepIndex, stepStatuses],
		([$currentStepIndex, $stepStatuses]) =>
			$stepStatuses.length > 1 ? (($currentStepIndex - 1) / ($stepStatuses.length - 1)) * 100 : 0
	);

	// Get class for a step based on its status
	function getStepClass(stepStatus: any): string {
		const baseClass = `
        relative z-10 flex h-3 w-3 items-center justify-center 
        rounded-full transition-all duration-300 ease-in-out
      `;

		// Special state for website analysis (step 2)
		if (stepStatus.index === 2 && get(websiteLoading)) {
			return `${baseClass} !h-4 !w-4 border-2 border-primary-300 bg-primary-300`;
		}

		// Special state for form submission (step 10)
		if (stepStatus.index === 10 && get(formSubmitting)) {
			return `${baseClass} !h-4 !w-4 border-2 border-primary-300 bg-primary-300`;
		}

		// Standard states
		if (stepStatus.isValid) {
			return `${baseClass} !h-4 !w-4 scale-110 !border-primary-500 !bg-primary-500`;
		}

		if (stepStatus.isInvalid) {
			return `${baseClass} !h-4 !w-4 border-2 border-red-500 bg-red-500`;
		}

		if (stepStatus.isIncomplete) {
			return `${baseClass} !h-4 !w-4 border-2 border-orange-400 bg-orange-400`;
		}

		if (stepStatus.isCurrent) {
			return `${baseClass} border-2 border-secondary bg-secondary`;
		}

		return `${baseClass} border-2 border-gray-200 bg-gray-200`;
	}

	// Handle step click with proper navigation
	function handleStepClick(index: number) {
		const status = get(stepStatuses)[index];

		// Only allow navigation to valid or reachable steps
		if (status && (status.isValid || status.isReachable)) {
			goToStep(status.index);
			dispatch('stepChange', { step: status.index });
		}
	}

	// Get tooltip text for each step
	function getStepTooltip(stepStatus: any): string {
		if (stepStatus.index === 2 && get(websiteLoading)) {
			return 'Website wird analysiert...';
		}

		if (stepStatus.index === 10 && get(formSubmitting)) {
			return 'Formular wird gesendet...';
		}

		if (stepStatus.isValid) {
			return 'Abgeschlossen';
		}

		if (stepStatus.isInvalid) {
			return 'Erforderliche Daten fehlen';
		}

		if (stepStatus.isIncomplete) {
			return 'Unvollständig';
		}

		if (stepStatus.isCurrent) {
			return 'Aktueller Schritt';
		}

		return 'Noch nicht bearbeitet';
	}
</script>

<div
	class="relative flex w-full flex-col items-center"
	role="navigation"
	aria-label="Form Progress"
>
	<div class="flex h-[18px] w-full items-center justify-between">
		<!-- Background track -->
		<div
			class="absolute top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200"
			aria-hidden="true"
		></div>

		<!-- Progress indicator -->
		<div
			class="absolute top-1/2 h-0.5 origin-left bg-primary-500 transition-all duration-300 ease-in-out"
			style="width: {$progressValue}%;"
			aria-hidden="true"
		></div>

		<!-- Step indicators -->
		{#each $stepStatuses as stepStatus, index}
			<button
				class={getStepClass(stepStatus)}
				disabled={!stepStatus.isValid && !stepStatus.isReachable}
				on:click={() => handleStepClick(index)}
				aria-label="Schritt {stepStatus.index} von {$stepStatuses.length}"
				aria-current={stepStatus.isCurrent ? 'step' : undefined}
				aria-disabled={!stepStatus.isValid && !stepStatus.isReachable}
				title={getStepTooltip(stepStatus)}
			>
				<span aria-hidden="true">
					{#if stepStatus.isValid}
						<span class="text-[10px] text-secondary">✓</span>
					{:else if stepStatus.isInvalid}
						<span class="text-[10px] text-secondary">!</span>
					{:else if stepStatus.isIncomplete}
						<span class="text-[10px] text-secondary">⋯</span>
					{:else if (stepStatus.index === 2 && get(websiteLoading)) || (stepStatus.index === 10 && get(formSubmitting))}
						<span class="text-[8px] text-secondary">
							<svg class="h-2 w-2 animate-spin" viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
									fill="none"
								></circle>
								<!-- src/lib/components/Stepper.svelte - Improved version (continued) -->
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						</span>
					{/if}
				</span>
			</button>
		{/each}
	</div>

	<!-- Screen reader text describing current progress -->
	<div class="sr-only" aria-live="polite">
		Schritt {$currentStepIndex} von {$stepStatuses.length}
		{#if $stepperStore.current}
			- {$stepperStore.current.description}
		{/if}
	</div>
</div>
