<!-- src/lib/components/modal/Modal.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { modalStore, type ModalType } from './modalStore';

	export type ModalSize =
		| 'sm'
		| 'md'
		| 'lg'
		| 'xl'
		| '2xl'
		| '3xl'
		| '4xl'
		| '5xl'
		| '6xl'
		| '7xl'
		| 'full';
	export type ModalPosition = 'center' | 'top' | 'bottom';

	interface Props {
		isOpen?: boolean;
		onClose?: () => void;
		type?: ModalType;
		title?: string;
		subtitle?: string;
		size?: ModalSize;
		position?: ModalPosition;
		closeOnClickOutside?: boolean;
		closeOnEsc?: boolean;
		backdropBlur?: boolean;
		showCloseButton?: boolean;
	}

	let {
		isOpen = false,
		onClose = () => modalStore.close(),
		type = 'payment',
		title = '',
		subtitle = '',
		size = '2xl',
		position = 'center',
		closeOnClickOutside = true,
		closeOnEsc = true,
		backdropBlur = true,
		showCloseButton = true
	} = $props<Props>();

	let dialogElement: HTMLDialogElement;
	let isClosing = $state(false);
	let transitionDuration = 300;

	// Convert size string to CSS class
	function getSizeClass(size: ModalSize): string {
		switch (size) {
			case 'sm':
				return 'max-w-sm';
			case 'md':
				return 'max-w-md';
			case 'lg':
				return 'max-w-lg';
			case 'xl':
				return 'max-w-xl';
			case '2xl':
				return 'max-w-2xl';
			case '3xl':
				return 'max-w-3xl';
			case '4xl':
				return 'max-w-4xl';
			case '5xl':
				return 'max-w-5xl';
			case '6xl':
				return 'max-w-6xl';
			case '7xl':
				return 'max-w-7xl';
			case 'full':
				return 'max-w-full';
			default:
				return 'max-w-2xl';
		}
	}

	// Handle modal close
	function handleClose() {
		if (!closeOnClickOutside) return;
		isClosing = true;
		setTimeout(() => {
			isClosing = false;
			onClose();
		}, transitionDuration);
	}

	// Close when clicking outside the modal content
	function handleOutsideClick(e: MouseEvent) {
		if (!closeOnClickOutside) return;
		const target = e.target as HTMLElement;
		if (target === dialogElement) handleClose();
	}

	// Close on escape key
	function handleKeydown(e: KeyboardEvent) {
		if (closeOnEsc && e.key === 'Escape' && isOpen && !isClosing) {
			e.preventDefault();
			handleClose();
		}
	}

	// Focus trap for accessibility
	function trapFocus() {
		if (!dialogElement || !isOpen) return;

		const focusableElements = dialogElement.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);

		if (focusableElements.length === 0) return;

		const firstElement = focusableElements[0] as HTMLElement;
		const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

		setTimeout(() => {
			firstElement.focus();
		}, transitionDuration + 50);

		dialogElement.addEventListener('keydown', (e) => {
			if (e.key !== 'Tab') return;

			if (e.shiftKey && document.activeElement === firstElement) {
				e.preventDefault();
				lastElement.focus();
			} else if (!e.shiftKey && document.activeElement === lastElement) {
				e.preventDefault();
				firstElement.focus();
			}
		});
	}

	// Set up event listeners
	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		if (isOpen) trapFocus();
		return () => document.removeEventListener('keydown', handleKeydown);
	});

	// Clean up on destroy
	onDestroy(() => {
		document.removeEventListener('keydown', handleKeydown);
	});

	// Handle modal open/close state
	$effect(() => {
		if (isOpen) {
			if (dialogElement && !dialogElement.open) {
				dialogElement.showModal();
				trapFocus();
			}
		} else if (dialogElement && dialogElement.open) {
			dialogElement.close();
		}
	});
</script>

<dialog
	bind:this={dialogElement}
	class="modal {backdropBlur ? 'backdrop-blur-sm' : ''} modal-{position}"
	class:modal-open={isOpen && !isClosing}
	on:click={handleOutsideClick}
	aria-labelledby={title ? 'modal-title' : undefined}
	aria-describedby={subtitle ? 'modal-subtitle' : undefined}
>
	<div
		class="modal-box {getSizeClass(size)} p-0"
		in:fade={{ duration: transitionDuration }}
		out:fade={{ duration: transitionDuration * 0.75 }}
	>
		<!-- Header -->
		{#if title || showCloseButton}
			<div class="sticky top-0 z-50 rounded-t-xl bg-base-100 px-4 py-4 lg:px-6 lg:pt-6">
				<header class="flex items-center justify-between">
					{#if title}
						<h3 id="modal-title" class="text-xl font-bold lg:text-2xl">
							{title}
						</h3>
					{:else}
						<div></div>
						<!-- Empty div to maintain flex layout -->
					{/if}

					{#if showCloseButton}
						<button type="button" class="btn-close" on:click={handleClose} aria-label="Schließen">
							✕
						</button>
					{/if}
				</header>

				{#if subtitle}
					<p id="modal-subtitle" class="mt-1 text-sm text-base-content/70">
						{subtitle}
					</p>
				{/if}
			</div>
		{/if}

		<!-- Modal Content -->
		<div class="overflow-hidden rounded-b-lg px-4 pb-4 lg:px-6 lg:pb-6">
			<slot />
		</div>

		<!-- Footer Slot -->
		<slot name="footer" />
	</div>
</dialog>

<style>
	.modal {
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000; /* Niedrigerer z-index für das Modal */
	}

	.modal::backdrop {
		z-index: 900; /* Noch niedrigerer z-index für den Backdrop */
	}

	.modal-center {
		align-items: center;
	}

	.modal-top {
		align-items: flex-start;
		padding-top: 2rem;
	}

	.modal-bottom {
		align-items: flex-end;
		padding-bottom: 2rem;
	}

	/* Sicherstellen, dass der Backdrop hinter den Confetti ist */
	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.4);
	}
</style>
