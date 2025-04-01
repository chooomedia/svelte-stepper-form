import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#6BD0D9',
					50: '#EFFAFB',
					100: '#E3F6F8',
					200: '#C2ECEF',
					300: '#A6E3E8',
					400: '#89D9E1',
					500: '#6BD0D9',
					600: '#38C0CC',
					700: '#28919A',
					800: '#1A5F65',
					900: '#0E3135',
					950: '#061718'
				},
				secondary: {
					DEFAULT: '#002B2F',
					50: '#00838F',
					100: '#007A85',
					200: '#006770',
					300: '#00545C',
					400: '#003D42',
					500: '#002B2F',
					600: '#002124',
					700: '#001C1F',
					800: '#001314',
					900: '#00090A',
					950: '#000505'
				}
			},
			boxShadow: {
				custom: '0 8px 32px 0 rgba(20,28,40,0.06)'
			}
		}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				mytheme: {
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
