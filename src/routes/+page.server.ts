import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { last_step } from '$lib/schema';

import type { Actions, PageServerLoad } from './$types';

// This function can live in $lib/server/[some-entity].ts
async function mockCreateEntity(data: any) {
	console.log('Mock creating:', data);
	return true;
}

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(last_step));
	return { form };
};

export const actions: Actions = {
	new: async ({ request }) => {
		const form = await superValidate(request, zod(last_step));

		if (!form.valid) return fail(400, { form });

		const created = await mockCreateEntity(form.data);

		if (!created) {
			return message(form, 'Sorry, we could not create the item.', { status: 500 });
		}

		return message(form, 'Item created successfully.');
	}
};
