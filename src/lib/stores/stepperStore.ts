import { writable, derived, get } from 'svelte/store';
import { FORM_STEPS } from '$lib/schema';
import {
	step_1,
	step_2,
	step_3,
	step_4,
	step_5,
	step_6,
	step_7,
	step_8,
	step_9,
	step_10,
	last_step
} from '$lib/schema';

// Mapping steps to their Zod schemas
const stepSchemas = [
	step_1,
	step_2,
	step_3,
	step_4,
	step_5,
	step_6,
	step_7,
	step_8,
	step_9,
	step_10,
	last_step
];

// Core stepper state
export const currentStepIndex = writable(1);
export const maxReachedStep = writable(1);
export const stepValidity = writable<
	Record<number, 'valid' | 'invalid' | 'incomplete' | 'untouched'>
>({
	1: 'untouched'
});

// Derived store for current step data
export const currentStep = derived(currentStepIndex, ($currentStepIndex) => {
	// Stelle sicher, dass $currentStepIndex immer gültig ist
	const index = Math.max(1, Math.min($currentStepIndex, FORM_STEPS.length));
	return FORM_STEPS[index - 1]; // Hole das entsprechende Step-Datenobjekt
});

// Step status for display
export const stepStatuses = derived(
	[currentStepIndex, stepValidity, maxReachedStep],
	([$currentStepIndex, $stepValidity, $maxReachedStep]) => {
		return FORM_STEPS.map((_, index) => ({
			index: index + 1,
			isValid: $stepValidity[index + 1] === 'valid',
			isIncomplete: $stepValidity[index + 1] === 'incomplete',
			isInvalid: $stepValidity[index + 1] === 'invalid',
			isCurrent: $currentStepIndex === index + 1,
			isReachable: index + 1 <= $maxReachedStep
		}));
	}
);

// Navigation functions
export function goToStep(step: number) {
	if (step < 1 || step > FORM_STEPS.length) return;
	currentStepIndex.set(step);
	maxReachedStep.update((value) => Math.max(value, step));
}

export function nextStep() {
	const currentStep = get(currentStepIndex);
	validateCurrentStep(); // Validate the current step before moving forward

	currentStepIndex.update((step) => {
		const next = step + 1;
		if (next <= FORM_STEPS.length) {
			maxReachedStep.update((value) => Math.max(value, next));
			return next;
		}
		return step;
	});
}

export function prevStep() {
	const currentStep = get(currentStepIndex);
	validateCurrentStep(); // Optionally validate before going backward

	currentStepIndex.update((step) => Math.max(1, step - 1));
}

// Step validation
export function validateCurrentStep() {
	const step = get(currentStepIndex); // Get the current step index
	const schema = stepSchemas[step - 1]; // Map to the correct schema for validation

	const currentStepData = get(stepperStore); // Get current step data from the store

	try {
		// Validate the data for the current step using the corresponding schema
		schema.parse(currentStepData);
		markStepValid(step); // Mark the step as valid if validation passes
	} catch (error) {
		markStepInvalid(step); // Mark the step as invalid if validation fails
		console.error('Validation failed for step:', error.errors); // Handle validation errors
	}
}

// Step marking functions
export function markStepValid(step: number) {
	stepValidity.update((validity) => ({
		...validity,
		[step]: 'valid'
	}));
}

export function markStepInvalid(step: number) {
	stepValidity.update((validity) => ({
		...validity,
		[step]: 'invalid'
	}));
}

export function markStepIncomplete(step: number) {
	stepValidity.update((validity) => ({
		...validity,
		[step]: 'incomplete'
	}));
}

function createStepperStore() {
	// This is the key part that makes it work with $ prefix
	const { subscribe } = derived(
		[currentStepIndex, currentStep, stepStatuses],
		([$currentStepIndex, $currentStep, $stepStatuses]) => {
			// Sicherstellen, dass der aktuelle Step valide ist
			const currentStep = FORM_STEPS[$currentStepIndex - 1] || FORM_STEPS[0];
			return {
				currentStepIndex: $currentStepIndex,
				currentStep,
				stepStatuses: $stepStatuses
			};
		}
	);

	// Return a store with subscribe method and all the functions
	return {
		subscribe,
		goToStep,
		nextStep,
		prevStep,
		validateCurrentStep,
		markStepValid,
		markStepInvalid,
		markStepIncomplete
	};
}

// Export the main store
export const stepperStore = createStepperStore();
export const resetForm = () => {
	currentStepIndex.set(1);
	maxReachedStep.set(1);
	stepValidity.set({ 1: 'untouched' });
};
