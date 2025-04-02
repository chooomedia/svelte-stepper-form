<!-- src/lib/components/steps/ContactInfoStep.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormData } from '$lib/schema';
	import { formStore } from '$lib/stores/formStore';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import FormStep from './FormStep.svelte';
	import { i18n } from '$lib/i18n';

	// Props
	interface Props {
		form: SuperValidated<FormData>;
		errors?: Record<string, string>;
		title?: string;
		subtitle?: string;
	}

	const {
		form,
		errors = {},
		title = $i18n.schema.steps.company_info.title,
		subtitle = $i18n.schema.steps.company_info.description
	} = $props<Props>();

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		validate: { isValid: boolean };
	}>();

	// Handle form validation
	function handleValidation(isValid: boolean) {
		dispatch('validate', { isValid });
	}
</script>

<FormStep {title} {subtitle}>
	<div in:fade={{ duration: 300 }}>
		<ContactForm {form} {errors} onValidation={handleValidation} />
	</div>
</FormStep>
