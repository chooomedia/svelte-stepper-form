<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormData } from '$lib/schema';
	import Modal from './Modal.svelte';

	// Utils
	import {
		generateClientReference,
		getPlanDisplayName,
		calculateTax,
		type PayPalOrderDetails
	} from '$lib/utils/payment';

	// Stores
	import { taxInfo } from '$lib/stores/taxStore';

	// Config
	import { PAYPAL_SCRIPT_BASE } from '$lib/config';
	import SecurityBadge from './SecurityBadge.svelte';
	import Icon from './Icon.svelte';

	// Modal states enum
	export const ModalState = {
		Closed: 'Closed',
		Payment: 'Payment',
		Success: 'Success'
	} as const;

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

	const { showModal, selectedPlan, paymentType, totalPrice, form, onClose, onSubmit } =
		$props<Props>();

	// State
	let currentModal = $state<ModalState>(ModalState.Closed);
	let paymentMethod: 'paypal' | 'betterplace' = $state('paypal');
	let isProcessing = $state(false);
	let paymentError = $state('');
	let errorDetails = $state('');
	let redirectUrl = $state('');
	let showBetterplace = $state(false);
	let includeDonation = $state(false);
	let paymentSuccessDetails = $state<PayPalOrderDetails | null>(null);

	// Calculated total with donation
	const totalWithDonation = $derived(() => {
		if (includeDonation) {
			return totalPrice + totalPrice * 0.03; // 3% extra
		}
		return totalPrice;
	});

	const securityOptions = [
		{ icon: 'lock', text: 'SSL Gesichert' },
		{ icon: 'shield', text: 'Käuferschutz' },
		{ icon: 'clock', text: 'Sofortiger Zugang' }
	];

	// Tax calculations
	const currentTax = $derived(calculateTax(totalPrice, $taxInfo.rate));

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
	const animatedDonation = tweened(1, {
		duration: 1500,
		easing: cubicInOut
	});

	// Update modal state when parent properties change
	$effect(() => {
		if (showModal) {
			resetForm();
			currentModal = ModalState.Payment;
			initPaymentFlow();
		} else {
			currentModal = ModalState.Closed;
		}
	});

	// Handle donation amount animation
	$effect(() => {
		animatedDonation.set(includeDonation ? totalPrice * 0.03 : 0);
	});

	// Reset the form state
	function resetForm() {
		paymentMethod = 'paypal';
		isProcessing = false;
		paymentError = '';
		errorDetails = '';
		redirectUrl = '';
		includeDonation = false;
		showBetterplace = false;
	}

	// Modal close handlers
	function handleMainClose() {
		// If in the middle of payment, show confirmation dialog
		if (currentModal === ModalState.Payment && !isProcessing) {
			currentModal = ModalState.Action;
		} else {
			handleFinalClose();
		}
	}

	function handleFinalClose() {
		currentModal = ModalState.Closed;
		onClose();
	}

	function continuePayment() {
		currentModal = ModalState.Payment;
	}

	// Payment flow initialization
	async function initPaymentFlow() {
		await loadPayPalSDK();
		renderPayPalButtons();
		loadBetterplaceProjectInfo();
	}

	// Load Betterplace project info
	async function loadBetterplaceProjectInfo() {
		try {
			// In a real scenario, this would fetch data from an API
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
		script.async = true;
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
			currentModal = ModalState.Error;
		};
		document.head.appendChild(script);
	}

	// Configure PayPal parameters
	function getPayPalConfig() {
		return new URLSearchParams({
			'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
			currency: 'EUR',
			intent: 'capture',
			locale: 'de_DE',
			components: 'buttons',
			'buyer-country': $taxInfo.country,
			commit: 'true'
		}).toString();
	}

	// Handle payment method change
	function handlePaymentMethodChange(method: 'paypal' | 'betterplace') {
		// Wenn paypal gewählt wird, behalten wir den paymentMethod-Wert bei
		if (method === 'paypal') {
			paymentMethod = 'paypal';
		}
		// Bei Betterplace aktivieren wir nur die Spendenfunktion,
		// aber wechseln NICHT die Zahlungsmethode
		else if (method === 'betterplace') {
			includeDonation = true;
			showBetterplace = true;
			// paymentMethod bleibt 'paypal'
		}
	}

	// Toggle donation option
	function toggleDonation() {
		includeDonation = !includeDonation;

		// Betterplace info anzeigen oder verstecken basierend auf Spendenstatus
		if (includeDonation) {
			showBetterplace = true;
		} else {
			showBetterplace = false;
		}

		// PayPal-Buttons mit aktualisiertem Betrag neu rendern
		setTimeout(() => {
			renderPayPalButtons();
		}, 300);
	}

	// Render PayPal Buttons
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

		try {
			window.paypal
				.Buttons({
					// Use createOrder for all payment types for consistency
					createOrder: async (data, actions) => {
						// Start processing animation
						isProcessing = true;

						// Validate the amount
						const amount =
							typeof totalWithDonation === 'function' ? totalWithDonation() : totalWithDonation;

						if (!amount || amount <= 0) {
							isProcessing = false;
							paymentError = 'Ungültiger Zahlungsbetrag. Bitte versuche es erneut.';
							currentModal = ModalState.Error;
							return null; // Prevent order creation
						}

						// Generate a client reference ID for tracking
						const reference = generateClientReference();
						const formattedAmount = amount.toFixed(2);

						console.log('Creating order with reference:', reference);
						console.log('Creating PayPal order with amount:', formattedAmount);

						// This creates an order with PayPal
						return actions.order.create({
							purchase_units: [
								{
									amount: {
										value: formattedAmount,
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

							// Handle successful payment
							handlePaymentSuccess(details);
						} catch (error) {
							handlePaymentError(error);
						}
					},
					onCancel: (data) => {
						console.log('Payment cancelled:', data);
						isProcessing = false;
						paymentError = 'Die Zahlung wurde abgebrochen.';
						currentModal = ModalState.Error;
					},
					onError: (err) => {
						console.error('PayPal error:', err);

						let errorMessage = 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.';
						let errorDetail = '';

						// Benutzerfreundliche Fehlermeldungen
						if (err.message === 'VALIDATION_ERROR') {
							errorMessage = 'Bitte überprüfe deine Zahlungsdaten';
							errorDetail = JSON.stringify(err);
						} else if (err.message === 'INTEGRATION_ERROR') {
							errorMessage = 'Technisches Problem mit der Zahlungsabwicklung';
							errorDetail = JSON.stringify(err);
						} else if (err.message?.includes('popup')) {
							errorMessage =
								'Das PayPal-Fenster wurde blockiert. Bitte erlaube Popups für diese Seite.';
							errorDetail = JSON.stringify(err);
						} else {
							errorMessage = 'Ein Fehler ist bei der PayPal-Verarbeitung aufgetreten';
							errorDetail = JSON.stringify(err);
						}

						handlePaymentError({
							message: errorMessage,
							detail: errorDetail
						});
					},
					style: getButtonStyle()
				})
				.render('#paypal-button-container');

			console.log('PayPal buttons rendered successfully');
		} catch (error) {
			console.error('Error rendering PayPal buttons:', error);
			paymentError =
				'Fehler beim Rendern der PayPal-Schaltflächen. Bitte versuche es später erneut.';
			currentModal = ModalState.Error;
		}
	}

	// Button style based on payment type
	function getButtonStyle() {
		return {
			layout: 'vertical',
			color: paymentType === 'monatlich' ? 'blue' : 'gold',
			shape: 'rect',
			label: paymentType === 'monatlich' ? 'subscribe' : 'pay',
			height: 55,
			tagline: false
		};
	}

	// Handle payment errors
	function handlePaymentError(error: unknown) {
		console.error('Payment error:', error);
		isProcessing = false;

		let errorMessage = 'Die Zahlung konnte nicht verarbeitet werden. Bitte versuche es erneut.';
		let errorDetail = '';

		if (error instanceof Error) {
			errorMessage = error.message;
			errorDetail = error.stack || '';
		} else if (typeof error === 'object' && error !== null) {
			errorMessage = (error as any).message || errorMessage;
			errorDetail = (error as any).detail || '';
		}

		paymentError = errorMessage;
		errorDetails = errorDetail;
		currentModal = ModalState.Error;
	}

	// Handle successful payment
	async function handlePaymentSuccess(details: PayPalOrderDetails) {
		console.log('Payment successful, details:', details);
		isProcessing = false;

		paymentSuccessDetails = details;
		// Track analytics if available
		await trackAnalyticsEvent(details);

		// Show success modal
		currentModal = ModalState.Success;

		// Notify parent component after a short delay
		setTimeout(() => {
			onSubmit();
			handleFinalClose();
		}, 10000);
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

	// Component lifecycle
	onMount(() => {
		if (showModal) {
			currentModal = ModalState.Payment;
			initPaymentFlow();
		}
	});
</script>

<!-- Main Payment Modal -->
<Modal
	isOpen={currentModal === ModalState.Payment}
	onClose={handleMainClose}
	title="Bezahlung abschließen"
	size="xl"
	type="default"
	closeOnClickOutside={!isProcessing}
	closeOnEsc={!isProcessing}
>
	<!-- Price Summary -->
	<div class="card">
		<div class="card-body mb-4 rounded-lg bg-base-200 p-4">
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
									: 'Longtime-Zugang'}
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
						{totalPrice.toFixed(2).replace('.', ',')}€
					</p>
					<div class="relative inline-flex items-center text-sm opacity-75">
						<!-- Tooltip mit Steuerdaten -->
						<div
							class="tooltip tooltip-left cursor-pointer"
							data-tip={`Netto: ${currentTax.net.toFixed(2).replace('.', ',')}€\nMwSt. (${currentTax.rate}%): ${currentTax.vat.toFixed(2).replace('.', ',')}€`}
						>
							<div class="flex items-center">
								<Icon name="question" className="h-4 w-4 text-gray-500" />
								<p class="ml-1">inkl. MwSt.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Payment Options -->
		<div class="mb-1 space-y-3">
			<!-- PayPal Input -->
			<label
				class="form-input group cursor-pointer bg-blue-50 ring-2 ring-blue-500"
				for="payment-paypal"
			>
				<div class="flex items-center">
					<div class="relative h-6 w-6">
						<input
							type="checkbox"
							id="payment-paypal"
							name="payment"
							value="paypal"
							checked={paymentMethod === 'paypal' || true}
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

			<label
				class="form-input group cursor-pointer hover:border-emerald-200 hover:bg-emerald-50
	{includeDonation ? 'bg-emerald-50 ring-2 ring-emerald-500' : ''}"
				for="payment-betterplace"
			>
				<div class="flex items-center">
					<div class="relative h-6 w-6">
						<input
							type="checkbox"
							id="payment-betterplace"
							name="donation"
							checked={includeDonation}
							onchange={toggleDonation}
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
					<span class="ml-3 text-sm font-medium">3% Spende hinzufügen</span>
				</div>
				<div class="ml-auto lg:pl-4">
					<img src="/betterplace.svg" alt="Betterplace" class="h-4 lg:h-6" />
				</div>
			</label>

			<!-- Betterplace Info Box -->
			{#if includeDonation}
				<div
					class="mb-4 mt-2 flex items-start gap-3 rounded-lg bg-emerald-50 p-4 text-sm"
					in:fly={{ y: 20, delay: 100 }}
				>
					<div class="heart-icon text-2xl">❤️</div>
					<p class="text-xs text-emerald-700">
						Mit jedem Euro unterstützt Du direkt Umweltschutzprojekte.
						<span class="font-semibold">93% Deiner Spende</span> fließt unmittelbar in nachhaltige Projekte
						- nachweislich und transparent!
					</p>
				</div>
			{/if}

			<!-- PayPal Button Container -->
			<div id="paypal-button-container" class="mt-6">
				{#if isProcessing}
					<div class="flex justify-center py-8">
						<span class="loading loading-spinner loading-lg"></span>
					</div>
				{/if}
			</div>
		</div>

		<!-- Security Badges -->
		<slot name="footer">
			<div class="rounded-lg border border-gray-200 bg-base-200 p-4">
				<div class="flex flex-wrap justify-center gap-4 text-xs">
					<!-- Security Badge: Lock -->
					{#each securityOptions as { icon, text }}
						<SecurityBadge {icon} {text} />
					{/each}
				</div>

				<p class="mt-4 text-center text-xs opacity-75">
					Mit dem Fortfahren akzeptierst Du unsere<br />
					<a href="/terms" class="link">AGB</a> und
					<a href="/privacy" class="link">Datenschutzbestimmungen</a>
				</p>
			</div>
		</slot>
	</div></Modal
>

<!-- Success Modal -->

<!-- Error Modal -->
<Modal
	isOpen={currentModal === ModalState.Error}
	onClose={handleFinalClose}
	type="error"
	title="Zahlungsfehler"
	size="xl"
	subtitle={paymentError}
	primaryAction={{
		label: 'Schließen',
		onClick: handleFinalClose,
		variant: 'outline'
	}}
	secondaryAction={{
		label: 'Erneut versuchen',
		onClick: () => {
			currentModal = ModalState.Payment;
			setTimeout(() => {
				renderPayPalButtons();
			}, 500);
		},
		variant: 'primary'
	}}
>
	{#if errorDetails}
		<div class="mx-auto mt-4 w-full max-w-md">
			<details class="text-left">
				<summary class="mb-2 cursor-pointer text-sm text-blue-600 hover:text-blue-800">
					Technische Details anzeigen
				</summary>
				<div
					class="max-h-32 overflow-auto rounded-md bg-gray-100 p-3 text-left font-mono text-xs text-gray-700"
				>
					{errorDetails}
				</div>
			</details>
		</div>
	{/if}

	<p class="mt-6 text-sm text-gray-500">
		Bei weiteren Problemen wende Dich bitte an unseren
		<a href="mailto:support@digitalpusher.de" class="text-blue-600 hover:underline">
			Kundensupport
		</a>.
	</p>
</Modal>

<!-- Action Modal (Confirmation when closing) -->
<Modal
	isOpen={currentModal === ModalState.Action}
	onClose={handleFinalClose}
	type="warning"
	title="Kaufprozess verlassen?"
	size="xl"
	subtitle="Wenn Du jetzt abbrichst, geht Deine aktuelle Auswahl verloren und der Kauf wird nicht abgeschlossen."
	primaryAction={{
		label: 'Kaufprozess fortsetzen',
		onClick: continuePayment,
		variant: 'primary'
	}}
	secondaryAction={{
		label: 'Abbrechen und verlassen',
		onClick: handleFinalClose,
		variant: 'outline'
	}}
>
	<!-- Special Offer -->
	<div class="mb-6 mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
		<p class="font-semibold">Exklusiv: 10% Rabatt bei Abschluss in den nächsten 24 Stunden!</p>
		<p>Nutze diese Gelegenheit für ein noch besseres Angebot.</p>
	</div>
</Modal>

<style>
	.form-input {
		@apply relative flex cursor-pointer items-center rounded-lg border p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50;
	}
</style>
