import { z } from 'zod';
import { createDynamicFormSchema } from '$lib/utils/dynamicValidation';

const imageOptionSchema = z.object({
	value: z.string(),
	label: z.string(),
	imgSrc: z.string().url(),
	description: z.string().optional(),
	weight: z.number().int().min(0).max(10).default(1)
});

export type ImageOption = z.infer<typeof imageOptionSchema>;

export const baseFormSchema = createDynamicFormSchema();

// Neues Schema für SuperForms mit data-Objekt
export const superFormSchema = z.object({
	data: baseFormSchema
});

// ============================================================================
// SCHEMA GENERATOR FUNCTIONS
// ============================================================================

/**
 * Generates step schemas dynamically based on field progression
 * This eliminates the need for repetitive .pick() calls
 */
function createStepSchema(fields: (keyof z.infer<typeof baseFormSchema>)[]): z.ZodSchema {
	const pickObject = fields.reduce(
		(acc, field) => {
			acc[field] = true;
			return acc;
		},
		{} as Record<string, true>
	);

	return baseFormSchema.pick(pickObject);
}

// Define the field progression for each step
const STEP_FIELD_PROGRESSION: (keyof z.infer<typeof baseFormSchema>)[][] = [
	['visibility'], // step_1
	['company_url'], // step_2
	['visibility', 'company_url', 'advertising_frequency'], // step_3
	['visibility', 'company_url', 'advertising_frequency', 'goals'], // step_4
	['visibility', 'company_url', 'advertising_frequency', 'goals', 'campaign_management'], // step_5
	[
		'visibility',
		'company_url',
		'advertising_frequency',
		'goals',
		'campaign_management',
		'online_reviews'
	], // step_6
	[
		'visibility',
		'company_url',
		'advertising_frequency',
		'goals',
		'campaign_management',
		'online_reviews',
		'previous_campaigns'
	], // step_7
	[
		'visibility',
		'company_url',
		'advertising_frequency',
		'goals',
		'campaign_management',
		'online_reviews',
		'previous_campaigns',
		'business_phase'
	], // step_8
	[
		'visibility',
		'company_url',
		'advertising_frequency',
		'goals',
		'campaign_management',
		'online_reviews',
		'previous_campaigns',
		'business_phase',
		'implementation_time'
	], // step_9
	[
		'visibility',
		'company_url',
		'advertising_frequency',
		'goals',
		'campaign_management',
		'online_reviews',
		'previous_campaigns',
		'business_phase',
		'implementation_time',
		'company_name'
	] // step_10
];

// Generate step schemas dynamically using the generator function
export const step_1 = createStepSchema(STEP_FIELD_PROGRESSION[0]);
export const step_2 = createStepSchema(STEP_FIELD_PROGRESSION[1]);
export const step_3 = createStepSchema(STEP_FIELD_PROGRESSION[2]);
export const step_4 = createStepSchema(STEP_FIELD_PROGRESSION[3]);
export const step_5 = createStepSchema(STEP_FIELD_PROGRESSION[4]);
export const step_6 = createStepSchema(STEP_FIELD_PROGRESSION[5]);
export const step_7 = createStepSchema(STEP_FIELD_PROGRESSION[6]);
export const step_8 = createStepSchema(STEP_FIELD_PROGRESSION[7]);
export const step_9 = createStepSchema(STEP_FIELD_PROGRESSION[8]);
export const step_10 = createStepSchema(STEP_FIELD_PROGRESSION[9]);
// Last step includes all previous fields plus contact information
export const last_step = createStepSchema([
	...STEP_FIELD_PROGRESSION[9], // All fields from step_10
	'salutation',
	'first_name',
	'last_name',
	'email',
	'phone',
	'privacy_agreement',
	'marketing_consent',
	'visibility_score'
]);

export let formOptions = {
	visibility: [
		{
			value: 'search_engines',
			imgSrc: '/images/visibility/search-engines.png',
			weight: 3
		},
		{
			value: 'social_media',
			imgSrc: '/images/visibility/social-media.png',
			weight: 5
		},
		{
			value: 'print',
			imgSrc: '/images/visibility/print.png',
			weight: 2
		},
		{
			value: 'store',
			imgSrc: '/images/visibility/store.png',
			weight: 2
		}
	],
	advertising_frequency: [
		{
			value: 'weekly',
			imgSrc: '/images/frequency/weekly.png',
			weight: 7
		},
		{
			value: 'monthly',
			imgSrc: '/images/frequency/monthly.png',
			weight: 3
		},
		{
			value: 'yearly',
			imgSrc: '/images/frequency/yearly.png',
			weight: 1
		}
	],
	goals: [
		{
			value: 'new_clients',
			imgSrc: '/images/goals/new-clients.png',
			weight: 5
		},
		{
			value: 'new_employees',
			imgSrc: '/images/goals/new-employees.png',
			weight: 5
		},
		{
			value: 'more_online',
			imgSrc: '/images/goals/more-online.png',
			weight: 10
		},
		{
			value: 'all',
			imgSrc: '/images/goals/all.png',
			weight: 10
		}
	],
	campaign_management: [
		{
			value: 'self',
			imgSrc: '/images/management/self.png',
			weight: 3
		},
		{
			value: 'digitalpusher',
			imgSrc: '/images/management/digitalpusher.png',
			weight: 10
		},
		{
			value: 'employee',
			imgSrc: '/images/management/employee.png',
			weight: 1
		}
	],
	online_reviews: [
		{
			value: 'positive',
			imgSrc: '/images/reviews/positive.png',
			weight: 7
		},
		{
			value: 'negative',
			imgSrc: '/images/reviews/negative.png',
			weight: 2
		},
		{
			value: 'none',
			imgSrc: '/images/reviews/none.png',
			weight: 1
		}
	],
	previous_campaigns: [
		{
			value: 'yes',
			imgSrc: '/images/campaigns/yes.png',
			weight: 7
		},
		{
			value: 'no',
			imgSrc: '/images/campaigns/no.png',
			weight: 1
		},
		{
			value: 'would_like',
			imgSrc: '/images/campaigns/would-like.png',
			weight: 3
		}
	],
	business_phase: [
		{
			value: 'planning',
			imgSrc: '/images/phase/planning.png',
			weight: 5
		},
		{
			value: 'less_than_6_months',
			imgSrc: '/images/phase/less-than-6-months.png',
			weight: 3
		},
		{
			value: 'more_than_6_months',
			imgSrc: '/images/phase/more-than-6-months.png',
			weight: 4
		},
		{
			value: 'family_business',
			imgSrc: '/images/phase/family-business.png',
			weight: 8
		}
	],
	implementation_time: [
		{
			value: 'immediate',
			imgSrc: '/images/time/immediate.png',
			weight: 3
		},
		{
			value: 'medium',
			imgSrc: '/images/time/medium.png',
			weight: 10
		},
		{
			value: 'long_term',
			imgSrc: '/images/time/long-term.png',
			weight: 5
		}
	]
} as const;

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
export type SuperFormData = z.infer<typeof superFormSchema>;

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
