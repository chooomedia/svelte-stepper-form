// src/lib/utils/ScoreManager.ts
import { writable, derived } from 'svelte/store';
import type { FormData } from '$lib/schema';
import {
	calculateVisibilityScore,
	calculateFinalScore,
	extractScoreFromResponse,
	getFallbackAuditData
} from './scoring';

// Define the type for analysis data
interface AnalysisData {
	websiteScore: number;
	formScore: number;
	finalScore: number;
	rawData: any | null;
	auditData: any | null;
	isComplete: boolean;
	error: string | null;
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
		error: null
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
					error: null
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
		}
	};
};

// Create the score store
export const scoreStore = createScoreStore();

// Derived store for visibility score (for use in forms)
export const visibilityScore = derived(scoreStore, ($scoreStore) => $scoreStore.finalScore);

// Helper function to update form and store simultaneously
export function updateVisibilityScore(formData: Partial<FormData>, form: any) {
	// Update the form's visibility_score field
	if (form && form.visibility_score !== undefined) {
		const score = calculateVisibilityScore(formData);
		form.visibility_score = score;
	}

	// Update the store
	scoreStore.updateFormScore(formData);

	return formData;
}
