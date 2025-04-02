import { writable, derived } from 'svelte/store';
import { FORM_STEPS, TOTAL_STEPS, last_step } from '$lib/schema';

// Define types for better code quality
export type StepValidityStatus = 'valid' | 'invalid' | 'incomplete' | 'untouched';

export interface StepStatus {
	index: number;
	isValid: boolean;
	isIncomplete: boolean;
	isInvalid: boolean;
	isCurrent: boolean;
	isReachable: boolean;
}

export interface StepInfo {
	index: number;
	title: string;
	description: string;
	schema?: any;
}

interface StepperState {
	currentStepIndex: number;
	maxReachedStep: number;
	stepValidity: Record<number, StepValidityStatus>;
}

// Initial state
const initialState: StepperState = {
	currentStepIndex: 1,
	maxReachedStep: 1,
	stepValidity: {
		1: 'untouched'
	}
};

// Create the store
function createStepperStore() {
	const { subscribe, update, set } = writable<StepperState>(initialState);

	// Return store with methods
	return {
		subscribe,

		// Navigate to a specific step
		goToStep: (step: number) => {
			if (step < 1 || step > TOTAL_STEPS) return;

			update((state) => {
				// Update max reached step if necessary
				const maxReachedStep = Math.max(state.maxReachedStep, step);

				return {
					...state,
					currentStepIndex: step,
					maxReachedStep
				};
			});
		},

		// Go to next step
		nextStep: () => {
			update((state) => {
				const next = state.currentStepIndex + 1;

				// Don't exceed total steps
				if (next > TOTAL_STEPS) return state;

				return {
					...state,
					currentStepIndex: next,
					maxReachedStep: Math.max(state.maxReachedStep, next)
				};
			});
		},

		// Go to previous step
		prevStep: () => {
			update((state) => ({
				...state,
				currentStepIndex: Math.max(1, state.currentStepIndex - 1)
			}));
		},

		// Mark a step with a specific status
		markStep: (step: number, status: StepValidityStatus) => {
			update((state) => ({
				...state,
				stepValidity: {
					...state.stepValidity,
					[step]: status
				}
			}));
		},

		// Convenience methods for specific states
		markStepValid: (step: number) => {
			update((state) => ({
				...state,
				stepValidity: {
					...state.stepValidity,
					[step]: 'valid'
				}
			}));
		},

		markStepInvalid: (step: number) => {
			update((state) => ({
				...state,
				stepValidity: {
					...state.stepValidity,
					[step]: 'invalid'
				}
			}));
		},

		markStepIncomplete: (step: number) => {
			update((state) => ({
				...state,
				stepValidity: {
					...state.stepValidity,
					[step]: 'incomplete'
				}
			}));
		},

		// Reset the stepper
		reset: () => set(initialState)
	};
}

// Create the core store
export const stepperStore = createStepperStore();

// Derived store for the current step index
export const currentStepIndex = derived(stepperStore, ($store) => $store.currentStepIndex);

// Derived store for the current step details
export const currentStep = derived(stepperStore, ($store) => {
	const index = $store.currentStepIndex;
	let stepInfo: StepInfo;

	// Special case for step beyond the FORM_STEPS length (final step)
	if (index > FORM_STEPS.length) {
		stepInfo = {
			index,
			title: 'final',
			description: 'Ergebnisse',
			schema: last_step
		};
	} else {
		// Normal case for steps within FORM_STEPS range
		const validIndex = Math.max(1, Math.min(index, FORM_STEPS.length));
		const stepData = FORM_STEPS[validIndex - 1];

		stepInfo = {
			index: validIndex,
			title: stepData.title,
			description: stepData.description,
			schema: stepData.schema
		};
	}

	return stepInfo;
});

// Derived store for step statuses (for UI)
export const stepStatuses = derived(stepperStore, ($store) => {
	return FORM_STEPS.map((_, index) => {
		const stepIndex = index + 1;

		return {
			index: stepIndex,
			isValid: $store.stepValidity[stepIndex] === 'valid',
			isIncomplete: $store.stepValidity[stepIndex] === 'incomplete',
			isInvalid: $store.stepValidity[stepIndex] === 'invalid',
			isCurrent: $store.currentStepIndex === stepIndex,
			isReachable: stepIndex <= $store.maxReachedStep
		};
	});
});

// Helper function to jump to a specific step (for debugging/testing)
export function jumpToStep(step: number): void {
	if (step >= 1 && step <= TOTAL_STEPS) {
		stepperStore.goToStep(step);
	} else {
		console.warn(`Invalid step number: ${step}. Valid range is 1-${TOTAL_STEPS}`);
	}
}

// Export goToStep for convenience
export function goToStep(step: number): void {
	stepperStore.goToStep(step);
}
