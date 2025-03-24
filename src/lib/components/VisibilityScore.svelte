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

	// Comparison data - Vor/Nach Vergleich
	const comparisonData = {
		current: {
			title: 'Jetzt',
			image: 'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-before-image.jpg',
			audience: score < 50 ? 'Unter 5.000 Besucher' : 'Über 10.000 Menschen auf YouTube',
			income: score < 50 ? 'Unter €2.000 pro Monat' : 'Über €5.000 pro Monat',
			audienceLevel: score < 50 ? 25 : 45,
			incomeLevel: score < 50 ? 30 : 50
		},
		potential: {
			title: 'Dein Ziel',
			image: 'https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-after-image.jpg',
			audience: 'Über 75.000 auf YouTube',
			income: 'Über €11.000 pro Monat',
			audienceLevel: 85,
			incomeLevel: 80
		}
	};

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
	class="relative flex min-h-[550px] flex-col items-center justify-center space-y-6"
	role="alert"
	aria-live="polite"
	transition:fade={{ duration: 500 }}
>
	<!-- Heading -->
	<h2 class="text-center text-3xl font-bold text-gray-900" in:fade={{ delay: 200, duration: 800 }}>
		Dein Digital Marketing Score
	</h2>

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

	<!-- Before/After Comparison -->
	{#if showComparison}
		<div
			class="mt-6 grid w-full max-w-3xl grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow-lg md:grid-cols-2"
			in:fade={{ delay: 1000, duration: 800 }}
		>
			<!-- Current state -->
			<div class="flex flex-col rounded-lg bg-gray-50 p-4">
				<h4 class="mb-2 text-center text-xl font-semibold text-red-500">
					{comparisonData.current.title}
				</h4>

				<div class="aspect-square overflow-hidden rounded-lg">
					<img
						src="https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-before-image.jpg"
						alt="Current state"
						class="h-full w-full object-cover"
					/>
				</div>

				<div class="mt-3 space-y-3">
					<div>
						<h5 class="text-sm font-medium text-gray-500">Publikum</h5>
						<div class="relative h-2 w-full rounded-full bg-gray-200">
							<div
								class="absolute left-0 top-0 h-2 rounded-full bg-red-400"
								style="width: {comparisonData.current.audienceLevel}%"
							></div>
						</div>
						<p class="mt-1 text-sm font-medium">{comparisonData.current.audience}</p>
					</div>

					<div>
						<h5 class="text-sm font-medium text-gray-500">Einkommensebene</h5>
						<div class="relative h-2 w-full rounded-full bg-gray-200">
							<div
								class="absolute left-0 top-0 h-2 rounded-full bg-red-400"
								style="width: {comparisonData.current.incomeLevel}%"
							></div>
						</div>
						<p class="mt-1 text-sm font-medium">{comparisonData.current.income}</p>
					</div>
				</div>
			</div>

			<!-- Potential state -->
			<div class="flex flex-col rounded-lg bg-gray-50 p-4">
				<h4 class="mb-2 text-center text-xl font-semibold text-blue-500">
					{comparisonData.potential.title}
				</h4>

				<div class="aspect-square overflow-hidden rounded-lg">
					<img
						src="https://digitalpusher.de/wp-content/uploads/2024/09/digitalpusher-after-image.jpg"
						alt="Potential state"
						class="h-full w-full object-cover"
					/>
				</div>

				<div class="mt-3 space-y-3">
					<div>
						<h5 class="text-sm font-medium text-gray-500">Publikum</h5>
						<div class="relative h-2 w-full rounded-full bg-gray-200">
							<div
								class="absolute left-0 top-0 h-2 rounded-full bg-blue-400"
								style="width: {comparisonData.potential.audienceLevel}%"
							></div>
						</div>
						<p class="mt-1 text-sm font-medium">{comparisonData.potential.audience}</p>
					</div>

					<div>
						<h5 class="text-sm font-medium text-gray-500">Einkommensebene</h5>
						<div class="relative h-2 w-full rounded-full bg-gray-200">
							<div
								class="absolute left-0 top-0 h-2 rounded-full bg-blue-400"
								style="width: {comparisonData.potential.incomeLevel}%"
							></div>
						</div>
						<p class="mt-1 text-sm font-medium">{comparisonData.potential.income}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Income potential -->
		<div
			class="w-full max-w-3xl rounded-lg bg-blue-50 p-4 text-center"
			in:fade={{ delay: 1200, duration: 800 }}
		>
			<h4 class="text-xl font-bold text-blue-600">
				Dein Einkommenspotenzial:
				<span class="text-indigo-700">
					{score >= 70
						? 'Sehr Hoch'
						: score >= 50
							? 'Hoch'
							: score >= 30
								? 'Mittel'
								: 'Steigerungsfähig'}
				</span>
			</h4>

			<div class="mt-4 flex items-center justify-center">
				<span class="flex items-center text-gray-700">
					<svg class="mr-2 h-6 w-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
						></path>
					</svg>
					Das 4-Wochen-Programm reicht aus, um Dein Einkommen auf die nächste Stufe zu heben
				</span>
			</div>
		</div>
	{/if}

	<!-- Auto-advance notice -->
	<div class="mt-4 text-sm text-gray-500">
		Weiterleitung in {remainingTime} Sekunden...
	</div>
</div>
