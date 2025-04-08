<script lang="ts">
	import Icon from './Icon.svelte';

	export let icon: string;
	export let text: string;
</script>

<div class="flex items-center">
	<Icon name={icon} size={20} className="mr-1" fill="none" stroke="currentColor" strokeWidth="2" />
	<span>{text}</span>
</div>
