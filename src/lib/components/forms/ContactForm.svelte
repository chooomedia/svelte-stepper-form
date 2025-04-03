<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormData } from '$lib/schema';
	import { last_step } from '$lib/schema';
	import { z } from 'zod';
	import { i18n, currentLocale } from '$lib/i18n';

	interface Props {
		form: SuperValidated<FormData>;
		errors?: Record<string, string>;
		onValidation?: (isValid: boolean) => void;
	}

	let { form, errors = {}, onValidation } = $props<Props>();

	// Status variables for the form
	let touchedFields = $state(new Set<string>());
	let formSubmissionAttempted = $state(false);
	let showFormValidationOverview = $state(false);
	let formErrors = $state<string[]>([]);
	let isFormValid = $state(false);

	// Required fields based on the schema (for step 10)
	const requiredFields = ['salutation', 'first_name', 'last_name', 'email', 'privacy_agreement'];

	// Validate a field using the Zod schema
	function validateField(fieldName: string): boolean {
		if (!$form) return false;

		if (!requiredFields.includes(fieldName)) return true;

		let currentFieldValid = true;

		try {
			const fieldSchema = z.object({
				[fieldName]: last_step.shape[fieldName]
			});

			fieldSchema.parse({ [fieldName]: $form[fieldName] });
			delete errors[fieldName];
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldError = error.errors.find((err) => err.path[0] === fieldName);
				if (fieldError) {
					errors[fieldName] = fieldError.message;
					currentFieldValid = false;
				}
			}
		}

		return currentFieldValid;
	}

	// Handler for field blur events
	function handleBlur(fieldName: string) {
		touchedFields.add(fieldName);
		validateField(fieldName);
		updateFormState();
	}

	// Update form state without causing infinite loops
	function updateFormState() {
		formErrors = Object.values(errors).filter(Boolean);
		showFormValidationOverview = formErrors.length > 0;

		if ($form) {
			isFormValid = requiredFields.every((field) => validateField(field));
			if (onValidation) {
				onValidation(isFormValid);
			}
		} else {
			isFormValid = false;
			if (onValidation) onValidation(false);
		}
	}

	// Check if an error should be shown for a specific field
	function shouldShowError(fieldName: string): boolean {
		return (touchedFields.has(fieldName) || formSubmissionAttempted) && !!errors[fieldName];
	}

	// ARIA attributes for fields
	function getAriaAttrs(fieldName: string, label: string) {
		return {
			'aria-invalid': shouldShowError(fieldName) ? 'true' : 'false',
			'aria-describedby': shouldShowError(fieldName) ? `${fieldName}-error` : undefined,
			'aria-label': label
		};
	}

	// Validate all fields
	function validateAllFields() {
		formSubmissionAttempted = true;

		try {
			last_step.parse($form);
			errors = {};
			isFormValid = true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				error.errors.forEach((err) => {
					const fieldName = err.path[0] as string;
					errors[fieldName] = err.message;
					touchedFields.add(fieldName);
				});
				isFormValid = false;
			}
		}

		updateFormState();
		return isFormValid;
	}

	// Effect to check form state when touched fields change
	$effect(() => {
		if (touchedFields.size > 0 || formSubmissionAttempted) {
			updateFormState();
		}
	});
</script>

{#key $currentLocale}
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
							{$i18n.common.formErrorHeading}
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
			<label for="company_name" class="form-label">
				{$i18n.forms.labels.company_name}
			</label>
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
			<label for="salutation" class="form-label">
				{$i18n.forms.labels.salutation} *
			</label>
			<select
				id="salutation"
				bind:value={$form.salutation}
				class="input-field {shouldShowError('salutation') ? 'error' : ''}"
				onblur={() => handleBlur('salutation')}
				{...getAriaAttrs('salutation', $i18n.forms.placeholders.salutation)}
			>
				<option value="" selected>{$i18n.forms.salutation.select}</option>
				<option value="Herr">{$i18n.forms.salutation.male}</option>
				<option value="Frau">{$i18n.forms.salutation.female}</option>
				<option value="Divers">{$i18n.forms.salutation.diverse}</option>
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
				<label for="first_name" class="form-label">
					{$i18n.forms.labels.first_name} *
				</label>
				<input
					type="text"
					id="first_name"
					bind:value={$form.first_name}
					class="input-field {shouldShowError('first_name') ? 'error' : ''}"
					onblur={() => handleBlur('first_name')}
					{...getAriaAttrs('first_name', $i18n.forms.placeholders.first_name)}
				/>
				{#if shouldShowError('first_name')}
					<p class="error-text" id="first_name-error" role="alert" transition:slide>
						{errors.first_name}
					</p>
				{/if}
			</div>

			<div class="form-group">
				<label for="last_name" class="form-label">
					{$i18n.forms.labels.last_name} *
				</label>
				<input
					type="text"
					id="last_name"
					bind:value={$form.last_name}
					class="input-field {shouldShowError('last_name') ? 'error' : ''}"
					onblur={() => handleBlur('last_name')}
					{...getAriaAttrs('last_name', $i18n.forms.placeholders.last_name)}
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
			<label for="email" class="form-label">
				{$i18n.forms.labels.email} *
			</label>
			<input
				type="email"
				id="email"
				bind:value={$form.email}
				class="input-field {shouldShowError('email') ? 'error' : ''}"
				onblur={() => handleBlur('email')}
				{...getAriaAttrs('email', $i18n.forms.placeholders.email)}
			/>
			{#if shouldShowError('email')}
				<p class="error-text" id="email-error" role="alert" transition:slide>
					{errors.email}
				</p>
			{/if}
		</div>

		<!-- Phone -->
		<div class="form-group">
			<label for="phone" class="form-label">
				{$i18n.forms.labels.phone}
			</label>
			<input
				type="tel"
				id="phone"
				bind:value={$form.phone}
				class="input-field {shouldShowError('phone') ? 'error' : ''}"
				onblur={() => handleBlur('phone')}
				{...getAriaAttrs('phone', $i18n.forms.placeholders.phone)}
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
						onchange={() => {
							touchedFields.add('privacy_agreement');
							validateField('privacy_agreement');
							updateFormState();
						}}
						{...getAriaAttrs('privacy_agreement', $i18n.forms.placeholders.privacy_agreement)}
					/>
				</div>
				<div class="ml-3 text-sm">
					<label for="privacy_agreement" class="form-label">
						{$i18n.forms.labels.privacy_agreement} *
					</label>
					<p class="text-gray-500">
						{$i18n.forms.descriptions.privacy_agreement}{' '}
						<a href="/datenschutz" class="text-primary-600 hover:underline">
							{$i18n.forms.placeholders.privacy_policy}
						</a>
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
					<label for="marketing_consent" class="form-label">
						{$i18n.forms.labels.marketing_consent}
					</label>
					<p class="text-gray-500">
						{$i18n.forms.descriptions.marketing_consent}{' '}
						<a href="/datenschutz#newsletter" class="text-primary-600 hover:underline">
							{$i18n.forms.placeholders.newsletter_terms}
						</a>
					</p>
				</div>
			</div>
		</div>
	</form>
{/key}
