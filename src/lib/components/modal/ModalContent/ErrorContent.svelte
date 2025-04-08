<!-- src/lib/components/modal/ModalContent/ErrorContent.svelte -->
<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { i18n } from '$lib/i18n';

	const {
		error = $i18n.modal.error.defaultMessage,
		errorDetails = '',
		onRetry = () => {}
	} = $props();
</script>

<div class="error-content text-center">
	<div class="my-3 flex justify-center text-red-500">
		<div class="relative mb-4 h-24 w-24">
			<svg class="absolute inset-0" viewBox="0 0 100 100">
				<circle
					class="text-red-100"
					stroke-width="4"
					stroke="currentColor"
					fill="transparent"
					r="42"
					cx="50"
					cy="50"
				></circle>
			</svg>
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="h-16 w-16 animate-ping rounded-full bg-red-400 opacity-30"></div>
			</div>
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="text-red-600">
					<Icon name="alertTriangle" size={64} />
				</div>
			</div>
		</div>
	</div>

	<p class="mb-6 text-lg text-gray-700">{error}</p>

	{#if errorDetails}
		<div class="mx-auto mt-4 w-full max-w-md">
			<details class="text-left">
				<summary class="mb-2 cursor-pointer text-sm text-blue-600 hover:text-blue-800">
					{$i18n.modal.error.details}
				</summary>
				<div
					class="max-h-32 overflow-auto rounded-md bg-gray-100 p-3 text-left font-mono text-xs text-gray-700"
				>
					{errorDetails}
				</div>
			</details>
		</div>
	{/if}

	<p class="mt-6 text-sm text-gray-500">
		{$i18n.modal.error.support}
		<a href="mailto:support@digitalpusher.de" class="text-primary-600 hover:underline">
			{$i18n.common.support}
		</a>
	</p>

	<div class="mt-8 flex justify-center gap-4">
		<button class="btn btn-outline hover:bg-primary-100 hover:text-secondary" on:click={onRetry}>
			{$i18n.modal.error.retry}
		</button>
	</div>
</div>
