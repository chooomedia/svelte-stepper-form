<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';

	const {
		score,
		autoAdvance = 15, // Längere Wartezeit
		nextStep
	} = $props<{
		score: number;
		autoAdvance?: number;
		nextStep: () => void;
	}>();

	let isAnimating = $state(true);
	let remainingTime = $state(autoAdvance);
	let intervalId: number | undefined;
	let timeoutId: number | undefined;
	let stepTriggered = false;

	const radius = 90;
	const strokeWidth = 14;
	const circumference = 2 * Math.PI * radius;

	// 🚀 Langsame Animation: 6000ms für smoothere Bewegung
	let displayScore = tweened(0, { duration: 6000, easing: cubicInOut });
	let strokeDashoffset = tweened(circumference, { duration: 6000, easing: cubicInOut });

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
				message: 'Hervorragend! Deine digitale Präsenz ist exzellent.',
				solution: 'Nutzen Sie fortschrittliche Strategien, um Deine Dominanz weiter auszubauen!'
			};
		}
		if (score >= 60) {
			return {
				message: 'Gut! Aber es gibt noch Potenzial.',
				solution: 'Mit gezieltem Optimieren können Sie noch mehr Sichtbarkeit gewinnen.'
			};
		}
		if (score >= 40) {
			return {
				message: 'Deine Sichtbarkeit ist ausbaufähig.',
				solution: 'Erhöhen Sie Deine Reichweite durch smarte Online-Marketing-Strategien.'
			};
		}
		return {
			message: 'Kritisch! Dein Unternehmen ist kaum sichtbar.',
			solution: 'Wir zeigen Dir, wie Du sofort mehr Kunden erreichen.'
		};
	}

	function safeNextStep() {
		if (!stepTriggered) {
			stepTriggered = true;
			setTimeout(() => {
				nextStep();
			}, 300);
		}
	}

	onMount(() => {
		displayScore.set(score);
		strokeDashoffset.set(circumference - (circumference * score) / 100);

		intervalId = setInterval(() => {
			if (remainingTime > 0) {
				remainingTime--;
			} else {
				clearInterval(intervalId);
				safeNextStep();
			}
		}, 1000);

		timeoutId = setTimeout(safeNextStep, autoAdvance * 1000);
	});

	onDestroy(() => {
		clearInterval(intervalId);
		clearTimeout(timeoutId);
	});
</script>

<div
	class="relative flex flex-col items-center justify-center space-y-6 p-8"
	role="alert"
	aria-live="polite"
	transition:fade={{ duration: 500 }}
>
	<!-- Animierter SVG Doughnut -->
	<div class="relative h-56 w-56">
		<!-- Größerer Doughnut für bessere Lesbarkeit -->
		<svg width="220" height="220" viewBox="0 0 220 220" class="absolute inset-0">
			<!-- Hintergrund-Grauer Ring -->
			<circle
				cx="110"
				cy="110"
				r={radius}
				fill="none"
				stroke="#e5e7eb"
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
	<div class="space-y-3 text-center">
		<h2 class="text-2xl font-semibold text-gray-900">
			{getScoreMessage(score).message}
		</h2>
		<p class="text-gray-600">
			{getScoreMessage(score).solution}
		</p>
	</div>

	<!-- Auto-advance notice -->
	<div class="mt-4 text-sm text-gray-500">
		Weiterleitung in {remainingTime} Sekunden...
	</div>
</div>
