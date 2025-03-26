// src/lib/stores/formStore.ts
import { writable, derived, get } from 'svelte/store';
import type { FormData } from '$lib/schema';
import { calculateVisibilityScore } from '$lib/utils/scoring';

// Core form data
export const formData = writable<Partial<FormData>>({});

// Analysis-related state
export const analysisState = writable({
	isLoading: false,
	isComplete: false,
	score: 0,
	error: '',
	data: null
});

// Calculate the score when form data changes
export const calculatedScore = derived([formData, analysisState], ([$formData, $analysisState]) => {
	if ($analysisState.score > 0) {
		// Use website analysis score with 70% weight
		const formScore = calculateVisibilityScore($formData);
		return Math.round($analysisState.score * 0.7 + formScore * 0.3);
	}

	// Fall back to just form-based score
	return calculateVisibilityScore($formData);
});

// Helper functions
export function updateFormField(field: keyof FormData, value: any) {
	formData.update((data) => ({ ...data, [field]: value }));
}

export function setAnalysisResults(results: any) {
	analysisState.update((state) => ({
		...state,
		isComplete: true,
		isLoading: false,
		data: results,
		score: extractScoreFromResults(results)
	}));
}

function extractScoreFromResults(results: any) {
	if (!results) return 0;

	// Extract overall_score from response if available
	if (Array.isArray(results) && results.length > 0) {
		const scoreObject = results.find((item) => 'overall_score' in item);
		if (scoreObject && typeof scoreObject.overall_score === 'number') {
			return scoreObject.overall_score;
		}
	}

	return 0;
}
