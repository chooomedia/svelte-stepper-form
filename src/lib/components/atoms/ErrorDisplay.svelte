<script lang="ts">
	import { slide } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import { i18n } from '$lib/i18n';

	const isDev = import.meta.env.DEV;

	let { errors = [], title } = $props<{
		errors: string[];
		title?: string;
	}>();

	// Fallback title wenn keiner übergeben wird
	let displayTitle = $derived(
		title || $i18n?.common?.formErrorHeading || 'Please correct the following errors:'
	);

	// Funktion zum Übersetzen technischer Fehlermeldungen in benutzerfreundliche Texte
	function translateError(error: string): string {
		// Technische SuperForms-Fehlermeldungen erkennen und übersetzen
		if (
			error.includes('function subscribe') ||
			error.includes('function set') ||
			error.includes('function update') ||
			error.includes('subscribers.add') ||
			error.includes('subscribers.delete') ||
			error.includes('stop = start') ||
			error.includes('_errors.set') ||
			error.includes('_errors.update') ||
			error.includes('Errors.set')
		) {
			return (
				$i18n?.results?.errors?.technicalError ||
				'A technical error occurred. Please reload the page.'
			);
		}

		// Weitere technische Fehlermeldungen
		if (
			error.includes('Cannot read properties of undefined') ||
			error.includes('TypeError') ||
			error.includes('ReferenceError')
		) {
			return (
				$i18n?.results?.errors?.unexpectedError ||
				'An unexpected error occurred. Please try again later.'
			);
		}

		// Wenn es eine normale Fehlermeldung ist, gib sie zurück
		return error;
	}

	// Gefilterte Fehler mit übersetzten Meldungen
	let translatedErrors = $derived(errors.map(translateError));
</script>

{#if translatedErrors.length > 0}
	<div class="error-container" role="alert" aria-live="polite" transition:slide={{ duration: 300 }}>
		<div class="error-header">
			<Icon name="alert-circle" size={20} stroke="currentColor" strokeWidth="2" fill="none" />
			<h3 class="error-title">{displayTitle}</h3>
			{#if isDev}
				<span class="ml-2 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
					DEV ONLY
				</span>
			{/if}
		</div>
		<ul class="error-list">
			{#each translatedErrors as error, index}
				<li class="error-item" key={index}>
					<span class="error-bullet">•</span>
					<span class="error-text">{error}</span>
				</li>
			{/each}
		</ul>
	</div>
{/if}
