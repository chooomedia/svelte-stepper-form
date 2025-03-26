// src/lib/stores/stepStore.ts
import { writable, derived } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface StepData {
	index: number;
	isValid: boolean;
	isIncomplete: boolean;
	isInvalid: boolean;
	isCurrent: boolean;
}

export const steps: Writable<any[]> = writable([]);
export const currentStep: Writable<number> = writable(1);
export const validSteps: Writable<number[]> = writable([]);
export const invalidRequiredSteps: Writable<number[]> = writable([]);
export const incompleteSteps: Writable<number[]> = writable([]);

// Derived store to calculate step statuses
export const stepStatuses = derived(
	[steps, currentStep, validSteps, invalidRequiredSteps, incompleteSteps],
	([$steps, $currentStep, $validSteps, $invalidRequiredSteps, $incompleteSteps]) => {
		return $steps.map((_, index) => {
			const stepNumber = index + 1;
			return {
				index: stepNumber,
				isValid: $validSteps.includes(stepNumber),
				isIncomplete: $incompleteSteps.includes(stepNumber),
				isInvalid: $invalidRequiredSteps.includes(stepNumber),
				isCurrent: $currentStep === stepNumber
			};
		});
	}
);

// Functions to update state
export function setSteps(newSteps: any[]) {
	steps.set(newSteps);
}

export function setCurrentStep(step: number) {
	currentStep.set(step);
}

export function markStepValid(step: number) {
	validSteps.update((steps) => {
		if (!steps.includes(step)) {
			return [...steps, step];
		}
		return steps;
	});

	// Also remove from other states if needed
	invalidRequiredSteps.update((steps) => steps.filter((s) => s !== step));
	incompleteSteps.update((steps) => steps.filter((s) => s !== step));
}

export function markStepInvalid(step: number) {
	invalidRequiredSteps.update((steps) => {
		if (!steps.includes(step)) {
			return [...steps, step];
		}
		return steps;
	});

	// Remove from valid steps
	validSteps.update((steps) => steps.filter((s) => s !== step));
}

export function markStepIncomplete(step: number) {
	incompleteSteps.update((steps) => {
		if (!steps.includes(step)) {
			return [...steps, step];
		}
		return steps;
	});

	// If it was valid before, remove from valid
	validSteps.update((steps) => steps.filter((s) => s !== step));
}
