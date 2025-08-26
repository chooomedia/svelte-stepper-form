// src/lib/components/chart/ChartCalculation.ts
import type { Metric } from './ChartMetrics';
import {
	createBaseMetrics,
	getMinValues,
	normalizeMetricKey,
	calculateImprovedValue,
	normalizeMetrics,
	calculateAverages
} from './ChartMetrics';

export interface CalculationContext {
	effectiveScore: number;
	auditData: any;
	storeData: any;
	chartLabels: {
		seo: string;
		performance: string;
		accessibility: string;
		bestPractices: string;
		content: string;
		security: string;
	};
	i18nData: any;
}

export interface CalculationResult {
	metrics: Metric[];
	averageValue: number;
	improvedAverageValue: number;
}

export function calculateChartMetrics(context: CalculationContext): CalculationResult {
	console.log('Calculating metrics with:', {
		effectiveScore: context.effectiveScore,
		auditData: context.auditData ? 'Present' : 'Missing',
		storeData: context.storeData ? 'Present' : 'Missing'
	});

	// Ensure score is within bounds
	const clampedScore = Math.min(Math.max(context.effectiveScore || 50, 0), 100);

	// Create base metrics with dynamic values based on score
	const baseMetrics = createBaseMetrics(clampedScore, context.chartLabels);

	// Try to apply real data if available
	const dataToUse = context.auditData || context.storeData;

	try {
		if (dataToUse) {
			console.log('Processing audit data:', dataToUse);

			// Try to use metrics data first
			if (dataToUse.metrics && typeof dataToUse.metrics === 'object') {
				console.log('Using metrics from audit data:', dataToUse.metrics);

				// Map metrics back to our baseMetrics array
				baseMetrics.forEach((metric) => {
					const metricKey = normalizeMetricKey(metric.label);

					if (dataToUse.metrics[metricKey] !== undefined) {
						metric.value = dataToUse.metrics[metricKey];
						const minValues = getMinValues(context.chartLabels);

						const minValue = minValues[metric.label] || 80;
						metric.improvedValue = calculateImprovedValue(metric.value, minValue);

						// Debug: Log die Werte
						console.log(`Metric: ${metric.label}`, {
							original: metric.value,
							improved: metric.improvedValue,
							minValue,
							improvement: Math.round(((metric.improvedValue - metric.value) / metric.value) * 100)
						});
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
						const categoryKey = normalizeMetricKey(metric.label);
						const score = categories[categoryKey]?.score;

						if (typeof score === 'number') {
							const metricValue = Math.round(score * 100);
							metric.value = metricValue;
							const minValues = getMinValues(context.chartLabels);

							const minValue = minValues[metric.label] || 80;
							metric.improvedValue = calculateImprovedValue(metricValue, minValue);

							// Debug: Log die Werte
							console.log(`Detailed Metric: ${metric.label}`, {
								original: metricValue,
								improved: metric.improvedValue,
								minValue,
								improvement: Math.round(((metric.improvedValue - metricValue) / metricValue) * 100)
							});
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
					const seoMetric = baseMetrics.find(
						(m) => m.label === context.i18nData.schema.metrics.seo.label
					);
					if (seoMetric) {
						seoMetric.value = dataToUse.detailed_scores.title;
						seoMetric.improvedValue = Math.max(90, Math.round(seoMetric.value * 1.3));
						console.log(`SEO Metric: ${seoMetric.value} -> ${seoMetric.improvedValue}`);
					}
				}

				if (dataToUse.detailed_scores.meta_description) {
					const contentMetric = baseMetrics.find(
						(m) => m.label === context.i18nData.schema.metrics.content.label
					);
					if (contentMetric) {
						contentMetric.value = dataToUse.detailed_scores.meta_description;
						contentMetric.improvedValue = Math.max(80, Math.round(contentMetric.value * 1.3));
						console.log(`Content Metric: ${contentMetric.value} -> ${contentMetric.improvedValue}`);
					}
				}

				if (dataToUse.detailed_scores.alt_attributes) {
					const accessibilityMetric = baseMetrics.find(
						(m) => m.label === context.i18nData.schema.metrics.accessibility.label
					);
					if (accessibilityMetric) {
						accessibilityMetric.value = dataToUse.detailed_scores.alt_attributes;
						accessibilityMetric.improvedValue = Math.max(
							85,
							Math.round(accessibilityMetric.value * 1.3)
						);
						console.log(
							`Accessibility Metric: ${accessibilityMetric.value} -> ${accessibilityMetric.improvedValue}`
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

	// Normalize all metric values and ensure improved values meet minimum requirements
	const metrics = normalizeMetrics(baseMetrics, context.chartLabels);

	// Calculate averages
	const averages = calculateAverages(metrics);

	console.log('Final metrics:', metrics);
	console.log('Average values - Current:', averages.current, 'Improved:', averages.improved);

	return {
		metrics,
		averageValue: averages.current,
		improvedAverageValue: averages.improved
	};
}
