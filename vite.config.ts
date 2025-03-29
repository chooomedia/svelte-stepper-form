import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const hostIp = '192.168.178.37';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$lib: '/src/lib'
		}
	},
	server: {
		host: hostIp,
		port: 5173,
		open: true,
		strictPort: true,
		hmr: {
			host: hostIp,
			protocol: 'ws',
			port: 5173,
			clientPort: 5173
		}
	}
});
