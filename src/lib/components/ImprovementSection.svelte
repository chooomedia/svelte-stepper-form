<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { i18n } from '$lib/i18n';

	const { score = 50 } = $props<{ score?: number }>();

	// Bestimme die relevanten Verbesserungen basierend auf dem Score
	const getRelevantImprovements = (score: number) => {
		// Allgemeine Verbesserungen
		const commonImprovements = [
			{
				title: 'Website-Optimierung',
				description:
					'Verbesserung von Ladezeiten, Mobil-Kompatibilität und Benutzerfreundlichkeit.',
				icon: 'device-desktop'
			},
			{
				title: 'SEO & Keywords',
				description: 'Auf Ihre Branche abgestimmte Suchmaschinen-Optimierung für bessere Rankings.',
				icon: 'search'
			}
		];

		// Spezifische Verbesserungen nach Score
		if (score < 40) {
			return [
				...commonImprovements,
				{
					title: 'Grundlegende Web-Präsenz',
					description: 'Aufbau einer soliden Online-Präsenz mit allen notwendigen Grundlagen.',
					icon: 'home'
				},
				{
					title: 'Lokales SEO',
					description:
						'Optimierung für lokale Suchanfragen, damit Kunden in Ihrer Nähe Sie finden.',
					icon: 'map-pin'
				}
			];
		} else if (score < 60) {
			return [
				...commonImprovements,
				{
					title: 'Content-Strategie',
					description:
						'Entwicklung einer Inhaltstrategie, die Ihr Publikum anspricht und überzeugt.',
					icon: 'file-text'
				},
				{
					title: 'Social Media Integration',
					description: 'Verbindung Ihrer Website mit sozialen Medien für größere Reichweite.',
					icon: 'share-2'
				}
			];
		} else if (score < 80) {
			return [
				...commonImprovements,
				{
					title: 'Conversion-Optimierung',
					description: 'Gezielte Verbesserungen, um mehr Besucher in Kunden umzuwandeln.',
					icon: 'trending-up'
				},
				{
					title: 'Content-Marketing',
					description: 'Hochwertige Inhalte, die Ihre Expertise zeigen und Kunden überzeugen.',
					icon: 'edit'
				}
			];
		} else {
			return [
				{
					title: 'Advanced SEO',
					description: 'Fortgeschrittene SEO-Strategien, um Ihre Position an der Spitze zu halten.',
					icon: 'award'
				},
				{
					title: 'Analytics & Datenanalyse',
					description: 'Tiefgehende Analysen zum besseren Verständnis Ihrer Zielgruppe.',
					icon: 'bar-chart-2'
				},
				{
					title: 'Marketing-Automatisierung',
					description: 'Automatisierte Workflows für effizienteres Marketing und Leadgenerierung.',
					icon: 'repeat'
				},
				{
					title: 'Performance-Optimierung',
					description: 'Feintuning Ihrer Website für maximale Geschwindigkeit und Leistung.',
					icon: 'zap'
				}
			];
		}
	};

	const improvements = getRelevantImprovements(score);
</script>

<div class="improvement-section my-16">
	<h2 class="mb-6 text-center text-3xl font-bold text-secondary-900">
		{$i18n.results.sections.improvement}
	</h2>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
		{#each improvements as improvement, index}
			<div
				class="flex flex-col rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
				in:fly={{ y: 20, duration: 400, delay: 200 * index }}
			>
				<div
					class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600"
				>
					<!-- Dynamically include icon based on name -->
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						{#if improvement.icon === 'device-desktop'}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						{:else if improvement.icon === 'search'}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						{:else if improvement.icon === 'home'}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						{:else if improvement.icon === 'map-pin'}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						{:else if improvement.icon === 'file-text'}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						{:else if improvement.icon === 'share-2'}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
							/>
						{:else if improvement.icon === 'trending-up'}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
							/>
						{:else if improvement.icon === 'edit'}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						{:else if improvement.icon === 'award'}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						{:else if improvement.icon === 'bar-chart-2'}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						{:else if improvement.icon === 'repeat'}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						{:else if improvement.icon === 'zap'}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						{:else}
							<!-- Default icon -->
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						{/if}
					</svg>
				</div>

				<h3 class="mb-2 text-lg font-bold text-gray-900">{improvement.title}</h3>
				<p class="text-gray-600">{improvement.description}</p>
			</div>
		{/each}
	</div>
</div>
