// src/lib/utils/dynamicValidation.ts
import { z } from 'zod';
import { get } from 'svelte/store';
import { i18n } from '$lib/i18n';
import type { ZodType, ZodTypeDef } from 'zod';
import { currentLocale } from '$lib/i18n';

/**
 * Creates a dynamic Zod schema that uses current translations during validation
 *
 * @param schemaFn A function that creates a Zod schema and accepts a function to fetch translations
 * @returns A Zod schema with dynamic translations
 */
export function createDynamicSchema<Output, Def extends ZodTypeDef, Input>(
	schemaFn: (t: (key: string, defaultMessage?: string) => string) => ZodType<Output, Def, Input>
): ZodType<Output, Def, Input> {
	// Function to retrieve translations
	const getTranslation = (key: string, defaultMessage: string = ''): string => {
		// Get translations via the store
		const translations = get(i18n);
		const locale = get(currentLocale);

		// Split path to the translation key
		const pathParts = key.split('.');

		// Traverse validation paths in the translations
		const tryGetTranslation = (translationsObj: any): string | null => {
			if (!translationsObj?.schema?.validation) return null;

			let current = translationsObj.schema.validation;

			// Navigate through the path parts
			for (const part of pathParts) {
				if (current[part] === undefined) {
					return null;
				}
				current = current[part];
			}

			return typeof current === 'string' ? current : null;
		};

		// Try current locale first
		const currentLocaleTranslation = tryGetTranslation(translations);
		if (currentLocaleTranslation) return currentLocaleTranslation;

		// If not found and current locale isn't German, try German as fallback
		if (locale !== 'de' && translations.de) {
			const germanTranslation = tryGetTranslation({ de: translations.de });
			if (germanTranslation) return germanTranslation;
		}

		// Try English as a second fallback if available
		if (locale !== 'en' && translations.en) {
			const englishTranslation = tryGetTranslation({ en: translations.en });
			if (englishTranslation) return englishTranslation;
		}

		// Return default message if all else fails
		return defaultMessage;
	};

	// Create schema with the translation function
	return schemaFn(getTranslation);
}

/**
 * Creates a dynamic form schema with current translations
 */
export function createDynamicFormSchema() {
	return createDynamicSchema((t) =>
		z.object({
			// Fields with multiple selection support
			visibility: z
				.union([
					z.string({ required_error: t('visibility.required') }),
					z.array(z.string()).min(1, t('visibility.minSelection'))
				])
				.default(''),
			advertising_frequency: z
				.union([
					z.string({ required_error: t('advertising_frequency.required') }),
					z.array(z.string()).min(1, t('advertising_frequency.minSelection'))
				])
				.optional(),
			goals: z
				.union([
					z.string({ required_error: t('goals.required') }),
					z.array(z.string()).min(1, t('goals.minSelection'))
				])
				.optional(),
			campaign_management: z
				.union([
					z.string({ required_error: t('campaign_management.required') }),
					z.array(z.string()).min(1, t('campaign_management.minSelection'))
				])
				.optional(),
			online_reviews: z
				.union([
					z.string({ required_error: t('online_reviews.required') }),
					z.array(z.string()).min(1, t('online_reviews.minSelection'))
				])
				.optional(),
			previous_campaigns: z
				.union([
					z.string({ required_error: t('previous_campaigns.required') }),
					z.array(z.string()).min(1, t('previous_campaigns.minSelection'))
				])
				.optional(),
			business_phase: z
				.union([
					z.string({ required_error: t('business_phase.required') }),
					z.array(z.string()).min(1, t('business_phase.minSelection'))
				])
				.optional(),
			implementation_time: z
				.union([
					z.string({ required_error: t('implementation_time.required') }),
					z.array(z.string()).min(1, t('implementation_time.minSelection'))
				])
				.optional(),

			// Company and contact details
			company_name: z
				.string({ required_error: t('company_name.required') })
				.min(2, t('company_name.minLength')),
			company_url: z
				.string({ required_error: t('company_url.required') })
				.url(t('company_url.url')),
			salutation: z
				.enum(['Herr', 'Frau', 'Divers'], {
					required_error: t('salutation.required', 'Bitte wähle eine Anrede')
				})
				.optional(),
			first_name: z
				.string({ required_error: t('first_name.required') })
				.min(2, t('first_name.minLength'))
				.optional(),
			last_name: z
				.string({ required_error: t('last_name.required') })
				.min(2, t('last_name.minLength')),
			email: z.string({ required_error: t('email.required') }).email(t('email.email')),
			phone: z
				.string()
				.regex(/^\+?[0-9\s\-()]{7,20}$/, t('phone.pattern'))
				.optional(),
			privacy_agreement: z.boolean().refine((val) => val === true, {
				message: t('privacy_agreement.required')
			}),
			marketing_consent: z.boolean().optional(),
			visibility_score: z.number().optional()
		})
	);
}
