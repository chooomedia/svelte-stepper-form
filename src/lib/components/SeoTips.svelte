<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { i18n } from '$lib/i18n';

	// Props for the component
	interface Props {
		minDisplayTime?: number; // Minimum display time in seconds after webhook response
		isResponseReceived?: boolean; // Flag to indicate if response was received
	}

	const { minDisplayTime = 8, isResponseReceived = false } = $props<Props>();

	// Default SEO tips
	const defaultSeoTips = $i18n.forms.seotips.default;

	// State variables
	let currentTipIndex = $state(0);
	let intervalId: number | undefined;
	let timeoutId: number | undefined;
	let activeTips = $state(defaultSeoTips);
	let inTransition = $state(false);
	let tipTitle = $state($i18n.forms.seotips.title);

	// Handle tip rotation
	function startTipRotation(tips: string[], interval: number = minDisplayTime * 1000) {
		// Clear any existing interval
		if (intervalId) clearInterval(intervalId);

		// Reset index
		currentTipIndex = 0;

		// Start new interval for tips rotation
		intervalId = setInterval(() => {
			inTransition = true;
			setTimeout(() => {
				currentTipIndex = (currentTipIndex + 1) % tips.length;
				inTransition = false;
			}, 300); // Match this with transition duration
		}, interval);

		return intervalId;
	}

	// Lifecycle management
	onMount(() => {
		// Start with default tips
		startTipRotation(defaultSeoTips);
	});

	// Effect to handle custom tips when response is received
	$effect(() => {
		// If we have custom tips and response is received
		if (defaultSeoTips && defaultSeoTips.length > 0 && isResponseReceived) {
			// Clear existing timers
			if (intervalId) clearInterval(intervalId);
			if (timeoutId) clearTimeout(timeoutId);

			// Switch to custom tips with smooth transition
			inTransition = true;
			setTimeout(() => {
				tipTitle = $i18n.forms.seotips.title;
				currentTipIndex = 0;
				inTransition = false;

				// Start rotation with custom tips
				startTipRotation(defaultSeoTips, 5000); // Show custom tips faster
			}, 300);
		}
	});

	onDestroy(() => {
		// Clean up timers
		if (intervalId) clearInterval(intervalId);
		if (timeoutId) clearTimeout(timeoutId);
	});
</script>

<div
	class="seo-tip-card rounded-lg border border-primary-100 bg-primary-50 p-5 shadow-sm"
	in:fade={{ duration: 500 }}
	out:fade={{ duration: 500 }}
>
	<div class="flex items-start space-x-4">
		<div class="flex-shrink-0">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 text-primary-500"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		</div>
		<div class="relative min-h-[4rem] w-full overflow-hidden">
			<h3 class="font-semibold text-primary-800">{tipTitle}</h3>

			{#if !inTransition}
				<p
					class="mt-1 text-primary-700"
					in:fly={{ y: -20, duration: 300 }}
					out:fly={{ y: 20, duration: 300 }}
				>
					{activeTips[currentTipIndex]}
				</p>
			{/if}
		</div>
	</div>
	<div class="mt-4">
		<div class="h-1 w-full overflow-hidden rounded-full bg-primary-200">
			<div
				class="h-full animate-pulse rounded-full bg-primary-500 transition-all duration-300"
				style="width: {((currentTipIndex + 1) / activeTips.length) * 100}%"
			></div>
		</div>
	</div>
</div>
