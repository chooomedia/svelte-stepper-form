<script lang="ts">
	import { fade } from 'svelte/transition';
	import { i18n } from '$lib/i18n';
	import Icon from '../Icon.svelte';

	// Use $derived for reactive transformations
	const profile = $derived($i18n.results.expertProfile);
	const badges = $derived(Object.values(profile.badges));

	// Delay for fade-in animation
	const delay = 300;
</script>

<div
	class="expert-profile group my-16 rounded-xl bg-gradient-to-r from-secondary-50 to-secondary-100 p-8 shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
	in:fade={{ duration: 500, delay }}
	itemscope
	itemtype="https://schema.org/Person"
>
	<div class="flex flex-col items-center gap-8 md:flex-row">
		<!-- Expert Image -->
		<div class="shrink-0">
			<div
				class="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary-200 shadow-lg transition-all duration-300 group-hover:border-primary-300"
			>
				<img
					src={profile.imageUrl}
					alt={profile.imageAlt}
					class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
					loading="lazy"
					itemprop="image"
					aria-label={profile.imageAlt}
				/>
				<div class="absolute inset-0 rounded-full shadow-inner"></div>
			</div>
		</div>

		<!-- Expert Information -->
		<div class="flex-1 text-center md:text-left">
			<h3
				class="mb-2 text-2xl font-bold text-primary-50 transition-colors group-hover:text-primary-100"
				itemprop="name"
			>
				{profile.name}
			</h3>
			<p
				class="mb-4 text-lg font-medium text-primary-400 transition-colors group-hover:text-primary-500"
				itemprop="jobTitle"
			>
				{profile.role}
			</p>

			<p
				class="mb-6 text-primary-100 transition-colors group-hover:text-primary-200"
				itemprop="description"
			>
				{profile.bio}
			</p>

			<div
				class="flex flex-wrap justify-center gap-4 md:justify-start"
				aria-label="Professional Credentials"
			>
				{#each badges as badge (badge.icon + badge.label)}
					<div
						class="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
						aria-label="{badge.label} {badge.value}"
					>
						<Icon
							name={badge.icon}
							size={24}
							className="text-primary-600 transition-colors group-hover:text-primary-700"
							fill="currentColor"
							aria-hidden="true"
						/>
						<span
							class="font-medium transition-colors group-hover:text-secondary-800"
							aria-label={badge.label}
						>
							{badge.value}
							{badge.label}
						</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
