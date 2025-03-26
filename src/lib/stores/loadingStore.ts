// src/lib/stores/loadingStore.ts
import { writable } from 'svelte/store';

export const websiteLoading = writable(false);
export const formSubmitting = writable(false);
