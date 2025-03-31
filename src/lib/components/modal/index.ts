// src/lib/components/modal/index.ts
export { default as Modal } from './Modal.svelte';
export { default as ModalController } from './ModalController.svelte';
export { modalStore, type ModalType } from './modalStore';

// Export individual content components for direct use if needed
export { default as PaymentContent } from './ModalContent/PaymentContent.svelte';
export { default as SuccessContent } from './ModalContent/SuccessContent.svelte';
export { default as ErrorContent } from './ModalContent/ErrorContent.svelte';
export { default as ConfirmContent } from './ModalContent/ConfirmContent.svelte';
