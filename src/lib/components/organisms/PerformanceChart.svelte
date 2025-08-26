<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';
	import { scoreStore } from '$lib/utils/scoring';
	import { i18n } from '$lib/i18n';
	import Icon from '../atoms/Icon.svelte';
	import { getChartLabels, getScoreColor } from '../chart/ChartLabels';
	import { type Metric } from '../chart/ChartMetrics';
	import { createAnimationState } from '../chart/ChartAnimations';
	import { createChartEventHandlers, createChartLifecycle } from '../chart/ChartEvents';
	import {
		createChartLifecycleState,
		createChartLifecycle as createChartLifecycleManager
	} from '../chart/ChartLifecycle';
	import { calculateChartMetrics, type CalculationContext } from '../chart/ChartCalculation';
	import { createChartHelpers, createChartEffects } from '../chart/ChartHelpers';

	let { score = 50, auditData = null, chartHeight = '456px' } = $props();

	// DOM references
	let chartContainer: HTMLElement;
	let chartCanvas: HTMLCanvasElement;
	let chart: Chart;

	// Chart Labels
	const chartLabels = $derived(getChartLabels($i18n));
	const seoLabel = $derived(chartLabels.seo);
	const performanceLabel = $derived(chartLabels.performance);
	const accessibilityLabel = $derived(chartLabels.accessibility);
	const bestPracticesLabel = $derived(chartLabels.bestPractices);
	const contentLabel = $derived(chartLabels.content);
	const securityLabel = $derived(chartLabels.security);

	// Labels für die Legende
	const currentValueLabel = $derived(chartLabels.currentValue);
	const improvedValueLabel = $derived(chartLabels.improvedValue);
	const averageLabel = $derived(chartLabels.average);
	const optimalLabel = $derived(chartLabels.optimal);

	// State variables
	let metrics = $state<Metric[]>([]);
	let averageValue = $state(0);
	let improvedAverageValue = $state(0);
	let scoreColor = $state(getScoreColor(score)); // Dynamische Farbe basierend auf Score
	let chartLoaded = $state(false); // Reaktive Variable für Loading-Overlay

	// Lifecycle state
	const lifecycleState = createChartLifecycleState();
	lifecycleState.effectiveScore = score;

	// Animation control
	const animationState = createAnimationState();
	const animationTween = animationState.animationTween;

	// Event handlers
	const eventHandlers = $derived(createChartEventHandlers(lifecycleState.chart, metrics));
	const chartLifecycle = $derived(createChartLifecycle(lifecycleState.chart));
	const chartLifecycleManager = $derived(
		createChartLifecycleManager(
			lifecycleState.chart,
			chartCanvas,
			metrics,
			chartColors,
			{
				currentValue: currentValueLabel,
				improvedValue: improvedValueLabel,
				average: averageLabel,
				optimal: optimalLabel
			},
			averageValue,
			$animationTween,
			animationState,
			lifecycleState
		)
	);

	// Chart helpers
	const chartHelpers = $derived(
		createChartHelpers({
			lifecycleState,
			metrics,
			animationTween: $animationTween,
			averageValue,
			chartColors,
			chartCanvas,
			score,
			auditData,
			calculateMetrics,
			initializeChart
		})
	);

	// Chart effects
	const chartEffectsManager = $derived(createChartEffects(chartHelpers));

	// Diese Funktion sollte genau der Funktion in VisibilityScore.svelte entsprechen
	// Chart colors dynamically based on score
	$effect(() => {
		// Update scoreColor whenever effectiveScore changes
		scoreColor = getScoreColor(lifecycleState.effectiveScore);
	});

	// Chart colors object with reactive value
	const chartColors = $derived({
		current: scoreColor, // Dynamische Farbe basierend auf Score
		improved: '#6bd0d9', // DigitalPusher-Grün für verbesserte Daten
		average: '#F59E0B', // Amber/Orange
		optimal: '#002B2F', // Secondary color for optimal line
		pointBorder: '#FFFFFF'
	});

	// Subscribe to the score store for consistent data
	onMount(async () => {
		return await chartLifecycleManager.onMount(scoreStore, auditData, score, calculateMetrics);
	});

	// Calculate metrics from available data
	function calculateMetrics() {
		const context: CalculationContext = {
			effectiveScore: lifecycleState.effectiveScore,
			auditData,
			storeData: lifecycleState.storeData,
			chartLabels: {
				seo: seoLabel,
				performance: performanceLabel,
				accessibility: accessibilityLabel,
				bestPractices: bestPracticesLabel,
				content: contentLabel,
				security: securityLabel
			},
			i18nData: $i18n
		};

		const result = calculateChartMetrics(context);

		// Update local state
		metrics = result.metrics;
		averageValue = result.averageValue;
		improvedAverageValue = result.improvedAverageValue;

		// Update the chart if it exists
		updateChartData();

		// Reset recalculation flag
		lifecycleState.needsRecalculation = false;
	}

	// Initialize Chart.js instance
	async function initializeChart() {
		await chartLifecycleManager.initializeChart();
		// Update local reactive variable
		chartLoaded = lifecycleState.chartLoaded;
	}

	// Update chart data with current metrics
	function updateChartData() {
		chartHelpers.updateChartData();
	}

	// Update chart when animation values change
	$effect(() => {
		chartEffectsManager.animationEffect();
	});

	$effect(() => {
		chartEffectsManager.recalculationEffect();
	});

	// Update everything when score or auditData changes
	$effect(() => {
		chartEffectsManager.propsChangeEffect();
	});

	// Initialize the chart once DOM is ready and metrics are calculated
	$effect(() => {
		chartEffectsManager.chartInitializationEffect();
	});

	// Clean up on component destroy
	onDestroy(() => {
		chartLifecycle.onDestroy();
	});

	// Function to highlight specific data point
	function highlightPoint(index: number) {
		eventHandlers.highlightPoint(index);
	}
</script>

<div class="performance-chart relative p-6">
	<!-- Custom legend above the chart -->
	<div class="mb-2 flex flex-wrap items-center justify-center gap-2">
		{#each [currentValueLabel, improvedValueLabel, averageLabel, optimalLabel] as legendItem, i}
			<div
				class="flex cursor-pointer items-center rounded-md px-2 py-1 transition-all duration-300 hover:scale-105 hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-primary-500"
				on:mouseenter={() => eventHandlers.onLegendMouseEnter(i)}
				on:mouseleave={() => eventHandlers.onLegendMouseLeave()}
				role="button"
				tabindex="0"
			>
				{#if i === 0}
					<div
						class="mr-2 h-3 w-8 rounded-sm opacity-70"
						style="background-color: {scoreColor}"
					></div>
					<span class="text-[11px] text-gray-700">{currentValueLabel}</span>
				{:else if i === 1}
					<div class="mr-2 h-3 w-8 rounded-sm opacity-70" style="background-color: #6bd0d9;"></div>
					<span class="text-[11px] text-gray-700">{improvedValueLabel}</span>
				{:else if i === 2}
					<div class="mr-2 h-0.5 w-8 border-t-2 border-dashed border-yellow-500"></div>
					<span class="text-[11px] text-gray-700">{averageLabel} ({Math.round(averageValue)})</span>
				{:else}
					<div class="mr-2 h-0.5 w-8 border-t-2 border-dashed border-secondary"></div>
					<span class="text-[11px] text-gray-700">{optimalLabel} (90)</span>
				{/if}
			</div>
		{/each}
	</div>

	<div class="chart-container w-full" style="height: {chartHeight};" bind:this={chartContainer}>
		<canvas bind:this={chartCanvas} />
	</div>

	<!-- Metric Indicators -->
	<div class="mt-1 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
		{#each metrics as metric, i}
			<div
				class="group relative cursor-pointer rounded-md border border-gray-200 bg-white p-2 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
				style="border-top: 3px solid {metric.color};"
				on:mouseenter={() => eventHandlers.onMetricMouseEnter(i)}
				on:mouseleave={() => eventHandlers.onMetricMouseLeave()}
				tabindex="0"
				role="button"
				aria-label="{metric.label}: {Math.round(metric.value)}/100, nach Optimierung: {Math.round(
					metric.improvedValue
				)}/100"
			>
				<div class="flex flex-col">
					<div class="mb-2 flex items-baseline justify-between">
						<span class="text-xl font-bold text-gray-900">
							{Math.round(metric.value * $animationTween)}
						</span>
						<span class="ml-1 text-sm text-gray-500">/ 100</span>
					</div>

					<!-- Current Value Progress -->
					<div class="h-2 w-full rounded-full bg-gray-100">
						<div
							class="h-2 rounded-full transition-all duration-500"
							style="width: {metric.value * $animationTween}%; background-color: {metric.color}"
						></div>
					</div>

					<div class="mt-2 flex items-baseline justify-between">
						<span class="ml-1 flex items-center text-sm font-medium" style="color: #6bd0d9;">
							<Icon name="improvement" size={16} className="mr-1" stroke="none" />
							{Math.round(metric.improvedValue * $animationTween)}
						</span>
					</div>

					<!-- Improved Value Progress -->
					<div class="mt-1 h-2 rounded-full bg-gray-100">
						<div
							class="h-2 rounded-full transition-all duration-500"
							style="width: {metric.improvedValue * $animationTween}%; background-color: #6bd0d9;"
						></div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Loading overlay -->
	{#if !chartLoaded}
		<div class="absolute inset-0 flex flex-col items-center justify-center bg-white/90">
			<div
				class="spinner h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"
			></div>
			<p class="mt-4 text-lg text-gray-600">Loading...</p>
		</div>
	{/if}
</div>

<style>
	:global(.chartjs-tooltip) {
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	:global(.chartjs-tooltip-body) {
		padding: 4px 8px;
	}

	/* Keyboard focus styles */
	div[role='button']:focus-visible {
		outline: 2px solid #6bd0d9;
		outline-offset: 2px;
	}
</style>
