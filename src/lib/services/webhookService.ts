// src/lib/services/webhookService.ts
import { browser } from '$app/environment';
import type { FormData } from '$lib/schema';
import { formatEmailData, shouldGeneratePdf } from '$lib/utils/emailUtils';
import { env } from '$lib/config/env';
import { hasReachedDailyLimit, incrementEmailSendCount, resetDailyCounter } from './rateLimiting';
import { QuizService } from './quizService';

/**
 * Interface for webhook response
 */
export interface WebhookResponse {
	success: boolean;
	message: string;
	data?: any;
}

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

	/**
	 * Checks if the user has reached the daily limit for email reports
	 * @returns boolean indicating if limit has been reached
	 */
	static hasReachedDailyLimit(): boolean {
		return hasReachedDailyLimit();
	}

	/**
	 * Resets the daily counter for email reports
	 */
	static resetDailyCounter(): void {
		resetDailyCounter();
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
			console.log('📧 Sending email report for:', formData.email);

			// Format email data
			const emailData = formatEmailData(formData);
			console.log('📧 Formatted email data:', emailData);

			// Check if PDF should be generated
			const shouldGenerate = shouldGeneratePdf(formData);
			console.log('📧 Should generate PDF:', shouldGenerate);

			// Prepare payload
			const payload = {
				...emailData,
				shouldGeneratePdf: shouldGenerate,
				timestamp: new Date().toISOString()
			};

			console.log('📤 Sending payload to webhook:', this.WEBHOOK_URL);

			// Send to webhook
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
			console.log('✅ Email report sent successfully:', result);

			// Increment daily counter
			incrementEmailSendCount();

			return {
				success: true,
				message: 'E-Mail-Bericht erfolgreich gesendet',
				data: result
			};
		} catch (error) {
			console.error('❌ Error sending email report:', error);
			return {
				success: false,
				message: error instanceof Error ? error.message : 'Unbekannter Fehler aufgetreten'
			};
		}
	}

	/**
	 * Check if the webhook service is available
	 * @returns Promise<boolean> indicating if service is available
	 */
	static async checkServiceAvailability(): Promise<boolean> {
		if (!browser) return false;

		try {
			const response = await fetch(this.BASE_URL + this.ENDPOINTS.WEBSITE_HEALTH, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return response.ok;
		} catch (error) {
			console.error('❌ Service availability check failed:', error);
			return false;
		}
	}

	/**
	 * Check website health using the webhook service
	 * @param url The website URL to check
	 * @returns Promise with health check results
	 */
	static async checkWebsiteHealth(url: string): Promise<unknown> {
		if (!browser) {
			return { success: false, message: 'Can only be called in browser environment' };
		}

		try {
			console.log('🔍 Checking website health for:', url);

			const payload = {
				url: url,
				timestamp: new Date().toISOString()
			};

			const response = await fetch(this.BASE_URL + this.ENDPOINTS.WEBSITE_HEALTH, {
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
			console.log('✅ Website health check completed:', result);

			return result;
		} catch (error) {
			console.error('Error in website health check:', error);
			throw error;
		}
	}

	public static async sendQuizResults(
		formData?: Record<string, unknown>
	): Promise<WebhookResponse> {
		return QuizService.sendQuizResults(formData);
	}
}
