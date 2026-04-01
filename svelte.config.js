import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// Vercel Adapter mit Default-Settings (automatische Optimierung)
		adapter: adapter()
	},
	compilerOptions: {
		// Enable run-time checks when not in production
		dev: false
	}
};

export default config;
