<!-- src/lib/components/modal/ModalController.svelte -->
<script lang="ts">
	import { modalStore } from './modalStore';
	import Modal from './Modal.svelte';
	import PaymentContent from './ModalContent/PaymentContent.svelte';
	import SuccessContent from './ModalContent/SuccessContent.svelte';
	import ErrorContent from './ModalContent/ErrorContent.svelte';
	import ConfirmContent from './ModalContent/ConfirmContent.svelte';

	// Props (if needed to override store values)
	export let onSuccess: (details: any) => void = () => {};
</script>

<!-- Handle all modal types based on the modalStore state -->
{#if $modalStore.isOpen}
	<!-- Payment Modal -->
	{#if $modalStore.type === 'payment'}
		<Modal
			isOpen={true}
			onClose={() =>
				modalStore.open('confirm', { message: 'Möchtest du den Kaufvorgang wirklich abbrechen?' })}
			title="Bezahlung abschließen"
			size="xl"
			type="default"
			closeOnClickOutside={!$modalStore.data?.isProcessing}
			closeOnEsc={!$modalStore.data?.isProcessing}
		>
			<PaymentContent
				selectedPlan={$modalStore.data?.selectedPlan || '3-MONATS-PLAN'}
				paymentType={$modalStore.data?.paymentType || 'einmalig'}
				totalPrice={$modalStore.data?.totalPrice || 0}
				onSuccess={(details) => {
					// Store payment details in the modalStore before switching to success
					const successData = {
						details,
						selectedPlan: $modalStore.data?.selectedPlan,
						paymentType: $modalStore.data?.paymentType,
						includeDonation: $modalStore.data?.includeDonation,
						donationAmount: $modalStore.data?.donationAmount || 0,
						customerName: details?.payer?.name?.given_name || '',
						redirectUrl: $modalStore.data?.redirectUrl || ''
					};

					// Call the provided success callback
					onSuccess(details);

					// Open success modal with the payment data
					modalStore.open('success', successData);
				}}
			/>
		</Modal>

		<!-- Success Modal -->
	{:else if $modalStore.type === 'success'}
		<Modal
			isOpen={true}
			onClose={() => modalStore.close()}
			title="Zahlung erfolgreich!"
			subtitle="Vielen Dank für Deinen Kauf."
			type="success"
			size="xl"
		>
			<SuccessContent
				paymentDetails={$modalStore.data?.details}
				selectedPlan={$modalStore.data?.selectedPlan}
				paymentType={$modalStore.data?.paymentType}
				donationAmount={$modalStore.data?.donationAmount}
				customerName={$modalStore.data?.customerName}
				redirectUrl={$modalStore.data?.redirectUrl}
			/>
		</Modal>

		<!-- Error Modal -->
	{:else if $modalStore.type === 'error'}
		<Modal
			isOpen={true}
			onClose={() => modalStore.close()}
			title="Zahlungsfehler"
			subtitle={$modalStore.data?.error || 'Ein Fehler ist aufgetreten'}
			type="error"
			size="lg"
		>
			<ErrorContent
				error={$modalStore.data?.error || 'Ein Fehler ist aufgetreten'}
				errorDetails={$modalStore.data?.errorDetails || ''}
				onRetry={() => {
					// Go back to payment modal
					modalStore.open('payment', $modalStore.data?.paymentData || {});
				}}
			/>
		</Modal>

		<!-- Confirm Modal -->
	{:else if $modalStore.type === 'confirm'}
		<Modal
			isOpen={true}
			onClose={() => modalStore.close()}
			title="Bestätigung"
			type="warning"
			size="md"
		>
			<ConfirmContent
				message={$modalStore.data?.message || 'Möchtest du wirklich fortfahren?'}
				subMessage={$modalStore.data?.subMessage || ''}
				onConfirm={() => {
					// Execute confirm action if provided
					if ($modalStore.data?.onConfirm) {
						$modalStore.data.onConfirm();
					}
					modalStore.close();
				}}
				onCancel={() => {
					// Go back to previous modal or close
					if ($modalStore.data?.onCancel) {
						$modalStore.data.onCancel();
					} else if ($modalStore.data?.previousType) {
						modalStore.open($modalStore.data.previousType, $modalStore.data.previousData);
					} else {
						modalStore.close();
					}
				}}
				confirmLabel={$modalStore.data?.confirmLabel || 'Ja, fortfahren'}
				cancelLabel={$modalStore.data?.cancelLabel || 'Abbrechen'}
			/>
		</Modal>
	{/if}
{/if}
