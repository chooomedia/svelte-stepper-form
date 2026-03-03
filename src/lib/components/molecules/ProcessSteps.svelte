<script lang="ts">
	import { fly } from 'svelte/transition';
	import { i18n } from '$lib/i18n';
	import Icon from '../atoms/Icon.svelte';

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

	<!-- 3 Steps + 1 Bonus Card -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
		{#each processSteps as step, index (step.key)}
			<div
				class="flex h-full flex-col rounded-lg bg-primary-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
				in:fly={{ y: 20, duration: 500, delay: staggerDelay * (index + 1) }}
			>
				<div
					class="mb-4 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-secondary"
				>
					<Icon
						name={step.icon}
						size={24}
						className="h-8 w-8"
						stroke="currentColor"
						strokeWidth="2"
						fill="none"
					/>
				</div>
				<div class="mb-2 flex items-center gap-2">
					<span class="text-2xl font-bold text-primary-600 flex-shrink-0">{index + 1}</span>
					<h3 class="font-bold text-gray-900 leading-tight">{step.title}</h3>
				</div>
				<p class="flex-1 text-sm text-gray-600 leading-relaxed">
					{step.description}
				</p>
			</div>
		{/each}

		<!-- Bonus Card: 7 Geheimtipps -->
		<div
			class="flex h-full flex-col rounded-lg bg-primary-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
			in:fly={{ y: 20, duration: 500, delay: staggerDelay * 4 }}
		>
			<div
				class="mb-4 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-secondary"
			>
				<Icon
					name="zap"
					size={24}
					className="h-8 w-8"
					stroke="currentColor"
					strokeWidth="2"
					fill="none"
				/>
			</div>
			<div class="mb-2 flex items-center gap-2">
				<span class="text-2xl font-bold text-primary-600 flex-shrink-0">+</span>
				<h3 class="font-bold text-gray-900 leading-tight">Dein Bonus</h3>
			</div>
			<p class="flex-1 text-sm text-gray-600 leading-relaxed">
				<strong>7 Geheimtipps</strong> für sofortigen Erfolg – exklusiv aus 500+ Projekten
			</p>
		</div>
	</div>

	<!-- Erfolgsgarantie: Full Width Banner -->
	<div
		class="rounded-xl bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 p-6 shadow-xl"
		in:fly={{ y: 20, duration: 500, delay: staggerDelay * 5 }}
	>
		<div class="flex flex-col items-center justify-center gap-3 text-center md:flex-row md:gap-4">
			<div class="flex items-center gap-2">
				<span class="text-4xl">💡</span>
				<h3 class="text-xl font-bold text-white md:text-2xl">Erfolgsgarantie</h3>
			</div>
			<div class="h-px w-16 bg-white/30 md:h-8 md:w-px"></div>
			<p class="text-base font-semibold text-white/95 md:text-lg">
				Durchschnittlich <span class="text-yellow-300 font-bold">3x mehr Anfragen</span> nach Umsetzung
			</p>
		</div>
	</div>
</div>
