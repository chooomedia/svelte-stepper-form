<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	const { error = 'Ein Fehler ist aufgetreten', errorDetails = '', onRetry = 0 } = $props();
</script>

<div class="error-content text-center">
	<div class="my-3 flex justify-center text-red-500">
		<div class="relative mb-4 h-24 w-24">
			<svg class="absolute inset-0" viewBox="0 0 100 100"
				><circle
					class="text-red-100"
					stroke-width="4"
					stroke="currentColor"
					fill="transparent"
					r="42"
					cx="50"
					cy="50"
				></circle></svg
			>
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
					Technische Details anzeigen
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
		Bei weiteren Problemen wende Dich bitte an unseren
		<a href="mailto:support@digitalpusher.de" class="text-primary-600 hover:underline">
			Kundensupport
		</a>.
	</p>

	<div class="mt-8 flex justify-center gap-4">
		<button class="btn btn-outline hover:bg-primary-100 hover:text-secondary" onclick={onRetry}>
			Erneut versuchen
		</button>
	</div>
</div>
