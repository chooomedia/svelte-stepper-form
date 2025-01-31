import { writable } from 'svelte/store';

// Speichert den aktuellen Step (1-basiert)
export const currentStep = writable(1);

// Speichert alle abgeschlossenen Steps
export const completedSteps = writable<number[]>([]);
