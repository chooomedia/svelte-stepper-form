import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters'; // ✅ Richtig importiert
import { last_step, defaultValues } from '$lib/schema';

import type { Actions, PageServerLoad } from './$types';

// Simulierte Server-Funktion
async function mockCreateEntity(data: any) {
	console.log('Mock creating:', data);
	return true;
}

export const load: PageServerLoad = async () => {
	// ✅ Korrekte Verwendung von `superValidate`
	const form = await superValidate(zod(last_step), { defaults: defaultValues });

	console.log('Default Values:', defaultValues);

	return { form };
};

export const actions: Actions = {
	new: async ({ request }) => {
		const form = await superValidate(request, last_step);

		console.log('🔍 Validierungsfehler:', form.errors); // ✅ Fehler in der Konsole anzeigen

		if (!form.valid) return fail(400, { form });

		const created = await mockCreateEntity(form.data);

		if (!created) {
			return message(form, 'Sorry, we could not create the item.', { status: 500 });
		}

		return message(form, 'Item created successfully.');
	}
};
