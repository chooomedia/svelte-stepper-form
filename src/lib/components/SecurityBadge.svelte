<script lang="ts">
	import Icon from './Icon.svelte';

	export let icon: string;
	export let text: string;
</script>

<div class="flex items-center">
	<Icon name={icon} size={20} class="mr-1" />
	<span>{text}</span>
</div>
