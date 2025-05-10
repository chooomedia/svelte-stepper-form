import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import os from 'os';

function getLocalIP() {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name] || []) {
			if (iface.family === 'IPv4' && !iface.internal) {
				return iface.address;
			}
		}
	}
	return 'localhost';
}

const hostIp = getLocalIP();

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
