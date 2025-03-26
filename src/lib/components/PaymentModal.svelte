<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import type { FormData } from '$lib/schema';
	import type { SuperValidated } from 'sveltekit-superforms';

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
	let showBetterplace = $state(false);
	let includeDonation = $state(false);
	let totalWithDonation = $derived(
		includeDonation ? parseFloat(((totalPrice / 100) * 3).toFixed(2)) : totalPrice
	);

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

	// 3% Spendenberechnung
	const animatedDonation = tweened(0, {
		easing: cubicInOut,
		interpolate: (current) => parseFloat(current.toFixed(2))
	});

	$effect(() => {
		loadPaymentScripts();
		animatedDonation.set(includeDonation ? totalPrice * 0.03 : 0);
		if (showModal) resetForm();
	});

	// Reset form
	function resetForm() {
		isProcessing = false;
		paymentSuccess = false;
		paymentError = '';
		redirectUrl = '';
		showBetterplace = false;
	}

	// Handle payment method change with animation trigger
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

	function generateClientReference() {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const random = crypto.getRandomValues(new Uint16Array(1))[0];

		return `dp-${year}${month}-${String(random).padStart(7, '0')}`;
	}

	// Payment processing
	async function handleBetterplacePayment() {
		try {
			isProcessing = true;
			const clientReference = generateClientReference();
			const donationAmount = parseFloat($animatedDonation.toFixed(2)) * 100;

			const response = await fetch('https://api.betterplace.org/de/api_v4/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${import.meta.env.VITE_BETTERPLACE_API_KEY}`
				},
				body: JSON.stringify({
					project_id: import.meta.env.VITE_BETTERPLACE_PROJECT_ID,
					amount_in_cents: donationAmount,
					currency: 'EUR',
					email: form?.data.email,
					message: `3% Spende für IT-Dienstleistungen für ${getPlanDisplayName(selectedPlan, paymentType)}`,
					client_reference: clientReference,
					name: form?.data.name
				})
			});

			if (!response.ok) throw new Error('Payment failed');

			const result = await response.json();
			if (result.redirect_url) {
				redirectUrl = result.redirect_url;
				window.location.href = redirectUrl;
			} else {
				paymentSuccess = true;
				onSubmit();
			}
		} catch (err) {
			paymentError = 'Spende konnte nicht verarbeitet werden';
		} finally {
			isProcessing = false;
		}
	}

	// Form submission
	async function handleSubmit(e: Event) {
		e.preventDefault();
		await handleBetterplacePayment();
	}

	// Close handler
	function handleClose() {
		onClose();
		resetForm();
	}

	function loadPaymentScripts() {
		if (!document.getElementById('paypal-script')) {
			const paypalScript = document.createElement('script');
			paypalScript.id = 'paypal-script';
			paypalScript.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb'}&currency=EUR`;
			paypalScript.async = true;
			paypalScript.onload = () => {
				if (document.getElementById('paypal-button-container')) {
					renderPayPalButton();
				}
			};
			document.head.appendChild(paypalScript);
		}
	}

	function renderPayPalButton() {
		try {
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
							paymentSuccess = true;
							setTimeout(() => {
								onSubmit();
								onClose();
							}, 2000);
						} catch (err) {
							paymentError = 'PayPal-Zahlung fehlgeschlagen';
						} finally {
							isProcessing = false;
						}
					}
				})
				.render('#paypal-button-container');
		} catch (error) {
			console.error('PayPal button rendering error:', error);
			paymentError = 'Fehler beim Laden der PayPal-Zahlungsoption';
		}
	}
</script>

<!-- Modal Structure -->
<div
	class="modal backdrop-blur-[2px] {showModal ? 'modal-open' : ''}"
	transition:fade={{ duration: 300 }}
	onclick={handleClose}
>
	<div
		class="modal-box relative max-w-xl"
		transition:fly={{ y: 20 }}
		onclick={(e) => e.stopPropagation()}
	>
		<div class="mb-6 flex items-center justify-between">
			<h3 class="text-2xl font-bold">Bezahlung abschließen</h3>
			<div class="btn btn-circle btn-sm" onclick={handleClose} aria-label="Schließen">✕</div>
		</div>
		{#if paymentSuccess}
			<!-- Success State -->
			<div class="flex flex-col items-center py-8 text-center" in:scale={{ duration: 400 }}>
				<div class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
					<svg
						class="h-16 w-16 text-green-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
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

				{#if includeDonation}
					<div
						class="mb-6 max-w-md rounded-lg bg-emerald-50 p-4 text-center"
						in:fly={{ y: 20, delay: 200 }}
					>
						<p class="text-emerald-700">
							Deine Spende von <strong class="font-mono">
								{$animatedDonation.toFixed(2).replace('.', ',')}€
							</strong> trägt dazu bei, unsere Welt ein Stück besser zu machen. Vielen Dank für Deine
							Unterstützung!
						</p>
					</div>
				{/if}

				{#if redirectUrl}
					<a
						href={redirectUrl}
						class="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
						target="_blank"
						rel="noopener noreferrer"
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
				<div class="mb-4 rounded-lg bg-red-100 p-4 text-red-700" role="alert">
					<div class="flex items-center">
						<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
								clip-rule="evenodd"
							/>
						</svg>
						{paymentError}
					</div>
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
							{:else if paymentType === 'longtime'}
								5 Jahre exklusiven Zugang
							{/if}

							{#if includeDonation}
								<span class="mt-1 text-sm text-emerald-600">
									inkl. {totalWithDonation.toFixed(2).replace('.', ',')}€ Spende
								</span>
							{/if}
						</p>
					</div>
					<div class="text-right">
						<div class="text-2xl font-bold">{totalPrice.toFixed(2).replace('.', ',')}€</div>
						{#if paymentType === 'einmalig'}
							<span class="text-sm text-green-600">8% Rabatt</span>
						{:else if paymentType === 'longtime'}
							<span class="text-sm text-green-600">20% Rabatt</span>
						{/if}
					</div>
				</div>
			</div>

			<form id="payment-form" onsubmit={handleSubmit} novalidate>
				<!-- Payment Method Selection -->
				<div class="mb-6 space-y-3">
					<!-- PayPal Input -->
					<label
						class="group relative flex cursor-pointer items-center rounded-lg border p-4 transition-all
       duration-200 hover:border-blue-200 hover:bg-blue-50
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
						<div class="ml-auto flex items-center gap-2 pl-4">
							<img src="/paypal.svg" alt="PayPal" class="h-6" />
							<img src="/visa.svg" alt="Visa" class="h-6" />
							<img src="/mastercard.svg" alt="Mastercard" class="h-6" />
							<img src="/maestro.svg" alt="Maestro" class="h-6" />
							<img src="/amex.svg" alt="American Express" class="h-6" />
						</div>
					</label>

					<!-- Betterplace Input -->
					<label
						class="group relative flex cursor-pointer items-center rounded-lg border p-4 transition-all
       duration-200 hover:border-emerald-200 hover:bg-emerald-50
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
						<div class="ml-auto pl-4">
							<img src="/betterplace.svg" alt="Betterplace" class="h-6" />
						</div>
					</label>
					<!-- Payment Method Content -->
					<div class="mb-8">
						{#if includeDonation}
							<div
								class="mb-4 mt-4 flex items-start gap-3 rounded-lg bg-emerald-50 p-4 text-sm"
								transition:fly={{ y: 20 }}
							>
								<div class="heart-icon text-2xl">❤️</div>
								<p class="text-xs text-emerald-700">
									Mit jedem Euro unterstützen Sie direkt [konkrete Maßnahme].
									<span class="font-semibold">93% Ihrer Spende</span> fließen unmittelbar in [konkreten
									Zweck] - nachweislich und transparent!
								</p>
							</div>
						{/if}
						<div id="paypal-button-container" class="mb-4"></div>
					</div>
				</div>

				<!-- Security Indicators -->
				<div class="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
					<div class="flex items-center justify-center gap-1 text-xs text-gray-600">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-green-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path
								d="M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
							/>
						</svg>
						<span>Sichere Bezahlung</span>
					</div>
					<div class="flex items-center justify-center gap-1 text-xs text-gray-600">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-green-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path
								d="M9 12L11 14L15 9.99999M20 12C20 16.4611 14.54 19.6937 12.6414 20.683C12.4361 20.79 12.3334 20.8435 12.191 20.8712C12.08 20.8928 11.92 20.8928 11.809 20.8712C11.6666 20.8435 11.5639 20.79 11.3586 20.683C9.45996 19.6937 4 16.4611 4 12V8.21759C4 7.41808 4 7.01833 4.13076 6.6747C4.24627 6.37113 4.43398 6.10027 4.67766 5.88552C4.9535 5.64243 5.3278 5.50207 6.0764 5.22134L11.4382 3.21067C11.6461 3.13271 11.75 3.09373 11.857 3.07827C11.9518 3.06457 12.0482 3.06457 12.143 3.07827C12.25 3.09373 12.3539 3.13271 12.5618 3.21067L17.9236 5.22134C18.6722 5.50207 19.0465 5.64243 19.3223 5.88552C19.566 6.10027 19.7537 6.37113 19.8692 6.6747C20 7.01833 20 7.41808 20 8.21759V12Z"
							/>
						</svg>
						<span>Käuferschutz</span>
					</div>
					<div class="flex items-center justify-center gap-1 text-xs text-gray-600">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-green-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path
								d="M16 7L12.5 11M8 12L13.25 17L22 7M2 12L7.25 17C7.25 17 8.66939 15.3778 9.875 14"
							/>
						</svg>
						<span>Jederzeit kündbar</span>
					</div>
				</div>
			</form>

			<!-- Footer Links -->
			<div class="mt-6 text-center text-xs text-gray-500">
				Mit der Bestellung akzeptierst du unsere
				<a href="#" class="text-blue-600 underline hover:text-blue-800">AGB</a> und
				<a href="#" class="text-blue-600 underline hover:text-blue-800">Datenschutzerklärung</a>.
			</div>
		{/if}
	</div>
</div>
