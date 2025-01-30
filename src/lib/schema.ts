import * as z from 'zod';

export const formSchema = z.object({
    test: z.string(),
});