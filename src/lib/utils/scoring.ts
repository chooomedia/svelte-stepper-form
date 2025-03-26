// src/lib/utils/scoring.ts
import type { FormData } from '$lib/schema';
import { formOptions } from '$lib/schema';

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
// src/lib/utils/scoring.ts (continued)
export function extractScoreFromResponse(data: any): number {
	if (!data) return 0;

	if (Array.isArray(data) && data.length > 0) {
		const scoreObject = data.find((item) => 'overall_score' in item);
		if (scoreObject && typeof scoreObject.overall_score === 'number') {
			return scoreObject.overall_score;
		}
	}

	return 0;
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
