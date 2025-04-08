// src/lib/components/modal/modalStore.ts
import { writable, derived } from 'svelte/store';

export type ModalType = 'payment' | 'success' | 'error' | 'confirm' | null;

export interface ModalState {
	isOpen: boolean;
	type: ModalType;
	data: any;
	options: {
		closable: boolean;
		autoClose: boolean;
		autoCloseDelay: number;
		size: string;
		position: string;
	};
}

const defaultOptions = {
	closable: true,
	autoClose: false,
	autoCloseDelay: 0,
	size: '2xl',
	position: 'center'
};

const initialState: ModalState = {
	isOpen: false,
	type: null,
	data: null,
	options: { ...defaultOptions }
};

function createModalStore() {
	const { subscribe, set, update } = writable<ModalState>(initialState);

	return {
		subscribe,

		open: (type: ModalType, data: any = null, options: Partial<ModalState['options']> = {}) => {
			console.log(`Opening modal of type ${type} with data:`, data);
			update((state) => ({
				...state,
				isOpen: true,
				type,
				data,
				options: { ...defaultOptions, ...options }
			}));
		},

		close: () => {
			update((state) => {
				if (!state.options.closable) return state;
				return { ...state, isOpen: false };
			});

			setTimeout(() => {
				set(initialState);
			}, 300);
		},

		updateData: (data: any) => update((state) => ({ ...state, data })),

		reset: () => set(initialState)
	};
}

export const modalStore = createModalStore();

// Helper to check if a specific modal type is open
export const isModalOpen = (type: ModalType) =>
	derived(modalStore, ($store) => $store.isOpen && $store.type === type);
