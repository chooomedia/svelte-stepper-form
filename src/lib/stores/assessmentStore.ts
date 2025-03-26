// src/lib/stores/assessmentStore.ts
import { writable } from 'svelte/store';

export const assessmentStore = writable<{
	currentStep: number;
	metrics: Metric[];
	score: number;
	auditData: AuditData | null;
}>({
	currentStep: 1,
	metrics: [],
	score: 0,
	auditData: null
});

export const loadDemoData = () => {
	assessmentStore.update((store) => ({
		...store,
		metrics: DEMO_METRICS,
		score: calculateDemoScore()
	}));
};
