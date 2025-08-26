// src/lib/services/formatting.ts

/**
 * Formatiert deutsche Werte
 */
export function formatGermanValue(field: string, value: unknown): string {
	const germanFormats: Record<string, Record<string, string>> = {
		visibility: {
			search_engines: 'Suchmaschinen',
			social_media: 'Social Media',
			print: 'Print',
			store: 'Ladengeschäft'
		},
		advertising_frequency: {
			weekly: 'Wöchentlich',
			monthly: 'Monatlich',
			yearly: 'Jährlich'
		},
		goals: {
			new_clients: 'Neukundengewinnung',
			new_employees: 'Mitarbeitergewinnung',
			more_online: 'Mehr Onlinepräsenz',
			all: 'Alle Bereiche'
		},
		campaign_management: {
			self: 'Ich selber',
			digitalpusher: 'Digital Pusher',
			employee: 'Mitarbeiter'
		},
		business_phase: {
			planning: 'Gründung ist geplant',
			less_than_6_months: 'Jünger als 6 Monate',
			more_than_6_months: 'Älter als 6 Monate',
			family_business: 'Familienbetrieb'
		},
		implementation_time: {
			immediate: 'In Rekordzeit',
			medium: 'In 2-6 Monaten',
			long_term: 'Mehr als 6 Monate'
		}
	};

	const fieldFormats = germanFormats[field];
	if (!fieldFormats) return String(value || '');

	if (Array.isArray(value)) {
		return value
			.filter((v) => v && v !== '')
			.map((v) => fieldFormats[v as string] || v)
			.join(', ');
	}

	return fieldFormats[value as string] || String(value || '');
}

/**
 * Formatiert ungarische Werte
 */
export function formatHungarianValue(field: string, value: unknown): string {
	const hungarianFormats: Record<string, Record<string, string>> = {
		visibility: {
			search_engines: 'Keresőmotorok',
			social_media: 'Közösségi média',
			print: 'Nyomtatott média',
			store: 'Üzlet'
		},
		advertising_frequency: {
			weekly: 'Hetente',
			monthly: 'Havonta',
			yearly: 'Évente'
		},
		goals: {
			new_clients: 'Új ügyfelek',
			new_employees: 'Új alkalmazottak',
			more_online: 'Több online jelenlét',
			all: 'Minden terület'
		},
		campaign_management: {
			self: 'Én magam',
			digitalpusher: 'Digital Pusher',
			employee: 'Alkalmazott'
		},
		business_phase: {
			planning: 'Alapítás tervezés alatt',
			less_than_6_months: '6 hónapnál fiatalabb',
			more_than_6_months: '6 hónapnál idősebb',
			family_business: 'Családi vállalkozás'
		},
		implementation_time: {
			immediate: 'Rekordidőben',
			medium: '2-6 hónapon belül',
			long_term: '6 hónapnál hosszabb'
		}
	};

	const fieldFormats = hungarianFormats[field];
	if (!fieldFormats) return String(value || '');

	if (Array.isArray(value)) {
		return value
			.filter((v) => v && v !== '')
			.map((v) => fieldFormats[v as string] || v)
			.join(', ');
	}

	return fieldFormats[value as string] || String(value || '');
}

/**
 * Formatiert englische Werte
 */
export function formatEnglishValue(field: string, value: unknown): string {
	const englishFormats: Record<string, Record<string, string>> = {
		visibility: {
			search_engines: 'Search Engines',
			social_media: 'Social Media',
			print: 'Print Media',
			store: 'Physical Store'
		},
		advertising_frequency: {
			weekly: 'Weekly',
			monthly: 'Monthly',
			yearly: 'Yearly'
		},
		goals: {
			new_clients: 'New Clients',
			new_employees: 'New Employees',
			more_online: 'More Online Presence',
			all: 'All Areas'
		},
		campaign_management: {
			self: 'Myself',
			digitalpusher: 'Digital Pusher',
			employee: 'Employee'
		},
		business_phase: {
			planning: 'Planning to Start',
			less_than_6_months: 'Less than 6 months',
			more_than_6_months: 'More than 6 months',
			family_business: 'Family Business'
		},
		implementation_time: {
			immediate: 'Immediately',
			medium: 'In 2-6 months',
			long_term: 'More than 6 months'
		}
	};

	const fieldFormats = englishFormats[field];
	if (!fieldFormats) return String(value || '');

	if (Array.isArray(value)) {
		return value
			.filter((v) => v && v !== '')
			.map((v) => fieldFormats[v as string] || v)
			.join(', ');
	}

	return fieldFormats[value as string] || String(value || '');
}
