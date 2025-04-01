<!-- src/lib/components/modal/ModalContent/ConfirmContent.svelte -->
<script lang="ts">
	const {
		message = 'Möchtest du wirklich fortfahren?',
		subMessage = '',
		onConfirm = () => {},
		onCancel = () => {},
		confirmLabel = 'Ja, fortfahren',
		cancelLabel = 'Abbrechen'
	} = $props();
</script>

<div class="confirm-content text-center">
	<p class="mb-4 text-lg text-gray-700">{message}</p>

	{#if subMessage}
		<p class="mb-6 text-sm text-gray-500">{subMessage}</p>
	{/if}

	<!-- Special Offer (optional) -->
	<div class="mb-6 mt-4 rounded-lg bg-primary-100 p-4 text-sm text-secondary-200">
		<p class="font-semibold">Exklusiv: 10% Rabatt bei Abschluss in den nächsten 24 Stunden!</p>
		<p>Nutze diese Gelegenheit für ein noch besseres Angebot.</p>
	</div>

	<div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center sm:gap-4">
		<button class="btn btn-outline hover:bg-primary-100 hover:text-secondary" onclick={onCancel}>
			{cancelLabel}
		</button>
		<button class="btn btn-primary" onclick={onConfirm}>
			{confirmLabel}
		</button>
	</div>
</div>
