// src/lib/schema.ts
import { z } from 'zod';

// Basis-Schema für Image-Optionen
const imageOptionSchema = z.object({
	value: z.string(),
	label: z.string(),
	imgSrc: z.string().url(),
	description: z.string().optional(),
	weight: z.number().int().min(0).max(10).default(1)
});

// Schema für den ersten Schritt (Unternehmenssichtbarkeit)
export const step_1 = z.object({
	visibility: z.string({
		required_error: 'Bitte wählen Sie aus, wo Ihr Unternehmen zu finden ist'
	})
});

// Schema für den zweiten Schritt (Werbefrequenz)
export const step_2 = step_1.extend({
	advertising_frequency: z.string({
		required_error: 'Bitte wählen Sie Ihre Werbefrequenz aus'
	})
});

// Schema für den dritten Schritt (Ziele)
export const step_3 = step_2.extend({
	goals: z.string({
		required_error: 'Bitte wählen Sie Ihr Hauptziel aus'
	})
});

// Schema für den vierten Schritt (Werbeverantwortlicher)
export const step_4 = step_3.extend({
	campaign_management: z.string({
		required_error: 'Bitte wählen Sie aus, wer die Werbung betreuen soll'
	})
});

// Schema für den fünften Schritt (Online Bewertungen)
export const step_5 = step_4.extend({
	online_reviews: z.string({
		required_error: 'Bitte wählen Sie aus, wie Ihre Online-Bewertungen sind'
	})
});

// Schema für den sechsten Schritt (Bisherige Kampagnen)
export const step_6 = step_5.extend({
	previous_campaigns: z.string({
		required_error: 'Bitte geben Sie an, ob Sie bereits Onlinewerbung geschaltet haben'
	})
});

// Schema für den siebten Schritt (Unternehmensphase)
export const step_7 = step_6.extend({
	business_phase: z.string({
		required_error: 'Bitte wählen Sie Ihre Unternehmensphase aus'
	})
});

// Schema für den achten Schritt (Implementierungszeit)
export const step_8 = step_7.extend({
	implementation_time: z.string({
		required_error: 'Bitte wählen Sie den gewünschten Implementierungszeitraum'
	})
});

// Schema für den neunten Schritt (Unternehmensdaten)
export const step_9 = step_8.extend({
	company_name: z
		.string({
			required_error: 'Unternehmensname wird benötigt'
		})
		.min(2, 'Name muss mindestens 2 Zeichen lang sein'),
	company_url: z.string().url('Bitte geben Sie eine gültige URL ein').optional()
});

// Schema für den letzten Schritt (Kontaktdaten)
export const last_step = step_9.extend({
	salutation: z.enum(['Herr', 'Frau', 'Divers'], {
		required_error: 'Bitte wählen Sie eine Anrede'
	}),
	first_name: z.string().min(2, 'Vorname muss mindestens 2 Zeichen lang sein'),
	last_name: z.string().min(2, 'Nachname muss mindestens 2 Zeichen lang sein'),
	email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
	phone: z
		.string()
		.regex(/^\+?[0-9\s\-()]{7,20}$/, 'Ungültiges Telefonformat')
		.optional(),
	privacy_agreement: z.boolean().refine((val) => val === true, {
		message: 'Sie müssen den Datenschutzbestimmungen zustimmen'
	})
});

// Vordefinierte Optionen für die verschiedenen Schritte
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
			description: 'Ganzheitliche Verbesserung',
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
};

// Export der Typen für TypeScript
export type ImageOption = z.infer<typeof imageOptionSchema>;
export type FormData = z.infer<typeof last_step>;

// Default-Werte für das Formular
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
	privacy_agreement: false
};

// Schrittdefinitionen für den Stepper
export const FORM_STEPS = [
	{
		title: 'Unternehmenssichtbarkeit',
		description: 'Wo ist Ihr Unternehmen zu finden?',
		schema: step_1,
		showInIndicator: true
	},
	{
		title: 'Werbefrequenz',
		description: 'Wie oft schalten Sie Werbung?',
		schema: step_2,
		showInIndicator: true
	},
	{
		title: 'Unternehmensziele',
		description: 'Was möchten Sie erreichen?',
		schema: step_3,
		showInIndicator: true
	},
	{
		title: 'Werbemaßnahmen',
		description: 'Wer soll Ihre Werbung betreuen?',
		schema: step_4,
		showInIndicator: true
	},
	{
		title: 'Online-Bewertungen',
		description: 'Wie bewerten Ihre Kunden Sie?',
		schema: step_5,
		showInIndicator: true
	},
	{
		title: 'Bisherige Werbung',
		description: 'Ihre Erfahrung mit Online-Werbung',
		schema: step_6,
		showInIndicator: true
	},
	{
		title: 'Unternehmensphase',
		description: 'In welcher Phase befindet sich Ihr Unternehmen?',
		schema: step_7,
		showInIndicator: true
	},
	{
		title: 'Zeitplan',
		description: 'Ihr gewünschter Implementierungszeitraum',
		schema: step_8,
		showInIndicator: true
	},
	{
		title: 'Unternehmensdaten',
		description: 'Informationen zu Ihrem Unternehmen',
		schema: step_9,
		showInIndicator: true
	},
	{
		title: 'Kontaktdaten',
		description: 'Ihre persönlichen Informationen',
		schema: last_step,
		showInIndicator: true
	}
] as const;

export type StepSchema = (typeof FORM_STEPS)[number];
export type StepName = keyof FormData;
export type FormStep = {
	title: string;
	description: string;
	schema: z.ZodType<any>;
	showInIndicator?: boolean;
};

// Hilfs-Konstanten
export const TOTAL_STEPS = FORM_STEPS.length;
export const LAST_STEP_INDEX = TOTAL_STEPS - 1;
