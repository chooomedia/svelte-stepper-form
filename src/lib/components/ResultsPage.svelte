<!-- src/lib/components/ResultsPage.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import type { FormData } from '$lib/schema';
	import Chart from 'chart.js/auto';
	import VisibilityScore from './VisibilityScore.svelte';

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
	const pricePlans = [
		{
			name: '1-MONATS-PLAN',
			originalPrice: '€5.99',
			price: '€4.49',
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
			originalPrice: '€4.99',
			price: '€3.99',
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
			originalPrice: '€4.19',
			price: '€3.09',
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

	// Handle plan selection
	function handlePlanSelect(plan: string, price: number) {
		selectedPlan = plan;
		selectedPrice = price;
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
</script>

<div class="results-page mb-16 space-y-8">
	<!-- Score Section -->
	<VisibilityScore {score} autoAdvance={300} {nextStep} showComparison={false} />

	<!-- Chart & Analysis Section -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2" in:fade={{ duration: 500, delay: 700 }}>
		<!-- Radar Chart -->
		<div class="rounded-lg bg-white p-6 shadow-lg">
			<h3 class="mb-4 text-xl font-bold">Deine digitale Performance im Detail</h3>
			<div class="chart-container h-auto w-full">
				<canvas bind:this={radarChartCanvas}></canvas>
			</div>
		</div>

		<!-- Analysis -->
		<div class="rounded-lg bg-white p-6 shadow-lg">
			<h3 class="mb-4 text-xl font-bold text-gray-800">Stärken & Schwächen Analyse</h3>
			<div class="space-y-4">
				<div>
					<h4 class="flex items-center text-lg font-semibold text-green-600">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-5 w-5"
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
						Stärken
					</h4>
					<ul class="ml-7 mt-2 list-disc space-y-1 text-gray-700">
						{#if score > 60}
							<li>Gute Grundlagen in digitaler Präsenz</li>
							<li>Regelmäßige Content-Erstellung</li>
						{:else if score > 40}
							<li>Grundverständnis für digitales Marketing</li>
							<li>Potenzial für schnelle Verbesserungen</li>
						{:else}
							<li>Großes Wachstumspotenzial</li>
							<li>Möglichkeit für schnelle Sichtbarkeitssteigerung</li>
						{/if}
						<li>
							{formData.visibility === 'social_media'
								? 'Bestehende Social-Media-Präsenz'
								: formData.visibility === 'search_engines'
									? 'Verständnis für Suchmaschinenoptimierung'
									: 'Bereitschaft für digitale Transformation'}
						</li>
					</ul>
				</div>
				<div>
					<h4 class="flex items-center text-lg font-semibold text-red-600">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-5 w-5"
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
					</h4>
					<ul class="ml-7 mt-2 list-disc space-y-1 text-gray-700">
						{#if score < 40}
							<li>Geringe digitale Sichtbarkeit</li>
							<li>Fehlende Online-Marketingstrategie</li>
							<li>Unzureichende Website-Optimierung</li>
						{:else if score < 60}
							<li>Begrenzte Reichweite in Suchmaschinen</li>
							<li>Unterentwickelte Content-Strategie</li>
							<li>Mangelnde Conversion-Optimierung</li>
						{:else}
							<li>Lücken in der Content-Distribution</li>
							<li>Begrenzte Konkurrenzanalyse</li>
							<li>Optimierungspotenzial in der Conversion Rate</li>
						{/if}
					</ul>
				</div>
			</div>
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
	{#if showPlanSelector}
		<div class="mt-8 rounded-lg bg-white p-6 shadow-lg" in:fade={{ duration: 500, delay: 1200 }}>
			<div class="mb-6 text-center">
				<h3 class="text-2xl font-bold text-gray-900">Wähle Deinen Plan</h3>
				<p class="mt-2 text-gray-600">
					Verbessere Deine Online-Präsenz mit unseren maßgeschneiderten Lösungen
				</p>
			</div>

			<div class="mb-6">
				<p class="mb-2 font-semibold">51% Rabatt verfällt in 00:00</p>
				<div class="h-2 w-full rounded-full bg-gray-200">
					<div class="h-2 w-1/5 animate-pulse rounded-full bg-red-500"></div>
				</div>
			</div>

			<!-- Pricing Cards -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				{#each pricePlans as plan, i}
					<div
						class="relative rounded-lg border {selectedPlan === plan.name
							? 'border-blue-500 ring-2 ring-blue-200'
							: 'border-gray-200'}"
					>
						{#if plan.popular}
							<div class="absolute -top-3 left-0 right-0 flex justify-center">
								<span
									class="rounded-full bg-gray-200 px-4 py-1 text-xs font-medium uppercase tracking-wide text-gray-800"
								>
									★ AM BELIEBTESTEN
								</span>
							</div>
						{/if}

						<div class="p-6">
							<div class="flex items-center">
								<input
									type="radio"
									id={plan.name}
									name="plan"
									value={plan.name}
									checked={selectedPlan === plan.name}
									class="h-4 w-4 text-blue-600"
									on:change={() =>
										handlePlanSelect(plan.name, parseFloat(plan.price.replace('€', '')))}
								/>
								<label for={plan.name} class="ml-2 text-lg font-semibold text-gray-900">
									{plan.name}
								</label>
							</div>

							<div class="mt-4 flex items-baseline text-right">
								<span class="text-sm text-gray-500 line-through">{plan.originalPrice}</span>
								<span class="ml-1 text-3xl font-bold text-gray-900">{plan.price}</span>
								<span class="ml-1 text-sm text-gray-500">{plan.perDay}</span>
							</div>

							<ul class="mt-6 space-y-3">
								{#each plan.features as feature}
									<li class="flex items-start">
										<svg
											class="mr-2 h-5 w-5 flex-shrink-0 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											></path>
										</svg>
										<span class="text-sm text-gray-700">{feature}</span>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				{/each}
			</div>

			<!-- Order Button -->
			<div class="mt-8 text-center">
				<button
					class="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
				>
					PLAN BESTELLEN
				</button>
			</div>

			<!-- Security & Guarantee -->
			<div
				class="mt-6 flex flex-col items-center justify-center space-y-4 text-sm text-gray-600 md:flex-row md:space-x-8 md:space-y-0"
			>
				<div class="flex items-center">
					<svg class="mr-2 h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
							clip-rule="evenodd"
						></path>
					</svg>
					Sicher & geschützt bezahlen
				</div>
				<div class="flex items-center">
					<svg class="mr-2 h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
							clip-rule="evenodd"
						></path>
					</svg>
					30 Tage Geld-zurück-Garantie
				</div>
			</div>
		</div>

		<!-- What's Included/Not Included -->
		<div
			class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2"
			in:fade={{ duration: 500, delay: 1400 }}
		>
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<h3 class="mb-4 text-xl font-bold text-gray-900">Hier finden Sie</h3>
				<ul class="space-y-4">
					{#each includedFeatures as feature}
						<li class="flex items-start">
							<svg
								class="mr-2 h-5 w-5 flex-shrink-0 text-blue-500"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								></path>
							</svg>
							<span class="text-blue-600 hover:text-blue-700">{feature}</span>
						</li>
					{/each}
				</ul>
			</div>

			<div class="rounded-lg bg-white p-6 shadow-lg">
				<h3 class="mb-4 text-xl font-bold text-gray-900">Was Sie NICHT finden werden</h3>
				<ul class="space-y-4">
					{#each excludedFeatures as feature}
						<li class="flex items-start">
							<svg
								class="mr-2 h-5 w-5 flex-shrink-0 text-gray-400"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clip-rule="evenodd"
								></path>
							</svg>
							<span class="text-gray-500">{feature}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}

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
							? '€1000/Tag mit dem YouTube Follower-zu-Einkommen-Plan'
							: 'Mehr als €10.000/Monat durch strategisches Online Marketing'}
					</h4>
					<div class="mt-3">
						<blockquote class="text-gray-700">
							<span class="text-2xl">"</span>
							Ich habe 5 Wochen gebraucht, um mit bewährten Funnels konsistentes Einkommen zu generieren.
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
							Gott ist erstaunlich! Das Erreichen von konstanten Verkäufen kann ich nur empfehlen.
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
