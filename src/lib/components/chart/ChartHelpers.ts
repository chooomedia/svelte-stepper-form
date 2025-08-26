// src/lib/components/chart/ChartHelpers.ts
import type { Metric } from './ChartMetrics';
import type { ChartLifecycleState } from './ChartLifecycle';
import { updateChartDataWithAnimation } from './ChartAnimations';

export interface ChartHelpersContext {
	lifecycleState: ChartLifecycleState;
	metrics: Metric[];
	animationTween: number;
	averageValue: number;
	chartColors: any;
	chartCanvas: HTMLCanvasElement | null;
	score: number;
	auditData: any;
	calculateMetrics: () => void;
	initializeChart: () => Promise<void>;
}

export function createChartHelpers(context: ChartHelpersContext) {
	return {
		// Update chart data with current metrics
		updateChartData: () => {
			updateChartDataWithAnimation(
				context.lifecycleState.chart,
				context.metrics,
				context.animationTween,
				context.averageValue
			);

			// Update chart colors when effectiveScore changes
			if (context.lifecycleState.chart) {
				context.lifecycleState.chart.data.datasets[0].borderColor = context.chartColors.current;
				context.lifecycleState.chart.data.datasets[0].backgroundColor = `${context.chartColors.current}20`;
			}
		},

		// Effect for handling props changes
		handlePropsChange: () => {
			// Create a local copy to avoid reactivity issues
			const currentScore = context.score;
			const currentAuditData = context.auditData;

			console.log('Props changed, recalculating', {
				currentScore,
				currentAuditData
			});

			// Only update if we have meaningful changes
			if (
				context.lifecycleState.effectiveScore !== currentScore ||
				JSON.stringify(currentAuditData) !== JSON.stringify(context.lifecycleState.storeData)
			) {
				context.lifecycleState.effectiveScore = currentScore;

				// Don't call calculateMetrics() here as it may trigger another effect
				// Just set a flag and handle the calculation in a separate effect
				context.lifecycleState.needsRecalculation = true;
			}
		},

		// Effect for chart initialization
		handleChartInitialization: () => {
			const currentMetricsLength = context.metrics.length;
			const hasCanvas = !!context.chartCanvas;
			const hasExistingChart = !!context.lifecycleState.chart;

			if (currentMetricsLength > 0 && hasCanvas && !hasExistingChart) {
				console.log('Metrics ready and canvas available, initializing chart');
				// Use setTimeout to break potential update cycles
				setTimeout(() => {
					context.initializeChart();
				}, 0);
			}
		}
	};
}

export function createChartEffects(chartHelpers: ReturnType<typeof createChartHelpers>) {
	return {
		// Update chart when animation values change
		animationEffect: () => {
			// Animation effect logic can be added here if needed
		},

		// Recalculation effect
		recalculationEffect: () => {
			// Recalculation effect logic can be added here if needed
		},

		// Props change effect
		propsChangeEffect: () => {
			chartHelpers.handlePropsChange();
		},

		// Chart initialization effect
		chartInitializationEffect: () => {
			chartHelpers.handleChartInitialization();
		}
	};
}
