// src/lib/components/chart/ChartLifecycle.ts
import Chart from 'chart.js/auto';
import type { Metric } from './ChartMetrics';
import { createChartConfig } from './ChartConfig';
import { startChartAnimation, type AnimationState } from './ChartAnimations';

export interface ChartLifecycleState {
	chart: Chart | null;
	chartLoaded: boolean;
	storeData: any;
	storeScore: number;
	effectiveScore: number;
	needsRecalculation: boolean;
}

export function createChartLifecycleState(): ChartLifecycleState {
	return {
		chart: null,
		chartLoaded: false,
		storeData: null,
		storeScore: 0,
		effectiveScore: 0,
		needsRecalculation: false
	};
}

export async function initializeChart(
	chartCanvas: HTMLCanvasElement | null,
	metrics: Metric[],
	chartColors: any,
	chartLabels: {
		currentValue: string;
		improvedValue: string;
		average: string;
		optimal: string;
	},
	averageValue: number,
	animationTween: number,
	animationState: AnimationState,
	lifecycleState: ChartLifecycleState
): Promise<void> {
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
	if (lifecycleState.chart) {
		lifecycleState.chart.destroy();
	}

	console.log('Initializing chart with metrics:', metrics);

	// Create chart configuration with correct data
	const chartConfig = createChartConfig(
		metrics,
		chartColors,
		chartLabels,
		averageValue,
		animationTween
	);

	// Create the chart
	lifecycleState.chart = new Chart(ctx, chartConfig);
	lifecycleState.chartLoaded = true;

	// Start animation
	await startChartAnimation(animationState);
}

export function createScoreStoreSubscription(
	scoreStore: any,
	lifecycleState: ChartLifecycleState,
	auditData: any,
	score: number
) {
	return scoreStore.subscribe((state: any) => {
		console.log('ScoreStore updated:', state);

		// Use local variables to avoid reactivity issues
		const newStoreData = state.auditData;
		const newStoreScore = state.finalScore;

		// Check if data actually changed to avoid unnecessary updates
		if (
			JSON.stringify(newStoreData) !== JSON.stringify(lifecycleState.storeData) ||
			newStoreScore !== lifecycleState.storeScore
		) {
			lifecycleState.storeData = newStoreData;
			lifecycleState.storeScore = newStoreScore;

			// Use store data if available and no explicit props provided
			if (lifecycleState.storeData && (!auditData || Object.keys(auditData).length === 0)) {
				console.log('Using store auditData:', lifecycleState.storeData);
				lifecycleState.needsRecalculation = true;
			}

			// Use store score if available and no explicit score provided
			if (lifecycleState.storeScore > 0 && (!score || score === 50)) {
				console.log('Using store score:', lifecycleState.storeScore);
				lifecycleState.effectiveScore = lifecycleState.storeScore;
				lifecycleState.needsRecalculation = true;
			}
		}
	});
}

export function createChartLifecycle(
	chart: Chart | null,
	chartCanvas: HTMLCanvasElement | null,
	metrics: Metric[],
	chartColors: any,
	chartLabels: {
		currentValue: string;
		improvedValue: string;
		average: string;
		optimal: string;
	},
	averageValue: number,
	animationTween: number,
	animationState: AnimationState,
	lifecycleState: ChartLifecycleState
) {
	return {
		onMount: async (
			scoreStore: any,
			auditData: any,
			score: number,
			calculateMetrics: () => void
		) => {
			console.log('PerformanceChart mounted with props:', { score, auditData });

			const unsubscribe = createScoreStoreSubscription(
				scoreStore,
				lifecycleState,
				auditData,
				score
			);

			// Initial calculation
			calculateMetrics();

			return () => unsubscribe();
		},

		initializeChart: async () => {
			await initializeChart(
				chartCanvas,
				metrics,
				chartColors,
				chartLabels,
				averageValue,
				animationTween,
				animationState,
				lifecycleState
			);
		},

		onDestroy: () => {
			if (lifecycleState.chart) {
				lifecycleState.chart.destroy();
			}
		}
	};
}
