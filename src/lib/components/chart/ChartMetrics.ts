// src/lib/components/chart/ChartMetrics.ts
import { i18n } from '$lib/i18n';

export type Metric = {
	label: string;
	value: number;
	improvedValue: number;
	color: string;
	category: string;
};

export function createBaseMetrics(
	clampedScore: number,
	labels: {
		seo: string;
		performance: string;
		accessibility: string;
		bestPractices: string;
		content: string;
		security: string;
	}
): Metric[] {
	return [
		{
			label: labels.seo,
			value: Math.round(clampedScore * 0.9),
			improvedValue: 90,
			color: '#4CAF50',
			category: 'lighthouse'
		},
		{
			label: labels.performance,
			value: Math.round(clampedScore * 0.8),
			improvedValue: 90,
			color: '#2196F3',
			category: 'lighthouse'
		},
		{
			label: labels.accessibility,
			value: Math.round(clampedScore * 0.7),
			improvedValue: 85,
			color: '#FF9800',
			category: 'lighthouse'
		},
		{
			label: labels.bestPractices,
			value: Math.round(clampedScore * 0.85),
			improvedValue: 80,
			color: '#F44336',
			category: 'lighthouse'
		},
		{
			label: labels.content,
			value: Math.round(clampedScore * 0.75),
			improvedValue: 80,
			color: '#9C27B0',
			category: 'content'
		},
		{
			label: labels.security,
			value: Math.round(clampedScore * 0.95),
			improvedValue: 90,
			color: '#00BCD4',
			category: 'security'
		}
	];
}

export function getMinValues(labels: {
	seo: string;
	performance: string;
	accessibility: string;
	bestPractices: string;
	content: string;
	security: string;
}) {
	return {
		[labels.seo]: 90,
		[labels.performance]: 90,
		[labels.accessibility]: 85,
		[labels.bestPractices]: 80,
		[labels.content]: 80,
		[labels.security]: 90
	};
}

export function normalizeMetricKey(label: string): string {
	return label
		.toLowerCase()
		.replace(/ä/g, 'a')
		.replace(/ü/g, 'u')
		.replace(/ö/g, 'o')
		.replace(/\s+/g, '');
}

export function calculateImprovedValue(originalValue: number, minValue: number): number {
	return Math.max(minValue, Math.round(originalValue * 1.3));
}

export function normalizeMetrics(
	metrics: Metric[],
	labels: {
		seo: string;
		performance: string;
		accessibility: string;
		bestPractices: string;
		content: string;
		security: string;
	}
): Metric[] {
	const minValues = getMinValues(labels);

	return metrics.map((metric) => {
		const minValue = minValues[metric.label] || 80;
		const normalizedValue = Math.min(Math.max(metric.value, 0), 100);
		const normalizedImprovedValue = Math.max(
			minValue,
			Math.min(Math.max(metric.improvedValue, 0), 100)
		);

		return {
			...metric,
			value: normalizedValue,
			improvedValue: normalizedImprovedValue
		};
	});
}

export function calculateAverages(metrics: Metric[]): { current: number; improved: number } {
	const current = metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length || 0;
	const improved = metrics.reduce((acc, m) => acc + m.improvedValue, 0) / metrics.length || 0;

	return { current, improved };
}
