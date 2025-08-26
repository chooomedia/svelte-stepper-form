// src/lib/components/chart/ChartLabels.ts

export interface ChartLabels {
	seo: string;
	performance: string;
	accessibility: string;
	bestPractices: string;
	content: string;
	security: string;
	currentValue: string;
	improvedValue: string;
	average: string;
	optimal: string;
}

export function getChartLabels(i18nData: any): ChartLabels {
	return {
		// Metric Labels
		seo: i18nData?.schema?.metrics?.seo?.label || 'SEO',
		performance: i18nData?.schema?.metrics?.performance?.label || 'Performance',
		accessibility: i18nData?.schema?.metrics?.accessibility?.label || 'Zugänglichkeit',
		bestPractices: i18nData?.schema?.metrics?.bestPractices?.label || 'Best Practices',
		content: i18nData?.schema?.metrics?.content?.label || 'Content',
		security: i18nData?.schema?.metrics?.security?.label || 'Sicherheit',

		// Legend Labels
		currentValue: i18nData?.schema?.metrics?.currentValue || 'Aktuell',
		improvedValue: i18nData?.schema?.metrics?.improvedValue || 'Nach Optimierung',
		average: i18nData?.schema?.metrics?.average || 'Durchschnitt',
		optimal: i18nData?.schema?.metrics?.optimal || 'Optimal'
	};
}

export function getScoreColor(scoreValue: number): string {
	if (scoreValue >= 90) return '#10B981'; // Green
	if (scoreValue >= 70) return '#F59E0B'; // Yellow
	if (scoreValue >= 50) return '#EF4444'; // Red
	return '#DC2626'; // Dark Red
}

export function getChartColors() {
	return {
		seo: '#3B82F6',
		performance: '#10B981',
		accessibility: '#F59E0B',
		bestPractices: '#8B5CF6',
		content: '#EF4444',
		security: '#06B6D4',
		background: 'rgba(59, 130, 246, 0.1)',
		border: 'rgba(59, 130, 246, 0.3)',
		grid: 'rgba(0, 0, 0, 0.1)',
		text: '#374151'
	};
}
