<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import Chart from 'chart.js/auto';

	interface Props {
		score?: number;
		websiteData?: any;
		animateOnResultLoad?: boolean;
		chartHeight?: string;
	}

	let {
		score,
		websiteData = null,
		animateOnResultLoad = false,
		chartHeight = '400px'
	} = $props<Props>();

	let chartContainer: HTMLElement;
	let chartCanvas: HTMLCanvasElement;
	let chart: Chart;
	let animationProgress = $state(0);
	let isAnimating = $state(true);
	let chartLoaded = $state(false);

	// State for interactions
	let hoveredMetric = $state(-1);
	let activeMetric = $state(-1);

	// Animation tweened value
	const animationTween = tweened(0, {
		duration: 1500,
		easing: cubicOut
	});

	// Data calculations (keep existing getMetricsData logic)
	const metrics = $derived(getMetricsData());
	const averageValue = metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length;

	function getMetricsData() {
		// Default-Werte für den Fall, dass keine Website-Daten vorhanden sind
		const defaultMetrics = [
			{
				label: 'SEO',
				value: Math.min(Math.round((score || 70) * 0.9), 100),
				icon: '🔍',
				color: '#4CAF50',
				category: 'lighthouse'
			},
			{
				label: 'Performance',
				value: Math.min(Math.round((score || 70) * 0.8), 100),
				icon: '⚡',
				color: '#2196F3',
				category: 'lighthouse'
			},
			{
				label: 'Zugänglichkeit',
				value: Math.min(Math.round((score || 70) * 0.7), 100),
				icon: '♿',
				color: '#FF9800',
				category: 'lighthouse'
			},
			{
				label: 'Best Practices',
				value: Math.min(Math.round((score || 70) * 0.85), 100),
				icon: '✓',
				color: '#F44336',
				category: 'lighthouse'
			},
			{
				label: 'Content',
				value: Math.min(Math.round((score || 70) * 0.75), 100),
				icon: '📝',
				color: '#9C27B0',
				category: 'custom'
			},
			{
				label: 'Sicherheit',
				value: Math.min(Math.round((score || 70) * 0.95), 100),
				icon: '🔒',
				color: '#00BCD4',
				category: 'security'
			}
		];

		// Wenn echte Website-Daten vorhanden sind
		if (websiteData) {
			try {
				// Lighthouse-Daten verarbeiten
				if (websiteData?.lighthouse_report?.categories) {
					const lh = websiteData.lighthouse_report.categories;

					defaultMetrics.forEach((metric) => {
						if (metric.category === 'lighthouse' && lh[metric.label.toLowerCase()]) {
							metric.value = Math.round(lh[metric.label.toLowerCase()].score * 100);
						}
					});
				}

				// Sicherheitsheader verarbeiten
				if (websiteData?.security_headers) {
					const securityMetric = defaultMetrics.find((m) => m.label === 'Sicherheit');
					if (securityMetric) {
						const gradeMap: Record<string, number> = {
							'A+': 100,
							A: 95,
							B: 85,
							C: 75,
							D: 65,
							F: 50
						};

						const grade = websiteData.security_headers.grade?.toUpperCase();
						securityMetric.value = gradeMap[grade] || 80;

						// Zusätzliche Bonuspunkte für Features
						if (websiteData.security_headers.features) {
							const bonusPoints = Math.min(
								Object.values(websiteData.security_headers.features).filter((v) => v).length * 2,
								10
							);
							securityMetric.value = Math.min(securityMetric.value + bonusPoints, 100);
						}
					}
				}

				// Content-Qualität berechnen
				const contentMetric = defaultMetrics.find((m) => m.label === 'Content');
				if (contentMetric && websiteData?.content_analysis) {
					const contentData = websiteData.content_analysis;
					const factors = {
						readability: 0.4,
						keywordDensity: 0.3,
						freshness: 0.2,
						multimedia: 0.1
					};

					contentMetric.value = Math.round(
						contentData.readability_score * factors.readability +
							(contentData.optimal_keyword_density ? factors.keywordDensity * 100 : 0) +
							contentData.freshness * factors.freshness * 100 +
							(contentData.has_images + contentData.has_videos) * factors.multimedia * 50
					);
				}
			} catch (error) {
				console.error('Fehler bei der Verarbeitung der Website-Daten:', error);
				// Fallback auf Default-Werte bei Fehlern
				return defaultMetrics.map((m) => ({
					...m,
					value: Math.min(m.value, 100)
				}));
			}
		}

		// Endgültige Werte begrenzen
		return defaultMetrics.map((metric) => ({
			...metric,
			value: Math.min(Math.max(metric.value, 0), 100)
		}));
	}

	// Chart configuration
	const chartConfig = {
		type: 'line',
		data: {
			labels: metrics.map((m) => m.label),
			datasets: [
				{
					label: 'Aktueller Wert',
					data: metrics.map((m) => 0),
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
			interaction: {
				mode: 'nearest',
				intersect: false
			},
			scales: {
				y: {
					min: 0,
					max: 100,
					ticks: {
						stepSize: 20,
						color: '#6B7280'
					},
					grid: {
						color: 'rgba(209, 213, 219, 0.2)'
					}
				},
				x: {
					ticks: {
						color: '#6B7280',
						font: {
							weight: '500'
						}
					},
					grid: {
						display: false
					}
				}
			},
			plugins: {
				legend: {
					position: 'top',
					labels: {
						color: '#374151',
						padding: 20,
						boxWidth: 12,
						font: {
							size: 14
						}
					}
				},
				tooltip: {
					backgroundColor: '#1F2937',
					titleColor: '#E5E7EB',
					bodyColor: '#E5E7EB',
					borderColor: '#4B5563',
					borderWidth: 1,
					cornerRadius: 8,
					padding: 12,
					callbacks: {
						label: (context) => {
							const label = context.dataset.label || '';
							const value = context.parsed.y;
							return `${label}: ${value}/100`;
						}
					}
				}
			},
			animation: {
				duration: 1200,
				easing: 'easeOutQuart'
			}
		}
	};

	function initChart() {
		if (!chartCanvas) return;

		const ctx = chartCanvas.getContext('2d');
		if (!ctx) return;

		chart = new Chart(ctx, chartConfig);
		startAnimation();
	}

	function startAnimation() {
		isAnimating = true;
		animationTween.set(0);
		animationTween.set(1, { duration: 1500 }).then(() => (isAnimating = false));
	}

	$effect(() => {
		if (chart && !isAnimating) {
			const values = metrics.map((m) => m.value * $animationTween);
			chart.data.datasets[0].data = values;
			chart.update();
		}
	});

	function highlightPoint(index: number) {
		if (chart) {
			const meta = chart.getDatasetMeta(0);
			meta.data.forEach((point, i) => {
				const element = point as any;
				element.options.radius = i === index ? 8 : 5;
				element.options.backgroundColor = i === index ? metrics[i].color : '#fff';
			});
			chart.update();
		}
	}

	onMount(() => {
		if (chartCanvas) {
			initChart();
			chartLoaded = true;
		}
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});
</script>

<div class="performance-chart relative rounded-xl bg-white p-6 shadow-lg">
	<div class="chart-container w-full" style="height: {chartHeight};" bind:this={chartContainer}>
		<canvas bind:this={chartCanvas} />
	</div>

	<!-- Metric Indicators -->
	<div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
		{#each metrics as metric, i}
			<div
				class="group relative cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-{metric.color} hover:shadow-md"
				on:mouseenter={() => {
					hoveredMetric = i;
					highlightPoint(i);
				}}
				on:mouseleave={() => {
					hoveredMetric = -1;
					highlightPoint(-1);
				}}
				style="border-top: 3px solid {metric.color}"
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

	{#if !chartLoaded}
		<div class="absolute inset-0 flex items-center justify-center bg-white/80">
			<div class="flex items-center space-x-3 text-gray-600">
				<svg
					class="h-6 w-6 animate-spin"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<span>Lade Diagramm...</span>
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
