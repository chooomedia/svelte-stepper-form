// src/lib/stores/currencyStore.ts
import { writable, derived } from 'svelte/store';
import { taxInfo } from './taxStore';

interface CurrencyRate {
	code: string;
	rate: number;
	symbol: string;
	position: 'prefix' | 'suffix';
	decimals: number;
	decimalSeparator: string;
	thousandsSeparator: string;
}

// Default currency rates (as of knowledge cutoff)
// In a production app, these would be fetched from an API
const defaultRates: Record<string, CurrencyRate> = {
	EUR: {
		code: 'EUR',
		rate: 1,
		symbol: '€',
		position: 'suffix',
		decimals: 2,
		decimalSeparator: ',',
		thousandsSeparator: '.'
	},
	USD: {
		code: 'USD',
		rate: 1.18,
		symbol: '$',
		position: 'prefix',
		decimals: 2,
		decimalSeparator: '.',
		thousandsSeparator: ','
	},
	GBP: {
		code: 'GBP',
		rate: 0.85,
		symbol: '£',
		position: 'prefix',
		decimals: 2,
		decimalSeparator: '.',
		thousandsSeparator: ','
	},
	CHF: {
		code: 'CHF',
		rate: 1.07,
		symbol: 'CHF',
		position: 'suffix',
		decimals: 2,
		decimalSeparator: '.',
		thousandsSeparator: "'"
	}
};

// Create the currency store
function createCurrencyStore() {
	// Current active currency
	const { subscribe, set, update } = writable<string>('EUR');

	// Sync with taxInfo store for automatic currency switching
	taxInfo.subscribe(($taxInfo) => {
		if ($taxInfo.currency && defaultRates[$taxInfo.currency]) {
			set($taxInfo.currency);
		}
	});

	return {
		subscribe,
		set,
		// Switch to a specific currency
		setCurrency: (currencyCode: string) => {
			if (defaultRates[currencyCode]) {
				set(currencyCode);
			} else {
				console.warn(`Currency ${currencyCode} not supported`);
			}
		},
		// Get the current rate for the active currency
		getRate: (targetCurrency?: string): number => {
			let currentCurrency = 'EUR';
			subscribe((value) => {
				currentCurrency = value;
			})();

			const target = targetCurrency || currentCurrency;
			return defaultRates[target]?.rate || 1;
		},
		// Convert a price from EUR to the current currency
		convertPrice: (priceInEur: number, targetCurrency?: string): number => {
			let currentCurrency = 'EUR';
			subscribe((value) => {
				currentCurrency = value;
			})();

			const target = targetCurrency || currentCurrency;
			const rate = defaultRates[target]?.rate || 1;

			return parseFloat((priceInEur * rate).toFixed(2));
		},
		// Format a price according to the current currency's format
		formatPrice: (
			price: number,
			options?: {
				currencyCode?: string;
				showSymbol?: boolean;
				showCode?: boolean;
			}
		): string => {
			let currentCurrency = 'EUR';
			subscribe((value) => {
				currentCurrency = value;
			})();

			const currencyCode = options?.currencyCode || currentCurrency;
			const showSymbol = options?.showSymbol !== false;
			const showCode = options?.showCode || false;

			const currencyInfo = defaultRates[currencyCode] || defaultRates.EUR;

			// Format the number according to locale
			const formattedNumber = price
				.toFixed(currencyInfo.decimals)
				.replace('.', currencyInfo.decimalSeparator);

			// Add symbol based on position
			let result = '';
			if (currencyInfo.position === 'prefix' && showSymbol) {
				result += currencyInfo.symbol;
			}

			result += formattedNumber;

			if (currencyInfo.position === 'suffix' && showSymbol) {
				result += currencyInfo.symbol;
			}

			if (showCode) {
				result += ` ${currencyCode}`;
			}

			return result;
		}
	};
}

// Create and export the store
export const currencyStore = createCurrencyStore();

// Derived store for the current currency code
export const currentCurrency = derived(currencyStore, ($currencyStore) => $currencyStore);

// Derived store for the current currency symbol
export const currencySymbol = derived(
	currencyStore,
	($currencyStore) => defaultRates[$currencyStore]?.symbol || '€'
);

// Derived store for currency formatting information
export const currencyFormat = derived(currencyStore, ($currencyStore) => ({
	...defaultRates[$currencyStore],
	format: (price: number, showSymbol = true) => {
		return currencyStore.formatPrice(price, { showSymbol });
	}
}));
