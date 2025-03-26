<!-- src/lib/components/ResultsPage.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import type { FormData } from '$lib/schema';
	import VisibilityScore from './VisibilityScore.svelte';
	import PerformanceChart from './PerformanceChart.svelte';
	import PricingOptions from './PricingOptions.svelte';

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

	// Ensure auditData has default values if not provided
	let processedAuditData = $derived(() => {
		// If auditData is empty or invalid, use the fallback data
		if (!auditData || typeof auditData !== 'object' || Object.keys(auditData).length === 0) {
			return getFallbackAuditData(processedScore);
		}

		// If auditData exists but is missing some required properties, merge with fallback
		const fallbackData = getFallbackAuditData(processedScore);
		return {
			...fallbackData,
			...auditData,
			// Ensure lighthouse report exists
			lighthouse_report: auditData.lighthouse_report || fallbackData.lighthouse_report,
			// Ensure score is set
			score: auditData.score || processedScore
		};
	});

	// Fallback data generation function
	function getFallbackAuditData(score: number) {
		// Default performance score based on overall score
		const performanceScore = Math.min(0.9, Math.max(0.4, score / 100));

		return {
			url: formData?.website || 'example.com',
			score: score,
			lighthouse_report: {
				categories: {
					performance: { score: performanceScore },
					seo: { score: score >= 70 ? 0.85 : score >= 50 ? 0.65 : 0.45 },
					accessibility: { score: score >= 70 ? 0.75 : score >= 50 ? 0.55 : 0.35 },
					'best-practices': { score: score >= 70 ? 0.8 : score >= 50 ? 0.6 : 0.4 }
				}
			},
			security_headers: {
				grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D'
			},
			technologies: ['Svelte', 'Tailwind CSS', 'Vercel'],
			traffic: {
				monthly_visitors: Math.round(score * 100),
				bounce_rate: Math.max(0.3, 1 - score / 100)
			},
			social_media: {
				followers: Math.round(score * 20),
				engagement_rate: Math.min(0.1, score / 1000)
			},
			competitors: ['competitor1.com', 'competitor2.com', 'competitor3.com'],
			goals: formData?.goals || ['new_clients'],
			visibility: formData?.visibility || 'search_engines',
			content: {
				blog_posts: Math.round(score / 10),
				videos: Math.round(score / 20),
				infographics: Math.round(score / 25)
			}
		};
	}

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

		return [...new Set([...baseRecommendations, ...additionalRecommendations])].slice(0, 5);
	}

	function handlePlanSelection(plan: string, price: number) {
		console.log(`Selected plan: ${plan}, price: ${price}€`);
		// Add your logic here
	}

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
			price: 5.98,
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

	// Initialize chart and data on mount
	onMount(() => {
		// Generate benefits and recommendations
		benefits = generateBenefits();
		recommendations = generateRecommendations();

		// Show plan selector after a delay
		setTimeout(() => {
			pageLoaded = true;
		}, 500);
	});
</script>

<div class="results-page mb-16">
	<!-- Score Section -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-3" in:fade={{ duration: 500, delay: 700 }}>
		<!-- Modern score visualization (1/3 width on desktop) -->
		<div
			class="flex flex-col rounded-lg bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
		>
			<h3 class="mb-4 text-xl font-bold">Dein Performance Score</h3>
			<VisibilityScore score={processedScore} animateOnResultLoad={pageLoaded} />
		</div>

		<!-- Improved Radar Chart (2/3 width on desktop) -->
		<div
			class="overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl md:col-span-2"
		>
			<PerformanceChart
				score={processedScore}
				auditData={processedAuditData}
				animateOnResultLoad={pageLoaded}
			/>
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
							: 'Durchbruch: Über €10.000 monatlich durch durchdachte Marketing-Strategie'}
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
						Rekordverdächtige Umsetzung: Landingpage, SEO und full Channel Ads Kampange
					</h4>
					<div class="mt-3">
						<blockquote class="text-gray-700">
							<span class="text-2xl text-blue-300">"</span>
							Durch einen Ausfall für eine groß angelegte Kampagne suchten wir nach einen fähigen Dienstleister.
							Die Landingpage wurde auf unser E-Commerce Netzwerk basierend auf Shopware schnell umgesetzt
							und die Kampagne war ein voller Erfolg.
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
