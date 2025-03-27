<!-- src/lib/components/VisibilityScore.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';

	const {
		score,
		autoAdvance = 15, // Längere Wartezeit
		nextStep,
		showComparison = true
	} = $props<{
		score: number;
		autoAdvance?: number;
		nextStep: () => void;
		showComparison?: boolean;
	}>();

	let isAnimating = $state(true);
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

	onMount(() => {
		displayScore.set(score);
		strokeDashoffset.set(circumference - (circumference * score) / 100);
	});

	onDestroy(() => {
		clearInterval(intervalId);
		clearTimeout(timeoutId);
	});
</script>

<div
	class="justify-centerx relative flex min-h-[550px] flex-col items-center"
	role="alert"
	aria-live="polite"
	transition:fade={{ duration: 500 }}
>
	<!-- Animierter SVG Doughnut -->
	<div class="relative h-44 w-44" in:scale={{ delay: 300, duration: 800 }}>
		<svg viewBox="0 0 220 220" class="absolute inset-0">
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
	<div class="mx-auto max-w-2xl space-y-3 text-center" in:fade={{ delay: 800, duration: 800 }}>
		<h3 class="text-2xl font-semibold text-gray-900">
			{getScoreMessage(score).message}
		</h3>
		<p class="text-gray-600">
			{getScoreMessage(score).solution}
		</p>
	</div>
</div>
