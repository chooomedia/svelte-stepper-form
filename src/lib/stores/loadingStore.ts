// src/lib/stores/loadingStore.ts
import { writable } from 'svelte/store';

// Dedicated store for loading states
export const websiteLoading = writable(false);
export const formSubmitting = writable(false);
export const pageLoading = writable(false);
