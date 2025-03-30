<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';
	export type TooltipColor =
		| 'default'
		| 'primary'
		| 'secondary'
		| 'accent'
		| 'info'
		| 'success'
		| 'warning'
		| 'error';

	interface Props {
		text?: string; // Tooltip content (alternative to using slot)
		show: boolean; // Whether to show the tooltip
		position?: TooltipPosition; // Tooltip position
		color?: TooltipColor; // Tooltip color theme
		arrow?: boolean; // Whether to show the arrow
		maxWidth?: string; // Maximum width of the tooltip
		zIndex?: number; // Z-index of the tooltip
		delay?: number; // Delay before showing the tooltip (ms)
		duration?: number; // Transition duration (ms)
		distance?: number; // Distance from the trigger element (px)
		showOnFocus?: boolean; // Whether to show on focus events
	}

	const {
		text = '',
		show = false,
		position = 'top',
		color = 'default',
		arrow = true,
		maxWidth = '16rem',
		zIndex = 50,
		delay = 0,
		duration = 150,
		distance = 8,
		showOnFocus = true
	} = $props<Props>();

	// Internal state
	let tooltipElement: HTMLDivElement;
	let isVisible = $state(false);
	let delayTimeout: ReturnType<typeof setTimeout> | null = null;

	// Calculate position classes
	const positionClasses = $derived(() => {
		const posMap = {
			top: `bottom-full left-1/2 -translate-x-1/2 mb-${distance / 4}`,
			right: `left-full top-1/2 -translate-y-1/2 ml-${distance / 4}`,
			bottom: `top-full left-1/2 -translate-x-1/2 mt-${distance / 4}`,
			left: `right-full top-1/2 -translate-y-1/2 mr-${distance / 4}`
		};
		return posMap[position] || posMap.top;
	});

	// Calculate arrow position classes
	const arrowClasses = $derived(() => {
		if (!arrow) return '';

		const arrowMap = {
			top: `bottom-[-6px] left-1/2 -translate-x-1/2 border-t-current border-l-transparent border-r-transparent border-b-transparent`,
			right: `left-[-6px] top-1/2 -translate-y-1/2 border-r-current border-t-transparent border-b-transparent border-l-transparent`,
			bottom: `top-[-6px] left-1/2 -translate-x-1/2 border-b-current border-l-transparent border-r-transparent border-t-transparent`,
			left: `right-[-6px] top-1/2 -translate-y-1/2 border-l-current border-t-transparent border-b-transparent border-r-transparent`
		};
		return arrowMap[position] || arrowMap.top;
	});

	// Calculate color classes
	const colorClasses = $derived(() => {
		const colorMap = {
			default: 'bg-neutral text-neutral-content',
			primary: 'bg-primary text-primary-content',
			secondary: 'bg-secondary text-secondary-content',
			accent: 'bg-accent text-accent-content',
			info: 'bg-info text-info-content',
			success: 'bg-success text-success-content',
			warning: 'bg-warning text-warning-content',
			error: 'bg-error text-error-content'
		};
		return colorMap[color] || colorMap.default;
	});

	// Handle show/hide with delay
	$effect(() => {
		if (show) {
			if (delayTimeout) clearTimeout(delayTimeout);
			if (delay > 0) {
				delayTimeout = setTimeout(() => {
					isVisible = true;
				}, delay);
			} else {
				isVisible = true;
			}
		} else {
			if (delayTimeout) clearTimeout(delayTimeout);
			isVisible = false;
		}
	});

	// Clean up on unmount
	onMount(() => {
		return () => {
			if (delayTimeout) clearTimeout(delayTimeout);
		};
	});
</script>

{#if isVisible}
	<div
		bind:this={tooltipElement}
		class="tooltip absolute {positionClasses} {colorClasses} z-[{zIndex}]"
		style="max-width: {maxWidth};"
		in:fade={{ duration }}
		out:fade={{ duration: duration / 2 }}
		role="tooltip"
	>
		<div class="rounded-md px-2 py-1 shadow-lg">
			{#if text}
				<span>{text}</span>
			{:else}
				<slot />
			{/if}
		</div>

		<!-- Tooltip arrow -->
		{#if arrow}
			<div class="absolute h-0 w-0 border-[6px] text-[inherit] {arrowClasses}"></div>
		{/if}
	</div>
{/if}

<style>
	.tooltip {
		pointer-events: none;
		white-space: normal;
		word-wrap: break-word;
	}
</style>
