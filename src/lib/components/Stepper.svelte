<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let steps = [];
	export let currentStep = 1;
	export let validSteps: number[] = [];

	const dispatch = createEventDispatcher();

	// Berechnung des Fortschritts in Prozent
	$: progress = steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0;
</script>

<div class="flex w-full flex-col items-center">
	<div class="relative flex w-full items-center justify-between">
		<!-- Hintergrundlinie -->
		<div class="absolute top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200"></div>

		<!-- Fortschrittslinie -->
		<div
			class="absolute top-1/2 h-0.5 origin-left bg-green-500 transition-transform duration-300 ease-in-out"
			style="width: {progress}%;"
		></div>

		<!-- Step Dots -->
		{#each steps as _, index}
			<button
				class="relative z-10 flex h-3 w-3 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-200
                       transition-all duration-300 ease-in-out
                       {currentStep - 1 === index ? 'border-blue-500 bg-blue-500' : ''} 
                       {validSteps.includes(index + 1)
					? '!h-4 !w-4 scale-110 !border-green-500 !bg-green-500'
					: ''}"
				disabled={index + 1 > currentStep && !validSteps.includes(index + 1)}
				on:click={() => dispatch('change', index + 1)}
			>
				{#if validSteps.includes(index + 1)}
					<span class="text-[10px] text-white">✓</span>
				{/if}
			</button>
		{/each}
	</div>
</div>
