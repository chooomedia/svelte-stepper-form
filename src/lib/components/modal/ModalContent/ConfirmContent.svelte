<script lang="ts">
	import { modalStore } from '../modalStore';
	import { i18n } from '$lib/i18n';

	const {
		message = $i18n.modal.confirm.cancelPurchase,
		subMessage = '',
		onConfirm = () => {},
		onCancel = () => {},
		confirmLabel = $i18n.modal.confirm.confirmButton,
		cancelLabel = $i18n.modal.confirm.cancelButton,
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
			{$i18n.modal.confirm.extraDiscountOffer}
		</p>
		<p>
			{$i18n.modal.confirm.discountDetails}
		</p>
		<ul class="mt-2 list-inside list-disc text-left">
			<li>{$i18n.modal.confirm.oneTimeDiscount}</li>
			<li>{$i18n.modal.confirm.longtimeDiscount}</li>
		</ul>
		<p class="mt-2">
			{$i18n.modal.confirm.limitedTimeOffer}
		</p>
	</div>

	<div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center sm:gap-4">
		<button class="btn btn-outline hover:bg-primary-100 hover:text-secondary" on:click={onConfirm}>
			{confirmLabel}
		</button>
		<button class="btn btn-primary relative overflow-hidden" on:click={handleReturnToPayment}>
			<!-- Pulsing effect to draw attention -->
			<span class="absolute inset-0 animate-pulse bg-white opacity-10"></span>
			{cancelLabel}
		</button>
	</div>
</div>
