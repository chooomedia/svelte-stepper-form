// src/lib/services/betterplaceService.ts
import { browser } from '$app/environment';
import { env } from '$lib/config/env';
import { BETTERPLACE_CONFIG } from '$lib/config/downloads';

/**
 * Betterplace API Endpoints
 */
const BETTERPLACE_ENDPOINTS = {
	FUNDRAISING_EVENT: BETTERPLACE_CONFIG.API_ENDPOINTS.FUNDRAISING_EVENT,
	DONATIONS: BETTERPLACE_CONFIG.API_ENDPOINTS.DONATIONS,
	PROJECTS: BETTERPLACE_CONFIG.API_ENDPOINTS.PROJECTS
};

/**
 * Betterplace Fundraising Event Interface
 */
export interface BetterplaceFundraisingEvent {
	id: number;
	title: string;
	description: string;
	progress_percentage: number;
	donated_amount_in_cents: number;
	requested_amount_in_cents: number;
	completed_at: string | null;
	created_at: string;
	updated_at: string;
	carrier: {
		name: string;
		slug: string;
		logo: string;
	};
	profile_picture: {
		links: Array<{
			rel: string;
			href: string;
		}>;
	};
}

/**
 * Betterplace Donation Interface
 */
export interface BetterplaceDonation {
	id: number;
	amount_in_cents: number;
	currency: string;
	message: string;
	created_at: string;
	donor: {
		name: string;
		email: string;
	};
	project_id: number;
	fundraising_event_id: number;
}

/**
 * Betterplace API Response Interface
 */
export interface BetterplaceApiResponse<T> {
	data: T;
	meta?: {
		total_count?: number;
		page?: number;
		per_page?: number;
	};
}

/**
 * Betterplace Service Class
 */
export class BetterplaceService {
	private static readonly BASE_URL = env.BETTERPLACE_API_URL;
	private static readonly FUNDRAISING_EVENT_ID = BETTERPLACE_CONFIG.FUNDRAISING_EVENT_ID;
	private static readonly DONATION_PERCENTAGE = BETTERPLACE_CONFIG.DONATION_PERCENTAGE;

	/**
	 * Get fundraising event details
	 */
	public static async getFundraisingEvent(): Promise<BetterplaceFundraisingEvent | null> {
		if (!browser) {
			console.warn('BetterplaceService: Can only be called in browser environment');
			return null;
		}

		try {
			const response = await fetch(`${this.BASE_URL}${BETTERPLACE_ENDPOINTS.FUNDRAISING_EVENT}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`Betterplace API error: ${response.status} ${response.statusText}`);
			}

			const result: BetterplaceApiResponse<BetterplaceFundraisingEvent> = await response.json();
			console.log('✅ Betterplace fundraising event fetched:', result.data);

			return result.data;
		} catch (error) {
			console.error('❌ Error fetching Betterplace fundraising event:', error);
			return null;
		}
	}

	/**
	 * Calculate donation amount based on percentage
	 */
	public static calculateDonationAmount(
		baseAmount: number,
		percentage: number = this.DONATION_PERCENTAGE
	): number {
		return Math.round(((baseAmount * percentage) / 100) * 100) / 100; // Round to 2 decimal places
	}

	/**
	 * Get donation percentage from config
	 */
	public static getDonationPercentage(): number {
		return this.DONATION_PERCENTAGE;
	}

	/**
	 * Format donation amount for display
	 */
	public static formatDonationAmount(amount: number, currency: string = 'EUR'): string {
		return `${amount.toFixed(2).replace('.', ',')}${currency}`;
	}

	/**
	 * Get fundraising event title for display
	 */
	public static async getFundraisingEventTitle(): Promise<string> {
		if (!browser) {
			console.warn('BetterplaceService: Can only be called in browser environment');
			return BETTERPLACE_CONFIG.EVENT_DETAILS.TITLE;
		}

		try {
			const response = await fetch(`${this.BASE_URL}${BETTERPLACE_ENDPOINTS.FUNDRAISING_EVENT}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					...(env.BETTERPLACE_API_KEY && { Authorization: `Bearer ${env.BETTERPLACE_API_KEY}` })
				}
			});

			if (!response.ok) {
				throw new Error(`Betterplace API error: ${response.status} ${response.statusText}`);
			}

			const result: BetterplaceApiResponse<BetterplaceFundraisingEvent> = await response.json();
			console.log('✅ Betterplace fundraising event title fetched:', result.data?.title);

			return result.data?.title || BETTERPLACE_CONFIG.EVENT_DETAILS.TITLE;
		} catch (error) {
			console.error('❌ Error fetching Betterplace fundraising event title:', error);
			return BETTERPLACE_CONFIG.EVENT_DETAILS.TITLE;
		}
	}

	/**
	 * Get fundraising event progress
	 */
	public static async getFundraisingEventProgress(): Promise<{
		percentage: number;
		donated: number;
		requested: number;
	}> {
		const event = await this.getFundraisingEvent();

		if (!event) {
			return {
				percentage: 0,
				donated: 0,
				requested: 10000 // Default fallback
			};
		}

		return {
			percentage: event.progress_percentage,
			donated: event.donated_amount_in_cents / 100,
			requested: event.requested_amount_in_cents / 100
		};
	}

	/**
	 * Create donation URL for Betterplace
	 */
	public static createDonationUrl(amount: number, message?: string): string {
		const baseUrl = BETTERPLACE_CONFIG.EVENT_URL;
		const params = new URLSearchParams();

		params.append('amount', amount.toString());
		if (message) {
			params.append('message', message);
		}

		return `${baseUrl}?${params.toString()}`;
	}

	/**
	 * Validate donation amount
	 */
	public static validateDonationAmount(amount: number): boolean {
		return amount > 0 && amount <= 10000; // Max 10,000 EUR
	}
}
