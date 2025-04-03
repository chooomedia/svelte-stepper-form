<script lang="ts">
	import { fly } from 'svelte/transition';
	import { i18n } from '$lib/i18n';
	import Icon from '../Icon.svelte';

	// Component prop for the score
	const { score = 50 } = $props<{
		score?: number;
	}>();

	const getImprovementsFromTranslations = (currentScore) => {
		// Get all improvement steps from i18n
		const allSteps = $i18n.results.sections.improvement.steps || [];
		return allSteps
			.filter((step) => !step.underScore || currentScore < step.underScore)
			.slice(0, 4); // Limit to 4 items maximum
	};

	// Reactive value that updates when score or translations change
	const improvements = $derived(getImprovementsFromTranslations(score));
</script>

<div class="improvement-section my-16">
	<h2 class="mb-6 text-center text-3xl font-bold text-secondary-900">
		{$i18n.results.sections.improvement.title}
	</h2>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
		{#each improvements as improvement, index}
			<div
				class="flex flex-col rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
				in:fly={{ y: 20, duration: 400, delay: 200 * index }}
			>
				<div
					class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600"
				>
					<Icon name={improvement.icon} size={24} />
				</div>

				<h3 class="mb-2 text-lg font-bold text-gray-900">{improvement.title}</h3>
				<p class="text-gray-600">{improvement.description}</p>
			</div>
		{/each}
	</div>
</div>
