<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let autoAdvance = 7;
	export let nextStep: () => void;
	let timeout: ReturnType<typeof setTimeout>;

	onMount(() => {
		timeout = setTimeout(nextStep, autoAdvance * 1000);
	});

	onDestroy(() => {
		clearTimeout(timeout);
	});
</script>

<div class="waiting-screen flex flex-col items-center">
	<div class="spinner"></div>
	<p class="text-lg text-gray-600">⏳ Bitte habe einen Moment Geduld...</p>
</div>

<style>
	.spinner {
		width: 50px;
		height: 50px;
		border: 5px solid rgba(0, 0, 0, 0.1);
		border-top-color: #00c853;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
