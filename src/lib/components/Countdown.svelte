<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { i18n } from '$lib/i18n';

	// Props with Svelte 5 syntax
	const {
		duration = 3, // Duration in seconds
		onComplete = () => {}, // What happens when countdown finishes
		autoStart = true, // Start automatically?
		textClass = 'text-primary-700', // Tailwind class for text color
		size = 'default', // Size: 'small', 'default', 'large'
		beforeText = $i18n?.forms?.imageOption?.continueIn || 'weiter in', // Text before counter
		afterText = '', // Text after counter (if specified)
		singularText = $i18n?.forms?.imageOption?.second || 'Sekunde', // Text for 1 second
		pluralText = $i18n?.forms?.imageOption?.seconds || 'Sekunden', // Text for multiple seconds
		showProgressBar = false, // Show progress bar?
		progressBarColor = 'bg-primary-500' // Progress bar color
	} = $props();

	// Create event dispatcher for external control
	const dispatch = createEventDispatcher<{
		complete: void;
		tick: number;
		start: void;
		stop: void;
		reset: void;
	}>();

	// Reactive state variables
	let remainingSeconds = $state(duration);
	let percentComplete = $state(0);
	let intervalId: number | undefined;
	let completed = $state(false);

	// Function to start countdown
	function startCountdown() {
		// Set initial state
		remainingSeconds = duration;
		percentComplete = 0;
		completed = false;

		// Clean up existing intervals
		clearInterval(intervalId);

		// Create new interval
		intervalId = setInterval(() => {
			if (remainingSeconds > 0) {
				remainingSeconds--;
				percentComplete = 100 - (remainingSeconds / duration) * 100;
				dispatch('tick', remainingSeconds);
			} else {
				clearInterval(intervalId);
				completed = true;
				dispatch('complete');
				onComplete();
			}
		}, 1000);

		dispatch('start');
	}

	// Function to reset countdown
	function resetCountdown() {
		clearInterval(intervalId);
		remainingSeconds = duration;
		percentComplete = 0;
		completed = false;
		dispatch('reset');

		if (autoStart) {
			startCountdown();
		}
	}

	// Function to stop countdown
	function stopCountdown() {
		clearInterval(intervalId);
		dispatch('stop');
	}

	// Size classes for different display options
	const sizeClasses = {
		small: 'text-xs',
		default: 'text-sm',
		large: 'text-lg'
	};

	// Calculate CSS classes based on props
	const textSizeClass = sizeClasses[size] || sizeClasses.default;

	// Determine the correct text for singular/plural
	const getTimeUnitText = () => {
		return remainingSeconds === 1 ? singularText : pluralText;
	};

	// Component lifecycle
	onMount(() => {
		if (autoStart) {
			startCountdown();
		}
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});

	// Expose methods to parent components through the DOM node
	// This approach works with Svelte 5's binding
	export function reset() {
		resetCountdown();
	}
</script>

<div class="countdown-container">
	<span class="{textClass} {textSizeClass} font-medium">
		{#if beforeText}
			<span>{beforeText}</span>
		{/if}

		<span class="font-bold">{remainingSeconds}</span>

		{#if afterText}
			<span>{afterText}</span>
		{:else}
			<span>{getTimeUnitText()}</span>
		{/if}
	</span>

	{#if showProgressBar}
		<div class="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-200">
			<div
				class="h-full rounded-full {progressBarColor} transition-all duration-300 ease-out"
				style="width: {percentComplete}%"
			></div>
		</div>
	{/if}
</div>
