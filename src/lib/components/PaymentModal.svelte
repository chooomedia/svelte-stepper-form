<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { FormData } from '$lib/schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { effect } from 'zod';

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

	// State for payment method
	let paymentMethod = $state('paypal'); // Default to PayPal for better conversion rate

	// Form validation states
	let cardNumber = $state('');
	let cardHolder = $state('');
	let expiryDate = $state('');
	let cvc = $state('');
	let isFormValid = $state(false);
	let touchedFields = $state(new Set<string>());
	let formErrors = $state<Record<string, string>>({});

	// Set body scroll lock when modal is open
	function setBodyScrollLock(lock: boolean) {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = lock ? 'hidden' : '';
		}
	}

	// Use effect for reactive logic (Svelte 5 replacement for $:)
	effect(() => {
		if (showModal) {
			setBodyScrollLock(true);
		} else {
			setBodyScrollLock(false);
		}

		// Reset form when modal opens
		if (showModal) {
			resetForm();
		}
	});

	// Reset form fields
	function resetForm() {
		cardNumber = '';
		cardHolder = '';
		expiryDate = '';
		cvc = '';
		touchedFields.clear();
		formErrors = {};
		isFormValid = false;
	}

	// Mark field as "touched" when user leaves it
	function handleBlur(fieldName: string) {
		touchedFields.add(fieldName);
		validateForm();
	}

	// Validate credit card number with Luhn algorithm
	function validateCreditCardNumber(number: string): boolean {
		// Remove spaces and non-digit characters
		const digits = number.replace(/\D/g, '');

		if (digits.length < 13 || digits.length > 19) {
			return false;
		}

		// Luhn algorithm implementation
		let sum = 0;
		let shouldDouble = false;

		// Loop from right to left
		for (let i = digits.length - 1; i >= 0; i--) {
			let digit = parseInt(digits.charAt(i));

			if (shouldDouble) {
				digit *= 2;
				if (digit > 9) digit -= 9;
			}

			sum += digit;
			shouldDouble = !shouldDouble;
		}

		return sum % 10 === 0;
	}

	// Validate expiry date (MM/YY format)
	function validateExpiryDate(date: string): boolean {
		const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
		if (!regex.test(date)) {
			return false;
		}

		const [month, year] = date.split('/').map((part) => parseInt(part));
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear() % 100;
		const currentMonth = currentDate.getMonth() + 1;

		// Check if the card is expired
		if (year < currentYear || (year === currentYear && month < currentMonth)) {
			return false;
		}

		return true;
	}

	// Validate CVC code
	function validateCVC(cvcValue: string): boolean {
		// CVC should be 3-4 digits
		return /^\d{3,4}$/.test(cvcValue);
	}

	// Validate the whole form
	function validateForm() {
		formErrors = {};

		// Skip validation for PayPal
		if (paymentMethod === 'paypal') {
			isFormValid = true;
			return;
		}

		// Credit card validation
		if (touchedFields.has('card-number')) {
			if (!cardNumber) {
				formErrors['card-number'] = 'Bitte geben Sie Ihre Kartennummer ein';
			} else if (!validateCreditCardNumber(cardNumber)) {
				formErrors['card-number'] = 'Ungültige Kartennummer';
			}
		}

		if (touchedFields.has('expiry')) {
			if (!expiryDate) {
				formErrors['expiry'] = 'Bitte geben Sie das Ablaufdatum ein';
			} else if (!validateExpiryDate(expiryDate)) {
				formErrors['expiry'] = 'Ungültiges oder abgelaufenes Datum';
			}
		}

		if (touchedFields.has('cvc')) {
			if (!cvc) {
				formErrors['cvc'] = 'Bitte geben Sie den Sicherheitscode ein';
			} else if (!validateCVC(cvc)) {
				formErrors['cvc'] = 'Ungültiger Sicherheitscode';
			}
		}

		if (touchedFields.has('card-holder')) {
			if (!cardHolder) {
				formErrors['card-holder'] = 'Bitte geben Sie den Karteninhaber ein';
			} else if (cardHolder.length < 3) {
				formErrors['card-holder'] = 'Name ist zu kurz';
			}
		}

		// Form is valid if there are no errors
		isFormValid = Object.keys(formErrors).length === 0;

		// If all fields are touched, check if form is valid
		const allFieldsTouched =
			touchedFields.has('card-number') &&
			touchedFields.has('expiry') &&
			touchedFields.has('cvc') &&
			touchedFields.has('card-holder');

		if (allFieldsTouched) {
			isFormValid =
				cardNumber && expiryDate && cvc && cardHolder && Object.keys(formErrors).length === 0;
		}
	}

	// Switch payment method
	function setPaymentMethod(method: string) {
		paymentMethod = method;
		validateForm();
	}

	// Format credit card number with spaces
	function formatCreditCardNumber(e: Event) {
		const input = e.target as HTMLInputElement;
		let value = input.value.replace(/\D/g, '');

		if (value.length > 16) {
			value = value.slice(0, 16);
		}

		// Add spaces after every 4 digits
		const parts = [];
		for (let i = 0; i < value.length; i += 4) {
			parts.push(value.slice(i, i + 4));
		}

		cardNumber = parts.join(' ');
	}

	// Format expiry date as MM/YY
	function formatExpiryDate(e: Event) {
		const input = e.target as HTMLInputElement;
		let value = input.value.replace(/\D/g, '');

		if (value.length > 4) {
			value = value.slice(0, 4);
		}

		if (value.length > 2) {
			expiryDate = `${value.slice(0, 2)}/${value.slice(2)}`;
		} else {
			expiryDate = value;
		}
	}

	// Handle form submission
	function handleSubmit(e: Event) {
		e.preventDefault();

		// Mark all fields as touched for validation
		if (paymentMethod === 'credit') {
			touchedFields.add('card-number');
			touchedFields.add('expiry');
			touchedFields.add('cvc');
			touchedFields.add('card-holder');
		}

		validateForm();

		if (isFormValid) {
			// Form is valid, proceed with submission
			onSubmit();
		}
	}

	// Close modal
	function handleClose() {
		onClose();
	}
</script>

<!-- Prevent click propagation for modal content -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="fixed inset-0 z-50 mt-0 flex items-center justify-center overflow-hidden bg-black bg-opacity-50 backdrop-blur-[2px]"
	class:hidden={!showModal}
	transition:fade={{ duration: 200 }}
	onclick={handleClose}
>
	<div
		class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
		transition:fly={{ y: 20, duration: 300 }}
		onclick={(e) => e.stopPropagation()}
	>
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-2xl font-bold text-gray-900">Bezahlung abschließen</h3>
			<button
				type="button"
				class="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
				onclick={handleClose}
				aria-label="Schließen"
			>
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					></path>
				</svg>
			</button>
		</div>

		<div class="mb-6 rounded-lg bg-blue-50 p-4">
			<div class="flex items-center justify-between">
				<div>
					<span class="text-lg font-semibold text-gray-900">{selectedPlan}</span>
					<p class="text-sm text-gray-600">
						{paymentType === 'monatlich' ? 'Monatliche Zahlung' : 'Einmalige Zahlung'}
					</p>
				</div>
				<div class="text-right">
					<div class="text-2xl font-bold text-gray-900">{totalPrice.toFixed(2)}€</div>
					{#if paymentType === 'einmalig'}
						<span class="text-xs text-green-600">8% Rabatt eingerechnet</span>
					{/if}
				</div>
			</div>
		</div>

		<form id="payment-form" class="space-y-6" method="post" onsubmit={handleSubmit} novalidate>
			<!-- Payment Methods -->
			<div>
				<h4 class="mb-4 text-lg font-semibold text-gray-900">Zahlungsmethode wählen</h4>

				<div class="space-y-3">
					<label
						class="flex cursor-pointer items-center rounded-lg border p-4 hover:border-blue-500 {paymentMethod ===
						'credit'
							? 'border-blue-500 bg-blue-50'
							: ''}"
					>
						<input
							type="radio"
							name="payment"
							value="credit"
							checked={paymentMethod === 'credit'}
							class="h-5 w-5 text-blue-600"
							onclick={() => setPaymentMethod('credit')}
						/>
						<div class="ml-3 flex-grow">
							<span class="text-sm font-medium text-gray-900">Kreditkarte</span>
						</div>
						<div class="flex items-center space-x-2">
							<img src="/visa.svg" alt="Visa" class="h-6 w-6" />
							<img src="/mastercard.svg" alt="Mastercard" class="h-6 w-6" />
							<img src="/maestro.svg" alt="Maestro" class="h-6 w-6" />
							<img src="/amex.svg" alt="American Express" class="h-6 w-6" />
						</div>
					</label>

					<label
						class="flex cursor-pointer items-center rounded-lg border p-4 hover:border-blue-500 {paymentMethod ===
						'paypal'
							? 'border-blue-500 bg-blue-50'
							: ''}"
					>
						<input
							type="radio"
							name="payment"
							value="paypal"
							checked={paymentMethod === 'paypal'}
							class="h-5 w-5 text-blue-600"
							onclick={() => setPaymentMethod('paypal')}
						/>
						<div class="ml-3 flex-grow">
							<span class="text-sm font-medium text-gray-900">PayPal</span>
						</div>
						<img src="/paypal.svg" alt="PayPal" class="h-6" />
					</label>
				</div>
			</div>

			{#if paymentMethod === 'paypal'}
				<!-- PayPal Info -->
				<div class="rounded-lg bg-gray-50 p-4">
					<div class="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-3 h-8 w-8 text-blue-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<p class="text-sm text-gray-700">
							Nach dem Klicken auf "Weiter zu PayPal" wirst Du zu PayPal weitergeleitet, um den
							Zahlungsprozess abzuschließen. Nach erfolgreicher Zahlung wird auf diese Seite
							zurückgeleitet - bitte nicht das Browserfenster neu laden.
						</p>
					</div>
				</div>
			{:else if paymentMethod === 'credit'}
				<!-- Credit Card Form -->
				<div class="space-y-4">
					<div>
						<label for="card-number" class="mb-1 block text-sm font-medium text-gray-700"
							>Kartennummer</label
						>
						<input
							type="text"
							id="card-number"
							name="card-number"
							placeholder="1234 5678 9012 3456"
							autocomplete="cc-number"
							class="w-full rounded-lg border p-3 text-gray-700 focus:border-blue-500 focus:outline-none {touchedFields.has(
								'card-number'
							) && formErrors['card-number']
								? 'border-red-500'
								: ''}"
							value={cardNumber}
							onblur={() => handleBlur('card-number')}
							oninput={formatCreditCardNumber}
							required
						/>
						{#if touchedFields.has('card-number') && formErrors['card-number']}
							<p class="mt-1 text-sm text-red-600">{formErrors['card-number']}</p>
						{/if}
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="expiry" class="mb-1 block text-sm font-medium text-gray-700"
								>Ablaufdatum</label
							>
							<input
								type="text"
								id="expiry"
								name="expiry"
								placeholder="MM/JJ"
								autocomplete="cc-exp"
								class="w-full rounded-lg border p-3 text-gray-700 focus:border-blue-500 focus:outline-none {touchedFields.has(
									'expiry'
								) && formErrors['expiry']
									? 'border-red-500'
									: ''}"
								value={expiryDate}
								onblur={() => handleBlur('expiry')}
								oninput={formatExpiryDate}
								required
							/>
							{#if touchedFields.has('expiry') && formErrors['expiry']}
								<p class="mt-1 text-sm text-red-600">{formErrors['expiry']}</p>
							{/if}
						</div>
						<div>
							<label for="cvc" class="mb-1 block text-sm font-medium text-gray-700"
								>Sicherheitscode</label
							>
							<input
								type="text"
								id="cvc"
								name="cvc"
								placeholder="CVC"
								autocomplete="cc-csc"
								inputmode="numeric"
								class="w-full rounded-lg border p-3 text-gray-700 focus:border-blue-500 focus:outline-none {touchedFields.has(
									'cvc'
								) && formErrors['cvc']
									? 'border-red-500'
									: ''}"
								bind:value={cvc}
								onblur={() => handleBlur('cvc')}
								maxlength="4"
								required
							/>
							{#if touchedFields.has('cvc') && formErrors['cvc']}
								<p class="mt-1 text-sm text-red-600">{formErrors['cvc']}</p>
							{/if}
						</div>
					</div>

					<div>
						<label for="card-holder" class="mb-1 block text-sm font-medium text-gray-700"
							>Name auf der Karte</label
						>
						<input
							type="text"
							id="card-holder"
							name="card-holder"
							placeholder="Max Mustermann"
							autocomplete="cc-name"
							class="w-full rounded-lg border p-3 text-gray-700 focus:border-blue-500 focus:outline-none {touchedFields.has(
								'card-holder'
							) && formErrors['card-holder']
								? 'border-red-500'
								: ''}"
							bind:value={cardHolder}
							onblur={() => handleBlur('card-holder')}
							required
						/>
						{#if touchedFields.has('card-holder') && formErrors['card-holder']}
							<p class="mt-1 text-sm text-red-600">{formErrors['card-holder']}</p>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Submit Button -->
			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<svg
						class="mr-2 h-5 w-5 text-green-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
						></path>
					</svg>
					<span class="text-sm text-gray-600">Sichere Bezahlung</span>
				</div>
				<button
					type="submit"
					class="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
					disabled={paymentMethod === 'credit' && !isFormValid}
				>
					{paymentMethod === 'paypal' ? 'WEITER ZU PAYPAL' : 'JETZT BEZAHLEN'}
				</button>
			</div>
		</form>

		<div class="mt-6 text-center text-xs text-gray-500">
			Mit der Bezahlung akzeptierst du unsere <a href="#" class="text-blue-600 underline"
				>Nutzungsbedingungen</a
			>
			und <a href="#" class="text-blue-600 underline">Datenschutzrichtlinien</a>.
		</div>
	</div>
</div>
