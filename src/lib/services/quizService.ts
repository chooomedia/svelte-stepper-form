// src/lib/services/quizService.ts
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { currentLocale, translations } from '$lib/i18n';
import { isValidEmail } from '$lib/utils/emailUtils';
import { formatGermanValue, formatHungarianValue, formatEnglishValue } from './formatting';
import { incrementEmailSendCount } from './rateLimiting';
import { env } from '$lib/config/env';

export interface WebhookResponse {
	success: boolean;
	message: string;
	data?: any;
}

export interface QuizPayload {
	email: string;
	language: string;
	formData: Record<string, unknown>;
	templateData: Record<string, unknown>;
	metrics?: Record<string, number>;
}

export class QuizService {
	private static readonly BASE_URL = env.N8N_BASE_URL;
	private static readonly WEBHOOK_URL = env.N8N_WEBHOOK_URL;

	/**
	 * Send quiz results to webhook
	 */
	public static async sendQuizResults(
		formData?: Record<string, unknown>
	): Promise<WebhookResponse> {
		try {
			console.log('🚀 sendQuizResults called');
			console.log('📥 Provided formData:', formData);

			// Verwende die übergebenen Formulardaten oder fallback auf Standard
			const currentFormData = formData || {};
			console.log('🔍 Current form data:', currentFormData);

			if (!currentFormData) {
				throw new Error('No form data available');
			}

			// Prüfe E-Mail-Validität
			const email = currentFormData.email as string;
			if (!email || !isValidEmail(email)) {
				throw new Error('Invalid email address');
			}

			// Bestimme die Sprache robust und typsicher
			const currentStoreLocale = get(currentLocale);
			let language: string = currentStoreLocale || 'de';

			// Fallback: Prüfe ob die Sprache in den Formulardaten gesetzt ist
			if (currentFormData.language && typeof currentFormData.language === 'string') {
				// Validiere, ob die Sprache unterstützt wird
				if (Object.keys(translations).includes(currentFormData.language)) {
					language = currentFormData.language;
					console.log('🌍 Language from form data:', language);
				} else {
					console.warn('🌍 Unsupported language in form data:', currentFormData.language);
				}
			}

			// Finale Validierung und Fallback
			if (!language || !Object.keys(translations).includes(language)) {
				language = 'de'; // Standard-Fallback
				console.warn('🌍 Invalid language, using fallback:', language);
			}

			console.log('🌍 Language detected from store:', currentStoreLocale);
			console.log('🌍 Language used for template:', language);
			console.log('🌍 Available translations:', Object.keys(translations));

			// Erstelle den Payload
			const payload = this.createLocalizedPayload(currentFormData, language);
			console.log('📤 Payload created:', payload);

			// Sende die Daten an den Webhook
			const response = await fetch(this.WEBHOOK_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			console.log('✅ Webhook response:', result);

			// Inkrementiere den E-Mail-Zähler
			incrementEmailSendCount();

			return {
				success: true,
				message: 'Quiz results sent successfully',
				data: result
			};
		} catch (error) {
			console.error('❌ Error sending quiz results:', error);
			return {
				success: false,
				message: error instanceof Error ? error.message : 'Unknown error occurred'
			};
		}
	}

	/**
	 * Create localized payload for webhook
	 */
	private static createLocalizedPayload(
		formData: Record<string, unknown>,
		language: string
	): QuizPayload {
		const templateData = this.createTemplateData(formData, language);

		return {
			email: formData.email as string,
			language,
			formData,
			templateData
		};
	}

	/**
	 * Create template data with localized formatting
	 */
	private static createTemplateData(
		formData: Record<string, unknown>,
		language: string
	): Record<string, unknown> {
		const templateData: Record<string, unknown> = {};

		// Include the full translations from the Svelte app
		templateData.templateTexts = translations[language] || translations.de;

		// Format values based on language
		for (const [key, value] of Object.entries(formData)) {
			if (value === null || value === undefined || value === '') {
				continue;
			}

			let formattedValue: string;

			switch (language) {
				case 'de':
					formattedValue = formatGermanValue(key, value);
					break;
				case 'hu':
					formattedValue = formatHungarianValue(key, value);
					break;
				case 'en':
					formattedValue = formatEnglishValue(key, value);
					break;
				default:
					formattedValue = String(value);
			}

			templateData[key] = formattedValue;
		}

		// Add localized template texts
		this.addLocalizedTemplateTexts(templateData, language);

		return templateData;
	}

	/**
	 * Add localized template texts
	 */
	private static addLocalizedTemplateTexts(
		templateData: Record<string, unknown>,
		language: string
	): void {
		const t = translations[language] || translations.de;

		// Add common template texts
		templateData.templateTexts = {
			title: t.results?.title || 'Website-Analyse',
			subtitle: t.results?.subtitle || 'Ihre personalisierte Analyse',
			companyName: t.results?.companyName || 'Unternehmen',
			website: t.results?.website || 'Website',
			score: t.results?.score || 'Score',
			recommendations: t.results?.recommendations || 'Empfehlungen',
			contact: t.results?.contact || 'Kontakt',
			language: language
		};

		// Add metrics info if available
		if (templateData.metrics && typeof templateData.metrics === 'object') {
			templateData.metricsInfo = this.formatMetricsInfo(
				templateData.metrics as Record<string, number>,
				language
			);
		}
	}

	/**
	 * Format metrics info with localized labels
	 */
	private static formatMetricsInfo(metrics: Record<string, number>, language: string): string {
		return this.formatLocalizedMetrics(metrics, language);
	}

	/**
	 * Format localized metrics
	 */
	private static formatLocalizedMetrics(metrics: Record<string, number>, language: string): string {
		// Verwende die vorhandenen Übersetzungen für Metriken-Labels
		const metricLabels: Record<string, Record<string, string>> = {
			de: {
				seo: 'SEO',
				performance: 'Performance',
				accessibility: 'Zugänglichkeit',
				bestPractices: 'Best Practices',
				content: 'Content',
				security: 'Sicherheit'
			},
			hu: {
				seo: 'SEO',
				performance: 'Teljesítmény',
				accessibility: 'Akadálymentesség',
				bestPractices: 'Legjobb gyakorlatok',
				content: 'Tartalom',
				security: 'Biztonság'
			},
			en: {
				seo: 'SEO',
				performance: 'Performance',
				accessibility: 'Accessibility',
				bestPractices: 'Best Practices',
				content: 'Content',
				security: 'Security'
			}
		};

		const labels = metricLabels[language] || metricLabels.de;
		const formattedMetrics: string[] = [];

		for (const [key, value] of Object.entries(metrics)) {
			const label = labels[key] || key;
			formattedMetrics.push(`${label}: ${value}/100`);
		}

		return formattedMetrics.join(', ');
	}
}
