<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import {
		getLocalizedLabel,
		getLocalizedDescription,
		currentLocale,
		i18n,
		getTextDirection
	} from '$lib/i18n';
	import Icon from './Icon.svelte';
	import Countdown from './Countdown.svelte';

	// Props mit Standardwerten
	const {
		value = '',
		options = [],
		error = undefined,
		onSelect = () => {},
		multiple = false,
		maxSelections = undefined,
		countdownTime = 3,
		fieldName = '',
		special = false
	} = $props();

	// Event Dispatcher mit modernem TypeScript-Typ
	const dispatch = createEventDispatcher<{
		navigate: { fieldName: string; values: string[] };
	}>();

	// Verify the initialization logic
	let selectedValues = $state<string[]>(
		multiple && Array.isArray(value) ? value : multiple && typeof value === 'string' ? [value] : []
	);

	// Countdown und Navigationszustände
	let showCountdown = $state(false);
	let navigationTriggered = $state(false);

	// Use a direct DOM reference with Svelte 5 instead of binding to 'this'
	let countdownElement: any = null;

	// A trigger to create a new countdown instance when needed
	let countdownKey = $state(0);

	// RTL/LTR Support - reaktive Textrichtung
	let textDirection = $derived(getTextDirection());
	let currentLang = $derived($currentLocale);

	// Update selection and count when an option is clicked
	function handleOptionSelect(optionValue: string): void {
		// Reset countdown if it exists
		if (countdownElement && typeof countdownElement.reset === 'function') {
			countdownElement.reset();
		} else {
			// If reset function isn't available, force a new countdown instance
			countdownKey += 1;
		}

		if (multiple) {
			selectedValues = handleMultipleSelection(optionValue);

			// Callback aufrufen
			onSelect(selectedValues);

			// Countdown starten, wenn Optionen ausgewählt
			if (selectedValues.length > 0) {
				showCountdown = true;
			} else {
				showCountdown = false;
			}
		} else {
			// Einzelauswahl
			onSelect(optionValue);

			if (fieldName && !navigationTriggered) {
				navigationTriggered = true;
				triggerNavigation([optionValue]);
			}
		}
	}

	// Mehrfachauswahl-Logik
	function handleMultipleSelection(optionValue: string): string[] {
		const isSelected = selectedValues.includes(optionValue);

		if (isSelected) {
			// Option deselektieren
			return selectedValues.filter((val) => val !== optionValue);
		} else {
			// Option selektieren unter Berücksichtigung von maxSelections
			if (maxSelections && selectedValues.length >= maxSelections) {
				return [...selectedValues.slice(1), optionValue];
			}
			return [...selectedValues, optionValue];
		}
	}

	function handleTimeoutComplete() {
		if (selectedValues.length > 0 && fieldName && !navigationTriggered) {
			navigationTriggered = true;
			console.log('Countdown reached zero - triggering navigation with values:', selectedValues);
			triggerNavigation(selectedValues);
		}
	}

	// Navigation auslösen
	function triggerNavigation(values: string[]) {
		setTimeout(() => {
			dispatch('navigate', { fieldName, values });

			// Debug-Event für globales Monitoring
			window.dispatchEvent(
				new CustomEvent('debugNavigation', {
					detail: { fieldName, values }
				})
			);
		}, 100);
	}

	// Sprachänderung reaktiv machen
	$effect(() => {
		// Trigger für Neurendern bei Sprachänderung
		console.log('Current locale:', $currentLocale);
		console.log('Text direction:', textDirection);
	});

	// Option-Auswahlstatus prüfen
	const isSelected = (optionValue: string): boolean =>
		multiple ? selectedValues.includes(optionValue) : value === optionValue;
</script>

{#key $currentLocale}
	{#if multiple}
		<div
			class="mb-4 text-center text-xs text-gray-600"
			dir={textDirection}
			role="status"
			aria-live="polite"
		>
			<div class="font-medium text-primary-700">
				{#if showCountdown && selectedValues.length > 0}
					<!-- Use key to force re-creation when needed -->
					{#key countdownKey}
						<Countdown
							bind:this={countdownElement}
							duration={countdownTime}
							beforeText={$i18n?.forms?.imageOption?.continueIn || 'weiter in'}
							singularText={$i18n?.forms?.imageOption?.second || 'Sekunde'}
							pluralText={$i18n?.forms?.imageOption?.seconds || 'Sekunden'}
							textClass="text-xs text-primary-700"
							onComplete={handleTimeoutComplete}
							on:reset={() => console.log('Countdown reset')}
						/>
					{/key}
				{:else if maxSelections}
					{(
						$i18n?.forms?.imageOption?.selectUpTo || 'Du kannst bis zu {max} Optionen auswählen'
					).replace('{max}', maxSelections.toString())}
				{:else}
					{$i18n?.forms?.imageOption?.selectAllApplicable || 'Wähle alle passenden Optionen'}
				{/if}
			</div>
		</div>
	{/if}

	<div
		class="grid grid-cols-1 gap-4 pt-2 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))] md:grid-rows-1"
		dir={textDirection}
		role="group"
		aria-label={fieldName ? `Optionen für ${fieldName}` : 'Verfügbare Optionen'}
	>
		{#each options as option, index}
			{@const isStep1 = fieldName === 'visibility'}
			{@const shadowColors = [
				'shadow-[0_4px_14px_0_rgba(18,78,120,0.15)] hover:shadow-[0_8px_24px_0_rgba(18,78,120,0.25)]',
				'shadow-[0_4px_14px_0_rgba(242,187,5,0.15)] hover:shadow-[0_8px_24px_0_rgba(242,187,5,0.25)]',
				'shadow-[0_4px_14px_0_rgba(215,78,9,0.15)] hover:shadow-[0_8px_24px_0_rgba(215,78,9,0.25)]',
				'shadow-[0_4px_14px_0_rgba(18,148,144,0.15)] hover:shadow-[0_8px_24px_0_rgba(18,148,144,0.25)]'
			]}
			{@const customShadow = isStep1 ? shadowColors[index % shadowColors.length] : 'shadow-custom hover:shadow-lg'}
			<button
				type="button"
				class="relative flex h-full flex-row justify-center overflow-hidden rounded-lg border bg-gradient-to-b from-white to-primary-50 {customShadow} transition-all duration-300 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-primary-600 lg:flex-col {isSelected(
					option.value
				)
					? 'border-primary-500 shadow-primary-100 ring-1 ring-primary-500'
					: 'border-gray-100'}"
				onclick={() => handleOptionSelect(option.value)}
				aria-label={getLocalizedDescription(fieldName, option.value)}
				aria-pressed={isSelected(option.value)}
				aria-describedby={fieldName ? `${fieldName}-option-${index}` : undefined}
				role="radio"
				tabindex={isSelected(option.value) ? 0 : -1}
				dir={textDirection}
				lang={currentLang}
			>
				{#if isSelected(option.value)}
					<div
						class="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-secondary lg:bg-primary-500"
						role="presentation"
						aria-hidden="true"
					>
						<Icon name="check" size={18} fill="none" strokeWidth="2" stroke="currentColor" />
					</div>
				{/if}

				{#if option.imgSrc}
					<div class="mx-auto p-2 md:p-4" role="presentation">
						<img
							src={option.imgSrc}
							alt={getLocalizedDescription(fieldName, option.value)}
							class="h-16 w-auto transform object-contain transition-transform hover:scale-110 md:h-24 lg:h-32"
							role="img"
							aria-hidden="true"
						/>
					</div>
				{/if}

				<div
					class={`flex w-full flex-col justify-center border-t border-primary-200 ${
						special ? 'bg-primary' : ''
					} px-1 py-2 lg:block`}
					dir={textDirection}
				>
					<h3
						class="hyphens-auto break-words text-base font-semibold text-secondary"
						id={fieldName ? `${fieldName}-option-${index}` : undefined}
					>
						{getLocalizedLabel(fieldName, option.value)}
					</h3>

					<p class="mb-1 text-[12px] text-secondary-400 text-opacity-80">
						{getLocalizedDescription(fieldName, option.value)}
					</p>
				</div>
			</button>
		{/each}
	</div>

	{#if error}
		<p
			class="mt-2 text-sm text-red-600"
			dir={textDirection}
			lang={currentLang}
			role="alert"
			aria-live="assertive"
		>
			{error}
		</p>
	{/if}
{/key}
