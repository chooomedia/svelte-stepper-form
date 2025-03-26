<script lang="ts">
	import { stepStatuses, currentStep } from '$lib/stores/stepStore';
	import { createEventDispatcher } from 'svelte';

	// Create an event dispatcher for navigation events
	const dispatch = createEventDispatcher();

	// Props to receive the loading state
	export let isWebsiteLoading = false;
	export let isSubmitting = false;

	// Berechnung der Fortschrittsanzeige
	let progressValue = 0;
	$: {
		if ($stepStatuses.length > 1) {
			progressValue = (($currentStep - 1) / ($stepStatuses.length - 1)) * 100;
		}
	}

	function getStepClass(stepStatus): string {
		const baseClasses =
			'relative z-10 flex h-3 w-3 items-center justify-center rounded-full transition-all duration-300 ease-in-out';

		// Special case: Loading state for step 2 (website analysis)
		if (stepStatus.index === 2 && isWebsiteLoading) {
			return `${baseClasses} !h-4 !w-4 border-2 border-blue-300 bg-blue-300 animate-pulse`;
		}

		// Special case: Loading state for step 10 (form submission)
		if (stepStatus.index === 10 && isSubmitting) {
			return `${baseClasses} !h-4 !w-4 border-2 border-blue-300 bg-blue-300 animate-pulse`;
		}

		if (stepStatus.isValid) {
			return `${baseClasses} !h-4 !w-4 scale-110 !border-green-500 !bg-green-500`;
		}
		if (stepStatus.isInvalid) {
			return `${baseClasses} !h-4 !w-4 border-2 border-red-500 bg-red-500`;
		}
		if (stepStatus.isIncomplete) {
			return `${baseClasses} !h-4 !w-4 border-2 border-orange-400 bg-orange-400`;
		}
		if (stepStatus.isCurrent) {
			return `${baseClasses} border-2 border-blue-500 bg-blue-500`;
		}
		return `${baseClasses} border-2 border-gray-200 bg-gray-200`;
	}

	function handleStepClick(stepIndex: number) {
		// Only allow clicking on valid steps or the current one
		const status = $stepStatuses[stepIndex];
		if (status && (status.isValid || status.index <= $currentStep)) {
			currentStep.set(status.index);
			// Dispatch an event to notify parent component
			dispatch('stepChange', { step: status.index });
		}
	}
</script>

<div class="flex w-full flex-col items-center">
	<div class="relative flex w-full items-center justify-between overflow-hidden py-1">
		<!-- Background track -->
		<div class="absolute top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200"></div>

		<!-- Progress indicator -->
		<div
			class="absolute top-1/2 h-0.5 origin-left bg-green-500 transition-transform duration-300 ease-in-out"
			style="width: {progressValue}%;"
		></div>

		<!-- Step indicators -->
		{#each $stepStatuses as stepStatus, index}
			<button
				class={getStepClass(stepStatus)}
				disabled={!stepStatus.isValid && stepStatus.index > $currentStep}
				on:click={() => handleStepClick(index)}
				aria-label="Schritt {stepStatus.index} von {$stepStatuses.length}"
				title={stepStatus.index === 2 && isWebsiteLoading
					? 'Website wird analysiert...'
					: stepStatus.index === 10 && isSubmitting
						? 'Formular wird gesendet...'
						: stepStatus.isValid
							? 'Abgeschlossen'
							: stepStatus.isInvalid
								? 'Erforderliche Daten fehlen'
								: stepStatus.isIncomplete
									? 'Unvollständig'
									: stepStatus.isCurrent
										? 'Aktueller Schritt'
										: 'Noch nicht bearbeitet'}
			>
				{#if stepStatus.isValid}
					<span class="text-[10px] text-white">✓</span>
				{:else if stepStatus.isInvalid}
					<span class="text-[10px] text-white">!</span>
				{:else if stepStatus.isIncomplete}
					<span class="text-[10px] text-white">⋯</span>
				{:else if (stepStatus.index === 2 && isWebsiteLoading) || (stepStatus.index === 10 && isSubmitting)}
					<span class="text-[8px] text-white">
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
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					</span>
				{/if}
			</button>
		{/each}
	</div>
</div>
