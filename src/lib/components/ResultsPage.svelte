<!-- src/lib/components/ResultsPage.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import type { FormData } from '$lib/schema';
	import Chart from 'chart.js/auto';
	import VisibilityScore from './VisibilityScore.svelte';
	import PricingOptions from './PricingOptions.svelte';

	interface Props {
		score: number;
		formData: FormData;
		nextStep: () => void;
		restartAssessment: () => void;
	}

	let { score, formData, nextStep, restartAssessment } = $props<Props>();

	// Chart elements
	let radarChartCanvas: HTMLCanvasElement;
	let radarChart: Chart;

	// Define the benefits and recommendations based on score
	let benefits = $state<string[]>([]);
	let recommendations = $state<string[]>([]);
	let selectedPlan = $state('');
	let selectedPrice = $state(0);
	let showPlanSelector = $state(false);

	// Price plans based on score range
	export const pricePlans = [
		{
			name: '1-MONATS-PLAN',
			price: 3.98,
			originalPrice: 7.99,
			perDay: 'pro Tag',
			popular: false,
			features: [
				'Website-Optimierung',
				'Grundlegende SEO-Maßnahmen',
				'Content-Erstellung (1× pro Monat)',
				'Monatlicher Performance-Bericht'
			]
		},
		{
			name: '3-MONATS-PLAN',
			price: 4.98,
			originalPrice: 9.99,
			perDay: 'pro Tag',
			popular: true,
			features: [
				'Alle Features des 1-Monats-Plans',
				'Social Media Management',
				'Wöchentliche Content-Erstellung',
				'Keyword-Optimierung',
				'Detaillierte Konkurrenzanalyse'
			]
		},
		{
			name: '6-MONATS-PLAN',
			price: 9.98,
			originalPrice: 19.99,
			perDay: 'pro Tag',
			popular: false,
			features: [
				'Alle Features des 3-Monats-Plans',
				'Umfassende Marketingstrategie',
				'Tägliche Content-Updates',
				'Suchmaschinenmarketing (SEM)',
				'Persönlicher Marketing-Manager',
				'Conversion-Rate-Optimierung'
			]
		}
	];

	// Included & excluded features in our plans
	const includedFeatures = [
		'Methode zur Schaffung eines echten, langfristigen Online-Geschäfts',
		'Exklusive Konzepte für die Erstellung viraler Inhalte',
		'Bewährte Experten-Frameworks um schnell und effizient zu skalieren',
		'TOP 10 erfolgreiche Verkaufsseiten & Funnels für Produktverkäufe',
		'Faktenbasierte Strategien anhand der Bedürfnisse Deiner Zielgruppe'
	];

	const excludedFeatures = [
		'Schnell-reich-werden-Schemata',
		'Keine langfristigen Verpflichtungen oder Verträge',
		'Eine investitionsfreie Möglichkeit, die nie hält, was sie verspricht',
		'Unerprobte Strategien für den Erfolg über Nacht',
		'MLM, Dropshipping oder Wiederverkauf von Pyramidensystemen'
	];

	// Generate benefits based on form data and score
	function generateBenefits() {
		const baseBenefits = [
			'Höhere Sichtbarkeit in Google & Co.',
			'Mehr qualifizierte Besucher auf Deiner Website',
			'Bessere Konversionsraten durch optimierte Inhalte'
		];

		// Add specific benefits based on user selections
		if (formData.visibility === 'search_engines') {
			benefits.push('Optimierte Suchmaschinenplatzierungen für relevante Keywords');
		}

		if (formData.visibility === 'social_media') {
			benefits.push('Verbesserte Social-Media-Präsenz und Engagement');
		}

		if (formData.goals === 'new_clients') {
			benefits.push('Zielgerichtete Strategien zur Neukundengewinnung');
		}

		if (formData.goals === 'new_employees') {
			benefits.push('Optimierte Karriereseite zur Mitarbeitergewinnung');
		}

		// Ensure we have at least the base benefits
		return [...new Set([...baseBenefits, ...benefits])].slice(0, 5);
	}

	// Generate recommendations based on score and form data
	function generateRecommendations() {
		const baseRecommendations = [
			'Website-Optimierung für bessere Nutzererfahrung',
			'Content-Strategie zur Steigerung der Sichtbarkeit'
		];

		// Add specific recommendations based on score
		if (score < 40) {
			recommendations.push('Grundlegende SEO-Optimierung Deiner Website');
			recommendations.push('Erstellung eines Google Business Profils');
		} else if (score < 60) {
			recommendations.push('Erweiterte SEO-Maßnahmen für mehr organischen Traffic');
			recommendations.push('Lokale SEO-Optimierung für regionale Sichtbarkeit');
		} else if (score < 80) {
			recommendations.push('Content-Marketing-Strategie zur Stärkung Deiner Marktposition');
			recommendations.push('Backlinkaufbau zur Steigerung der Domain-Autorität');
		} else {
			recommendations.push('Erweiterte Content-Strategie für maximale Sichtbarkeit');
			recommendations.push('Wettbewerbsanalyse zur Identifizierung von Wachstumschancen');
		}

		return [...new Set([...baseRecommendations, ...recommendations])].slice(0, 5);
	}

	// Initialize chart on mount
	onMount(() => {
		// Generate benefits and recommendations
		benefits = generateBenefits();
		recommendations = generateRecommendations();

		// Show plan selector after a delay
		setTimeout(() => {
			showPlanSelector = true;
		}, 3000);

		// Initialize radar chart
		if (radarChartCanvas) {
			const ctx = radarChartCanvas.getContext('2d');
			if (ctx) {
				// The radar chart data represents different aspects of online presence
				radarChart = new Chart(ctx, {
					type: 'radar',
					data: {
						labels: [
							'SEO-Optimierung',
							'Social Media',
							'Website-Qualität',
							'Content-Strategie',
							'Lokale Präsenz'
						],
						datasets: [
							{
								label: 'Deine aktuelle Sichtbarkeit',
								data: [
									Math.min(Math.round(score * 0.7), 100),
									Math.min(Math.round(score * 0.8), 100),
									Math.min(Math.round(score * 0.6), 100),
									Math.min(Math.round(score * 0.5), 100),
									Math.min(Math.round(score * 0.9), 100)
								],
								backgroundColor: 'rgba(255, 99, 132, 0.2)',
								borderColor: 'rgba(255, 99, 132, 1)',
								borderWidth: 2
							},
							{
								label: 'Potenzial mit unserer Lösung',
								data: [85, 90, 80, 85, 95],
								backgroundColor: 'rgba(54, 162, 235, 0.2)',
								borderColor: 'rgba(54, 162, 235, 1)',
								borderWidth: 2
							}
						]
					},
					options: {
						scales: {
							r: {
								angleLines: {
									display: true
								},
								ticks: {
									display: false,
									max: 100,
									min: 0
								}
							}
						}
					}
				});
			}
		}
	});

	// Clean up chart on destroy
	onDestroy(() => {
		if (radarChart) {
			radarChart.destroy();
		}
	});

	function handlePlanSelection(plan: string, price: number) {
		console.log(`Selected plan: ${plan}, price: ${price}€`);
		// Add your logic here
	}
</script>

<div class="results-page mb-16">
	<!-- Score Section -->

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2" in:fade={{ duration: 500, delay: 700 }}>
		<!-- Modern score visualization -->
		<div class="flex flex-col rounded-lg bg-white p-6 shadow-lg">
			<h3 class="mb-4 text-xl font-bold">Dein Performance Score</h3>
			<VisibilityScore {score} autoAdvance={300} {nextStep} showComparison={false} />
		</div>

		<!-- Improved Radar Chart -->
		<div class="rounded-lg bg-white p-6 shadow-lg">
			<h3 class="mb-4 text-xl font-bold">Deine digitale Performance im Detail</h3>
			<div class="chart-container h-auto w-full">
				<canvas bind:this={radarChartCanvas}></canvas>
				<!-- Add interactive tooltips that appear on hover -->
				<div class="mt-4 flex flex-wrap justify-center gap-3">
					{#each ['SEO', 'Social', 'Website', 'Content', 'Lokal'] as area, i}
						<div class="flex items-center">
							<span
								class="mr-2 inline-block h-3 w-3 rounded-full"
								style="background-color: {i === 0
									? 'rgba(255, 99, 132, 0.8)'
									: 'rgba(54, 162, 235, 0.8)'}"
							></span>
							<span class="text-sm">{area}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Chart & Analysis Section -->
	<div class="grid grid-cols-2 gap-8" in:fade={{ duration: 500, delay: 900 }}>
		<!-- Stärken -->
		<div class="p-6">
			<h3 class="mb-4 flex items-center text-xl font-bold text-green-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-2 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
				Deine Stärken
			</h3>
			<ul class="space-y-3">
				{#each [...(score > 60 ? ['Gute Grundlagen in digitaler Präsenz', 'Regelmäßige Content-Erstellung'] : score > 40 ? ['Grundverständnis für digitales Marketing', 'Potenzial für schnelle Verbesserungen'] : ['Großes Wachstumspotenzial', 'Möglichkeit für schnelle Sichtbarkeitssteigerung']), formData.visibility === 'social_media' ? 'Bestehende Social-Media-Präsenz' : formData.visibility === 'search_engines' ? 'Verständnis für Suchmaschinenoptimierung' : 'Bereitschaft für digitale Transformation'] as strength, i}
					<li in:fly={{ y: 20, delay: 1000 + i * 100, duration: 400 }} class="flex items-start">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-5 w-5 flex-shrink-0 text-green-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						<span>{strength}</span>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Verbesserungspotenzial -->
		<div class="p-6">
			<h3 class="mb-4 flex items-center text-xl font-bold text-red-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-2 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
				Verbesserungspotenzial
			</h3>
			<ul class="space-y-3">
				{#each [...(score < 40 ? ['Geringe digitale Sichtbarkeit', 'Fehlende Online-Marketingstrategie', 'Unzureichende Website-Optimierung'] : score < 60 ? ['Begrenzte Reichweite in Suchmaschinen', 'Unterentwickelte Content-Strategie', 'Mangelnde Conversion-Optimierung'] : ['Lücken in der Content-Distribution', 'Begrenzte Konkurrenzanalyse', 'Optimierungspotenzial in der Conversion Rate'])] as weakness, i}
					<li in:fly={{ y: 20, delay: 1000 + i * 100, duration: 400 }} class="flex items-start">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-5 w-5 flex-shrink-0 text-red-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
						<span>{weakness}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<!-- Benefits and Recommendations -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2" in:fade={{ duration: 500, delay: 900 }}>
		<div class="rounded-lg bg-white p-6 shadow-lg">
			<h3 class="mb-4 flex items-center text-xl font-bold text-green-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-2 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				Deine Vorteile
			</h3>
			<ul class="space-y-3">
				{#each benefits as benefit, i}
					<li in:fly={{ y: 20, delay: 1000 + i * 100, duration: 400 }} class="flex items-start">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-5 w-5 flex-shrink-0 text-green-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						<span>{benefit}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="rounded-lg bg-white p-6 shadow-lg">
			<h3 class="mb-4 flex items-center text-xl font-bold text-blue-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-2 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
				Unsere Empfehlungen
			</h3>
			<ul class="space-y-3">
				{#each recommendations as recommendation, i}
					<li in:fly={{ y: 20, delay: 1000 + i * 100, duration: 400 }} class="flex items-start">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-5 w-5 flex-shrink-0 text-blue-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
						<span>{recommendation}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<!-- Pricing Section -->
	<PricingOptions {score} {formData} onPlanSelect={handlePlanSelection} {pricePlans} />

	<!-- Before/After Comparison with Real Results -->
	<div class="mt-8" in:fade={{ duration: 500, delay: 1600 }}>
		<h3 class="mb-6 text-center text-2xl font-bold text-gray-900">
			Echte Ergebnisse von Menschen wie Dir
		</h3>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<!-- Testimonial/Case Study 1 -->
			<div class="flex flex-col rounded-lg bg-gray-50 p-4">
				<div class="flex-1">
					<div class="mb-4">
						<img
							src="https://digitalpusher.de/wp-content/uploads/2024/09/digital-analytics-chart-example.jpg"
							alt="Verkaufsstatistik"
							class="h-40 w-full rounded-lg object-cover"
						/>
					</div>
					<h4 class="text-xl font-bold text-blue-600">
						{score < 50
							? 'Wow! Mindestens 3 Abschlüsse am Tag dank Local SEO und Social Media'
							: 'Mehr als €10.000/Monat durch strategisches Online Marketing'}
					</h4>
					<div class="mt-3">
						<blockquote class="text-gray-700">
							<span class="text-2xl">"</span>
							Ich habe 5 Wochen gebraucht, um mit bewährten Funnels konsistente Neukundenumsätze zu generieren.
							<span class="text-2xl">"</span>
						</blockquote>
					</div>
				</div>
			</div>

			<!-- Testimonial/Case Study 2 -->
			<div class="flex flex-col rounded-lg bg-gray-50 p-4">
				<div class="flex-1">
					<div class="mb-4">
						<img
							src="https://digitalpusher.de/wp-content/uploads/2024/09/social-media-analytics-chart.jpg"
							alt="Social Media Statistik"
							class="h-40 w-full rounded-lg object-cover"
						/>
					</div>
					<h4 class="text-xl font-bold text-blue-600">
						Ich habe bewährte Strategien verwendet, um stetiges Wachstum zu erreichen
					</h4>
					<div class="mt-3">
						<blockquote class="text-gray-700">
							<span class="text-2xl">"</span>
							Erstaunliche Ergebnisse! Das Erreichen von konstanten Verkäufen kann ich nur empfehlen.
							<span class="text-2xl">"</span>
						</blockquote>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Call to Action -->
	<div
		class="mt-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center shadow-lg"
		in:fade={{ duration: 500, delay: 1800 }}
	>
		<h3 class="text-2xl font-bold text-white">
			Bereit, Deine digitale Präsenz zu revolutionieren?
		</h3>
		<p class="mt-2 text-blue-100">
			Wähle jetzt Deinen Plan und starte Deine Reise zu mehr Sichtbarkeit und Erfolg.
		</p>
		<div class="mt-6">
			<button
				class="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 shadow-lg transition hover:bg-blue-50"
				on:click={() =>
					window.scrollTo({
						top: document.querySelector('.mt-8')?.offsetTop || 0,
						behavior: 'smooth'
					})}
			>
				Jetzt Plan auswählen
			</button>
		</div>
	</div>

	<!-- Action Buttons -->
	<div
		class="mt-8 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
	>
		<button
			class="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 sm:w-auto"
			on:click={restartAssessment}
		>
			Neues Assessment starten
		</button>

		<button
			class="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
			on:click={nextStep}
		>
			Analysebericht per E-Mail erhalten
		</button>
	</div>
</div>
