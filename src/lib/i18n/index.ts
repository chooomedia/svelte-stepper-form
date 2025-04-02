// src/lib/i18n/index.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { translations, type Translation } from './translations';
import { currencyStore } from '$lib/stores/currencyStore';

// Unterstützte Sprachen
export type SupportedLocale = 'de' | 'fr' | 'en' | 'ch' | 'at' | 'ru' | 'ar';

// Standardeinstellungen
const DEFAULT_LOCALE: SupportedLocale = 'en';
const FALLBACK_LOCALE: SupportedLocale = 'de';

// Store für die aktuelle Sprache
export const currentLocale = writable<SupportedLocale>(DEFAULT_LOCALE);

// Store für alle verfügbaren Übersetzungen
export const i18n = {
	subscribe: (callback) => {
		return currentLocale.subscribe((locale) => {
			callback(translations[locale] || translations[DEFAULT_LOCALE]);
		});
	}
};

// Helper-Funktion für den Store-Zugriff
function get<T>(store: { subscribe: (run: (value: T) => void) => any }): T {
	let value: T;
	const unsubscribe = store.subscribe((v: T) => (value = v));
	unsubscribe();
	return value!;
}

/**
 * Funktion zum Übersetzen eines Texts mit Pfadnotation
 * @param key Pfad zur Übersetzung (z.B. "forms.labels.firstName")
 * @param replacements Optionale Ersetzungen für Platzhalter
 * @returns Übersetzter Text
 */
export function t(key: string, replacements?: Record<string, string>): string {
	let translation = '';

	// Hole den übersetzten Text aus dem Store
	const stores = get(i18n);

	// Verwende einen Pfad (z.B. "forms.labels.firstName")
	const keys = key.split('.');
	let current: any = stores;

	// Navigiere durch den Pfad
	for (const k of keys) {
		current = current?.[k];
		if (current === undefined) break;
	}

	translation = current || key;

	// Ersetze Platzhalter wie {name} mit Werten aus replacements
	if (replacements && typeof translation === 'string') {
		Object.entries(replacements).forEach(([k, v]) => {
			translation = translation.replace(new RegExp(`{${k}}`, 'g'), v);
		});
	}

	return translation;
}

/**
 * Holt die übersetzte Bezeichnung für eine Option
 * @param fieldName Name des Formularfelds (z.B. 'visibility')
 * @param optionValue Wert der Option (z.B. 'search_engines')
 * @param fallback Optionaler Fallback-Text
 * @returns Die übersetzte Bezeichnung
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
 * @param fieldName Name des Formularfelds
 * @param optionValue Wert der Option
 * @param fallback Optionaler Fallback-Text
 * @returns Die übersetzte Beschreibung
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
 * Holt den übersetzten Schritttitel
 * @param stepKey Schlüssel des Formularschritts
 * @param fallback Optionaler Fallback-Text
 * @returns Der übersetzte Titel
 */
export function getStepTitle(stepKey: string, fallback?: string): string {
	const translation = get(i18n);
	return translation?.schema?.steps?.[stepKey]?.title || fallback || stepKey;
}

/**
 * Holt die übersetzte Schrittbeschreibung
 * @param stepKey Schlüssel des Formularschritts
 * @param fallback Optionaler Fallback-Text
 * @returns Die übersetzte Beschreibung
 */
export function getStepDescription(stepKey: string, fallback?: string): string {
	const translation = get(i18n);
	return translation?.schema?.steps?.[stepKey]?.description || fallback || '';
}

/**
 * Prüfen, ob eine Locale unterstützt wird
 * @param locale Die zu prüfende Spracheinstellung
 * @returns true wenn die Sprache unterstützt wird
 */
function isValidLocale(locale: string): locale is SupportedLocale {
	return ['de', 'en', 'fr', 'ch', 'at', 'ru', 'ar'].includes(locale);
}

/**
 * Initialisiert die Locale basierend auf Browser-Einstellungen
 */
export function initLocale() {
	if (browser) {
		// Bestimme Browsersprache
		const browserLocale = navigator.language.split('-')[0] as SupportedLocale;

		// Prüfe, ob die Sprache unterstützt wird
		if (isValidLocale(browserLocale)) {
			currentLocale.set(browserLocale);

			// Währung entsprechend der Sprache setzen
			updateCurrencyForLocale(browserLocale);
		}

		// IP-basierte Geolokalisierung für genauere Regionserkennung
		detectUserRegion();
	}
}

/**
 * Aktualisiert die Währung basierend auf der Spracheinstellung
 * @param locale Die Spracheinstellung
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
 * Ändert die aktuelle Sprache und aktualisiert die Währung entsprechend
 * @param locale Die neue Spracheinstellung
 */
export function changeLocale(locale: string) {
	if (isValidLocale(locale)) {
		currentLocale.set(locale as SupportedLocale);
		updateCurrencyForLocale(locale as SupportedLocale);
	}
}

/**
 * Gibt den Bildpfad für eine Option zurück
 * @param fieldName Name des Formularfelds
 * @param optionValue Wert der Option
 * @returns Pfad zum entsprechenden Bild
 */
export function getImagePathForOption(fieldName: string, optionValue: string): string {
	// Basis-Pfad zu den Bildern
	const basePath = '/static/images/';

	// Standard-Abbildung nach Kategorie/Wert
	return `${basePath}${fieldName}/${optionValue}.svg`;
}
