// utils/payment.ts

/**
 * Payment utility functions
 * @module utils/payment
 */

/**
 * Generates a unique client reference ID
 * @returns {string} Unique client reference in format dp-YYYYMM-XXXXXXX
 */
export function generateClientReference(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const random = crypto.getRandomValues(new Uint16Array(1))[0];
	return `dp-${year}${month}-${String(random).padStart(7, '0')}`;
}

/**
 * Payment type definitions
 */
export type PaymentType = 'monatlich' | 'einmalig' | 'longtime';

/**
 * Gets display name for a payment plan
 * @param {string} planName - Original plan name
 * @param {PaymentType} payType - Payment type
 * @returns {string} Localized display name
 */
export function getPlanDisplayName(planName: string, payType: PaymentType): string {
	if (payType === 'longtime') {
		switch (planName) {
			case '1-MONATS-PLAN':
				return 'BASIS LONGTIME-ZUGANG';
			case '3-MONATS-PLAN':
				return 'PREMIUM LONGTIME-ZUGANG';
			case '6-MONATS-PLAN':
				return 'BUSINESS LONGTIME-ZUGANG';
			default:
				return 'LONGTIME-ZUGANG';
		}
	}
	return planName;
}

/**
 * Tax calculation result
 */
export interface TaxInfo {
	net: number;
	vat: number;
	rate: number;
}

/**
 * Calculates tax breakdown
 * @param {number} total - Total price including tax
 * @param {number} vatRate - VAT rate in percentage
 * @returns {TaxInfo} Calculated tax information
 */
export function calculateTax(total: number, vatRate: number): TaxInfo {
	if (vatRate < 0 || vatRate > 100) {
		throw new Error('Invalid VAT rate');
	}

	const rate = vatRate / 100;
	const net = total / (1 + rate);
	const vat = total - net;

	return {
		net: Number(net.toFixed(2)),
		vat: Number(vat.toFixed(2)),
		rate: vatRate
	};
}

/**
 * Payment plan type definitions
 */
export type PaymentPlan = '1-MONATS-PLAN' | '3-MONATS-PLAN' | '6-MONATS-PLAN';

/**
 * PayPal order details structure
 */
export interface PayPalOrderDetails {
	id: string;
	status: 'COMPLETED' | 'SAVED' | 'APPROVED' | 'VOIDED';
	create_time: string;
	payer: {
		email_address: string;
		name: {
			given_name: string;
			surname: string;
		};
	};
	purchase_units: Array<{
		amount: {
			currency_code: string;
			value: string;
		};
		description: string;
	}>;
}

/**
 * Validates payment form data
 * @param {FormData} formData - User input data
 * @returns {Record<string, string>} Validation errors
 */
export function validatePaymentForm(formData: FormData): Record<string, string> {
	const errors: Record<string, string> = {};

	if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
		errors.email = 'Ungültige E-Mail-Adresse';
	}

	if (!formData.name?.trim()) {
		errors.name = 'Name ist erforderlich';
	}

	return errors;
}

/**
 * Formats currency values
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: EUR)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
	return new Intl.NumberFormat('de-DE', {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount);
}

/**
 * Subscription plan metadata
 */
export interface PlanMeta {
	months: number;
	type: 'BASIS' | 'PREMIUM' | 'BUSINESS';
}

/**
 * Extracts metadata from plan name
 * @param {PaymentPlan} planName - Plan name
 * @returns {PlanMeta} Extracted metadata
 */
export function parsePlanMeta(planName: PaymentPlan): PlanMeta {
	const months = parseInt(planName.split('-')[0], 10);
	return {
		months,
		type: months === 1 ? 'BASIS' : months === 3 ? 'PREMIUM' : 'BUSINESS'
	};
}
