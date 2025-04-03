<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { i18n } from '$lib/i18n';
	import { currencyStore } from '$lib/stores/currencyStore';
	import type { FormData } from '$lib/schema';
	import VisibilityScore from './VisibilityScore.svelte';
	import PerformanceChart from './PerformanceChart.svelte';
	import PricingOptions from './PricingOptions.svelte';
	import ExpertProfile from './sections/ExpertSection.svelte';
	import ProcessSteps from './ProcessSteps.svelte';
	import ImprovementSection from './sections/ImprovementSection.svelte';
	import BenefitsSection from './sections/BenefitsSection.svelte';
	import { scoreStore, getFallbackAuditData, websiteScreenshot } from '$lib/utils/scoring';
	import Icon from './Icon.svelte';

	interface Props {
		score: number;
		formData: FormData;
		auditData: any;
		nextStep: () => void;
		restartAssessment: () => void;
	}

	let { score, formData, auditData, nextStep, restartAssessment } = $props<Props>();

	// State variables
	let benefits = $state<string[]>([]);
	let recommendations = $state<string[]>([]);
	let pageLoaded = $state(false);
	let showImprovement = $state(false);

	// Process the score value to ensure it's valid
	let processedScore = $derived(isNaN(score) || score < 0 || score > 100 ? 50 : score);

	// Get screenshot from store
	let screenshot = $derived($websiteScreenshot);

	// Generate benefits based on form data and score
	function generateBenefits() {
		const baseBenefits = [
			$i18n.results.benefits.visibility,
			$i18n.results.benefits.traffic,
			$i18n.results.benefits.conversion
		];

		const additionalBenefits = [];

		// Add specific benefits based on user selections
		if (formData?.visibility === 'search_engines') {
			additionalBenefits.push($i18n.results.benefits.searchEngines);
		}

		if (formData?.visibility === 'social_media') {
			additionalBenefits.push($i18n.results.benefits.socialMedia);
		}

		if (formData?.goals === 'new_clients') {
			additionalBenefits.push($i18n.results.benefits.newClients);
		}

		if (formData?.goals === 'new_employees') {
			additionalBenefits.push($i18n.results.benefits.newEmployees);
		}

		// Ensure we have at least the base benefits
		return [...new Set([...baseBenefits, ...additionalBenefits])].slice(0, 5);
	}

	// Generate recommendations based on score and form data
	function generateRecommendations() {
		const baseRecommendations = [
			$i18n.results.recommendations.website,
			$i18n.results.recommendations.content
		];

		const metricRecommendations = [];

		const metrics = scoreStore.getState()?.metrics;

		if (metrics) {
			if (metrics.performance < 70) {
				metricRecommendations.push($i18n.results.recommendations.performance);
			}

			if (metrics.seo < 70) {
				metricRecommendations.push($i18n.results.recommendations.seo);
			}

			if (metrics.accessibility < 70) {
				metricRecommendations.push($i18n.results.recommendations.accessibility);
			}

			if (metrics.content < 70) {
				metricRecommendations.push($i18n.results.recommendations.contentQuality);
			}
		}

		const additionalRecommendations = [];

		// Add specific recommendations based on score
		if (processedScore < 40) {
			additionalRecommendations.push($i18n.results.recommendations.basicSeo);
			additionalRecommendations.push($i18n.results.recommendations.googleBusiness);
		} else if (processedScore < 60) {
			additionalRecommendations.push($i18n.results.recommendations.advancedSeo);
			additionalRecommendations.push($i18n.results.recommendations.localSeo);
		} else if (processedScore < 80) {
			additionalRecommendations.push($i18n.results.recommendations.contentMarketing);
			additionalRecommendations.push($i18n.results.recommendations.backlinks);
		} else {
			additionalRecommendations.push($i18n.results.recommendations.extendedContent);
			additionalRecommendations.push($i18n.results.recommendations.competitorAnalysis);
		}

		return [
			...new Set([...baseRecommendations, ...additionalRecommendations, ...metricRecommendations])
		].slice(0, 5);
	}

	function handlePlanSelection(plan: string, price: number) {
		console.log(`Selected plan: ${plan}, price: ${currencyStore.getFormattedPrice(price)}€`);
		// Add your logic here
	}

	// Enhance the plan prices with localized currency
	function getLocalizedPricePlans() {
		return pricePlans.map((plan) => ({
			...plan,
			price: currencyStore.convertPrice(plan.price),
			originalPrice: currencyStore.convertPrice(plan.originalPrice),
			formattedPrice: currencyStore.convertPrice(plan.price),
			formattedOriginalPrice: currencyStore.convertPrice(plan.originalPrice)
		}));
	}

	// Price plans based on score range
	export const pricePlans = [
		{
			name: '1-MONATS-PLAN',
			price: 1.98,
			originalPrice: 7.99,
			perDay: $i18n.pricing.perDay,
			popular: false,
			features: [
				$i18n.pricing.features.websiteOptimization,
				$i18n.pricing.features.basicSeo,
				$i18n.pricing.features.monthlyContent,
				$i18n.pricing.features.performanceReport
			]
		},
		{
			name: '3-MONATS-PLAN',
			price: 3.98,
			originalPrice: 10.99,
			perDay: $i18n.pricing.perDay,
			popular: true,
			features: [
				$i18n.pricing.features.allBasicFeatures,
				$i18n.pricing.features.socialMedia,
				$i18n.pricing.features.weeklyContent,
				$i18n.pricing.features.keywordOptimization,
				$i18n.pricing.features.competitorAnalysis
			]
		},
		{
			name: '6-MONATS-PLAN',
			price: 6.98,
			originalPrice: 19.99,
			perDay: $i18n.pricing.perDay,
			popular: false,
			features: [
				$i18n.pricing.features.allPremiumFeatures,
				$i18n.pricing.features.marketingStrategy,
				$i18n.pricing.features.dailyContent,
				$i18n.pricing.features.sem,
				$i18n.pricing.features.personalManager,
				$i18n.pricing.features.cro
			]
		}
	];

	// Included & excluded features in our plans
	const includedFeatures = [
		$i18n.pricing.included.longtermBusiness,
		$i18n.pricing.included.viralContent,
		$i18n.pricing.included.expertFrameworks,
		$i18n.pricing.included.targetedStrategies
	];

	const excludedFeatures = [
		$i18n.pricing.excluded.getRichQuick,
		$i18n.pricing.excluded.noContracts,
		$i18n.pricing.excluded.noInvestment,
		$i18n.pricing.excluded.pyramidSchemes
	];

	// Add a reactive subscription to the score store
	let scorestoreData = $state(null);
	let metrics = $state(null);

	$effect(() => {
		// Subscribe to the score store
		const unsubscribe = scoreStore.subscribe((data) => {
			scorestoreData = data;

			// Direct access to detailed metrics
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

		// After initial load, show plans
		setTimeout(() => {
			pageLoaded = true;
		}, 500);

		// After a longer delay, show improvement view
		setTimeout(() => {
			showImprovement = true;
		}, 3000);

		return () => {
			unsubscribe();
		};
	});
</script>

<div class="results-page mb-16 mt-3">
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
					<div class="screenshot-container overflow-hidden rounded-t-lg">
						<!-- Wenn der Screenshot eine Daten-URL ist -->
						{#if screenshot.startsWith('data:')}
							<img
								src={screenshot}
								alt={$i18n.results.screenshot.alt}
								class="h-auto w-full object-cover shadow-sm"
								onerror={(e) => {
									console.error('Screenshot Fehler:', e);
								}}
							/>
							<!-- Falls der Screenshot als HTML/SVG kommt -->
						{:else if screenshot.startsWith('<')}
							<div class="h-48 w-full bg-gray-100 p-2">
								{@html screenshot}
							</div>
							<!-- Fallback für andere Fälle -->
						{:else}
							<div class="flex h-48 w-full items-center justify-center bg-gray-200 p-4">
								<div class="text-center text-gray-500">
									<svg
										class="mx-auto h-12 w-12"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									<p class="mt-2">{$i18n.results.screenshot.unsupported}</p>
								</div>
							</div>
						{/if}
					</div>
				{:else}
					<div class="overflow-hidden rounded-t-lg">
						<div class="bg-gray-300">
							<img src="/ui-mockup.svg" alt="Website Mockup" class="h-48 w-full p-5" />
						</div>
					</div>
				{/if}
				<!-- Modern score visualization -->
				<div class="flex flex-grow flex-col p-6">
					<h3 class="mb-2 text-center text-xl font-bold">{$i18n.results.score.title}</h3>
					<VisibilityScore score={processedScore} autoAdvance={360} {nextStep} />
				</div>
			</div>
		</div>

		<!-- Improved Performance Chart (2/3 width on desktop) -->
		<div
			class="h-full rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl md:col-span-2"
		>
			<PerformanceChart
				{score}
				auditData={getFallbackAuditData}
				animateOnResultLoad={pageLoaded}
				{showImprovement}
			/>
		</div>
	</div>

	<!-- Chart & Analysis Section -->
	<div class="my-8 grid grid-cols-1 gap-8 md:grid-cols-2" in:fade={{ duration: 500, delay: 900 }}>
		<!-- Stärken -->
		<div class="p-6">
			<h3 class="mb-4 flex items-center text-xl font-bold text-green-600">
				<Icon name="check" size={24} className="mr-2" />
				{$i18n.results.strengths.title}
			</h3>
			<ul class="space-y-3">
				{#each [...(processedScore > 60 ? [$i18n.results.strengths.goodBasics, $i18n.results.strengths.regularContent] : processedScore > 40 ? [$i18n.results.strengths.understanding, $i18n.results.strengths.quickImprovement] : [$i18n.results.strengths.growthPotential, $i18n.results.strengths.visibilityGain]), formData?.visibility === 'social_media' ? $i18n.results.strengths.socialPresence : formData?.visibility === 'search_engines' ? $i18n.results.strengths.seoUnderstanding : $i18n.results.strengths.digitalTransformation] as strength, i}
					<li in:fly={{ y: 20, delay: 1000 + i * 100, duration: 400 }} class="flex items-start">
						<div class="mr-3 text-green-500">
							<Icon name="check" size={20} />
						</div>
						<span>{strength}</span>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Verbesserungspotenzial -->
		<div class="p-6">
			<h3 class="mb-4 flex items-center text-xl font-bold text-red-600">
				<Icon name="closeX" size={24} className="mr-2" />
				{$i18n.results.weaknesses.title}
			</h3>
			<ul class="space-y-3">
				{#each [...(processedScore < 40 ? [$i18n.results.weaknesses.poorVisibility, $i18n.results.weaknesses.noStrategy, $i18n.results.weaknesses.poorOptimization] : processedScore < 60 ? [$i18n.results.weaknesses.limitedReach, $i18n.results.weaknesses.underdevelopedContent, $i18n.results.weaknesses.poorConversion] : [$i18n.results.weaknesses.contentDistribution, $i18n.results.weaknesses.competitorAnalysis, $i18n.results.weaknesses.conversionRate])] as weakness, i}
					<li in:fly={{ y: 20, delay: 1000 + i * 100, duration: 400 }} class="flex items-start">
						<div class="mr-3 text-red-500">
							<Icon name="closeX" size={20} />
						</div>
						<span>{weakness}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<!-- Improvement Section - NEW -->
	<ImprovementSection score={processedScore} />

	<!-- Benefits and Recommendations -->
	<BenefitsSection />

	<!-- Process Steps Section - NEW -->
	<ProcessSteps />

	<!-- Expert Profile Section - NEW -->
	<ExpertProfile />

	<!-- Pricing Section -->
	<PricingOptions
		score={processedScore}
		{formData}
		onPlanSelect={handlePlanSelection}
		pricePlans={getLocalizedPricePlans()}
	/>

	<!-- Add after PricingOptions component -->
	<div
		class="my-16 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 shadow-lg"
		in:fade={{ duration: 500, delay: 1200 }}
	>
		<div class="mx-auto max-w-7xl">
			<h2 class="text-center text-3xl font-bold tracking-tight text-gray-900">
				<span class="text-primary-600">{$i18n.pricing.includedTitle}</span>
				{$i18n.pricing.inAllPlans}
			</h2>

			<div class="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
				{#each includedFeatures as feature, i}
					<div class="flex items-start" in:fly={{ y: 20, delay: 1300 + i * 100, duration: 400 }}>
						<div class="flex-shrink-0">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-md bg-primary-500 text-white"
							>
								<Icon name="check" size={26} />
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
					{$i18n.pricing.excludedTitle} <span class="text-red-500">{$i18n.pricing.notWorking}</span>
				</h2>

				<div class="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
					{#each excludedFeatures as feature, i}
						<div class="flex items-start" in:fly={{ y: 20, delay: 1800 + i * 100, duration: 400 }}>
							<div class="flex-shrink-0">
								<div
									class="flex h-12 w-12 items-center justify-center rounded-md bg-red-500 text-white"
								>
									<Icon name="closeX" size={26} />
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
				<div class="inline-flex items-center rounded-md shadow">
					<button
						class="flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-5 py-3 text-base font-medium text-secondary hover:bg-primary-700"
						onclick={() =>
							window.scrollTo({
								top: document.querySelector('.pricing-cards')?.offsetTop || 0,
								behavior: 'smooth'
							})}
					>
						{$i18n.pricing.choosePlan}
						<Icon name="arrowRight" fill="currentColor" size={32} className="mt-1 ml-2" />
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Before/After Comparison with Real Results -->
	<div class="mt-12" in:fade={{ duration: 500, delay: 1600 }}>
		<h3 class="relative mb-8 text-center text-3xl font-bold text-secondary">
			<span
				class="absolute -top-6 left-1/2 -translate-x-1/2 transform text-lg font-normal text-primary-500"
				>{$i18n.results.sections.testimonials.inspiration}</span
			>
			{$i18n.results.sections.testimonials.title}
		</h3>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<!-- Testimonial/Case Study 1 -->
			<div
				class="flex flex-col overflow-hidden rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-4 shadow-md transition-all duration-300 hover:shadow-lg"
			>
				<div class="flex-1">
					<div class="mb-4 overflow-hidden rounded-lg">
						<img
							src="https://digitalpusher.de/wp-content/uploads/2024/08/chooomedia-showcase-smartphone-desktop-tablet-munich-expogate-aschheim-dornach-ev-website-relaunch-2022-min.png"
							alt="Expogate Showcase Website SEO und Soical Media"
							class="object- h-96 w-full rounded-lg object-cover object-top transition-transform duration-500 hover:scale-105"
						/>
					</div>
					<h4 class="text-xl font-bold text-secondary-600">
						{processedScore < 50
							? $i18n.results.sections.testimonials.case1.titleLow
							: $i18n.results.sections.testimonials.case1.titleHigh}
					</h4>
					<div class="mt-3">
						<blockquote class="text-gray-700">
							<span class="text-xl text-blue-300">"</span>
							{$i18n.results.sections.testimonials.case1.quote}
							<span class="text-2xl text-blue-300">"</span>
						</blockquote>
						<p class="mt-2 text-right text-sm font-medium text-gray-500">
							{$i18n.results.sections.testimonials.case1.author}
						</p>
					</div>
				</div>
			</div>

			<!-- Testimonial/Case Study 2 -->
			<div
				class="flex flex-col overflow-hidden rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-4 shadow-md transition-all duration-300 hover:shadow-lg"
			>
				<div class="flex-1">
					<div class="mb-4 overflow-hidden rounded-lg">
						<img
							src="https://digitalpusher.de/wp-content/uploads/2024/08/chooomedia-de-showcase-03-2023-zirkulin-bittergesicht-gewinnspiel.png"
							alt="Wachsende Online-Präsenz"
							class="h-96 w-full rounded-lg object-cover object-top transition-transform duration-500 hover:scale-105"
						/>
					</div>
					<h4 class="text-xl font-bold text-secondary-600">
						{$i18n.results.sections.testimonials.case2.title}
					</h4>
					<div class="mt-3">
						<blockquote class="text-gray-700">
							<span class="text-2xl text-blue-300">"</span>
							{$i18n.results.sections.testimonials.case2.quote}
							<span class="text-2xl text-blue-300">"</span>
						</blockquote>
						<p class="mt-2 text-right text-sm font-medium text-gray-500">
							{$i18n.results.sections.testimonials.case2.author}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Call to Action -->
	<div
		class="mt-10 rounded-lg bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-center shadow-lg"
		in:fade={{ duration: 500, delay: 1800 }}
	>
		<h3 class="text-2xl font-bold text-white">
			{$i18n.results.sections.cta.title}
		</h3>
		<p class="mt-2 text-blue-100">
			{$i18n.results.sections.cta.subtitle}
		</p>
		<div class="mt-6">
			<button
				class="rounded-lg bg-white px-8 py-3 font-semibold text-secondary-600 shadow-lg transition hover:bg-blue-50"
				onclick={() =>
					window.scrollTo({
						top: document.querySelector('.pricing-cards')?.offsetTop || 0,
						behavior: 'smooth'
					})}
			>
				{$i18n.results.sections.cta.button}
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
			{$i18n.results.buttons.restart}
		</button>

		<button
			class="w-full rounded-lg bg-primary-600 px-6 py-3 font-semibold text-secondary shadow-sm transition-colors hover:bg-primary-700 sm:w-auto"
			onclick={nextStep}
		>
			{$i18n.results.buttons.getReport}
		</button>
	</div>
</div>
