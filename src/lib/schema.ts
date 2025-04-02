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
	// Fields with multiple selection support
	visibility: z
		.union([
			z.string({ required_error: 'Bitte wähle aus, wo Dein Unternehmen zu finden ist' }),
			z.array(z.string()).min(1, 'Bitte wähle mindestens eine Option aus')
		])
		.default(''),
	advertising_frequency: z
		.union([
			z.string({ required_error: 'Bitte wähle die Werbefrequenz aus' }),
			z.array(z.string()).min(1, 'Bitte wähle mindestens eine Werbefrequenz aus')
		])
		.optional(),
	goals: z
		.union([
			z.string({ required_error: 'Bitte wähle Dein Hauptziel aus' }),
			z.array(z.string()).min(1, 'Bitte wähle mindestens ein Ziel aus')
		])
		.optional(),
	campaign_management: z
		.union([
			z.string({ required_error: 'Bitte wähle aus, wer die Werbung betreuen soll' }),
			z.array(z.string()).min(1, 'Bitte wähle mindestens eine Option aus')
		])
		.optional(),
	online_reviews: z
		.union([
			z.string({
				required_error: 'Bitte angeben wie durchschnittlich Deine Online-Bewertungen sind'
			}),
			z.array(z.string()).min(1, 'Bitte wähle mindestens eine Option aus')
		])
		.optional(),
	previous_campaigns: z
		.union([
			z.string({ required_error: 'Bitte angeben, ob bereits Onlinewerbung geschaltet wurde' }),
			z.array(z.string()).min(1, 'Bitte wähle mindestens eine Option aus')
		])
		.optional(),
	business_phase: z
		.union([
			z.string({ required_error: 'Bitte wählen Deine Unternehmensphase aus' }),
			z.array(z.string()).min(1, 'Bitte wähle mindestens eine Phase aus')
		])
		.optional(),
	implementation_time: z
		.union([
			z.string({ required_error: 'Bitte wähle den gewünschten Implementierungszeitraum' }),
			z.array(z.string()).min(1, 'Bitte wähle mindestens einen Zeitraum aus')
		])
		.optional(),

	// Company and contact details (unchanged)
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
	privacy_agreement: z.boolean().refine((val) => val === true, {
		message: 'Bitte akzeptiere die Datenschutzerklärung'
	}),
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
			value: 'search_engines',
			weight: 3
		},
		{
			value: 'social_media',
			weight: 5
		},
		{
			value: 'print',
			weight: 2
		},
		{
			value: 'store',
			weight: 2
		}
	],
	advertising_frequency: [
		{
			value: 'weekly',
			weight: 7
		},
		{
			value: 'monthly',
			weight: 3
		},
		{
			value: 'yearly',
			weight: 1
		}
	],
	goals: [
		{
			value: 'new_clients',
			weight: 5
		},
		{
			value: 'new_employees',
			weight: 5
		},
		{
			value: 'more_online',
			weight: 10
		},
		{
			value: 'all',
			weight: 10
		}
	],
	campaign_management: [
		{
			value: 'self',
			weight: 3
		},
		{
			value: 'digitalpusher',
			weight: 10
		},
		{
			value: 'employee',
			weight: 1
		}
	],
	online_reviews: [
		{
			value: 'positive',
			weight: 7
		},
		{
			value: 'negative',
			weight: 2
		},
		{
			value: 'none',
			weight: 1
		}
	],
	previous_campaigns: [
		{
			value: 'yes',
			weight: 7
		},
		{
			value: 'no',
			weight: 1
		},
		{
			value: 'would_like',
			weight: 3
		}
	],
	business_phase: [
		{
			value: 'planning',
			weight: 6
		},
		{
			value: 'startup',
			weight: 7
		},
		{
			value: 'growth',
			weight: 8
		},
		{
			value: 'maturity',
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
		description: 'Bereit für Deine Website-Analyse?',
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
		title: 'waitingscreen',
		description: 'Deine Anfrage wird bearbeitet'
	},
	{
		title: 'result',
		description: 'Handlungsbedarf: Deine Website-Analyse',
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
