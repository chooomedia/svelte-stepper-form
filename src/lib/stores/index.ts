import { formStore } from './formStore';
import { stepperStore } from './stepperStore';
import { scoreStore } from './scoreStore';
import { taxStore } from './taxStore';
import { currencyStore } from './currencyStore';
import { loadingStore } from './loadingStore';
import { modalStore } from './modalStore';

// Export a single object with all stores
export const stores = {
	form: formStore,
	stepper: stepperStore,
	score: scoreStore,
	tax: taxStore,
	currency: currencyStore,
	loading: loadingStore,
	modal: modalStore
};

// Re-export individual stores for direct import
export { formStore, stepperStore, scoreStore, taxStore, currencyStore, loadingStore, modalStore };

// Export types
export type { FormData } from './formStore';
export type { StepStatus } from './stepperStore';
export type { ModalType } from './modalStore';
