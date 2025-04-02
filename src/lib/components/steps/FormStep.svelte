<!-- src/lib/components/FormStep.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';

	// Props
	interface Props {
		title?: string;
		subtitle?: string;
		id?: string;
		fullWidth?: boolean;
	}

	const { title = '', subtitle = '', id = 'form-step', fullWidth = false } = $props<Props>();
</script>

<div
	class="form-step w-full {fullWidth ? '' : 'mx-auto max-w-4xl'}"
	{id}
	in:fade={{ duration: 300 }}
>
	{#if title}
		<h3 class="mb-4 text-lg font-medium text-secondary-800">{title}</h3>
	{/if}

	{#if subtitle}
		<p class="mb-6 text-sm text-gray-600">{subtitle}</p>
	{/if}

	<div class="form-step-content">
		<slot />
	</div>

	<!-- Optional footer slot -->
	{#if $$slots.footer}
		<div class="mt-6 border-t border-gray-200 pt-4">
			<slot name="footer" />
		</div>
	{/if}
</div>

<style>
	.form-step-content {
		min-height: 150px;
	}
</style>
