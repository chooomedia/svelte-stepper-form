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
			{@const accentColors = [
				{ border: 'border-[#124E78]/30', hover: 'hover:border-[#124E78] hover:shadow-[#124E78]/20', selected: 'border-[#124E78] ring-[#124E78]/20 shadow-[#124E78]/20', check: 'bg-[#124E78]', checkHover: 'group-hover:bg-[#124E78]' },
				{ border: 'border-[#F2BB05]/30', hover: 'hover:border-[#F2BB05] hover:shadow-[#F2BB05]/20', selected: 'border-[#F2BB05] ring-[#F2BB05]/20 shadow-[#F2BB05]/20', check: 'bg-[#F2BB05]', checkHover: 'group-hover:bg-[#F2BB05]' },
				{ border: 'border-[#D74E09]/30', hover: 'hover:border-[#D74E09] hover:shadow-[#D74E09]/20', selected: 'border-[#D74E09] ring-[#D74E09]/20 shadow-[#D74E09]/20', check: 'bg-[#D74E09]', checkHover: 'group-hover:bg-[#D74E09]' },
				{ border: 'border-[#129490]/30', hover: 'hover:border-[#129490] hover:shadow-[#129490]/20', selected: 'border-[#129490] ring-[#129490]/20 shadow-[#129490]/20', check: 'bg-[#129490]', checkHover: 'group-hover:bg-[#129490]' }
			]}
			{@const accentScheme = accentColors[index % accentColors.length]}
			<button
				type="button"
				class="group relative flex h-full flex-row justify-center overflow-hidden rounded-xl border-2 bg-gradient-to-b from-white to-primary-50 shadow-lg transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl focus:outline-none focus:ring-4 lg:flex-col {isSelected(
					option.value
				)
					? `${accentScheme.selected} ring-4 shadow-2xl scale-[1.02]`
					: `${accentScheme.border} ${accentScheme.hover}`}"
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
					{@const accentColors = [
						{ check: 'bg-[#124E78]' },
						{ check: 'bg-[#F2BB05]' },
						{ check: 'bg-[#D74E09]' },
						{ check: 'bg-[#129490]' }
					]}
					{@const accentScheme = accentColors[index % accentColors.length]}
					<div
						class="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-lg transition-all lg:{accentScheme.check} {accentScheme.check}/90"
						role="presentation"
						aria-hidden="true"
					>
						<Icon name="check" size={18} fill="none" strokeWidth="3" stroke="white" className="text-white" />
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

				{@const footerColors = [
					{ border: 'border-[#124E78]/40', bg: 'bg-[#124E78]/10' },
					{ border: 'border-[#F2BB05]/40', bg: 'bg-[#F2BB05]/10' },
					{ border: 'border-[#D74E09]/40', bg: 'bg-[#D74E09]/10' },
					{ border: 'border-[#129490]/40', bg: 'bg-[#129490]/10' }
				]}
				{@const footerScheme = footerColors[index % footerColors.length]}
				<div
					class={`flex w-full flex-col justify-center border-t-2 ${footerScheme.border} ${
						special ? footerScheme.bg : ''
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
