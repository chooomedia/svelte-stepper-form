<!-- src/lib/components/CompanyForm.svelte -->
<script lang="ts">
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
	<!-- Company Name -->
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
			<p class="error-text" id="company_name-error" role="alert">
				{errors.company_name}
			</p>
		{/if}
	</div>

	<!-- Company URL -->
	<div class="form-group">
		<label for="company_url" class="form-label"> Unternehmens-URL </label>
		<input
			type="url"
			id="company_url"
			bind:value={$form.company_url}
			class="input-field {shouldShowError('company_url') ? 'error' : ''}"
			onblur={() => handleBlur('company_url')}
			placeholder="https://www.example.com"
		/>
		{#if shouldShowError('company_url')}
			<p class="error-text" id="company_url-error" role="alert">
				{errors.company_url}
			</p>
		{/if}
		{#if !shouldShowError('company_url') && $form.company_url}
			<p class="mt-1 text-sm text-gray-500" id="company_url-description">
				Die URL sollte mit http:// oder https:// beginnen
			</p>
		{/if}
	</div>
</form>
