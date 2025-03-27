// src/lib/stores/formStore.ts
import { writable, derived, get } from 'svelte/store';
import type { FormData } from '$lib/schema';
import {
	calculateVisibilityScore,
	calculateFinalScore,
	extractScoreFromResponse
} from '$lib/utils/scoring';
import { scoreStore } from '$lib/utils/scoring';

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
	// Get the latest scores from the analysis state and form data
	if ($analysisState.score > 0) {
		// Use website analysis score with 70% weight
		const formScore = calculateVisibilityScore($formData);
		return Math.round($analysisState.score * 0.7 + formScore * 0.3);
	}

	// Fall back to just form-based score
	return calculateVisibilityScore($formData);
});

// Sync form data changes with score calculation
formData.subscribe(($formData) => {
	// Update the score store with the latest form data
	scoreStore.updateFormScore($formData);
});

// Helper functions
export function updateFormField(field: keyof FormData, value: any) {
	formData.update((data) => {
		const updatedData = { ...data, [field]: value };

		// Recalculate visibility score whenever form data changes
		const formScore = calculateVisibilityScore(updatedData);

		// Only update visibility_score if it's not already set by an API
		if (!updatedData.visibility_score || field === 'visibility_score') {
			updatedData.visibility_score = formScore;
		}

		return updatedData;
	});
}

// Set analysis results from API response
export function setAnalysisResults(results: any) {
	// Extract score from API response
	const websiteScore = extractScoreFromResponse(results);

	// Get current form data for score calculation
	const currentFormData = get(formData);

	// Calculate final score
	const finalScore = calculateFinalScore(websiteScore, currentFormData);

	// Update analysis state
	analysisState.update((state) => ({
		...state,
		isComplete: true,
		isLoading: false,
		data: results,
		score: websiteScore
	}));

	// Update form data with visibility score
	formData.update((data) => ({
		...data,
		visibility_score: finalScore
	}));

	// Update score store
	scoreStore.setWebsiteAnalysis(results, currentFormData);

	return finalScore;
}

// Set loading state
export function setAnalysisLoading(isLoading: boolean) {
	analysisState.update((state) => ({
		...state,
		isLoading
	}));
}

// Set error state
export function setAnalysisError(error: string) {
	analysisState.update((state) => ({
		...state,
		error,
		isLoading: false
	}));

	// Update score store
	scoreStore.setError(error);
}

// Reset store
export function resetFormStore() {
	formData.set({});
	analysisState.set({
		isLoading: false,
		isComplete: false,
		score: 0,
		error: '',
		data: null
	});

	// Reset score store
	scoreStore.reset();
}
