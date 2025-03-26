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
		auditData?: Partial<App.AuditData>;
		animateOnResultLoad?: boolean;
		chartHeight?: string;
	}

	const DEFAULT_SCORE = 50;
	const MAX_LOAD_ATTEMPTS = 3;
	const DEMO_LOAD_DELAY = 2000;

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
	let initialRender = $state(true);
	let loadingTimeout = $state<number>();
	let noDataAvailable = $state(false);
	let loadAttempts = $state(0);
	let hoveredMetric = $state();

	const clampedScore = $derived(Math.min(Math.max(score || DEFAULT_SCORE, 0, 100)));
	const animationTween = tweened(0, { duration: 1500, easing: cubicOut });

	// Data handling
	const metrics = $derived(getMetricsData());
	const averageValue = $derived(metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length || 0);
	const hasValidData = $derived(metrics.some((m) => m.value > 0));

	// Chart configuration
	const chartConfig: ChartConfiguration = {
		type: 'line',
		data: {
			labels: metrics.map((m) => m.label),
			datasets: [
				{
					label: 'Aktueller Wert',
					data: metrics.map(() => 0),
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
					ticks: { color: '#6B7280', font: { weight: '500' } },
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

	function getMetricsData(): Metric[] {
		const baseMetrics: Metric[] = [
			createMetric('SEO', 0.9, '#4CAF50', 'lighthouse'),
			createMetric('Performance', 0.8, '#2196F3', 'lighthouse'),
			createMetric('Zugänglichkeit', 0.7, '#FF9800', 'lighthouse'),
			createMetric('Best Practices', 0.85, '#F44336', 'lighthouse'),
			createMetric('Content', 0.75, '#9C27B0', 'content'),
			createMetric('Sicherheit', 0.95, '#00BCD4', 'security')
		];

		if (auditData?.lighthouse_report) {
			applyLighthouseData(baseMetrics);
		}

		return baseMetrics.map(normalizeMetric);
	}

	function createMetric(
		label: string,
		multiplier: number,
		color: string,
		category: string
	): Metric {
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
					const score =
						auditData.lighthouse_report?.categories?.[metric.label.toLowerCase()]?.score;
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

	async function loadInitialData() {
		if (loadAttempts >= MAX_LOAD_ATTEMPTS) return;

		loadAttempts++;
		await tick();

		const demoData = [
			{ label: 'SEO', value: 85 },
			{ label: 'Performance', value: 72 },
			{ label: 'Zugänglichkeit', value: 68 },
			{ label: 'Best Practices', value: 90 },
			{ label: 'Content', value: 65 },
			{ label: 'Sicherheit', value: 78 }
		];

		const updatedMetrics = [...metrics];
		demoData.forEach((item, index) => {
			if (index < updatedMetrics.length) {
				updatedMetrics[index].value = item.value;
			}
		});

		metrics.forEach((m, i) => {
			if (demoData[i]) m.value = demoData[i];
		});
	}

	async function initializeChart() {
		if (!chartCanvas) return;

		try {
			const ctx = chartCanvas.getContext('2d');
			if (!ctx) throw new Error('Canvas context not available');

			chart = new Chart(ctx, chartConfig);
			await startAnimation();
			chartLoaded = true;
		} catch (error) {
			console.error('Chart initialization failed:', error);
			noDataAvailable = true;
		}
	}

	async function startAnimation() {
		isAnimating = true;
		await animationTween.set(0);
		await animationTween.set(1);
		isAnimating = false;
	}

	function handleDataLoad() {
		if (!hasValidData) {
			loadingTimeout = setTimeout(() => {
				noDataAvailable = true;
			}, DEMO_LOAD_DELAY);
		}
	}

	$effect(() => {
		if (chart) {
			chart.data.datasets[0].data = metrics.map((m) => m.value * $animationTween);
			chart.data.datasets[1].data = metrics.map(() => averageValue);
			chart.update('none');
		}
	});

	onMount(async () => {
		await initializeChart();
		initialRender = false;
		handleDataLoad();
	});

	onDestroy(() => {
		chart?.destroy();
		clearTimeout(loadingTimeout);
	});
</script>

<div class="performance-chart relative rounded-xl bg-white p-6 shadow-lg">
	<!-- Benutzerdefinierte Legende ÜBER dem Chart -->
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
				class="group relative cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all {hoveredMetric ===
				i
					? 'ring-2 ring-offset-1'
					: ''}"
				style="border-top: 3px solid {metric.color}; {hoveredMetric === i
					? `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);`
					: ''}"
				on:mouseenter={() => {
					if (chart && i === 0) {
						// Richtiger Ansatz zur Interaktion mit dem Chart
						hoveredMetric = -1;
						highlightPoint(-1);
					}
				}}
				on:mouseleave={() => {
					hoveredMetric = -1;
					highlightPoint(-1);
				}}
				on:click={() => {
					// Toggle selection state
					if (hoveredMetric === i) {
						hoveredMetric = -1;
						highlightPoint(-1);
					} else {
						hoveredMetric = i;
						highlightPoint(i);
					}
				}}
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

	<!-- Loading Overlay -->
	{#if !chartLoaded || (!hasRealData && noDataAvailable)}
		<div class="absolute inset-0 flex flex-col items-center justify-center bg-white/90">
			<div class="flex flex-col items-center space-y-6 text-gray-600">
				{#if !chartLoaded}
					<div class="spinner animate-spin"></div>
					<p class="text-lg text-gray-600">Lade Diagramm...</p>
				{:else if noDataAvailable}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-16 w-16 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<p class="text-lg text-gray-600">Keine Daten verfügbar</p>
				{:else}
					<div class="spinner animate-spin"></div>
					<p class="text-lg text-gray-600">Lade Diagramm...</p>
				{/if}

				<!-- Button zum Laden von Demo-Daten -->
				<button
					type="button"
					class="relative mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-95 active:transform active:bg-blue-800"
					on:click={(e) => {
						e.preventDefault();
						loadInitialData();
					}}
				>
					<span class="flex items-center gap-2">
						{#if isAnimating}
							<svg
								class="h-5 w-5 animate-spin text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Laden...
						{:else}
							{noDataAvailable ? 'Demo-Daten laden' : 'Daten neu laden'}
						{/if}
					</span>
				</button>
			</div>
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
