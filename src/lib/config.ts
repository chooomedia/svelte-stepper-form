/**
 * Application configuration constants
 */

// PayPal SDK base URL
export const PAYPAL_SCRIPT_BASE = 'https://www.paypal.com/sdk/js';

// PayPal API URLs
export const PAYPAL_API = {
	SANDBOX: 'https://api-m.sandbox.paypal.com',
	PRODUCTION: 'https://api-m.paypal.com'
};

// Betterplace API
export const BETTERPLACE_API = 'https://api.betterplace.org/de/api_v4';

// VAT rates by country code
export const VAT_RATES: Record<string, number> = {
	DE: 19, // Germany
	AT: 20, // Austria
	CH: 7.7, // Switzerland
	GB: 20, // United Kingdom
	FR: 20, // France
	IT: 22, // Italy
	ES: 21, // Spain
	NL: 21, // Netherlands
	BE: 21, // Belgium
	LU: 17, // Luxembourg
	US: 0 // United States (no VAT, but may have state sales tax)
};

// Default locale for internationalization
export const DEFAULT_LOCALE = 'de_DE';

// Payment configuration
export const PAYMENT_CONFIG = {
	CURRENCY: 'EUR',
	DONATION_PERCENTAGE: 3, // 3% donation
	EINMALIG_DISCOUNT: 8, // 8% discount for one-time payment
	ABO_DISCOUNT: 5, // 5% discount for subscription
	MINIMUM_PAYMENT: 1, // Minimum payment amount
	MAXIMUM_PAYMENT: 10000 // Maximum payment amount
};
