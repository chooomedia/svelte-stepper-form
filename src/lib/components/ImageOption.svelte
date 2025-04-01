<script lang="ts">
	import { onMount, tick, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import type { ImageOption as ImageOptionType } from '$lib/schema';

	const {
		value = '',
		options = [],
		error = undefined,
		onSelect = undefined,
		multiple = false,
		maxSelections = undefined,
		countdownTime = 7 // Default countdown time in seconds
	} = $props<{
		value: string | string[];
		options: ImageOptionType[];
		error?: string;
		onSelect?: (value: string | string[]) => void;
		multiple?: boolean;
		maxSelections?: number;
		countdownTime?: number;
	}>();

	// Initialize the selected values as an array when in multiple mode
	let selectedValues = $state<string[]>(
		multiple && Array.isArray(value) ? value : multiple && typeof value === 'string' ? [value] : []
	);

	// State for the countdown timer
	let showCountdown = $state(false);
	let countdownSeconds = $state(countdownTime);
	let countdownInterval: number | undefined;
	let advanceTimeout: number | undefined;
	let selectionCount = $state(0);
	let userInteracted = $state(false);

	// Handle selection for both single and multiple modes
	function handleOptionSelect(optionValue: string): void {
		// User has interacted with the component
		userInteracted = true;

		// Clear any existing timeout and interval
		resetTimers();

		let newValue: string | string[];

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
			newValue = [...selectedValues];
			if (onSelect) {
				// For multiple selection, we add a special flag to the array
				// to indicate this is just a selection update, not a navigation trigger
				const valueWithFlag = [...newValue];
				// @ts-ignore - Adding custom property to array
				valueWithFlag._isCountdownRunning = true;
				onSelect(valueWithFlag);
			}

			// Only start countdown if there's at least one selection
			if (selectedValues.length > 0) {
				startCountdown();
			} else {
				// Hide countdown if no selections
				showCountdown = false;
			}
		} else {
			// Single selection mode - immediately select
			newValue = optionValue;
			if (onSelect) {
				onSelect(newValue);
			}
		}
	}

	// Start countdown timer
	function startCountdown() {
		// Reset countdown
		countdownSeconds = countdownTime;
		showCountdown = true;

		// Clear existing timer if it exists
		resetTimers();

		// Start interval to update countdown display
		countdownInterval = setInterval(() => {
			countdownSeconds--;

			if (countdownSeconds <= 0) {
				resetTimers();
			}
		}, 1000);

		// Start timeout to advance after countdownTime seconds
		advanceTimeout = setTimeout(() => {
			// Hide countdown notification
			showCountdown = false;

			// After countdown ends, trigger the parent's onSelect to navigate
			// but without the custom flag
			if (onSelect && selectedValues.length > 0) {
				setTimeout(() => {
					// Here's the key: we don't include the flag, so the parent
					// component knows to trigger navigation
					onSelect([...selectedValues]);
				}, 300); // Short delay after hiding the toast
			}
		}, countdownTime * 1000);
	}

	// Reset all timers
	function resetTimers() {
		if (countdownInterval) {
			clearInterval(countdownInterval);
			countdownInterval = undefined;
		}
		if (advanceTimeout) {
			clearTimeout(advanceTimeout);
			advanceTimeout = undefined;
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

		await tick();
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
			{#if showCountdown && selectedValues.length > 0}
				<!-- Show countdown info -->
				<div class="font-medium text-primary-700">
					{selectionCount === 1 ? '1 Option' : `${selectionCount} Optionen`} ausgewählt · Weiterleitung
					in <span class="font-bold">{countdownSeconds}</span>
					{countdownSeconds === 1 ? 'Sekunde' : 'Sekunden'}
				</div>
			{:else}
				<!-- Default info -->
				{#if maxSelections}
					Du kannst bis zu {maxSelections} Optionen auswählen
				{:else}
					Wähle alle passenden Optionen
				{/if}
			{/if}
		</div>
	{/if}

	<div
		class="grid grid-cols-2 grid-rows-2 gap-4 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))] md:grid-rows-1"
	>
		{#each options as option}
			<button
				type="button"
				class="relative flex h-full flex-col justify-center overflow-hidden rounded-lg border bg-gradient-to-b from-white to-primary-50 shadow-custom transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-600
				{isSelected(option.value)
					? 'border-primary-500 shadow-primary-100 ring-1 ring-primary-500'
					: 'border-gray-100'}"
				onclick={() => handleOptionSelect(option.value)}
				aria-label={option.description || option.label}
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
							alt={option.description || option.label}
							class="h-24 w-auto transform object-contain transition-transform hover:scale-110 lg:h-32"
						/>
					</div>
				{/if}

				<!-- Content container -->
				<div class="w-full border-t border-primary-200 bg-primary px-1 py-2">
					<h3 class="hyphens-auto break-words text-base font-semibold text-secondary">
						{option.label}
					</h3>
					{#if option.description}
						<p class="mb-1 text-[12px] text-secondary-400 text-opacity-80">{option.description}</p>
					{/if}
				</div>
			</button>
		{/each}
	</div>

	{#if error}
		<p class="mt-2 text-sm text-red-600">{error}</p>
	{/if}
</div>
