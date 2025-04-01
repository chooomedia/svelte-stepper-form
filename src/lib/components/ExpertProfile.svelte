<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { i18n } from '$lib/i18n';

	export let delay = 300; // Animation delay
</script>

<div
	class="expert-profile my-16 rounded-xl bg-gradient-to-r from-secondary-50 to-secondary-100 p-8 shadow-lg"
	in:fade={{ duration: 500, delay }}
>
	<div class="flex flex-col items-center gap-8 md:flex-row">
		<!-- Expert Image -->
		<div class="shrink-0">
			<div
				class="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary-200 shadow-lg"
			>
				<img
					src="https://digitalpusher.de/wp-content/uploads/2024/09/oliver-kohl-experte-digitalpusher-min.jpg"
					alt="Oliver Kohl - Digital Marketing Expert"
					class="h-full w-full object-cover"
				/>
				<div class="absolute inset-0 rounded-full shadow-inner"></div>
			</div>
		</div>

		<!-- Expert Information -->
		<div class="flex-1 text-center md:text-left">
			<h3 class="mb-2 text-2xl font-bold text-secondary-800">Oliver Kohl</h3>
			<p class="mb-4 text-lg font-medium text-primary-700">Digital Marketing Expert</p>

			<p class="mb-6 text-secondary-600">
				Mit über 15 Jahren Erfahrung in der digitalen Welt unterstützt Oliver Unternehmen dabei,
				ihre Online-Präsenz zu optimieren und messbare Erfolge zu erzielen. Als zertifizierter
				Google-Partner und Social-Media-Spezialist kennt er alle relevanten Strategien für
				nachhaltige Sichtbarkeit.
			</p>

			<div class="flex flex-wrap justify-center gap-4 md:justify-start">
				<div class="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-primary-600"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="font-medium">Google-Partner</span>
				</div>
				<div class="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-primary-600"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
						/>
					</svg>
					<span class="font-medium">230+ Kunden</span>
				</div>
				<div class="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-primary-600"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="font-medium">15+ Jahre Erfahrung</span>
				</div>
			</div>
		</div>
	</div>
</div>
