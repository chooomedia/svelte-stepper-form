// src/lib/stores/betterplaceStore.ts
import { writable, derived } from 'svelte/store';
import { BetterplaceService } from '$lib/services/betterplaceService';
import { BETTERPLACE_CONFIG } from '$lib/config/downloads';

// Store für den Fundraising Event Titel
export const fundraisingEventTitle = writable<string>(BETTERPLACE_CONFIG.EVENT_DETAILS.TITLE);

// Store für den Event-Status
export const eventLoadingStatus = writable<'idle' | 'loading' | 'success' | 'error'>('idle');

// Store für Event-Details
export const fundraisingEventDetails = writable<{
	title: string;
	progress: number;
	donated: number;
	requested: number;
} | null>(null);

// Abgeleiteter Store für den Anzeige-Text
export const donationDisplayText = derived(
	[fundraisingEventTitle, eventLoadingStatus],
	([$title, $status]) => {
		if ($status === 'loading') {
			return 'Umweltschutzprojekte...';
		}
		return $title || BETTERPLACE_CONFIG.EVENT_DETAILS.TITLE;
	}
);

// Funktion zum Laden des Event-Titels
export async function loadFundraisingEventTitle(): Promise<void> {
	eventLoadingStatus.set('loading');

	try {
		const title = await BetterplaceService.getFundraisingEventTitle();
		fundraisingEventTitle.set(title);
		eventLoadingStatus.set('success');
		console.log('✅ Fundraising event title loaded:', title);
	} catch (error) {
		console.error('❌ Error loading fundraising event title:', error);
		eventLoadingStatus.set('error');
		// Fallback auf Konfigurationswert
		fundraisingEventTitle.set(BETTERPLACE_CONFIG.EVENT_DETAILS.TITLE);
	}
}

// Funktion zum Laden der Event-Details
export async function loadFundraisingEventDetails(): Promise<void> {
	try {
		const progress = await BetterplaceService.getFundraisingEventProgress();
		fundraisingEventDetails.set({
			title: $fundraisingEventTitle,
			progress: progress.percentage,
			donated: progress.donated,
			requested: progress.requested
		});
	} catch (error) {
		console.error('❌ Error loading fundraising event details:', error);
	}
}

// Funktion zum Zurücksetzen des Stores
export function resetBetterplaceStore(): void {
	fundraisingEventTitle.set(BETTERPLACE_CONFIG.EVENT_DETAILS.TITLE);
	eventLoadingStatus.set('idle');
	fundraisingEventDetails.set(null);
}
