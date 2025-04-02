// src/lib/stores/loadingStore.ts
import { writable } from 'svelte/store';

// Dedicated store for loading states
export const websiteLoading = writable(false);
export const formSubmitting = writable(false);
export const pageLoading = writable(false);

// Create a combined loading store for convenience
function createLoadingStore() {
	const { subscribe, update, set } = writable({
		websiteLoading: false,
		formSubmitting: false,
		pageLoading: false
	});

	// Subscribe to the individual stores
	websiteLoading.subscribe((value) => {
		update((state) => ({ ...state, websiteLoading: value }));
	});

	formSubmitting.subscribe((value) => {
		update((state) => ({ ...state, formSubmitting: value }));
	});

	pageLoading.subscribe((value) => {
		update((state) => ({ ...state, pageLoading: value }));
	});

	return {
		subscribe,

		// Helper methods to update individual loading states
		setWebsiteLoading: (value: boolean) => {
			websiteLoading.set(value);
		},

		setFormSubmitting: (value: boolean) => {
			formSubmitting.set(value);
		},

		setPageLoading: (value: boolean) => {
			pageLoading.set(value);
		},

		// Reset all loading states
		reset: () => {
			websiteLoading.set(false);
			formSubmitting.set(false);
			pageLoading.set(false);
		}
	};
}

// Export the combined loading store
export const loadingStore = createLoadingStore();

// Export default as loadingStore as well for more flexible imports
export default loadingStore;
