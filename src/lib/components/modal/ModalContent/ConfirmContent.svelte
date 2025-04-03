<script lang="ts">
	import { modalStore } from '../modalStore';
	import { i18n } from '$lib/i18n';

	const {
		message = $i18n.confirmModal?.cancelPurchase || 'Möchtest du wirklich fortfahren?',
		subMessage = '',
		onConfirm = () => {},
		onCancel = () => {},
		confirmLabel = $i18n.confirmModal?.confirmButton || 'Ja, abbrechen',
		cancelLabel = $i18n.confirmModal?.cancelButton || 'Zurück zum Kaufvorgang',
		previousType = '',
		previousData = {}
	} = $props();

	// Function to handle returning to payment modal with extra discount
	function handleReturnToPayment() {
		// If the previous modal was payment, return to it with extra discount
		if (previousType === 'payment' || $modalStore.data?.previousType === 'payment') {
			// Get the previous data from props or store
			const paymentData = previousData || $modalStore.data?.previousData || {};

			// Return to payment modal with extra discount flag
			modalStore.open('payment', {
				...paymentData,
				showExtraDiscount: true // Enable extra 5% discount
			});
		} else {
			// Otherwise just call the normal onCancel function
			onCancel();
		}
	}
</script>

<div class="confirm-content text-center">
	<p class="mb-4 text-lg text-gray-700">{message}</p>

	{#if subMessage}
		<p class="mb-6 text-sm text-gray-500">{subMessage}</p>
	{/if}

	<!-- Special Offer (improved) -->
	<div class="mb-6 mt-4 rounded-lg bg-primary-100 p-4 text-sm text-secondary-200">
		<p class="font-semibold">
			{$i18n.confirmModal?.extraDiscountOffer ||
				'Exklusiv: 5% Rabatt zusätzlich bei Rückkehr zum Kaufvorgang!'}
		</p>
		<p>
			{$i18n.confirmModal?.discountDetails || 'Wenn du jetzt zurückkehrst, erhältst du insgesamt:'}
		</p>
		<ul class="mt-2 list-inside list-disc text-left">
			<li>{$i18n.confirmModal?.oneTimeDiscount || '13% Rabatt statt 8% bei Einmalzahlung'}</li>
			<li>{$i18n.confirmModal?.longtimeDiscount || '25% Rabatt statt 20% bei Longtime-Zugang'}</li>
		</ul>
		<p class="mt-2">
			{$i18n.confirmModal?.limitedTimeOffer || 'Diese Gelegenheit gilt nur für kurze Zeit!'}
		</p>
	</div>

	<div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center sm:gap-4">
		<button class="btn btn-outline hover:bg-primary-100 hover:text-secondary" onclick={onConfirm}>
			{confirmLabel}
		</button>
		<button class="btn btn-primary relative overflow-hidden" onclick={handleReturnToPayment}>
			<!-- Pulsing effect to draw attention -->
			<span class="absolute inset-0 animate-pulse bg-white opacity-10"></span>
			{cancelLabel}
		</button>
	</div>
</div>
