// Plan-Typen
export enum PlanType {
	ONE_MONTH = '1-MONATS PLAN',
	THREE_MONTH = '3-MONATS PLAN',
	SIX_MONTH = '6-MONATS PLAN'
}

// Zahlungsarten
export enum PaymentType {
	MONTHLY = 'monatlich',
	ONE_TIME = 'einmalig',
	LONGTIME = 'longtime'
}

const DEFAULT_DISCOUNTS = {
	[PaymentType.MONTHLY]: { standard: 0, extra: 0 },
	[PaymentType.ONE_TIME]: { standard: 8, extra: 13 },
	[PaymentType.LONGTIME]: { standard: 20, extra: 25 }
};

// Interfaces für die Struktur der Pläne
export interface PlanOption {
	type: PlanType;
	name: string;
	price: number;
	originalPrice: number;
	perDay: string;
	popular: boolean;
	features: string[];
	monthlyPrice?: number;
}

// Schnittstelle für die Zahlungsoption
export interface PaymentOption {
	type: PaymentType;
	discountPercentage: number; // Standardrabatt
	extraDiscountPercentage: number; // Zusätzlicher Rabatt bei Rückkehr zum Kaufvorgang
	labelKey: string; // i18n Key für die Übersetzung
}

// Helper-Funktionen für Zahlungstypoperationen
export function getPaymentOptions(): Record<PaymentType, PaymentOption> {
	return {
		[PaymentType.MONTHLY]: {
			type: PaymentType.MONTHLY,
			discountPercentage: 0,
			extraDiscountPercentage: 0,
			labelKey: 'pricing.paymentOptions.monthly'
		},
		[PaymentType.ONE_TIME]: {
			type: PaymentType.ONE_TIME,
			discountPercentage: 8,
			extraDiscountPercentage: 13,
			labelKey: 'pricing.paymentOptions.oneTime'
		},
		[PaymentType.LONGTIME]: {
			type: PaymentType.LONGTIME,
			discountPercentage: 20,
			extraDiscountPercentage: 25,
			labelKey: 'pricing.paymentOptions.longTime'
		}
	};
}

// Erhalte den Rabatt für einen bestimmten Zahlungstyp und Extradiscount-Status
export function getDiscountPercentage(paymentType: PaymentType, showExtraDiscount = false): number {
	const discountInfo = DEFAULT_DISCOUNTS[paymentType];
	if (!discountInfo) return 0;

	return showExtraDiscount ? discountInfo.extra : discountInfo.standard;
}

// Berechne den displayName für einen Plan
export function getPlanDisplayName(planType: PlanType, paymentType: PaymentType): string {
	if (paymentType === PaymentType.LONGTIME) {
		switch (planType) {
			case PlanType.ONE_MONTH:
				return 'BASIS LONGTIME-ZUGANG';
			case PlanType.THREE_MONTH:
				return 'PREMIUM LONGTIME-ZUGANG';
			case PlanType.SIX_MONTH:
				return 'BUSINESS LONGTIME-ZUGANG';
			default:
				return 'LONGTIME-ZUGANG';
		}
	}
	return planType;
}

// Berechne den Monatsindex aus dem Plantyp
export function getMonthsFromPlanType(planType: PlanType): number {
	switch (planType) {
		case PlanType.ONE_MONTH:
			return 1;
		case PlanType.THREE_MONTH:
			return 3;
		case PlanType.SIX_MONTH:
			return 6;
		default:
			return 1;
	}
}
