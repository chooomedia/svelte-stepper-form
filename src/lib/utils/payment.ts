// src/lib/utils/payment.ts
import { PaymentType, PlanType, getDiscountPercentage, getPlanDisplayName } from '$lib/types/plans';

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
 * Subscription plan metadata
 */
export interface PlanMeta {
	months: number;
	type: 'BASIS' | 'PREMIUM' | 'BUSINESS';
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
 * Extracts metadata from plan name
 * @param {PlanType} planType - Plan type
 * @returns {PlanMeta} Extracted metadata
 */
export function parsePlanMeta(planType: PlanType): PlanMeta {
	const months = parseInt(planType.split('-')[0], 10);
	return {
		months,
		type: months === 1 ? 'BASIS' : months === 3 ? 'PREMIUM' : 'BUSINESS'
	};
}

/**
 * Gets the base monthly price for a plan
 * @param {PlanType} planType - Plan type
 * @returns {number} Base monthly price
 */
export function getBasePriceForPlan(planType: PlanType): number {
	switch (planType) {
		case PlanType.ONE_MONTH:
			return 1.98;
		case PlanType.THREE_MONTH:
			return 3.98;
		case PlanType.SIX_MONTH:
			return 6.98;
		default:
			return 1.98;
	}
}

/**
 * Calculates the full price for a plan based on payment type
 * @param {PlanType} planType - Plan type
 * @param {PaymentType} paymentType - Payment type
 * @param {boolean} showExtraDiscount - Whether to show extra discount
 * @returns {number} Calculated price
 */
export function calculateFullPrice(
	planType: PlanType,
	paymentType: PaymentType,
	showExtraDiscount = false
): number {
	const basePrice = getBasePriceForPlan(planType);
	const months = parseInt(planType.split('-')[0], 10);
	const discountPercentage = getDiscountPercentage(paymentType, showExtraDiscount);

	switch (paymentType) {
		case PaymentType.MONTHLY:
			return basePrice;
		case PaymentType.ONE_TIME: {
			const fullPrice = basePrice * months;
			const discount = fullPrice * (discountPercentage / 100);
			return fullPrice - discount;
		}
		case PaymentType.LONGTIME: {
			const fullPrice = basePrice * months * 5; // 5 Jahre
			const discount = fullPrice * (discountPercentage / 100);
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
		case PaymentType.MONTHLY:
			return 'calendar';
		case PaymentType.ONE_TIME:
			return 'credit-card';
		case PaymentType.LONGTIME:
			return 'infinity';
		default:
			return 'credit-card';
	}
}
