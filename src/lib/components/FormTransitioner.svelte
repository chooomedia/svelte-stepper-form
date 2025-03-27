<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	// Props for the component
	interface Props {
		currentStep: number;
		minHeight?: string;
	}

	let { currentStep, minHeight = '420px' } = $props<Props>();

	// State management
	let containerElement: HTMLDivElement;
	let previousStep = $state(currentStep);
	let contentHeight = $state(0);
	let resizeObserver: ResizeObserver | null = null;

	// Track height changes of content to adjust container height smoothly
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
	class="form-container relative"
	style="min-height: {minHeight}; height: {contentHeight}px; transition: height 0.3s ease-in-out;"
	bind:this={containerElement}
>
	{#key currentStep}
		<div
			in:fade={{ duration: 300, delay: 150 }}
			out:fade={{ duration: 150 }}
			class="form-content absolute top-0 w-full"
		>
			<slot />
		</div>
	{/key}
</div>

<style>
	.form-container {
		position: relative;
		width: 100%;
	}

	.form-content {
		width: 100%;
	}
</style>
