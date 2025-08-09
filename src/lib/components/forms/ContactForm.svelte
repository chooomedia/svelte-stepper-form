<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { FormData } from '$lib/schema';
	import { i18n, currentLocale } from '$lib/i18n';
	import ErrorDisplay from '../ErrorDisplay.svelte';
	import type { SuperForm } from 'sveltekit-superforms';

	let {
		form,
		onValidation,
		formSubmissionAttempted = false
	} = $props<{
		form: SuperForm<FormData>;
		onValidation?: (isValid: boolean) => void;
		formSubmissionAttempted?: boolean;
	}>();

	// Formular-Daten mit Reaktivität
	let formData = $derived($form.data || {});
	let isUpdating = $state(false);

	// Funktion zum Aktualisieren der Form-Daten
	function handleInput(event: Event, field: keyof FormData) {
		if (isUpdating) return;

		const target = event.target as HTMLInputElement | HTMLSelectElement;
		const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

		isUpdating = true;
		try {
			// Aktualisiere Form-Daten über SuperForms - nur im data-Objekt
			form.update((current: any) => ({
				...current,
				data: {
					...current.data,
					[field]: value
				}
			}));

			// Aktualisiere den Formularstatus
			updateFormState();
		} finally {
			isUpdating = false;
		}
	}

	// Status variables for the form
	let touchedFields = $state(new Set<string>());
	let showFormValidationOverview = $state(false);
	let formErrors = $state<string[]>([]);
	let privacyAgreementTouched = $state(false);

	// Handler for field blur events
	function handleBlur(fieldName: keyof FormData) {
		touchedFields.add(fieldName);
		// Aktualisiere den Formularstatus
		updateFormState();
	}

	// ARIA attributes for fields
	function getAriaAttrs(fieldName: keyof FormData, label: string) {
		return {
			'aria-invalid': shouldShowError(fieldName),
			'aria-describedby': shouldShowError(fieldName) ? `${fieldName}-error` : undefined,
			'aria-label': label
		};
	}

	// Update form state when needed
	function updateFormState() {
		// Sammle Fehler aus SuperForms
		formErrors = Object.values($form.errors || {}).filter(Boolean) as string[];
		showFormValidationOverview =
			formErrors.length > 0 && (formSubmissionAttempted || privacyAgreementTouched);

		// Überprüfe Formularvalidität
		const isValid = formErrors.length === 0;

		// Benachrichtige Parent über Validitätsänderung
		if (onValidation) {
			onValidation(isValid);
		}
	}

	// Check if an error should be shown for a specific field
	function shouldShowError(fieldName: keyof FormData): boolean {
		// Show error only if:
		// 1. Field was touched AND (form submission was attempted OR privacy agreement was touched)
		// 2. OR if it's the privacy agreement and it was touched
		if (fieldName === 'privacy_agreement') {
			return privacyAgreementTouched && !!$form.errors?.[fieldName];
		}

		return (
			touchedFields.has(fieldName) &&
			(formSubmissionAttempted || privacyAgreementTouched) &&
			!!$form.errors?.[fieldName]
		);
	}

	// Get error message for a field
	function getFieldError(fieldName: keyof FormData): string | undefined {
		return $form.errors?.[fieldName];
	}
</script>

{#key $currentLocale}
	<form method="POST" class="space-y-6" novalidate>
		{#if showFormValidationOverview && formErrors.length > 0}
			<ErrorDisplay errors={formErrors} title={$i18n.common.formErrorHeading} />
		{/if}

		<div class="form-group">
			<label for="company_name" class="form-label">
				{$i18n.forms.labels.company_name}
			</label>
			<input
				type="text"
				id="company_name"
				value={formData.company_name || ''}
				oninput={(e) => handleInput(e, 'company_name')}
				class="input-field {shouldShowError('company_name') ? 'error' : ''}"
				onblur={() => handleBlur('company_name')}
				{...getAriaAttrs('company_name', $i18n.forms.placeholders.company_name)}
			/>
			{#if shouldShowError('company_name')}
				<p class="error-text" id="company_name-error" role="alert" transition:slide>
					{getFieldError('company_name')}
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
				value={formData.salutation || 'Herr'}
				onchange={(e) => handleInput(e, 'salutation')}
				class="input-field {shouldShowError('salutation') ? 'error' : ''}"
				onblur={() => handleBlur('salutation')}
				{...getAriaAttrs('salutation', $i18n.forms.placeholders.salutation)}
			>
				<option value="Herr">{$i18n.forms.salutation.male}</option>
				<option value="Frau">{$i18n.forms.salutation.female}</option>
				<option value="Divers">{$i18n.forms.salutation.diverse}</option>
			</select>
			{#if shouldShowError('salutation')}
				<p class="error-text" id="salutation-error" role="alert" transition:slide>
					{getFieldError('salutation')}
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
					value={formData.first_name || ''}
					oninput={(e) => handleInput(e, 'first_name')}
					class="input-field {shouldShowError('first_name') ? 'error' : ''}"
					onblur={() => handleBlur('first_name')}
					{...getAriaAttrs('first_name', $i18n.forms.placeholders.first_name)}
				/>
				{#if shouldShowError('first_name')}
					<p class="error-text" id="first_name-error" role="alert" transition:slide>
						{getFieldError('first_name')}
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
					value={formData.last_name || ''}
					oninput={(e) => handleInput(e, 'last_name')}
					class="input-field {shouldShowError('last_name') ? 'error' : ''}"
					onblur={() => handleBlur('last_name')}
					{...getAriaAttrs('last_name', $i18n.forms.placeholders.last_name)}
				/>
				{#if shouldShowError('last_name')}
					<p class="error-text" id="last_name-error" role="alert" transition:slide>
						{getFieldError('last_name')}
					</p>
				{/if}
			</div>
		</div>

		<!-- Email and Phone Fields -->
		<div class="grid gap-6 md:grid-cols-2">
			<div class="form-group">
				<label for="email" class="form-label">
					{$i18n.forms.labels.email} *
				</label>
				<input
					type="email"
					id="email"
					value={formData.email || ''}
					oninput={(e) => handleInput(e, 'email')}
					class="input-field {shouldShowError('email') ? 'error' : ''}"
					onblur={() => handleBlur('email')}
					{...getAriaAttrs('email', $i18n.forms.placeholders.email)}
				/>
				{#if shouldShowError('email')}
					<p class="error-text" id="email-error" role="alert" transition:slide>
						{getFieldError('email')}
					</p>
				{/if}
			</div>

			<div class="form-group">
				<label for="phone" class="form-label">
					{$i18n.forms.labels.phone}
				</label>
				<input
					type="tel"
					id="phone"
					value={formData.phone || ''}
					oninput={(e) => handleInput(e, 'phone')}
					class="input-field {shouldShowError('phone') ? 'error' : ''}"
					onblur={() => handleBlur('phone')}
					{...getAriaAttrs('phone', $i18n.forms.placeholders.phone)}
				/>
				{#if shouldShowError('phone')}
					<p class="error-text" id="phone-error" role="alert" transition:slide>
						{getFieldError('phone')}
					</p>
				{/if}
			</div>
		</div>

		<!-- Privacy Agreement (Styled to match PaymentContent.svelte) -->
		<div class="form-group space-y-4">
			<div class="form-control">
				<label class="label cursor-pointer justify-start gap-2">
					<input
						type="checkbox"
						id="privacy_agreement"
						class="checkbox-primary checkbox {shouldShowError('privacy_agreement')
							? 'checkbox-error'
							: ''}"
						checked={formData.privacy_agreement || false}
						onchange={(e) => {
							handleInput(e, 'privacy_agreement');
							privacyAgreementTouched = true;
							touchedFields.add('privacy_agreement');
						}}
						onblur={() => handleBlur('privacy_agreement')}
						{...getAriaAttrs('privacy_agreement', $i18n.forms.placeholders.privacy_agreement)}
					/>
					<div class="text-sm">
						<span class="form-label cursor-pointer">
							{$i18n.forms.labels.privacy_agreement} *
						</span>
						<p class="text-gray-500">
							{$i18n.forms.descriptions.privacy_agreement}{' '}
							<a href="/datenschutz" class="text-primary-600 hover:underline">
								{$i18n.forms.placeholders.privacy_policy}
							</a>
						</p>
						{#if shouldShowError('privacy_agreement')}
							<p class="error-text" id="privacy_agreement-error" role="alert" transition:slide>
								{getFieldError('privacy_agreement')}
							</p>
						{/if}
					</div>
				</label>
			</div>

			<!-- Marketing Consent (Styled to match PaymentContent.svelte) -->
			<div class="form-control pt-4">
				<label class="label cursor-pointer justify-start gap-2">
					<input
						type="checkbox"
						id="marketing_consent"
						class="checkbox-primary checkbox"
						checked={formData.marketing_consent || false}
						onchange={(e) => handleInput(e, 'marketing_consent')}
						onblur={() => handleBlur('marketing_consent')}
						{...getAriaAttrs('marketing_consent', $i18n.forms.placeholders.marketing_consent)}
					/>
					<div class="text-sm">
						<span class="form-label cursor-pointer">
							{$i18n.forms.labels.marketing_consent}
						</span>
						<p class="text-sm">
							{$i18n.forms.descriptions.marketing_consent}{' '}
							<a href="/datenschutz#newsletter" class="text-primary-600 hover:underline">
								{$i18n.forms.placeholders.newsletter_terms}
							</a>
						</p>
					</div>
				</label>
			</div>
		</div>
	</form>
{/key}
