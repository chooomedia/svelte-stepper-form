<!-- src/lib/components/MultiStepForm.svelte -->
<script lang="ts">
	import { stepperStore, currentStepIndex } from '$lib/stores/stepperStore';
	import { formStore } from '$lib/stores/formStore';
	import Stepper from '../Stepper.svelte';
	import FormTransitioner from '../FormTransitioner.svelte';
	import Button from '../Button.svelte';
	import { i18n } from '$lib/i18n';

	// Props
	interface Props {
		// Array of steps to render
		steps: Array<{
			id: string;
			title: string;
			description: string;
			component: any;
			props?: Record<string, any>;
			validate?: () => boolean;
		}>;
		// Called when the form is complete
		onComplete?: (formData: any) => void;
		// Custom navigation options
		navigationConfig?: {
			showBackButton?: boolean;
			backButtonLabel?: string;
			nextButtonLabel?: string;
			completeButtonLabel?: string;
		};
	}

	const {
		steps = [],
		onComplete = () => {},
		navigationConfig = {
			showBackButton: true,
			backButtonLabel: undefined,
			nextButtonLabel: undefined,
			completeButtonLabel: undefined
		}
	} = $props<Props>();

	// State
	let isSubmitting = $state(false);
	let currentStepValid = $state(true);

	// Derived values
	const backButtonText = $derived(navigationConfig.backButtonLabel || $i18n.common.back);
	const nextButtonText = $derived(navigationConfig.nextButtonLabel || $i18n.common.next);
	const completeButtonText = $derived(navigationConfig.completeButtonLabel || $i18n.common.submit);
	const isFirstStep = $derived($currentStepIndex === 1);
	const isLastStep = $derived($currentStepIndex === steps.length);
	const currentStep = $derived(steps[$currentStepIndex - 1]);

	// Handle step change event from Stepper
	function handleStepChange(event: CustomEvent<{ step: number }>) {
		const targetStep = event.detail.step;
		stepperStore.goToStep(targetStep);
	}

	// Handle next button click
	function handleNext() {
		// If current step has validation logic
		if (currentStep?.validate) {
			currentStepValid = currentStep.validate();
			if (!currentStepValid) {
				// Mark step as invalid for visual feedback
				stepperStore.markStepInvalid($currentStepIndex);
				return;
			}
		}

		// Update step status
		stepperStore.markStepValid($currentStepIndex);

		// Check if we're on the last step
		if (isLastStep) {
			handleSubmit();
		} else {
			// Move to next step
			stepperStore.nextStep();
		}
	}

	// Handle back button click
	function handleBack() {
		stepperStore.prevStep();
	}

	// Handle form submission
	async function handleSubmit() {
		isSubmitting = true;

		try {
			// Get current form data from store
			const formData = formStore.getState().formData;

			// Call the onComplete callback with the form data
			await onComplete(formData);

			// Reset submission state
			isSubmitting = false;
		} catch (error) {
			console.error('Form submission error:', error);
			isSubmitting = false;
		}
	}
</script>

<div class="multi-step-form">
	{#if steps.length > 1}
		<Stepper on:stepChange={handleStepChange} />
	{/if}

	<div class="form-content mt-6">
		<h2 class="mb-4 text-center text-xl font-semibold text-secondary-700">
			{currentStep?.description || ''}
		</h2>

		<FormTransitioner currentStep={$currentStepIndex}>
			{#if currentStep}
				<svelte:component this={currentStep.component} {...currentStep.props || {}} />
			{/if}
		</FormTransitioner>

		<!-- Navigation Controls -->
		<div class="mt-8 flex justify-between">
			{#if navigationConfig.showBackButton && !isFirstStep}
				<Button
					label={backButtonText}
					variant="outline"
					onClick={handleBack}
					disabled={isSubmitting}
				/>
			{:else}
				<div></div>
				<!-- Spacer -->
			{/if}

			<Button
				label={isLastStep ? completeButtonText : nextButtonText}
				variant="primary"
				onClick={handleNext}
				isLoading={isSubmitting}
				disabled={!currentStepValid || isSubmitting}
			/>
		</div>
	</div>
</div>

<style>
	.multi-step-form {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
	}

	.form-content {
		min-height: 300px;
		display: flex;
		flex-direction: column;
	}
</style>
