<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormData } from '$lib/schema';

	interface Props {
		form: SuperValidated<FormData>;
		errors: Record<string, string>;
		onValidation?: (isValid: boolean) => void; // Nur noch als Callback für den Stepper
	}

	let { form, errors = {}, onValidation } = $props<Props>();

	// Statusvariablen für das Formular
	let touchedFields = $state(new Set<string>());
	let formSubmissionAttempted = $state(false);
	let showFormValidationOverview = $state(false);
	let formErrors = $state<string[]>([]);
	let isFormValid = $state(false);
	let preventReactivity = $state(true);

	// Prüft ein bestimmtes Feld
	function validateField(fieldName: string): boolean {
		// Sicherstellen, dass $form definiert ist
		if (!$form) {
			return false;
		}

		const requiredFields = ['salutation', 'first_name', 'last_name', 'email', 'privacy_agreement'];

		// Für optionale Felder immer true zurückgeben
		if (!requiredFields.includes(fieldName)) return true;

		let currentFieldValid = true;

		switch (fieldName) {
			case 'salutation':
				if (!$form.salutation) {
					errors[fieldName] = 'Bitte wähle eine Anrede aus';
					currentFieldValid = false;
				} else {
					delete errors[fieldName];
				}
				break;

			case 'first_name':
				if (!$form.first_name) {
					errors[fieldName] = 'Bitte gib Deinen Vornamen ein';
					currentFieldValid = false;
				} else if ($form.first_name.length < 2) {
					errors[fieldName] = 'Vorname muss mindestens 2 Zeichen haben';
					currentFieldValid = false;
				} else {
					delete errors[fieldName];
				}
				break;

			case 'last_name':
				if (!$form.last_name) {
					errors[fieldName] = 'Bitte gib Deinen Nachnamen ein';
					currentFieldValid = false;
				} else if ($form.last_name.length < 2) {
					errors[fieldName] = 'Nachname muss mindestens 2 Zeichen haben';
					currentFieldValid = false;
				} else {
					delete errors[fieldName];
				}
				break;

			case 'email':
				if (!$form.email) {
					errors[fieldName] = 'Bitte gib Deine E-Mail-Adresse ein';
					currentFieldValid = false;
				} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($form.email)) {
					errors[fieldName] = 'Bitte gib eine gültige E-Mail-Adresse ein';
					currentFieldValid = false;
				} else {
					delete errors[fieldName];
				}
				break;

			case 'privacy_agreement':
				if (!$form.privacy_agreement) {
					errors[fieldName] = 'Bitte stimme der Datenschutzerklärung zu';
					currentFieldValid = false;
				} else {
					delete errors[fieldName];
				}
				break;
		}

		return currentFieldValid;
	}

	// Handler für Feld-Blur-Events
	function handleBlur(fieldName: string) {
		touchedFields.add(fieldName);
		validateField(fieldName);
		updateFormState();
	}

	// Aktualisiert den Formularstatus ohne Endlosschleifen auszulösen
	function updateFormState() {
		// Fehlerliste aktualisieren
		formErrors = Object.values(errors).filter(Boolean);
		showFormValidationOverview = formErrors.length > 0;

		// Formularvalidität prüfen
		if ($form) {
			const requiredFields = [
				'salutation',
				'first_name',
				'last_name',
				'email',
				'privacy_agreement'
			];
			isFormValid = requiredFields.every((field) => validateField(field));

			// Wichtig: Den Stepper über die Validität informieren
			if (onValidation) {
				onValidation(isFormValid);
			}
		} else {
			isFormValid = false;
			if (onValidation) onValidation(false);
		}
	}

	// Prüft, ob ein Fehler für ein bestimmtes Feld angezeigt werden soll
	function shouldShowError(fieldName: string): boolean {
		return (touchedFields.has(fieldName) || formSubmissionAttempted) && !!errors[fieldName];
	}

	// ARIA-Attribute für Felder
	function getAriaAttrs(fieldName: string, label: string) {
		return {
			'aria-invalid': shouldShowError(fieldName) ? 'true' : 'false',
			'aria-describedby': shouldShowError(fieldName) ? `${fieldName}-error` : undefined,
			'aria-label': label
		};
	}

	// Validiert alle Felder
	function validateAllFields() {
		formSubmissionAttempted = true;

		const fieldNames = [
			'salutation',
			'first_name',
			'last_name',
			'email',
			'phone',
			'privacy_agreement'
		];

		// Alle Felder als berührt markieren
		fieldNames.forEach((field) => {
			touchedFields.add(field);
		});

		// Zustand aktualisieren
		updateFormState();

		return isFormValid;
	}

	// Bewusst keine automatische Validierung über Effekte
	// um Endlosschleifen zu vermeiden

	// Initialisierung
	onMount(() => {
		// Verzögerte Aktivierung von Reaktivität
		setTimeout(() => {
			preventReactivity = false;
		}, 200);

		if ($form?.company_name) {
			// Wenn der Firmenname existiert, andere erforderliche Felder prüfen
			const requiredFields = [
				'salutation',
				'first_name',
				'last_name',
				'email',
				'privacy_agreement'
			];

			// Prüfen, ob alle Felder vorausgefüllt sind
			const allFilled = requiredFields.every((field) => !!$form?.[field]);

			if (allFilled) {
				// Erste manuelle Validierung
				validateAllFields();
			}
		}
	});
</script>

<form method="POST" class="space-y-6" novalidate>
	{#if showFormValidationOverview && formErrors.length > 0}
		<div
			class="mb-4 rounded-md bg-red-50 p-4"
			transition:slide={{ duration: 300 }}
			role="alert"
			aria-labelledby="form-errors-heading"
		>
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<h3 id="form-errors-heading" class="text-sm font-medium text-red-800">
						Bitte korrigiere die folgenden Fehler:
					</h3>
					<div class="mt-2 text-sm text-red-700">
						<ul class="list-disc space-y-1 pl-5">
							{#each formErrors as error}
								<li>{error}</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="form-group">
		<label for="company_name" class="form-label"> Unternehmensname </label>
		<input
			type="text"
			id="company_name"
			bind:value={$form.company_name}
			class="input-field {shouldShowError('company_name') ? 'error' : ''}"
			onblur={() => handleBlur('company_name')}
		/>
		{#if shouldShowError('company_name')}
			<p class="error-text" id="company_name-error" role="alert" transition:fade>
				{errors.company_name}
			</p>
		{/if}
	</div>

	<!-- Salutation -->
	<div class="form-group">
		<label for="salutation" class="form-label"> Anrede * </label>
		<select
			id="salutation"
			bind:value={$form.salutation}
			class="input-field {shouldShowError('salutation') ? 'error' : ''}"
			onblur={() => handleBlur('salutation')}
			{...getAriaAttrs('salutation', 'Bitte wähle Deine Anrede')}
		>
			<option value="">Bitte wählen</option>
			<option value="Herr">Herr</option>
			<option value="Frau">Frau</option>
			<option value="Divers">Divers</option>
		</select>
		{#if shouldShowError('salutation')}
			<p class="error-text" id="salutation-error" role="alert" transition:slide>
				{errors.salutation}
			</p>
		{/if}
	</div>

	<!-- Name Fields -->
	<div class="grid gap-6 md:grid-cols-2">
		<div class="form-group">
			<label for="first_name" class="form-label"> Vorname * </label>
			<input
				type="text"
				id="first_name"
				bind:value={$form.first_name}
				class="input-field {shouldShowError('first_name') ? 'error' : ''}"
				onblur={() => handleBlur('first_name')}
				{...getAriaAttrs('first_name', 'Bitte gib Deinen Vornamen ein')}
			/>
			{#if shouldShowError('first_name')}
				<p class="error-text" id="first_name-error" role="alert" transition:slide>
					{errors.first_name}
				</p>
			{/if}
		</div>

		<div class="form-group">
			<label for="last_name" class="form-label"> Nachname * </label>
			<input
				type="text"
				id="last_name"
				bind:value={$form.last_name}
				class="input-field {shouldShowError('last_name') ? 'error' : ''}"
				onblur={() => handleBlur('last_name')}
				{...getAriaAttrs('last_name', 'Bitte gib Deinen Nachnamen ein')}
			/>
			{#if shouldShowError('last_name')}
				<p class="error-text" id="last_name-error" role="alert" transition:slide>
					{errors.last_name}
				</p>
			{/if}
		</div>
	</div>

	<!-- Email -->
	<div class="form-group">
		<label for="email" class="form-label"> E-Mail * </label>
		<input
			type="email"
			id="email"
			bind:value={$form.email}
			class="input-field {shouldShowError('email') ? 'error' : ''}"
			onblur={() => handleBlur('email')}
			{...getAriaAttrs('email', 'Bitte gib Deine E-Mail-Adresse ein')}
		/>
		{#if shouldShowError('email')}
			<p class="error-text" id="email-error" role="alert" transition:slide>
				{errors.email}
			</p>
		{/if}
	</div>

	<!-- Phone -->
	<div class="form-group">
		<label for="phone" class="form-label"> Telefon (optional) </label>
		<input
			type="tel"
			id="phone"
			bind:value={$form.phone}
			class="input-field {shouldShowError('phone') ? 'error' : ''}"
			onblur={() => handleBlur('phone')}
			{...getAriaAttrs('phone', 'Telefonnummer (optional)')}
		/>
		{#if shouldShowError('phone')}
			<p class="error-text" id="phone-error" role="alert" transition:slide>
				{errors.phone}
			</p>
		{/if}
	</div>

	<!-- Privacy Agreement -->
	<div class="form-group">
		<div class="flex items-start">
			<div class="flex h-5 items-center">
				<input
					type="checkbox"
					id="privacy_agreement"
					bind:checked={$form.privacy_agreement}
					class="form-checkbox"
					onblur={() => handleBlur('privacy_agreement')}
					{...getAriaAttrs('privacy_agreement', 'Datenschutzerklärung akzeptieren')}
				/>
			</div>
			<div class="ml-3 text-sm">
				<label for="privacy_agreement" class="form-label"> Datenschutzerklärung * </label>
				<p class="text-gray-500">
					Ich stimme der <a href="/datenschutz" class="text-blue-600 hover:underline"
						>Datenschutzerklärung</a
					> zu.
				</p>
				{#if shouldShowError('privacy_agreement')}
					<p class="error-text" id="privacy_agreement-error" role="alert" transition:slide>
						{errors.privacy_agreement}
					</p>
				{/if}
			</div>
		</div>
		<div class="flex items-start pt-4">
			<div class="flex h-5 items-center">
				<input
					type="checkbox"
					id="marketing_consent"
					bind:checked={$form.marketing_consent}
					class="form-checkbox"
				/>
			</div>
			<div class="ml-3 text-sm">
				<label for="marketing_consent" class="form-label"> Newsletter (optional) </label>
				<p class="text-gray-500">
					Ich möchte den Newsletter erhalten und akzeptiere die
					<a href="/datenschutz#newsletter" class="text-blue-600 hover:underline">
						Newsletter-Bestimmungen
					</a>.
				</p>
			</div>
		</div>
	</div>
</form>
