<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';

	export let score = 75;
	export let autoAdvance = 5;
	export let nextStep: () => void;

	let chartCanvas: HTMLCanvasElement;
	let chartInstance: Chart | null = null;
	let timeout: ReturnType<typeof setTimeout>;

	onMount(() => {
		if (chartCanvas) {
			chartInstance = new Chart(chartCanvas, {
				/* config */
			});
		}
		timeout = setTimeout(nextStep, autoAdvance * 1000);
	});

	onDestroy(() => {
		chartInstance?.destroy();
		clearTimeout(timeout);
	});
</script>

<div class="chart-container">
	<canvas bind:this={chartCanvas}></canvas>
	<div class="chart-label">{score}%</div>
	<!-- ✅ Score-Zahl in der Mitte -->
</div>

<style>
	.chart-container {
		position: relative;
		width: 250px;
		height: 250px;
		margin: auto;
	}
	.chart-label {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 2rem;
		font-weight: bold;
		color: #333;
	}
</style>
