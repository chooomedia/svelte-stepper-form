<!-- src/lib/components/Stepper.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Props {
		steps: any[];
		currentStep: number;
		validSteps: number[];
		invalidRequiredSteps?: number[];
		incompleteSteps?: number[];
	}

	let {
		steps,
		currentStep,
		validSteps,
		invalidRequiredSteps = [],
		incompleteSteps = []
	} = $props<Props>();

	const dispatch = createEventDispatcher<{
		change: number;
	}>();

	// Berechnung des Fortschritts in Prozent
	let progressValue = $derived(
		steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0
	);

	function getStepClass(index: number): string {
		const stepNumber = index + 1;
		const baseClasses =
			'relative z-10 flex h-3 w-3 items-center justify-center rounded-full transition-all duration-300 ease-in-out';

		if (validSteps.includes(stepNumber)) {
			return `${baseClasses} !h-4 !w-4 scale-110 !border-green-500 !bg-green-500`;
		}
		if (invalidRequiredSteps.includes(stepNumber)) {
			return `${baseClasses} !h-4 !w-4 border-2 border-red-500 bg-red-500`;
		}
		if (incompleteSteps.includes(stepNumber)) {
			return `${baseClasses} !h-4 !w-4 border-2 border-orange-400 bg-orange-400`;
		}
		if (currentStep - 1 === index) {
			return `${baseClasses} border-2 border-blue-500 bg-blue-500`;
		}
		return `${baseClasses} border-2 border-gray-200 bg-gray-200`;
	}

	function handleStepClick(index: number) {
		dispatch('change', index + 1);
	}
</script>

<div class="flex w-full flex-col items-center">
	<div class="relative flex w-full items-center justify-between overflow-hidden py-1">
		<!-- Hintergrundlinie -->
		<div class="absolute top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200"></div>

		<!-- Fortschrittslinie -->
		<div
			class="absolute top-1/2 h-0.5 origin-left bg-green-500 transition-transform duration-300 ease-in-out"
			style="width: {progressValue}%;"
		></div>

		<!-- Step Dots -->
		{#each steps as _, index}
			<button
				class={getStepClass(index)}
				disabled={index + 1 > currentStep && !validSteps.includes(index + 1)}
				onclick={() => handleStepClick(index)}
				aria-label="Schritt {index + 1} von {steps.length}"
			>
				{#if validSteps.includes(index + 1)}
					<span class="text-[10px] text-white">✓</span>
				{/if}
			</button>
		{/each}
	</div>
</div>
