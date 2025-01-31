<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormData } from '$lib/schema';
	import type { ZodValidation } from 'sveltekit-superforms';

	let { form, errors } = $props<{
		form: SuperValidated<FormData>;
		errors: ZodValidation<FormData>;
	}>();
</script>

<div class="form-group space-y-4">
	<div>
		<label for="salutation" class="block text-sm font-medium text-gray-900">Anrede</label>
		<select
			id="salutation"
			name="salutation"
			bind:value={$form.salutation}
			class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
		>
			<option value="Herr">Herr</option>
			<option value="Frau">Frau</option>
			<option value="Divers">Divers</option>
		</select>
		{#if $errors.salutation}
			<p class="text-sm text-red-600">{$errors.salutation}</p>
		{/if}
	</div>

	<div>
		<label for="first_name" class="block text-sm font-medium text-gray-900">Vorname</label>
		<input
			type="text"
			id="first_name"
			name="first_name"
			bind:value={$form.first_name}
			class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
		/>
		{#if $errors.first_name}
			<p class="text-sm text-red-600">{$errors.first_name}</p>
		{/if}
	</div>

	<div>
		<label for="last_name" class="block text-sm font-medium text-gray-900">Nachname</label>
		<input
			type="text"
			id="last_name"
			name="last_name"
			bind:value={$form.last_name}
			class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
		/>
		{#if $errors.last_name}
			<p class="text-sm text-red-600">{$errors.last_name}</p>
		{/if}
	</div>

	<div>
		<label for="email" class="block text-sm font-medium text-gray-900">E-Mail</label>
		<input
			type="email"
			id="email"
			name="email"
			bind:value={$form.email}
			class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
		/>
		{#if $errors.email}
			<p class="text-sm text-red-600">{$errors.email}</p>
		{/if}
	</div>

	<div>
		<label for="phone" class="block text-sm font-medium text-gray-900">Telefon</label>
		<input
			type="tel"
			id="phone"
			name="phone"
			bind:value={$form.phone}
			class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
		/>
		{#if $errors.phone}
			<p class="text-sm text-red-600">{$errors.phone}</p>
		{/if}
	</div>

	<div class="flex items-start space-x-2">
		<input
			type="checkbox"
			id="privacy_agreement"
			name="privacy_agreement"
			bind:checked={$form.privacy_agreement}
			class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
		/>
		<label for="privacy_agreement" class="text-sm text-gray-900">
			Hiermit bestätige ich die Datenschutzbestimmungen
		</label>
	</div>
	{#if $errors.privacy_agreement}
		<p class="text-sm text-red-600">{$errors.privacy_agreement}</p>
	{/if}
</div>
