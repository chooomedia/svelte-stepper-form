<script lang="ts">
	import type { ImageOption as ImageOptionType } from '$lib/schema';

	export let value: string;
	export let options: ImageOptionType[];
	export let error: string | undefined = undefined;
	export let onSelect: ((value: string) => void) | undefined = undefined;
</script>

<div
	class="grid grid-cols-2 grid-rows-2 gap-4 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))] md:grid-rows-1"
>
	{#each options as option}
		<button
			type="button"
			class="relative flex cursor-pointer rounded-lg border bg-gray-50 px-4 py-6 shadow-sm focus:outline-none"
			class:border-indigo-500={value === option.value}
			class:border-gray-100={value !== option.value}
			onclick={() => {
				value = option.value;
				if (onSelect) {
					onSelect(option.value);
				}
			}}
			aria-label={option.description || option.label}
		>
			<div class="group flex w-full items-center justify-center">
				<div class="flex items-center">
					<div class="text-sm">
						<div class="flex items-center transition-transform group-hover:scale-110">
							{#if option.imgSrc}
								<img
									src={option.imgSrc}
									alt={option.description || option.label}
									class="h-32 w-full object-contain"
								/>
							{/if}
						</div>
						<h3 class="my-2 hyphens-auto break-words text-base font-bold text-gray-900">
							{option.label}
						</h3>
						{#if option.description}
							<p class="text-gray-500">{option.description}</p>
						{/if}
					</div>
				</div>
			</div>
		</button>
	{/each}
</div>

{#if error}
	<p class="mt-2 text-sm text-red-600">{error}</p>
{/if}
