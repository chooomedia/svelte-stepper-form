<script lang="ts">
	import { fly } from 'svelte/transition';
	import { i18n } from '$lib/i18n';
	import Icon from './Icon.svelte';

	// Animation properties using Svelte 5 props syntax
	const { staggerDelay = 200 } = $props<{ staggerDelay?: number }>();

	// Process steps data from translations
	// Get all step entries except the title field
	const getProcessSteps = () => {
		const stepsData = $i18n.results.sections.steps;

		// Filter out the 'title' key and transform into an array of step objects
		return Object.entries(stepsData)
			.filter(([key]) => key !== 'title')
			.map(([key, step]) => ({
				key,
				title: step.title,
				description: step.description,
				icon: step.icon
			}));
	};

	// Reactive value that updates when translations change
	const processSteps = $derived(getProcessSteps());
</script>

<div class="process-steps my-16">
	<h2 class="mb-12 text-center text-3xl font-bold text-secondary-900">
		{$i18n.results.sections.steps.title}
	</h2>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
		{#each processSteps as step, index}
			<div
				class="flex flex-col rounded-lg bg-primary-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
				in:fly={{ y: 20, duration: 500, delay: staggerDelay * (index + 1) }}
				key={step.key}
			>
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-secondary"
				>
					<Icon name={step.icon} size={24} className="h-8 w-8" />
				</div>
				<div class="mb-2 flex items-center">
					<span class="mr-2 text-2xl font-bold text-primary-600">{index + 1}</span>
					<h3 class="font-bold text-gray-900">{step.title}</h3>
				</div>
				<p class="text-gray-600">
					{step.description}
				</p>
			</div>
		{/each}
	</div>
</div>
