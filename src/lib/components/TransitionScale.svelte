<script lang="ts">
	import { transition } from 'svelte/transition';

	export let duration: number = 300;
	export let delay: number = 0;
	export let visible: boolean = false;
</script>

{#if visible}
	<div
		transition:transition={{
			duration,
			delay,
			css: (t) => `
          transform: scale(${t});
          opacity: ${t};
        `
		}}
	>
		<slot />
	</div>
{/if}
