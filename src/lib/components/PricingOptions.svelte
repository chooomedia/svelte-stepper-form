<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { FormData } from '$lib/schema';
	import { browser } from '$app/environment';
	import type { SuperValidated } from 'sveltekit-superforms';
	import PaymentModal from './ModalPayment.svelte';
	import { modalStore } from '$lib/stores/modalStore';

	interface Props {
		score: number;
		onPlanSelect: (plan: string, price: number) => void;
		pricePlans: Array<{
			name: string;
			monthlyPrice?: number;
			price: number;
			originalPrice: number;
			perDay: string;
			popular: boolean;
			features: string[];
		}>;
		form?: SuperValidated<FormData>;
		errors?: Record<string, string>;
	}

	let { score, onPlanSelect, pricePlans, form, errors = {} } = $props<Props>();

	// Calculated total price based on selected plan and payment type
	let totalPrice: number = $state(0);
	let monthlyPrice: number = $state(0);
	let discountedPrice: number = $state(0);
	let savingsAmount: number = $state(0);

	// Longtime calculation periods
	let longtimeYears: number = $state(5); // Longtime is calculated as 5 years
	let displayLongtimeYears: number = $state(5); // But displayed as 10 years

	// State for selected plan and payment type
	let selectedPlan = $state('3-MONATS-PLAN'); // Default to the most popular option
	let paymentType = $state('monatlich'); // Default to monthly payment

	// Modal state
	let showPaymentModal = $state(false);

	// Animation visibility states
	let showBonusBox = $state(false);
	let sectionsInView = $state({
		bonusBox: false,
		pricing: false,
		discountBanner: false
	});

	// Calculate pricing for a given plan and payment type
	function calculatePricing(planName: string, paymentMethod: string) {
		const selectedPlanData = pricePlans.find((p) => p.name === planName);
		if (!selectedPlanData) return;

		// Extract the number of months from the plan name
		const months = parseInt(planName.split('-')[0]) || 1;

		// Calculate prices with 2 decimal places precision
		const pricePerDay = selectedPlanData.price;
		const days = months * 30;

		// Monthly price (base calculation)
		monthlyPrice = Math.round(pricePerDay * 30 * 100) / 100;

		// Total price based on payment type
		if (paymentMethod === 'monatlich') {
			totalPrice = monthlyPrice;
		} else if (paymentMethod === 'einmalig') {
			// Calculate one-time payment with 8% discount
			const fullPrice = Math.round(pricePerDay * days * 100) / 100;
			const discount = Math.round(fullPrice * 0.08 * 100) / 100;
			discountedPrice = Math.round((fullPrice - discount) * 100) / 100;
			totalPrice = discountedPrice;
			savingsAmount = discount;
		} else if (paymentMethod === 'longtime') {
			// Calculate longtime value (5 years calculation) with 20% discount
			const fullPrice = (Math.round(pricePerDay * days * 100) / 100) * longtimeYears;
			const discount = Math.round(fullPrice * 0.2 * 100) / 100;
			discountedPrice = Math.round((fullPrice - discount) * 100) / 100;
			totalPrice = discountedPrice;
			savingsAmount = discount;
		}
	}

	function handlePlanChange(plan: string) {
		selectedPlan = plan;
		calculatePricing(plan, paymentType);
		onPlanSelect(plan, totalPrice);
	}

	function handlePaymentTypeChange(type: string) {
		paymentType = type;
		calculatePricing(selectedPlan, type);
		onPlanSelect(selectedPlan, totalPrice);
	}

	// Function to open the payment modal
	function openPaymentModal() {
		modalStore.open('payment', {
			selectedPlan,
			paymentType,
			totalPrice,
			form,
			errors
		});
	}

	// Function to close the payment modal
	function closePaymentModal() {
		modalStore.close();
	}

	// Function to process the payment submission
	function handlePaymentSubmit() {
		console.log('Payment submitted for', selectedPlan, 'with total price', totalPrice);

		// Schließt das Modal nicht automatisch, sondern überlässt das der Erfolgsanimation
		// Die erfolgreiche Zahlung wird über den modalStore kommuniziert
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

	// Intersection Observer for animations
	// Modernere Implementierung der Intersection Observer-Funktionalität
	function setupIntersectionObserver() {
		if (!browser) return;

		const observerOptions = { threshold: 0.2 };

		// Erstelle einen Observer für jede Sektion
		const observers = {
			bonusBox: new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						sectionsInView.bonusBox = true;
						observers.bonusBox.unobserve(entry.target);
					}
				});
			}, observerOptions),

			pricing: new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						sectionsInView.pricing = true;
						observers.pricing.unobserve(entry.target);
					}
				});
			}, observerOptions),

			discountBanner: new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						sectionsInView.discountBanner = true;
						observers.discountBanner.unobserve(entry.target);
					}
				});
			}, observerOptions)
		};

		// Observer-Setup leicht verzögern, um sicherzustellen, dass die DOM-Elemente existieren
		setTimeout(() => {
			const elements = {
				bonusBox: document.querySelector('.bonus-box'),
				pricing: document.querySelector('.pricing-cards'),
				discountBanner: document.querySelector('.discount-banner')
			};

			// Beobachte jedes Element, wenn es existiert
			Object.entries(elements).forEach(([key, element]) => {
				if (element && key in observers) {
					observers[key as keyof typeof observers].observe(element);
				}
			});
		}, 500);

		// Observer-Cleanup-Funktion zurückgeben
		return () => {
			Object.values(observers).forEach((observer) => observer.disconnect());
		};
	}

	// Start countdown on mount and setup observers
	onMount(() => {
		startCountdown();
		setupIntersectionObserver();

		// Initial plan calculation
		calculatePricing(selectedPlan, paymentType);

		// Show the discount animation after a short delay
		setTimeout(() => {
			showBonusBox = true;
		}, 1000);
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
	<div
		class="mb-6 rounded-lg bg-gradient-to-r from-red-50 to-red-100 p-4 shadow-md"
		in:fade={{ duration: 300, delay: 300 }}
	>
		<div class="flex flex-col items-center justify-between md:flex-row">
			<div class="mb-2 flex items-center space-x-2 md:mb-0">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 text-red-600"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
						clip-rule="evenodd"
					/>
				</svg>
				<div>
					<span class="text-lg font-bold text-red-600">Sonderangebot!</span>
					<span class="text-gray-700"> Rabatt läuft ab in:</span>
				</div>
			</div>
			<div class="flex space-x-2">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 font-mono text-xl font-bold text-white"
				>
					{hours.toString().padStart(2, '0')}
				</div>
				<span class="text-xl font-bold text-red-600">:</span>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 font-mono text-xl font-bold text-white"
				>
					{minutes.toString().padStart(2, '0')}
				</div>
				<span class="text-xl font-bold text-red-600">:</span>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 font-mono text-xl font-bold text-white"
				>
					{seconds.toString().padStart(2, '0')}
				</div>
			</div>
		</div>
		<div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
			<div
				class="h-full rounded-full bg-red-500 transition-all duration-1000"
				style="width: {((60 - minutes) / 60) * 100}%"
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
						class="flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white"
					>
						✓
					</div>
					<p class="ml-3 text-sm text-blue-100">Individuell auf Dein Unternehmen zugeschnitten</p>
				</div>
				<div class="mt-2 flex items-center">
					<div
						class="flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white"
					>
						✓
					</div>
					<p class="ml-3 text-sm text-blue-100">SEO-optimiert für mehr Sichtbarkeit</p>
				</div>
				<div class="mt-2 flex items-center">
					<div
						class="flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white"
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
					<p class="text-lg font-semibold text-white">Wert: 89€</p>
					<p class="text-xs text-blue-300">Nur für begrenzte Zeit</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Payment Type Toggle -->
	<div class="mb-8">
		<div class="flex flex-col items-center justify-center">
			<h4 class="mb-3 text-lg font-semibold text-gray-700">Wähle Deine Zahlungsoption:</h4>
			<div class="join rounded-lg border border-gray-200 shadow-md">
				<button
					class={`btn join-item ${paymentType === 'monatlich' ? 'btn-primary' : 'btn-ghost'}`}
					onclick={() => handlePaymentTypeChange('monatlich')}
					type="button"
				>
					Monatlich
				</button>
				<button
					class={`btn join-item ${paymentType === 'einmalig' ? 'btn-primary' : 'btn-ghost'}`}
					onclick={() => handlePaymentTypeChange('einmalig')}
					type="button"
				>
					Einmalig (-8%)
				</button>
				<button
					class={`btn join-item hidden md:block lg:block ${paymentType === 'longtime' ? 'btn-primary' : 'btn-ghost'} relative`}
					onclick={() => handlePaymentTypeChange('longtime')}
					type="button"
				>
					<span>Longtime (-20%)</span>
					{#if paymentType !== 'longtime'}
						<span
							class="absolute -right-1 -top-1 flex h-5 w-5 rotate-[12deg] animate-pulse items-center justify-center rounded-full bg-red-500 text-[7px] text-white"
						>
							HOT
						</span>
					{/if}
				</button>
			</div>
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
				class="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg {selectedPlan ===
				plan.name
					? 'ring-2 ring-blue-500'
					: ''}"
				onclick={() => handlePlanChange(plan.name)}
				aria-label="Plan {plan.name} auswählen"
			>
				{#if plan.popular}
					<div
						class="absolute left-0 right-0 top-0 bg-blue-500 py-1 text-center text-xs font-semibold uppercase tracking-wide text-white"
					>
						★ AM BELIEBTESTEN
					</div>
				{/if}

				<div class="p-4 lg:p-6 {plan.popular ? 'pt-8' : ''}">
					<div class="flex items-center pt-2">
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
							{paymentType === 'longtime'
								? plan.name === '1-MONATS-PLAN'
									? 'BASIS LONGTIME'
									: plan.name === '3-MONATS-PLAN'
										? 'PREMIUM LONGTIME'
										: 'BUSINESS LONGTIME'
								: plan.name}
						</label>
					</div>

					<div class="mt-4 text-right">
						{#if paymentType === 'einmalig'}
							<span class="text-sm text-gray-500 line-through"
								>{(plan.originalPrice * 30 * parseInt(plan.name.split('-')[0]) * 0.92).toFixed(
									2
								)}€</span
							>
						{:else if paymentType === 'monatlich'}
							<span class="text-sm text-gray-500 line-through"
								>{plan.originalPrice.toFixed(2)}€</span
							>
						{/if}

						<span class="ml-1 text-3xl font-bold text-gray-900">
							{paymentType === 'monatlich'
								? plan.price.toFixed(2)
								: paymentType === 'einmalig'
									? (plan.price * 30 * parseInt(plan.name.split('-')[0]) * 0.92).toFixed(2)
									: (
											plan.price *
											30 *
											parseInt(plan.name.split('-')[0]) *
											longtimeYears *
											0.8
										).toFixed(2)}€
						</span>
						<span class="text-sm text-gray-500">
							{paymentType === 'monatlich'
								? plan.perDay
								: paymentType === 'einmalig'
									? 'einmalig'
									: 'longtime'}
						</span>
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
						{#if paymentType === 'einmalig'}
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
								<span class="text-sm font-semibold text-gray-700">8% Rabatt auf Gesamtpreis</span>
							</li>
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
								<span class="text-sm font-semibold text-gray-700">Keine monatlichen Gebühren</span>
							</li>
						{:else if paymentType === 'longtime'}
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
								<span class="text-sm font-semibold text-gray-700"
									>{displayLongtimeYears} Jahre Zugang</span
								>
							</li>
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
								<span class="text-sm font-semibold text-gray-700">Massiver 20% Rabatt</span>
							</li>
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
								<span class="text-sm font-semibold text-indigo-600">Alle zukünftigen Updates</span>
							</li>
						{/if}
					</ul>

					{#if paymentType === 'longtime'}
						{@const planMonths = parseInt(plan.name.split('-')[0]) || 1}
						{@const planDays = planMonths * 30}
						{@const fullPrice =
							paymentType === 'einmalig'
								? plan.price * planDays
								: paymentType === 'longtime'
									? plan.price * planDays * 5
									: 0}
						{@const discount =
							paymentType === 'einmalig'
								? fullPrice * 0.08
								: paymentType === 'longtime'
									? fullPrice * 0.2
									: 0}
						<div class="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-2">
							<p class="flex items-center text-xs font-semibold text-yellow-700">
								<svg class="mr-1 h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
										clip-rule="evenodd"
									></path>
								</svg>
								Spare <span class="mx-1 font-bold text-green-600">{discount.toFixed(2)}€</span>
								mit dieser Option!
							</p>
						</div>
					{/if}
				</div>

				{#if paymentType === 'longtime'}
					<!-- "Best Value" badge for longtime plans -->
					<div
						class="absolute -right-10 top-5 rotate-45 bg-red-600 px-10 py-1 text-center text-xs font-bold uppercase text-white shadow-md"
					>
						🔥 Hot Deal
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- CTA Button -->
	<div class="mt-8 text-center" in:fade={{ duration: 300, delay: 500 }}>
		<div class="relative">
			<button
				class="order-button relative inline-flex cursor-pointer flex-col items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl"
				onclick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					openPaymentModal();
				}}
				type="button"
			>
				<span
					class="relative inline-block transform transition-transform duration-300 group-hover:scale-105"
				>
					{paymentType === 'monatlich'
						? 'PLAN ABONNIEREN'
						: paymentType === 'einmalig'
							? 'JETZT KAUFEN'
							: 'LONGTIME ZUGANG SICHERN'} - {totalPrice.toFixed(2)}€
				</span>

				{#if paymentType === 'einmalig' && savingsAmount > 0}
					<span class="block text-sm font-normal">Du sparst {savingsAmount.toFixed(2)}€</span>
				{:else if paymentType === 'monatlich' && savingsAmount > 0}
					<span class="block text-sm font-normal">Du sparst {savingsAmount.toFixed(2)}€!</span>
				{:else if paymentType === 'longtime' && savingsAmount > 0}
					<span class="block text-sm font-normal">Du sparst {savingsAmount.toFixed(2)}€</span>
				{/if}
			</button>
		</div>
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
	<div
		class="mb-8 mt-6 flex flex-wrap justify-center gap-4"
		in:fade={{ duration: 300, delay: 700 }}
	>
		<img src="/visa.svg" alt="Visa" class="h-8" />
		<img src="/mastercard.svg" alt="Mastercard" class="h-8" />
		<img src="/maestro.svg" alt="Maestro" class="h-8" />
		<img src="/amex.svg" alt="American Express" class="h-8" />
		<img src="/paypal.svg" alt="PayPal" class="h-8" />
	</div>

	<!-- Discount Banner (animated) -->
	<div
		class="discount-banner mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl transition-all duration-700"
		class:opacity-0={!sectionsInView.discountBanner}
		class:opacity-100={sectionsInView.discountBanner}
		class:scale-95={!sectionsInView.discountBanner}
		class:scale-100={sectionsInView.discountBanner}
	>
		<div class="relative overflow-hidden p-4">
			<!-- Animated discount percentage -->
			<div
				class="sm-top-4 absolute -right-2 -top-4 flex h-24 w-24 rotate-12 transform items-center justify-center rounded-full bg-yellow-400 transition-transform duration-700 hover:scale-110"
			>
				<div class="-rotate-12 text-center">
					<span class="relative top-1 block text-2xl font-bold text-red-400">-20%</span>
					<span class="relative -top-1 text-xs font-bold text-red-900">LONGTIME</span>
				</div>
			</div>

			<div class="flex flex-col items-center md:flex-row">
				<div class="p-2 md:w-3/4">
					<h3 class="mb-2 text-xl font-bold text-white">
						<span class="block sm:inline">Longtime-Zugang</span>
						<span class="sm:inline"> mit 20% Rabatt!</span>
					</h3>
					<p class="text-sm text-indigo-100">
						Sichere Dir <span class="font-bold">JETZT</span> Deinen 5 Jahre langen Zugang zu allen Features
						und Updates! Statt monatlicher Zahlungen - einmalig investieren und dauerhaft profitieren.
					</p>
				</div>
				<div class="flex justify-center p-2 md:w-1/4 lg:mr-10">
					<button
						onclick={() => handlePaymentTypeChange('longtime')}
						class="btn btn-warning transform animate-pulse shadow-lg transition-transform duration-300 hover:scale-105"
					>
						Jetzt sichern!
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Terms -->
	<div class="mt-8 text-center text-xs text-gray-500" in:fade={{ duration: 300, delay: 800 }}>
		Indem auf „{paymentType === 'monatlich' ? 'PLAN ABONNIEREN' : 'JETZT KAUFEN'}" geklickt wird,
		werden die Allgemeinen Geschäftsbedingungen und die Datenschutzrichtlinie akzeptiert.
		{#if paymentType === 'monatlich'}
			Um Unterbrechungen zu vermeiden, erklärst Du dich damit einverstanden, dass der von Dir
			gewählte Plan {selectedPlan} automatisch zum vollen Preis für aufeinanderfolgende Verlängerungszeiträume
			verlängert wird und Dir {monthlyPrice.toFixed(2)}€ monatlich in Rechnung gestellt werden. Du
			kannst Dein Abonnement jederzeit kündigen, indem Du unser Serviceteam per E-Mail an
			abo@digitalpusher.de kontaktierst falls du mehr als einen Abo Monat ausgewählt hast.
		{:else}
			Der Gesamtbetrag von {totalPrice.toFixed(2)}€ wird einmalig abgebucht. Es entstehen keine
			weiteren Kosten oder automatischen Verlängerungen. Dein longtime-Zugang gilt für 5 Jahre.
		{/if}

		{#if paymentType === 'monatlich'}
			Ansonsten erhälst du 5 Werktage vor dem Ablauf des Abos eine E-Mail mit der Möglichkeit das
			Abo zu kündigen.
		{/if}
	</div>
</div>

<!-- Payment Modal Component -->
<PaymentModal
	showModal={$modalStore.isOpen && $modalStore.type === 'payment'}
	{selectedPlan}
	{paymentType}
	{totalPrice}
	{form}
	{errors}
	onClose={closePaymentModal}
	onSubmit={handlePaymentSubmit}
/>
