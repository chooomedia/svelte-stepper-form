// src/lib/utils/scoring.ts
import { writable, derived } from 'svelte/store';
import type { FormData } from '$lib/schema';
import { formOptions } from '$lib/schema';

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
 * Calculates the final score using website analysis and form data
 */
export function calculateFinalScore(websiteScore: number, formData: Partial<FormData>): number {
	// Use website score if available, with a weight of 70%
	if (websiteScore && websiteScore > 0) {
		const formScore = calculateVisibilityScore(formData);
		return Math.round(websiteScore * 0.7 + formScore * 0.3);
	}

	// Fall back to just form-based score
	return calculateVisibilityScore(formData);
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
		// Try first format
		if (data?.lighthouse_report?.audits?.['final-screenshot']?.details?.data) {
			return data.lighthouse_report.audits['final-screenshot'].details.data;
		}

		// Try alternate format
		if (data?.lighthouseResult?.audits?.['final-screenshot']?.details?.data) {
			return data.lighthouseResult.audits['final-screenshot'].details.data;
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
	// Default performance score based on overall score
	const performanceScore = Math.min(0.9, Math.max(0.4, score / 100));

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
				'final-screenshot': {
					details: {
						data: null // No default screenshot for fallback data
					}
				}
			}
		},
		security_headers: {
			grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D'
		},
		technologies: ['Svelte', 'Tailwind CSS', 'Vercel'],
		traffic: {
			monthly_visitors: Math.round(score * 100),
			bounce_rate: Math.max(0.3, 1 - score / 100)
		},
		social_media: {
			followers: Math.round(score * 20),
			engagement_rate: Math.min(0.1, score / 1000)
		},
		competitors: ['competitor1.com', 'competitor2.com', 'competitor3.com'],
		content: {
			blog_posts: Math.round(score / 10),
			videos: Math.round(score / 20),
			infographics: Math.round(score / 25)
		}
	};
}

// Create a writable store for score-related state
const createScoreStore = () => {
	// Initial state
	const initialState: AnalysisData = {
		websiteScore: 0,
		formScore: 0,
		finalScore: 0,
		rawData: null,
		auditData: null,
		isComplete: false,
		error: null,
		screenshot: null
	};

	// Create the writable store
	const { subscribe, set, update } = writable<AnalysisData>(initialState);

	return {
		subscribe,

		// Reset the store
		reset: () => set(initialState),

		// Update website analysis data and recalculate scores
		setWebsiteAnalysis: (data: any, formData: Partial<FormData>) => {
			update((state) => {
				// Extract website score from API response
				const websiteScore = extractScoreFromResponse(data);

				// Extract screenshot if available
				const screenshot = extractScreenshot(data);

				// Calculate form-based score
				const formScore = calculateVisibilityScore(formData);

				// Calculate final score
				const finalScore = calculateFinalScore(websiteScore, formData);

				// Prepare audit data for visualization
				const auditData = data || getFallbackAuditData(finalScore);

				return {
					...state,
					websiteScore,
					formScore,
					finalScore,
					rawData: data,
					auditData,
					isComplete: true,
					error: null,
					screenshot
				};
			});
		},

		// Update based on form data only
		updateFormScore: (formData: Partial<FormData>) => {
			update((state) => {
				// Calculate form-based score
				const formScore = calculateVisibilityScore(formData);

				// If we have website score, recalculate final score
				const finalScore =
					state.websiteScore > 0 ? calculateFinalScore(state.websiteScore, formData) : formScore;

				// Generate audit data if needed
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

		// Set error state
		setError: (errorMessage: string) => {
			update((state) => ({
				...state,
				error: errorMessage
			}));
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
