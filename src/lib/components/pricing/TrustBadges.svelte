<script lang="ts">
	import { fade } from 'svelte/transition';
	import { i18n } from '$lib/i18n';
	import Icon from '../atoms/Icon.svelte';
</script>

<!-- Trust Badges -->
<div
	class="mt-6 flex flex-col items-center justify-center space-y-4 text-sm text-gray-600 md:flex-row md:space-x-8 md:space-y-0"
	in:fade={{ duration: 300, delay: 600 }}
>
	<div class="flex items-center">
		<div class="text-primary-500">
			<Icon name="lock" fill="currentColor" size={26} />
		</div>
		{$i18n.pricing.trustBadges[0]}
	</div>
	<div class="flex items-center">
		<div class="text-primary-500">
			<Icon name="plusCircle" fill="currentColor" size={26} />
		</div>
		{$i18n.pricing.trustBadges[1]}
	</div>
</div>
