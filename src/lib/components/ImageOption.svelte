<script lang="ts">
	import { onMount, tick, onDestroy, createEventDispatcher } from 'svelte';
	import type { ImageOption as ImageOptionType } from '$lib/schema';
	import { getTranslatedLabel, getTranslatedDescription } from '$lib/i18n';

	// Explicit event dispatcher for navigation events
	const dispatch = createEventDispatcher<{
		navigate: { fieldName: string; values: string[] };
	}>();

	const {
		value = '',
		options = [],
		error = undefined,
		onSelect = undefined,
		multiple = false,
		maxSelections = undefined,
		countdownTime = 3,
		fieldName = ''
	} = $props<{
		value: string | string[];
		options: ImageOptionType[];
		error?: string;
		onSelect?: (value: string | string[]) => void;
		multiple?: boolean;
		maxSelections?: number;
		countdownTime?: number;
		fieldName?: string;
	}>();

	// Initialize the selected values as an array when in multiple mode
	let selectedValues = $state<string[]>(
		multiple && Array.isArray(value) ? value : multiple && typeof value === 'string' ? [value] : []
	);

	// State for the countdown timer
	let showCountdown = $state(false);
	let countdownSeconds = $state(countdownTime);
	let countdownInterval: number | undefined;
	let selectionCount = $state(0);
	let userInteracted = $state(false);
	let navigationTriggered = $state(false);

	// Handle selection for both single and multiple modes
	function handleOptionSelect(optionValue: string): void {
		// User has interacted with the component
		userInteracted = true;

		// Clear any existing timeout and interval
		resetTimers();

		if (multiple) {
			// If this option is already selected, remove it
			if (selectedValues.includes(optionValue)) {
				selectedValues = selectedValues.filter((val) => val !== optionValue);
			} else {
				// Otherwise add it, but respect maxSelections if set
				if (maxSelections && selectedValues.length >= maxSelections) {
					// Remove the oldest selection if we've reached the max
					selectedValues = [...selectedValues.slice(1), optionValue];
				} else {
					selectedValues = [...selectedValues, optionValue];
				}
			}

			// Update selection count
			selectionCount = selectedValues.length;

			// Call the onSelect callback with array value
			if (onSelect) {
				onSelect([...selectedValues]);
			}

			// Only start countdown if there's at least one selection
			if (selectedValues.length > 0) {
				startCountdown();
			} else {
				// Hide countdown if no selections
				showCountdown = false;
			}
		} else {
			// Single selection mode - immediately select and emit navigation event
			if (onSelect) {
				onSelect(optionValue);
			}

			// For single selection, we immediately dispatch a navigation event
			if (fieldName && !navigationTriggered) {
				navigationTriggered = true;
				console.log(
					`Single selection: Dispatching navigate event for ${fieldName} with value:`,
					optionValue
				);
				setTimeout(() => {
					dispatch('navigate', { fieldName, values: [optionValue] });

					// Debug event for global monitoring
					window.dispatchEvent(
						new CustomEvent('debugNavigation', {
							detail: { fieldName, values: [optionValue] }
						})
					);
				}, 100);
			}
		}
	}

	// Start countdown timer
	function startCountdown() {
		// Reset countdown
		countdownSeconds = countdownTime;
		showCountdown = true;
		navigationTriggered = false;

		// Clear existing timer if it exists
		resetTimers();

		// Start interval to update countdown display and handle navigation
		countdownInterval = setInterval(() => {
			countdownSeconds--;

			// When countdown reaches 0, trigger navigation
			if (countdownSeconds <= 0) {
				resetTimers();

				// Trigger navigation if we have selections
				if (selectedValues.length > 0 && fieldName && !navigationTriggered) {
					navigationTriggered = true;
					console.log(`Countdown reached 0 for ${fieldName}, dispatching navigate event`);

					// Dispatch the event
					dispatch('navigate', { fieldName, values: [...selectedValues] });

					// Debug event for global monitoring
					window.dispatchEvent(
						new CustomEvent('debugNavigation', {
							detail: { fieldName, values: selectedValues }
						})
					);
				}
			}
		}, 1000);
	}

	// Reset all timers
	function resetTimers() {
		if (countdownInterval) {
			clearInterval(countdownInterval);
			countdownInterval = undefined;
		}
	}

	// Keep selectedValues in sync with value
	$effect(() => {
		if (multiple) {
			if (Array.isArray(value)) {
				selectedValues = [...value];
			} else if (value) {
				selectedValues = [value as string];
			} else {
				selectedValues = [];
			}
		}
	});

	// Check if an option is selected
	const isSelected = (optionValue: string): boolean => {
		if (multiple) {
			return selectedValues.includes(optionValue);
		}
		return value === optionValue;
	};

	// Initial setup
	onMount(async () => {
		// Ensure our selected values are in sync on mount
		if (multiple) {
			if (Array.isArray(value)) {
				selectedValues = [...value];
			} else if (value) {
				selectedValues = [value as string];
			}
		}

		// Initialize selection count if we already have values
		if (multiple && selectedValues.length > 0) {
			selectionCount = selectedValues.length;
			startCountdown();
		}

		// Add a global debug listener
		const debugHandler = (e: CustomEvent) => {
			console.log('Global debug navigation event detected:', e.detail);
		};
		window.addEventListener('debugNavigation', debugHandler);

		await tick();

		return () => {
			window.removeEventListener('debugNavigation', debugHandler);
		};
	});

	// Cleanup
	onDestroy(() => {
		resetTimers();
	});
</script>

<div class="relative">
	<!-- Information about max selections with countdown status -->
	{#if multiple}
		<div class="mb-4 text-center text-xs text-gray-600">
			<div class="font-medium text-primary-700">
				{#if showCountdown && selectedValues.length > 0}
					<!-- Show countdown info -->
					{selectionCount === 1 ? '1 Option' : `${selectionCount} Optionen`} ausgewählt · weiter in
					<span class="font-bold">{countdownSeconds}</span>
					{countdownSeconds === 1 ? 'Sekunde' : 'Sekunden'}
				{:else}
					<!-- Default info -->
					{#if maxSelections}
						Du kannst bis zu {maxSelections} Optionen auswählen
					{:else}
						Wähle alle passenden Optionen
					{/if}
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
				class="relative flex h-full flex-col justify-center overflow-hidden rounded-lg border bg-gradient-to-b from-white to-primary-50 shadow-custom transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-600
				{isSelected(option.value)
					? 'border-primary-500 shadow-primary-100 ring-1 ring-primary-500'
					: 'border-gray-100'}"
				onclick={() => handleOptionSelect(option.value)}
				aria-label={getTranslatedDescription(fieldName, option.value)}
				aria-pressed={isSelected(option.value)}
			>
				<!-- Selection indicator -->
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
					<!-- Image container -->
					<div class="mx-auto p-4">
						<img
							src={option.imgSrc}
							alt={getTranslatedDescription(fieldName, option.value)}
							class="h-24 w-auto transform object-contain transition-transform hover:scale-110 lg:h-32"
						/>
					</div>
				{/if}

				<!-- Content container -->
				<div class="w-full border-t border-primary-200 bg-primary px-1 py-2">
					<h3 class="hyphens-auto break-words text-base font-semibold text-secondary">
						{getTranslatedLabel(fieldName, option.value)}
					</h3>

					<p class="mb-1 text-[12px] text-secondary-400 text-opacity-80">
						{getTranslatedDescription(fieldName, option.value)}
					</p>
				</div>
			</button>
		{/each}
	</div>

	{#if error}
		<p class="mt-2 text-sm text-red-600">{error}</p>
	{/if}
</div>
