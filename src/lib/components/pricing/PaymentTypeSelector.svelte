<script lang="ts">
	import { PaymentType } from '$lib/types/plans';
	import { i18n } from '$lib/i18n';

	interface Props {
		paymentType: PaymentType;
		onPaymentTypeChange: (type: PaymentType) => void;
	}

	let { paymentType, onPaymentTypeChange } = $props<Props>();
</script>

<!-- Payment Type Toggle -->
<div class="mb-8">
	<div class="flex flex-col items-center justify-center">
		<h4 class="mb-3 text-lg font-semibold text-gray-700">
			{$i18n.pricing.paymentOptions.title}
		</h4>
		<div class="join rounded-lg border border-gray-200 shadow-md">
			<button
				class={`btn join-item ${paymentType === PaymentType.MONTHLY ? 'btn-primary' : 'btn-ghost'}`}
				onclick={() => onPaymentTypeChange(PaymentType.MONTHLY)}
				type="button"
			>
				{$i18n.pricing.paymentOptions.monthly}
			</button>

			<button
				class={`btn join-item ${paymentType === PaymentType.ONE_TIME ? 'btn-primary' : 'btn-ghost'}`}
				onclick={() => onPaymentTypeChange(PaymentType.ONE_TIME)}
				type="button"
			>
				{$i18n.pricing.paymentOptions.oneTime}
			</button>

			<button
				class={`btn join-item hidden md:block lg:block ${paymentType === PaymentType.LONGTIME ? 'btn-primary' : 'btn-ghost'} relative`}
				onclick={() => onPaymentTypeChange(PaymentType.LONGTIME)}
				type="button"
			>
				<span>{$i18n.pricing.paymentOptions.longTime}</span>
				{#if paymentType !== PaymentType.LONGTIME}
					<span
						class="absolute -right-1 -top-1 flex h-5 w-5 rotate-[12deg] animate-pulse items-center justify-center rounded-full bg-red-500 text-[7px] text-white"
					>
						{$i18n.pricing.paymentOptions.hotLabel}
					</span>
				{/if}
			</button>
		</div>
	</div>
</div>
