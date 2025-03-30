<script lang="ts">
	// utils/payment.ts
	import {
		generateClientReference,
		getPlanDisplayName,
		calculateTax,
		type TaxInfo
	} from '$lib/utils/payment';

	// Stores
	import { taxInfo } from '$lib/stores';

	// Config
	import { PAYPAL_SCRIPT_BASE, BETTERPLACE_API, VAT_RATES, DEFAULT_LOCALE } from '$lib/config';

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

	const totalWithDonation = $derived(
		includeDonation ? Math.round(totalPrice * 103) / 100 : totalPrice
	);

	// Tax calculations
	const currentTax = $derived(calculateTax(totalPrice, $taxInfo.rate));
	const currentVatText = $taxInfo.vatText;

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

	async function initPaymentFlow() {
		await loadPayPalSDK();
		renderPayPalButtons();
		loadBetterplaceProjectInfo();
	}

	async function loadBetterplaceProjectInfo() {
		try {
			const response = await fetch(
				`${BETTERPLACE_API}/projects/${import.meta.env.VITE_BETTERPLACE_PROJECT_ID}.json`
			);
			const data = await response.json();
			showBetterplace = data.open ? true : false;
		} catch (error) {
			console.error('Betterplace project load failed:', error);
		}
	}

	// PayPal Script Loading
	let paypalSDKLoaded = $state(false);

	async function loadPayPalSDK() {
		if (typeof window.paypal !== 'undefined') return;

		const script = document.createElement('script');
		script.src = `${PAYPAL_SCRIPT_BASE}?${getPayPalConfig()}`;
		script.onload = () => (paypalSDKLoaded = true);
		document.head.appendChild(script);
	}

	function getPayPalConfig() {
		return new URLSearchParams({
			'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
			currency: 'EUR',
			intent: 'capture',
			locale: DEFAULT_LOCALE,
			components: ['buttons', 'hosted-fields'].join(','),
			commit: paymentType === 'monatlich' ? 'false' : 'true'
		}).toString();
	}

	// Payment Handlers
	function handlePaymentError(error: unknown) {
		if (error instanceof Error) {
			paymentError = error.message;
		} else {
			paymentError = 'Payment processing failed. Please try again.';
		}
		isProcessing = false;
	}

	// Optimized PayPal Button Rendering
	function renderPayPalButtons() {
		if (!paypalSDKLoaded) return;

		window.paypal
			.Buttons({
				createOrder: paymentType === 'monatlich' ? createSubscriptionOrder : createOneTimeOrder,
				onApprove: async (data, actions) => {
					try {
						isProcessing = true;
						const details = await actions.order.capture();
						await handlePaymentSuccess(details);
					} catch (error) {
						handlePaymentError(error);
					}
				},
				style: getButtonStyle()
			})
			.render('#paypal-button-container');
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
		paymentSuccess = true;
		await trackAnalyticsEvent(details);
		setTimeout(() => {
			onSubmit();
			onClose();
		}, 2000);
	}
</script>

<dialog
	use:enhancedModal
	class="modal backdrop-blur-sm"
	class:modal-open={showModal}
	aria-labelledby="payment-title"
	aria-describedby="payment-description"
>
	<div class="modal-box max-w-2xl overflow-visible p-0">
		<div class="rounded-t-lg bg-base-100 p-6">
			<header class="mb-6 flex items-center justify-between">
				<h2 id="payment-title" class="text-2xl font-bold">
					{getPlanDisplayName(selectedPlan, paymentType)}
				</h2>
				<button onclick={onClose} class="btn btn-ghost btn-sm" aria-label="Close"> ✕ </button>
			</header>

			<!-- Price Summary -->
			<div class="card mb-6 bg-base-200">
				<div class="card-body p-4">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm opacity-75">
								{paymentType === 'monatlich' ? 'Monthly Subscription' : 'One-time Payment'}
							</p>
							{#if includeDonation}
								<p class="badge badge-success mt-2 gap-1">+3% Donation</p>
							{/if}
						</div>
						<div class="text-right">
							<p class="text-3xl font-bold">
								{totalWithDonation.toFixed(2)}€
							</p>
							<p class="text-sm opacity-75">
								incl. {currentVatText}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Payment Options -->
			<div class="join join-vertical w-full">
				<div class="form-control">
					<label class="label join-item cursor-pointer">
						<input
							type="radio"
							name="payment-options"
							class="radio-primary radio"
							checked={paymentMethod === 'paypal'}
							onchange={() => (paymentMethod = 'paypal')}
						/>
						<div class="label-text ml-4">
							<span class="font-medium">PayPal</span>
							<div class="mt-1 flex gap-2">
								{#each ['visa', 'mastercard', 'amex'] as brand}
									<img src={`/${brand}.svg`} alt={brand} class="h-6" />
								{/each}
							</div>
						</div>
					</label>
				</div>

				<div class="form-control">
					<label class="label join-item cursor-pointer">
						<input
							type="radio"
							name="payment-options"
							class="radio-secondary radio"
							checked={paymentMethod === 'betterplace'}
							onchange={() => (paymentMethod = 'betterplace')}
						/>
						<div class="label-text ml-4">
							<span class="font-medium">Include 3% Donation</span>
							<div class="mt-1">
								<img src="/betterplace.svg" alt="Betterplace" class="h-6" />
							</div>
						</div>
					</label>
				</div>
			</div>

			<!-- Donation Notice -->
			{#if paymentMethod === 'betterplace'}
				<div class="alert alert-info mt-4">
					<Icon name="heart" size={20} />
					<span class="text-sm">
						93% of your donation goes directly to support environmental projects.
					</span>
				</div>
			{/if}

			<!-- Payment Form -->
			<div id="paypal-button-container" class="mt-6">
				{#if isProcessing}
					<div class="flex justify-center py-8">
						<span class="loading loading-spinner loading-lg"></span>
					</div>
				{/if}
			</div>

			<!-- Tax Breakdown -->
			<div class="mt-4 rounded-lg bg-base-300 p-4 text-sm">
				<div class="flex justify-between">
					<span>Net Amount:</span>
					<span>{currentTax.net.toFixed(2)}€</span>
				</div>
				<div class="flex justify-between">
					<span>{currentVatText} ({currentTax.rate}%):</span>
					<span>{currentTax.vat.toFixed(2)}€</span>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="rounded-b-lg bg-base-200 p-4">
			<div class="flex flex-wrap justify-center gap-4 text-xs">
				<SecurityBadge icon="lock" text="SSL Secured" />
				<SecurityBadge icon="shield" text="Buyer Protection" />
				<SecurityBadge icon="clock" text="Instant Access" />
			</div>

			<p class="mt-4 text-center text-xs opacity-75">
				By continuing you agree to our<br />
				<a href="/terms" class="link">Terms of Service</a> and
				<a href="/privacy" class="link">Privacy Policy</a>
			</p>
		</div>
	</div>
</dialog>
