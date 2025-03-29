<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	// Props for the component
	interface Props {
		customTips?: string[]; // Optional custom tips from parent component
		minDisplayTime?: number; // Minimum display time in seconds after webhook response
		isResponseReceived?: boolean; // Flag to indicate if response was received
	}

	const { customTips = [], minDisplayTime = 3, isResponseReceived = false } = $props<Props>();

	// Default SEO tips
	const defaultSeoTips = [
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

	// State variables
	let currentTipIndex = $state(0);
	let intervalId: number | undefined;
	let timeoutId: number | undefined;
	let showCustomTips = $state(false);
	let activeTips = $state(defaultSeoTips);
	let inTransition = $state(false);
	let tipTitle = $state('SEO-Tipp während der Analyse:');

	// Handle tip rotation
	function startTipRotation(tips: string[], interval: number = 5000) {
		// Clear any existing interval
		if (intervalId) clearInterval(intervalId);

		// Reset index
		currentTipIndex = 0;

		// Start new interval for tips rotation
		intervalId = setInterval(() => {
			inTransition = true;
			setTimeout(() => {
				currentTipIndex = (currentTipIndex + 1) % tips.length;
				inTransition = false;
			}, 300); // Match this with transition duration
		}, interval);

		return intervalId;
	}

	// Lifecycle management
	onMount(() => {
		// Start with default tips
		startTipRotation(defaultSeoTips);
	});

	// Effect to handle custom tips when response is received
	$effect(() => {
		// If we have custom tips and response is received
		if (customTips && customTips.length > 0 && isResponseReceived) {
			// Clear existing timers
			if (intervalId) clearInterval(intervalId);
			if (timeoutId) clearTimeout(timeoutId);

			// Switch to custom tips with smooth transition
			inTransition = true;
			setTimeout(() => {
				showCustomTips = true;
				activeTips = customTips;
				tipTitle = 'SEO-Tipp basierend auf Deiner Analyse:';
				currentTipIndex = 0;
				inTransition = false;

				// Start rotation with custom tips
				startTipRotation(customTips, 5000); // Show custom tips faster
			}, 300);
		}
	});

	onDestroy(() => {
		// Clean up timers
		if (intervalId) clearInterval(intervalId);
		if (timeoutId) clearTimeout(timeoutId);
	});
</script>

<div
	class="seo-tip-card rounded-lg border border-blue-100 bg-blue-50 p-5 shadow-sm"
	in:fade={{ duration: 500 }}
	out:fade={{ duration: 500 }}
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
		<div class="relative min-h-[4rem] w-full overflow-hidden">
			<h3 class="font-semibold text-blue-800">{tipTitle}</h3>

			{#if !inTransition}
				<p
					class="mt-1 text-blue-700"
					in:fly={{ y: -20, duration: 300 }}
					out:fly={{ y: 20, duration: 300 }}
				>
					{activeTips[currentTipIndex]}
				</p>
			{/if}
		</div>
	</div>
	<div class="mt-4">
		<div class="h-1 w-full overflow-hidden rounded-full bg-blue-200">
			<div
				class="h-full animate-pulse rounded-full bg-blue-500 transition-all duration-300"
				style="width: {((currentTipIndex + 1) / activeTips.length) * 100}%"
			></div>
		</div>
	</div>
</div>
