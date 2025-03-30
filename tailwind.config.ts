import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			boxShadow: {
				custom: '0 8px 32px 0 rgba(20,28,40,0.06)'
			}
		}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['light'],
		base: true,
		styled: true,
		utils: true
	}
} satisfies Config;
