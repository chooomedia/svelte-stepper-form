import { writable, derived, get } from 'svelte/store';
import type { FormData } from '$lib/schema';
import { calculateVisibilityScore, calculateFinalScore } from '$lib/utils/scoring';
import { scoreStore } from '$lib/utils/scoring';

// Define the store state interface
interface FormStoreState {
	formData: Partial<FormData>;
	analysis: {
		isLoading: boolean;
		isComplete: boolean;
		score: number;
		error: string;
		data: any | null;
	};
}

// Initial state
const initialState: FormStoreState = {
	formData: {},
	analysis: {
		isLoading: false,
		isComplete: false,
		score: 0,
		error: '',
		data: null
	}
};

// Create the form store
function createFormStore() {
	const { subscribe, set, update } = writable<FormStoreState>(initialState);

	// Calculate score whenever form data changes
	const calculatedScore = derived({ subscribe }, ($state) => {
		// Get the latest scores from analysis state and form data
		if ($state.analysis.score > 0) {
			// Use website analysis score with 70% weight
			const formScore = calculateVisibilityScore($state.formData);
			return Math.round($state.analysis.score * 0.7 + formScore * 0.3);
		}

		// Fall back to just form-based score
		return calculateVisibilityScore($state.formData);
	});

	return {
		subscribe,

		// Update a specific form field
		updateField: (field: keyof FormData, value: any) => {
			update((state) => {
				const updatedFormData = { ...state.formData, [field]: value };

				// Recalculate visibility score
				const formScore = calculateVisibilityScore(updatedFormData);

				// Only update visibility_score if it's not already set by an API
				if (!updatedFormData.visibility_score || field === 'visibility_score') {
					updatedFormData.visibility_score = formScore;
				}

				return {
					...state,
					formData: updatedFormData
				};
			});

			// Update the score store with the latest form data
			const currentState = get({ subscribe });
			scoreStore.updateFormScore(currentState.formData);
		},

		// Update multiple fields at once
		updateFields: (fields: Partial<FormData>) => {
			update((state) => {
				const updatedFormData = { ...state.formData, ...fields };
				return {
					...state,
					formData: updatedFormData
				};
			});

			// Update the score store
			const currentState = get({ subscribe });
			scoreStore.updateFormScore(currentState.formData);
		},

		// Set analysis loading state
		setAnalysisLoading: (isLoading: boolean) => {
			update((state) => ({
				...state,
				analysis: {
					...state.analysis,
					isLoading
				}
			}));
		},

		// Set analysis results with score calculation
		setAnalysisResults: (results: any) => {
			update((state) => {
				const currentFormData = state.formData;
				const websiteScore = typeof results.score === 'number' ? results.score : 0;
				const finalScore = calculateFinalScore(websiteScore, currentFormData);

				return {
					...state,
					analysis: {
						isComplete: true,
						isLoading: false,
						data: results,
						score: websiteScore,
						error: ''
					},
					formData: {
						...currentFormData,
						visibility_score: finalScore
					}
				};
			});

			// Update score store
			const currentState = get({ subscribe });
			scoreStore.setWebsiteAnalysis(currentState.analysis.data, currentState.formData);

			return currentState.analysis.score;
		},

		// Set error state
		setAnalysisError: (error: string) => {
			update((state) => ({
				...state,
				analysis: {
					...state.analysis,
					error,
					isLoading: false
				}
			}));

			// Update score store
			scoreStore.setError(error);
		},

		// Reset the store
		reset: () => {
			set(initialState);
			scoreStore.reset();
		},

		// Get current full state (for debugging)
		getState: () => {
			return get({ subscribe });
		}
	};
}

// Create and export the store
export const formStore = createFormStore();

// Export calculated score as a derived store
export const calculatedScore = derived(formStore, ($formStore) => {
	const state = $formStore;

	if (state.analysis.score > 0) {
		const formScore = calculateVisibilityScore(state.formData);
		return Math.round(state.analysis.score * 0.7 + formScore * 0.3);
	}

	return calculateVisibilityScore(state.formData);
});
