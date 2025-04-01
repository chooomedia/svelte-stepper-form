import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { translations, type Translation } from './translations';

// Unterstützte Sprachen
export type SupportedLocale = 'de' | 'en' | 'fr';

// Standardeinstellungen
const DEFAULT_LOCALE: SupportedLocale = 'de';
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

// Funktion zum Übersetzen eines Texts
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

// Helper-Funktion für den Store-Zugriff
function get<T>(store: { subscribe: (run: (value: T) => void) => any }): T {
	let value: T;
	const unsubscribe = store.subscribe((v: T) => (value = v));
	unsubscribe();
	return value!;
}

// Beim Laden den Browser-Locale erkennen
export function initLocale() {
	if (typeof window !== 'undefined') {
		// Bestimme Browsersprache
		const browserLocale = navigator.language.split('-')[0] as SupportedLocale;

		// Prüfe, ob die Sprache unterstützt wird
		if (['de', 'en', 'fr'].includes(browserLocale)) {
			currentLocale.set(browserLocale);
		}
	}
}

// Prüfen, ob eine Locale unterstützt wird
function isValidLocale(locale: string): locale is SupportedLocale {
	return ['de', 'en', 'fr'].includes(locale);
}

// Nutzerregion ermitteln (für Währung usw.)
async function detectUserRegion() {
	try {
		const response = await fetch('https://ipapi.co/json/');
		const data = await response.json();

		if (data && data.country) {
			// Speichere Ländercode für Währungsumrechnung
			currencyStore.setCountry(data.country);
		}
	} catch (error) {
		console.error('Could not detect user region:', error);
	}
}

// Sprache wechseln
export function changeLocale(locale: SupportedLocale) {
	currentLocale.set(locale);
}
