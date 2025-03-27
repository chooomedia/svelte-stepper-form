import { writable, derived } from 'svelte/store';
import { FORM_STEPS, TOTAL_STEPS, last_step } from '$lib/schema';

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
	// Special case for step 12
	if ($currentStepIndex > FORM_STEPS.length) {
		return {
			title: 'final',
			description: 'Ergebnisse',
			schema: last_step
		};
	}

	// Normal case for steps 1-11
	const index = Math.max(1, Math.min($currentStepIndex, FORM_STEPS.length));
	return FORM_STEPS[index - 1];
});

// Fix for the jumpToStep function
export function jumpToStep(step: number) {
	// Allow jumping to TOTAL_STEPS (12) even though FORM_STEPS.length is 11
	if (step >= 1 && step <= TOTAL_STEPS) {
		// Set currentStepIndex (writable) instead of trying to set currentStep (derived)
		currentStepIndex.set(step);

		// Update maxReachedStep to ensure the step is accessible
		maxReachedStep.update((value) => Math.max(value, step));

		console.log(`Jumping to step: ${step}`);
	} else {
		console.warn(`Invalid step number: ${step}. Valid range is 1-${TOTAL_STEPS}`);
	}
}

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
	currentStepIndex.update((step) => {
		const next = step + 1;
		// Allow advancing to TOTAL_STEPS (12) even though FORM_STEPS.length is 11
		if (next <= TOTAL_STEPS) {
			maxReachedStep.update((value) => Math.max(value, next));
			return next;
		}
		return step;
	});
}

export function prevStep() {
	currentStepIndex.update((step) => Math.max(1, step - 1));
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

// Create a store with a readable interface and methods
function createStepperStore() {
	const { subscribe } = derived(
		[currentStepIndex, currentStep, stepStatuses],
		([$currentStepIndex, $currentStep, $stepStatuses]) => ({
			current: {
				index: $currentStepIndex,
				...$currentStep
			},
			status: $stepStatuses
		})
	);

	return {
		subscribe,
		goToStep,
		nextStep,
		prevStep,
		markStepValid,
		markStepInvalid,
		markStepIncomplete
	};
}

// Export the main store
export const stepperStore = createStepperStore();

// Reset function
export function resetStepper() {
	currentStepIndex.set(1);
	maxReachedStep.set(1);
	stepValidity.set({ 1: 'untouched' });
}
