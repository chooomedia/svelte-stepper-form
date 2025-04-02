<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	// Props with types
	interface Props {
		currentStep: number;
		height?: string;
		transitionDuration?: number;
		transitionDelay?: number;
	}

	let {
		currentStep,
		height = 'auto',
		transitionDuration = 300,
		transitionDelay = 150
	} = $props<Props>();

	// State and refs
	let containerElement: HTMLDivElement;
	let previousStep = $state(currentStep);
	let contentHeight = $state(0);
	let resizeObserver: ResizeObserver | null = null;

	// Track height changes of content
	function setupResizeObserver() {
		if (typeof ResizeObserver === 'undefined') return;

		resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				// Get the first child element (the actual content)
				const contentEl = entry.target.firstElementChild as HTMLElement;
				if (contentEl) {
					// Add some padding to avoid scroll
					contentHeight = contentEl.offsetHeight + 20;
				}
			}
		});

		// Observe the container
		if (containerElement) {
			resizeObserver.observe(containerElement);
		}
	}

	// Set up animations when component mounts
	onMount(() => {
		setupResizeObserver();
	});

	// Clean up observer on component destroy
	onDestroy(() => {
		if (resizeObserver) {
			resizeObserver.disconnect();
		}
	});

	// Track step changes for animations
	$effect(() => {
		if (currentStep !== previousStep) {
			previousStep = currentStep;
		}
	});
</script>

<div
	class="form-container transition-height relative w-full duration-300 ease-in-out"
	style="height: {contentHeight ? `${contentHeight}px` : height}; min-height: {height};"
	bind:this={containerElement}
>
	{#key currentStep}
		<div
			in:fade={{ duration: transitionDuration, delay: transitionDelay }}
			out:fade={{ duration: transitionDuration }}
			class="form-content absolute top-0 w-full"
		>
			<slot />
		</div>
	{/key}
</div>

<style>
	.transition-height {
		transition: height 0.3s ease-in-out;
	}
</style>
