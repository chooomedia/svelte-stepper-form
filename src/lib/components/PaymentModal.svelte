<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormData } from '$lib/schema';

	// Utils
	import {
		generateClientReference,
		getPlanDisplayName,
		calculateTax,
		type PayPalOrderDetails,
		type TaxInfo
	} from '$lib/utils/payment';

	// Stores
	import { taxInfo } from '$lib/stores/taxStore';

	// Modal directive
	import { enhancedModal } from '$lib/directives/modal';

	// Config
	import { PAYPAL_SCRIPT_BASE } from '$lib/config';

	interface Props {
		showModal: boolean;
		selectedPlan: string;
		paymentType: 'monatlich' | 'einmalig' | 'longtime';
		totalPrice: number;
		form?: SuperValidated<FormData>;
		errors?: Record<string, string>;
		onClose: () => void;
		onSubmit: () => void;
	}

	const {
		showModal,
		selectedPlan,
		paymentType,
		totalPrice,
		form,
		errors = {},
		onClose,
		onSubmit
	} = $props<Props>();

	// State
	let paymentMethod: 'paypal' | 'betterplace' = 'paypal';
	let isProcessing = $state(false);
	let paymentSuccess = $state(false);
	let paymentError = $state('');
	let redirectUrl = $state('');
	let showBetterplace = $state(false);
	let includeDonation = $state(false);

	const totalWithDonation = $derived(() => {
		if (includeDonation) {
			return (totalPrice / 100) * 3;
		}
		return totalPrice;
	});

	// Tax calculations
	const currentTax = $derived(calculateTax(totalPrice, $taxInfo.rate));
	const currentVatText = $derived($taxInfo.vatText);

	// Special offer discount percentage based on payment type
	const discountPercentage = $derived(() => {
		switch (paymentType) {
			case 'einmalig':
				return 8;
			case 'longtime':
				return 20;
			default:
				return 0;
		}
	});

	// Animations
	const animatedDonation = tweened(0, {
		duration: 1500,
		easing: cubicInOut
	});

	// Effects
	$effect(() => {
		if (showModal) {
			resetForm();
			initPaymentFlow();
		}
	});

	// Custom close handler to show exit intent modal
	function handleClose() {
		onClose();
	}

	// Reset the form state when modal is opened
	function resetForm() {
		paymentMethod = 'paypal';
		isProcessing = false;
		paymentSuccess = false;
		paymentError = '';
		redirectUrl = '';
		includeDonation = false;
	}

	async function initPaymentFlow() {
		await loadPayPalSDK();
		renderPayPalButtons();
		loadBetterplaceProjectInfo();
	}

	async function loadBetterplaceProjectInfo() {
		try {
			// In einem realen Szenario würde hier eine API-Anfrage erfolgen
			// Hier simulieren wir nur das Ergebnis
			showBetterplace = true;
		} catch (error) {
			console.error('Betterplace project load failed:', error);
			showBetterplace = false;
		}
	}

	// PayPal Script Loading
	let paypalSDKLoaded = $state(false);

	async function loadPayPalSDK() {
		if (typeof window !== 'undefined' && typeof window.paypal !== 'undefined') {
			paypalSDKLoaded = true;
			return;
		}

		const script = document.createElement('script');
		script.src = `${PAYPAL_SCRIPT_BASE || 'https://www.paypal.com/sdk/js'}?${getPayPalConfig()}`;
		script.onload = () => {
			console.log('PayPal SDK loaded successfully');
			paypalSDKLoaded = true;
			setTimeout(() => {
				renderPayPalButtons();
			}, 300);
		};
		script.onerror = (err) => {
			console.error('Error loading PayPal SDK:', err);
			paymentError = 'Fehler beim Laden des PayPal SDKs. Bitte versuche es später erneut.';
		};
		document.head.appendChild(script);
	}

	function getPayPalConfig() {
		return new URLSearchParams({
			'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb',
			currency: 'EUR',
			intent: 'capture',
			locale: 'de_DE',
			components: ['buttons', 'hosted-fields'].join(','),
			commit: 'true' // Important: Always set to true for one-time payments
		}).toString();
	}

	// Payment Handlers
	function handlePaymentError(error: unknown) {
		console.error('Payment error:', error);
		if (error instanceof Error) {
			paymentError = error.message;
		} else {
			paymentError = 'Die Zahlung konnte nicht verarbeitet werden. Bitte versuche es erneut.';
		}
		isProcessing = false;
	}

	function handlePaymentMethodChange(method: string) {
		paymentMethod = method;

		// Show donation info automatically when selecting Betterplace
		if (method === 'betterplace') {
			setTimeout(() => {
				showBetterplace = true;
			}, 300);
		} else {
			showBetterplace = false;
		}
	}

	// Optimized PayPal Button Rendering
	function renderPayPalButtons() {
		if (!paypalSDKLoaded || typeof window === 'undefined' || typeof window.paypal === 'undefined') {
			console.warn('PayPal SDK not loaded yet');
			return;
		}

		const container = document.getElementById('paypal-button-container');
		if (!container) {
			console.warn('PayPal button container not found');
			return;
		}

		// Clear previous buttons if any
		container.innerHTML = '';

		// Log for debugging
		console.log('Rendering PayPal buttons for payment type:', paymentType);

		try {
			window.paypal
				.Buttons({
					// Use createOrder for all payment types for consistency
					createOrder: async (data, actions) => {
						// Start processing animation
						isProcessing = true;

						// Generate a client reference ID for tracking
						const reference = generateClientReference();
						console.log('Creating order with reference:', reference);

						// This creates an order with PayPal
						return actions.order.create({
							purchase_units: [
								{
									amount: {
										value: totalWithDonation,
										currency_code: 'EUR'
									},
									description: getPlanDisplayName(selectedPlan, paymentType),
									custom_id: reference
								}
							],
							application_context: {
								shipping_preference: 'NO_SHIPPING'
							}
						});
					},
					onApprove: async (data, actions) => {
						try {
							console.log('Payment approved:', data);
							isProcessing = true;

							// Capture the funds from the transaction
							const details = await actions.order.capture();
							console.log('Order captured:', details);

							await handlePaymentSuccess(details);
						} catch (error) {
							handlePaymentError(error);
						}
					},
					onCancel: (data) => {
						console.log('Payment cancelled:', data);
						isProcessing = false;
						paymentError = 'Die Zahlung wurde abgebrochen.';
					},
					onError: (err) => {
						console.error('PayPal error:', err);
						handlePaymentError(err);
					},
					style: getButtonStyle()
				})
				.render('#paypal-button-container');

			console.log('PayPal buttons rendered successfully');
		} catch (error) {
			console.error('Error rendering PayPal buttons:', error);
			paymentError =
				'Fehler beim Rendern der PayPal-Schaltflächen. Bitte versuche es später erneut.';
		}
	}

	function getButtonStyle() {
		return {
			layout: 'vertical',
			color: paymentType === 'monatlich' ? 'blue' : 'gold',
			shape: 'rect',
			label: paymentType === 'monatlich' ? 'subscribe' : 'pay',
			height: 48,
			tagline: false
		};
	}

	// Success Handler
	async function handlePaymentSuccess(details: PayPalOrderDetails) {
		console.log('Payment successful, details:', details);
		paymentSuccess = true;
		await trackAnalyticsEvent(details);

		setTimeout(() => {
			onSubmit();
			onClose();
		}, 2000);
	}

	// Analytics tracking
	async function trackAnalyticsEvent(details: PayPalOrderDetails) {
		if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
			window.gtag('event', 'purchase', {
				transaction_id: details.id,
				value: totalWithDonation,
				currency: 'EUR',
				items: [
					{
						item_name: getPlanDisplayName(selectedPlan, paymentType),
						price: totalWithDonation
					}
				]
			});
		}
	}

	// Handle donation toggle
	function toggleDonation() {
		includeDonation = !includeDonation;
		paymentMethod = includeDonation ? 'betterplace' : 'paypal';
		console.log('Donation toggled:', includeDonation, 'New payment method:', paymentMethod);

		// Re-render PayPal buttons when donation changes
		setTimeout(() => {
			renderPayPalButtons();
		}, 100);
	}

	// Component lifecycle
	onMount(() => {
		const handleEscapeKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && showModal) {
				handleClose();
			}
		};
		document.addEventListener('keydown', handleEscapeKey);

		console.log('PaymentModal mounted with settings:', {
			selectedPlan,
			paymentType,
			totalPrice
		});
	});

	$effect(() => {
		animatedDonation.set(includeDonation ? totalPrice * 0.03 : 0);
	});
</script>

<dialog
	use:enhancedModal
	class="modal backdrop-blur-[2px]"
	class:modal-open={showModal}
	aria-labelledby="payment-title"
	aria-describedby="payment-description"
	tabindex="-1"
>
	<div class="modal-box max-w-xl overflow-visible p-0">
		<div class="rounded-t-lg bg-base-100 p-6">
			<header class="mb-6 flex items-center justify-between">
				<h3 id="payment-modal-title" class="text-xl font-bold lg:text-2xl">
					Bezahlung abschließen
				</h3>
				<button
					type="button"
					class="btn btn-circle btn-sm"
					onclick={handleClose}
					aria-label="Schließen">✕</button
				>
			</header>

			<!-- Price Summary with animated discount badge -->
			<div class="card mb-6 bg-base-200 shadow-sm">
				<div class="card-body p-4">
					<div class="flex items-center justify-between">
						<div>
							<h4 class="text-lg font-semibold" itemprop="name">
								{getPlanDisplayName(selectedPlan, paymentType)}
							</h4>
							<div class="flex gap-1">
								<p class="text-sm opacity-75">
									{paymentType === 'monatlich'
										? 'Monatliche Zahlung'
										: paymentType === 'einmalig'
											? 'Einmalzahlung'
											: 'Lifetime-Zugang'}
								</p>
								{#if discountPercentage() > 0}
									<p class="text-sm text-error" itemprop="discount">
										{discountPercentage()}% Rabatt
									</p>
								{/if}
								{#if includeDonation}
									<p class="text-sm text-success" itemprop="donation">
										inkl. {$animatedDonation.toFixed(2).replace('.', ',')}€ Spende
									</p>
								{/if}
							</div>
						</div>
						<div class="text-right">
							<p class="text-2xl font-bold">
								{totalPrice.toFixed(2)}€
							</p>
							<p class="text-sm opacity-75">
								inkl. {currentVatText}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Payment Options -->
			{#if paymentMethod === 'betterplace'}
				<div class="alert alert-info mt-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-2"
					>
						<path
							d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
						/>
					</svg>
					<span class="text-sm"> 93% Deiner Spende unterstützt direkt Umweltschutzprojekte. </span>
				</div>
			{/if}

			<div class="mb-6 space-y-3">
				<!-- PayPal Input -->
				<label
					class="form-input group
   {paymentMethod === 'paypal' ? 'bg-blue-50 ring-2 ring-blue-500' : ''}"
					for="payment-paypal"
				>
					<div class="flex items-center">
						<div class="relative h-6 w-6">
							<input
								type="checkbox"
								id="payment-paypal"
								name="payment"
								value="paypal"
								checked={paymentMethod === 'paypal'}
								onchange={() => handlePaymentMethodChange('paypal')}
							/>
							<div
								class="absolute inset-0 rounded-md border-2 border-blue-500 bg-blue-500 transition-all"
							>
								<svg
									class="absolute inset-0 m-auto h-4 w-4 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="3"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
						</div>
						<span class="ml-3 text-sm font-medium">PayPal</span>
					</div>
					<div class="ml-auto flex items-center gap-1 lg:gap-2 lg:pl-4">
						{#each ['visa', 'mastercard', 'maestro', 'amex'] as brand}
							<img src={`/${brand}.svg`} alt={brand} class="h-6" />
						{/each}
					</div>
				</label>

				<!-- Betterplace Input -->
				<label
					class="form-input group hover:border-emerald-200 hover:bg-emerald-50
   {includeDonation ? 'bg-emerald-50 ring-2 ring-emerald-500' : ''}"
					for="payment-betterplace"
				>
					<div class="flex items-center">
						<div class="relative h-6 w-6">
							<input
								type="checkbox"
								id="payment-betterplace"
								name="payment"
								value="betterplace"
								bind:checked={includeDonation}
								onchange={() => handlePaymentMethodChange('betterplace')}
							/>
							<div
								class="absolute inset-0 rounded-md border-2 border-emerald-500 transition-all
         {includeDonation ? 'bg-emerald-500' : 'bg-white'}"
							>
								{#if includeDonation}
									<svg
										class="absolute inset-0 m-auto h-4 w-4 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="3"
											d="M5 13l4 4L19 7"
										/>
									</svg>
								{/if}
							</div>
						</div>
						<span class="ml-3 text-sm font-medium">3% Spende</span>
					</div>
					<div class="ml-auto lg:pl-4">
						<img src="/betterplace.svg" alt="Betterplace" class="h-4 lg:h-6" />
					</div>
				</label>
				<!-- Payment Method Content -->
				<div class="mb-8">
					{#if includeDonation}
						<div
							class="mb-4 mt-4 flex items-start gap-3 rounded-lg bg-emerald-50 p-4 text-sm"
							in:fly={{ y: 20, delay: 200 }}
						>
							<div class="heart-icon text-2xl">❤️</div>
							<p class="text-xs text-emerald-700">
								Mit jedem Euro unterstützst Du direkt [konkrete Maßnahme].
								<span class="font-semibold">93% Deine Spende</span> fließt unmittelbar in [konkreten
								Zweck] - nachweislich und transparent!
							</p>
						</div>
					{/if}
					<div id="paypal-button-container" class="mb-4"></div>
				</div>
			</div>

			<!-- Payment Form -->
			<div id="paypal-button-container" class="mt-6">
				{#if isProcessing && !paymentSuccess}
					<div class="flex justify-center py-8">
						<span class="loading loading-spinner loading-lg"></span>
					</div>
				{/if}
			</div>

			<!-- Error Message -->
			{#if paymentError}
				<div class="alert alert-error mt-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-2"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
					<span>{paymentError}</span>
				</div>
			{/if}

			<!-- Success Message -->
			{#if paymentSuccess}
				<div class="alert alert-success mt-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-2"
					>
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
						<polyline points="22 4 12 14.01 9 11.01" />
					</svg>
					<span>Zahlung erfolgreich! Du wirst weitergeleitet...</span>
				</div>
			{/if}
		</div>

		<!-- Footer -->
		<div class="rounded-b-lg bg-base-200 p-4">
			<div class="flex flex-wrap justify-center gap-4 text-xs">
				<!-- Security Badge: Lock -->
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-1"
					>
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
						<path d="M7 11V7a5 5 0 0 1 10 0v4" />
					</svg>
					<span>SSL Gesichert</span>
				</div>

				<!-- Security Badge: Shield -->
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-1"
					>
						<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
					</svg>
					<span>Käuferschutz</span>
				</div>

				<!-- Security Badge: Clock -->
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-1"
					>
						<circle cx="12" cy="12" r="10" />
						<polyline points="12 6 12 12 16 14" />
					</svg>
					<span>Sofortiger Zugang</span>
				</div>
			</div>

			<p class="mt-4 text-center text-xs opacity-75">
				Mit dem Fortfahren akzeptierst Du unsere<br />
				<a href="/terms" class="link">AGB</a> und
				<a href="/privacy" class="link">Datenschutzbestimmungen</a>
			</p>
		</div>
	</div>
</dialog>
