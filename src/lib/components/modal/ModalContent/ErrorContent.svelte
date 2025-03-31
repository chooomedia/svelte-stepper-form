<!-- src/lib/components/modal/ModalContent/ErrorContent.svelte -->
<script lang="ts">
	const { error = 'Ein Fehler ist aufgetreten', errorDetails = '', onRetry = 0 } = $props();
</script>

<div class="error-content text-center">
	<div class="mb-6">
		<svg
			class="mx-auto h-14 w-14 text-red-500"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
			/>
		</svg>
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
		<a href="mailto:support@digitalpusher.de" class="text-blue-600 hover:underline">
			Kundensupport
		</a>.
	</p>

	<div class="mt-8 flex justify-center gap-4">
		<button class="btn btn-outline" on:click={onRetry}> Erneut versuchen </button>
	</div>
</div>
