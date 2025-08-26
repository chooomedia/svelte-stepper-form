<script lang="ts">
	import { i18n } from '$lib/i18n';
	import Icon from '../atoms/Icon.svelte';

	interface Props {
		isVisible: boolean;
		benefits: string[];
	}

	let { isVisible, benefits } = $props<Props>();
</script>

<!-- Bonus-Box für Aktionsangebot -->
<div
	class="bonus-box mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-secondary-200 to-secondary-700 shadow-xl"
	class:opacity-0={!isVisible}
	class:opacity-100={isVisible}
	class:translate-y-0={isVisible}
	class:translate-y-8={!isVisible}
	style="transition: opacity 0.7s ease-out, transform 0.5s ease-out;"
>
	<div class="flex flex-col md:flex-row">
		<div class="p-6 md:w-2/3">
			<div
				class="inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-gray-900"
			>
				{$i18n.pricing.bonusBox.tag}
			</div>
			<h3 class="mt-3 text-2xl font-bold text-white">{$i18n.pricing.bonusBox.title}</h3>
			<p class="mt-2 text-blue-100">
				{$i18n.pricing.bonusBox.description}
			</p>
			<div class="mt-4 space-y-2">
				{#each benefits as benefit}
					<div class="mt-2 flex items-center">
						<div
							class="flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-lg font-bold text-secondary"
						>
							✓
						</div>
						<p class="text-md ml-3 text-primary-100">
							{benefit}
						</p>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex items-center justify-center bg-secondary-500 p-6 md:w-1/3">
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary-600 text-secondary"
				>
					<Icon
						name="document"
						size={50}
						stroke="currentColor"
						strokeWidth="2"
						fill="none"
						viewBox="0 0 24 24"
					/>
				</div>
				<p class="text-lg font-semibold text-white">{$i18n.pricing.bonusBox.value}</p>
				<p class="text-xs text-primary-300">{$i18n.pricing.bonusBox.limited}</p>
			</div>
		</div>
	</div>
</div>
