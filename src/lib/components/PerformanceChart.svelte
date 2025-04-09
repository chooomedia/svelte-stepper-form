<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import Chart from 'chart.js/auto';
	import { scoreStore } from '$lib/utils/scoring';
	import { i18n } from '$lib/i18n';
	import Icon from './Icon.svelte';

	type Metric = {
		label: string;
		value: number;
		improvedValue: number;
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

	const seoLabel = $derived($i18n.schema.metrics?.seo?.label || 'SEO');
	const performanceLabel = $derived($i18n.schema.metrics?.performance?.label || 'Performance');
	const accessibilityLabel = $derived(
		$i18n.schema.metrics?.accessibility?.label || 'Zugänglichkeit'
	);
	const bestPracticesLabel = $derived(
		$i18n.schema.metrics?.bestPractices?.label || 'Best Practices'
	);
	const contentLabel = $derived($i18n.schema.metrics?.content?.label || 'Content');
	const securityLabel = $derived($i18n.schema.metrics?.security?.label || 'Sicherheit');

	// Labels für die Legende
	const currentValueLabel = $derived($i18n.schema.metrics?.currentValue || 'Aktueller Wert');
	const improvedValueLabel = $derived($i18n.schema.metrics?.improvedValue || 'Nach Optimierung');
	const averageLabel = $derived($i18n.schema.metrics?.average || 'Durchschnitt');
	const optimalLabel = $derived($i18n.schema.metrics?.optimal || 'Optimalwert');

	// State variables
	let isAnimating = $state(true);
	let chartLoaded = $state(false);
	let storeData = $state(null);
	let storeScore = $state(0);
	let effectiveScore = $state(score);
	let metrics = $state<Metric[]>([]);
	let averageValue = $state(0);
	let improvedAverageValue = $state(0);
	let needsRecalculation = $state(false);

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
		// Now including improvedValue for each metric
		const baseMetrics: Metric[] = [
			{
				label: seoLabel,
				value: Math.round(clampedScore * 0.9),
				improvedValue: Math.min(95, Math.round(clampedScore * 0.9 * 1.5)), // Improved value capped at 95
				color: '#4CAF50',
				category: 'lighthouse'
			},
			{
				label: performanceLabel,
				value: Math.round(clampedScore * 0.8),
				improvedValue: Math.min(95, Math.round(clampedScore * 0.8 * 1.6)),
				color: '#2196F3',
				category: 'lighthouse'
			},
			{
				label: accessibilityLabel,
				value: Math.round(clampedScore * 0.7),
				improvedValue: Math.min(95, Math.round(clampedScore * 0.7 * 1.7)),
				color: '#FF9800',
				category: 'lighthouse'
			},
			{
				label: bestPracticesLabel,
				value: Math.round(clampedScore * 0.85),
				improvedValue: Math.min(95, Math.round(clampedScore * 0.85 * 1.5)),
				color: '#F44336',
				category: 'lighthouse'
			},
			{
				label: contentLabel,
				value: Math.round(clampedScore * 0.75),
				improvedValue: Math.min(95, Math.round(clampedScore * 0.75 * 1.6)),
				color: '#9C27B0',
				category: 'content'
			},
			{
				label: securityLabel,
				value: Math.round(clampedScore * 0.95),
				improvedValue: Math.min(98, Math.round(clampedScore * 0.95 * 1.2)),
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
						// Wir vereinfachen die Zuordnung durch Verwendung von Lowercase
						const metricKey = metric.label
							.toLowerCase()
							.replace(/ä/g, 'a')
							.replace(/ü/g, 'u')
							.replace(/ö/g, 'o')
							.replace(/\s+/g, '');

						if (dataToUse.metrics[metricKey] !== undefined) {
							metric.value = dataToUse.metrics[metricKey];
							// Auch die verbesserten Werte anpassen - min. 20% besser, max. 95 Punkte
							metric.improvedValue = Math.min(
								95,
								Math.round(metric.value * (1.2 + Math.random() * 0.3))
							);
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
							const categoryKey = metric.label
								.toLowerCase()
								.replace(/ä/g, 'a')
								.replace(/ü/g, 'u')
								.replace(/ö/g, 'o')
								.replace(/\s+/g, '');

							const score = categories[categoryKey]?.score;

							if (typeof score === 'number') {
								const metricValue = Math.round(score * 100);
								metric.value = metricValue;
								metric.improvedValue = Math.min(
									95,
									Math.round(metricValue * (1.2 + Math.random() * 0.3))
								);
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
						const seoMetric = baseMetrics.find((m) => m.label === $i18n.schema.metrics.seo.label);
						if (seoMetric) {
							seoMetric.value = dataToUse.detailed_scores.title;
							seoMetric.improvedValue = Math.min(95, Math.round(seoMetric.value * 1.4));
						}
					}

					if (dataToUse.detailed_scores.meta_description) {
						const contentMetric = baseMetrics.find(
							(m) => m.label === $i18n.schema.metrics.content.label
						);
						if (contentMetric) {
							contentMetric.value = dataToUse.detailed_scores.meta_description;
							contentMetric.improvedValue = Math.min(95, Math.round(contentMetric.value * 1.5));
						}
					}

					if (dataToUse.detailed_scores.alt_attributes) {
						const accessibilityMetric = baseMetrics.find(
							(m) => m.label === $i18n.schema.metrics.accessibility.label
						);
						if (accessibilityMetric) {
							accessibilityMetric.value = dataToUse.detailed_scores.alt_attributes;
							accessibilityMetric.improvedValue = Math.min(
								95,
								Math.round(accessibilityMetric.value * 1.6)
							);
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
			value: Math.min(Math.max(metric.value, 0), 100),
			improvedValue: Math.min(Math.max(metric.improvedValue, 0), 100)
		}));

		// Calculate averages
		averageValue = metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length || 0;
		improvedAverageValue =
			metrics.reduce((acc, m) => acc + m.improvedValue, 0) / metrics.length || 0;

		console.log('Final metrics:', metrics);
		console.log('Average values - Current:', averageValue, 'Improved:', improvedAverageValue);

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
						label: currentValueLabel,
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
						label: improvedValueLabel,
						data: metrics.map((m) => m.improvedValue * $animationTween),
						borderColor: '#8B5CF6', // Purple color for improvement
						backgroundColor: 'rgba(139, 92, 246, 0.1)',
						tension: 0.3,
						fill: true,
						pointBackgroundColor: '#8B5CF6',
						pointBorderColor: '#fff',
						pointRadius: 4,
						pointHoverRadius: 6
					},
					{
						label: averageLabel,
						data: metrics.map(() => averageValue),
						borderColor: '#F59E0B',
						borderDash: [5, 5],
						borderWidth: 1.5,
						pointRadius: 0
					},
					{
						label: optimalLabel,
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
			[$i18n.schema.metrics.seo.label]: 75,
			[$i18n.schema.metrics.performance.label]: 82,
			[$i18n.schema.metrics.accessibility.label]: 70,
			[$i18n.schema.metrics.bestPractices.label]: 85,
			[$i18n.schema.metrics.content.label]: 78,
			[$i18n.schema.metrics.security.label]: 90
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

		// Update improved values dataset
		if (chart.data.datasets.length > 1) {
			chart.data.datasets[1].data = metrics.map((m) => m.improvedValue * $animationTween);
		}

		// Update average line
		const avgDatasetIndex = 2;
		if (chart.data.datasets[avgDatasetIndex]) {
			chart.data.datasets[avgDatasetIndex].data = metrics.map(() => averageValue);
		}

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

			// Update improved values
			if (chart.data.datasets.length > 1) {
				chart.data.datasets[1].data = metrics.map((m) => m.improvedValue * $animationTween);
			}

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

		console.log('Props changed, recalculating', {
			currentScore,
			currentAuditData
		});

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
		{#each [currentValueLabel, improvedValueLabel, averageLabel, optimalLabel] as legendItem, i}
			<div
				class="flex cursor-pointer items-center transition-opacity hover:opacity-75"
				on:mouseenter={() => {
					if (chart) {
						// Verstecke alle Linien außer der entsprechenden Linie
						chart.data.datasets.forEach((dataset, index) => {
							// Setze die Sichtbarkeit nach Index
							const isVisible = index === i;
							chart.setDatasetVisibility(index, isVisible);
						});
						chart.update();
					}
				}}
				on:mouseleave={() => {
					if (chart) {
						// Stelle alle Datensätze wieder her
						chart.data.datasets.forEach((dataset, index) => {
							chart.setDatasetVisibility(index, true);
						});
						chart.update();
					}
				}}
			>
				{#if i === 0}
					<div class="mr-2 h-3 w-8 rounded-sm bg-blue-500 opacity-50"></div>
					<span class="text-sm text-gray-600">{currentValueLabel}</span>
				{:else if i === 1}
					<div class="mr-2 h-3 w-8 rounded-sm bg-purple-500 opacity-50"></div>
					<span class="text-sm text-gray-600">{improvedValueLabel}</span>
				{:else if i === 2}
					<div class="mr-2 h-0.5 w-8 border-t-2 border-dashed border-yellow-500"></div>
					<span class="text-sm text-gray-600">{averageLabel} ({Math.round(averageValue)})</span>
				{:else}
					<div class="mr-2 h-0.5 w-8 border-t-2 border-dashed border-green-500"></div>
					<span class="text-sm text-gray-600">{optimalLabel} (95)</span>
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
				class="group relative cursor-pointer rounded-md border border-gray-200 bg-white p-2 transition-all hover:shadow-md"
				style="border-top: 3px solid {metric.color};"
				on:mouseenter={() => {
					if (chart) {
						// Finde den entsprechenden Datenpunkt im Chart
						chart.setActiveElements([
							{ datasetIndex: 0, index: i },
							{ datasetIndex: 1, index: i }
						]);

						// Aktiviere den Tooltip für diesen Punkt
						const meta = chart.getDatasetMeta(0);
						if (meta.data[i]) {
							const position = meta.data[i].getCenterPoint();
							chart.tooltip.setActiveElements([{ datasetIndex: 0, index: i }], {
								x: position.x,
								y: position.y
							});
						}
						chart.update();
					}
				}}
				on:mouseleave={() => {
					if (chart) {
						// Entferne Hervorhebung
						chart.setActiveElements([]);
						// Verstecke Tooltip
						chart.tooltip.setActiveElements([], { x: 0, y: 0 });
						chart.update();
					}
				}}
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
						<span class="ml-1 flex items-center text-sm font-medium text-purple-600">
							<Icon name="improvement" size={20} stroke="none" />
							{Math.round(metric.improvedValue * $animationTween)}
						</span>
					</div>

					<!-- Improved Value Progress -->
					<div class="mt-1 h-2 rounded-full bg-gray-100">
						<div
							class="h-2 rounded-full bg-purple-500 transition-all duration-500"
							style="width: {metric.improvedValue * $animationTween}%;"
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
				class="spinner h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
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

	/* Animation for improved value indicator */
	@keyframes pulse {
		0%,
		100% {
			opacity: 0.7;
		}
		50% {
			opacity: 1;
		}
	}

	.improvement-indicator {
		animation: pulse 2s infinite;
	}
</style>
