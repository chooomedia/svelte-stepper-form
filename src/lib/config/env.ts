/**
 * Environment Configuration
 * Zentrale Konfigurationsdatei für alle Umgebungsvariablen
 */

export const env = {
	// Demo/Test Data
	DEMO_URL: import.meta.env.VITE_DEMO_URL || 'https://digitalpusher.de',
	DEMO_EMAIL: import.meta.env.VITE_DEMO_EMAIL || 'hi@digitalpusher.de',
	DEMO_PHONE: import.meta.env.VITE_DEMO_PHONE || '+49123456789',
	DEMO_COMPANY_NAME: import.meta.env.VITE_DEMO_COMPANY_NAME || 'Test Company',

	// API Configuration
	TIDYCAL_API_TOKEN: import.meta.env.VITE_TIDYCAL_API_TOKEN || '',

	// Development Settings
	DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true',
	DEBUG_ENABLED: import.meta.env.VITE_DEBUG_ENABLED === 'true'
} as const;
