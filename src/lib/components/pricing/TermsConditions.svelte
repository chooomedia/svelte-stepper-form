<script lang="ts">
	import { fade } from 'svelte/transition';
	import { PaymentType } from '$lib/types/plans';
	import { i18n } from '$lib/i18n';

	interface Props {
		paymentType: PaymentType;
		selectedPlan: string;
		totalPrice: number;
	}

	let { paymentType, selectedPlan, totalPrice } = $props<Props>();
</script>

<!-- Terms -->
<div class="mt-8 text-center text-xs text-gray-500" in:fade={{ duration: 300, delay: 800 }}>
	{@html $i18n.pricing.terms.acceptance.replace(
		/\{paymentType .*?\}/g,
		paymentType === PaymentType.MONTHLY
			? $i18n.pricing.ctaButton.monthly
			: paymentType === PaymentType.ONE_TIME
				? $i18n.pricing.ctaButton.oneTime
				: $i18n.pricing.ctaButton.longTime
	)}

	{#if paymentType === PaymentType.MONTHLY}
		{@html $i18n.pricing.terms.monthly.main
			.replace('{selectedPlan}', selectedPlan)
			.replace('{totalPrice.toFixed(2)}', totalPrice.toFixed(2))}
		{@html $i18n.pricing.terms.monthly.reminder}
	{:else if paymentType === PaymentType.ONE_TIME}
		{@html $i18n.pricing.terms.oneTime.replace('{totalPrice.toFixed(2)}', totalPrice.toFixed(2))}
	{:else}
		{@html $i18n.pricing.terms.oneTime.replace('{totalPrice.toFixed(2)}', totalPrice.toFixed(2))}
	{/if}
</div>
