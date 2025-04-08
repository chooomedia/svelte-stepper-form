<script>
	export let totalSteps = 11;
	import { i18n } from '$lib/i18n';
	import Icon from './Icon.svelte';

	const calculateTime = (steps) => {
		return Math.ceil(steps / 3); // Annahme: 3 Schritte pro Minute
	};
</script>

<div class="page-meta mb-6 mt-4 flex flex-row items-center justify-center gap-4 text-center">
	<div
		class="flex items-center space-x-1 rounded-[4px] bg-white p-2 text-xs font-bold shadow-custom"
	>
		<div class="h-4 w-4 bg-[#00B67A] text-white">
			<Icon name="star" size={24} fill="currentColor" stroke="none" />
		</div>
		<p class="font-bold">4.8</p>
		<span class="font-normal">{$i18n.start.meta.rating.from} 5</span>
		<span class="h-4 border-l border-gray-200"></span>
		<p class="font-bold">129</p>
		<span class="font-normal">{$i18n.start.meta.rating.user}</span>
	</div>
	<p class="rounded-[4px] bg-white p-2 text-xs font-bold uppercase shadow-custom">
		{calculateTime(totalSteps)}{$i18n.start.meta.rating.quiztime}
	</p>
</div>
