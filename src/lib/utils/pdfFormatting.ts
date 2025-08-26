// src/lib/utils/pdfFormatting.ts

export function formatValue(category: string, value: any): string {
	if (value === null || value === undefined) {
		return 'Nicht angegeben';
	}

	if (typeof value === 'boolean') {
		return value ? 'Ja' : 'Nein';
	}

	if (Array.isArray(value)) {
		if (value.length === 0) {
			return 'Keine Auswahl';
		}
		return value.join(', ');
	}

	if (typeof value === 'string') {
		// Handle special cases for specific categories
		switch (category) {
			case 'company_url':
				return formatUrl(value);
			case 'company_name':
				return value || 'Nicht angegeben';
			default:
				return value;
		}
	}

	return String(value);
}

export function formatUrl(url: string): string {
	if (!url) return 'Nicht angegeben';
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		return `https://${url}`;
	}
	return url;
}

export function getScoreColor(score: number): string {
	if (score >= 80) return '#10B981'; // Green
	if (score >= 60) return '#F59E0B'; // Yellow
	if (score >= 40) return '#EF4444'; // Red
	return '#DC2626'; // Dark Red
}

export function getScoreDescription(score: number): string {
	if (score >= 80) return 'Ausgezeichnet';
	if (score >= 60) return 'Gut';
	if (score >= 40) return 'Verbesserungsbedarf';
	return 'Kritisch';
}

export function getDynamicMetric(type: string, value: any): string {
	if (!value) return 'Nicht verfügbar';

	switch (type) {
		case 'performance':
			return `${value}/100 - ${getScoreDescription(value)}`;
		case 'seo':
			return `${value}/100 - ${getScoreDescription(value)}`;
		case 'accessibility':
			return `${value}/100 - ${getScoreDescription(value)}`;
		case 'best_practices':
			return `${value}/100 - ${getScoreDescription(value)}`;
		case 'content':
			return `${value}/100 - ${getScoreDescription(value)}`;
		case 'security':
			return `${value}/100 - ${getScoreDescription(value)}`;
		default:
			return String(value);
	}
}
