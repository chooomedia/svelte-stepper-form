<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';

	Chart.register(DoughnutController, ArcElement, Tooltip);

	export let score = 75;
	export let autoAdvance = 5;
	export let nextStep: () => void;

	let chartCanvas: HTMLCanvasElement;
	let chartInstance: Chart | null = null;
	let timeout: ReturnType<typeof setTimeout>;

	onMount(() => {
		if (chartCanvas) {
			chartInstance = new Chart(chartCanvas, {
				type: 'doughnut',
				data: {
					datasets: [
						{
							data: [score, 100 - score],
							backgroundColor: [
								'rgb(59, 130, 246)', // Tailwind blue-500
								'rgb(229, 231, 235)' // Tailwind gray-200
							],
							borderWidth: 0,
							circumference: 360,
							cutout: '85%'
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						tooltip: {
							enabled: false
						}
					},
					animation: {
						duration: 1500,
						easing: 'easeOutQuart'
					}
				}
			});
		}

		timeout = setTimeout(nextStep, autoAdvance * 1000);
	});

	onDestroy(() => {
		if (chartInstance) {
			chartInstance.destroy();
		}
		clearTimeout(timeout);
	});
</script>

<div class="mx-auto flex max-w-lg flex-col items-center space-y-4">
	<div class="relative h-64 w-64">
		<canvas bind:this={chartCanvas}></canvas>
		<div class="absolute inset-0 flex flex-col items-center justify-center">
			<div class="text-4xl font-bold text-gray-900">{score}%</div>
			<div class="text-sm text-gray-500">Sichtbarkeits-Score</div>
		</div>
	</div>
	<div class="text-center">
		<h3 class="text-xl font-semibold text-gray-900">
			{#if score >= 80}
				Ausgezeichnet!
			{:else if score >= 60}
				Gut auf dem Weg!
			{:else}
				Verbesserungspotential!
			{/if}
		</h3>
		<p class="mt-2 text-gray-600">
			{#if score >= 80}
				Ihre digitale Sichtbarkeit ist hervorragend.
			{:else if score >= 60}
				Ihre digitale Präsenz zeigt gute Ansätze.
			{:else}
				Wir können Ihre digitale Sichtbarkeit deutlich verbessern.
			{/if}
		</p>
	</div>
</div>
