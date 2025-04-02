<!-- src/lib/components/steps/WaitingStep.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import WaitingScreen from '$lib/components/WaitingScreen.svelte';
	import FormStep from './FormStep.svelte';
	import { i18n } from '$lib/i18n';

	// Props
	interface Props {
		title?: string;
		subtitle?: string;
		autoAdvance?: number; // Time in seconds
		processingMessage?: string;
	}

	const {
		title = $i18n.schema.steps.waitingscreen.title,
		subtitle = $i18n.schema.steps.waitingscreen.description,
		autoAdvance = 7,
		processingMessage = 'Angaben werden analysieren - Bitte habe einen Moment Geduld.'
	} = $props<Props>();

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		complete: void;
	}>();

	// Handle step completion
	function handleStepComplete() {
		dispatch('complete');
	}
</script>

<FormStep {title} {subtitle}>
	<div class="flex h-full w-full items-center justify-center">
		<WaitingScreen {autoAdvance} nextStep={handleStepComplete} />
	</div>
</FormStep>
