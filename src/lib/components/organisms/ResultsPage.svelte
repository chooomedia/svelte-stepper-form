<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { WebhookService } from '$lib/services/webhookService';
	import { i18n, currentLocale } from '$lib/i18n';
	import type { FormData } from '$lib/schema';
	import VisibilityScore from '../atoms/VisibilityScore.svelte';
	import PerformanceChart from './PerformanceChart.svelte';
	import ExpertProfile from '../templates/ExpertSection.svelte';
	import ProcessSteps from '../molecules/ProcessSteps.svelte';
	import BenefitsSection from '../templates/BenefitsSection.svelte';
	import TidyCalBooking from './TidyCalBooking.svelte';
	import {
		getFallbackAuditData,
		websiteScreenshot,
		calculateIconBasedScore
	} from '$lib/utils/scoring';
	import Icon from '../atoms/Icon.svelte';
	import ErrorDisplay from '../atoms/ErrorDisplay.svelte';

	const isDev = import.meta.env.DEV;

	let { score, formData, auditData, nextStep, restartAssessment }: {
		score: number;
		formData: FormData;
		auditData: any;
		nextStep: () => void;
		restartAssessment: () => void;
	} = $props();

	// State variables
	let webhookSent = $state(false);
	let formErrors = $state<string[]>([]);

	// Debug: Log die aktuelle Sprache
	$effect(() => {
		console.log('🌍 ResultsPage - Current locale:', $currentLocale);
		console.log('🌍 ResultsPage - Current i18n language:', $i18n?.meta?.language);
	});

	// Berechne Icon-basierten Score
	let iconBasedScore = $derived(calculateIconBasedScore(formData));
	let finalScore = $derived(Math.round((score + iconBasedScore) / 2));

	async function sendAnalysisResults() {
		// Prüfen, ob bereits gesendet wurde
		if (webhookSent) {
			return;
		}

		// Prüfen, ob tägliches Limit erreicht ist
		if (WebhookService.hasReachedDailyLimit() && !isDev) {
			const error = 'You have reached your daily limit for emails. Please try again tomorrow.';
			formErrors = [error];
			webhookSent = true;
			return;
		}

		// Webhook senden
		try {
			// Füge die aktuelle Sprache zu den Formulardaten hinzu
			const formDataWithLanguage = {
				...formData,
				language: $currentLocale
			};

			console.log('🌍 Sending webhook with language:', $currentLocale);
			console.log('🌍 Form data with language:', formDataWithLanguage);

			// Übergebe die aktuellen Formulardaten direkt an den Webhook-Service
			const result = await WebhookService.sendQuizResults(formDataWithLanguage);
			webhookSent = true;
			if (!result.success) {
				formErrors = [result.message];
			} else {
				formErrors = [];
			}
		} catch (error) {
			webhookSent = true;
			const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
			formErrors = [errorMessage];
		}
	}

	// Get screenshot from store
	let screenshot = $derived($websiteScreenshot);

	// Process the score value to ensure it's valid
	let processedScore = $derived(
		isNaN(finalScore) || finalScore < 0 || finalScore > 100 ? 50 : finalScore
	);


	// Simplified - removed pricing functions and data

	// Initialize chart and data on mount
	onMount(() => {
		if (formData.email && !webhookSent && !WebhookService.hasReachedDailyLimit()) {
			// Wait a short delay to allow the UI to render
			setTimeout(() => {
				sendAnalysisResults();
			}, 2000);
		}
	});
</script>

<div class="results-page mb-16 mt-3">
	{#if formErrors.length > 0}
		<ErrorDisplay errors={formErrors} title={$i18n.common.formErrorHeading} />
	{/if}

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
				auditData={auditData || getFallbackAuditData(finalScore, formData?.company_url)}
			/>
		</div>
	</div>

	<!-- Chart & Analysis Section -->
	<div class="my-8 grid grid-cols-1 gap-8 md:grid-cols-2" in:fade={{ duration: 500, delay: 900 }}>
		<!-- Stärken -->
		<div class="p-6">
			<h3 class="mb-4 flex items-center text-xl font-bold text-green-600">
				<Icon
					name="check"
					size={24}
					className="mr-2"
					stroke="currentColor"
					strokeWidth="2"
					fill="none"
				/>
				{$i18n.results.strengths.title}
			</h3>
			<ul class="space-y-3">
				{#each [...(processedScore > 60 ? [$i18n.results.strengths.goodBasics, $i18n.results.strengths.regularContent] : processedScore > 40 ? [$i18n.results.strengths.understanding, $i18n.results.strengths.quickImprovement] : [$i18n.results.strengths.growthPotential, $i18n.results.strengths.visibilityGain]), formData?.visibility === 'social_media' ? $i18n.results.strengths.socialPresence : formData?.visibility === 'search_engines' ? $i18n.results.strengths.seoUnderstanding : $i18n.results.strengths.digitalTransformation] as strength, i}
					<li in:fly={{ y: 20, delay: 1000 + i * 100, duration: 400 }} class="flex items-start">
						<div class="mr-3 text-green-500">
							<Icon name="check" size={20} stroke="currentColor" strokeWidth="2" fill="none" />
						</div>
						<span>{strength}</span>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Verbesserungspotenzial -->
		<div class="p-6">
			<h3 class="mb-4 flex items-center text-xl font-bold text-red-600">
				<Icon
					name="closeX"
					size={24}
					className="mr-2"
					stroke="currentColor"
					strokeWidth="2"
					fill="none"
				/>
				{$i18n.results.weaknesses.title}
			</h3>
			<ul class="space-y-3">
				{#each [...(processedScore < 50 ? [$i18n.results.weaknesses.poorVisibility, $i18n.results.weaknesses.noStrategy, $i18n.results.weaknesses.poorOptimization] : processedScore < 60 ? [$i18n.results.weaknesses.limitedReach, $i18n.results.weaknesses.underdevelopedContent, $i18n.results.weaknesses.poorConversion] : [$i18n.results.weaknesses.contentDistribution, $i18n.results.weaknesses.competitorAnalysis, $i18n.results.weaknesses.conversionRate])] as weakness, i}
					<li in:fly={{ y: 20, delay: 1000 + i * 100, duration: 400 }} class="flex items-start">
						<div class="mr-3 text-red-500">
							<Icon name="closeX" size={20} strokeWidth="2" />
						</div>
						<span>{weakness}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<!-- Improvement Section 
	<ImprovementSection score={processedScore} />  -->

	<!-- Benefits and Recommendations -->
	<BenefitsSection />

	<!-- Process Steps Section - NEW -->
	<ProcessSteps />

	<!-- Expert Profile Section - NEW -->
	<ExpertProfile />

	<!-- TidyCal Booking Section - Direct Integration -->
	<div
		class="booking-content my-16 overflow-hidden rounded-xl bg-white p-8 shadow-lg"
		in:fade={{ duration: 500, delay: 1200 }}
	>
		<TidyCalBooking {formData} />
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

	<!-- Simplified Call to Action - Scroll to Booking -->
	<div
		class="mt-10 rounded-lg bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-center shadow-lg"
		in:fade={{ duration: 500, delay: 1800 }}
	>
		<h3 class="text-2xl font-bold text-white">
			Bereit für den nächsten Schritt?
		</h3>
		<p class="mt-2 text-blue-100">
			Buche jetzt dein kostenloses Beratungsgespräch und lass uns gemeinsam deine Online-Sichtbarkeit verbessern.
		</p>
		<div class="mt-6">
			<button
				class="rounded-lg bg-white px-8 py-3 font-semibold text-secondary-600 shadow-lg transition hover:bg-blue-50"
				onclick={() => {
					const element = document.querySelector('.booking-content');
					if (element) {
						window.scrollTo({
							top: (element as HTMLElement).offsetTop || 0,
							behavior: 'smooth'
						});
					}
				}}
			>
				Jetzt Termin buchen
			</button>
		</div>
	</div>

	<!-- Simplified Action Buttons - Only Restart -->
	<div
		class="mt-8 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
	>
		<button
			class="btn w-full rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 sm:w-auto"
			onclick={restartAssessment}
		>
			{$i18n.results.buttons.restart}
		</button>

		<button
			class="btn btn-primary flex w-full items-center justify-center px-6 py-3 shadow-sm md:w-auto"
			onclick={() => {
				const element = document.querySelector('.booking-content');
				if (element) {
					window.scrollTo({
						top: (element as HTMLElement).offsetTop || 0,
						behavior: 'smooth'
					});
				}
			}}
		>
			Jetzt Termin buchen
		</button>
	</div>
</div>
