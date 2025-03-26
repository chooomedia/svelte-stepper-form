// src/lib/stores/stepperStore.ts
import { writable } from 'svelte/store';

export const steps = writable<any[]>([]);
export const currentStep = writable<number>(1);
export const validSteps = writable<number[]>([]);
export const invalidRequiredSteps = writable<number[]>([]);
export const incompleteSteps = writable<number[]>([]);

// Functions to update state from +page.svelte
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
}
