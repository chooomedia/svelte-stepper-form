/**
 * Environment Configuration
 * Zentrale Konfigurationsdatei für alle Umgebungsvariablen
 */

export const env = {
	// Demo/Test Data
	DEMO_URL:
		import.meta.env.VITE_DEMO_URL ||
		import.meta.env.VITE_TEST_WEBSITE_URL ||
		'https://openmind.market/',
	DEMO_EMAIL: import.meta.env.VITE_DEMO_EMAIL || 'hi@digitalpusher.de',
	DEMO_PHONE: import.meta.env.VITE_DEMO_PHONE || '+49123456789',
	DEMO_COMPANY_NAME: import.meta.env.VITE_DEMO_COMPANY_NAME || 'Test Company',

	// Test Website URL for Development/Demo purposes only
	// In production, users enter their own website URL
	TEST_WEBSITE_URL: import.meta.env.VITE_TEST_WEBSITE_URL || 'https://openmind.market/',

	// API Configuration
	TIDYCAL_API_TOKEN: import.meta.env.VITE_TIDYCAL_API_TOKEN || '',

	// n8n Webhook Configuration
	N8N_BASE_URL: import.meta.env.VITE_N8N_BASE_URL || 'https://n8n.chooomedia.com/webhook-test',
	N8N_WEBHOOK_URL:
		import.meta.env.VITE_N8N_WEBHOOK_URL ||
		'https://n8n.chooomedia.com/webhook-test/websitehealth__done',
	N8N_WEBSITE_HEALTH_URL:
		import.meta.env.VITE_N8N_WEBSITE_HEALTH_URL ||
		'https://n8n.chooomedia.com/webhook-test/websitehealth',

	// Development Settings
	DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true',
	DEBUG_ENABLED: import.meta.env.VITE_DEBUG_ENABLED === 'true'
} as const;
