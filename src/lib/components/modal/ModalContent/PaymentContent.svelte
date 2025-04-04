<!-- src/lib/components/modal/ModalContent/PaymentContent.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { modalStore } from '../modalStore';
	import SecurityBadge from '../../SecurityBadge.svelte';
	import Icon from '../../Icon.svelte';
	import { calculateTax } from '$lib/utils/payment';
	import { taxInfo } from '$lib/stores/taxStore';
	import { PAYPAL_SCRIPT_BASE } from '$lib/config';
	import { currencyStore } from '$lib/stores/currencyStore';

	// Props
	const {
		selectedPlan = '3-MONATS-PLAN',
		paymentType = 'monatlich',
		totalPrice = 0,
		showExtraDiscount = false,
		onSuccess = () => {}
	} = $props();

	// State
	let paymentMethod: 'paypal' | 'betterplace' = $state('paypal');
	let isProcessing = $state(false);
	let includeDonation = $state(false);
	let showVatTooltip = $state(false);
	let showBetterplace = $state(false);
	let paypalSDKLoaded = $state(false);
	let timers: number[] = [];
	let numericTotalPrice = $state(0);
	let totalWithDonation = $state(0);

	const currentTax = $derived(calculateTax(totalPrice, $taxInfo.rate));
	const currentVatText = $derived($taxInfo.vatText);
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

	// Security options
	const securityOptions = [
		{ icon: 'lock', text: 'SSL Gesichert' },
		{ icon: 'shield', text: 'Käuferschutz' },
		{ icon: 'clock', text: 'Sofortiger Zugang' }
	];

	$effect(() => {
		numericTotalPrice =
			typeof totalPrice === 'number' ? totalPrice : parseFloat(String(totalPrice)) || 0;
	});

	$effect(() => {
		// Berechnung mit gesichertem numerischen Wert
		totalWithDonation = includeDonation
			? numericTotalPrice + numericTotalPrice * 0.03
			: numericTotalPrice;
	});

	// Helper function for timer management
	function addTimer(callback: () => void, delay: number): number {
		const id = setTimeout(callback, delay);
		timers.push(id);
		return id;
	}

	function clearAllTimers(): void {
		timers.forEach(clearTimeout);
		timers = [];
	}

	// PayPal integration
	async function loadPayPalSDK(): Promise<void> {
		if (typeof window !== 'undefined' && typeof window.paypal !== 'undefined') {
			paypalSDKLoaded = true;
			return;
		}

		try {
			// For development, use a simpler configuration
			const isDev = import.meta.env.DEV;
			let scriptUrl;

			if (isDev) {
				// Use minimal configuration for development
				scriptUrl = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=EUR&components=buttons`;
			} else {
				// Use full configuration for production
				scriptUrl = `${PAYPAL_SCRIPT_BASE}?${getPayPalConfig()}`;
			}

			console.log('Loading PayPal SDK from:', scriptUrl);

			const script = document.createElement('script');
			script.src = scriptUrl;
			script.async = true;
			script.id = 'paypal-script';

			// Create a promise to wait for script load
			const scriptLoadPromise = new Promise<void>((resolve, reject) => {
				script.onload = () => {
					console.log('PayPal SDK loaded successfully');
					paypalSDKLoaded = true;
					resolve();
				};

				script.onerror = (err) => {
					console.error('Error loading PayPal SDK:', err);
					reject(new Error('Failed to load PayPal SDK'));
				};
			});

			// Add script to DOM
			document.head.appendChild(script);

			// Wait for script to load
			await scriptLoadPromise;

			// Check if component is still mounted before rendering
			const container = document.getElementById('paypal-button-container');
			if (container) {
				setTimeout(() => {
					renderPayPalButtons();
				}, 300);
			}
		} catch (error) {
			console.error('Failed to load PayPal SDK:', error);
			modalStore.open('error', {
				error: 'Fehler beim Laden des PayPal SDKs. Bitte versuche es später erneut.'
			});
		}
	}

	// Configure PayPal parameters
	function getPayPalConfig(): string {
		const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
		const isSandbox = import.meta.env.DEV;

		// Log the raw taxInfo for debugging
		console.log('PayPal config - taxInfo:', JSON.stringify($taxInfo));
		console.log('PayPal config - currencyStore:', $currencyStore);

		// Get country code and ensure it's valid
		const rawCountryCode = $taxInfo.country;
		console.log('Raw country code from taxInfo:', rawCountryCode);

		// Valid country codes for PayPal
		const validCountryCodes = [
			'US',
			'GB',
			'DE',
			'FR',
			'IT',
			'ES',
			'CA',
			'AU',
			'AT',
			'BE',
			'CH',
			'NL'
		];

		// Normalize country code
		let countryCode;
		if (rawCountryCode === 'UK' || rawCountryCode === 'EN') {
			countryCode = 'GB';
		} else if (validCountryCodes.includes(rawCountryCode)) {
			countryCode = rawCountryCode;
		} else {
			// Default to a safe country code
			countryCode = 'DE';
			console.warn(`Invalid country code: ${rawCountryCode}, using default: DE`);
		}

		// Build params without buyer-country for now
		const params: Record<string, string> = {
			'client-id': clientId || 'test',
			currency: $currencyStore || 'EUR',
			intent: 'capture',
			locale: 'de_DE',
			components: 'buttons',
			commit: 'true'
		};

		// Development mode parameters
		if (isSandbox) {
			params['disable-funding'] = 'paylater,credit';
			params['enable-funding'] = 'venmo';
			params.debug = 'true';
		}

		// Log the final PayPal configuration URL
		const configString = new URLSearchParams(params).toString();
		console.log('PayPal config URL:', `${PAYPAL_SCRIPT_BASE}?${configString}`);

		return configString;
	}

	function renderPayPalButtons(): void {
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
					// Verbesserte createOrder-Funktion
					createOrder: async (data: any, actions: any) => {
						try {
							isProcessing = true;
							console.log('Creating PayPal order...');

							// Validiere den Betrag
							const amount = parseFloat(totalWithDonation.toFixed(2));
							if (isNaN(amount) || amount <= 0) {
								console.error('Invalid amount:', amount);
								isProcessing = false;
								modalStore.open('error', {
									error: 'Ungültiger Zahlungsbetrag. Bitte versuche es erneut.'
								});
								return null;
							}

							console.log('Creating order with amount:', amount);

							// In development mode, use the mock payment function instead of loading PayPal SDK
							if (import.meta.env.DEV) {
								// Don't actually try to load PayPal in development mode
								console.log('Development mode: Using mock payment instead of PayPal');
								paypalSDKLoaded = true; // Pretend it's loaded
								// Add a message or visual indicator in the UI
								const container = document.getElementById('paypal-button-container');
								if (container) {
									container.innerHTML = `
            <button class="btn btn-primary w-full" onclick="mockPaymentForTesting()">
                Test Payment (Development Mode)
            </button>
            <p class="mt-2 text-xs text-gray-500">
                PayPal integration disabled in development mode. Click to simulate payment.
            </p>
        `;
								}
							}

							// Erstelle die Bestellung mit PayPal
							const orderData = {
								purchase_units: [
									{
										amount: {
											value: amount.toString(),
											currency_code: 'EUR'
										},
										description: selectedPlan
									}
								],
								application_context: {
									shipping_preference: 'NO_SHIPPING'
								}
							};

							console.log('Order data:', orderData);
							const result = await actions.order.create(orderData);
							console.log('Order created successfully:', result);
							return result;
						} catch (error) {
							console.error('Error in createOrder:', error);
							isProcessing = false;

							// Spezifische Fehlerbehandlung
							let errorMessage = 'Fehler beim Erstellen der Bestellung. Bitte versuche es erneut.';

							if (error instanceof Error) {
								if (
									error.message.includes('INTERNAL_SERVER_ERROR') ||
									error.message.includes('500')
								) {
									errorMessage =
										'Der PayPal-Service ist vorübergehend nicht verfügbar. Bitte versuche es später erneut.';
								}
							}

							modalStore.open('error', { error: errorMessage });
							return null;
						}
					},

					// Verbesserte onApprove-Funktion
					onApprove: async (data: any, actions: any) => {
						try {
							console.log('Payment approved, order ID:', data.orderID);
							isProcessing = true;

							if (!data.orderID) {
								throw new Error('Keine Order-ID erhalten.');
							}

							// Capture the funds
							const details = await actions.order.capture();
							console.log('Order captured:', details);

							// Call success callback with details
							onSuccess(details);
						} catch (error) {
							console.error('Error capturing order:', error);
							handlePaymentError(error);
						}
					},

					onCancel: () => {
						isProcessing = false;
						console.log('Payment was cancelled');
						modalStore.open('error', {
							error: 'Die Zahlung wurde abgebrochen.'
						});
					},

					onError: (err: any) => {
						console.error('PayPal error:', err);

						let errorMessage = 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.';

						// Erkennen der verschiedenen Fehlertypen
						if (err.message === 'VALIDATION_ERROR') {
							errorMessage = 'Bitte überprüfe deine Zahlungsdaten';
						} else if (err.message?.includes('popup')) {
							errorMessage =
								'Das PayPal-Fenster wurde blockiert. Bitte erlaube Popups für diese Seite.';
						} else if (
							err.message?.includes('500') ||
							err.message?.includes('INTERNAL_SERVER_ERROR')
						) {
							errorMessage =
								'Der PayPal-Service ist vorübergehend nicht verfügbar. Bitte versuche es später erneut oder wähle eine andere Zahlungsmethode.';
						}

						handlePaymentError({ message: errorMessage });
					},

					style: {
						layout: 'vertical',
						color: paymentType === 'monatlich' ? 'blue' : 'gold',
						shape: 'rect',
						label: paymentType === 'monatlich' ? 'subscribe' : 'pay',
						height: 55,
						tagline: false
					}
				})
				.render('#paypal-button-container')
				.catch((err: any) => {
					console.error('Error rendering PayPal buttons:', err);
					modalStore.open('error', {
						error: 'Fehler beim Rendern der PayPal-Schaltflächen. Bitte versuche es später erneut.'
					});
				});
		} catch (error) {
			console.error('Error setting up PayPal buttons:', error);
			modalStore.open('error', {
				error: 'Fehler beim Einrichten der PayPal-Schaltflächen. Bitte versuche es später erneut.'
			});
		}
	}

	// Handle payment errors
	function handlePaymentError(error: unknown): void {
		console.error('Payment error:', error);
		isProcessing = false;

		let errorMessage = 'Die Zahlung konnte nicht verarbeitet werden. Bitte versuche es erneut.';

		if (error instanceof Error) {
			errorMessage = error.message;
		} else if (typeof error === 'object' && error !== null) {
			errorMessage = (error as any).message || errorMessage;
		}

		modalStore.open('error', { error: errorMessage });
	}

	// Handle donation toggle
	function toggleDonation(): void {
		includeDonation = !includeDonation;

		if (includeDonation) {
			showBetterplace = true;
		} else {
			showBetterplace = false;
		}

		// Re-render PayPal buttons with updated amount
		addTimer(() => {
			renderPayPalButtons();
		}, 300);
	}

	// Handle payment method change
	function handlePaymentMethodChange(method: 'paypal' | 'betterplace'): void {
		if (method === 'paypal') {
			paymentMethod = 'paypal';
		} else if (method === 'betterplace') {
			includeDonation = true;
			showBetterplace = true;
		}
	}

	// Lifecycle hooks
	onMount(() => {
		loadPayPalSDK();
	});

	onDestroy(() => {
		clearAllTimers();
	});

	function mockPaymentForTesting() {
		isProcessing = true;

		console.log('Simulating payment process for testing');

		// Simuliere eine Verzögerung von 2 Sekunden
		setTimeout(() => {
			isProcessing = false;

			// Simuliere eine erfolgreiche Zahlung
			const mockPaymentDetails = {
				id: 'DP-TEST-' + Math.random().toString(36).substring(2, 10),
				status: 'COMPLETED',
				payer: {
					email_address: 'chooom@gmx.de',
					name: {
						given_name: 'Siegfried',
						surname: 'Freud'
					}
				},
				purchase_units: [
					{
						amount: {
							value: totalWithDonation.toFixed(2),
							currency_code: 'EUR'
						},
						description: selectedPlan
					}
				],
				create_time: new Date().toISOString()
			};

			// Rufe den Erfolgs-Callback mit den simulierten Daten auf
			onSuccess(mockPaymentDetails);
		}, 2000);
	}
</script>

<!-- Price Summary -->
<div class="card">
	<div class="card-body mb-4 rounded-lg bg-base-200 p-4">
		<div class="flex items-center justify-between">
			<div>
				<h4 class="text-lg font-semibold" itemprop="name">
					{selectedPlan}
				</h4>
				<div class="flex gap-1">
					<p class="text-sm opacity-75">
						{paymentType === 'monatlich'
							? 'Monatliche Zahlung'
							: paymentType === 'einmalig'
								? 'Einmalzahlung'
								: 'Longtime-Zugang'}
					</p>
					{#if discountPercentage > 0}
						<p class="text-sm text-error" itemprop="discount">
							{discountPercentage}% Rabatt
						</p>
					{/if}
					{#if includeDonation}
						<p class="text-sm text-success" itemprop="donation">
							inkl. {(totalPrice * 0.03).toFixed(2).replace('.', ',')}€ Spende
						</p>
					{/if}
				</div>
			</div>
			<div class="text-right">
				<p class="text-2xl font-bold">
					{totalPrice.toFixed(2).replace('.', ',')}€
				</p>

				<!-- Tax info tooltip -->
				<div
					class="tooltip tooltip-left text-sm"
					data-tip={`Netto: ${currentTax.net.toFixed(2).replace('.', ',')}€\nMwSt. (${currentTax.rate}%): ${currentTax.vat.toFixed(2).replace('.', ',')}€`}
				>
					<button
						class="flex-start flex gap-1 text-gray-400 hover:text-gray-600"
						onmouseenter={() => (showVatTooltip = true)}
						onmouseleave={() => (showVatTooltip = false)}
						onfocus={() => (showVatTooltip = true)}
						onblur={() => (showVatTooltip = false)}
						aria-label="MwSt Info"
						type="button"
					>
						<Icon name="question" size={20} color="currentColor" />
						<p itemprop="tax">inkl. {currentVatText}</p>
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Payment Options -->
	<div class="mb-1 space-y-3">
		<!-- PayPal Input -->
		<label
			class="form-input group cursor-pointer bg-primary-50 ring-2 ring-primary"
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
						class="absolute inset-0 rounded-md border-2 border-primary bg-primary transition-all"
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
	</div>

	<div class="mt-3 rounded-lg border border-gray-200 p-4 shadow-custom">
		<!-- Betterplace Info Box -->
		{#if includeDonation}
			<div
				class="mb-4 flex items-start gap-3 rounded-md border border-green-200 bg-green-100 p-4 text-sm"
				in:fly={{ y: 20, delay: 100 }}
			>
				<div class="heart-icon animate-pulse text-2xl">❤️</div>
				<p class="text-xs text-emerald-700">
					Mit jedem Euro unterstützt Du direkt Umweltschutzprojekte.
					<span class="font-semibold">93% Deiner Spende</span> fließt unmittelbar in nachhaltige Projekte
					- nachweislich und transparent!
				</p>
			</div>
		{/if}

		<!-- PayPal Button Container -->
		<div id="paypal-button-container">
			{#if isProcessing}
				<div class="flex justify-center py-8">
					<span class="loading loading-spinner loading-lg"></span>
				</div>
			{/if}
		</div>

		<!-- Security Badges -->
		<div
			class="mt-1 flex flex-wrap justify-center gap-2 text-[9px] text-[#7b8388] lg:gap-4 lg:text-[11px]"
		>
			{#each securityOptions as { icon, text }}
				<SecurityBadge {icon} {text} />
			{/each}
		</div>
	</div>
</div>

{#if import.meta.env.DEV}
	<div class="mt-4 border-t border-gray-200 pt-4">
		<button
			class="btn btn-secondary w-full"
			onclick={mockPaymentForTesting}
			disabled={isProcessing}
		>
			Test-Zahlung simulieren (nur für Entwicklung)
		</button>
		<p class="mt-2 text-xs text-gray-500">
			Dies ist nur für Testzwecke und simuliert eine erfolgreiche Zahlung.
		</p>
	</div>
{/if}
