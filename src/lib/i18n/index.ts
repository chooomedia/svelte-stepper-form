import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { taxInfo } from '$lib/stores/taxStore';
import { currencyStore } from '$lib/stores/currencyStore';

// Import all language files
import ar from './translations/ar';
import de from './translations/de';
import en from './translations/en';
import hu from './translations/hu';
import ro from './translations/ro';
import ru from './translations/ru';
import tr from './translations/tr';

// Export the Translation type
export type { Translation } from './types';

// Collection of all translations
export const translations = { ar, de, en, hu, ro, ru, tr };

// Supported locales as type
export type SupportedLocale = 'ar' | 'de' | 'en' | 'hu' | 'ro' | 'ru' | 'tr';

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
	at: 'de',
	ch: 'de',
	swiss: 'de',
	gb: 'en',
	us: 'en',
	ca: 'en',
	au: 'en',
	fr: 'en',
	es: 'en',
	it: 'en',
	sa: 'ar',
	ae: 'ar',
	eg: 'ar',
	iq: 'ar',
	jo: 'ar',
	kw: 'ar',
	lb: 'ar',
	om: 'ar',
	qa: 'ar',
	ye: 'ar'
};

// Currency code mapping based on country
const COUNTRY_TO_CURRENCY: Record<string, string> = {
	de: 'EUR',
	at: 'EUR',
	ch: 'CHF',
	swiss: 'CHF',
	gb: 'EUR',
	us: 'EUR',
	ca: 'EUR',
	au: 'EUR',
	fr: 'EUR',
	es: 'EUR',
	it: 'EUR',
	sa: 'EUR',
	ae: 'EUR',
	eg: 'EUR',
	iq: 'EUR',
	jo: 'EUR',
	kw: 'EUR',
	lb: 'EUR',
	om: 'EUR',
	qa: 'EUR',
	ye: 'EUR'
};

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

	// Get country code from locale mapping
	let countryCode = locale;
	// Find the country code that maps to this locale (first match)
	for (const [country, mappedLocale] of Object.entries(COUNTRY_TO_LOCALE)) {
		if (mappedLocale === locale) {
			countryCode = country;
			break;
		}
	}

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
 * Initialize locale based on browser settings, localStorage, or geolocation
 */
export function initLocale(): Promise<void> {
	if (!browser) return Promise.resolve();

	return new Promise((resolve) => {
		// Check localStorage first (user preference)
		const savedLocale = localStorage.getItem('userLocale');

		if (savedLocale && isValidLocale(savedLocale as SupportedLocale)) {
			setLocaleAndCurrency(savedLocale as SupportedLocale);
			isLocaleInitialized.set(true);
			return resolve();
		}

		// Then check browser language
		const browserLang = navigator.language.split('-')[0];

		if (isValidLocale(browserLang as SupportedLocale)) {
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
 * Change locale with user interaction
 */
export function changeLocale(locale: string): void {
	if (isValidLocale(locale as SupportedLocale)) {
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

/**
 * Format a date according to the current locale
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
	const locale = get(currentLocale);
	const localeString = locale === 'de' ? 'de-DE' : locale === 'ar' ? 'ar-SA' : 'en-US';

	return new Intl.DateTimeFormat(localeString, options).format(date);
}

/**
 * Format a number according to the current locale
 */
export function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
	const locale = get(currentLocale);
	const localeString = locale === 'de' ? 'de-DE' : locale === 'ar' ? 'ar-SA' : 'en-US';

	return new Intl.NumberFormat(localeString, options).format(num);
}

/**
 * Get the text direction for the current locale (for RTL support)
 */
export function getTextDirection(): 'rtl' | 'ltr' {
	const locale = get(currentLocale);
	return locale === 'ar' ? 'rtl' : 'ltr';
}
