<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { i18n } from '$lib/i18n';
	import Icon from '../Icon.svelte';
	import type { FormData } from '$lib/schema';

	// Props
	const { score = 50, formData = {} } = $props<{
		score?: number;
		formData?: Partial<FormData>;
	}>();

	// Generate benefits based on form data and score
	const generateBenefits = () => {
		// Base benefits that always appear
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
	};

	// Generate recommendations based on score and form data
	const generateRecommendations = () => {
		// Base recommendations for all scores
		const baseRecommendations = [
			$i18n.results.recommendations.website,
			$i18n.results.recommendations.content
		];

		const additionalRecommendations = [];

		// Add specific recommendations based on score
		if (score < 40) {
			additionalRecommendations.push($i18n.results.recommendations.basicSeo);
			additionalRecommendations.push($i18n.results.recommendations.googleBusiness);
		} else if (score < 60) {
			additionalRecommendations.push($i18n.results.recommendations.advancedSeo);
			additionalRecommendations.push($i18n.results.recommendations.localSeo);
		} else if (score < 80) {
			additionalRecommendations.push($i18n.results.recommendations.contentMarketing);
			additionalRecommendations.push($i18n.results.recommendations.backlinks);
		} else {
			additionalRecommendations.push($i18n.results.recommendations.extendedContent);
			additionalRecommendations.push($i18n.results.recommendations.competitorAnalysis);
		}

		// Add performance recommendation if score is low
		if (score < 70) {
			additionalRecommendations.push($i18n.results.recommendations.performance);
		}

		// Return unique recommendations (up to 5 max)
		return [...new Set([...baseRecommendations, ...additionalRecommendations])].slice(0, 5);
	};

	// Reactive values that update when score, formData, or translations change
	const benefits = $derived(generateBenefits());
	const recommendations = $derived(generateRecommendations());
</script>

<div class="grid grid-cols-1 gap-8 md:grid-cols-2" in:fade={{ duration: 500, delay: 900 }}>
	<div class="rounded-lg bg-primary-100 p-6 shadow-lg">
		<h3 class="mb-4 flex items-center text-xl font-bold text-green-600">
			<Icon name="checkCircle" size={24} className="mr-1" stroke="none" />
			{$i18n.results.benefits.title}
		</h3>
		<ul class="space-y-3">
			{#each benefits as benefit, i}
				<li in:fly={{ y: 20, delay: 1000 + i * 100, duration: 400 }} class="flex items-start">
					<div class="text-green-600">
						<Icon name="checkCircle" size={24} className="mr-1" stroke="none" />
					</div>
					<span>{benefit}</span>
				</li>
			{/each}
		</ul>
	</div>

	<div class="rounded-lg bg-primary-100 p-6 shadow-lg">
		<h3 class="mb-4 flex items-center text-xl font-bold text-primary-700">
			<Icon name="thunder" size={24} className="mr-1" />
			{$i18n.results.recommendations.title}
		</h3>
		<ul class="space-y-3">
			{#each recommendations as recommendation, i}
				<li in:fly={{ y: 20, delay: 1000 + i * 100, duration: 400 }} class="flex items-start">
					<div class="text-primary-700">
						<Icon name="thunder" size={20} className="mr-2" />
					</div>
					<span>{recommendation}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
