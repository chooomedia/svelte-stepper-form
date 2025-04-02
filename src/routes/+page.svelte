<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import MarketingAssessmentForm from '$lib/components/MarketingAssessmentForm.svelte';
	import { browser } from '$app/environment';
	import { stepperStore } from '$lib/stores/stepperStore';

	// Props
	const { data } = $props();

	// Is in development mode?
	const isDev = import.meta.env.DEV;

	// Initialize the form with SuperForms
	const { form, enhance, errors, submitting } = superForm(data.form, {
		dataType: 'json',
		resetForm: false
	});

	// Debug controls (only in dev mode)
	let showDebugSidebar = $state(false);
	let debugStepNumber = $state(1);

	function toggleDebugSidebar() {
		showDebugSidebar = !showDebugSidebar;
	}

	function handleStepChange(event: Event) {
		const newStep = parseInt((event.target as HTMLInputElement).value, 10);
		if (newStep >= 1) {
			debugStepNumber = newStep;
			stepperStore.goToStep(newStep);
		}
	}

	function prevStep() {
		debugStepNumber = Math.max(1, debugStepNumber - 1);
		stepperStore.goToStep(debugStepNumber);
	}

	function nextStep() {
		debugStepNumber++;
		stepperStore.goToStep(debugStepNumber);
	}
</script>

<div
	class="form-container relative mx-auto w-full"
	itemscope
	itemtype="https://schema.org/WebApplication"
>
	<!-- Main Form -->
	<MarketingAssessmentForm {form} errors={$errors} />
</div>

<!-- Debug Panel (dev mode only) -->
{#if isDev}
	<button
		class="fixed left-4 top-4 z-50 rounded-full bg-gray-800 p-2 text-white shadow-lg hover:bg-gray-700"
		on:click={toggleDebugSidebar}
		aria-label="Toggle Debug Panel"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6">
			<path
				fill="currentColor"
				d="M4.6 15c-.9-2.6-.6-4.6-.5-5.4 2.4-1.5 5.3-2 8-1.3.7-.3 1.5-.5 2.3-.6-.1-.3-.2-.5-.3-.8h2l1.2-3.2-.9-.4-1 2.6h-1.8C13 4.8 12.1 4 11.1 3.4l2.1-2.1-.7-.7L10.1 3c-.7 0-1.5 0-2.3.1L5.4.7l-.7.7 2.1 2.1C5.7 4.1 4.9 4.9 4.3 6H2.5l-1-2.6-.9.4L1.8 7h2C3.3 8.3 3 9.6 3 11H1v1h2c0 1 .2 2 .5 3H1.8L.6 18.3l.9.3 1-2.7h1.4c.4.8 2.1 4.5 5.8 3.9-.3-.2-.5-.5-.7-.8-2.9 0-4.4-3.5-4.4-4zM9 3.9c2 0 3.7 1.6 4.4 3.8-2.9-1-6.2-.8-9 .6.7-2.6 2.5-4.4 4.6-4.4zm14.8 19.2l-4.3-4.3c2.1-2.5 1.8-6.3-.7-8.4s-6.3-1.8-8.4.7-1.8 6.3.7 8.4c2.2 1.9 5.4 1.9 7.7 0l4.3 4.3c.2.2.5.2.7 0 .2-.2.2-.5 0-.7zm-8.8-3c-2.8 0-5.1-2.3-5.1-5.1s2.3-5.1 5.1-5.1 5.1 2.3 5.1 5.1-2.3 5.1-5.1 5.1z"
			/>
			<path fill="none" d="M0 0h24v24H0z" />
		</svg>
	</button>

	{#if showDebugSidebar}
		<div
			class="fixed left-0 top-0 h-full w-80 overflow-y-auto bg-gray-100 p-4 shadow-2xl transition-transform duration-300"
			style="transform: translateX({showDebugSidebar ? '0' : '100%'});"
			transition:fade={{ duration: 300 }}
		>
			<div class="flex items-center justify-between border-b border-gray-300 py-1">
				<h3 class="ml-12 text-lg font-semibold text-gray-800">Debug Panel</h3>
				<button
					class="rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
					on:click={toggleDebugSidebar}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<div class="mt-4">
				<label for="jumpStep" class="block text-sm font-medium text-gray-700">Jump to Step:</label>
				<div class="mt-2 flex items-center">
					<input
						id="jumpStep"
						type="number"
						min="1"
						value={$stepperStore.current?.index || 1}
						on:input={handleStepChange}
						class="w-16 rounded border border-gray-300 p-2 text-center shadow-sm"
					/>

					<div class="ml-2 flex space-x-2">
						<button
							on:click={prevStep}
							class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
							aria-label="Previous Step"
						>
							◀
						</button>

						<button
							on:click={nextStep}
							class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
							aria-label="Next Step"
						>
							▶
						</button>
					</div>
				</div>
			</div>

			<div class="mt-6">
				<h4 class="mb-2 font-medium text-gray-700">
					Current Step: {$stepperStore.current?.index || 1}
				</h4>
				<div class="rounded bg-gray-200 p-2">
					<p class="text-sm">{$stepperStore.current?.description || 'No description'}</p>
				</div>
			</div>
		</div>
	{/if}
{/if}
