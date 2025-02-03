import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			boxShadow: {
				custom: '0 8px 32px 0 rgba(20,28,40,0.02)'
			}
		}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['light'], // You can add more themes if needed
		base: true,
		styled: true,
		utils: true
	}
} satisfies Config;
