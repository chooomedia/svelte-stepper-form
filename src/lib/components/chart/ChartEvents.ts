// src/lib/components/chart/ChartEvents.ts
import Chart from 'chart.js/auto';
import type { Metric } from './ChartMetrics';

export function createChartEventHandlers(chart: Chart | null, metrics: Metric[]) {
	return {
		// Legend hover handlers
		onLegendMouseEnter: (index: number) => {
			if (chart) {
				// Verstecke alle Linien außer der entsprechenden Linie
				chart.data.datasets.forEach((dataset, i) => {
					// Setze die Sichtbarkeit nach Index
					const isVisible = i === index;
					chart.setDatasetVisibility(i, isVisible);
				});
				chart.update();
			}
		},

		onLegendMouseLeave: () => {
			if (chart) {
				// Stelle alle Datensätze wieder her
				chart.data.datasets.forEach((dataset, index) => {
					chart.setDatasetVisibility(index, true);
				});
				chart.update();
			}
		},

		// Metric hover handlers
		onMetricMouseEnter: (index: number) => {
			if (chart) {
				// Finde den entsprechenden Datenpunkt im Chart
				chart.setActiveElements([
					{ datasetIndex: 0, index },
					{ datasetIndex: 1, index }
				]);

				// Aktiviere den Tooltip für diesen Punkt
				const meta = chart.getDatasetMeta(0);
				if (meta.data[index]) {
					const position = meta.data[index].getCenterPoint();
					chart.tooltip?.setActiveElements([{ datasetIndex: 0, index }], {
						x: position.x,
						y: position.y
					});
				}
				chart.update();
			}
		},

		onMetricMouseLeave: () => {
			if (chart) {
				// Deaktiviere alle aktiven Elemente
				chart.setActiveElements([]);
				chart.tooltip?.setActiveElements([], { x: 0, y: 0 });
				chart.update();
			}
		},

		// Function to highlight specific data point
		highlightPoint: (index: number) => {
			if (!chart) return;

			if (index >= 0 && index < metrics.length) {
				chart.setActiveElements([{ datasetIndex: 0, index }]);
			} else {
				chart.setActiveElements([]);
			}

			chart.update('none');
		}
	};
}

export function createChartEffects(
	chart: Chart | null,
	metrics: Metric[],
	animationTween: number,
	needsRecalculation: boolean,
	calculateMetrics: () => void
) {
	return {
		// Update chart when animation values change
		animationEffect: () => {
			if (chart && metrics.length) {
				chart.data.datasets[0].data = metrics.map((m) => m.value * animationTween);

				// Update improved values
				if (chart.data.datasets.length > 1) {
					chart.data.datasets[1].data = metrics.map((m) => m.improvedValue * animationTween);
					console.log('Effect: Updated improved dataset:', chart.data.datasets[1].data);
				}

				chart.update('none');
			}
		},

		// Recalculation effect
		recalculationEffect: () => {
			if (needsRecalculation) {
				console.log('Running deferred metric calculation');
				calculateMetrics();
			}
		}
	};
}

export function createChartLifecycle(chart: Chart | null) {
	return {
		onMount: () => {
			// Chart initialization is handled in the component
		},

		onDestroy: () => {
			if (chart) {
				chart.destroy();
			}
		}
	};
}
