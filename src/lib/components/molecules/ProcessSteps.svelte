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

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
		{#each processSteps as step, index (step.key)}
			<div
				class="flex flex-col rounded-lg bg-primary-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
				in:fly={{ y: 20, duration: 500, delay: staggerDelay * (index + 1) }}
			>
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-secondary"
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
				<p class="text-sm text-gray-600 leading-relaxed">
					{step.description}
				</p>
			</div>
		{/each}

		<!-- Bonus: Was dich erwartet -->
		<div
			class="flex flex-col rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
			in:fly={{ y: 20, duration: 500, delay: staggerDelay * 4 }}
		>
			<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-white">
				<Icon
					name="star"
					size={24}
					className="h-8 w-8"
					fill="currentColor"
				/>
			</div>
			<div class="mb-3">
				<h3 class="font-bold text-gray-900 leading-tight">Was dich erwartet:</h3>
			</div>
			<ul class="space-y-2 text-sm text-gray-700">
				<li class="flex items-start gap-2">
					<Icon name="check" size={14} className="mt-0.5 text-green-600 flex-shrink-0" stroke="currentColor" strokeWidth="3" />
					<span class="leading-relaxed"><strong>7 Geheimtipps</strong> – praxiserprobt und sofort umsetzbar</span>
				</li>
				<li class="flex items-start gap-2">
					<Icon name="check" size={14} className="mt-0.5 text-green-600 flex-shrink-0" stroke="currentColor" strokeWidth="3" />
					<span class="leading-relaxed"><strong>Konkrete Handlungsempfehlungen</strong> für deine Branche</span>
				</li>
				<li class="flex items-start gap-2">
					<Icon name="check" size={14} className="mt-0.5 text-green-600 flex-shrink-0" stroke="currentColor" strokeWidth="3" />
					<span class="leading-relaxed"><strong>Exklusive Insights</strong> aus 500+ Projekten</span>
				</li>
			</ul>
			<div class="mt-3 rounded-lg bg-white p-3 text-center">
				<p class="text-xs font-medium text-gray-900 leading-relaxed">
					💡 <strong>Erfolgsgarantie:</strong> Durchschnittlich <span class="text-primary-600">3x mehr Anfragen</span> nach Umsetzung
				</p>
			</div>
		</div>
	</div>
</div>
