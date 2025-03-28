<!-- src/lib/components/VisibilityScore.svelte -->
<script lang="ts">
	// Import necessary Svelte functionality
	import { onMount, onDestroy } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { scoreStore } from '$lib/utils/scoring';

	// Component props with defaults
	const {
		score = 50,
		autoAdvance = 15,
		nextStep
	} = $props<{
		score: number;
		autoAdvance?: number;
		nextStep: () => void;
		showComparison?: boolean;
	}>();

	// Debug state
	let showDebugMenu = $state(false);
	let debugScore = $state(score);
	let isDebugMode = $state(import.meta.env.DEV || false);

	// Reactive state variables
	let validScore = $state(Math.min(Math.max(0, score), 100));
	let displayScore = $state(0);
	let circleOffset = $state(0);
	let isAnimating = $state(true);
	let timeoutId: number | undefined;
	let stepTriggered = $state(false);

	// SVG circle parameters
	const radius = 90;
	const strokeWidth = 14;
	const circumference = 2 * Math.PI * radius;

	// Compute the current color based on the display score for animations
	const animatedColor = $derived(getScoreColor(displayScore));

	// Use the final color for the text (not animated)
	const finalColor = $derived(getScoreColor(validScore));

	// Get the final messages based on the target score (not animated)
	const finalMessage = $derived(getScoreMessage(validScore).message);
	const finalSolution = $derived(getScoreMessage(validScore).solution);

	// Get color based on score value
	function getScoreColor(score: number): string {
		if (score >= 80) return '#16a34a'; // Green
		if (score >= 60) return '#eab308'; // Yellow
		if (score >= 40) return '#f97316'; // Orange
		return '#dc2626'; // Red
	}

	// Get appropriate messages based on score
	function getScoreMessage(score: number): { message: string; solution: string } {
		if (score >= 80) {
			return {
				message: 'Hervorragend! Deine digitale Präsenz ist exzellent.',
				solution: 'Nutze fortschrittliche Strategien, um Deine Dominanz weiter auszubauen!'
			};
		}
		if (score >= 60) {
			return {
				message: 'Gut! Aber es gibt noch Potenzial.',
				solution: 'Mit gezieltem Optimieren kannst Du noch mehr Sichtbarkeit gewinnen.'
			};
		}
		if (score >= 40) {
			return {
				message: 'Deine Sichtbarkeit ist ausbaufähig.',
				solution: 'Erhöhe Deine Reichweite durch smarte Online-Marketing-Strategien.'
			};
		}
		return {
			message: 'Kritisch! Dein Unternehmen ist kaum sichtbar.',
			solution: 'Wir zeigen Dir, wie Du sofort mehr Kunden erreichst.'
		};
	}

	// Handle auto-advance after animation completes
	function handleAutoAdvance() {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = undefined;
		}

		if (autoAdvance && !stepTriggered) {
			timeoutId = setTimeout(() => {
				stepTriggered = true;
				if (typeof nextStep === 'function') {
					nextStep();
				}
			}, autoAdvance * 1000);
		}
	}

	// Manually animate values
	function animateValues(
		startScore: number,
		endScore: number,
		startOffset: number,
		endOffset: number
	) {
		const duration = 2000; // 2 seconds
		const steps = 60; // 60 steps for smooth animation
		const stepTime = duration / steps;

		let currentStep = 0;

		// Reset values first
		displayScore = startScore;
		circleOffset = startOffset;

		const intervalId = setInterval(() => {
			currentStep++;

			if (currentStep >= steps) {
				// Reached end of animation
				displayScore = endScore;
				circleOffset = endOffset;
				clearInterval(intervalId);
				return;
			}

			// Calculate progress (0 to 1)
			const progress = currentStep / steps;

			// Use cubic-in-out easing
			const easedProgress = cubicInOutEasing(progress);

			// Update values with easing
			displayScore = startScore + (endScore - startScore) * easedProgress;
			circleOffset = startOffset + (endOffset - startOffset) * easedProgress;
		}, stepTime);

		return intervalId;
	}

	// Cubic in-out easing function
	function cubicInOutEasing(t: number): number {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

	// Update animation with a new score
	function updateAnimation(newScore: number) {
		// Validate and update score
		validScore = Math.min(Math.max(0, newScore), 100);

		// Calculate the new offset for the circle
		const newOffset = circumference - (circumference * validScore) / 100;

		// Reset animation state
		isAnimating = true;
		stepTriggered = false;

		// Log for debugging
		console.log(`Starting animation for score ${validScore} with offset ${newOffset}`);

		// Animate values from current to target
		const animationInterval = animateValues(0, validScore, circumference, newOffset);

		// Reset the auto-advance timer
		handleAutoAdvance();

		return animationInterval;
	}

	// Debug function to restart animation
	function restartAnimation(newScoreValue: number) {
		console.log(`Restarting animation with new score: ${newScoreValue}`);

		// Clear any existing animation
		if (intervalId) {
			clearInterval(intervalId);
		}

		// Start new animation
		intervalId = updateAnimation(newScoreValue);
	}

	// Toggle debug menu
	function toggleDebugMenu() {
		showDebugMenu = !showDebugMenu;
	}

	// Store interval ID for cleanup
	let intervalId: number | undefined;

	// Run animations when component mounts
	onMount(() => {
		// Start animations after a small delay to ensure DOM is ready
		setTimeout(() => {
			console.log(`Initial animation with score: ${validScore}`);
			intervalId = updateAnimation(validScore);
		}, 300);
	});

	onDestroy(() => {
		// Clean up timers when component is destroyed
		if (timeoutId) clearTimeout(timeoutId);
		if (intervalId) clearInterval(intervalId);
	});
</script>

<div
	class="relative flex flex-col items-center"
	role="alert"
	aria-live="polite"
	transition:fade={{ duration: 500 }}
>
	<!-- Animated SVG Donut Chart -->
	<div class="relative h-44 w-44" in:scale={{ delay: 300, duration: 800 }}>
		<svg viewBox="0 0 220 220" class="absolute inset-0">
			<!-- Background circle -->
			<circle
				cx="110"
				cy="110"
				r={radius}
				fill="none"
				stroke="#e5e7eb"
				stroke-width={strokeWidth}
			/>

			<!-- Progress circle (animates from top to right) -->
			<circle
				cx="110"
				cy="110"
				r={radius}
				fill="none"
				stroke={animatedColor}
				stroke-width={strokeWidth}
				stroke-linecap="round"
				stroke-dasharray={circumference}
				stroke-dashoffset={circleOffset}
				transform="rotate(-90, 110, 110)"
			/>
		</svg>

		<!-- Score text (centered in the circle) -->
		<div class="absolute inset-0 flex flex-col items-center justify-center">
			<span class="text-6xl font-bold" style="color: {animatedColor}">
				{Math.round(displayScore)}
			</span>
			<span class="text-lg text-gray-500">von 100</span>
		</div>
	</div>

	<!-- Score message and solution - using final values -->
	<div class="mx-auto max-w-2xl space-y-3 text-center" in:fade={{ delay: 300, duration: 500 }}>
		<h3 class="text-2xl font-semibold text-gray-900">
			{finalMessage}
		</h3>
		<p class="text-gray-600">
			{finalSolution}
		</p>
	</div>
</div>

{#if isDebugMode}
	<!-- Debug Button Fixed in Top Right -->
	<div class="fixed right-4 top-4 z-50">
		<button
			class="rounded-full bg-gray-800 p-2 text-white shadow-lg hover:bg-gray-700"
			on:click={toggleDebugMenu}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
				></path>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
				></path>
			</svg>
		</button>

		{#if showDebugMenu}
			<div class="mt-2 rounded-lg bg-white p-4 shadow-xl">
				<h4 class="mb-2 font-bold">Debug Controls</h4>
				<div class="mb-3">
					<label class="block text-sm font-medium text-gray-700">Score: {debugScore}</label>
					<input type="range" min="0" max="100" bind:value={debugScore} class="w-full" />
					<div class="mt-1 flex justify-between">
						<span class="text-xs">Current value: {Math.round(displayScore)}</span>
						<button
							class="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
							on:click={() => restartAnimation(debugScore)}
						>
							Apply
						</button>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<button
						class="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
						on:click={() => restartAnimation(25)}
					>
						Test Low (25)
					</button>
					<button
						class="rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600"
						on:click={() => restartAnimation(50)}
					>
						Test Medium (50)
					</button>
					<button
						class="rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600"
						on:click={() => restartAnimation(75)}
					>
						Test High (75)
					</button>
					<button
						class="rounded bg-emerald-500 px-2 py-1 text-white hover:bg-emerald-600"
						on:click={() => restartAnimation(95)}
					>
						Test Great (95)
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}
