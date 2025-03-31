// src/lib/stores/modalStore.ts
import { writable, derived } from 'svelte/store';

// Exportiere den Typ für die Verwendung in anderen Komponenten
export type ModalType = 'payment' | 'success' | 'error' | 'action' | 'custom';

interface ModalState {
	isOpen: boolean;
	type: 'payment' | 'success' | 'error' | 'action';
	data: any;
	closable: boolean;
	animating: boolean;
	autoClose: boolean;
	autoCloseDelay: number;
}

// Initialer Zustand
const initialState: ModalState = {
	isOpen: false,
	type: 'payment',
	data: null,
	closable: true,
	animating: false,
	autoClose: false,
	autoCloseDelay: 0
};

function createModalStore() {
	const { subscribe, set, update } = writable<ModalState>(initialState);

	return {
		subscribe,

		// Modal öffnen
		open: (type: ModalType, data: any = null, options: Partial<ModalState> = {}) => {
			console.log(`Opening modal of type ${type} with data:`, data);
			update((state) => ({
				...state,
				isOpen: true,
				type,
				data,
				closable: options.closable ?? true,
				autoClose: options.autoClose ?? false,
				autoCloseDelay: options.autoCloseDelay ?? 0,
				animating: true
			}));
		},

		// Modal schließen
		close: () =>
			update((state) => {
				if (!state.closable) return state;
				return { ...state, isOpen: false, animating: true };
			}),

		// Animation beenden
		finishAnimation: () => update((state) => ({ ...state, animating: false })),

		// Daten aktualisieren
		updateData: (data: any) => update((state) => ({ ...state, data })),

		// Modal-Typ ändern
		setType: (type: ModalType) => update((state) => ({ ...state, type })),

		// Reset
		reset: () => set(initialState)
	};
}

export const modalStore = createModalStore();

// Abgeleiteter Store, der anzeigt, ob ein Modal des angegebenen Typs geöffnet ist
export const isModalOpen = (type: ModalType) =>
	derived(modalStore, ($modalStore) => $modalStore.isOpen && $modalStore.type === type);

function open(type: ModalType, data: any = null, options: Partial<ModalState> = {}) {
	console.log(`Opening modal of type ${type} with data:`, data);
	update((state) => ({
		...state,
		isOpen: true,
		type,
		data,
		closable: options.closable ?? true,
		autoClose: options.autoClose ?? false,
		autoCloseDelay: options.autoCloseDelay ?? 0,
		animating: true
	}));
}
