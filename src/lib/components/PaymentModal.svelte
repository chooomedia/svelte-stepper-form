<!-- src/lib/components/PaymentModal.svelte -->
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
		form: SuperValidated<FormData>;
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

	// State für Zahlungsart
	let paymentMethod = $state('paypal'); // Default zu PayPal für bessere Konversion

	// State für Formularvalidierung
	let cardNumber = $state('');
	let cardHolder = $state('');
	let expiryDate = $state('');
	let cvc = $state('');
	let isFormValid = $state(false);
	let touchedFields = $state(new Set<string>());

	// Scroll-Lock für Body setzen
	function setBodyScrollLock(lock: boolean) {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = lock ? 'hidden' : '';
		}
	}

	// Verwende effect für reaktive Logik (Ersatz für $: in Svelte 5)
	effect(() => {
		if (showModal) {
			setBodyScrollLock(true);
		} else {
			setBodyScrollLock(false);
		}
	});

	// Feld als "touched" markieren wenn Benutzer es verlässt
	function handleBlur(fieldName: string) {
		touchedFields.add(fieldName);
		validateForm();
	}

	// Formular validieren
	function validateForm() {
		// Minimal validation logic
		const creditCardValid =
			paymentMethod !== 'credit' ||
			(cardNumber.length >= 16 &&
				expiryDate.length >= 5 &&
				cvc.length >= 3 &&
				cardHolder.length >= 3);

		isFormValid = creditCardValid;
	}

	// Zahlungsart wechseln
	function setPaymentMethod(method: string) {
		paymentMethod = method;
		validateForm();
	}

	// Formular absenden
	function handleSubmit(e: Event) {
		e.preventDefault();
		validateForm();

		if (isFormValid) {
			// Formular ist gültig, weiterleiten an Parent-Komponente
			onSubmit();
		}
	}

	// Modal schließen und Body-Scroll entsperren
	function handleClose() {
		onClose();
	}
</script>

<!-- Prevent click propagation for modal content -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="fixed inset-0 z-50 mt-0 mt-0 flex items-center justify-center overflow-hidden bg-black bg-opacity-50"
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
			<!-- Zahlungsmethoden -->
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
							<img src="visa.svg" alt="Visa" class="h-6 w-6" />
							<img src="mastercard.svg" alt="Mastercard" class="h-6 w-6" />
							<img src="maestro.svg" alt="Maestro" class="h-6 w-6" />
							<img src="amex.svg" alt="American Express" class="h-6 w-6" />
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
						<img src="paypal.svg" alt="PayPal" class="h-6" />
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
							Nach dem Klicken auf "Weiter zu PayPal" werden Sie zu PayPal weitergeleitet, um den
							Zahlungsprozess abzuschließen. Nach erfolgreicher Zahlung kehren Sie zu uns zurück.
						</p>
					</div>

					<!-- PayPal Button -->
					<div class="mt-6 text-center">
						<button
							type="button"
							class="inline-flex items-center justify-center rounded-md bg-[#0070ba] px-6 py-3 text-lg font-bold text-white shadow-md hover:bg-[#003087] focus:outline-none"
							onclick={() => {
								// Hier würde die PayPal-Integration erfolgen
								handleSubmit(new Event('submit') as Event);
							}}
						>
							<svg class="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="white">
								<path
									d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 4.876-.03.15a.809.809 0 0 1-.794.68h-2.52c-.092 0-.166-.075-.151-.165l.955-6.05-.03-.17a.804.804 0 0 1 .792-.683h1.307c4.067 0 7.136-1.648 8.056-6.418.4-2.05.19-3.687-.814-4.857-.257-.3-.59-.566-.969-.788-.046.6-.069 1.2-.061 1.803-.016 1.275-.312 2.52-.849 3.645l-.001-.002z"
								></path>
								<path
									d="M17.79 3.304a6.13 6.13 0 0 0-.717-.338 9.602 9.602 0 0 0-3.639-.675h-5.23c-.14 0-.258.105-.28.245l-1.458 9.224a.177.177 0 0 0 .175.204h3.74c.09-.006.168-.06.177-.15l.04-.22.77-4.884.05-.25c.01-.092.08-.147.17-.147h1.097c3.457 0 6.152-1.403 6.942-5.467.033-.17.062-.336.086-.497a4.908 4.908 0 0 0-.3-.895c-.35-.655-.982-1.138-1.743-1.3-.294-.074-.597-.123-.903-.147-.157.002-.315.013-.469.029l.04-.079z"
								></path>
							</svg>
							PayPal
						</button>
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
							) && !cardNumber
								? 'border-red-500'
								: ''}"
							bind:value={cardNumber}
							onblur={() => handleBlur('card-number')}
							required
						/>
						{#if touchedFields.has('card-number') && !cardNumber}
							<p class="mt-1 text-sm text-red-600">Bitte geben Sie Ihre Kartennummer ein</p>
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
								) && !expiryDate
									? 'border-red-500'
									: ''}"
								bind:value={expiryDate}
								onblur={() => handleBlur('expiry')}
								required
							/>
							{#if touchedFields.has('expiry') && !expiryDate}
								<p class="mt-1 text-sm text-red-600">Bitte geben Sie das Ablaufdatum ein</p>
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
								) && !cvc
									? 'border-red-500'
									: ''}"
								bind:value={cvc}
								onblur={() => handleBlur('cvc')}
								required
							/>
							{#if touchedFields.has('cvc') && !cvc}
								<p class="mt-1 text-sm text-red-600">Bitte geben Sie den Sicherheitscode ein</p>
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
							) && !cardHolder
								? 'border-red-500'
								: ''}"
							bind:value={cardHolder}
							onblur={() => handleBlur('card-holder')}
							required
						/>
						{#if touchedFields.has('card-holder') && !cardHolder}
							<p class="mt-1 text-sm text-red-600">Bitte geben Sie den Namen auf der Karte ein</p>
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
				>
					{paymentMethod === 'paypal'
						? 'WEITER ZU PAYPAL'
						: `${totalPrice.toFixed(2)}€ JETZT BEZAHLEN`}
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
