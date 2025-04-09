<!-- src/lib/components/modal/ModalController.svelte -->
<script lang="ts">
	import { modalStore } from './modalStore';
	import Modal from './Modal.svelte';
	import PaymentContent from './ModalContent/PaymentContent.svelte';
	import SuccessContent from './ModalContent/SuccessContent.svelte';
	import ErrorContent from './ModalContent/ErrorContent.svelte';
	import ConfirmContent from './ModalContent/ConfirmContent.svelte';
	import { i18n } from '$lib/i18n';
	import { PaymentType, PlanType } from '$lib/types/plans';

	// Props (if needed to override store values)
	export let onSuccess: (details: any) => void = () => {};

	// We'll use a single variable to control which content to show
	$: currentModalType = $modalStore.type;
	$: modalData = $modalStore.data;

	// Get title and subtitle based on current modal type
	$: modalTitle = getModalTitle(currentModalType);
	$: modalSubtitle = getModalSubtitle(currentModalType);

	// Functions to get appropriate titles/subtitles
	function getModalTitle(type: string | null): string {
		if (!type) return '';

		switch (type) {
			case 'payment':
				return $i18n.modal.payment.title;
			case 'success':
				return $i18n.modal.success.title;
			case 'error':
				return $i18n.modal.error.title;
			case 'confirm':
				return $i18n.modal.common.confirm;
			default:
				return '';
		}
	}

	function getModalSubtitle(type: string | null): string {
		if (!type) return '';

		switch (type) {
			case 'payment':
				return $i18n.modal.payment.subtitle;
			case 'success':
				return $i18n.modal.success.modalInfo;
			case 'error':
				return $i18n.modal.error.defaultMessage;
			case 'confirm':
				return modalData?.message || $i18n.modal.confirm.cancelPurchase;
			default:
				return '';
		}
	}
</script>

<!-- Single Modal Controller with dynamic content -->
<Modal
	isOpen={$modalStore.isOpen}
	onClose={() => {
		if (currentModalType === 'payment') {
			modalStore.open('confirm', {
				message: $i18n.modal.confirm.cancelPurchase,
				previousType: 'payment',
				previousData: modalData
			});
		} else {
			modalStore.close();
		}
	}}
	type={currentModalType}
	title={modalTitle}
	subtitle={modalSubtitle}
>
	{#if currentModalType === 'payment'}
		<PaymentContent
			selectedPlan={modalData?.selectedPlan || PlanType.THREE_MONTH}
			paymentType={modalData?.paymentType || PaymentType.MONTHLY}
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
			error={modalData?.error || $i18n.modal.error.defaultMessage}
			errorDetails={modalData?.errorDetails || ''}
			onRetry={() => {
				// Go back to payment modal
				modalStore.open('payment', modalData?.paymentData || {});
			}}
		/>
	{:else if currentModalType === 'confirm'}
		<ConfirmContent
			message={modalData?.message || $i18n.modal.confirm.cancelPurchase}
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
			confirmLabel={modalData?.confirmLabel || $i18n.modal.confirm.confirmButton}
			cancelLabel={modalData?.cancelLabel || $i18n.modal.confirm.cancelButton}
			previousType={modalData?.previousType}
			previousData={modalData?.previousData}
		/>
	{/if}
</Modal>
