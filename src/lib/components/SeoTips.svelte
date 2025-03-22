<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	const seoTips = [
		'Verwende präzise Seitentitel (Title-Tags) für bessere Klickraten in Suchergebnissen.',
		'Erstelle einzigartige Meta-Beschreibungen für jede Seite (150-160 Zeichen).',
		'Verwende eine H1-Überschrift pro Seite, die das Hauptthema klar kommuniziert.',
		'Optimiere Bilder mit Alt-Texten und komprimiere sie für schnellere Ladezeiten.',
		'Erstelle eine klare Website-Struktur mit logischen URLs.',
		'Optimiere Deine Website für Mobilgeräte mit responsivem Design.',
		'Verbessere die Ladegeschwindigkeit - jede Sekunde zählt für SEO und Conversion.',
		'Nutze interne Verlinkungen, um Besuchern und Suchmaschinen zu helfen, Deinen Content zu finden.',
		'Erstelle regelmäßig hochwertigen, relevanten Content für Deine Zielgruppe.',
		'Implementiere Schema.org Markup für bessere Darstellung in Suchergebnissen.',
		'Erstelle eine XML-Sitemap und reiche sie bei Google Search Console ein.',
		'Nutze eine sichere HTTPS-Verbindung für Deine gesamte Website.',
		'Überprüfe und repariere defekte Links regelmäßig.',
		'Optimiere Open Graph Tags für bessere Darstellung in sozialen Medien.'
	];

	let currentTipIndex = $state(0);
	let intervalId: number;

	onMount(() => {
		// Change tip every 5 seconds
		intervalId = setInterval(() => {
			currentTipIndex = (currentTipIndex + 1) % seoTips.length;
		}, 5000);
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});
</script>

<div
	class="seo-tip-card rounded-lg border border-blue-100 bg-blue-50 p-5 shadow-sm"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 300 }}
>
	<div class="flex items-start space-x-4">
		<div class="flex-shrink-0">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 text-blue-500"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		</div>
		<div>
			<h3 class="font-semibold text-blue-800">SEO-Tipp während der Analyse:</h3>
			<p class="mt-1 text-blue-700">{seoTips[currentTipIndex]}</p>
		</div>
	</div>
	<div class="mt-4">
		<div class="h-1 w-full overflow-hidden rounded-full bg-blue-200">
			<div
				class="h-full animate-pulse rounded-full bg-blue-500"
				style="width: {((currentTipIndex + 1) / seoTips.length) * 100}%"
			></div>
		</div>
	</div>
</div>
