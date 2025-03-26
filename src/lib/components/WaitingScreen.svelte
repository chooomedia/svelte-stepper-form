<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	const { autoAdvance = 7, nextStep } = $props<{
		autoAdvance?: number;
		nextStep: () => void;
	}>();

	let remainingTime = $state(autoAdvance);
	let intervalId: number | undefined;
	let timeoutId: number | undefined;
	let stepTriggered = false; // Verhindert mehrfaches Aufrufen von nextStep

	function safeNextStep() {
		if (!stepTriggered) {
			stepTriggered = true;
			if (typeof nextStep === 'function') {
				nextStep();
			}
		}
	}

	onMount(() => {
		intervalId = setInterval(() => {
			if (remainingTime > 0) {
				remainingTime--;
			} else {
				clearInterval(intervalId);
				safeNextStep();
			}
		}, 1000);

		timeoutId = setTimeout(safeNextStep, autoAdvance * 1000);
	});

	onDestroy(() => {
		clearInterval(intervalId);
		clearTimeout(timeoutId);
	});
</script>

<div class="waiting-screen flex flex-col items-center justify-center space-y-4 p-8">
	<div class="spinner animate-spin"></div>
	<p class="text-lg text-gray-600">Angaben werden analysieren - Bitte habe einen Moment Geduld.</p>
	<p class="text-sm text-gray-500">
		Weiterleitung in {remainingTime} Sekunden
	</p>
</div>
