<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { FormData } from '$lib/schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { onMount } from 'svelte';

	interface Props {
		showModal: boolean;
		selectedPlan: string;
		paymentType: string;
		totalPrice: number;
		form?: SuperValidated<FormData>;
		errors?: Record<string, string>;
		onClose: () => void;
		onSubmit: () => void;
	}

	let {
		showModal,
		selectedPlan,
		paymentType,
		totalPrice,
		form,
		errors = {},
		onClose,
		onSubmit
	} = $props<Props>();

	// Payment processing states
	let paymentMethod = $state('paypal');
	let isProcessing = $state(false);
	let paymentSuccess = $state(false);
	let paymentError = $state('');
	let redirectUrl = $state('');

	// Form validation states
	let cardNumber = $state('');
	let cardHolder = $state('');
	let expiryDate = $state('');
	let cvc = $state('');
	let isFormValid = $state(false);
	let touchedFields = $state(new Set<string>());
	let formErrors = $state<Record<string, string>>({});

	// Helper function to generate plan name
	function getPlanDisplayName(planName: string, payType: string): string {
		if (payType === 'longtime') {
			if (planName === '1-MONATS-PLAN') return 'BASIS LONGTIME-ZUGANG';
			if (planName === '3-MONATS-PLAN') return 'PREMIUM LONGTIME-ZUGANG';
			if (planName === '6-MONATS-PLAN') return 'BUSINESS LONGTIME-ZUGANG';
			return 'LONGTIME-ZUGANG';
		}
		return planName;
	}

	// Scroll lock handling
	function setBodyScrollLock(lock: boolean) {
		if (typeof document !== 'undefined') {
			document.body.classList.toggle('overflow-hidden', lock);
		}
	}

	$effect(() => {
		setBodyScrollLock(showModal);
		if (showModal) resetForm();
	});

	// Reset form
	function resetForm() {
		cardNumber = '';
		cardHolder = '';
		expiryDate = '';
		cvc = '';
		touchedFields.clear();
		formErrors = {};
		isFormValid = false;
		isProcessing = false;
		paymentSuccess = false;
		paymentError = '';
		redirectUrl = '';
	}

	// Payment processing
	async function processPayment() {
		isProcessing = true;
		paymentError = '';

		try {
			const paymentData = {
				title: getPlanDisplayName(selectedPlan, paymentType),
				price: totalPrice,
				currency: 'EUR',
				paymentType,
				customerName: cardHolder || form?.data.name || '',
				customerEmail: form?.data.email || '',
				selectedPlan
			};

			const proxyUrl = import.meta.env.DEV ? 'https://cors-anywhere.herokuapp.com/' : '';
			const endpoint =
				paymentMethod === 'paypal'
					? `${proxyUrl}https://n8n.chooomedia.com/webhook/websitehealth__paymentPaypal`
					: `${proxyUrl}https://n8n.chooomedia.com/webhook/websitehealth__paymentStripe`;

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Origin: window.location.origin, // Hier wird der Origin-Header hinzugefügt
					'X-Requested-With': 'XMLHttpRequest' // Der Header für AJAX-Anfragen
				},
				body: JSON.stringify(
					paymentMethod === 'credit'
						? {
								...paymentData,
								cardDetails: {
									cardNumber: cardNumber.replace(/\s+/g, ''),
									expiryDate,
									cvc,
									cardHolder
								}
							}
						: paymentData
				)
			});

			if (!response.ok) throw new Error(await response.text());

			const result = await response.json();

			if (result.url) {
				redirectUrl = result.url;
				if (paymentMethod === 'paypal') window.location.href = redirectUrl;
				else paymentSuccess = true;
			} else {
				paymentSuccess = true;
				onSubmit();
			}
		} catch (error) {
			paymentError = error instanceof Error ? error.message : 'Zahlungsfehler';
		} finally {
			isProcessing = false;
		}
	}

	// Form submission
	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (paymentMethod === 'credit') {
			touchedFields.add('card-number');
			touchedFields.add('expiry');
			touchedFields.add('cvc');
			touchedFields.add('card-holder');
		}

		validateForm();

		if (isFormValid) {
			await processPayment();
		}
	}

	function validateForm() {
		formErrors = {};

		// PayPal benötigt keine Validierung
		if (paymentMethod === 'paypal') {
			isFormValid = true;
			return;
		}

		// Kreditkartenvalidierung
		if (!cardNumber || !validateCreditCardNumber(cardNumber)) {
			formErrors['card-number'] = 'Ungültige Kartennummer';
		}

		if (!expiryDate || !validateExpiryDate(expiryDate)) {
			formErrors['expiry'] = 'Ungültiges Ablaufdatum';
		}

		if (!cvc || !validateCVC(cvc)) {
			formErrors['cvc'] = 'Ungültiger CVC';
		}

		if (!cardHolder || cardHolder.length < 3) {
			formErrors['card-holder'] = 'Ungültiger Karteninhaber';
		}

		isFormValid = Object.keys(formErrors).length === 0;
	}

	// Close handler
	function handleClose() {
		onClose();
		resetForm();
	}

	onMount(() => {
		const script = document.createElement('script');
		script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=EUR`;
		script.onload = () => renderPayPalButton();
		document.head.appendChild(script);
	});

	function renderPayPalButton() {
		window.paypal
			?.Buttons({
				createOrder: (data, actions) =>
					actions.order.create({
						purchase_units: [
							{
								description: getPlanDisplayName(selectedPlan, paymentType),
								amount: {
									value: totalPrice.toFixed(2),
									currency_code: 'EUR'
								}
							}
						]
					}),
				onApprove: async (data, actions) => {
					try {
						isProcessing = true;
						await actions.order.capture();
						onSubmit();
						onClose();
					} catch (err) {
						paymentError = 'PayPal-Zahlung fehlgeschlagen';
					} finally {
						isProcessing = false;
					}
				}
			})
			.render('#paypal-button-container');
	}
</script>

<!-- Modal Structure -->
<div
	class="modal backdrop-blur-[2px] {showModal ? 'modal-open' : ''}"
	transition:fade
	onclick={handleClose}
>
	<div class="modal-box relative" transition:fly={{ y: 20 }}>
		<div class="mb-6 flex items-center justify-between">
			<h3 class="text-2xl font-bold">Bezahlung abschließen</h3>
			<div class="btn btn-circle btn-sm" onclick={handleClose}>✕</div>
		</div>
		{#if paymentSuccess}
			<!-- Success State -->
			<div class="flex flex-col items-center py-8 text-center">
				<div class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
					<svg
						class="h-16 w-16 text-green-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>

				<h2 class="mb-2 text-2xl font-bold text-gray-900">Zahlung erfolgreich!</h2>
				<p class="mb-6 text-gray-600">Vielen Dank für Deinen Kauf.</p>

				{#if redirectUrl}
					<a
						href={redirectUrl}
						class="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
						target="_blank"
					>
						Zur Bestätigungsseite
					</a>
				{:else}
					<button
						class="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
						onclick={handleClose}
					>
						Schließen
					</button>
				{/if}
			</div>
		{:else}
			{#if paymentError}
				<div class="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
					{paymentError}
				</div>
			{/if}

			<div class="mb-6 rounded-lg bg-blue-50 p-4">
				<div class="flex items-center justify-between">
					<div>
						<span class="text-lg font-semibold">
							{getPlanDisplayName(selectedPlan, paymentType)}
						</span>
						<p class="text-sm text-gray-600">
							{#if paymentType === 'monatlich'}
								Monatliche Zahlung
							{:else if paymentType === 'einmalig'}
								Einmalige Zahlung
							{:else}
								5 Jahre exklusiven Zugang
							{/if}
						</p>
					</div>
					<div class="text-right">
						<div class="text-2xl font-bold">{totalPrice.toFixed(2)}€</div>
						{#if paymentType === 'einmalig'}
							<span class="text-xs text-green-600">8% Rabatt</span>
						{:else if paymentType === 'longtime'}
							<span class="text-xs text-green-600">20% Rabatt</span>
						{/if}
					</div>
				</div>
			</div>

			<form id="payment-form" onsubmit={handleSubmit} novalidate>
				<!-- Payment Method Selection -->
				<div class="mb-6 space-y-3">
					<label
						class="sr-only flex cursor-pointer items-center rounded-lg border p-4 {paymentMethod ===
							'credit' && 'border-blue-500 bg-blue-50'}"
					>
						<input
							type="radio"
							name="payment"
							value="credit"
							checked={paymentMethod === 'credit'}
							class="h-5 w-5 text-blue-600"
							onclick={() => (paymentMethod = 'credit')}
						/>
						<span class="ml-3 flex-grow text-sm font-medium">Kreditkarte</span>
						<div class="flex items-center gap-2">
							<img src="/visa.svg" alt="Visa" class="h-6" />
							<img src="/mastercard.svg" alt="Mastercard" class="h-6" />
							<img src="/maestro.svg" alt="Maestro" class="h-6" />
							<img src="/amex.svg" alt="Amex" class="h-6" />
						</div>
					</label>

					<label
						class="flex cursor-pointer items-center rounded-lg border p-4 {paymentMethod ===
							'paypal' && 'border-blue-500 bg-blue-50'}"
					>
						<input
							type="radio"
							name="payment"
							value="paypal"
							checked={paymentMethod === 'paypal'}
							class="h-5 w-5 text-blue-600"
							onclick={() => (paymentMethod = 'paypal')}
						/>
						<span class="ml-3 flex-grow text-sm font-medium">Onlinebezahlung</span>
						<div class="flex items-center gap-2">
							<img src="/visa.svg" alt="Visa" class="h-6" />
							<img src="/mastercard.svg" alt="Mastercard" class="h-6" />
							<img src="/maestro.svg" alt="Maestro" class="h-6" />
							<img src="/amex.svg" alt="Amex" class="h-6" />
						</div>
					</label>

					<!-- PayPal -->
					{#if paymentMethod === 'paypal'}
						<div id="paypal-button-container"></div>
					{/if}
				</div>

				{#if paymentMethod === 'credit'}
					<!-- Credit Card Form -->
					<div class="space-y-4">
						<!-- Card Number -->
						<div>
							<label class="mb-1 block text-sm font-medium">Kartennummer</label>
							<input
								type="text"
								placeholder="1234 5678 9012 3456"
								id="card-number"
								class="form-inpu w-full rounded-lg border p-3 {formErrors['card-number'] &&
									'border-red-500'} v"
								bind:value={cardNumber}
								onblur={() => handleBlur('card-number')}
								oninput={(e) => (cardNumber = e.target.value.match(/\d{1,4}/g)?.join(' ') || '')}
								aria-invalid={formErrors['card-number'] ? 'true' : 'false'}
							/>
							{#if formErrors['card-number']}
								<p class="mt-1 text-sm text-red-600">{formErrors['card-number']}</p>
							{/if}
						</div>

						<div class="grid grid-cols-2 gap-4">
							<!-- Expiry Date -->
							<div>
								<label class="mb-1 block text-sm font-medium">Ablaufdatum</label>
								<input
									type="text"
									placeholder="MM/JJ"
									class="w-full rounded-lg border p-3 {formErrors['expiry'] && 'border-red-500'}"
									bind:value={expiryDate}
									oninput={(e) => {
										let value = e.target.value.replace(/\D/g, '');
										if (value.length > 4) value = value.slice(0, 4);
										expiryDate = value.replace(/(\d{2})(\d{0,2})/, '$1/$2');
									}}
								/>
								{#if formErrors['expiry']}
									<p class="mt-1 text-sm text-red-600">{formErrors['expiry']}</p>
								{/if}
							</div>

							<!-- CVC -->
							<div>
								<label class="mb-1 block text-sm font-medium">CVC</label>
								<input
									type="text"
									placeholder="123"
									class="w-full rounded-lg border p-3 {formErrors['cvc'] && 'border-red-500'}"
									bind:value={cvc}
									maxlength="4"
									oninput={(e) => (cvc = e.target.value.replace(/\D/g, ''))}
								/>
								{#if formErrors['cvc']}
									<p class="mt-1 text-sm text-red-600">{formErrors['cvc']}</p>
								{/if}
							</div>
						</div>

						<!-- Card Holder -->
						<div>
							<label class="mb-1 block text-sm font-medium">Karteninhaber</label>
							<input
								type="text"
								placeholder="Max Mustermann"
								class="w-full rounded-lg border p-3 {formErrors['card-holder'] && 'border-red-500'}"
								bind:value={cardHolder}
							/>
							{#if formErrors['card-holder']}
								<p class="mt-1 text-sm text-red-600">{formErrors['card-holder']}</p>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Submit Button -->
				<div class="mt-8 flex items-center justify-between">
					{#if paymentMethod === 'paypal'}
						<div class="flex items-center gap-2 text-sm text-gray-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-green-500"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									d="M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Sichere Bezahlung
						</div>
						<div class="flex items-center gap-2 text-sm text-gray-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-green-500"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									d="M9 12L11 14L15 9.99999M20 12C20 16.4611 14.54 19.6937 12.6414 20.683C12.4361 20.79 12.3334 20.8435 12.191 20.8712C12.08 20.8928 11.92 20.8928 11.809 20.8712C11.6666 20.8435 11.5639 20.79 11.3586 20.683C9.45996 19.6937 4 16.4611 4 12V8.21759C4 7.41808 4 7.01833 4.13076 6.6747C4.24627 6.37113 4.43398 6.10027 4.67766 5.88552C4.9535 5.64243 5.3278 5.50207 6.0764 5.22134L11.4382 3.21067C11.6461 3.13271 11.75 3.09373 11.857 3.07827C11.9518 3.06457 12.0482 3.06457 12.143 3.07827C12.25 3.09373 12.3539 3.13271 12.5618 3.21067L17.9236 5.22134C18.6722 5.50207 19.0465 5.64243 19.3223 5.88552C19.566 6.10027 19.7537 6.37113 19.8692 6.6747C20 7.01833 20 7.41808 20 8.21759V12Z"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Käuferschutz
						</div>
						<div class="flex items-center gap-2 text-sm text-gray-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-green-500"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									d="M2 12L7.25 17C7.25 17 8.66939 15.3778 9.875 14"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M8 12L13.25 17L22 7"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M16 7L12.5 11"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Sofortige Bestätigung
						</div>
					{:else}
						<div class="flex items-center gap-2 text-sm text-gray-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-green-500"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									d="M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Sichere Bezahlung
						</div>
						<div class="flex items-center gap-2 text-sm text-gray-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-green-500"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									d="M2 12L7.25 17C7.25 17 8.66939 15.3778 9.875 14"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M8 12L13.25 17L22 7"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M16 7L12.5 11"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Sofortige Bestätigung
						</div>
					{/if}

					{#if paymentMethod === 'credit'}
						<button
							type="submit"
							class="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
							disabled={isProcessing || (paymentMethod === 'credit' && !isFormValid)}
						>
							{#if isProcessing}
								<span class="inline-block animate-pulse">Verarbeitung...</span>
							{:else}
								Jetzt bezahlen
							{/if}
						</button>
					{/if}
				</div>
			</form>

			<!-- Footer Links -->
			<div class="mt-6 text-center text-xs text-gray-500">
				Mit der Bestellung akzeptierst du unsere
				<a href="#" class="text-blue-600 underline">AGB</a> und
				<a href="#" class="text-blue-600 underline">Datenschutzerklärung</a>.
			</div>
		{/if}
	</div>
</div>
