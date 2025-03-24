<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import type { FormData } from '$lib/schema';
	import { browser } from '$app/environment';
	import type { SuperValidated } from 'sveltekit-superforms';
	import PaymentModal from './PaymentModal.svelte';

	interface Props {
		score: number;
		formData: FormData;
		onPlanSelect: (plan: string, price: number) => void;
		pricePlans: Array<{
			name: string;
			price: number;
			originalPrice: number;
			perDay: string;
			popular: boolean;
			features: string[];
		}>;
		form?: SuperValidated<FormData>;
		errors?: Record<string, string>;
	}

	let { score, formData, onPlanSelect, pricePlans, form, errors = {} } = $props<Props>();
	let totalPrice: number = 0;

	// State for selected plan and payment type
	let selectedPlan = $state('3-MONATS-PLAN'); // Default to the most popular option
	let paymentType = $state('monatlich'); // Default to monthly payment

	// Modal state
	let showPaymentModal = $state(false);

	// Animation visibility states
	let showBonusBox = $state(false);
	let sectionsInView = $state({
		bonusBox: false,
		pricing: false
	});

	function handlePlanChange(plan: string) {
		selectedPlan = plan;
		const selectedPlanData = pricePlans.find((p) => p.name === plan);
		if (selectedPlanData) {
			// Extrahiere die Anzahl der Monate aus dem Plan-Namen
			const months = parseInt(plan.split('-')[0]);

			// Berechnung des Gesamtpreises mit 2 Dezimalstellen Genauigkeit
			// Verwende Math.round((x * 100)) / 100 für präzise Berechnungen mit 2 Dezimalstellen
			const pricePerDay = selectedPlanData.price;
			const days = months * 30;

			// Berechne den Preis mit 2 Dezimalstellen Genauigkeit
			totalPrice = Math.round(pricePerDay * days * 100) / 100;

			onPlanSelect(plan, totalPrice); // Funktion wird aufgerufen
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

	// Funktion zum Öffnen des Zahlungsmodals
	function openPaymentModal() {
		showPaymentModal = true;
	}

	// Funktion zum Schließen des Zahlungsmodals
	function closePaymentModal() {
		showPaymentModal = false;
	}

	// Funktion zum Verarbeiten der Zahlungsabsendung
	function handlePaymentSubmit() {
		// Hier könnte die weitere Verarbeitung nach Zahlungsabschluss erfolgen
		// z.B. Weiterleitung zur Dankesseite oder andere Aktionen
		console.log('Payment submitted for', selectedPlan, 'with total price', totalPrice);

		// Modal nach erfolgreicher Zahlung schließen
		showPaymentModal = false;
	}

	// Intersection Observer für Animationen
	function setupIntersectionObserver() {
		if (!browser) return;

		const bonusBoxObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						sectionsInView.bonusBox = true;
						bonusBoxObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.3 }
		);

		const pricingObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						sectionsInView.pricing = true;
						pricingObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.2 }
		);

		// DOM-Elemente beobachten, sobald sie verfügbar sind
		setTimeout(() => {
			const bonusBoxElement = document.querySelector('.bonus-box');
			const pricingElement = document.querySelector('.pricing-cards');

			if (bonusBoxElement) bonusBoxObserver.observe(bonusBoxElement);
			if (pricingElement) pricingObserver.observe(pricingElement);
		}, 500);
	}

	// Start countdown on mount and setup observers
	onMount(() => {
		startCountdown();
		setupIntersectionObserver();

		// Initial plan berechnen
		handlePlanChange(selectedPlan);
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

	<!-- Bonus-Box für Aktionsangebot -->
	<div
		class="bonus-box mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl"
		class:opacity-0={!sectionsInView.bonusBox}
		class:opacity-100={sectionsInView.bonusBox}
		class:translate-y-0={sectionsInView.bonusBox}
		class:translate-y-8={!sectionsInView.bonusBox}
		style="transition: opacity 0.7s ease-out, transform 0.5s ease-out;"
	>
		<div class="flex flex-col md:flex-row">
			<div class="p-6 md:w-2/3">
				<div
					class="inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-gray-900"
				>
					EXKLUSIV-BONUS
				</div>
				<h3 class="mt-3 text-2xl font-bold text-white">Hochwertiger Blogartikel GRATIS</h3>
				<p class="mt-2 text-blue-100">
					Bei Buchung innerhalb der Aktionszeit erhältst Du einen maßgeschneiderten, SEO-optimierten
					Blogartikel für Dein Unternehmen – perfekt angepasst, um Deine Reichweite sofort zu
					steigern!
				</p>
				<div class="mt-4 flex items-center">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white"
					>
						✓
					</div>
					<p class="ml-3 text-sm text-blue-100">Individuell auf Dein Unternehmen zugeschnitten</p>
				</div>
				<div class="mt-2 flex items-center">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white"
					>
						✓
					</div>
					<p class="ml-3 text-sm text-blue-100">SEO-optimiert für mehr Sichtbarkeit</p>
				</div>
				<div class="mt-2 flex items-center">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white"
					>
						✓
					</div>
					<p class="ml-3 text-sm text-blue-100">Sofortige Steigerung Deiner Online-Präsenz</p>
				</div>
			</div>
			<div class="flex items-center justify-center bg-blue-700 p-6 md:w-1/3">
				<div class="text-center">
					<div
						class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-600"
					>
						<svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
							></path>
						</svg>
					</div>
					<p class="text-lg font-semibold text-white">Wert: 299€</p>
					<p class="text-xs text-blue-300">Nur für begrenzte Zeit</p>
				</div>
			</div>
		</div>
	</div>

	<div class="mb-8 flex justify-center">
		<div class="join rounded-lg border border-gray-200">
			<button
				class={`btn join-item ${paymentType === 'monatlich' ? 'btn-primary' : 'btn-ghost'}`}
				onclick={() => {
					paymentType = 'monatlich';
					handlePlanChange(selectedPlan);
				}}
				type="button"
			>
				Monatlich
			</button>
			<button
				class={`btn join-item ${paymentType === 'einmalig' ? 'btn-primary' : 'btn-ghost'}`}
				onclick={() => {
					paymentType = 'einmalig';
					handlePlanChange(selectedPlan);
				}}
				type="button"
			>
				Einmalig (-8%)
			</button>
		</div>
	</div>

	<!-- Pricing Cards -->
	<div
		class="pricing-cards grid grid-cols-1 gap-6 md:grid-cols-3"
		class:opacity-0={!sectionsInView.pricing}
		class:opacity-100={sectionsInView.pricing}
		class:translate-y-0={sectionsInView.pricing}
		class:translate-y-8={!sectionsInView.pricing}
		style="transition: opacity 0.7s ease-out, transform 0.5s ease-out; transition-delay: 0.2s;"
	>
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
							onchange={() => handlePlanChange(plan.name)}
						/>
						<label for={plan.name} class="ml-2 text-lg font-semibold text-gray-900">
							{plan.name}
						</label>
					</div>

					<div class="mt-4 text-right">
						<span class="text-sm text-gray-500 line-through">{plan.originalPrice.toFixed(2)}€</span>
						<span class="ml-1 text-3xl font-bold text-gray-900">{plan.price.toFixed(2)}€</span>
						<span class="text-sm text-gray-500"
							>{paymentType === 'monatlich' ? plan.perDay : 'einmalig'}</span
						>
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
			class="order-button inline-block rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700"
			onclick={(e) => {
				e.preventDefault(); // Verhindert das Standardverhalten des Buttons
				e.stopPropagation(); // Verhindert Bubbling
				openPaymentModal();
			}}
			type="button"
		>
			{paymentType === 'monatlich' ? 'PLAN ABONNIEREN' : 'JETZT KAUFEN'} - {totalPrice.toFixed(2)}€
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
		<img src="/maestro.svg" alt="Maestro" class="h-8" />
		<img src="/amex.svg" alt="American Express" class="h-8" />
		<img src="/paypal.svg" alt="PayPal" class="h-8" />
	</div>

	<!-- Terms -->
	<div class="mt-8 text-center text-xs text-gray-500" in:fade={{ duration: 300, delay: 800 }}>
		Indem auf „PLAN BESTELLEN" geklickt wird, werden die Allgemeinen Geschäftsbedingungen und die
		Datenschutzrichtlinie akzeptiert. Um Unterbrechungen zu vermeiden, erklärst Du dich damit
		einverstanden, dass der von Dir gewählte Plan {selectedPlan} automatisch zum vollen Preis für aufeinanderfolgende
		Verlängerungszeiträume verlängert wird und Dir {totalPrice.toFixed(2)} € in Rechnung gestellt werden.
		Du kannst Dein Abonnement kündigen, indem Du unser Serviceteam per E-Mail an abo@digitalpusher.de
		kontaktierst falls du mehr als einen Abo Monat ausgewählt hast. Ansonsten erhälst du 5 Werktage vor
		dem Ablauf des Abos eine E-Mail mit der Möglichkeit das Abo zu kündigen.
	</div>
</div>

<!-- Payment Modal Component -->
<PaymentModal
	showModal={showPaymentModal}
	{selectedPlan}
	{paymentType}
	{totalPrice}
	{form}
	{errors}
	onClose={closePaymentModal}
	onSubmit={handlePaymentSubmit}
/>
