<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import Chart from 'chart.js/auto';
	import { scoreStore } from '$lib/utils/scoring';

	type Metric = {
		label: string;
		value: number;
		color: string;
		category: string;
	};

	// Define props using $props
	interface Props {
		score?: number;
		auditData?: any;
		animateOnResultLoad?: boolean;
		chartHeight?: string;
	}

	let {
		score = 50,
		auditData = null,
		animateOnResultLoad = false,
		chartHeight = '456px'
	} = $props<Props>();

	// DOM references
	let chartContainer: HTMLElement;
	let chartCanvas: HTMLCanvasElement;
	let chart: Chart;

	// State variables
	let isAnimating = $state(true);
	let chartLoaded = $state(false);
	let storeData = $state(null);
	let storeScore = $state(0);
	let effectiveScore = $state(score);
	let metrics = $state<Metric[]>([]);
	let averageValue = $state(0);
	let needsRecalculation = $state(false); // Flag to control recalculations

	// Animation control
	const animationTween = tweened(1, { duration: 1500, easing: cubicOut });

	// Subscribe to the score store for consistent data
	onMount(() => {
		console.log('PerformanceChart mounted with props:', { score, auditData });

		const unsubscribe = scoreStore.subscribe((state) => {
			console.log('ScoreStore updated:', state);

			// Use local variables to avoid reactivity issues
			const newStoreData = state.auditData;
			const newStoreScore = state.finalScore;

			// Check if data actually changed to avoid unnecessary updates
			if (
				JSON.stringify(newStoreData) !== JSON.stringify(storeData) ||
				newStoreScore !== storeScore
			) {
				storeData = newStoreData;
				storeScore = newStoreScore;

				// Use store data if available and no explicit props provided
				if (storeData && (!auditData || Object.keys(auditData).length === 0)) {
					console.log('Using store auditData:', storeData);
					needsRecalculation = true;
				}

				// Use store score if available and no explicit score provided
				if (storeScore > 0 && (!score || score === 50)) {
					console.log('Using store score:', storeScore);
					effectiveScore = storeScore;
					needsRecalculation = true;
				}
			}
		});

		// Initial calculation
		calculateMetrics();

		return () => unsubscribe();
	});

	// Calculate metrics from available data
	function calculateMetrics() {
		console.log('Calculating metrics with:', {
			effectiveScore,
			auditData: auditData ? 'Present' : 'Missing',
			storeData: storeData ? 'Present' : 'Missing'
		});

		// Ensure score is within bounds
		const clampedScore = Math.min(Math.max(effectiveScore || 50, 0), 100);

		// Create base metrics with dynamic values based on score
		const baseMetrics: Metric[] = [
			{
				label: 'SEO',
				value: Math.round(clampedScore * 0.9),
				color: '#4CAF50',
				category: 'lighthouse'
			},
			{
				label: 'Performance',
				value: Math.round(clampedScore * 0.8),
				color: '#2196F3',
				category: 'lighthouse'
			},
			{
				label: 'Zugänglichkeit',
				value: Math.round(clampedScore * 0.7),
				color: '#FF9800',
				category: 'lighthouse'
			},
			{
				label: 'Best Practices',
				value: Math.round(clampedScore * 0.85),
				color: '#F44336',
				category: 'lighthouse'
			},
			{
				label: 'Content',
				value: Math.round(clampedScore * 0.75),
				color: '#9C27B0',
				category: 'content'
			},
			{
				label: 'Sicherheit',
				value: Math.round(clampedScore * 0.95),
				color: '#00BCD4',
				category: 'security'
			}
		];

		// Try to apply real data if available
		const dataToUse = auditData || storeData;

		try {
			if (dataToUse) {
				console.log('Processing audit data:', dataToUse);

				// Try to use metrics data first
				if (dataToUse.metrics && typeof dataToUse.metrics === 'object') {
					console.log('Using metrics from audit data:', dataToUse.metrics);

					// Map metrics back to our baseMetrics array
					baseMetrics.forEach((metric) => {
						switch (metric.label) {
							case 'SEO':
								if (dataToUse.metrics.seo !== undefined) {
									metric.value = dataToUse.metrics.seo;
								}
								break;
							case 'Performance':
								if (dataToUse.metrics.performance !== undefined) {
									metric.value = dataToUse.metrics.performance;
								}
								break;
							case 'Zugänglichkeit':
								if (dataToUse.metrics.accessibility !== undefined) {
									metric.value = dataToUse.metrics.accessibility;
								}
								break;
							case 'Best Practices':
								if (dataToUse.metrics.bestPractices !== undefined) {
									metric.value = dataToUse.metrics.bestPractices;
								}
								break;
							case 'Content':
								if (dataToUse.metrics.content !== undefined) {
									metric.value = dataToUse.metrics.content;
								}
								break;
							case 'Sicherheit':
								if (dataToUse.metrics.security !== undefined) {
									metric.value = dataToUse.metrics.security;
								}
								break;
						}
					});
				}
				// Otherwise try to use lighthouse data
				else if (dataToUse.lighthouse_report && dataToUse.lighthouse_report.categories) {
					console.log('Using lighthouse data:', dataToUse.lighthouse_report.categories);

					const categories = dataToUse.lighthouse_report.categories;

					// Update metrics from lighthouse data
					baseMetrics.forEach((metric) => {
						if (metric.category === 'lighthouse') {
							const categoryKey = metric.label.toLowerCase().replace(/ä/g, 'a').replace(/ü/g, 'u');
							const score = categories[categoryKey]?.score;

							if (typeof score === 'number') {
								metric.value = Math.round(score * 100);
								console.log(`Updated ${metric.label} to ${metric.value} from lighthouse data`);
							}
						}
					});
				}

				// Detailed scores can provide additional metrics
				if (dataToUse.detailed_scores) {
					console.log('Using detailed scores:', dataToUse.detailed_scores);

					// Map relevant detailed scores to our metrics
					if (dataToUse.detailed_scores.title) {
						const seoMetric = baseMetrics.find((m) => m.label === 'SEO');
						if (seoMetric) {
							seoMetric.value = dataToUse.detailed_scores.title;
						}
					}

					if (dataToUse.detailed_scores.meta_description) {
						const contentMetric = baseMetrics.find((m) => m.label === 'Content');
						if (contentMetric) {
							contentMetric.value = dataToUse.detailed_scores.meta_description;
						}
					}

					if (dataToUse.detailed_scores.alt_attributes) {
						const accessibilityMetric = baseMetrics.find((m) => m.label === 'Zugänglichkeit');
						if (accessibilityMetric) {
							accessibilityMetric.value = dataToUse.detailed_scores.alt_attributes;
						}
					}
				}
			} else {
				console.log('No audit data available, using score-based metrics');
			}
		} catch (error) {
			console.error('Error processing metric data:', error);
		}

		// Normalize all metric values to ensure they're in the valid range 0-100
		metrics = baseMetrics.map((metric) => ({
			...metric,
			value: Math.min(Math.max(metric.value, 0), 100)
		}));

		// Calculate average
		averageValue = metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length || 0;

		console.log('Final metrics:', metrics);
		console.log('Average value:', averageValue);

		// Update the chart if it exists
		updateChartData();
	}

	// Initialize Chart.js instance
	async function initializeChart() {
		if (!chartCanvas) {
			console.warn('Chart canvas not available');
			return;
		}

		const ctx = chartCanvas.getContext('2d');
		if (!ctx) {
			console.warn('Canvas context not available');
			return;
		}

		// Destroy existing chart instance if it exists
		if (chart) {
			chart.destroy();
		}

		console.log('Initializing chart with metrics:', metrics);

		// Create chart configuration with correct data
		const chartConfig = {
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
							label: (ctx) => {
								const value = ctx.parsed.y;
								const label = ctx.dataset.label || '';
								const benchmark = getBenchmarkValue(ctx.label);
								const comparison = value > benchmark ? 'über' : value < benchmark ? 'unter' : 'im';
								return `${label}: ${value}/100 (${comparison} Durchschnitt)`;
							}
						}
					}
				},
				animation: { duration: 1200, easing: 'easeOutQuart' }
			}
		};

		// Create the chart
		chart = new Chart(ctx, chartConfig);
		chartLoaded = true;

		// Start animation
		await startAnimation();
	}

	// Get benchmark value for a metric
	function getBenchmarkValue(label: string): number {
		const benchmarks = {
			SEO: 75,
			Performance: 82,
			Zugänglichkeit: 70,
			'Best Practices': 85,
			Content: 78,
			Sicherheit: 90
		};

		return benchmarks[label as keyof typeof benchmarks] || 75;
	}

	// Update chart data with current metrics
	function updateChartData() {
		if (!chart) return;

		console.log('Updating chart data with metrics:', metrics);

		chart.data.labels = metrics.map((m) => m.label);
		chart.data.datasets[0].data = metrics.map((m) => m.value * $animationTween);
		chart.data.datasets[0].pointBackgroundColor = metrics.map((m) => m.color);
		chart.data.datasets[1].data = metrics.map(() => averageValue);

		chart.update('none');
	}

	// Animation sequence
	async function startAnimation() {
		isAnimating = true;
		console.log('Starting animation sequence');

		// Reset animation
		await animationTween.set(0);

		// Animate to full value
		await animationTween.set(1);

		isAnimating = false;
	}

	// Update chart when animation values change
	$effect(() => {
		if (chart && metrics.length) {
			chart.data.datasets[0].data = metrics.map((m) => m.value * $animationTween);
			chart.update('none');
		}
	});

	$effect(() => {
		if (needsRecalculation) {
			console.log('Running deferred metric calculation');
			calculateMetrics();
			needsRecalculation = false;
		}
	});

	// Update everything when score or auditData changes
	$effect(() => {
		// Create a local copy to avoid reactivity issues
		const currentScore = score;
		const currentAuditData = auditData;

		console.log('Score or auditData changed, recalculating', { currentScore, currentAuditData });

		// Only update if we have meaningful changes
		if (
			effectiveScore !== currentScore ||
			JSON.stringify(currentAuditData) !== JSON.stringify(storeData)
		) {
			effectiveScore = currentScore;
			// Don't call calculateMetrics() here as it may trigger another effect
			// Just set a flag and handle the calculation in a separate effect
			needsRecalculation = true;
		}
	});

	// Initialize the chart once DOM is ready and metrics are calculated
	$effect(() => {
		const currentMetricsLength = metrics.length;
		const hasCanvas = !!chartCanvas;
		const hasExistingChart = !!chart;

		if (currentMetricsLength > 0 && hasCanvas && !hasExistingChart) {
			console.log('Metrics ready and canvas available, initializing chart');
			// Use setTimeout to break potential update cycles
			setTimeout(() => {
				initializeChart();
			}, 0);
		}
	});

	// Clean up on component destroy
	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});

	// Function to highlight specific data point
	function highlightPoint(index: number) {
		if (!chart) return;

		if (index >= 0 && index < metrics.length) {
			chart.setActiveElements([{ datasetIndex: 0, index }]);
		} else {
			chart.setActiveElements([]);
		}

		chart.update('none');
	}
</script>

<div class="performance-chart relative p-6">
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
	<div class="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
		{#each metrics as metric, i}
			<div
				class="group relative cursor-pointer rounded-lg border border-gray-200 bg-white p-2 transition-all"
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
			<div
				class="spinner h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
			></div>
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
