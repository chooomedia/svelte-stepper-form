import { writable } from 'svelte/store';

interface TaxStore {
	rate: number; // VAT rate (e.g., 19 for 19%)
	vatText: string; // Display text for VAT (e.g., "MwSt." in German)
	country: string; // Country code for tax purposes
	currency: string; // Currency code (e.g., "EUR" for Euro)
}

// Default German VAT settings
const defaultTaxSettings: TaxStore = {
	rate: 19,
	vatText: 'MwSt.',
	country: 'DE',
	currency: 'EUR'
};

// Create the store with default values
export const taxInfo = writable<TaxStore>(defaultTaxSettings);

// Function to update tax settings based on country
export function updateTaxByCountry(countryCode: string) {
	const settings = { ...defaultTaxSettings };

	// Set country-specific tax rates
	switch (countryCode.toUpperCase()) {
		case 'AT':
			settings.rate = 20;
			settings.vatText = 'USt.';
			settings.country = 'AT';
			settings.currency = 'EUR';
			break;
		case 'CH':
			settings.rate = 7.7;
			settings.vatText = 'MwSt.';
			settings.country = 'CH';
			settings.currency = 'CHF';
			break;
		case 'GB':
		case 'UK':
			settings.rate = 20;
			settings.vatText = 'VAT';
			settings.country = 'GB';
			settings.currency = 'GBP';
			break;
		case 'US':
			settings.rate = 0; // No VAT in the US, but may have state sales tax
			settings.vatText = 'Sales Tax';
			settings.country = 'US';
			settings.currency = 'USD';
			break;
		default:
			// Default to German settings
			settings.rate = 19;
			settings.vatText = 'MwSt.';
			settings.country = 'DE';
			settings.currency = 'EUR';
	}

	taxInfo.set(settings);
}
