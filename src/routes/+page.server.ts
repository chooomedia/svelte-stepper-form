import { superValidate } from 'sveltekit-superforms/server';
import { zod } from "sveltekit-superforms/adapters";

import { formSchema } from '../lib/schema';
import type { Actions } from '@sveltejs/kit';


export const load = async () => {
    const form = await superValidate(zod(formSchema));

    return {
        form
    };
};


export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(formSchema));

        console.log('form.data :>> ', form.data);

        return {
            form
        };
    }
};