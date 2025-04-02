// src/lib/i18n/index.ts - Improved version

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { translations, type Translation } from './translations';
import { taxInfo } from '$lib/stores/taxStore';
import { currencyStore } from '$lib/stores/currencyStore';

// Supported locales as type
export type SupportedLocale = 'de' | 'en' | 'fr' | 'es' | 'it';

// Default settings
const DEFAULT_LOCALE: SupportedLocale = 'de';
const FALLBACK_LOCALE: SupportedLocale = 'en';

// Store for current locale with default
export const currentLocale = writable<SupportedLocale>(DEFAULT_LOCALE);
export const isLocaleInitialized = writable<boolean>(false);

// Derived store for all available translations
export const i18n = derived(currentLocale, ($locale) => {
	// Get translation for current locale or fall back to default
	return translations[$locale] || translations[FALLBACK_LOCALE];
});

// Country code to locale mapping
const COUNTRY_TO_LOCALE: Record<string, SupportedLocale> = {
	de: 'de',
	at: 'de', // Austria uses German
	ch: 'de', // Switzerland (defaulting to German)
	gb: 'en',
	us: 'en',
	ca: 'en',
	au: 'en',
	fr: 'fr',
	es: 'es',
	it: 'it'
};

// Currency code mapping based on country
const COUNTRY_TO_CURRENCY: Record<string, string> = {
	de: 'EUR',
	at: 'EUR',
	ch: 'CHF',
	gb: 'GBP',
	us: 'USD',
	ca: 'CAD',
	au: 'AUD',
	fr: 'EUR',
	es: 'EUR',
	it: 'EUR'
};

/**
 * Initialize locale based on browser settings, localStorage, or geolocation
 */
export function initLocale(): Promise<void> {
	if (!browser) return Promise.resolve();

	return new Promise((resolve) => {
		// Check localStorage first (user preference)
		const savedLocale = localStorage.getItem('userLocale');

		if (savedLocale && isValidLocale(savedLocale)) {
			setLocaleAndCurrency(savedLocale as SupportedLocale);
			isLocaleInitialized.set(true);
			return resolve();
		}

		// Then check browser language
		const browserLang = navigator.language.split('-')[0];

		if (isValidLocale(browserLang)) {
			setLocaleAndCurrency(browserLang as SupportedLocale);
			isLocaleInitialized.set(true);
			return resolve();
		}

		// Finally use geolocation API (if available)
		detectUserRegion()
			.then(() => {
				isLocaleInitialized.set(true);
				resolve();
			})
			.catch(() => {
				// In case of error, use default
				setLocaleAndCurrency(DEFAULT_LOCALE);
				isLocaleInitialized.set(true);
				resolve();
			});
	});
}

/**
 * Detect user's region and set appropriate locale and currency
 */
async function detectUserRegion(): Promise<void> {
	try {
		const response = await fetch('https://ipapi.co/json/');
		if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

		const data = await response.json();
		const countryCode = data?.country_code?.toLowerCase();

		if (countryCode && COUNTRY_TO_LOCALE[countryCode]) {
			setLocaleAndCurrency(COUNTRY_TO_LOCALE[countryCode]);
		} else {
			// If country not supported, use default
			setLocaleAndCurrency(DEFAULT_LOCALE);
		}
	} catch (error) {
		console.error('Failed to detect user region:', error);
		setLocaleAndCurrency(DEFAULT_LOCALE);
	}
}

/**
 * Set locale and update related stores (currency, tax)
 */
function setLocaleAndCurrency(locale: SupportedLocale): void {
	// Update locale store
	currentLocale.set(locale);

	// Save preference
	if (browser) {
		localStorage.setItem('userLocale', locale);
	}

	// Get country code from locale (simplified mapping)
	const countryCode = locale;

	// Update currency if store available
	if (currencyStore && typeof currencyStore.setCurrency === 'function') {
		const currency = COUNTRY_TO_CURRENCY[countryCode] || 'EUR';
		currencyStore.setCurrency(currency);
	}

	// Update tax info if store available
	if (taxInfo && typeof taxInfo.update === 'function') {
		taxInfo.update((store) => ({
			...store,
			country: countryCode.toUpperCase(),
			currency: COUNTRY_TO_CURRENCY[countryCode] || 'EUR'
		}));
	}
}

/**
 * Change locale with user interaction
 */
export function changeLocale(locale: string): void {
	if (isValidLocale(locale)) {
		setLocaleAndCurrency(locale as SupportedLocale);
	}
}

/**
 * Check if locale is supported
 */
function isValidLocale(locale: string): locale is SupportedLocale {
	return Object.keys(translations).includes(locale);
}

/**
 * Get a translated label for a specific field option
 */
export function getLocalizedLabel(
	fieldName: string,
	optionValue: string,
	fallback?: string
): string {
	const translation = get(i18n);
	return translation?.schema?.options?.[fieldName]?.[optionValue]?.label || fallback || optionValue;
}

/**
 * Get a translated description for a specific field option
 */
export function getLocalizedDescription(
	fieldName: string,
	optionValue: string,
	fallback?: string
): string {
	const translation = get(i18n);
	return translation?.schema?.options?.[fieldName]?.[optionValue]?.description || fallback || '';
}

// Export translation type
export type { Translation } from './translations';
