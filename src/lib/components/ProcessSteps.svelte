<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { i18n } from '$lib/i18n';

	// Animation properties
	export let staggerDelay = 200;
</script>

<div class="process-steps my-16">
	<h2 class="mb-12 text-center text-3xl font-bold text-secondary-900">
		{$i18n.results.sections.steps.title}
	</h2>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
		<!-- Step 1: Purchase -->
		<div
			class="flex flex-col rounded-lg bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
			in:fly={{ y: 20, duration: 500, delay: staggerDelay * 1 }}
		>
			<div
				class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
					/>
				</svg>
			</div>
			<div class="mb-2 flex items-center">
				<span class="mr-2 text-2xl font-bold text-primary-600">1</span>
				<h3 class="font-bold text-gray-900">Kaufabschluss</h3>
			</div>
			<p class="text-gray-600">
				{$i18n.results.sections.steps.purchase}
			</p>
		</div>

		<!-- Step 2: Scheduling -->
		<div
			class="flex flex-col rounded-lg bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
			in:fly={{ y: 20, duration: 500, delay: staggerDelay * 2 }}
		>
			<div
				class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			</div>
			<div class="mb-2 flex items-center">
				<span class="mr-2 text-2xl font-bold text-primary-600">2</span>
				<h3 class="font-bold text-gray-900">Terminvereinbarung</h3>
			</div>
			<p class="text-gray-600">
				{$i18n.results.sections.steps.scheduling}
			</p>
		</div>

		<!-- Step 3: Implementation -->
		<div
			class="flex flex-col rounded-lg bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
			in:fly={{ y: 20, duration: 500, delay: staggerDelay * 3 }}
		>
			<div
				class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
					/>
				</svg>
			</div>
			<div class="mb-2 flex items-center">
				<span class="mr-2 text-2xl font-bold text-primary-600">3</span>
				<h3 class="font-bold text-gray-900">Umsetzung</h3>
			</div>
			<p class="text-gray-600">
				{$i18n.results.sections.steps.implementation}
			</p>
		</div>

		<!-- Step 4: Handover -->
		<div
			class="flex flex-col rounded-lg bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
			in:fly={{ y: 20, duration: 500, delay: staggerDelay * 4 }}
		>
			<div
				class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</div>
			<div class="mb-2 flex items-center">
				<span class="mr-2 text-2xl font-bold text-primary-600">4</span>
				<h3 class="font-bold text-gray-900">Übergabe</h3>
			</div>
			<p class="text-gray-600">
				{$i18n.results.sections.steps.handover}
			</p>
		</div>
	</div>
</div>
