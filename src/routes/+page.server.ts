import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { last_step, defaultValues } from '$lib/schema';

import type { Actions, PageServerLoad } from './$types';

// Simulated Server Function
async function mockCreateEntity(data: any) {
	console.log('Mock creating:', data);
	return true;
}

export const load: PageServerLoad = async () => {
	// Initialize the form with default values
	const form = await superValidate(zod(last_step), { defaults: defaultValues });

	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, last_step);

		if (!form.valid) return fail(400, { form });

		// Mock-Implementierung
		return message(form, 'Formular erfolgreich übermittelt');
	}
};
