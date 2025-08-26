// src/lib/components/chart/ChartConfig.ts
import type { Metric } from './ChartMetrics';

export interface ChartColors {
	current: string;
	improved: string;
	average: string;
	optimal: string;
	pointBorder: string;
}

export interface ChartLabels {
	currentValue: string;
	improvedValue: string;
	average: string;
	optimal: string;
}

export function createChartConfig(
	metrics: Metric[],
	chartColors: ChartColors,
	chartLabels: ChartLabels,
	averageValue: number,
	animationTween: number
) {
	return {
		type: 'line' as const,
		data: {
			labels: metrics.map((m) => m.label),
			datasets: [
				{
					label: chartLabels.currentValue,
					data: metrics.map((m) => m.value * animationTween),
					borderColor: chartColors.current,
					backgroundColor: `${chartColors.current}50`, // 20% opacity
					tension: 0.5,
					fill: true,
					pointBackgroundColor: metrics.map((m) => m.color),
					pointBorderColor: chartColors.pointBorder,
					pointRadius: 5,
					pointHoverRadius: 8
				},
				{
					label: chartLabels.improvedValue,
					data: metrics.map((m) => m.improvedValue * animationTween),
					borderColor: chartColors.improved,
					backgroundColor: `${chartColors.improved}50`, // 20% opacity
					tension: 0.5,
					fill: true,
					pointBackgroundColor: chartColors.improved,
					pointBorderColor: chartColors.pointBorder,
					pointRadius: 4,
					pointHoverRadius: 6
				},
				{
					label: chartLabels.average,
					data: metrics.map(() => averageValue),
					borderColor: chartColors.average,
					borderDash: [5, 5],
					borderWidth: 1.5,
					pointRadius: 0
				},
				{
					label: chartLabels.optimal,
					data: metrics.map(() => 90),
					borderColor: chartColors.optimal,
					borderDash: [3, 3],
					borderWidth: 1.5,
					pointRadius: 0
				}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			interaction: { mode: 'nearest' as const, intersect: false },
			scales: {
				y: {
					min: 0,
					max: 100,
					ticks: { stepSize: 20, color: '#6B7280' },
					grid: { color: 'rgba(209, 213, 219, 0.2)' }
				},
				x: {
					ticks: { color: '#6B7280', font: { weight: 'normal' as const } },
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
						label: (ctx: any) => {
							const value = parseFloat(ctx.parsed.y.toFixed(2));
							const label = ctx.dataset.label || '';

							// Intelligente Tooltip-Beschreibung basierend auf Dataset
							if (ctx.dataset.label === chartLabels.currentValue) {
								// Für aktuelle Werte: Zeige nur "unter Durchschnitt" wenn nötig
								const benchmark = getBenchmarkForMetric(ctx.label);
								if (value < benchmark) {
									return `${label}: ${value}/100 (unter Durchschnitt)`;
								}
								return `${label}: ${value}/100`;
							} else if (ctx.dataset.label === chartLabels.improvedValue) {
								return `${label}: ${value}/100 (nach Optimierung)`;
							} else if (ctx.dataset.label === chartLabels.average) {
								return `${label}: ${value}/100 (Durchschnitt)`;
							} else if (ctx.dataset.label === chartLabels.optimal) {
								return `${label}: ${value}/100 (Optimal)`;
							}

							return `${label}: ${value}/100`;
						}
					}
				}
			},
			animation: { duration: 1200, easing: 'easeOutQuart' as const }
		}
	};
}

export function getBenchmarkForMetric(metricLabel: string): number {
	// Benchmark-Werte für verschiedene Metriken
	const benchmarks: Record<string, number> = {
		SEO: 70,
		Performance: 60,
		Zugänglichkeit: 80,
		'Best Practices': 75,
		Content: 65,
		Sicherheit: 85
	};

	return benchmarks[metricLabel] || 70;
}
