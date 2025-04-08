<!-- src/lib/components/modal/ModalController.svelte -->
<script lang="ts">
	import { modalStore } from './modalStore';
	import Modal from './Modal.svelte';
	import PaymentContent from './ModalContent/PaymentContent.svelte';
	import SuccessContent from './ModalContent/SuccessContent.svelte';
	import ErrorContent from './ModalContent/ErrorContent.svelte';
	import ConfirmContent from './ModalContent/ConfirmContent.svelte';
	import { i18n } from '$lib/i18n';

	// Props (if needed to override store values)
	export let onSuccess: (details: any) => void = () => {};

	// We'll use a single variable to control which content to show
	$: currentModalType = $modalStore.type;
	$: modalData = $modalStore.data;
</script>

<!-- Single Modal Controller with dynamic content -->
<Modal
	isOpen={$modalStore.isOpen}
	onClose={() => {
		if (currentModalType === 'payment') {
			modalStore.open('confirm', {
				message:
					$i18n.confirmModal?.cancelPurchase || 'Möchtest du den Kaufvorgang wirklich abbrechen?',
				previousType: 'payment',
				previousData: modalData
			});
		} else {
			modalStore.close();
		}
	}}
	title={currentModalType === 'payment'
		? 'Bezahlung abschließen'
		: currentModalType === 'success'
			? 'Zahlung erfolgreich!'
			: currentModalType === 'error'
				? 'Zahlungsfehler'
				: 'Bestätigung'}
	subtitle={currentModalType === 'success'
		? 'Vielen Dank für Deinen Kauf.'
		: currentModalType === 'error'
			? modalData?.error || 'Ein Fehler ist aufgetreten'
			: ''}
	type={currentModalType === 'error' || currentModalType === 'confirm' ? 'error' : 'default'}
	size={currentModalType === 'success' ? '2xl' : 'xl'}
	closeOnClickOutside={!(currentModalType === 'payment' && modalData?.isProcessing)}
	closeOnEsc={!(currentModalType === 'payment' && modalData?.isProcessing)}
>
	{#if currentModalType === 'payment'}
		<PaymentContent
			selectedPlan={modalData?.selectedPlan || '3-MONATS-PLAN'}
			paymentType={modalData?.paymentType || 'einmalig'}
			totalPrice={modalData?.totalPrice || 0}
			showExtraDiscount={modalData?.showExtraDiscount || false}
			containerSelector="#paypal-button-container"
			onSuccess={(details) => {
				// Store payment details in the modalStore before switching to success
				const successData = {
					details,
					selectedPlan: modalData?.selectedPlan,
					paymentType: modalData?.paymentType,
					includeDonation: modalData?.includeDonation,
					donationAmount: modalData?.donationAmount || 0,
					customerName: details?.payer?.name?.given_name || '',
					redirectUrl: modalData?.redirectUrl || ''
				};

				// Call the provided success callback
				onSuccess(details);

				// Open success modal with the payment data
				modalStore.open('success', successData);
			}}
		/>
	{:else if currentModalType === 'success'}
		<SuccessContent
			paymentDetails={modalData?.details}
			selectedPlan={modalData?.selectedPlan}
			paymentType={modalData?.paymentType}
			donationAmount={modalData?.donationAmount}
			customerName={modalData?.customerName}
			redirectUrl={modalData?.redirectUrl}
		/>
	{:else if currentModalType === 'error'}
		<ErrorContent
			error={modalData?.error || 'Ein Fehler ist aufgetreten'}
			errorDetails={modalData?.errorDetails || ''}
			onRetry={() => {
				// Go back to payment modal
				modalStore.open('payment', modalData?.paymentData || {});
			}}
		/>
	{:else if currentModalType === 'confirm'}
		<ConfirmContent
			message={modalData?.message || 'Möchtest du wirklich fortfahren?'}
			subMessage={modalData?.subMessage || ''}
			onConfirm={() => {
				// Execute confirm action if provided
				if (modalData?.onConfirm) {
					modalData.onConfirm();
				}
				modalStore.close();
			}}
			onCancel={() => {
				// Go back to previous modal or close
				if (modalData?.onCancel) {
					modalData.onCancel();
				} else if (modalData?.previousType) {
					modalStore.open(modalData.previousType, modalData.previousData);
				} else {
					modalStore.close();
				}
			}}
			confirmLabel={modalData?.confirmLabel || 'Ja, fortfahren'}
			cancelLabel={modalData?.cancelLabel || 'Abbrechen'}
			previousType={modalData?.previousType}
			previousData={modalData?.previousData}
		/>
	{/if}
</Modal>
