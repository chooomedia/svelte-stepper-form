// src/lib/services/webhookService.ts
import { browser } from '$app/environment';
import type { FormData } from '$lib/schema';
import { get } from 'svelte/store';
import { formatEmailData, shouldGeneratePdf, isValidEmail } from '$lib/utils/emailUtils';
import { env } from '$lib/config/env';
import { currentLocale, translations, formatDate } from '$lib/i18n';

// Store for rate limiting data
const STORAGE_KEY = 'digitalpusher_email_reports';

/**
 * Interface for webhook response
 */
export interface WebhookResponse {
	success: boolean;
	message: string;
	data?: unknown;
}

/**
 * Service to handle webhook communications with n8n
 */
export class WebhookService {
	private static readonly BASE_URL = env.N8N_BASE_URL;
	private static readonly WEBHOOK_URL = env.N8N_WEBHOOK_URL;
	private static readonly ENDPOINTS = {
		WEBSITE_HEALTH: '/websitehealth',
		SEND_REPORT: '/websitehealth__done'
	};

	// Debug: Log the initialized URLs
	static {
		console.log('🔧 WebhookService initialized with:');
		console.log('🔧 BASE_URL:', env.N8N_BASE_URL);
		console.log('🔧 WEBHOOK_URL:', env.N8N_WEBHOOK_URL);
		console.log('🔧 N8N_WEBHOOK_URL from env:', env.N8N_WEBHOOK_URL);
	}

	// Daily limit for email reports
	private static readonly DAILY_LIMIT = 3;

	/**
	 * Checks if the user has reached the daily limit for email reports
	 * @returns boolean indicating if limit has been reached
	 */
	static hasReachedDailyLimit(): boolean {
		if (!browser) return false;

		// Get stored data from localStorage
		const storedData = localStorage.getItem(STORAGE_KEY);

		if (!storedData) {
			return false; // No data stored yet
		}

		try {
			// Parse stored data
			const data = JSON.parse(storedData);

			// Check if data is for the current day
			const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

			if (data.date !== today) {
				// It's a new day, reset counter
				this.resetDailyCounter();
				return false;
			}

			// Check if limit is reached
			return data.count >= this.DAILY_LIMIT;
		} catch (error) {
			// If there's an error parsing the data, reset the counter
			console.error('Error parsing stored rate limit data:', error);
			this.resetDailyCounter();
			return false;
		}
	}

	/**
	 * Increments the daily counter for email reports
	 */
	private static incrementDailyCounter(): void {
		if (!browser) return;

		const today = new Date().toISOString().split('T')[0];
		let count = 1;

		// Get stored data
		const storedData = localStorage.getItem(STORAGE_KEY);

		if (storedData) {
			try {
				const data = JSON.parse(storedData);

				// If same day, increment counter
				if (data.date === today) {
					count = data.count + 1;
				}
			} catch (error) {
				// Ignore parsing errors
				console.error('Error parsing stored rate limit data:', error);
			}
		}

		// Store updated data
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				date: today,
				count
			})
		);
	}

	/**
	 * Increments the daily counter for quiz results
	 */
	private static incrementEmailSendCount(): void {
		this.incrementDailyCounter();
	}

	/**
	 * Resets the daily counter for email reports
	 */
	static resetDailyCounter(): void {
		if (!browser) return;

		const today = new Date().toISOString().split('T')[0];

		// Reset counter for today
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				date: today,
				count: 0
			})
		);
	}

	/**
	 * Send form data to generate and send email report
	 *
	 * @param formData The form data from the last step
	 * @returns Promise with webhook response
	 */
	static async sendEmailReport(formData: Partial<FormData>): Promise<WebhookResponse> {
		if (!browser) {
			return { success: false, message: 'Can only be called in browser environment' };
		}

		// Check if daily limit has been reached
		if (this.hasReachedDailyLimit()) {
			return {
				success: false,
				message:
					'Das tägliche Limit für E-Mail-Berichte wurde erreicht. Bitte versuche es morgen erneut.'
			};
		}

		try {
			// Validate email first
			if (!formData.email || !isValidEmail(formData.email)) {
				return {
					success: false,
					message: 'Bitte gib eine gültige E-Mail-Adresse an'
				};
			}

			// Format data for email template including proper metadata
			const formattedData = formatEmailData(formData);

			// Determine if we should generate a PDF attachment
			const generatePdf = shouldGeneratePdf(formData);

			// Complete payload
			const payloadData = {
				...formattedData,
				generatePdf,
				format: generatePdf ? 'pdf+html' : 'html'
			};

			// Log request for debugging
			console.log('Sending email report request with data:', payloadData);

			// Use our server-side API route instead of directly calling n8n
			// This provides better error handling and avoids CORS issues
			const response = await fetch('/api/webhook/email-report', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({ body: payloadData }),
				// Set a reasonable timeout
				signal: AbortSignal.timeout(30000) // 30 seconds timeout
			});

			// Handle non-success HTTP responses
			if (!response.ok) {
				const errorText = await response.text();
				console.error('Webhook error response:', errorText);
				return {
					success: false,
					message: `Server responded with status: ${response.status} ${response.statusText}`
				};
			}

			// Parse the JSON response
			const result = await response.json();
			console.log('Webhook response:', result);

			// Increment daily counter on successful email send
			this.incrementDailyCounter();

			return {
				success: true,
				message: 'Bericht wurde erfolgreich per E-Mail versendet',
				data: result
			};
		} catch (error) {
			console.error('Error sending email report:', error);

			let errorMessage = 'Fehler beim Senden des Berichts';
			if (error instanceof Error) {
				// If it's a timeout error
				if (error.name === 'TimeoutError' || error.name === 'AbortError') {
					errorMessage = 'Die Anfrage hat zu lange gedauert. Bitte versuche es später erneut.';
				} else {
					errorMessage = `Fehler: ${error.message}`;
				}
			}

			return {
				success: false,
				message: errorMessage
			};
		}
	}

	/**
	 * Check if the n8n service is available
	 *
	 * @returns Promise with availability status
	 */
	static async checkServiceAvailability(): Promise<boolean> {
		if (!browser) return false;

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

			const response = await fetch(`${this.BASE_URL}/ping`, {
				method: 'GET',
				signal: controller.signal
			});

			clearTimeout(timeoutId);
			return response.ok;
		} catch (error) {
			console.warn('n8n service appears to be unavailable:', error);
			return false;
		}
	}

	/**
	 * Send a website health check request
	 *
	 * @param url The website URL to analyze
	 * @returns Promise with website health data
	 */
	static async checkWebsiteHealth(url: string): Promise<unknown> {
		if (!browser) {
			return { success: false, message: 'Can only be called in browser environment' };
		}

		try {
			// Prepare URL for the request
			let webhookUrl = url.trim();
			if (!webhookUrl.startsWith('http://') && !webhookUrl.startsWith('https://')) {
				webhookUrl = 'https://' + webhookUrl;
			}
			if (!webhookUrl.endsWith('/')) {
				webhookUrl = webhookUrl + '/';
			}

			// Encode the URL
			const encodedUrl = encodeURIComponent(webhookUrl);
			const apiUrl = `${this.BASE_URL}${this.ENDPOINTS.WEBSITE_HEALTH}?url=${encodedUrl}`;

			// Make the API request
			const response = await fetch(apiUrl, {
				method: 'GET',
				headers: {
					Accept: 'application/json'
				},
				signal: AbortSignal.timeout(180000) // 3 minute timeout
			});

			if (!response.ok) {
				throw new Error(`API error: ${response.status}`);
			}

			// Parse the response
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error in website health check:', error);
			throw error;
		}
	}

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

			// Prüfe Rate Limiting
			if (this.hasReachedDailyLimit() && !import.meta.env.DEV) {
				throw new Error('Daily email limit reached');
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

			// Erstelle den Payload mit sprachspezifischen Daten
			const payload = this.createLocalizedPayload(currentFormData, language);
			console.log('📤 Request payload size:', JSON.stringify(payload).length, 'characters');

			// Sende den Webhook
			console.log('🌐 Sending webhook request to:', this.WEBHOOK_URL);
			console.log('🌐 WEBHOOK_URL value:', this.WEBHOOK_URL);
			console.log('🌐 env.N8N_WEBHOOK_URL:', env.N8N_WEBHOOK_URL);

			const response = await fetch(this.WEBHOOK_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'User-Agent': 'DigitalPusher-WebsiteHealth/1.0'
				},
				body: JSON.stringify(payload)
			});

			console.log('📥 Response received - Status:', response.status, response.statusText);
			console.log('📥 Response ok:', response.ok);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('❌ Webhook error response:', errorText);
				throw new Error(`Webhook failed with status ${response.status}: ${errorText}`);
			}

			// Erfolgreich gesendet - aktualisiere Rate Limiting
			this.incrementDailyCounter();

			// Robuste JSON-Parsing mit Fallback
			let responseData = null;
			try {
				const responseText = await response.text();
				if (responseText && responseText.trim()) {
					responseData = JSON.parse(responseText);
				}
			} catch (parseError) {
				console.warn('⚠️ Response parsing failed, using empty data:', parseError);
				responseData = {};
			}

			console.log('✅ Webhook successful:', responseData);

			return {
				success: true,
				message: 'Results sent successfully',
				data: responseData
			};
		} catch (error) {
			console.error('❌ Error in sendQuizResults:', error);
			return {
				success: false,
				message: error instanceof Error ? error.message : 'Unknown error occurred',
				data: null
			};
		}
	}

	/**
	 * Erstellt einen lokalisierten Payload für den Webhook
	 */
	private static createLocalizedPayload(
		formData: Record<string, unknown>,
		language: string
	): Record<string, unknown> {
		// Basis-Payload
		const payload: Record<string, unknown> = {
			...formData,
			timestamp: new Date().toISOString(),
			language: language
		};

		// Füge sprachspezifische Template-Daten hinzu
		const templateData = this.createTemplateData(formData, language);
		payload.templateData = templateData;

		return payload;
	}

	/**
	 * Erstellt Template-Daten basierend auf der Sprache
	 */
	private static createTemplateData(
		formData: Record<string, unknown>,
		language: string
	): Record<string, unknown> {
		// Verwende die vorhandene formatDate Funktion für konsistente Datumsformatierung
		const currentDate = formatDate(new Date(), {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

		// Basis-Template-Daten
		const templateData: Record<string, unknown> = {
			languageCode: language,
			greeting: `${formData.salutation} ${formData.first_name} ${formData.last_name}`,
			salutation: formData.salutation,
			first_name: formData.first_name,
			last_name: formData.last_name,
			company_name: formData.company_name,
			company_url: formData.company_url,
			email: formData.email,
			fromEmail: env.DEMO_EMAIL,
			currentDate: currentDate,
			visibility_score: formData.visibility_score || 0,
			score_color: '#6bd0d9', // Standard-Farbe
			circle_offset: 0 // Standard-Offset
		};

		// E-Mail-Template Texte basierend auf der Sprache - robuste Implementierung
		this.addLocalizedTemplateTexts(templateData, language, formData);

		// Sprachspezifische Formatierungen mit tatsächlichen Übersetzungen
		if (language === 'de') {
			templateData.visibility_formatted = this.formatGermanValue('visibility', formData.visibility);
			templateData.advertising_frequency_formatted = this.formatGermanValue(
				'advertising_frequency',
				formData.advertising_frequency
			);
			templateData.goals_formatted = this.formatGermanValue('goals', formData.goals);
			templateData.campaign_management_formatted = this.formatGermanValue(
				'campaign_management',
				formData.campaign_management
			);
			templateData.business_phase_formatted = this.formatGermanValue(
				'business_phase',
				formData.business_phase
			);
			templateData.implementation_time_formatted = this.formatGermanValue(
				'implementation_time',
				formData.implementation_time
			);
		} else if (language === 'hu') {
			templateData.visibility_formatted = this.formatHungarianValue(
				'visibility',
				formData.visibility
			);
			templateData.advertising_frequency_formatted = this.formatHungarianValue(
				'advertising_frequency',
				formData.advertising_frequency
			);
			templateData.goals_formatted = this.formatHungarianValue('goals', formData.goals);
			templateData.campaign_management_formatted = this.formatHungarianValue(
				'campaign_management',
				formData.campaign_management
			);
			templateData.business_phase_formatted = this.formatHungarianValue(
				'business_phase',
				formData.business_phase
			);
			templateData.implementation_time_formatted = this.formatHungarianValue(
				'implementation_time',
				formData.implementation_time
			);
		} else {
			templateData.visibility_formatted = this.formatEnglishValue(
				'visibility',
				formData.visibility
			);
			templateData.advertising_frequency_formatted = this.formatEnglishValue(
				'advertising_frequency',
				formData.advertising_frequency
			);
			templateData.goals_formatted = this.formatEnglishValue('goals', formData.goals);
			templateData.campaign_management_formatted = this.formatEnglishValue(
				'campaign_management',
				formData.campaign_management
			);
			templateData.business_phase_formatted = this.formatEnglishValue(
				'business_phase',
				formData.business_phase
			);
			templateData.implementation_time_formatted = this.formatEnglishValue(
				'implementation_time',
				formData.implementation_time
			);
		}

		// Metriken-Info sprachspezifisch formatieren
		if (formData.metrics) {
			templateData.metrics_info = this.formatLocalizedMetrics(
				formData.metrics as Record<string, number>,
				language
			);
		}

		return templateData;
	}

	/**
	 * Formatiert deutsche Werte
	 */
	private static formatGermanValue(field: string, value: unknown): string {
		const germanFormats: Record<string, Record<string, string>> = {
			visibility: {
				search_engines: 'Suchmaschinen',
				social_media: 'Social Media',
				print: 'Print',
				store: 'Ladengeschäft'
			},
			advertising_frequency: {
				weekly: 'Wöchentlich',
				monthly: 'Monatlich',
				yearly: 'Jährlich'
			},
			goals: {
				new_clients: 'Neukundengewinnung',
				new_employees: 'Mitarbeitergewinnung',
				more_online: 'Mehr Onlinepräsenz',
				all: 'Alle Bereiche'
			},
			campaign_management: {
				self: 'Ich selber',
				digitalpusher: 'Digital Pusher',
				employee: 'Mitarbeiter'
			},
			business_phase: {
				planning: 'Gründung ist geplant',
				less_than_6_months: 'Jünger als 6 Monate',
				more_than_6_months: 'Älter als 6 Monate',
				family_business: 'Familienbetrieb'
			},
			implementation_time: {
				immediate: 'In Rekordzeit',
				medium: 'In 2-6 Monaten',
				long_term: 'Mehr als 6 Monate'
			}
		};

		const fieldFormats = germanFormats[field];
		if (!fieldFormats) return String(value || '');

		if (Array.isArray(value)) {
			return value
				.filter((v) => v && v !== '')
				.map((v) => fieldFormats[v as string] || v)
				.join(', ');
		}

		return fieldFormats[value as string] || String(value || '');
	}

	/**
	 * Formatiert ungarische Werte
	 */
	private static formatHungarianValue(field: string, value: unknown): string {
		const hungarianFormats: Record<string, Record<string, string>> = {
			visibility: {
				search_engines: 'Keresőmotorok',
				social_media: 'Közösségi média',
				print: 'Nyomtatott média',
				store: 'Fizikai üzlet'
			},
			advertising_frequency: {
				weekly: 'Hetente',
				monthly: 'Havonta',
				yearly: 'Évente'
			},
			goals: {
				new_clients: 'Új ügyfelek szerzése',
				new_employees: 'Alkalmazottak toborzása',
				more_online: 'Több online jelenlét',
				all: 'Minden terület'
			},
			campaign_management: {
				self: 'Önálló kezelés',
				digitalpusher: 'Digital Pusher',
				employee: 'Alkalmazott'
			},
			business_phase: {
				planning: 'Tervezési fázis',
				less_than_6_months: '6 hónapnál fiatalabb',
				more_than_6_months: '6 hónapnál idősebb',
				family_business: 'Családi vállalkozás'
			},
			implementation_time: {
				immediate: 'Azonnali megvalósítás',
				medium: '2-6 hónapon belül',
				long_term: '6 hónapnál tovább'
			}
		};

		const fieldFormats = hungarianFormats[field];
		if (!fieldFormats) return String(value || '');

		if (Array.isArray(value)) {
			return value
				.filter((v) => v && v !== '')
				.map((v) => fieldFormats[v as string] || v)
				.join(', ');
		}

		return fieldFormats[value as string] || String(value || '');
	}

	/**
	 * Formatiert englische Werte
	 */
	private static formatEnglishValue(field: string, value: unknown): string {
		const englishFormats: Record<string, Record<string, string>> = {
			visibility: {
				search_engines: 'Search Engines',
				social_media: 'Social Media',
				print: 'Print Media',
				store: 'Physical Store'
			},
			advertising_frequency: {
				weekly: 'Weekly',
				monthly: 'Monthly',
				yearly: 'Yearly'
			},
			goals: {
				new_clients: 'New Customer Acquisition',
				new_employees: 'Employee Recruitment',
				more_online: 'More Online Presence',
				all: 'All Areas'
			},
			campaign_management: {
				self: 'Self-managed',
				digitalpusher: 'Digital Pusher',
				employee: 'Employee'
			},
			business_phase: {
				planning: 'Planning Phase',
				less_than_6_months: 'Less than 6 months',
				more_than_6_months: 'More than 6 months',
				family_business: 'Family Business'
			},
			implementation_time: {
				immediate: 'Immediate Implementation',
				medium: 'In 2-6 months',
				long_term: 'More than 6 months'
			}
		};

		const fieldFormats = englishFormats[field];
		if (!fieldFormats) return String(value || '');

		if (Array.isArray(value)) {
			return value
				.filter((v) => v && v !== '')
				.map((v) => fieldFormats[v as string] || v)
				.join(', ');
		}

		return fieldFormats[value as string] || String(value || '');
	}

	/**
	 * Fügt lokalisierte Template-Texte basierend auf der Sprache hinzu
	 */
	private static addLocalizedTemplateTexts(
		templateData: Record<string, unknown>,
		language: string,
		formData: Record<string, unknown>
	): void {
		// Verwende die vorhandenen Übersetzungen aus dem i18n-System
		const translation = translations[language as keyof typeof translations];

		if (!translation) {
			console.warn(`🌍 No translation found for language: ${language}, using fallback`);
			return;
		}

		// E-Mail-Template Texte aus den Übersetzungen
		if (translation.email) {
			templateData.results = {
				description: translation.email.results.description
					.replace('{company_url}', String(formData.company_url || 'weboldala'))
					.replace('{currentDate}', String(templateData.currentDate)),
				visibilityScore: translation.email.results.visibilityScore.replace(
					'{score}',
					String(templateData.visibility_score)
				),
				scoreDescription: translation.email.results.scoreDescription
			};

			templateData.situation = {
				title: translation.email.situation.title,
				visibility: translation.email.situation.visibility,
				advertisingFrequency: translation.email.situation.advertisingFrequency,
				goals: translation.email.situation.goals,
				campaignManagement: translation.email.situation.campaignManagement,
				businessPhase: translation.email.situation.businessPhase,
				implementationTime: translation.email.situation.implementationTime
			};

			templateData.cta = {
				title: translation.email.cta.title,
				description: translation.email.cta.description,
				highlight: translation.email.cta.highlight,
				urgency: translation.email.cta.urgency,
				button: translation.email.cta.button
			};

			templateData.footer = {
				copyright: translation.email.footer.copyright,
				unsubscribe: translation.email.footer.unsubscribe,
				privacy: translation.email.footer.privacy,
				imprint: translation.email.footer.imprint,
				disclaimer: translation.email.footer.disclaimer
			};
		}
	}

	/**
	 * Formatiert Metriken-Info basierend auf der Sprache
	 */
	private static formatLocalizedMetrics(metrics: Record<string, number>, language: string): string {
		// Verwende die vorhandenen Übersetzungen für Metriken-Labels
		const metricLabels: Record<string, Record<string, string>> = {
			de: {
				performance: 'Performance',
				seo: 'SEO',
				accessibility: 'Zugänglichkeit',
				bestPractices: 'Best Practices',
				content: 'Content',
				security: 'Sicherheit'
			},
			hu: {
				performance: 'Teljesítmény',
				seo: 'SEO',
				accessibility: 'Hozzáférhetőség',
				bestPractices: 'Legjobb gyakorlatok',
				content: 'Tartalom',
				security: 'Biztonság'
			},
			en: {
				performance: 'Performance',
				seo: 'SEO',
				accessibility: 'Accessibility',
				bestPractices: 'Best Practices',
				content: 'Content',
				security: 'Security'
			}
		};

		const labels = metricLabels[language] || metricLabels.en;
		const metricsList = Object.entries(metrics)
			.map(([key, value]) => `${labels[key] || key}: ${value}/100`)
			.join(', ');

		return `${language === 'de' ? 'Technische Metriken' : language === 'hu' ? 'Technikai metrikák' : 'Technical Metrics'}: ${metricsList}`;
	}

	/**
	 * Formatiert Metriken-Info basierend auf der Sprache (Legacy-Methode)
	 */
	private static formatMetricsInfo(metrics: Record<string, number>, language: string): string {
		return this.formatLocalizedMetrics(metrics, language);
	}
}
