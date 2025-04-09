<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { i18n } from '$lib/i18n';

	const { autoAdvance = 7, nextStep } = $props<{
		autoAdvance?: number;
		nextStep: () => void;
	}>();

	let remainingTime = $state(autoAdvance);
	let intervalId: number | undefined;
	let timeoutId: number | undefined;
	let stepTriggered = $state(false); // Changed to reactive state

	function safeNextStep() {
		if (!stepTriggered) {
			stepTriggered = true;
			console.log('WaitingScreen: Advancing to next step');
			if (typeof nextStep === 'function') {
				nextStep();
			}
		}
	}

	onMount(() => {
		// Count down for display
		intervalId = setInterval(() => {
			if (remainingTime > 0) {
				remainingTime--;
			} else {
				clearInterval(intervalId);
				safeNextStep();
			}
		}, 1000);

		// Set a separate timeout for navigation to ensure it happens
		timeoutId = setTimeout(() => {
			safeNextStep();
		}, autoAdvance * 1000);
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
		if (timeoutId) clearTimeout(timeoutId);
	});
</script>

<div class="waiting-screen flex flex-col items-center justify-center space-y-4 p-8">
	<div class="spinner animate-spin"></div>
	<p class="text-lg text-gray-600">
		{$i18n.waitingScreen.title}
	</p>
	<p class="text-sm text-gray-500">
		{$i18n.waitingScreen.redirect.replace('{remainingTime}', remainingTime.toString())}
	</p>
</div>
