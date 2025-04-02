<!-- src/lib/components/steps/SelectOptionStep.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { formStore } from '$lib/stores/formStore';
	import ImageOption from '$lib/components/ImageOption.svelte';
	import FormStep from './FormStep.svelte';

	// Props
	interface Props {
		title?: string;
		subtitle?: string;
		fieldName: string;
		options: Array<{
			value: string;
			label?: string;
			imgSrc?: string;
			description?: string;
			weight?: number;
		}>;
		multiple?: boolean;
		maxSelections?: number;
		countdownTime?: number;
		autoAdvance?: boolean;
	}

	const {
		title = '',
		subtitle = '',
		fieldName,
		options = [],
		multiple = false,
		maxSelections = undefined,
		countdownTime = 3,
		autoAdvance = true
	} = $props<Props>();

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		select: { field: string; value: string | string[]; valid: boolean };
		navigate: { step: number };
	}>();

	// Local state
	let value = $state<string | string[]>(
		// Get initial value from formStore, or use empty value
		() => {
			const state = formStore.getState();
			const fieldValue = state.formData[fieldName];

			if (multiple) {
				// If multiple and fieldValue exists as array, use it
				if (Array.isArray(fieldValue)) return fieldValue;
				// If multiple and fieldValue exists as string, make single-item array
				if (fieldValue) return [fieldValue];
				// Otherwise, empty array
				return [];
			} else {
				// For single selection, use string value or empty string
				return fieldValue || '';
			}
		}
	);

	// Handle option selection
	function handleSelect(newValue: string | string[]) {
		value = newValue;

		// Update form store
		formStore.updateField(fieldName, newValue);

		// Dispatch selection event
		dispatch('select', {
			field: fieldName,
			value: newValue,
			valid: multiple ? Array.isArray(newValue) && newValue.length > 0 : !!newValue
		});

		// Auto-advance for single selection
		if (autoAdvance && !multiple && newValue) {
			// Small delay to show selection before advancing
			setTimeout(() => {
				dispatch('navigate', { step: 1 }); // Advance 1 step
			}, 500);
		}
	}

	// Handle navigation when triggered from ImageOption
	function handleNavigate(event: CustomEvent<{ fieldName: string; values: string[] }>) {
		// Update form
		const { fieldName: eventFieldName, values } = event.detail;
		if (eventFieldName === fieldName) {
			formStore.updateField(fieldName, values);
			dispatch('navigate', { step: 1 }); // Advance 1 step
		}
	}
</script>

<FormStep {title} {subtitle}>
	<ImageOption
		{value}
		{options}
		error={''}
		onSelect={handleSelect}
		on:navigate={handleNavigate}
		{fieldName}
		{multiple}
		{maxSelections}
		{countdownTime}
	/>
</FormStep>
