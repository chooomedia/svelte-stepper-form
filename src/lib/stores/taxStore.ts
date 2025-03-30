import { writable } from 'svelte/store';

interface TaxStore {
	rate: number; // VAT rate (e.g., 19 for 19%)
	vatText: string; // Display text for VAT (e.g., "MwSt." in German)
	country: string; // Country code for tax purposes
}

// Default German VAT settings
const defaultTaxSettings: TaxStore = {
	rate: 19,
	vatText: 'MwSt.',
	country: 'DE'
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
			break;
		case 'CH':
			settings.rate = 7.7;
			settings.vatText = 'MwSt.';
			settings.country = 'CH';
			break;
		case 'GB':
		case 'UK':
			settings.rate = 20;
			settings.vatText = 'VAT';
			settings.country = 'GB';
			break;
		case 'US':
			settings.rate = 0; // No VAT in the US, but may have state sales tax
			settings.vatText = 'Sales Tax';
			settings.country = 'US';
			break;
		default:
			// Default to German settings
			settings.rate = 19;
			settings.vatText = 'MwSt.';
			settings.country = 'DE';
	}

	taxInfo.set(settings);
}
