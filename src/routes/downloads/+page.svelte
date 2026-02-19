<!-- src/routes/downloads/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import PricingOptions from '$lib/components/organisms/PricingOptions.svelte';
	import { scoreStore } from '$lib/utils/scoring';
	import { formStore } from '$lib/stores/formStore';
	import { i18n } from '$lib/i18n';
	import { env } from '$lib/config/env';
	import { DOWNLOAD_LINKS, PRICING_CONFIG } from '$lib/config/downloads';

	// Props
	const { data } = $props();

	// State
	let score = $state(50);
	let formData = $state(null);
	let pricePlans = $state([]);

	// Initialize data from URL parameters or fallback
	onMount(() => {
		// Get score from URL parameter or use default
		const urlScore = $page.url.searchParams.get('score');
		if (urlScore) {
			score = parseInt(urlScore) || 50;
		}

		// Get form data from URL parameter or use default
		const urlFormData = $page.url.searchParams.get('formData');
		if (urlFormData) {
			try {
				formData = JSON.parse(decodeURIComponent(urlFormData));
			} catch (error) {
				console.warn('Could not parse form data from URL:', error);
			}
		}

		// Initialize price plans based on score
		initializePricePlans();
	});

	function initializePricePlans() {
		// Default price plans
		pricePlans = [
			{
				name: '1-MONATS PLAN',
				monthlyPrice: 1.98,
				price: 0.066,
				originalPrice: 1.98,
				perDay: '0,066€',
				popular: false,
				features: [
					'Website-Optimierung für bessere Nutzererfahrung',
					'Grundlegende SEO-Optimierung Ihrer Website',
					'Monatlicher Content',
					'Performance-Bericht'
				]
			},
			{
				name: '3-MONATS PLAN',
				monthlyPrice: 3.98,
				price: 0.133,
				originalPrice: 11.94,
				perDay: '0,133€',
				popular: true,
				features: [
					'Website-Optimierung für bessere Nutzererfahrung',
					'Grundlegende SEO-Optimierung Ihrer Website',
					'Monatlicher Content',
					'Performance-Bericht',
					'Social Media Integration',
					'Wöchentlicher Content',
					'Keyword-Optimierung',
					'Wettbewerbsanalyse'
				]
			},
			{
				name: '6-MONATS PLAN',
				monthlyPrice: 6.98,
				price: 0.233,
				originalPrice: 41.88,
				perDay: '0,233€',
				popular: false,
				features: [
					'Website-Optimierung für bessere Nutzererfahrung',
					'Grundlegende SEO-Optimierung Ihrer Website',
					'Monatlicher Content',
					'Performance-Bericht',
					'Social Media Integration',
					'Wöchentlicher Content',
					'Keyword-Optimierung',
					'Wettbewerbsanalyse',
					'Marketing-Strategie',
					'Täglicher Content',
					'SEM (Search Engine Marketing)',
					'Persönlicher Manager',
					'CRO (Conversion Rate Optimization)'
				]
			}
		];
	}

	function handlePlanSelect(plan: string, price: number) {
		console.log('Plan selected:', plan, 'Price:', price);
		// Handle plan selection - could redirect to payment or update state
	}

	function handleBackToAssessment() {
		// Redirect back to the main assessment
		goto('/');
	}
</script>

<svelte:head>
	<title>Downloads & Pricing - Digital Pusher</title>
	<meta name="description" content="Wählen Sie Ihr passendes Paket für mehr Online-Sichtbarkeit" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
	<!-- Header -->
	<header class="bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-4">
					<button
						onclick={handleBackToAssessment}
						class="flex items-center space-x-2 text-gray-600 transition-colors hover:text-primary-600"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						<span>Zurück zur Analyse</span>
					</button>
				</div>
				<div class="text-center">
					<h1 class="text-2xl font-bold text-gray-900">Downloads & Pricing</h1>
					<p class="text-gray-600">Wählen Sie Ihr passendes Paket</p>
				</div>
				<div class="w-32"></div>
				<!-- Spacer for centering -->
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Score Display -->
		<div class="mb-8 text-center">
			<div class="inline-flex items-center space-x-4 rounded-lg bg-white p-6 shadow-lg">
				<div class="text-center">
					<div class="text-3xl font-bold text-primary-600">{score}</div>
					<div class="text-sm text-gray-600">Visibility Score</div>
				</div>
				<div class="h-12 w-px bg-gray-300"></div>
				<div class="text-center">
					<div class="text-lg font-semibold text-gray-900">
						{score < 40 ? 'Kritisch' : score < 70 ? 'Verbesserungspotential' : 'Gute Basis'}
					</div>
					<div class="text-sm text-gray-600">Status</div>
				</div>
			</div>
		</div>

		<!-- Pricing Options -->
		<PricingOptions {score} {pricePlans} onPlanSelect={handlePlanSelect} {formData} />
	</main>
</div>
