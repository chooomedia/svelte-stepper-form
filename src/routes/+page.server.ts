import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { defaultValues, superFormSchema } from '$lib/schema';

import type { Actions, PageServerLoad } from './$types';

// Simulated Server Function
async function mockCreateEntity(data: any) {
	console.log('Mock creating:', data);
	return true;
}

export const load: PageServerLoad = async () => {
	// Initialize the form with default values - nur data-Objekt
	const form = await superValidate(zod(superFormSchema), {
		defaults: {
			data: {
				...defaultValues,
				company_url: 'https://digitalpusher.de'
			}
		}
	});

	console.log('🔍 Form loaded with data:', form.data);
	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, superFormSchema);

		console.log('🔍 Validation errors:', form.errors);

		if (!form.valid) return fail(400, { form });

		const created = await mockCreateEntity(form.data);

		if (!created) {
			return message(form, 'Sorry, we could not process your assessment.', { status: 500 });
		}

		return message(form, 'Your assessment was completed successfully.');
	}
};
