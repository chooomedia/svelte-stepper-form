import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			boxShadow: {
				custom: '0 8px 32px 0 rgba(20,28,40,0.06)'
			},
			colors: {
				primary: {
					DEFAULT: '#6bd0d9',
					50: '#e3f9fa',
					100: '#c5eff2',
					200: '#95e0e7',
					300: '#6bd0d9',
					400: '#47bdc9',
					500: '#34a4b0',
					600: '#27848e',
					700: '#1c646d',
					800: '#11454c',
					900: '#06272b'
				},
				secondary: {
					DEFAULT: '#002b2f',
					50: '#e2e7e8',
					100: '#b8c3c5',
					200: '#8b9d9f',
					300: '#60787a',
					400: '#3b5658',
					500: '#002b2f',
					600: '#002528',
					700: '#001d20',
					800: '#001517',
					900: '#000c0e'
				}
			}
		}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				light: {
					primary: '#6bd0d9',
					secondary: '#002b2f'
				}
			}
		],
		base: true,
		styled: true,
		utils: true
	}
} satisfies Config;
