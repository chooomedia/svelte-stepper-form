<!-- src/lib/components/EmailReportButton.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { WebhookService } from '$lib/services/webhookService';
	import type { FormData } from '$lib/schema';
	import { modalStore } from '$lib/components/modal';
	import { i18n } from '$lib/i18n';
	import Icon from './Icon.svelte';

	const { formData, disabled = false } = $props<{
		formData: Partial<FormData>;
		disabled?: boolean;
	}>();

	// State
	let isLoading = $state(false);
	let isSent = $state(false);
	let error = $state('');
	let isLimitReached = $state(WebhookService.hasReachedDailyLimit());

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		success: { message: string };
		error: { message: string };
	}>();

	// Send the email report
	async function sendEmailReport() {
		if (isLoading || isSent) return;

		isLoading = true;
		error = '';

		try {
			// Check if we have the necessary data
			if (!formData || !formData.email) {
				throw new Error('Keine E-Mail-Adresse angegeben');
			}

			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(formData.email)) {
				throw new Error('Bitte gib eine gültige E-Mail-Adresse an');
			}

			// Check if form data contains visibility_score
			if (formData.visibility_score === undefined || formData.visibility_score === null) {
				console.warn('Missing visibility_score in form data');
				// Use a default value if missing
				formData.visibility_score = 50;
			}

			// Show loading state
			isLoading = true;

			// Attempt to send the report
			console.log('Sending email report with form data:', formData);
			const result = await WebhookService.sendEmailReport(formData);

			if (result.success) {
				isSent = true;
				isLoading = false;

				// Display success message
				modalStore.open('success', {
					title: 'Analysebericht versendet!',
					message: `Der Bericht wurde erfolgreich an ${formData.email} geschickt`,
					subtitle: 'Bitte überprüfe auch Deinen Spam-Ordner, falls Du die E-Mail nicht findest.',
					type: 'success',
					buttons: [
						{
							label: 'OK',
							action: () => modalStore.close()
						}
					]
				});

				dispatch('success', { message: result.message });
			} else {
				throw new Error(result.message || 'Fehler beim Versenden des Berichts');
			}
		} catch (err) {
			isLoading = false;

			// Set error message
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'Ein unbekannter Fehler ist aufgetreten';
			}

			console.error('Error sending report:', error);

			// Display error message with retry option
			modalStore.open('error', {
				error: 'Fehler beim Versenden des Berichts',
				errorDetails: error,
				onRetry: sendEmailReport
			});

			dispatch('error', { message: error });
		}
	}

	// Reset state
	function reset() {
		isLoading = false;
		isSent = false;
		error = '';
		isLimitReached = WebhookService.hasReachedDailyLimit();
	}

	// Create an effect to check for limit changes
	$effect(() => {
		// Check limit on mount and when anything changes
		isLimitReached = WebhookService.hasReachedDailyLimit();
	});
</script>

<button
	class="w-full rounded-lg bg-primary-600 px-6 py-3 font-semibold text-secondary shadow-sm transition-colors {disabled ||
	isLoading ||
	isSent ||
	isLimitReached
		? 'cursor-not-allowed opacity-70'
		: 'hover:bg-primary-700 hover:shadow-xl'} sm:w-auto lg:mx-3"
	on:click={sendEmailReport}
	disabled={disabled || isLoading || isSent || isLimitReached}
	aria-busy={isLoading}
	title={isLimitReached ? 'Tägliches Limit erreicht' : ''}
>
	{#if isLoading}
		<span class="flex items-center justify-center">
			<svg
				class="mr-2 inline-block h-5 w-5 animate-spin"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
				<path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"></path>
			</svg>
			{$i18n.common.loading}
		</span>
	{:else if isSent}
		<span class="flex items-center justify-center">
			<Icon name="checkCircle" size={20} className="mr-2" stroke="none" />
			{$i18n.common.success}
		</span>
	{:else if isLimitReached}
		<span class="flex items-center justify-center">
			<Icon name="alertTriangle" size={20} className="mr-2" stroke="currentColor" strokeWidth="2" />
			Limit erreicht
		</span>
	{:else}
		<span class="flex items-center justify-center">
			<Icon name="mail" size={20} className="mr-2" />
			{$i18n.results.buttons.getReport}
		</span>
	{/if}
</button>

{#if isLimitReached}
	<div class="mt-2 text-xs text-gray-500">
		Das tägliche Limit für E-Mail-Berichte wurde erreicht. Bitte versuche es morgen erneut.
	</div>
{/if}
