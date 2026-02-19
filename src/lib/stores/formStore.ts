import { writable, derived } from 'svelte/store';

// Store für den berechneten Score des Formulars
export const calculatedScore = writable<number>(0);

// Store für alle Formulardaten
export const formData = writable<Record<string, any>>({});

// Store für den aktuellen Formularstatus
export const formStatus = writable<'idle' | 'submitting' | 'success' | 'error'>('idle');

// Store für Formularfehler
export const formErrors = writable<Record<string, string>>({});

// Store für die Formularvalidierung
export const formValidation = writable<Record<string, boolean>>({});

// Store für die Formularhistorie (für Undo/Redo)
export const formHistory = writable<Array<Record<string, any>>>([]);
export const historyIndex = writable<number>(-1);

// Abgeleitete Stores für bessere Datenverwaltung
export const hasContactData = derived(formData, ($formData) => {
	return !!(($formData.first_name || $formData.last_name) && $formData.email);
});

export const hasCompanyData = derived(formData, ($formData) => {
	return !!($formData.company_name || $formData.company_url);
});

export const isFormComplete = derived(formData, ($formData) => {
	const requiredFields = ['first_name', 'last_name', 'email', 'company_name', 'company_url'];
	return requiredFields.every(
		(field) => $formData[field] && $formData[field].toString().trim() !== ''
	);
});

export const formProgress = derived(formData, ($formData) => {
	const totalFields = 8; // Gesamtanzahl der Felder
	const filledFields = Object.values($formData).filter(
		(value) => value && value.toString().trim() !== '' && value !== false
	).length;
	return Math.round((filledFields / totalFields) * 100);
});

// Funktion zum Zurücksetzen des Stores
export function resetFormStore() {
	calculatedScore.set(0);
	formData.set({});
	formStatus.set('idle');
	formErrors.set({});
	formValidation.set({});

	formHistory.set([]);
	historyIndex.set(-1);
}

// Funktion zum Aktualisieren des berechneten Scores
export function updateCalculatedScore(score: number) {
	calculatedScore.set(score);
}

// Funktion zum Aktualisieren der Formulardaten
export function updateFormData(data: Record<string, any>) {
	formData.update((current) => {
		const newData = { ...current, ...data };

		// Füge zur Historie hinzu (für Undo/Redo)
		addToHistory(current);

		return newData;
	});
}

// Funktion zum Setzen des Formularstatus
export function setFormStatus(status: 'idle' | 'submitting' | 'success' | 'error') {
	formStatus.set(status);
}

// Funktion zum Setzen von Formularfehlern
export function setFormErrors(errors: Record<string, string>) {
	formErrors.set(errors);
}

// Funktion zum Setzen der Formularvalidierung
export function setFormValidation(validation: Record<string, boolean>) {
	formValidation.set(validation);
}

// Funktion zum Hinzufügen zur Historie
function addToHistory(data: Record<string, any>) {
	// Verwende einen einfacheren Ansatz ohne Historie für jetzt
	// TODO: Historie-Funktionalität später implementieren
}

// Funktion zum Exportieren der Formulardaten
export function exportFormData(): string {
	let data = {};
	formData.update((current) => {
		data = current;
		return current;
	});
	return JSON.stringify(data, null, 2);
}

// Erstelle einen zentralen formStore mit allen Funktionen
export const formStore = {
	// Stores
	calculatedScore,
	formData,
	formStatus,
	formErrors,
	formValidation,
	formHistory,
	historyIndex,

	// Abgeleitete Stores
	hasContactData,
	hasCompanyData,
	isFormComplete,
	formProgress,

	// Funktionen
	resetFormStore,
	updateCalculatedScore,
	updateFormData,
	setFormStatus,
	setFormErrors,
	setFormValidation,
	exportFormData,
	importFormData,
	saveToLocalStorage,
	loadFromLocalStorage,
	validateFormData,
	resetToDefaults
};

// Funktion zum Importieren der Formulardaten
export function importFormData(jsonData: string): boolean {
	try {
		const data = JSON.parse(jsonData);
		if (typeof data === 'object' && data !== null) {
			formData.set(data);
			return true;
		}
		return false;
	} catch (error) {
		console.error('Error importing form data:', error);
		return false;
	}
}

// Funktion zum Speichern in localStorage
export function saveToLocalStorage() {
	try {
		let data = {};
		formData.update((current) => {
			data = current;
			return current;
		});
		localStorage.setItem('digitalpusher_form_data', JSON.stringify(data));
		return true;
	} catch (error) {
		console.error('Error saving to localStorage:', error);
		return false;
	}
}

// Funktion zum Laden aus localStorage
export function loadFromLocalStorage(): boolean {
	try {
		const data = localStorage.getItem('digitalpusher_form_data');
		if (data) {
			const parsedData = JSON.parse(data);
			formData.set(parsedData);
			return true;
		}
		return false;
	} catch (error) {
		console.error('Error loading from localStorage:', error);
		return false;
	}
}

// Funktion zum Validieren der Formulardaten
export function validateFormData(): { isValid: boolean; errors: Record<string, string> } {
	let data = {};
	formData.update((current) => {
		data = current;
		return current;
	});

	const errors: Record<string, string> = {};

	// Pflichtfelder prüfen
	if (!data.first_name?.trim()) errors.first_name = 'Vorname ist erforderlich';
	if (!data.last_name?.trim()) errors.last_name = 'Nachname ist erforderlich';
	if (!data.email?.trim()) errors.email = 'E-Mail ist erforderlich';

	// E-Mail-Format prüfen
	if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
		errors.email = 'Ungültiges E-Mail-Format';
	}

	// URL-Format prüfen (wenn vorhanden)
	if (data.company_url && !/^https?:\/\/.+/.test(data.company_url)) {
		errors.company_url = 'Ungültiges URL-Format';
	}

	setFormErrors(errors);
	return { isValid: Object.keys(errors).length === 0, errors };
}

// Funktion zum Zurücksetzen auf Standardwerte
export function resetToDefaults(defaults: Record<string, any>) {
	formData.set({ ...defaults });
	formErrors.set({});
	formValidation.set({});

	formHistory.set([]);
	historyIndex.set(-1);
}
