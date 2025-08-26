<script lang="ts">
	import { i18n } from '$lib/i18n';
	import Icon from '../atoms/Icon.svelte';
	import Countdown from '../atoms/Countdown.svelte';

	interface Props {
		hours: number;
		minutes: number;
		seconds: number;
		discountDuration: number;
	}

	let { hours, minutes, seconds, discountDuration } = $props<Props>();
</script>

<!-- Countdown Timer -->
<div class="mb-6 rounded-lg bg-gradient-to-r from-red-50 to-red-100 p-4 shadow-md">
	<div class="flex flex-col items-center justify-between md:flex-row">
		<div class="mb-2 flex items-center space-x-2 md:mb-0">
			<span class="text-red-600">
				<Icon name="clock" size={24} stroke="currentColor" strokeWidth="2" fill="none" />
			</span>
			<div>
				<span class="text-lg font-bold text-red-600">{$i18n.pricing.countdown.title}</span>
				<span class="text-gray-700">{$i18n.pricing.countdown.subtitle}</span>
			</div>
		</div>

		<div class="flex space-x-2">
			<div
				class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 font-mono text-xl font-bold text-white"
			>
				{hours.toString().padStart(2, '0')}
			</div>
			<span class="text-xl font-bold text-red-600">:</span>
			<div
				class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 font-mono text-xl font-bold text-white"
			>
				{minutes.toString().padStart(2, '0')}
			</div>
			<span class="text-xl font-bold text-red-600">:</span>
			<div
				class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 font-mono text-xl font-bold text-white"
			>
				{seconds.toString().padStart(2, '0')}
			</div>
		</div>
	</div>

	<!-- Fortschrittsbalken -->
	<Countdown
		duration={discountDuration}
		textClass="hidden"
		showProgressBar={true}
		progressBarColor="bg-red-500"
		progressBarHeight="h-1"
		progressBarClass="mt-2 rounded-full"
	/>
</div>
