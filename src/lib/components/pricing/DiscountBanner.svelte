<script lang="ts">
	import { i18n } from '$lib/i18n';

	interface Props {
		isVisible: boolean;
		onPaymentTypeChange: (type: string) => void;
	}

	let { isVisible, onPaymentTypeChange } = $props<Props>();
</script>

<!-- Discount Banner (animated) -->
<div
	class="discount-banner mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl transition-all duration-700"
	class:opacity-0={!isVisible}
	class:opacity-100={isVisible}
	class:scale-95={!isVisible}
	class:scale-100={isVisible}
>
	<div class="relative overflow-hidden p-4">
		<!-- Animated discount percentage -->
		<div
			class="sm-top-4 absolute -right-2 -top-4 flex h-24 w-24 rotate-12 transform items-center justify-center rounded-full bg-yellow-400 transition-transform duration-700 hover:scale-110"
		>
			<div class="-rotate-12 text-center">
				<span class="relative top-1 block text-2xl font-bold text-red-500">-20%</span>
				<span class="relative -top-1 text-xs font-bold text-red-900">LONGTIME</span>
			</div>
		</div>

		<div class="flex flex-col items-center md:flex-row">
			<div class="p-2 md:w-3/4">
				<h3 class="mb-2 text-xl font-bold text-white">
					<span class="block sm:inline">{$i18n.pricing.discountBanner.title}</span>
					<span class="sm:inline">{$i18n.pricing.discountBanner.discount}</span>
				</h3>
				<p class="text-sm text-indigo-100">
					{@html $i18n.pricing.discountBanner.description}
				</p>
			</div>
			<div class="flex justify-center p-2 md:w-1/4 lg:mr-10">
				<button
					onclick={() => onPaymentTypeChange('longtime')}
					class="btn btn-warning transform animate-pulse shadow-lg transition-transform duration-300 hover:scale-105"
				>
					{$i18n.pricing.discountBanner.buttonText}
				</button>
			</div>
		</div>
	</div>
</div>
