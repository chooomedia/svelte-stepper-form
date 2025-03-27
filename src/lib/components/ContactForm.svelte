<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormData } from '$lib/schema';

	interface Props {
		form: SuperValidated<FormData>;
		errors: Record<string, string>;
		onValidation?: (isValid: boolean) => void; // For parent component to track validation
	}

	let { form, errors, onValidation } = $props<Props>();

	// Track field focus for enhanced validation UX
	let touchedFields = $state(new Set<string>());
	let formSubmissionAttempted = $state(false);
	let isFormValid = $state(false);

	// Required fields based on schema
	const requiredFields = [
		'company_name',
		'salutation',
		'first_name',
		'last_name',
		'email',
		'privacy_agreement'
	];

	// Handle field blur
	function handleBlur(fieldName: string) {
		touchedFields.add(fieldName);
		validateField(fieldName);
		updateFormValidity();
	}

	// Check if field should show error
	function shouldShowError(fieldName: string): boolean {
		return (touchedFields.has(fieldName) || formSubmissionAttempted) && !!errors[fieldName];
	}

	// Get ARIA attributes for field
	function getAriaAttrs(fieldName: string, label: string) {
		return {
			'aria-invalid': shouldShowError(fieldName) ? 'true' : 'false',
			'aria-describedby': shouldShowError(fieldName) ? `${fieldName}-error` : undefined,
			'aria-label': label
		};
	}

	// Validate a specific field
	function validateField(fieldName: string) {
		// Skip validation for non-required fields
		if (!requiredFields.includes(fieldName) && fieldName !== 'phone') return true;

		// Clear existing error
		if (errors[fieldName]) {
			delete errors[fieldName];
		}

		let hasError = false;

		switch (fieldName) {
			case 'company_name':
				if (!$form.company_name) {
					errors.company_name = 'Unternehmensname wird benötigt';
					hasError = true;
				} else if ($form.company_name.length < 2) {
					errors.company_name = 'Name muss mindestens 2 Zeichen lang sein';
					hasError = true;
				}
				break;

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
					errors.email = 'Bitte eine gültige E-Mail-Adresse angeben';
					hasError = true;
				}
				break;

			case 'phone':
				if ($form.phone && !/^\+?[0-9\s\-()]{7,20}$/.test($form.phone)) {
					errors.phone = 'Ungültiges Telefonformat';
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

	// Update overall form validity
	function updateFormValidity() {
		// Check required fields
		const validations = requiredFields.map((field) => validateField(field));

		// Check optional fields that have values
		if ($form.phone) validations.push(validateField('phone'));

		isFormValid = validations.every((valid) => valid);

		// Notify parent
		if (onValidation) {
			onValidation(isFormValid);
		}

		return isFormValid;
	}

	// Validate all fields
	function validateAllFields() {
		formSubmissionAttempted = true;

		// Mark all fields as touched
		requiredFields.forEach((field) => touchedFields.add(field));
		if ($form.phone) touchedFields.add('phone');

		return updateFormValidity();
	}

	// Check validity whenever form fields change
	$effect(() => {
		// Watch key form fields
		const formValues = {
			company: $form.company_name,
			salutation: $form.salutation,
			firstName: $form.first_name,
			lastName: $form.last_name,
			email: $form.email,
			phone: $form.phone,
			privacy: $form.privacy_agreement
		};

		// Only validate if user has interacted with the form
		if (touchedFields.size > 0 || formSubmissionAttempted) {
			updateFormValidity();
		}
	});

	// Auto-validate if form is pre-filled
	onMount(() => {
		const hasValues = requiredFields.every((field) => !!$form[field]);

		if (hasValues) {
			validateAllFields();
		}

		// Initial validation notification
		if (onValidation) {
			onValidation(isFormValid);
		}
	});
</script>

<form method="POST" class="space-y-6" novalidate>
	<!-- Company Name -->
	<div class="form-group">
		<label for="company_name" class="form-label">Unternehmensname *</label>
		<input
			type="text"
			id="company_name"
			bind:value={$form.company_name}
			class="input-field {shouldShowError('company_name') ? 'error' : ''}"
			onblur={() => handleBlur('company_name')}
			{...getAriaAttrs('company_name', 'Unternehmensname')}
		/>
		{#if shouldShowError('company_name')}
			<p class="error-text" id="company_name-error" role="alert" transition:fade>
				{errors.company_name}
			</p>
		{/if}
	</div>

	<!-- Salutation -->
	<div class="form-group">
		<label for="salutation" class="form-label">Anrede *</label>
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
			<p class="error-text" id="salutation-error" role="alert" transition:fade>
				{errors.salutation}
			</p>
		{/if}
	</div>

	<!-- Name Fields -->
	<div class="grid gap-6 md:grid-cols-2">
		<div class="form-group">
			<label for="first_name" class="form-label">Vorname *</label>
			<input
				type="text"
				id="first_name"
				bind:value={$form.first_name}
				class="input-field {shouldShowError('first_name') ? 'error' : ''}"
				onblur={() => handleBlur('first_name')}
				{...getAriaAttrs('first_name', 'Bitte gib Deinen Vornamen ein')}
			/>
			{#if shouldShowError('first_name')}
				<p class="error-text" id="first_name-error" role="alert" transition:fade>
					{errors.first_name}
				</p>
			{/if}
		</div>

		<div class="form-group">
			<label for="last_name" class="form-label">Nachname *</label>
			<input
				type="text"
				id="last_name"
				bind:value={$form.last_name}
				class="input-field {shouldShowError('last_name') ? 'error' : ''}"
				onblur={() => handleBlur('last_name')}
				{...getAriaAttrs('last_name', 'Bitte gib Deinen Nachnamen ein')}
			/>
			{#if shouldShowError('last_name')}
				<p class="error-text" id="last_name-error" role="alert" transition:fade>
					{errors.last_name}
				</p>
			{/if}
		</div>
	</div>

	<!-- Email -->
	<div class="form-group">
		<label for="email" class="form-label">E-Mail *</label>
		<input
			type="email"
			id="email"
			bind:value={$form.email}
			class="input-field {shouldShowError('email') ? 'error' : ''}"
			onblur={() => handleBlur('email')}
			{...getAriaAttrs('email', 'Bitte gib Deine E-Mail-Adresse ein')}
		/>
		{#if shouldShowError('email')}
			<p class="error-text" id="email-error" role="alert" transition:fade>
				{errors.email}
			</p>
		{/if}
	</div>

	<!-- Phone -->
	<div class="form-group">
		<label for="phone" class="form-label">Telefon (optional)</label>
		<input
			type="tel"
			id="phone"
			bind:value={$form.phone}
			class="input-field {shouldShowError('phone') ? 'error' : ''}"
			onblur={() => handleBlur('phone')}
			{...getAriaAttrs('phone', 'Telefonnummer (optional)')}
		/>
		{#if shouldShowError('phone')}
			<p class="error-text" id="phone-error" role="alert" transition:fade>
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
					class="form-checkbox {shouldShowError('privacy_agreement') ? 'border-red-500' : ''}"
					onblur={() => handleBlur('privacy_agreement')}
					{...getAriaAttrs('privacy_agreement', 'Datenschutzerklärung akzeptieren')}
				/>
			</div>
			<div class="ml-3 text-sm">
				<label for="privacy_agreement" class="form-label">Datenschutzerklärung *</label>
				<p class="text-gray-500">
					Ich stimme der <a href="/datenschutz" class="text-blue-600 hover:underline"
						>Datenschutzerklärung</a
					> zu.
				</p>
				{#if shouldShowError('privacy_agreement')}
					<p class="error-text" id="privacy_agreement-error" role="alert" transition:fade>
						{errors.privacy_agreement}
					</p>
				{/if}
			</div>
		</div>

		<!-- Newsletter consent -->
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
				<label for="marketing_consent" class="form-label">Newsletter (optional)</label>
				<p class="text-gray-500">
					Ich möchte den Newsletter erhalten und akzeptiere die
					<a href="/datenschutz#newsletter" class="text-blue-600 hover:underline"
						>Newsletter-Bestimmungen</a
					>.
				</p>
			</div>
		</div>
	</div>
</form>
