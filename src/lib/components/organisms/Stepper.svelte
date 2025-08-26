<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { stepStatuses, currentStepIndex, goToStep } from '$lib/stores/stepperStore';
	import { websiteLoading, formSubmitting } from '$lib/stores/loadingStore';
	import { derived, get } from 'svelte/store';

	// Neuer Parameter zum Ausschließen bestimmter Schritte (kann eine einzelne Zahl oder ein Array sein)
	const { exclude = [] } = $props<{ exclude?: number | number[] }>();

	// Umwandlung zu Array für einfachere Handhabung
	const excludeArray = $derived(Array.isArray(exclude) ? exclude : exclude ? [exclude] : []);

	// Create an event dispatcher for navigation events
	const dispatch = createEventDispatcher();

	// Gefilterte Schritte basierend auf exclude Parameter
	const filteredStepStatuses = derived(stepStatuses, ($stepStatuses) =>
		$stepStatuses.filter((status) => !excludeArray.includes(status.index))
	);

	// Berechnung des Fortschritts
	const progressValue = derived(
		[currentStepIndex, stepStatuses],
		([$currentStepIndex, $stepStatuses]) => {
			// Nur sichtbare Schritte zählen
			const visibleSteps = $stepStatuses.filter((status) => !excludeArray.includes(status.index));

			if (visibleSteps.length <= 1) return 0;

			// Finde die Position des aktuellen Schritts in den sichtbaren Schritten
			const currentStepPosition = visibleSteps.findIndex(
				(status) => status.index >= $currentStepIndex
			);

			// Wenn der aktuelle Schritt nicht gefunden wurde oder der erste ist
			if (currentStepPosition < 0) {
				return 100; // Alle sichtbaren Schritte sind abgeschlossen
			}

			return (currentStepPosition / (visibleSteps.length - 1)) * 100;
		}
	);

	// Get appropriate class for a step based on its status
	function getStepClass(stepStatus: any): string {
		const baseClasses =
			'relative z-10 flex h-3 w-3 items-center justify-center rounded-full transition-all duration-300 ease-in-out';

		// Spezieller Zustand für Schritt 2 während der Website-Analyse
		if (stepStatus.index === 2 && get(websiteLoading)) {
			return `${baseClasses} !h-4 !w-4 border-2 border-primary-300 bg-primary-300`;
		}

		// Spezieller Zustand für Schritt 10 während der Formularübermittlung
		if (stepStatus.index === 10 && get(formSubmitting)) {
			return `${baseClasses} !h-4 !w-4 border-2 border-primary-300 bg-primary-300`;
		}

		// Nach der Analyse oder wenn der Schritt gültig ist -> grün markieren
		if (stepStatus.isValid) {
			return `${baseClasses} !h-4 !w-4 scale-110 !border-primary-500 !bg-primary-500`;
		}

		if (stepStatus.isInvalid) {
			return `${baseClasses} !h-4 !w-4 border-2 border-red-500 bg-red-500`;
		}

		if (stepStatus.isIncomplete) {
			return `${baseClasses} !h-4 !w-4 border-2 border-orange-400 bg-orange-400`;
		}

		if (stepStatus.isCurrent) {
			return `${baseClasses} border-2 border-secondary bg-secondary`;
		}

		return `${baseClasses} border-2 border-gray-200 bg-gray-200`;
	}

	// Handle step click with improved navigation
	function handleStepClick(stepIndex: number) {
		// Aktualisiert: Wir nutzen den originalen Index aus filteredStepStatuses
		const visibleStatus = get(filteredStepStatuses)[stepIndex];
		if (visibleStatus && (visibleStatus.isValid || visibleStatus.isReachable)) {
			goToStep(visibleStatus.index);
			dispatch('stepChange', { step: visibleStatus.index });
		}
	}
</script>

<div class="relative flex w-full flex-col items-center">
	<div class="flex h-[18px] w-full items-center justify-between">
		<!-- Background track -->
		<div class="absolute top-1/2 h-0.5 w-full -translate-y-1/2 bg-primary-400"></div>

		<!-- Progress indicator -->
		<div
			class="absolute top-1/2 h-0.5 origin-left bg-primary-500 transition-transform duration-300 ease-in-out"
			style="width: {$progressValue}%;"
		></div>

		<!-- Step indicators - Jetzt mit gefilterten Schritten -->
		{#each $filteredStepStatuses as stepStatus, index}
			<button
				class={getStepClass(stepStatus)}
				disabled={!stepStatus.isValid && !stepStatus.isReachable}
				on:click={() => handleStepClick(index)}
				aria-label="Schritt {stepStatus.index} von {$filteredStepStatuses.length}"
				title={stepStatus.index === 2 && get(websiteLoading)
					? 'Website wird analysiert...'
					: stepStatus.index === 10 && get(formSubmitting)
						? 'Formular wird gesendet...'
						: stepStatus.isValid
							? 'Abgeschlossen'
							: stepStatus.isInvalid
								? 'Erforderliche Daten fehlen'
								: stepStatus.isIncomplete
									? 'Unvollständig'
									: stepStatus.isCurrent
										? 'Aktueller Schritt'
										: 'Noch nicht bearbeitet'}
			>
				{#if stepStatus.isValid}
					<span class="text-[10px] text-secondary">✓</span>
				{:else if stepStatus.isInvalid}
					<span class="text-[10px] text-secondary">!</span>
				{:else if stepStatus.isIncomplete}
					<span class="text-[10px] text-secondary">⋯</span>
				{:else if (stepStatus.index === 2 && get(websiteLoading)) || (stepStatus.index === 10 && get(formSubmitting))}
					<span class="text-[8px] text-secondary">
						<svg class="h-2 w-2 animate-spin" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
								fill="none"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					</span>
				{/if}
			</button>
		{/each}
	</div>
</div>
