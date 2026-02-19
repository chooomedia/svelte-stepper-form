// src/lib/config/downloads.ts
/**
 * Download-Links für verschiedene Assets
 * Diese können einfach geändert werden, ohne den Code zu modifizieren
 */

export const DOWNLOAD_LINKS = {
	// PDF-Downloads
	GEHEIMTIPP_PDF: 'https://digitalpusher.de/download/5-geheimtipps-pdf',

	// Alternative Links (falls der Hauptlink nicht funktioniert)
	GEHEIMTIPP_PDF_BACKUP: 'https://drive.google.com/file/d/your-file-id/view',

	// Weitere Downloads
	WHITEPAPER: 'https://digitalpusher.de/download/whitepaper',
	CHECKLIST: 'https://digitalpusher.de/download/checklist',

	// Pricing und Zahlungslinks
	PRICING_PAGE: 'https://digitalpusher.de/pricing',
	PAYMENT_PAGE: 'https://digitalpusher.de/payment',

	// Betterplace Integration
	BETTERPLACE_DONATION:
		'https://www.betterplace.org/de/fundraising-events/49121-wir-spenden-bei-professionellen-it-dienstleistungen',
	BETTERPLACE_API_DOCS: 'https://docs.betterplace.org/api/'
} as const;

/**
 * Pricing-Konfiguration für /downloads Route
 */
export const PRICING_CONFIG = {
	// Standard-Preise (in EUR)
	PRICES: {
		BASIC: 497,
		PROFESSIONAL: 997,
		ENTERPRISE: 1997
	},

	// Rabatte (in Prozent)
	DISCOUNTS: {
		MONTHLY: 0,
		QUARTERLY: 10,
		YEARLY: 20
	},

	// Betterplace Spende (in Prozent)
	DONATION_PERCENTAGE: 3,

	// Währung
	CURRENCY: 'EUR',

	// Steuersatz (in Prozent)
	VAT_RATE: 19
} as const;

/**
 * Betterplace-Integration Konfiguration
 */
export const BETTERPLACE_CONFIG = {
	// Fundraising Event ID
	FUNDRAISING_EVENT_ID: '49121',

	// Spende-Percentage
	DONATION_PERCENTAGE: 3,

	// Event URL
	EVENT_URL:
		'https://www.betterplace.org/de/fundraising-events/49121-wir-spenden-bei-professionellen-it-dienstleistungen',

	// API Endpoints
	API_ENDPOINTS: {
		FUNDRAISING_EVENT: '/fundraising_events/49121.json',
		DONATIONS: '/donations.json',
		PROJECTS: '/projects.json'
	},

	// Event Details
	EVENT_DETAILS: {
		TITLE: 'Wir spenden bei professionellen IT-Dienstleistungen',
		DESCRIPTION: 'Umweltschutzprojekte von Matt Interfaces',
		CARRIER: 'Matt Interfaces'
	}
} as const;

/**
 * Newsletter-Integration Konfiguration
 */
export const NEWSLETTER_CONFIG = {
	// Brevo API Konfiguration
	BREVO_API_KEY: import.meta.env.VITE_BREVO_API_KEY,
	BREVO_LIST_ID: import.meta.env.VITE_BREVO_LIST_ID || '1',

	// Newsletter-Einstellungen
	DOUBLE_OPT_IN: true,
	UPDATE_EXISTING: true,

	// Attribute für Brevo
	ATTRIBUTES: {
		FIRSTNAME: 'FIRSTNAME',
		LASTNAME: 'LASTNAME',
		COMPANY: 'COMPANY',
		WEBSITE: 'WEBSITE',
		PHONE: 'PHONE',
		SOURCE: 'SOURCE',
		SCORE: 'SCORE',
		LANGUAGE: 'LANGUAGE',
		CONSENT_DATE: 'CONSENT_DATE'
	} as const
} as const;

/**
 * Erstelle Newsletter-Payload für Brevo
 */
export function createNewsletterPayload(formData: Record<string, unknown>) {
	return {
		email: formData.email as string,
		attributes: {
			[NEWSLETTER_CONFIG.ATTRIBUTES.FIRSTNAME]: formData.first_name || '',
			[NEWSLETTER_CONFIG.ATTRIBUTES.LASTNAME]: formData.last_name || '',
			[NEWSLETTER_CONFIG.ATTRIBUTES.COMPANY]: formData.company_name || '',
			[NEWSLETTER_CONFIG.ATTRIBUTES.WEBSITE]: formData.company_url || '',
			[NEWSLETTER_CONFIG.ATTRIBUTES.PHONE]: formData.phone || '',
			[NEWSLETTER_CONFIG.ATTRIBUTES.SOURCE]: 'website-analysis',
			[NEWSLETTER_CONFIG.ATTRIBUTES.SCORE]: formData.visibility_score || 0,
			[NEWSLETTER_CONFIG.ATTRIBUTES.LANGUAGE]: formData.language || 'de',
			[NEWSLETTER_CONFIG.ATTRIBUTES.CONSENT_DATE]: new Date().toISOString()
		},
		listIds: [parseInt(NEWSLETTER_CONFIG.BREVO_LIST_ID)],
		emailBlacklisted: false,
		smsBlacklisted: false,
		updateEnabled: NEWSLETTER_CONFIG.UPDATE_EXISTING
	};
}
