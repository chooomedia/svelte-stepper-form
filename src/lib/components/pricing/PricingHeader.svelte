<script lang="ts">
	import { fade } from 'svelte/transition';
	import { i18n } from '$lib/i18n';

	interface Props {
		score: number;
		translationLabels: any;
	}

	let { score, translationLabels } = $props<Props>();
</script>

<!-- Header -->
<div class="mb-6 text-center">
	<h3 class="text-2xl font-bold text-gray-900" in:fade={{ duration: 300 }}>
		{$i18n.pricing.header.title}
	</h3>
	<p class="mt-2 text-gray-600" in:fade={{ duration: 300, delay: 200 }}>
		{@html translationLabels.header?.subtitle?.replace('{score}', score.toString()) || ''}
	</p>
</div>
