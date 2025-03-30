<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import type { FormData } from '$lib/schema';
	import VisibilityScore from './VisibilityScore.svelte';
	import PerformanceChart from './PerformanceChart.svelte';
	import PricingOptions from './PricingOptions.svelte';
	import { scoreStore, getFallbackAuditData, websiteScreenshot } from '$lib/utils/scoring';

	interface Props {
		score: number;
		formData: FormData;
		auditData: any;
		nextStep: () => void;
		restartAssessment: () => void;
	}

	let { score, formData, auditData, nextStep, restartAssessment } = $props<Props>();

	// Define the benefits and recommendations based on score
	let benefits = $state<string[]>([]);
	let recommendations = $state<string[]>([]);
	let pageLoaded = $state(false);

	// Process the score value to ensure it's valid
	let processedScore = $derived(isNaN(score) || score < 0 || score > 100 ? 50 : score);

	// Generate benefits based on form data and score
	function generateBenefits() {
		const baseBenefits = [
			'Höhere Sichtbarkeit in Google & Co.',
			'Mehr qualifizierte Besucher auf Deiner Website',
			'Bessere Konversionsraten durch optimierte Inhalte'
		];

		const additionalBenefits = [];

		// Add specific benefits based on user selections
		if (formData?.visibility === 'search_engines') {
			additionalBenefits.push('Optimierte Suchmaschinenplatzierungen für relevante Keywords');
		}

		if (formData?.visibility === 'social_media') {
			additionalBenefits.push('Verbesserte Social-Media-Präsenz und Engagement');
		}

		if (formData?.goals === 'new_clients') {
			additionalBenefits.push('Zielgerichtete Strategien zur Neukundengewinnung');
		}

		if (formData?.goals === 'new_employees') {
			additionalBenefits.push('Optimierte Karriereseite zur Mitarbeitergewinnung');
		}

		// Ensure we have at least the base benefits
		return [...new Set([...baseBenefits, ...additionalBenefits])].slice(0, 5);
	}

	// Generate recommendations based on score and form data
	function generateRecommendations() {
		const baseRecommendations = [
			'Website-Optimierung für bessere Nutzererfahrung',
			'Content-Strategie zur Steigerung der Sichtbarkeit'
		];

		const metricRecommendations = [];

		if (metrics) {
			if (metrics.performance < 70) {
				metricRecommendations.push(
					'Verbesserung der Website-Ladegeschwindigkeit durch Optimierung von Bildern und Skripten'
				);
			}

			if (metrics.seo < 70) {
				metricRecommendations.push(
					'SEO-Optimierung durch verbesserte Meta-Tags und strukturierte Daten'
				);
			}

			if (metrics.accessibility < 70) {
				metricRecommendations.push('Barrierefreiheit verbessern für mehr Zugänglichkeit');
			}

			if (metrics.content < 70) {
				metricRecommendations.push(
					'Content-Qualität durch bessere Strukturierung und Keywords optimieren'
				);
			}
		}

		const additionalRecommendations = [];

		// Add specific recommendations based on score
		if (processedScore < 40) {
			additionalRecommendations.push('Grundlegende SEO-Optimierung Deiner Website');
			additionalRecommendations.push('Erstellung eines Google Business Profils');
		} else if (processedScore < 60) {
			additionalRecommendations.push('Erweiterte SEO-Maßnahmen für mehr organischen Traffic');
			additionalRecommendations.push('Lokale SEO-Optimierung für regionale Sichtbarkeit');
		} else if (processedScore < 80) {
			additionalRecommendations.push(
				'Content-Marketing-Strategie zur Stärkung Deiner Marktposition'
			);
			additionalRecommendations.push('Backlinkaufbau zur Steigerung der Domain-Autorität');
		} else {
			additionalRecommendations.push('Erweiterte Content-Strategie für maximale Sichtbarkeit');
			additionalRecommendations.push('Wettbewerbsanalyse zur Identifizierung von Wachstumschancen');
		}

		return [
			...new Set([...baseRecommendations, ...additionalRecommendations, ...metricRecommendations])
		].slice(0, 5);
	}

	function handlePlanSelection(plan: string, price: number) {
		console.log(`Selected plan: ${plan}, price: ${price}€`);
		// Add your logic here
	}

	// Price plans based on score range
	export const pricePlans = [
		{
			name: '1-MONATS-PLAN',
			price: 1.98,
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
			price: 3.98,
			originalPrice: 10.99,
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
			price: 6.98,
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
		'Faktenbasierte Strategien anhand der Bedürfnisse Deiner Zielgruppe'
	];

	const excludedFeatures = [
		'Schnell-reich-werden-Schemata: über Nacht reich werden',
		'Keine langfristigen Verpflichtungen oder Verträge',
		'Eine investitionsfreie Möglichkeit, die nie hält, was sie verspricht',
		'MLM, Dropshipping oder Wiederverkauf von Pyramidensystemen'
	];

	// Add a reactive subscription to the score store
	let scorestoreData = $state(null);
	let metrics = $state(null);
	let screenshot = $derived($websiteScreenshot);

	$effect(() => {
		// Subscribe to the score store
		const unsubscribe = scoreStore.subscribe((data) => {
			scorestoreData = data;

			// Direkter Zugriff auf die detaillierten Metriken
			if (data?.metrics) {
				metrics = data.metrics;
			}
		});

		return () => {
			unsubscribe();
		};
	});

	// Initialize chart and data on mount
	onMount(() => {
		// Subscribe to the score store
		const unsubscribe = scoreStore.subscribe((data) => {
			scorestoreData = data;
		});

		// Generate benefits and recommendations
		benefits = generateBenefits();
		recommendations = generateRecommendations();

		// Show plan selector after a delay
		setTimeout(() => {
			pageLoaded = true;
		}, 500);

		return () => {
			unsubscribe();
		};
	});
</script>

<div class="results-page mb-16">
	<!-- Score Section -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
		<!-- Left column: Score visualization and website screenshot -->
		<div class="flex h-full flex-col gap-6">
			<!-- Website Screenshot Card (if available) -->
			<div
				class="h-full overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
				in:fade={{ duration: 500, delay: 800 }}
			>
				{#if screenshot}
					<div class="overflow-hidden">
						{screenshot}
					</div>
				{:else}
					<div class="overflow-hidden">
						<div class="bg-gray-300">
							<img src="/ui-mockup.svg" alt="Website Mockup" class="h-48 w-full p-5" />
						</div>
					</div>
				{/if}
				<!-- Modern score visualization -->
				<div class="flex flex-grow flex-col p-6">
					<h3 class="mb-2 text-center text-xl font-bold">Dein Marketing Score</h3>
					<VisibilityScore score={processedScore} autoAdvance={360} {nextStep} />
				</div>
			</div>
		</div>

		<!-- Improved Performance Chart (2/3 width on desktop) -->
		<div
			class="h-full rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl md:col-span-2"
		>
			<PerformanceChart {score} auditData={getFallbackAuditData} animateOnResultLoad={pageLoaded} />
		</div>
	</div>

	<!-- Chart & Analysis Section -->
	<div class="my-8 grid grid-cols-1 gap-8 md:grid-cols-2" in:fade={{ duration: 500, delay: 900 }}>
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
				{#each [...(processedScore > 60 ? ['Gute Grundlagen in digitaler Präsenz', 'Regelmäßige Content-Erstellung'] : processedScore > 40 ? ['Grundverständnis für digitales Marketing', 'Potenzial für schnelle Verbesserungen'] : ['Großes Wachstumspotenzial', 'Möglichkeit für schnelle Sichtbarkeitssteigerung']), formData?.visibility === 'social_media' ? 'Bestehende Social-Media-Präsenz' : formData?.visibility === 'search_engines' ? 'Verständnis für Suchmaschinenoptimierung' : 'Bereitschaft für digitale Transformation'] as strength, i}
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
				{#each [...(processedScore < 40 ? ['Geringe digitale Sichtbarkeit', 'Fehlende Online-Marketingstrategie', 'Unzureichende Website-Optimierung'] : processedScore < 60 ? ['Begrenzte Reichweite in Suchmaschinen', 'Unterentwickelte Content-Strategie', 'Mangelnde Conversion-Optimierung'] : ['Lücken in der Content-Distribution', 'Begrenzte Konkurrenzanalyse', 'Optimierungspotenzial in der Conversion Rate'])] as weakness, i}
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
	<PricingOptions
		score={processedScore}
		{formData}
		onPlanSelect={handlePlanSelection}
		{pricePlans}
	/>

	<!-- Add after PricingOptions component -->
	<div
		class="my-16 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 shadow-lg"
		in:fade={{ duration: 500, delay: 1200 }}
	>
		<div class="mx-auto max-w-7xl">
			<h2 class="text-center text-3xl font-bold tracking-tight text-gray-900">
				<span class="text-blue-600">Inklusive</span> in all unseren Paketen
			</h2>

			<div class="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
				{#each includedFeatures as feature, i}
					<div class="flex items-start" in:fly={{ y: 20, delay: 1300 + i * 100, duration: 400 }}>
						<div class="flex-shrink-0">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white"
							>
								<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-medium text-gray-900">{feature}</h3>
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-16">
				<h2 class="text-center text-3xl font-bold tracking-tight text-gray-900">
					Wir arbeiten <span class="text-red-500">nicht</span> mit
				</h2>

				<div class="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
					{#each excludedFeatures as feature, i}
						<div class="flex items-start" in:fly={{ y: 20, delay: 1800 + i * 100, duration: 400 }}>
							<div class="flex-shrink-0">
								<div
									class="flex h-12 w-12 items-center justify-center rounded-md bg-red-500 text-white"
								>
									<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</div>
							</div>
							<div class="ml-4">
								<h3 class="text-lg font-medium text-gray-900">{feature}</h3>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="mt-16 text-center">
				<div class="inline-flex rounded-md shadow">
					<button
						class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700"
						onclick={() =>
							window.scrollTo({
								top: document.querySelector('.pricing-cards')?.offsetTop || 0,
								behavior: 'smooth'
							})}
					>
						Passenden Plan auswählen
						<svg class="-mr-1 ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Before/After Comparison with Real Results -->
	<div class="mt-12" in:fade={{ duration: 500, delay: 1600 }}>
		<h3 class="relative mb-8 text-center text-3xl font-bold text-gray-900">
			<span
				class="absolute -top-6 left-1/2 -translate-x-1/2 transform text-lg font-normal text-blue-500"
				>INSPIRATIONEN</span
			>
			Erfolgsgeschichten, die Dich motivieren werden
		</h3>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<!-- Testimonial/Case Study 1 -->
			<div
				class="flex flex-col overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 shadow-md transition-all duration-300 hover:shadow-lg"
			>
				<div class="flex-1">
					<div class="mb-4 overflow-hidden rounded-lg">
						<img
							src="https://digitalpusher.de/wp-content/uploads/2024/08/chooomedia-showcase-smartphone-desktop-tablet-munich-expogate-aschheim-dornach-ev-website-relaunch-2022-min.png"
							alt="Expogate Showcase Website SEO und Soical Media"
							class="object- h-96 w-full rounded-lg object-cover object-top transition-transform duration-500 hover:scale-105"
						/>
					</div>
					<h4 class="text-xl font-bold text-blue-600">
						{processedScore < 50
							? 'Von 0 auf 100: Mindestens 3 Abschlüsse täglich durch maximierte Online-Präsenz'
							: 'Durchbruch: mehr als 43% mehr Anfragen dank durchdachter Marketing-Strategie'}
					</h4>
					<div class="mt-3">
						<blockquote class="text-gray-700">
							<span class="text-xl text-blue-300">"</span>
							Wir wurden im vollen Umfang bestens beraten und entschieden uns neben der Webapp und der
							neuen Webseite uns vom Dienstleister eine zielstrebige und langfristige Kampagne auf Social
							Media planen und realisieren zu lassen. Wir sind mit den Conversions nach zwei Jahren sehr
							zufrieden.
							<span class="text-2xl text-blue-300">"</span>
						</blockquote>
						<p class="mt-2 text-right text-sm font-medium text-gray-500">
							- Dr. P. Ullrich, Geschäftsführer
						</p>
					</div>
				</div>
			</div>

			<!-- Testimonial/Case Study 2 -->
			<div
				class="flex flex-col overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 shadow-md transition-all duration-300 hover:shadow-lg"
			>
				<div class="flex-1">
					<div class="mb-4 overflow-hidden rounded-lg">
						<img
							src="https://digitalpusher.de/wp-content/uploads/2024/08/chooomedia-de-showcase-03-2023-zirkulin-bittergesicht-gewinnspiel.png"
							alt="Wachsende Online-Präsenz"
							class="h-96 w-full rounded-lg object-cover object-top transition-transform duration-500 hover:scale-105"
						/>
					</div>
					<h4 class="text-xl font-bold text-blue-600">
						Effiziente Umsetzung: Landingpage, SEO und full Channel Ads Kampagne
					</h4>
					<div class="mt-3">
						<blockquote class="text-gray-700">
							<span class="text-2xl text-blue-300">"</span>
							Die Landingpage und SEO wurde auf Grundlage der analysierten Daten für unser E-Commerce
							Netzwerk basierend auf Shopware schnell umgesetzt und die Kampagne war dank gezielter Zielgruppenauswahl
							und Conversion Tracking ein voller Erfolg. Auf jeden Fall empfehlenswert.
							<span class="text-2xl text-blue-300">"</span>
						</blockquote>
						<p class="mt-2 text-right text-sm font-medium text-gray-500">
							- M. Keller, Senior Brand Manager
						</p>
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
				onclick={() =>
					window.scrollTo({
						top: document.querySelector('.pricing-cards')?.offsetTop || 0,
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
			onclick={restartAssessment}
		>
			Neues Assessment starten
		</button>

		<button
			class="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
			onclick={nextStep}
		>
			Analysebericht per E-Mail erhalten
		</button>
	</div>
</div>
