// src/lib/services/webhookService.ts
import { browser } from '$app/environment';
import type { FormData } from '$lib/schema';
import { get } from 'svelte/store';
import { formatEmailData, shouldGeneratePdf, isValidEmail } from '$lib/utils/emailUtils';
import { formData as formStoreData } from '$lib/stores/formStore';
import { scoreStore } from '$lib/utils/scoring';
import { env } from '$lib/config/env';

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
		if (!browser) {
			return { success: false, message: 'Cannot send from server environment' };
		}

		// Check daily limit
		if (this.hasReachedDailyLimit()) {
			return {
				success: false,
				message: 'Du hast dein tägliches Limit für E-Mails erreicht. Versuche es morgen erneut.'
			};
		}

		try {
			console.log('🚀 sendQuizResults called');
			console.log('📥 Provided formData:', formData);

			// Use provided formData or fall back to store data
			let currentFormData: Record<string, unknown> = {};
			if (formData) {
				currentFormData = formData;
				console.log('✅ Using provided formData');
			} else {
				console.log('⚠️ No formData provided, falling back to store');
				// Fallback to store data
				formStoreData.update((data) => {
					currentFormData = data;
					return data;
				});
			}

			console.log('🔍 Current form data:', currentFormData);
			const scoreData = get(scoreStore);
			console.log('🔍 Score data:', scoreData);

			// Validate email
			console.log('🔍 Validating email:', currentFormData.email);
			if (!currentFormData.email) {
				console.log('❌ No email found in form data');
				return {
					success: false,
					message: 'Bitte gib eine E-Mail-Adresse an, um die Ergebnisse zu erhalten.'
				};
			}
			console.log('✅ Email validation passed');

			// Prepare payload
			const payload = {
				...currentFormData,
				score: scoreData?.finalScore || currentFormData.visibility_score,
				timestamp: new Date().toISOString(),
				metrics: scoreData?.metrics || {}
			};

			// Debug: Log the payload being sent
			console.log('🔍 Webhook payload being sent:', payload);
			console.log('🔍 Company URL in payload:', payload.company_url);

			// Send request to webhook using the new URL
			console.log('🌐 Sending webhook request to:', this.WEBHOOK_URL);
			console.log('🌐 WEBHOOK_URL value:', this.WEBHOOK_URL);
			console.log('🌐 env.N8N_WEBHOOK_URL:', env.N8N_WEBHOOK_URL);
			console.log('📤 Request payload size:', JSON.stringify(payload).length, 'characters');

			const response = await fetch(this.WEBHOOK_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			// Handle response
			console.log('📥 Response received - Status:', response.status, response.statusText);
			console.log('📥 Response ok:', response.ok);

			if (response.ok) {
				console.log('✅ Webhook request successful');
				// Increment the daily email counter
				this.incrementEmailSendCount();

				return {
					success: true,
					message: 'Ergebnisse erfolgreich gesendet. Bitte prüfe deine E-Mail.'
				};
			} else {
				const errorText = await response.text();
				console.error('❌ Webhook error response:', errorText);
				console.error('❌ Response status:', response.status, response.statusText);

				return {
					success: false,
					message: `Es ist ein Fehler beim Senden der Ergebnisse aufgetreten (Status: ${response.status}). Bitte versuche es später erneut.`
				};
			}
		} catch (error) {
			console.error('Error sending quiz results:', error);

			return {
				success: false,
				message: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später erneut.'
			};
		}
	}
}
