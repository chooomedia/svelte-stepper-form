// src/lib/components/chart/ChartAnimations.ts
import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
import Chart from 'chart.js/auto';
import type { Metric } from './ChartMetrics';

export interface AnimationState {
	isAnimating: boolean;
	animationTween: ReturnType<typeof tweened>;
}

export function createAnimationState(): AnimationState {
	return {
		isAnimating: false,
		animationTween: tweened(1, { duration: 1500, easing: cubicOut })
	};
}

export async function startChartAnimation(animationState: AnimationState): Promise<void> {
	animationState.isAnimating = true;
	console.log('Starting animation sequence');

	// Reset animation
	await animationState.animationTween.set(0);

	// Animate to full value
	await animationState.animationTween.set(1);

	animationState.isAnimating = false;
}

export function updateChartDataWithAnimation(
	chart: Chart,
	metrics: Metric[],
	animationTween: number,
	averageValue: number
): void {
	if (!chart) return;

	console.log('Updating chart data with metrics:', metrics);

	chart.data.labels = metrics.map((m) => m.label);
	chart.data.datasets[0].data = metrics.map((m) => m.value * animationTween);
	(chart.data.datasets[0] as any).pointBackgroundColor = metrics.map((m) => m.color);

	// Update improved values dataset
	if (chart.data.datasets.length > 1) {
		chart.data.datasets[1].data = metrics.map((m) => m.improvedValue * animationTween);
		console.log('Updated improved dataset:', chart.data.datasets[1].data);
	}

	// Update average line
	const avgDatasetIndex = 2;
	if (chart.data.datasets[avgDatasetIndex]) {
		chart.data.datasets[avgDatasetIndex].data = metrics.map(() => averageValue);
	}

	chart.update('none');
}

export function createAnimationEffect(
	chart: Chart | null,
	metrics: Metric[],
	animationTween: number
): void {
	if (chart && metrics.length) {
		chart.data.datasets[0].data = metrics.map((m) => m.value * animationTween);

		// Update improved values
		if (chart.data.datasets.length > 1) {
			chart.data.datasets[1].data = metrics.map((m) => m.improvedValue * animationTween);
			console.log('Effect: Updated improved dataset:', chart.data.datasets[1].data);
		}

		chart.update('none');
	}
}
