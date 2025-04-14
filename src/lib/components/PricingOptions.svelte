<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { FormData } from '$lib/schema';
	import { browser } from '$app/environment';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { ModalController, modalStore } from '$lib/components/modal';
	import { currencyStore } from '$lib/stores/currencyStore';
	import Icon from './Icon.svelte';
	import { i18n, currentLocale } from '$lib/i18n';
	import { get } from 'svelte/store';
	import {
		PaymentType,
		PlanType,
		getDiscountPercentage,
		getPaymentOptions
	} from '$lib/types/plans';
	import Countdown from '$lib/components/Countdown.svelte';

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

	let translations = get(i18n) || {};
	translations.bonusBox = translations.bonusBox || { benefits: [] };
	translations.planLabels = translations.planLabels || { longTimeSuffix: {} };

	// Calculated total price based on selected plan and payment type
	let totalPrice: number = $state(0);
	let monthlyPrice: number = $state(0);
	let discountedPrice: number = $state(0);
	let savingsAmount: number = $state(0);

	// Longtime calculation periods
	let longtimeYears: number = $state(5); // Longtime is calculated as 5 years
	let displayLongtimeYears: number = $state(5); // But displayed as 10 years

	// State for selected plan and payment type using enums
	let selectedPlan = $state<PlanType>(PlanType.THREE_MONTH); // Default to most popular
	let paymentType = $state<PaymentType>(PaymentType.MONTHLY); // Default to monthly payment

	// Animation visibility states
	let showBonusBox = $state(false);
	let sectionsInView = $state({
		bonusBox: false,
		pricing: false,
		discountBanner: false
	});

	const paymentMethods = [
		{ name: 'Visa', icon: '/visa.svg', alt: 'Visa' },
		{ name: 'Maestro', icon: '/maestro.svg', alt: 'Maestro' },
		{ name: 'MasterCard', icon: '/mastercard.svg', alt: 'MasterCard' },
		{ name: 'American Express', icon: '/amex.svg', alt: 'American Express' },
		{ name: 'PayPal', icon: '/paypal.svg', alt: 'PayPal' }
	];

	// Formatiert die Zeit für den Countdown
	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
	}

	const bonusBox = $derived($i18n.pricing.bonusBox);
	const benefits = $derived(Object.values(bonusBox.benefits));
	const discountDuration = 3600;

	// Payment options array for iteration in the template
	const paymentOptions = $derived(Object.values(getPaymentOptions()));

	// Calculate pricing for a given plan and payment type
	function calculatePricing(planName: PlanType, payMethod: PaymentType) {
		const selectedPlanData = pricePlans.find((p) => p.name === planName);
		if (!selectedPlanData) return;

		// Extrahiere die Anzahl der Monate aus dem Plannamen
		const months = parseInt(planName.split('-')[0]) || 1;

		// Berechne Preise mit 2 Dezimalstellen Genauigkeit
		const pricePerDay = selectedPlanData.price;
		const days = months * 30;

		// Monatlicher Preis (Grundberechnung)
		monthlyPrice = Math.round(pricePerDay * 30 * 100) / 100;

		// Schweizer Anpassungen für die Preise
		const currency = $currencyStore;
		const isSwissFranc = currency === 'CHF';

		// Währungsumrechnung falls notwendig
		let currencyMultiplier = 1;
		if (isSwissFranc) {
			// Beispiel Umrechnungskurs von EUR zu CHF
			currencyMultiplier = 1.07; // Aktuellen Kurs verwenden
		}

		// Gesamtpreis basierend auf Zahlungsart und Währung
		if (payMethod === 'monatlich') {
			totalPrice = monthlyPrice * currencyMultiplier;
			savingsAmount = 0;
		} else {
			// Holen Sie sich den entsprechenden Rabatt-Prozentsatz
			const discountPercent = getDiscountPercentage(payMethod) / 100;

			if (payMethod === 'einmalig') {
				// Berechne Einmalzahlung mit entsprechendem Rabatt
				const fullPrice = (Math.round(pricePerDay * days * 100) / 100) * currencyMultiplier;
				const discount = Math.round(fullPrice * discountPercent * 100) / 100;
				discountedPrice = Math.round((fullPrice - discount) * 100) / 100;
				totalPrice = discountedPrice;
				savingsAmount = discount;
			} else if (payMethod === 'longtime') {
				// Berechne Longtime-Wert mit entsprechendem Rabatt
				const fullPrice =
					(Math.round(pricePerDay * days * 100) / 100) * longtimeYears * currencyMultiplier;
				const discount = Math.round(fullPrice * discountPercent * 100) / 100;
				discountedPrice = Math.round((fullPrice - discount) * 100) / 100;
				totalPrice = discountedPrice;
				savingsAmount = discount;
			}
		}
	}

	function handlePlanChange(plan: PlanType) {
		selectedPlan = plan;
		calculatePricing(plan, paymentType);
		onPlanSelect(plan, totalPrice);
	}

	function handlePaymentTypeChange(type: string | PaymentType) {
		// Handle both string inputs from UI and direct PaymentType enum values
		let newPaymentType: PaymentType;

		// If it's already a PaymentType value
		if (Object.values(PaymentType).includes(type as PaymentType)) {
			newPaymentType = type as PaymentType;
		} else {
			// Map translated strings to internal PaymentType values
			switch (type) {
				case $i18n.pricing.paymentOptions.monthly:
					newPaymentType = PaymentType.MONTHLY;
					break;
				case $i18n.pricing.paymentOptions.oneTime:
					newPaymentType = PaymentType.ONE_TIME;
					break;
				case $i18n.pricing.paymentOptions.longTime:
					newPaymentType = PaymentType.LONGTIME;
					break;
				default:
					// Fallback
					newPaymentType = PaymentType.MONTHLY;
			}
		}

		paymentType = newPaymentType;
		calculatePricing(selectedPlan, paymentType);
		onPlanSelect(selectedPlan, totalPrice);
	}

	// Function to open the payment modal
	function openPaymentModal() {
		// Ensure totalPrice is a number
		const numericPrice =
			typeof totalPrice === 'number' ? totalPrice : parseFloat(totalPrice.toString()) || 0;

		modalStore.open('payment', {
			selectedPlan,
			paymentType,
			totalPrice: numericPrice,
			form,
			errors,
			redirectUrl: '/dashboard'
		});
	}

	// Handle success callback from payment process
	function handlePaymentSuccess(details: any) {
		console.log(
			'Payment successful for',
			selectedPlan,
			'with total price',
			totalPrice,
			'details:',
			details
		);
		// Additional processing after successful payment can go here
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
	function setupIntersectionObserver() {
		if (!browser) return;

		const observerOptions = { threshold: 0.2 };

		// Create an observer for each section
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

		// Delay observer setup slightly to ensure DOM elements exist
		setTimeout(() => {
			const elements = {
				bonusBox: document.querySelector('.bonus-box'),
				pricing: document.querySelector('.pricing-cards'),
				discountBanner: document.querySelector('.discount-banner')
			};

			// Observe each element if it exists
			Object.entries(elements).forEach(([key, element]) => {
				if (element && key in observers) {
					observers[key as keyof typeof observers].observe(element);
				}
			});
		}, 500);

		// Return cleanup function
		return () => {
			Object.values(observers).forEach((observer) => observer.disconnect());
		};
	}

	// Enhance the plan prices with localized currency
	function getLocalizedPricePlans() {
		return pricePlans.map((plan) => ({
			...plan,
			price: currencyStore.convertPrice(plan.price),
			originalPrice: currencyStore.convertPrice(plan.originalPrice),
			formattedPrice: currencyStore.formatPrice(plan.price),
			formattedOriginalPrice: currencyStore.formatPrice(plan.originalPrice),
			// Add translated features if needed
			features: plan.features.map((feature) => {
				// Try to find a translation for this feature
				const featureKey = Object.entries($i18n.pricing.features || {}).find(
					([_, value]) => value === feature
				)?.[0];

				// If found, use the translation, otherwise keep the original
				return featureKey && $i18n.pricing.features[featureKey]
					? $i18n.pricing.features[featureKey]
					: feature;
			})
		}));
	}

	function formatSwissFrancPrice(price: number): string {
		// Formatiere gemäß Schweizer Standards (z.B. CHF 199'950.00)
		return `CHF ${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;
	}

	const translationLabels = $derived($i18n.pricing || {});
	const localizedPlans = $derived(getLocalizedPricePlans());

	// Use $effect rune for side effects
	$effect(() => {
		if ($currentLocale) {
			// Do any additional side effects when language changes
			console.log(`Language changed to: ${$currentLocale}`);
		}
	});

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

{#key $currentLocale}
	<div class="pricing-options mt-8">
		<!-- Header -->
		<div class="mb-6 text-center">
			<h3 class="text-2xl font-bold text-gray-900" in:fade={{ duration: 300 }}>
				{$i18n.pricing.header.title}
			</h3>
			<p class="mt-2 text-gray-600" in:fade={{ duration: 300, delay: 200 }}>
				{@html translationLabels.header?.subtitle?.replace('{score}', score.toString()) || ''}
			</p>
		</div>

		<!-- Countdown Timer -->
		<div class="mb-6 rounded-lg bg-gradient-to-r from-red-50 to-red-100 p-4 shadow-md">
			<div class="flex flex-col items-center justify-between md:flex-row">
				<div class="mb-2 flex items-center space-x-2 md:mb-0">
					<span class="text-red-600">
						<Icon name="clock" size={24} stroke="currentColor" strokeWidth="2" fill="none" />
					</span>
					<div>
						<span class="text-lg font-bold text-red-600">{$i18n.pricing.countdown.title}</span>
						<span class="text-gray-700">{$i18n.pricing.countdown.subtitle}</span>
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

			<!-- Fortschrittsbalken -->
			<Countdown
				duration={discountDuration}
				textClass="hidden"
				showProgressBar={true}
				progressBarColor="bg-red-500"
			/>
		</div>

		<!-- Bonus-Box für Aktionsangebot -->
		<div
			class="bonus-box mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-secondary-200 to-secondary-700 shadow-xl"
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
						{$i18n.pricing.bonusBox.tag}
					</div>
					<h3 class="mt-3 text-2xl font-bold text-white">{$i18n.pricing.bonusBox.title}</h3>
					<p class="mt-2 text-blue-100">
						{$i18n.pricing.bonusBox.description}
					</p>
					<div class="mt-4 space-y-2">
						{#each benefits as benefit}
							<div class="mt-2 flex items-center">
								<div
									class="flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-lg font-bold text-secondary"
								>
									✓
								</div>
								<p class="text-md ml-3 text-primary-100">
									{benefit}
								</p>
							</div>
						{/each}
					</div>
				</div>
				<div class="flex items-center justify-center bg-secondary-500 p-6 md:w-1/3">
					<div class="text-center">
						<div
							class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary-600 text-secondary"
						>
							<Icon
								name="document"
								size={50}
								stroke="currentColor"
								strokeWidth="2"
								fill="none"
								viewBox="0 0 24 24"
							/>
						</div>
						<p class="text-lg font-semibold text-white">{$i18n.pricing.bonusBox.value}</p>
						<p class="text-xs text-primary-300">{$i18n.pricing.bonusBox.limited}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Payment Type Toggle -->
		<div class="mb-8">
			<div class="flex flex-col items-center justify-center">
				<h4 class="mb-3 text-lg font-semibold text-gray-700">
					{$i18n.pricing.paymentOptions.title}
				</h4>
				<div class="join rounded-lg border border-gray-200 shadow-md">
					<button
						class={`btn join-item ${paymentType === PaymentType.MONTHLY ? 'btn-primary' : 'btn-ghost'}`}
						onclick={() => handlePaymentTypeChange(PaymentType.MONTHLY)}
						type="button"
					>
						{$i18n.pricing.paymentOptions.monthly}
					</button>

					<button
						class={`btn join-item ${paymentType === PaymentType.ONE_TIME ? 'btn-primary' : 'btn-ghost'}`}
						onclick={() => handlePaymentTypeChange(PaymentType.ONE_TIME)}
						type="button"
					>
						{$i18n.pricing.paymentOptions.oneTime}
					</button>

					<button
						class={`btn join-item hidden md:block lg:block ${paymentType === PaymentType.LONGTIME ? 'btn-primary' : 'btn-ghost'} relative`}
						onclick={() => handlePaymentTypeChange(PaymentType.LONGTIME)}
						type="button"
					>
						<span>{$i18n.pricing.paymentOptions.longTime}</span>
						{#if paymentType !== PaymentType.LONGTIME}
							<span
								class="absolute -right-1 -top-1 flex h-5 w-5 rotate-[12deg] animate-pulse items-center justify-center rounded-full bg-red-500 text-[7px] text-white"
							>
								{$i18n.pricing.paymentOptions.hotLabel}
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
			{#each localizedPlans as plan}
				<div
					class="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg {selectedPlan ===
					plan.name
						? 'ring-2 ring-primary-500'
						: ''}"
					onclick={() => handlePlanChange(plan.name)}
					aria-label="Plan {plan.name} auswählen"
				>
					{#if plan.popular}
						<div
							class="absolute left-0 right-0 top-0 bg-primary-600 py-1 text-center text-xs font-semibold uppercase tracking-wide text-white"
						>
							{$i18n.pricing.planLabels.popular}
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
								class="h-4 w-4 appearance-none rounded-full border-2 border-gray-300 checked:border-white checked:bg-primary-600 checked:ring-2 checked:ring-primary-600"
								onchange={() => handlePlanChange(plan.name)}
							/>
							<label for={plan.name} class="ml-2 text-lg font-semibold text-gray-900">
								{paymentType === 'longtime' && $i18n.pricing.planLabels.longTimeSuffix[plan.name]
									? $i18n.pricing.planLabels.longTimeSuffix[plan.name]
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
								{$currencyStore === 'CHF'
									? formatSwissFrancPrice(
											paymentType === 'monatlich'
												? plan.price
												: paymentType === 'einmalig'
													? plan.price * 30 * parseInt(plan.name.split('-')[0]) * 0.92
													: plan.price *
														30 *
														parseInt(plan.name.split('-')[0]) *
														longtimeYears *
														0.8
										)
									: currencyStore.formatPrice(
											paymentType === 'monatlich'
												? plan.price
												: paymentType === 'einmalig'
													? plan.price * 30 * parseInt(plan.name.split('-')[0]) * 0.92
													: plan.price *
														30 *
														parseInt(plan.name.split('-')[0]) *
														longtimeYears *
														0.8
										)}
							</span>
							<span class="text-sm text-gray-500">
								{paymentType === 'monatlich'
									? plan.perDay.split(' ')[0]
									: paymentType === 'einmalig'
										? $i18n.pricing.paymentOptions.oneTime.split(' ')[0]
										: $i18n.pricing.paymentOptions.longTime.split(' ')[0]}
							</span>
						</div>

						<ul class="mt-6 space-y-2">
							{#each plan.features as feature}
								<li class="flex items-start gap-1 text-green-500">
									<Icon name="checkCircle" size={24} stroke="none" />
									<span class="text-sm text-gray-700">{feature}</span>
								</li>
							{/each}
							{#if paymentType === 'einmalig'}
								<li class="flex items-start text-primary">
									<Icon name="checkCircle" size={24} stroke="none" />
									<span class="text-sm font-semibold text-gray-700"
										>{$i18n.pricing.additionalBenefits.oneTime[0]}</span
									>
								</li>
								<li class="flex items-start text-primary">
									<Icon name="checkCircle" size={24} stroke="none" />
									<span class="text-sm font-semibold text-gray-700"
										>{$i18n.pricing.additionalBenefits.oneTime[1]}</span
									>
								</li>
							{:else if paymentType === 'longtime'}
								<li class="flex items-start">
									<span class="text-primary">
										<Icon name="checkCircle" size={24} stroke="none" />
									</span>
									<span class="text-sm font-semibold text-gray-700"
										>{displayLongtimeYears}
										{@html $i18n.pricing.additionalBenefits.longTime[0]}</span
									>
								</li>
								<li class="flex items-start">
									<span class="text-primary">
										<Icon name="checkCircle" size={24} stroke="none" />
									</span>
									<span class="text-sm font-semibold text-gray-700"
										>{$i18n.pricing.additionalBenefits.longTime[1]}</span
									>
								</li>
								<li class="flex items-start">
									<span class="text-primary">
										<Icon name="checkCircle" size={24} stroke="none" />
									</span>
									<span class="text-sm font-semibold text-primary-600"
										>{$i18n.pricing.additionalBenefits.longTime[2]}</span
									>
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
									<span class=" text-yellow-500">
										<Icon name="alert" size={24} stroke="none" />
									</span>
									{$i18n.pricing.additionalBenefits.savings}
									<span class="mx-1 font-bold text-green-600">{discount.toFixed(2)}€</span>
									{$i18n.pricing.additionalBenefits.savingsOption}
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
					class="order-button relative inline-flex cursor-pointer flex-col items-center justify-center rounded-lg px-8 py-4 text-lg font-bold shadow-lg transition-all duration-300
            {!selectedPlan
						? 'cursor-not-allowed bg-gray-300 text-gray-500'
						: 'bg-primary-600 text-secondary hover:bg-primary-700 hover:shadow-xl'}"
					onclick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						if (selectedPlan) {
							openPaymentModal();
						}
					}}
					type="button"
					disabled={!selectedPlan}
				>
					<span
						class="relative inline-block transform transition-transform duration-300
                {selectedPlan ? 'group-hover:scale-105' : ''}"
					>
						{#if selectedPlan}
							{paymentType === 'monatlich'
								? $i18n.pricing.ctaButton.monthly
								: paymentType === 'einmalig'
									? $i18n.pricing.ctaButton.oneTime
									: $i18n.pricing.ctaButton.longTime} - {totalPrice.toFixed(2)}€

							{#if paymentType === 'einmalig' && savingsAmount > 0}
								<span class="block text-sm font-normal">
									{$i18n.pricing.savings}
									{savingsAmount.toFixed(2)}€
								</span>
							{:else if paymentType === 'monatlich' && savingsAmount > 0}
								<span class="block text-sm font-normal">
									{$i18n.pricing.savings}
									{savingsAmount.toFixed(2)}€!
								</span>
							{:else if paymentType === 'longtime' && savingsAmount > 0}
								<span class="block text-sm font-normal">
									{$i18n.pricing.savings}
									{savingsAmount.toFixed(2)}€
								</span>
							{/if}
						{:else}
							{$i18n.pricing.ctaButton.selectPlan}
						{/if}
					</span>
				</button>
			</div>
		</div>

		<!-- Trust Badges -->
		<div
			class="mt-6 flex flex-col items-center justify-center space-y-4 text-sm text-gray-600 md:flex-row md:space-x-8 md:space-y-0"
			in:fade={{ duration: 300, delay: 600 }}
		>
			<div class="flex items-center">
				<div class="text-primary-500">
					<Icon name="lock" fill="currentColor" size={26} />
				</div>
				{$i18n.pricing.trustBadges[0]}
			</div>
			<div class="flex items-center">
				<div class="text-primary-500">
					<Icon name="plusCircle" fill="currentColor" size={26} />
				</div>
				{$i18n.pricing.trustBadges[1]}
			</div>
		</div>

		<!-- Payment Methods -->
		<div
			class="mb-8 mt-6 flex flex-wrap justify-center gap-4"
			in:fade={{ duration: 300, delay: 700 }}
		>
			{#each paymentMethods as method}
				<img src={method.icon} alt={method.name} class="h-8" title={method.name} />
			{/each}
		</div>

		<!-- Discount Banner (animated) -->
		<div
			class="discount-banner mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl transition-all duration-700"
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
						<span class="relative top-1 block text-2xl font-bold text-red-500">-20%</span>
						<span class="relative -top-1 text-xs font-bold text-red-900">LONGTIME</span>
					</div>
				</div>

				<div class="flex flex-col items-center md:flex-row">
					<div class="p-2 md:w-3/4">
						<h3 class="mb-2 text-xl font-bold text-white">
							<span class="block sm:inline">{$i18n.pricing.discountBanner.title}</span>
							<span class="sm:inline">{$i18n.pricing.discountBanner.discount}</span>
						</h3>
						<p class="text-sm text-indigo-100">
							{@html $i18n.pricing.discountBanner.description}
						</p>
					</div>
					<div class="flex justify-center p-2 md:w-1/4 lg:mr-10">
						<button
							onclick={() => handlePaymentTypeChange('longtime')}
							class="btn btn-warning transform animate-pulse shadow-lg transition-transform duration-300 hover:scale-105"
						>
							{$i18n.pricing.discountBanner.buttonText}
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Terms -->
		<div class="mt-8 text-center text-xs text-gray-500" in:fade={{ duration: 300, delay: 800 }}>
			{@html $i18n.pricing.terms.acceptance.replace(
				'{paymentType}',
				paymentType === PaymentType.MONTHLY
					? $i18n.pricing.ctaButton.monthly
					: paymentType === PaymentType.ONE_TIME
						? $i18n.pricing.ctaButton.oneTime
						: $i18n.pricing.ctaButton.longTime
			)}

			{#if paymentType === PaymentType.MONTHLY}
				{@html $i18n.pricing.terms.monthly.main
					.replace('{selectedPlan}', selectedPlan)
					.replace('{totalPrice.toFixed(2)}', totalPrice.toFixed(2))}
				{@html $i18n.pricing.terms.monthly.reminder}
			{:else if paymentType === PaymentType.ONE_TIME}
				{@html $i18n.pricing.terms.oneTime.replace(
					'{totalPrice.toFixed(2)}',
					totalPrice.toFixed(2)
				)}
			{:else}
				{@html $i18n.pricing.terms.oneTime.replace(
					'{totalPrice.toFixed(2)}',
					totalPrice.toFixed(2)
				)}
			{/if}
		</div>
	</div>
{/key}

<!-- Neue Modal-Controller Komponente für die Zahlungsabwicklung -->
<ModalController onSuccess={handlePaymentSuccess} />
