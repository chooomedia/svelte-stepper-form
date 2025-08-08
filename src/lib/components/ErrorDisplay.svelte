<script lang="ts">
	import { slide } from 'svelte/transition';
	import Icon from './Icon.svelte';

	let { errors = [], title = 'Bitte korrigiere die folgenden Fehler:' } = $props<{
		errors: string[];
		title?: string;
	}>();

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
			return 'Ein technischer Fehler ist aufgetreten. Bitte lade die Seite neu.';
		}

		// Weitere technische Fehlermeldungen
		if (
			error.includes('Cannot read properties of undefined') ||
			error.includes('TypeError') ||
			error.includes('ReferenceError')
		) {
			return 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später erneut.';
		}

		// Wenn es eine normale Fehlermeldung ist, gib sie zurück
		return error;
	}

	// Gefilterte Fehler mit übersetzten Meldungen
	let translatedErrors = $derived(errors.map(translateError));
</script>

{#if translatedErrors.length > 0}
	<div
		class="mb-4 rounded-md bg-red-100 p-4"
		transition:slide={{ duration: 300 }}
		role="alert"
		aria-labelledby="form-errors-heading"
	>
		<div class="align-center flex">
			<div class="flex-shrink-0">
				<div class="h-5 w-5 rounded-full bg-red-500 text-white">
					<Icon name="closeX" size={20} stroke="currentColor" />
				</div>
			</div>
			<div class="ml-3">
				<h3 id="form-errors-heading" class="text-sm font-medium text-red-800">
					{title}
				</h3>
				<div class="text-sm text-red-700">
					<ul>
						{#each translatedErrors as error}
							<li>{error}</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
{/if}
