<script lang="ts">
	import StepperForm from './StepperForm.svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { formSchema } from '$lib/schema';

	export let data: PageData;

	// Superforms Setup
	const { form, errors, enhance } = superForm(data.form, {
		validators: formSchema,
		resetForm: false,
		taintedMessage: null // Deaktiviert die Standard-Warnung beim Verlassen
	});

	// Prüfen ob wir uns im iframe befinden
	$: isIframe = typeof window !== 'undefined' && window.self !== window.top;
</script>

<!-- SEO und Accessibility -->
<svelte:head>
	<title>Digital Marketing Assessment | Digital Pusher</title>
	<meta
		name="description"
		content="Ermitteln Sie Ihren digitalen Marketing-Score und erhalten Sie personalisierte Empfehlungen für Ihr Unternehmen."
	/>
</svelte:head>

<!-- Formular-Container mit konditionaler Styling -->
<div class="flex flex-col {isIframe ? '' : 'mt-4 sm:mt-8'} transition-all duration-300">
	<!-- Titel-Bereich (optional im iframe) -->
	{#if !isIframe}
		<div class="mb-8 text-center">
			<h1 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Digitaler Marketing-Check</h1>
			<p class="mx-auto max-w-3xl text-lg text-gray-600">
				Beantworten Sie einige Fragen zu Ihrem Unternehmen und erhalten Sie eine kostenlose
				Einschätzung Ihrer digitalen Marketing-Möglichkeiten.
			</p>
		</div>
	{/if}

	<!-- Formular-Wrapper -->
	<div
		class="mx-auto w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-lg
                {isIframe ? 'border-0' : 'border border-gray-200'}"
	>
		<!-- Progress-Bar Container -->
		<div class="w-full border-b border-gray-200 bg-gray-50 p-4">
			<StepperForm form={data.form} {errors} {enhance} class="mx-auto max-w-3xl" />
		</div>

		<!-- Formular-Content -->
		<div class="p-4 sm:p-6 lg:p-8">
			<slot />
		</div>
	</div>

	<!-- Vertrauenselemente (optional im iframe) -->
	{#if !isIframe}
		<div class="mt-8 text-center">
			<div class="mb-4 flex justify-center space-x-6">
				<!-- Vertrauenssiegel/Badges hier -->
			</div>
			<p class="text-sm text-gray-500">
				Ihre Daten werden verschlüsselt übertragen und gemäß unserer
				<a href="/datenschutz" class="text-primary hover:text-primary-dark underline">
					Datenschutzerklärung
				</a>
				verarbeitet.
			</p>
		</div>
	{/if}
</div>
