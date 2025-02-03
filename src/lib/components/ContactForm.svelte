<!-- src/lib/components/ContactForm.svelte -->
<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormData } from '$lib/schema';

	interface Props {
		form: SuperValidated<FormData>;
		errors: Record<string, string>;
	}

	let { form, errors } = $props<Props>();

	// Track field focus for enhanced validation UX
	let touchedFields = $state(new Set<string>());

	// Handle field blur
	function handleBlur(fieldName: string) {
		touchedFields.add(fieldName);
	}

	// Check if field should show error
	function shouldShowError(fieldName: string): boolean {
		return touchedFields.has(fieldName) && !!errors[fieldName];
	}

	// Get ARIA attributes for field
	function getAriaAttrs(fieldName: string, label: string) {
		return {
			'aria-invalid': shouldShowError(fieldName) ? 'true' : undefined,
			'aria-describedby': shouldShowError(fieldName) ? `${fieldName}-error` : undefined,
			'aria-label': label
		};
	}
</script>

<form method="POST" class="space-y-6" novalidate>
	<!-- Salutation -->
	<div class="form-group">
		<label for="salutation" class="form-label"> Anrede * </label>
		<select
			id="salutation"
			bind:value={$form.salutation}
			class="input-field {shouldShowError('salutation') ? 'error' : ''}"
			onblur={() => handleBlur('salutation')}
			{...getAriaAttrs('salutation', 'Bitte wählen Sie Ihre Anrede')}
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
				{...getAriaAttrs('first_name', 'Bitte geben Sie Ihren Vornamen ein')}
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
				{...getAriaAttrs('last_name', 'Bitte geben Sie Ihren Nachnamen ein')}
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
			{...getAriaAttrs('email', 'Bitte geben Sie Ihre E-Mail-Adresse ein')}
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
