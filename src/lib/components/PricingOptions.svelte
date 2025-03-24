<!-- src/lib/components/PricingOptions.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { FormData } from '$lib/schema';

	interface Props {
		score: number;
		formData: FormData;
		onPlanSelect: (plan: string, price: number) => void;
	}

	let { score, formData, onPlanSelect } = $props<Props>();

	// State for selected plan
	let selectedPlan = $state('3-MONATS-PLAN'); // Default to the most popular option

	// Price plans based on score range
	const pricePlans = [
		{
			name: '1-MONATS-PLAN',
			originalPrice: '€2.00',
			price: '€0.99',
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
			originalPrice: '€1.12',
			price: '€0.56',
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
			originalPrice: '€0.88',
			price: '€0.44',
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

	// Handle plan selection
	function handlePlanChange(plan: string) {
		selectedPlan = plan;
		const selectedPlanData = pricePlans.find((p) => p.name === plan);
		if (selectedPlanData) {
			const price = parseFloat(selectedPlanData.price.replace('€', ''));
			onPlanSelect(plan, price);
		}
	}

	// Timer for discount
	let hours = $state(0);
	let minutes = $state(0);
	let seconds = $state(0);

	// Init countdown timer
	function startCountdown() {
		// Set timer to 1 hour from now
		const endTime = new Date();
		endTime.setHours(endTime.getHours() + 1);

		// Update timer every second
		const interval = setInterval(() => {
			const now = new Date();
			const diff = endTime.getTime() - now.getTime();

			if (diff <= 0) {
				clearInterval(interval);
				return;
			}

			// Calculate remaining time
			hours = Math.floor(diff / (1000 * 60 * 60));
			minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			seconds = Math.floor((diff % (1000 * 60)) / 1000);
		}, 1000);

		// Initial calculation
		const now = new Date();
		const diff = endTime.getTime() - now.getTime();
		hours = Math.floor(diff / (1000 * 60 * 60));
		minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		seconds = Math.floor((diff % (1000 * 60)) / 1000);

		return () => clearInterval(interval);
	}

	// Start countdown on mount
	onMount(() => {
		startCountdown();
	});
</script>

<div class="pricing-options mt-8">
	<!-- Header -->
	<div class="mb-6 text-center">
		<h3 class="text-2xl font-bold text-gray-900" in:fade={{ duration: 300 }}>
			Wähle den perfekten Plan für Deine digitale Transformation
		</h3>
		<p class="mt-2 text-gray-600" in:fade={{ duration: 300, delay: 200 }}>
			Basierend auf Deinem Score von {score} empfehlen wir Dir einen maßgeschneiderten Ansatz
		</p>
	</div>

	<!-- Countdown Timer -->
	<div class="mb-6 rounded-lg bg-gray-100 p-4" in:fade={{ duration: 300, delay: 300 }}>
		<div class="flex items-center justify-between">
			<div>
				<span class="font-bold text-red-600">51% Rabatt</span>
				<span class="text-gray-700"> verfällt in</span>
			</div>
			<div class="text-xl font-bold">
				{hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds
					.toString()
					.padStart(2, '0')}
			</div>
		</div>
		<div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
			<div
				class="h-full animate-pulse rounded-full bg-red-500"
				style="width: {(minutes / 60) * 100}%"
			></div>
		</div>
	</div>

	<!-- Pricing Cards -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-3" in:fade={{ duration: 300, delay: 400 }}>
		{#each pricePlans as plan}
			<div
				class="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition hover:shadow-lg {selectedPlan ===
				plan.name
					? 'ring-2 ring-blue-500'
					: ''}"
			>
				{#if plan.popular}
					<div
						class="absolute left-0 right-0 top-0 bg-gray-200 py-1 text-center text-xs font-semibold uppercase tracking-wide"
					>
						★ AM BELIEBTESTEN
					</div>
				{/if}

				<div class="p-6 {plan.popular ? 'pt-8' : ''}">
					<div class="flex items-center">
						<input
							type="radio"
							id={plan.name}
							name="pricing-plan"
							value={plan.name}
							checked={selectedPlan === plan.name}
							class="h-4 w-4 text-blue-600"
							on:change={() => handlePlanChange(plan.name)}
						/>
						<label for={plan.name} class="ml-2 text-lg font-semibold text-gray-900">
							{plan.name}
						</label>
					</div>

					<div class="mt-4 text-right">
						<span class="text-sm text-gray-500 line-through">{plan.originalPrice}</span>
						<span class="ml-1 text-3xl font-bold text-gray-900">{plan.price}</span>
						<span class="text-sm text-gray-500">{plan.perDay}</span>
					</div>

					<ul class="mt-6 space-y-2">
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

	<!-- CTA Button -->
	<div class="mt-8 text-center" in:fade={{ duration: 300, delay: 500 }}>
		<button
			class="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
		>
			PLAN BESTELLEN
		</button>
	</div>

	<!-- Trust Badges -->
	<div
		class="mt-6 flex flex-col items-center justify-center space-y-4 text-sm text-gray-600 md:flex-row md:space-x-8 md:space-y-0"
		in:fade={{ duration: 300, delay: 600 }}
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

	<!-- Payment Methods -->
	<div class="mt-6 flex flex-wrap justify-center gap-4" in:fade={{ duration: 300, delay: 700 }}>
		<img src="/visa.svg" alt="Visa" class="h-8" />
		<img src="/mastercard.svg" alt="Mastercard" class="h-8" />
		<img src="/amex.svg" alt="American Express" class="h-8" />
		<img src="/paypal.svg" alt="PayPal" class="h-8" />
	</div>

	<!-- Terms -->
	<div class="mt-8 text-center text-xs text-gray-500" in:fade={{ duration: 300, delay: 800 }}>
		Indem Sie auf „PLAN BESTELLEN" klicken, akzeptieren Sie die Allgemeinen Geschäftsbedingungen und
		die Datenschutzrichtlinie. Um Unterbrechungen zu vermeiden, erklären Sie sich damit
		einverstanden, dass der von Ihnen gewählte Plan automatisch zum vollen Preis für
		aufeinanderfolgende Verlängerungszeiträume verlängert wird und Ihnen €124.99 jeden 3 Monate in
		Rechnung gestellt wird. Sie können Ihr Abonnement kündigen, indem Sie unser Kundendienstteam per
		E-Mail an support@digitalpusher.com kontaktieren.
	</div>
</div>
