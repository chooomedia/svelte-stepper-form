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

	// In moderner Umgebung crypto.randomUUID() verwenden
	// Fallback auf einfache Random-Implementierung
	const randomId =
		typeof crypto !== 'undefined' && crypto.getRandomValues
			? Array.from(crypto.getRandomValues(new Uint8Array(6)))
					.map((b) => b.toString(16).padStart(2, '0'))
					.join('')
			: Math.random().toString(36).substring(2, 8);

	return `dp-${year}${month}-${randomId}`;
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
			case '1-MONATS PLAN':
				return 'BASIS LONGTIME-ZUGANG';
			case '3-MONATS PLAN':
				return 'PREMIUM LONGTIME-ZUGANG';
			case '6-MONATS PLAN':
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
 * PayPal order details structure
 */
export interface PayPalOrderDetails {
	id: string;
	status: 'COMPLETED' | 'SAVED' | 'APPROVED' | 'VOIDED';
	create_time?: string;
	reference?: string;
	payer?: {
		email_address?: string;
		name?: {
			given_name?: string;
			surname?: string;
		};
	};
	purchase_units?: Array<{
		amount?: {
			currency_code?: string;
			value?: string;
		};
		description?: string;
	}>;
}

/**
 * Payment plan type definitions
 */
export type PaymentPlan = '1-MONATS PLAN' | '3-MONATS PLAN' | '6-MONATS PLAN';

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

/**
 * Gets the base monthly price for a plan
 * @param {PaymentPlan} planName - Plan name
 * @returns {number} Base monthly price
 */
export function getBasePriceForPlan(planName: PaymentPlan): number {
	switch (planName) {
		case '1-MONATS PLAN':
			return 1.98;
		case '3-MONATS PLAN':
			return 3.98;
		case '6-MONATS PLAN':
			return 6.98;
		default:
			return 1.98;
	}
}

/**
 * Calculates the full price for a plan based on payment type
 * @param {PaymentPlan} planName - Plan name
 * @param {PaymentType} paymentType - Payment type
 * @returns {number} Calculated price
 */
export function calculateFullPrice(planName: PaymentPlan, paymentType: PaymentType): number {
	const basePrice = getBasePriceForPlan(planName);
	const months = parseInt(planName.split('-')[0], 10);

	switch (paymentType) {
		case 'monatlich':
			return basePrice;
		case 'einmalig': {
			const fullPrice = basePrice * months;
			const discount = fullPrice * 0.08; // 8% Rabatt
			return fullPrice - discount;
		}
		case 'longtime': {
			const fullPrice = basePrice * months * 5; // 5 Jahre
			const discount = fullPrice * 0.2; // 20% Rabatt
			return fullPrice - discount;
		}
		default:
			return basePrice;
	}
}

/**
 * Get appropriate icon for payment type
 * @param {PaymentType} paymentType - Payment type
 * @returns {string} Icon name
 */
export function getPaymentTypeIcon(paymentType: PaymentType): string {
	switch (paymentType) {
		case 'monatlich':
			return 'calendar';
		case 'einmalig':
			return 'credit-card';
		case 'longtime':
			return 'infinity';
		default:
			return 'credit-card';
	}
}
