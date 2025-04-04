<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { ImageOption as ImageOptionType } from '$lib/schema';
	import { getLocalizedLabel, getLocalizedDescription, currentLocale } from '$lib/i18n';

	interface Props {
		value?: string | string[];
		options: ImageOptionType[];
		error?: string;
		onSelect?: (value: string | string[]) => void;
		multiple?: boolean;
		maxSelections?: number;
		countdownTime?: number;
		fieldName?: string;
	}

	// Props mit Standardwerten
	const {
		value = '',
		options = [],
		error = undefined,
		onSelect = () => {},
		multiple = false,
		maxSelections = undefined,
		countdownTime = 3,
		fieldName = ''
	} = $props<Props>();

	// Event Dispatcher mit modernem TypeScript-Typ
	const dispatch = createEventDispatcher<{
		navigate: { fieldName: string; values: string[] };
	}>();

	// Reaktive Zustände für Auswahl und Interaktion
	let selectedValues = $state<string[]>(
		multiple && Array.isArray(value) ? value : multiple && typeof value === 'string' ? [value] : []
	);

	// Countdown und Navigationszustände
	let showCountdown = $state(false);
	let countdownSeconds = $state(countdownTime);
	let countdownInterval: number | undefined;
	let selectionCount = $state(0);
	let navigationTriggered = $state(false);

	// Option-Auswahl-Handler
	function handleOptionSelect(optionValue: string): void {
		// Timer zurücksetzen
		resetTimers();

		if (multiple) {
			selectedValues = handleMultipleSelection(optionValue);
			selectionCount = selectedValues.length;

			// Callback aufrufen
			onSelect(selectedValues);

			// Countdown starten, wenn Optionen ausgewählt
			if (selectedValues.length > 0) {
				startCountdown();
			} else {
				showCountdown = false;
			}
		} else {
			// Einzelauswahl
			onSelect(optionValue);

			if (fieldName && !navigationTriggered) {
				navigationTriggered = true;
				triggerNavigation([optionValue]);
			}
		}
	}

	// Mehrfachauswahl-Logik
	function handleMultipleSelection(optionValue: string): string[] {
		const isSelected = selectedValues.includes(optionValue);

		if (isSelected) {
			// Option deselektieren
			return selectedValues.filter((val) => val !== optionValue);
		} else {
			// Option selektieren unter Berücksichtigung von maxSelections
			if (maxSelections && selectedValues.length >= maxSelections) {
				return [...selectedValues.slice(1), optionValue];
			}
			return [...selectedValues, optionValue];
		}
	}

	// Navigation auslösen
	function triggerNavigation(values: string[]) {
		setTimeout(() => {
			dispatch('navigate', { fieldName, values });

			// Debug-Event für globales Monitoring
			window.dispatchEvent(
				new CustomEvent('debugNavigation', {
					detail: { fieldName, values }
				})
			);
		}, 100);
	}

	// Countdown-Funktionen
	function startCountdown() {
		countdownSeconds = countdownTime;
		showCountdown = true;
		navigationTriggered = false;

		resetTimers();

		countdownInterval = setInterval(() => {
			countdownSeconds--;

			if (countdownSeconds <= 0) {
				resetTimers();

				if (selectedValues.length > 0 && fieldName && !navigationTriggered) {
					navigationTriggered = true;
					triggerNavigation(selectedValues);
				}
			}
		}, 1000);
	}

	function resetTimers() {
		if (countdownInterval) {
			clearInterval(countdownInterval);
			countdownInterval = undefined;
		}
	}

	// Aufräumen bei Komponentenzerstörung
	$effect(() => {
		return () => {
			resetTimers();
		};
	});

	// Sprachänderung reaktiv machen
	$effect(() => {
		// Trigger für Neurendern bei Sprachänderung
		console.log('Current locale:', $currentLocale);
	});

	// Option-Auswahlstatus prüfen
	const isSelected = (optionValue: string): boolean =>
		multiple ? selectedValues.includes(optionValue) : value === optionValue;
</script>

<div class="relative">
	{#key $currentLocale}
		{#if multiple}
			<div class="mb-4 text-center text-xs text-gray-600">
				<div class="font-medium text-primary-700">
					{#if showCountdown && selectedValues.length > 0}
						{selectionCount === 1 ? '1 Option' : `${selectionCount} Optionen`}
						ausgewählt · weiter in
						<span class="font-bold">{countdownSeconds}</span>
						{countdownSeconds === 1 ? 'Sekunde' : 'Sekunden'}
					{:else if maxSelections}
						Du kannst bis zu {maxSelections} Optionen auswählen
					{:else}
						Wähle alle passenden Optionen
					{/if}
				</div>
			</div>
		{/if}

		<div
			class="grid grid-cols-2 grid-rows-2 gap-4 pt-2 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))] md:grid-rows-1"
		>
			{#each options as option}
				<button
					type="button"
					class="relative flex h-full flex-col justify-center overflow-hidden rounded-lg border bg-gradient-to-b from-white to-primary-50 shadow-custom transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-600 {isSelected(
						option.value
					)
						? 'border-primary-500 shadow-primary-100 ring-1 ring-primary-500'
						: 'border-gray-100'}"
					onclick={() => handleOptionSelect(option.value)}
					aria-label={getLocalizedDescription(fieldName, option.value)}
					aria-pressed={isSelected(option.value)}
				>
					{#if isSelected(option.value)}
						<div
							class="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-secondary"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					{/if}

					{#if option.imgSrc}
						<div class="mx-auto p-4">
							<img
								src={option.imgSrc}
								alt={getLocalizedDescription(fieldName, option.value)}
								class="h-24 w-auto transform object-contain transition-transform hover:scale-110 lg:h-32"
							/>
						</div>
					{/if}

					<div class="w-full border-t border-primary-200 bg-primary px-1 py-2">
						<h3 class="hyphens-auto break-words text-base font-semibold text-secondary">
							{getLocalizedLabel(fieldName, option.value)}
						</h3>

						<p class="mb-1 text-[12px] text-secondary-400 text-opacity-80">
							{getLocalizedDescription(fieldName, option.value)}
						</p>
					</div>
				</button>
			{/each}
		</div>

		{#if error}
			<p class="mt-2 text-sm text-red-600">{error}</p>
		{/if}
	{/key}
</div>
