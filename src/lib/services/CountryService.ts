// src/lib/services/CountryService.ts
export type SupportedLocale = 'ar' | 'de' | 'en' | 'hu' | 'ro' | 'ru' | 'tr';
export type SupportedCurrency = 'EUR' | 'CHF';

export interface CountryConfig {
	locale: SupportedLocale;
	currency: SupportedCurrency;
	vatRate: number;
	vatLabel: string;
	rtl: boolean;
}

export class CountryService {
	// Comprehensive country mappings
	private static readonly COUNTRY_MAP: Record<string, CountryConfig> = {
		// Europe
		de: { locale: 'de', currency: 'EUR', vatRate: 19, vatLabel: 'MwSt.', rtl: false },
		at: { locale: 'de', currency: 'EUR', vatRate: 20, vatLabel: 'USt.', rtl: false },
		ch: { locale: 'de', currency: 'CHF', vatRate: 7.7, vatLabel: 'MwSt.', rtl: false },
		gb: { locale: 'en', currency: 'EUR', vatRate: 20, vatLabel: 'VAT', rtl: false },
		uk: { locale: 'en', currency: 'EUR', vatRate: 20, vatLabel: 'VAT', rtl: false },
		fr: { locale: 'en', currency: 'EUR', vatRate: 20, vatLabel: 'TVA', rtl: false },
		es: { locale: 'en', currency: 'EUR', vatRate: 21, vatLabel: 'IVA', rtl: false },
		it: { locale: 'en', currency: 'EUR', vatRate: 22, vatLabel: 'IVA', rtl: false },
		nl: { locale: 'en', currency: 'EUR', vatRate: 21, vatLabel: 'BTW', rtl: false },
		be: { locale: 'en', currency: 'EUR', vatRate: 21, vatLabel: 'TVA/BTW', rtl: false },

		// North America
		us: { locale: 'en', currency: 'EUR', vatRate: 0, vatLabel: 'Sales Tax', rtl: false },
		ca: { locale: 'en', currency: 'EUR', vatRate: 5, vatLabel: 'GST', rtl: false },

		// Oceania
		au: { locale: 'en', currency: 'EUR', vatRate: 10, vatLabel: 'GST', rtl: false },
		nz: { locale: 'en', currency: 'EUR', vatRate: 15, vatLabel: 'GST', rtl: false },

		// Middle East (Arabic-speaking)
		sa: { locale: 'ar', currency: 'EUR', vatRate: 15, vatLabel: 'VAT', rtl: true },
		ae: { locale: 'ar', currency: 'EUR', vatRate: 5, vatLabel: 'VAT', rtl: true },
		qa: { locale: 'ar', currency: 'EUR', vatRate: 0, vatLabel: 'VAT', rtl: true },
		eg: { locale: 'ar', currency: 'EUR', vatRate: 14, vatLabel: 'VAT', rtl: true },

		// Default (fallback)
		default: { locale: 'de', currency: 'EUR', vatRate: 19, vatLabel: 'MwSt.', rtl: false }
	};

	/**
	 * Get country configuration by country code
	 */
	static getCountryConfig(countryCode: string): CountryConfig {
		const code = countryCode?.toLowerCase();
		return this.COUNTRY_MAP[code] || this.COUNTRY_MAP['default'];
	}

	/**
	 * Get locales by currency
	 */
	static getLocalesByCurrency(currency: SupportedCurrency): string[] {
		const locales = [];

		switch (currency) {
			case 'EUR':
				locales.push(
					'de-DE',
					'fr-FR',
					'es-ES',
					'it-IT',
					'nl-NL',
					'en-US',
					'en-GB',
					'ar-SA',
					'ar-AE',
					'en-CA',
					'fr-CA',
					'en-AU',
					'en-US'
				);
				break;
			case 'CHF':
				locales.push('de-CH', 'fr-CH', 'it-CH');
				break;
			default:
				locales.push('de-CH');
		}

		return locales;
	}

	/**
	 * Format currency amount according to country/locale
	 */
	static formatCurrency(amount: number, currency: SupportedCurrency): string {
		const locales = this.getLocalesByCurrency(currency);
		return new Intl.NumberFormat(locales[0], {
			style: 'currency',
			currency: currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(amount);
	}

	/**
	 * Format number according to locale
	 */
	static formatNumber(num: number, locale: SupportedLocale): string {
		const localeString = locale === 'de' ? 'de-DE' : locale === 'ar' ? 'ar-SA' : 'en-US';
		return new Intl.NumberFormat(localeString).format(num);
	}

	/**
	 * Get VAT information for a country
	 */
	static getVatInfo(countryCode: string) {
		const config = this.getCountryConfig(countryCode);
		return {
			rate: config.vatRate,
			label: config.vatLabel
		};
	}
}
