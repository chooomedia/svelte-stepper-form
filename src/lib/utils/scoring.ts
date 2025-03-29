// src/lib/utils/scoring.ts
import { writable, derived } from 'svelte/store';
import type { FormData } from '$lib/schema';
import { formOptions } from '$lib/schema';
import { set } from 'zod';

// Define the type for analysis data
interface AnalysisData {
	websiteScore: number;
	formScore: number;
	finalScore: number;
	rawData: any | null;
	auditData: any | null;
	isComplete: boolean;
	error: string | null;
	screenshot: string | null;
	// Neue detaillierte Metriken
	metrics: {
		performance: number;
		seo: number;
		accessibility: number;
		bestPractices: number;
		content: number;
		security: number;
	};
}

export function extractDetailedMetrics(data: any): any {
	const metrics = {
		performance: 0,
		seo: 0,
		accessibility: 0,
		bestPractices: 0,
		content: 0,
		security: 0
	};

	try {
		// Lighthouse-Scores extrahieren, falls vorhanden
		if (data?.lighthouseResult?.categories) {
			const categories = data.lighthouseResult.categories;
			metrics.performance = Math.round((categories.performance?.score || 0) * 100);
			metrics.seo = Math.round((categories.seo?.score || 0) * 100);
			metrics.accessibility = Math.round((categories.accessibility?.score || 0) * 100);
			metrics.bestPractices = Math.round((categories['best-practices']?.score || 0) * 100);
		}

		// Weitere Metriken aus der separaten API-Antwort extrahieren
		if (data?.detailed_scores) {
			const scores = data.detailed_scores;

			// Content-Score aus verfügbaren Daten berechnen
			const contentFactors = [
				scores.meta_description || 0,
				scores.h1 || 0,
				scores.alt_attributes || 0
			];
			metrics.content = Math.round(
				contentFactors.reduce((sum, score) => sum + score, 0) / contentFactors.length
			);

			// Security-Score basierend auf verfügbaren Daten
			metrics.security = scores.canonical ? 100 : 50; // Vereinfachtes Beispiel
		}

		// Falls wir einen overall_score direkt haben
		if (data?.overall_score && typeof data.overall_score === 'number') {
			// Den overall_score verwenden, aber nicht als Teil der Metriken speichern
		}

		return metrics;
	} catch (error) {
		console.error('Error extracting metrics:', error);
		return metrics;
	}
}

export function calculateFinalScore(websiteScore: number, formData: Partial<FormData>): number {
	const formScore = calculateVisibilityScore(formData);

	// Grundgewichtung
	let websiteWeight = 0.7;
	let formWeight = 0.3;

	// Gewichtung basierend auf Datenvollständigkeit anpassen
	const hasGoodWebsiteData = websiteScore > 0 && websiteScore <= 100;
	const hasGoodFormData = formScore > 0;

	if (!hasGoodWebsiteData && hasGoodFormData) {
		websiteWeight = 0.2;
		formWeight = 0.8;
	} else if (hasGoodWebsiteData && !hasGoodFormData) {
		websiteWeight = 0.8;
		formWeight = 0.2;
	}

	return Math.round(websiteScore * websiteWeight + formScore * formWeight);
}

/**
 * Calculates a visibility score based on form data
 */
export function calculateVisibilityScore(formData: Partial<FormData>): number {
	if (!formData) return 0;

	const relevantFields = [
		'visibility',
		'advertising_frequency',
		'goals',
		'campaign_management',
		'online_reviews',
		'previous_campaigns',
		'business_phase',
		'implementation_time'
	] as const;

	let totalWeight = 0;
	let count = 0;

	for (const field of relevantFields) {
		const value = formData[field]; // String from the form
		if (typeof value === 'string' && value.trim() !== '') {
			const weight = getOptionWeight(field, value);
			totalWeight += weight;
			count++;
		}
	}

	if (count === 0) return 0; // If nothing was filled out

	return Math.round((totalWeight / count) * 10); // Scale weighting to 100
}

/**
 * Gets the weight of a specific option
 */
export function getOptionWeight(category: keyof typeof formOptions, value: string): number {
	const options = formOptions[category];
	const option = options.find((opt) => opt.value === value);
	return option ? option.weight : 0;
}

/**
 * Helper to extract score from API response
 */
export function extractScoreFromResponse(data: any): number {
	if (!data) return 0;

	if (Array.isArray(data) && data.length > 0) {
		const scoreObject = data.find((item) => 'overall_score' in item);
		if (scoreObject && typeof scoreObject.overall_score === 'number') {
			return scoreObject.overall_score;
		}
	}

	// Try to extract score directly
	if (data.score && typeof data.score === 'number') {
		return data.score;
	}

	return 0;
}

/**
 * Extracts the lighthouse screenshot from response data
 */
export function extractScreenshot(data: any): string | null {
	if (!data) return null;

	try {
		// Try alternate format
		if (data.lighthouseResult?.audits?.['final-screenshot']?.details?.data) {
			return data.lighthouseResult.audits['final-screenshot'].details.data;
		}

		// Try first format
		if (data?.lighthouse_report?.audits?.['final-screenshot']?.details?.data) {
			return data.lighthouse_report.audits['final-screenshot'].details.data;
		}
	} catch (e) {
		console.warn('Could not extract screenshot from data:', e);
	}

	return null;
}

/**
 * Generate fallback audit data for visualization when real data is unavailable
 */
export function getFallbackAuditData(score: number) {
	// Default-Performance-Score basierend auf Gesamtscore
	const performanceScore = Math.min(0.9, Math.max(0.4, score / 100));

	// Wir erstellen ein ausgewogeneres Fallback
	return {
		url: 'example.com',
		score: score,
		lighthouse_report: {
			categories: {
				performance: { score: performanceScore },
				seo: { score: score >= 70 ? 0.85 : score >= 50 ? 0.65 : 0.45 },
				accessibility: { score: score >= 70 ? 0.75 : score >= 50 ? 0.55 : 0.35 },
				'best-practices': { score: score >= 70 ? 0.8 : score >= 50 ? 0.6 : 0.4 }
			},
			audits: {
				'first-contentful-paint': { score: performanceScore * 0.9 },
				'largest-contentful-paint': { score: performanceScore * 0.85 },
				'speed-index': { score: performanceScore * 0.95 },
				'total-blocking-time': { score: performanceScore * 0.8 },
				'cumulative-layout-shift': { score: performanceScore * 1.1 },
				'final-screenshot': {
					details: {
						data: null // Kein Standard-Screenshot für Fallback-Daten
					}
				}
			}
		},
		detailed_scores: {
			title: score >= 70 ? 90 : 50,
			meta_description: score >= 60 ? 95 : 70,
			h1: score >= 65 ? 100 : 60,
			alt_attributes: score >= 50 ? 80 : 40,
			canonical: score >= 80 ? 100 : 90,
			links: score >= 75 ? 90 : 60
		},
		security_headers: {
			grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D'
		}
	};
}

// Create a writable store for score-related state
const createScoreStore = () => {
	// Initialen Zustand erweitern
	const initialState: AnalysisData = {
		websiteScore: 0,
		formScore: 0,
		finalScore: 0,
		rawData: null,
		auditData: null,
		isComplete: false,
		error: null,
		screenshot: null,
		// Neue leere Metriken hinzufügen
		metrics: {
			performance: 0,
			seo: 0,
			accessibility: 0,
			bestPractices: 0,
			content: 0,
			security: 0
		}
	};

	const { subscribe, set, update } = writable<AnalysisData>(initialState);

	return {
		subscribe,

		// Update setWebsiteAnalysis, um die neuen Metriken zu extrahieren
		setWebsiteAnalysis: (data: any, formData: Partial<FormData>) => {
			update((state) => {
				// Website-Score aus API-Antwort extrahieren
				const websiteScore = extractScoreFromResponse(data);

				// Screenshot extrahieren, falls verfügbar
				const screenshot = extractScreenshot(data);

				// Detaillierte Metriken extrahieren
				const metrics = extractDetailedMetrics(data);

				// Form-basierter Score berechnen
				const formScore = calculateVisibilityScore(formData);

				// Finalen Score berechnen
				const finalScore = calculateFinalScore(websiteScore, formData);

				// Audit-Daten für Visualisierung vorbereiten
				const auditData = data || getFallbackAuditData(finalScore);

				return {
					...state,
					websiteScore,
					formScore,
					finalScore,
					metrics,
					rawData: data,
					auditData,
					isComplete: true,
					error: null,
					screenshot
				};
			});
		},

		// Die anderen Methoden bleiben ähnlich...
		updateFormScore: (formData: Partial<FormData>) => {
			update((state) => {
				const formScore = calculateVisibilityScore(formData);
				const finalScore =
					state.websiteScore > 0 ? calculateFinalScore(state.websiteScore, formData) : formScore;

				// Audit-Daten generieren oder aktualisieren
				const auditData = state.auditData || getFallbackAuditData(finalScore);

				return {
					...state,
					formScore,
					finalScore,
					auditData,
					isComplete: true
				};
			});
		},

		// Get current state - useful for debugging
		getState: () => {
			let currentState: AnalysisData | null = null;
			subscribe((state) => {
				currentState = state;
			})();
			return currentState;
		}
	};
};

// Create the score store
export const scoreStore = createScoreStore();

// Derived store for visibility score (for use in forms)
export const visibilityScore = derived(scoreStore, ($scoreStore) => $scoreStore.finalScore);

// Derived store for the screenshot
export const websiteScreenshot = derived(scoreStore, ($scoreStore) => $scoreStore.screenshot);

// Helper function to update form and store simultaneously
export function updateVisibilityScore(formData: Partial<FormData>, form: any) {
	// Calculate the score
	const score = calculateVisibilityScore(formData);

	// Update the form's visibility_score field if it exists
	if (form) {
		if (typeof form.visibility_score === 'number') {
			form.visibility_score = score;
		} else if (form.data && typeof form.data.visibility_score === 'number') {
			form.data.visibility_score = score;
		}
	}

	// Update the store
	scoreStore.updateFormScore(formData);

	return score;
}
