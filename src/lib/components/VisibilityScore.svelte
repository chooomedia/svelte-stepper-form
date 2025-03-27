<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { spring } from 'svelte/motion';
	import { onMount, onDestroy } from 'svelte';

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

	let isInitialized = $state(false);
	let timeoutId: number | undefined;
	let stepTriggered = $state(false);
	let lastAnimatedValue = $state(0);

	const radius = 90;
	const strokeWidth = 14;
	const circumference = 2 * Math.PI * radius;

	const displayScore = spring(0, { stiffness: 0.1, damping: 0.4 });
	const strokeProgress = spring(0, { stiffness: 0.05, damping: 0.5 });

	const color = $derived(getScoreColor(displayScore.value));
	const message = $derived(getScoreMessage(displayScore.value));
	const strokeDashoffset = $derived(circumference - (circumference * strokeProgress.value) / 100);

	function getScoreColor(score: number): string {
		if (score >= 80) return '#16a34a';
		if (score >= 60) return '#eab308';
		if (score >= 40) return '#f97316';
		return '#dc2626';
	}

	function getScoreMessage(score: number) {
		if (score >= 80)
			return {
				message: 'Hervorragend! Deine digitale Präsenz ist exzellent',
				solution: 'Nutze fortschrittliche Strategien, um Deine Dominanz weiter auszubauen!'
			};
		if (score >= 60)
			return {
				message: 'Gut! Aber es gibt noch Potenzial',
				solution: 'Mit gezieltem Optimieren kannst Du noch mehr Sichtbarkeit gewinnen.'
			};
		if (score >= 40)
			return {
				message: 'Deine Sichtbarkeit ist ausbaufähig',
				solution: 'Erhöhe Deine Reichweite durch smarte Online-Marketing-Strategien.'
			};
		return {
			message: 'Kritisch! Dein Unternehmen ist kaum sichtbar',
			solution: 'Wir zeigen Dir, wie Du sofort mehr Kunden erreichst.'
		};
	}

	async function animateTo(newScore: number, reset = false) {
		if (reset) {
			displayScore.set(0);
			strokeProgress.set(0);
			await new Promise((r) => setTimeout(r, 50));
		}

		displayScore.set(newScore);
		strokeProgress.set(newScore);
		lastAnimatedValue = newScore;

		if (autoAdvance > 0 && !stepTriggered && nextStep) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				stepTriggered = true;
				nextStep();
			}, autoAdvance * 1000);
		}
	}

	onMount(() => {
		animateTo(score, true);
		isInitialized = true;
	});

	onDestroy(() => clearTimeout(timeoutId));

	$effect(() => {
		if (isInitialized && animateOnResultLoad && score !== lastAnimatedValue) {
			animateTo(score);
		}
	});
</script>

<div
	class="relative flex flex-col items-center justify-center gap-6"
	role="alert"
	aria-live="polite"
	transition:fade={{ duration: 300 }}
>
	<div class="relative h-52 w-52" in:scale={{ duration: 500 }}>
		<svg viewBox="0 0 220 220" class="absolute inset-0">
			<circle
				cx="110"
				cy="110"
				r={radius}
				fill="none"
				stroke="hsl(var(--b3))"
				stroke-width={strokeWidth}
			/>
			<circle
				cx="110"
				cy="110"
				r={radius}
				fill="none"
				stroke={color}
				stroke-width={strokeWidth}
				stroke-linecap="round"
				stroke-dasharray={circumference}
				stroke-dashoffset={strokeDashoffset}
				transform="rotate(-90 110 110)"
				style="transition: stroke 0.5s ease-out"
			/>
		</svg>

		<div class="absolute inset-0 flex flex-col items-center justify-center gap-1">
			<span class="text-5xl font-bold" style:color>
				{Math.round($displayScore)}
			</span>
			<span class="text-lg opacity-75">von 100</span>
		</div>
	</div>

	<div class="text-center" in:fade={{ delay: 300 }}>
		<h3 class="mb-2 text-xl font-bold">{message.message}</h3>
		<p class="mx-auto max-w-md text-base opacity-90">
			{message.solution}
		</p>
	</div>
</div>
