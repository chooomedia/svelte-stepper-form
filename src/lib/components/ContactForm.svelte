<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormData } from '$lib/schema';

	interface Props {
		form: SuperValidated<FormData>;
		errors: Record<string, string>;
		onValidation?: (isValid: boolean) => void; // Add callback for validation
	}

	let { form, errors, onValidation } = $props<Props>();

	// Track field focus for enhanced validation UX
	let touchedFields = $state(new Set<string>());
	let formSubmissionAttempted = $state(false);
	let showFormValidationOverview = $state(false);
	let formErrors = $state<string[]>([]);
	let isFormValid = $state(false); // Form validation state

	// Handle field blur
	function handleBlur(fieldName: string) {
		touchedFields.add(fieldName);
		validateField(fieldName);
		updateFormValidity(); // Check overall validity
	}

	// Check if field should show error
	function shouldShowError(fieldName: string): boolean {
		return (touchedFields.has(fieldName) || formSubmissionAttempted) && !!errors[fieldName];
	}

	// Get ARIA attributes for field
	function getAriaAttrs(fieldName: string, label: string) {
		return {
			'aria-invalid': (shouldShowError(fieldName) ? 'true' : 'false') as Booleanish,
			'aria-describedby': shouldShowError(fieldName) ? `${fieldName}-error` : undefined,
			'aria-label': label
		};
	}

	// Validate a specific field
	function validateField(fieldName: string) {
		const requiredFields = ['salutation', 'first_name', 'last_name', 'email', 'privacy_agreement'];

		// Skip validation for fields that aren't required
		if (!requiredFields.includes(fieldName)) return true;

		// Clear existing error for this field
		if (errors[fieldName]) {
			delete errors[fieldName];
		}

		let hasError = false;

		switch (fieldName) {
			case 'salutation':
				if (!$form.salutation) {
					errors.salutation = 'Bitte wähle eine Anrede aus';
					hasError = true;
				}
				break;

			case 'first_name':
				if (!$form.first_name) {
					errors.first_name = 'Bitte gib Deinen Vornamen ein';
					hasError = true;
				} else if ($form.first_name.length < 2) {
					errors.first_name = 'Vorname muss mindestens 2 Zeichen haben';
					hasError = true;
				}
				break;

			case 'last_name':
				if (!$form.last_name) {
					errors.last_name = 'Bitte gib Deinen Nachnamen ein';
					hasError = true;
				} else if ($form.last_name.length < 2) {
					errors.last_name = 'Nachname muss mindestens 2 Zeichen haben';
					hasError = true;
				}
				break;

			case 'email':
				if (!$form.email) {
					errors.email = 'Bitte gib Deine E-Mail-Adresse ein';
					hasError = true;
				} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($form.email)) {
					errors.email = 'Bitte gib eine gültige E-Mail-Adresse ein';
					hasError = true;
				}
				break;

			case 'privacy_agreement':
				if (!$form.privacy_agreement) {
					errors.privacy_agreement = 'Bitte stimme der Datenschutzerklärung zu';
					hasError = true;
				}
				break;
		}

		return !hasError;
	}

	// Update form validity and notify parent
	function updateFormValidity() {
		const requiredFields = ['salutation', 'first_name', 'last_name', 'email', 'privacy_agreement'];

		// Check all required fields
		const validFields = requiredFields.map((field) => validateField(field));
		isFormValid = validFields.every((valid) => valid);

		// Update error messages
		formErrors = Object.entries(errors)
			.filter(([_, message]) => message)
			.map(([field, message]) => message);

		showFormValidationOverview = formErrors.length > 0;

		// Notify parent of validation status
		if (onValidation) {
			onValidation(isFormValid);
		}

		return isFormValid;
	}

	// Validate all fields when "submit" is attempted
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

		// Validate all fields
		fieldNames.forEach((field) => {
			touchedFields.add(field);
			validateField(field);
		});

		return updateFormValidity();
	}

	// Check validity whenever form fields change
	$effect(() => {
		// Watch form fields
		const company = $form.company_name;
		const salutation = $form.salutation;
		const firstName = $form.first_name;
		const lastName = $form.last_name;
		const email = $form.email;
		const privacy = $form.privacy_agreement;

		// Only validate if user has interacted with the form
		if (touchedFields.size > 0 || formSubmissionAttempted) {
			updateFormValidity();
		}
	});

	// Auto-fill company name if available
	onMount(() => {
		if ($form.company_name) {
			// If company name exists, check other required fields
			const requiredFields = [
				'salutation',
				'first_name',
				'last_name',
				'email',
				'privacy_agreement'
			];
			let allFilled = true;

			// Check if all fields are pre-filled
			for (const field of requiredFields) {
				if (!$form[field]) {
					allFilled = false;
					break;
				}
			}

			if (allFilled) {
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
