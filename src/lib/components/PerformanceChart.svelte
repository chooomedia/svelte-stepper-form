<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import Chart, { type ChartConfiguration } from 'chart.js/auto';

	type Metric = {
		label: string;
		value: number;
		color: string;
		category: string;
	};

	interface Props {
		score?: number;
		auditData?: any;
		animateOnResultLoad?: boolean;
		chartHeight?: string;
	}

	const DEFAULT_SCORE = 50;

	let {
		score = DEFAULT_SCORE,
		auditData = null,
		animateOnResultLoad = false,
		chartHeight = '400px'
	} = $props<Props>();

	let chartContainer: HTMLElement;
	let chartCanvas: HTMLCanvasElement;
	let chart: Chart;
	let isAnimating = $state(true);
	let chartLoaded = $state(false);
	let noDataAvailable = $state(false);

	// Data handling
	const metrics = $derived(getMetricsData());
	const averageValue = $derived(metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length || 0);

	// Create a clean metrics calculation function
	function getMetricsData(): Metric[] {
		// Ensure score is within bounds
		const clampedScore = Math.min(Math.max(score || DEFAULT_SCORE, 0), 100);

		// Create base metrics with default values
		const baseMetrics: Metric[] = [
			createMetric('SEO', 0.9, '#4CAF50', 'lighthouse'),
			createMetric('Performance', 0.8, '#2196F3', 'lighthouse'),
			createMetric('Zugänglichkeit', 0.7, '#FF9800', 'lighthouse'),
			createMetric('Best Practices', 0.85, '#F44336', 'lighthouse'),
			createMetric('Content', 0.75, '#9C27B0', 'content'),
			createMetric('Sicherheit', 0.95, '#00BCD4', 'security')
		];

		// Apply real data if available
		if (auditData?.lighthouse_report) {
			applyLighthouseData(baseMetrics);
		}

		return baseMetrics.map(normalizeMetric);
	}

	// Helper functions for metrics
	function createMetric(
		label: string,
		multiplier: number,
		color: string,
		category: string
	): Metric {
		const clampedScore = Math.min(Math.max(score || DEFAULT_SCORE, 0), 100);
		return {
			label,
			value: Math.min(Math.round(clampedScore * multiplier), 100),
			color,
			category
		};
	}

	function applyLighthouseData(metrics: Metric[]) {
		try {
			metrics.forEach((metric) => {
				if (metric.category === 'lighthouse') {
					const categoryName = metric.label.toLowerCase();
					const score = auditData.lighthouse_report?.categories?.[categoryName]?.score;
					if (typeof score === 'number') {
						metric.value = Math.round(score * 100);
					}
				}
			});
		} catch (error) {
			console.error('Error processing lighthouse data:', error);
		}
	}

	function normalizeMetric(metric: Metric): Metric {
		return {
			...metric,
			value: Math.min(Math.max(metric.value, 0), 100)
		};
	}

	// Chart initialization and animation
	const animationTween = tweened(0, { duration: 1500, easing: cubicOut });

	async function initializeChart() {
		if (!chartCanvas) return;

		const ctx = chartCanvas.getContext('2d');
		if (!ctx) return;

		// Destroy existing chart instance
		if (chart) {
			chart.destroy();
		}

		// Create chart with appropriate configuration
		chart = new Chart(ctx, getChartConfig());
		chartLoaded = true;

		await startAnimation();
	}

	function getChartConfig(): ChartConfiguration {
		return {
			type: 'line',
			data: {
				labels: metrics.map((m) => m.label),
				datasets: [
					{
						label: 'Aktueller Wert',
						data: metrics.map((m) => m.value * $animationTween),
						borderColor: '#3B82F6',
						backgroundColor: 'rgba(59, 130, 246, 0.1)',
						tension: 0.3,
						fill: true,
						pointBackgroundColor: metrics.map((m) => m.color),
						pointBorderColor: '#fff',
						pointRadius: 5,
						pointHoverRadius: 8
					},
					{
						label: 'Durchschnitt',
						data: metrics.map(() => averageValue),
						borderColor: '#F59E0B',
						borderDash: [5, 5],
						borderWidth: 1.5,
						pointRadius: 0
					},
					{
						label: 'Optimalwert',
						data: metrics.map(() => 95),
						borderColor: '#10B981',
						borderDash: [3, 3],
						borderWidth: 1.5,
						pointRadius: 0
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: { mode: 'nearest', intersect: false },
				scales: {
					y: {
						min: 0,
						max: 100,
						ticks: { stepSize: 20, color: '#6B7280' },
						grid: { color: 'rgba(209, 213, 219, 0.2)' }
					},
					x: {
						ticks: { color: '#6B7280', font: { weight: 'normal' } },
						grid: { display: false }
					}
				},
				plugins: {
					legend: { display: false },
					tooltip: {
						backgroundColor: '#1F2937',
						titleColor: '#E5E7EB',
						bodyColor: '#E5E7EB',
						borderColor: '#4B5563',
						callbacks: {
							label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}/100`
						}
					}
				},
				animation: { duration: 1200, easing: 'easeOutQuart' }
			}
		};
	}

	async function startAnimation() {
		isAnimating = true;
		await animationTween.set(0);
		await animationTween.set(1);
		isAnimating = false;
	}

	// Update chart data when animationTween changes
	$effect(() => {
		if (chart) {
			chart.data.datasets[0].data = metrics.map((m) => m.value * $animationTween);
			chart.data.datasets[1].data = metrics.map(() => averageValue);
			chart.update('none');
		}
	});

	// Update chart when score or auditData changes
	$effect(() => {
		if (chart && chartLoaded) {
			// Recalculate metrics with new data
			const updatedMetrics = getMetricsData();
			const updatedAverage =
				updatedMetrics.reduce((acc, m) => acc + m.value, 0) / updatedMetrics.length || 0;

			// Update chart data
			chart.data.datasets[0].data = updatedMetrics.map((m) => m.value * $animationTween);
			chart.data.datasets[1].data = updatedMetrics.map(() => updatedAverage);
			chart.data.datasets[0].backgroundColor = updatedMetrics.map((m) => m.color);

			chart.update('none');

			// Restart animation
			startAnimation();
		}
	});

	// Initialize chart on mount
	onMount(async () => {
		await tick();
		await initializeChart();
	});

	// Clean up on destroy
	onDestroy(() => {
		chart?.destroy();
	});

	// Function to highlight specific data point
	function highlightPoint(index: number) {
		if (!chart) return;

		if (index >= 0 && index < metrics.length) {
			chart.setActiveElements([
				{
					datasetIndex: 0,
					index
				}
			]);
		} else {
			chart.setActiveElements([]);
		}

		chart.update('none');
	}
</script>

<div class="performance-chart relative rounded-xl bg-white p-6 shadow-lg">
	<!-- Custom legend above the chart -->
	<div class="mb-4 flex flex-wrap items-center justify-center gap-6">
		{#each ['Aktueller Wert', 'Durchschnitt', 'Optimalwert'] as legendItem, i}
			<div
				class="flex cursor-pointer items-center transition-opacity hover:opacity-75"
				on:mouseenter={() => {
					if (i === 0) {
						chart?.setActiveElements([]);
						chart?.update('none');
					}
				}}
			>
				{#if i === 0}
					<div class="mr-2 h-3 w-8 rounded-sm bg-blue-500 opacity-50"></div>
					<span class="text-sm text-gray-600">Aktueller Wert</span>
				{:else if i === 1}
					<div class="mr-2 h-0.5 w-8 border-t-2 border-dashed border-yellow-500"></div>
					<span class="text-sm text-gray-600">Durchschnitt ({Math.round(averageValue)})</span>
				{:else}
					<div class="mr-2 h-0.5 w-8 border-t-2 border-dashed border-green-500"></div>
					<span class="text-sm text-gray-600">Optimalwert (95)</span>
				{/if}
			</div>
		{/each}
	</div>

	<div class="chart-container w-full" style="height: {chartHeight};" bind:this={chartContainer}>
		<canvas bind:this={chartCanvas} />
	</div>

	<!-- Metric Indicators -->
	<div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
		{#each metrics as metric, i}
			<div
				class="group relative cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all"
				style="border-top: 3px solid {metric.color};"
				on:mouseenter={() => highlightPoint(i)}
				on:mouseleave={() => highlightPoint(-1)}
			>
				<div class="flex items-baseline">
					<span class="text-2xl font-bold text-gray-900">
						{Math.round(metric.value * $animationTween)}
					</span>
					<span class="ml-1 text-sm text-gray-500"> / 100</span>
				</div>
				<div class="mt-2 h-2 rounded-full bg-gray-100">
					<div
						class="h-2 rounded-full transition-all duration-500"
						style="width: {metric.value * $animationTween}%; background-color: {metric.color}"
					/>
				</div>
			</div>
		{/each}
	</div>

	<!-- Loading overlay -->
	{#if !chartLoaded}
		<div class="absolute inset-0 flex flex-col items-center justify-center bg-white/90">
			<div class="spinner animate-spin"></div>
			<p class="mt-4 text-lg text-gray-600">Lade Diagramm...</p>
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
</style>
