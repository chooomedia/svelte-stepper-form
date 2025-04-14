import { z } from 'zod';
import { get } from 'svelte/store';
import { i18n } from '$lib/i18n';
import type { ZodType, ZodTypeDef } from 'zod';
import { currentLocale } from '$lib/i18n';

/**
 * Erstellt ein dynamisches Zod-Schema, das beim Validieren aktuelle Übersetzungen verwendet
 *
 * @param schemaFn Eine Funktion, die ein Zod-Schema erstellt und eine Funktion zum Abrufen von Übersetzungen akzeptiert
 * @returns Ein Zod-Schema mit dynamischen Übersetzungen
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
		let current: any = translations?.schema?.validation || {};

		// Traverse the path to find the specific translation key
		for (const part of pathParts) {
			if (current[part] === undefined) {
				// If translation is missing for current language but available in German,
				// fall back to German for validation messages only
				if (locale !== 'de') {
					const deTranslations = translations.de?.schema?.validation || {};
					let deCurrent = deTranslations;
					let found = true;

					for (const dePart of pathParts) {
						if (deCurrent[dePart] === undefined) {
							found = false;
							break;
						}
						deCurrent = deCurrent[dePart];
					}

					if (found && typeof deCurrent === 'string') {
						return deCurrent;
					}
				}
				return defaultMessage;
			}
			current = current[part];
		}

		return typeof current === 'string' ? current : defaultMessage;
	};

	// Create schema with the translation function
	return schemaFn(getTranslation);
}

/**
 * Erstellt ein dynamisches Formular-Schema mit aktuellen Übersetzungen
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
			company_url: z.string().url(t('company_url.url')),
			salutation: z.enum(['Herr', 'Frau', 'Divers']).optional(),
			first_name: z.string().min(2, t('first_name.minLength')).optional(),
			last_name: z.string().min(2, t('last_name.minLength')),
			email: z.string().email(t('email.email')),
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
