// src/lib/i18n/index.ts
import { writable, derived, get as svelteGet } from 'svelte/store';
import { browser } from '$app/environment';
import { translations, type Translation } from './translations';
import { currencyStore } from '$lib/stores/currencyStore';

// Unterstützte Sprachen
export type SupportedLocale = 'de' | 'fr' | 'en' | 'ch' | 'at' | 'ru' | 'ar';

// Standardeinstellungen
const DEFAULT_LOCALE: SupportedLocale = 'de';
// FALLBACK_LOCALE wird nicht verwendet, entfernt

// Store für die aktuelle Sprache
export const currentLocale = writable<SupportedLocale>(DEFAULT_LOCALE);

// Derived store für alle verfügbaren Übersetzungen
export const i18n = derived(currentLocale, ($locale) => {
	return translations[$locale] || translations['de']; // Direkter Fallback zu 'de'
});

// Sichere Funktion zum Abrufen des aktuellen Store-Werts
export function get<T>(store: { subscribe: (run: (value: T) => void) => any }): T {
	return svelteGet(store);
}

/**
 * Holt die übersetzte Bezeichnung für eine Option
 */
export function getTranslatedLabel(
	fieldName: string,
	optionValue: string,
	fallback?: string
): string {
	const translation = get(i18n);
	return translation?.schema?.options?.[fieldName]?.[optionValue]?.label || fallback || optionValue;
}

/**
 * Holt die übersetzte Beschreibung für eine Option
 */
export function getTranslatedDescription(
	fieldName: string,
	optionValue: string,
	fallback?: string
): string {
	const translation = get(i18n);
	return translation?.schema?.options?.[fieldName]?.[optionValue]?.description || fallback || '';
}

/**
 * Prüfen, ob eine Locale unterstützt wird
 */
function isValidLocale(locale: string): locale is SupportedLocale {
	return ['de', 'en', 'fr', 'ch', 'at', 'ru', 'ar'].includes(locale);
}

/**
 * Aktualisiert die Währung basierend auf der Spracheinstellung
 */
function updateCurrencyForLocale(locale: SupportedLocale) {
	if (!currencyStore) return;

	const currencyMapping: Record<SupportedLocale, string> = {
		de: 'EUR',
		fr: 'EUR',
		en: 'USD',
		ch: 'CHF',
		at: 'EUR',
		ru: 'RUB',
		ar: 'AED'
	};

	currencyStore.setCurrency(currencyMapping[locale] || 'EUR');
}

/**
 * Ermittelt die Nutzerregion für präzisere Sprach- und Währungseinstellungen
 */
export async function detectUserRegion() {
	try {
		const response = await fetch('https://ipapi.co/json/');
		if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
		const data = await response.json();

		const countryCode = data?.country_code?.toLowerCase() || '';

		if (isValidLocale(countryCode)) {
			currentLocale.set(countryCode as SupportedLocale);
			updateCurrencyForLocale(countryCode as SupportedLocale);
		} else if (data?.currency) {
			// Wenn die Sprache nicht unterstützt wird, aber eine Währung erkannt wurde
			currencyStore?.setCurrency(data.currency);
		}
	} catch (error) {
		console.error('Could not detect user region:', error);
	}
}

/**
 * Initialisiert die Locale basierend auf Browser-Einstellungen
 */
export function initLocale() {
	if (!browser) return;

	// Versuche zuerst, eine gespeicherte Präferenz zu verwenden
	const savedLocale = localStorage.getItem('preferredLocale');

	if (savedLocale && isValidLocale(savedLocale)) {
		currentLocale.set(savedLocale as SupportedLocale);
		updateCurrencyForLocale(savedLocale as SupportedLocale);
		return;
	}

	// Fallback auf Browser-Sprache
	const browserLocale = navigator.language.split('-')[0] as SupportedLocale;

	if (isValidLocale(browserLocale)) {
		currentLocale.set(browserLocale);
		updateCurrencyForLocale(browserLocale);
	}

	// Regionsbasierte Erkennung
	detectUserRegion();
}

/**
 * Ändert die aktuelle Sprache und aktualisiert die Währung entsprechend
 */
export function changeLocale(locale: string) {
	if (isValidLocale(locale)) {
		// Speichern der Benutzereinstellung
		if (browser) {
			localStorage.setItem('preferredLocale', locale);
		}

		currentLocale.set(locale as SupportedLocale);
		updateCurrencyForLocale(locale as SupportedLocale);
	}
}

export function getLocalizedLabel(
	fieldName: string,
	optionValue: string,
	fallback?: string
): string {
	const translation = get(i18n);
	return translation?.schema?.options?.[fieldName]?.[optionValue]?.label || fallback || optionValue;
}

export function getLocalizedDescription(
	fieldName: string,
	optionValue: string,
	fallback?: string
): string {
	const translation = get(i18n);
	return translation?.schema?.options?.[fieldName]?.[optionValue]?.description || fallback || '';
}

export type { Translation } from './translations';
