<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';

	interface Props {
		score: number;
		autoAdvance?: number;
		nextStep?: () => void;
		animateOnResultLoad?: boolean;
	}

	const {
		score,
		autoAdvance = 15,
		nextStep = () => {},
		animateOnResultLoad = false
	} = $props<Props>();

	let isAnimating = $state(true);
	let isInitialized = $state(false);
	let intervalId: number | undefined;
	let timeoutId: number | undefined;
	let stepTriggered = $state(false);
	let lastAnimatedValue = $state(0);

	const radius = 90;
	const strokeWidth = 14;
	const circumference = 2 * Math.PI * radius;

	// 🚀 Langsame Animation: 6000ms für smoothere Bewegung
	const displayScore = tweened(0, { duration: 6000, easing: cubicInOut });
	const strokeDashoffset = tweened(circumference, { duration: 6000, easing: cubicInOut });

	// Ampel-Farben für den Score
	function getScoreColor(score: number): string {
		if (score >= 80) return '#16a34a'; // Grün
		if (score >= 60) return '#eab308'; // Gelb
		if (score >= 40) return '#f97316'; // Orange
		return '#dc2626'; // Rot
	}

	// Kundenansprache + Lösung
	function getScoreMessage(score: number): { message: string; solution: string } {
		if (score >= 80) {
			return {
				message: 'Hervorragend! Deine digitale Präsenz ist exzellent',
				solution: 'Nutze fortschrittliche Strategien, um Deine Dominanz weiter auszubauen!'
			};
		}
		if (score >= 60) {
			return {
				message: 'Gut! Aber es gibt noch Potenzial',
				solution: 'Mit gezieltem Optimieren kannst Du noch mehr Sichtbarkeit gewinnen.'
			};
		}
		if (score >= 40) {
			return {
				message: 'Deine Sichtbarkeit ist ausbaufähig',
				solution: 'Erhöhe Deine Reichweite durch smarte Online-Marketing-Strategien.'
			};
		}
		return {
			message: 'Kritisch! Dein Unternehmen ist kaum sichtbar',
			solution: 'Wir zeigen Dir, wie Du sofort mehr Kunden erreichst.'
		};
	}

	// Function to start animation
	function startAnimation() {
		// Cancel any previous animations
		clearTimeout(timeoutId);

		// Reset values to starting point
		displayScore.set(0, { duration: 0 });
		strokeDashoffset.set(circumference, { duration: 0 });

		// Then animate to target values
		displayScore.set(score, { duration: 6000 });
		strokeDashoffset.set(circumference - (circumference * score) / 100, { duration: 6000 });

		isAnimating = true;
		lastAnimatedValue = score;

		// If auto advance is enabled, set timeout
		if (autoAdvance > 0 && !stepTriggered && nextStep) {
			timeoutId = setTimeout(() => {
				stepTriggered = true;
				nextStep();
			}, autoAdvance * 1000);
		}
	}

	onMount(() => {
		// Initial animation
		startAnimation();
		isInitialized = true;
	});

	onDestroy(() => {
		clearInterval(intervalId);
		clearTimeout(timeoutId);
	});

	// Watch for animateOnResultLoad changes using $: reactive statement
	$effect(() => {
		if (isInitialized && animateOnResultLoad && lastAnimatedValue !== score) {
			startAnimation();
		}
	});
</script>

<div
	class="relative flex flex-col items-center justify-center space-y-6"
	role="alert"
	aria-live="polite"
	transition:fade={{ duration: 500 }}
>
	<!-- Animierter SVG Doughnut -->
	<div class="relative h-56 w-56" in:scale={{ delay: 300, duration: 800 }}>
		<!-- Größerer Doughnut für bessere Lesbarkeit -->
		<svg width="220" height="220" viewBox="0 0 220 220" class="absolute inset-0">
			<!-- Hintergrund-Grauer Ring -->
			<circle
				cx="110"
				cy="110"
				r={radius}
				fill="none"
				stroke="#f6f7f8"
				stroke-width={strokeWidth}
			/>
			<!-- Fortschrittsring (animiert von oben nach rechts) -->
			<circle
				cx="110"
				cy="110"
				r={radius}
				fill="none"
				stroke={getScoreColor(score)}
				stroke-width={strokeWidth}
				stroke-linecap="round"
				stroke-dasharray={circumference}
				stroke-dashoffset={$strokeDashoffset}
				transform="rotate(-90 110 110)"
			/>
		</svg>

		<!-- Score-Text ABSOLUT positioniert -->
		<div class="absolute inset-0 flex flex-col items-center justify-center">
			<span class="text-6xl font-bold" style="color: {getScoreColor(score)}">
				{Math.round($displayScore)}
			</span>
			<span class="text-lg text-gray-500">von 100</span>
		</div>
	</div>

	<!-- Score Message & Lösung -->
	<div class="mx-auto max-w-2xl space-y-3 text-center" in:fade={{ delay: 800, duration: 800 }}>
		<h3 class="text-2xl font-semibold text-gray-900">
			{getScoreMessage(score).message}
		</h3>
		<p class="text-gray-600">
			{getScoreMessage(score).solution}
		</p>
	</div>
</div>
