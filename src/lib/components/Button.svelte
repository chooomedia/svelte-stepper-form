<script lang="ts">
	export let label: string = 'Weiter';
	export let type: 'button' | 'submit' = 'button';
	export let variant: 'primary' | 'secondary' | 'outline' = 'primary';
	export let isLoading: boolean = false;
	export let isSuccess: boolean = false;
	export let disabled: boolean = false;
</script>

<button
	{type}
	class="btn btn-{variant} {`mt-4 rounded-lg px-4 py-2 font-semibold text-white transition-all
        ${isSuccess ? 'bg-green-500' : 'bg-blue-500'}
        ${isLoading ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'}
    `}"
	disabled={disabled || isLoading}
	on:click
>
	{#if isLoading}
		<!-- 🔄 Ladeanimation -->
		<svg
			class="mr-2 inline-block h-5 w-5 animate-spin"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
			<path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"></path>
		</svg>
	{:else if isSuccess}
		<!-- ✅ Checkmark -->
		<svg
			class="mr-2 inline-block h-5 w-5"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M20 6L9 17l-5-5" />
		</svg>
	{:else}
		{label}
	{/if}
	<slot />
</button>
