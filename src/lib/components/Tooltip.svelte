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
		showOnFocus?: boolean; // Whether to show on focus events
	}

	const {
		text = '',
		show = false,
		position = 'top',
		color = 'default',
		arrow = true,
		maxWidth = '20rem',
		zIndex = 50,
		delay = 0,
		duration = 150,
		showOnFocus = true
	} = $props<Props>();

	// Interne Status-Variablen
	let tooltipElement: HTMLDivElement;
	let isVisible = $state(false);
	let delayTimeout: ReturnType<typeof setTimeout> | null = null;

	// DaisyUI-spezifische Klassen
	function getDaisyUITooltipClasses(): string {
		// DaisyUI verwendet die Kombination aus tooltip und tooltip-* für Positionen
		let classes = 'tooltip';

		// Positionsklassen
		switch (position) {
			case 'top':
				classes += ' tooltip-top';
				break;
			case 'right':
				classes += ' tooltip-right';
				break;
			case 'bottom':
				classes += ' tooltip-bottom';
				break;
			case 'left':
				classes += ' tooltip-left';
				break;
			default:
				classes += ' tooltip-top';
		}

		// Farbklassen, DaisyUI verwendet tooltip-* für Farben
		switch (color) {
			case 'primary':
				classes += ' tooltip-primary';
				break;
			case 'secondary':
				classes += ' tooltip-secondary';
				break;
			case 'accent':
				classes += ' tooltip-accent';
				break;
			case 'info':
				classes += ' tooltip-info';
				break;
			case 'success':
				classes += ' tooltip-success';
				break;
			case 'warning':
				classes += ' tooltip-warning';
				break;
			case 'error':
				classes += ' tooltip-error';
				break;
			// Bei default keine zusätzliche Klasse
		}

		return classes;
	}

	// Verzögerung/Animation behandeln
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

	// Aufräumen beim Unmount
	onMount(() => {
		return () => {
			if (delayTimeout) clearTimeout(delayTimeout);
		};
	});
</script>

{#if isVisible}
	<div
		bind:this={tooltipElement}
		class="{getDaisyUITooltipClasses()} z-50 m-w-[{maxWidth}] w-42 absolute bg-{color}"
		data-tip={text ? text : undefined}
		in:fade={{ duration }}
		out:fade={{ duration: duration / 2 }}
		role="tooltip"
	>
		{#if !text}
			<div class="tooltip-conten">
				<slot />
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Anpassungen für absolute Positionierung mit DaisyUI */
	.tooltip {
		pointer-events: none;
		white-space: normal;
		word-wrap: break-word;
	}

	/* Für benutzerdefinierte Inhalte (Slot) */
	.tooltip-content {
		background-color: inherit;
		color: inherit;
		border-radius: 0.375rem;
		padding: 0.25rem 0.5rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}
</style>
