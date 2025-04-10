<script lang="ts">
	import { modalStore } from '../modalStore';
	import { i18n } from '$lib/i18n';
	import Icon from '../../Icon.svelte';

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

	// Function to handle returning to payment modal
	function handleReturnToPayment() {
		// If the previous modal was payment, return to it
		if (previousType === 'payment' || $modalStore.data?.previousType === 'payment') {
			// Get the previous data from props or store
			const paymentData = previousData || $modalStore.data?.previousData || {};

			// Return to payment modal without adding extra discount
			modalStore.open('payment', paymentData);
		} else {
			// Otherwise just call the normal onCancel function
			onCancel();
		}
	}
</script>

<div class="confirm-content text-center">
	{#if subMessage}
		<p class="mb-6 text-sm text-gray-500">{subMessage}</p>
	{/if}

	<!-- Premium Bonus Offering (enhanced) -->
	<div class="relative mb-6 overflow-hidden rounded-lg bg-primary-100 pt-14 shadow-custom lg:pt-8">
		<!-- Limited Time Offer Badge with animation -->
		<div class="absolute left-4 top-4 z-10">
			<span
				class="animate-bouncing inline-block rounded-full bg-yellow-300 px-3 py-1 text-xs font-bold text-secondary-800 shadow-md"
			>
				{$i18n.pricing.bonusBox.limited || 'Limited Time Offer'}
			</span>
		</div>

		<picture>
			<!-- Fallback if webp not supported -->
			<source srcset="/special-offer-gift-present.webp" type="image/webp" />
			<!-- SVG Fallback for ultimate compatibility -->
			<img
				src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 250' fill='%236BD0D9'%3E%3Crect width='1000' height='250'/%3E%3Ctext x='500' y='125' font-family='sans-serif' font-size='36' text-anchor='middle' fill='%23002B2F'%3EExclusive Bonus%3C/text%3E%3C/svg%3E"
				alt="Exclusive Blog Article Bonus Gift"
				class="h-48 w-full object-contain object-center lg:h-64"
				loading="eager"
				fetchpriority="high"
			/>
		</picture>

		<!-- Content Section -->
		<div class="p-4">
			<h3 class="mb-2 text-lg font-bold text-secondary-800">
				{$i18n.pricing.bonusBox.title || 'FREE High-Impact Blog Article'}
			</h3>

			<p class="mb-4 text-sm text-gray-600">
				{$i18n.pricing.bonusBox.description ||
					'Complete your purchase now and receive a custom, SEO-optimized blog post designed to boost your online visibility!'}
			</p>

			<div class="space-y-2">
				{#each $i18n.pricing.bonusBox.benefits || ['Tailored exclusively to your business', 'SEO-engineered for maximum visibility', 'Instant boost for your online presence'] as benefit}
					<div class="flex items-center text-sm">
						<Icon
							name="check"
							size={16}
							className="mr-2 text-primary-600"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
						/>
						<span>{benefit}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center sm:gap-4">
		<button class="btn btn-outline hover:bg-primary-100 hover:text-secondary" on:click={onConfirm}>
			{confirmLabel}
		</button>
		<button class="btn btn-primary relative overflow-hidden" on:click={handleReturnToPayment}>
			<!-- Subtle pulsing effect -->
			<span class="absolute inset-0 animate-pulse bg-white opacity-10"></span>
			{cancelLabel}
		</button>
	</div>
</div>
