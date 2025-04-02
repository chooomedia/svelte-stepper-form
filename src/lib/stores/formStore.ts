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
	const { subscribe, set, update } = writable({
		formData: {},
		analysis: {
			isLoading: false,
			isComplete: false
			// weitere Properties...
		}
	});

	return {
		subscribe,
		updateField: (field, value) => {
			update((state) => ({
				...state,
				formData: { ...state.formData, [field]: value }
			}));
		}
		// weitere Methoden...
	};
}

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
