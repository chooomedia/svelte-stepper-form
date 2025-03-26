// src/lib/stores/stepperStore.ts (Consolidated)
import { writable, derived, get } from 'svelte/store';
import { FORM_STEPS } from '$lib/schema';
import type { FormData } from '$lib/schema';
import { formData } from './formStore';

// Core stepper state
const currentStepIndex = writable(1);
const maxReachedStep = writable(1);
const stepValidity = writable<Record<number, 'valid' | 'invalid' | 'incomplete' | 'untouched'>>({
	1: 'untouched'
});

// Derived store for current step data
const currentStep = derived(
	[currentStepIndex],
	([$currentStepIndex]) => FORM_STEPS[$currentStepIndex - 1]
);

// Step status for display
const stepStatuses = derived(
	[currentStepIndex, stepValidity, maxReachedStep],
	([$currentStepIndex, $stepValidity, $maxReachedStep]) => {
		return FORM_STEPS.map((_, index) => {
			const stepNumber = index + 1;
			return {
				index: stepNumber,
				isValid: $stepValidity[stepNumber] === 'valid',
				isIncomplete: $stepValidity[stepNumber] === 'incomplete',
				isInvalid: $stepValidity[stepNumber] === 'invalid',
				isCurrent: $currentStepIndex === stepNumber,
				isReachable: stepNumber <= $maxReachedStep
			};
		});
	}
);

// Navigation functions
function goToStep(step: number) {
	if (step < 1 || step > FORM_STEPS.length) return;

	currentStepIndex.set(step);
	maxReachedStep.update((value) => Math.max(value, step));
}

function nextStep() {
	currentStepIndex.update((step) => {
		const next = step + 1;
		if (next <= FORM_STEPS.length) {
			maxReachedStep.update((value) => Math.max(value, next));
			return next;
		}
		return step;
	});
}

function prevStep() {
	currentStepIndex.update((step) => Math.max(1, step - 1));
}

// Validate the current step
function validateCurrentStep() {
	const step = get(currentStepIndex);
	const stepData = FORM_STEPS[step - 1];
	const data = get(formData);

	if (!stepData) return false;

	const stepKey = stepData.title.toLowerCase() as keyof FormData;
	const currentStepData = data[stepKey];

	if (!currentStepData && step <= 9) {
		stepValidity.update((validity) => ({
			...validity,
			[step]: 'invalid'
		}));
		return false;
	} else {
		stepValidity.update((validity) => ({
			...validity,
			[step]: 'valid'
		}));
		return true;
	}
}

// Mark step with specific status
function markStepValid(step: number) {
	stepValidity.update((validity) => ({
		...validity,
		[step]: 'valid'
	}));
}

function markStepInvalid(step: number) {
	stepValidity.update((validity) => ({
		...validity,
		[step]: 'invalid'
	}));
}

function markStepIncomplete(step: number) {
	stepValidity.update((validity) => ({
		...validity,
		[step]: 'incomplete'
	}));
}

// Export stepper store with all functions
export const stepperStore = {
	currentStepIndex,
	maxReachedStep,
	stepValidity,
	currentStep,
	stepStatuses,
	goToStep,
	nextStep,
	prevStep,
	validateCurrentStep,
	markStepValid,
	markStepInvalid,
	markStepIncomplete
};
