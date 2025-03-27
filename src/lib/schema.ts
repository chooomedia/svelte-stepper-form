import { z } from 'zod';

const imageOptionSchema = z.object({
	value: z.string(),
	label: z.string(),
	imgSrc: z.string().url(),
	description: z.string().optional(),
	weight: z.number().int().min(0).max(10).default(1)
});

export type ImageOption = z.infer<typeof imageOptionSchema>;

export const baseFormSchema = z.object({
	// Required fields for image options
	visibility: z.string({ required_error: 'Bitte wähle aus, wo Dein Unternehmen zu finden ist' }),
	advertising_frequency: z
		.string({ required_error: 'Bitte wähle die Werbefrequenz aus' })
		.optional(),
	goals: z.string({ required_error: 'Bitte wähle Dein Hauptziel aus' }).optional(),
	campaign_management: z
		.string({ required_error: 'Bitte wähle aus, wer die Werbung betreuen soll' })
		.optional(),
	online_reviews: z
		.string({ required_error: 'Bitte angeben wie durchschnittlich Deine Online-Bewertungen sind' })
		.optional(),
	previous_campaigns: z
		.string({ required_error: 'Bitte angeben, ob bereits Onlinewerbung geschaltet wurde' })
		.optional(),
	business_phase: z
		.string({ required_error: 'Bitte wählen Deine Unternehmensphase aus' })
		.optional(),
	implementation_time: z
		.string({ required_error: 'Bitte wähle den gewünschten Implementierungszeitraum' })
		.optional(),

	// Company and contact details
	company_name: z
		.string({ required_error: 'Unternehmensname wird benötigt' })
		.min(2, 'Name muss mindestens 2 Zeichen lang sein'),
	company_url: z.string().url('Bitte gültige URL angeben'),
	salutation: z.enum(['Herr', 'Frau', 'Divers']).optional(),
	first_name: z.string().min(2, 'Vorname muss mindestens 2 Zeichen lang sein').optional(),
	last_name: z.string().min(2, 'Nachname muss mindestens 2 Zeichen lang sein'),
	email: z.string().email('Bitte eine gültige E-Mail-Adresse angeben'),
	phone: z
		.string()
		.regex(/^\+?[0-9\s\-()]{7,20}$/, 'Ungültiges Telefonformat')
		.optional(),
	privacy_agreement: z.boolean(),
	marketing_consent: z.boolean().optional(),
	visibility_score: z.number().optional()
});

export const step_1 = baseFormSchema.pick({ visibility: true });
export const step_2 = baseFormSchema.pick({ company_url: true });
export const step_3 = baseFormSchema.pick({
	visibility: true,
	company_url: true,
	advertising_frequency: true
});
export const step_4 = baseFormSchema.pick({
	visibility: true,
	company_url: true,
	advertising_frequency: true,
	goals: true
});
export const step_5 = baseFormSchema.pick({
	visibility: true,
	company_url: true,
	advertising_frequency: true,
	goals: true,
	campaign_management: true
});
export const step_6 = baseFormSchema.pick({
	visibility: true,
	company_url: true,
	advertising_frequency: true,
	goals: true,
	campaign_management: true,
	online_reviews: true
});
export const step_7 = baseFormSchema.pick({
	visibility: true,
	company_url: true,
	advertising_frequency: true,
	goals: true,
	campaign_management: true,
	online_reviews: true,
	previous_campaigns: true
});
export const step_8 = baseFormSchema.pick({
	visibility: true,
	company_url: true,
	advertising_frequency: true,
	goals: true,
	campaign_management: true,
	online_reviews: true,
	previous_campaigns: true,
	business_phase: true
});
export const step_9 = baseFormSchema.pick({
	visibility: true,
	company_url: true,
	advertising_frequency: true,
	goals: true,
	campaign_management: true,
	online_reviews: true,
	previous_campaigns: true,
	business_phase: true,
	implementation_time: true
});
export const step_10 = baseFormSchema.pick({
	visibility: true,
	company_url: true,
	advertising_frequency: true,
	goals: true,
	campaign_management: true,
	online_reviews: true,
	previous_campaigns: true,
	business_phase: true,
	implementation_time: true,
	company_name: true
});
export const last_step = baseFormSchema.pick({
	visibility: true,
	company_url: true,
	advertising_frequency: true,
	goals: true,
	campaign_management: true,
	online_reviews: true,
	previous_campaigns: true,
	business_phase: true,
	implementation_time: true,
	company_name: true,
	salutation: true,
	first_name: true,
	last_name: true,
	email: true,
	phone: true,
	privacy_agreement: true,
	marketing_consent: true
});

export const formOptions = {
	visibility: [
		{
			label: 'Suchmaschinen',
			value: 'search_engines',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-unternehmen-sichtbarkeit-online-suchmaschine-google-0.png',
			description: 'Präsenz in Google & Co.',
			weight: 5
		},
		{
			label: 'Social Media',
			value: 'social_media',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-unternehmen-sichtbarkeit-social-media-facebook-insta-linkedin-0.png',
			description: 'Präsenz in sozialen Medien',
			weight: 10
		},
		{
			label: 'Print',
			value: 'print',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-unternehmen-sichtbarkeit-flyer-zeitung-print-0.png',
			description: 'Klassische Printwerbung',
			weight: 3
		},
		{
			label: 'Ladengeschäft',
			value: 'store',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-unternehmen-sichtbarkeit-ladengeschaeft-0.png',
			description: 'Physische Präsenz',
			weight: 3
		}
	],
	advertising_frequency: [
		{
			label: 'Wöchentlich',
			value: 'weekly',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-lieferintervall-werbung-woechentlich-1.png',
			description: 'Regelmäßige wöchentliche Updates',
			weight: 7
		},
		{
			label: 'Monatlich',
			value: 'monthly',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-lieferintervall-werbung-monatlich-1.png',
			description: 'Monatliche Kampagnen',
			weight: 3
		},
		{
			label: 'Jährlich',
			value: 'yearly',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-lieferintervall-werbung-jaehrlich-1.png',
			description: 'Jährliche Großkampagnen',
			weight: 1
		}
	],
	goals: [
		{
			label: 'Neukundengewinnung',
			value: 'new_clients',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-neukundegewinnung-2.png',
			description: 'Neue Kunden gewinnen',
			weight: 5
		},
		{
			label: 'Mitarbeitergewinnung',
			value: 'new_employees',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-mitarbeitergewinnung-2.png',
			description: 'Neue Mitarbeiter finden',
			weight: 5
		},
		{
			label: 'Mehr Onlinepräsenz',
			value: 'more_online',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-mehr-onlinepraesenz-2.png',
			description: 'Online sichtbarer werden',
			weight: 10
		},
		{
			label: 'Alles zusammen',
			value: 'all',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-alle-zusammen-2.png',
			description: 'All-in-One Lösung',
			weight: 10
		}
	],
	campaign_management: [
		{
			label: 'Ich selber',
			value: 'self',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-werbeverantwortlicher-ich-selber-3.png',
			description: 'Eigenständige Verwaltung',
			weight: 3
		},
		{
			label: 'Digitalpusher',
			value: 'digitalpusher',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-werbeverantwortlicher-digitalpusher-3.png',
			description: 'Professionelle Betreuung',
			weight: 10
		},
		{
			label: 'Mitarbeiter',
			value: 'employee',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-werbeverantwortlicher-mitarbeiter-3.png',
			description: 'Interne Verwaltung',
			weight: 1
		}
	],
	online_reviews: [
		{
			label: 'Eher positiv',
			value: 'positive',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-positive-kundenbewertungen-4.png',
			description: 'Überwiegend gute Bewertungen',
			weight: 7
		},
		{
			label: 'Eher negativ',
			value: 'negative',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-negative-kundenbewertungen-4.png',
			description: 'Verbesserungspotential',
			weight: 2
		},
		{
			label: 'Gibt keine',
			value: 'none',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-hat-noch-keine-werbung-online-geschaltet-5.png',
			description: 'Keine Bewertungen vorhanden',
			weight: 1
		}
	],
	previous_campaigns: [
		{
			label: 'Ja',
			value: 'yes',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-hat-bereits-werbung-online-geschaltet-5.png',
			description: 'Erfahrung vorhanden',
			weight: 7
		},
		{
			label: 'Nein',
			value: 'no',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-hat-noch-keine-werbung-online-geschaltet-5.png',
			description: 'Keine Erfahrung',
			weight: 1
		},
		{
			label: 'Würde ich gerne',
			value: 'would_like',
			imgSrc:
				'https://digitalpusher.de//wp-content/uploads/2024/10/digitalpusher-positive-wuerde-gerne-4.png',
			description: 'Interesse vorhanden',
			weight: 3
		}
	],
	business_phase: [
		{
			label: 'Gründung ist geplant',
			value: 'planning',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-unternehmensphase-in-planung-6.png',
			description: 'In der Planungsphase',
			weight: 5
		},
		{
			label: 'Jünger als 6 Monate',
			value: 'less_than_6_months',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-unternehmensphase-juenger-als-6monate-6.png',
			description: 'Junges Unternehmen',
			weight: 3
		},
		{
			label: 'Älter als 6 Monate',
			value: 'more_than_6_months',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-unternehmensphase-aelter-als-6monate-6.png',
			description: 'Etabliertes Unternehmen',
			weight: 4
		},
		{
			label: 'Familienbetrieb',
			value: 'family_business',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-unternehmensphase-mehrgenerationen-familienbetrieb-6.png',
			description: 'Traditionelles Familienunternehmen',
			weight: 10
		}
	],
	implementation_time: [
		{
			label: 'In Rekordzeit',
			value: 'immediate',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-sehr-kurzfristige-umsetzungszeit-7.png',
			description: 'Schnellstmögliche Umsetzung',
			weight: 3
		},
		{
			label: 'In 2-6 Monaten',
			value: 'medium',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-schnelle-umsetzungszeit-7.png',
			description: 'Mittelfristige Planung',
			weight: 10
		},
		{
			label: 'Mehr als 6 Monate',
			value: 'long_term',
			imgSrc:
				'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-moderate-umsetzungszeit-7-1.png',
			description: 'Langfristige Strategie',
			weight: 5
		}
	]
} as const;

export function getFormOptionWeight(category: keyof typeof formOptions, value: string): number {
	const options = formOptions[category];
	const option = options.find((opt) => opt.value === value);
	return option ? option.weight : 0;
}

export function getFormOptionByValue<K extends keyof typeof formOptions>(
	category: K,
	value: string
): (typeof formOptions)[K][number] | undefined {
	return formOptions[category].find((option) => option.value === value);
}

export const defaultValues: FormData = {
	visibility: '',
	advertising_frequency: '',
	goals: '',
	campaign_management: '',
	online_reviews: '',
	previous_campaigns: '',
	business_phase: '',
	implementation_time: '',
	company_name: '',
	company_url: '',
	salutation: 'Herr',
	first_name: '',
	last_name: '',
	email: '',
	phone: '',
	privacy_agreement: false,
	marketing_consent: false,
	visibility_score: 0
};

export const FORM_STEPS = [
	{
		title: 'visibility',
		description: 'Wo ist Dein Unternehmen zu finden?',
		schema: step_1
	},
	{
		title: 'company_url',
		description: 'Deine Website URL für die Analyse',
		schema: step_2
	},
	{
		title: 'advertising_frequency',
		description: 'Wie oft schaltest Du Werbung?',
		schema: step_3
	},
	{
		title: 'goals',
		description: 'Was möchtest Du unternehmerisch erreichen?',
		schema: step_4
	},
	{
		title: 'campaign_management',
		description: 'Wer soll Deine Werbung betreuen?',
		schema: step_5
	},
	{
		title: 'online_reviews',
		description: 'Wie bewerten Deine Kunden Dich?',
		schema: step_6
	},
	{
		title: 'previous_campaigns',
		description: 'Deine Erfahrung mit Online-Werbung',
		schema: step_7
	},
	{
		title: 'business_phase',
		description: 'In welcher Phase befindet sich Dein Unternehmen?',
		schema: step_8
	},
	{
		title: 'implementation_time',
		description: 'Dein gewünschter Implementierungszeitraum',
		schema: step_9
	},
	{
		title: 'company_info',
		description: 'Informationen zu Deinem Unternehmen',
		schema: step_10
	},
	{
		title: 'result',
		description: 'Deine persönlichen Informationen',
		schema: last_step
	}
] as const;

export type StepSchema = (typeof FORM_STEPS)[number];
export type StepName = keyof FormData;
export type FormData = z.infer<typeof baseFormSchema>;

export const TOTAL_STEPS = 12;
export const LAST_STEP_INDEX = TOTAL_STEPS - 1;

export interface FormStep {
	title: string;
	description: string;
	required?: boolean;
}

export interface FormOptions {
	[key: string]: {
		[key: string]: {
			label: string;
			weight: number;
			image?: string;
		};
	};
}

export interface AuditData {
	lighthouse_report?: {
		categories?: Record<string, { score?: number }>;
	};
	security_headers?: {
		grade?: string;
	};
	// Weitere Felder...
}

export interface Metric {
	label: string;
	value: number;
	color: string;
	category: string;
}
