<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { modalStore, type ModalType } from './modalStore';
	import { browser } from '$app/environment';
	import { i18n } from '$lib/i18n';

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

	// Generated title based on modal type
	$effect(() => {
		if (!title) {
			if (type === 'payment') {
				title = $i18n.modal.payment.title;
				subtitle = $i18n.modal.payment.subtitle;
			} else if (type === 'success') {
				title = $i18n.modal.success.title;
				subtitle = $i18n.modal.success.subtitle;
			} else if (type === 'error') {
				title = $i18n.modal.error.title;
				subtitle = $i18n.modal.error.defaultMessage;
			} else if (type === 'confirm') {
				title = $i18n.modal.common.confirm;
				subtitle = $i18n.modal.confirm.extraDiscountOffer;
			}
		}
	});

	let dialogElement: HTMLDialogElement;
	let isClosing = $state(false);
	let transitionDuration = 300;
	let focusableElements: HTMLElement[] = [];
	let previousActiveElement: HTMLElement | null = null;

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

	// Handle modal close with animation
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
		} else if (e.key === 'Tab' && dialogElement && isOpen) {
			trapFocus(e);
		}
	}

	// Focus trap for accessibility
	function trapFocus(e?: KeyboardEvent) {
		if (!dialogElement || !isOpen || !focusableElements.length) return;

		if (e) {
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (e.shiftKey && document.activeElement === firstElement) {
				e.preventDefault();
				lastElement.focus();
			} else if (!e.shiftKey && document.activeElement === lastElement) {
				e.preventDefault();
				firstElement.focus();
			}
		} else {
			// Initial focus
			setTimeout(() => {
				focusableElements[0].focus();
			}, 50);
		}
	}

	// Update focusable elements
	function updateFocusableElements() {
		if (!dialogElement) return;

		focusableElements = Array.from(
			dialogElement.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		) as HTMLElement[];
	}

	// Set up modal when it opens
	function setupModal() {
		if (!dialogElement || !isOpen) return;

		// Store current active element to restore focus later
		if (browser && document.activeElement instanceof HTMLElement) {
			previousActiveElement = document.activeElement;
		}

		// Show the modal
		if (!dialogElement.open) {
			dialogElement.showModal();
		}

		// Update focusable elements and set initial focus
		setTimeout(() => {
			updateFocusableElements();
			trapFocus();
		}, 50);
	}

	// Clean up modal when it closes
	function cleanupModal() {
		if (dialogElement?.open) {
			dialogElement.close();
		}

		// Restore previous focus
		if (previousActiveElement && browser) {
			setTimeout(() => {
				previousActiveElement?.focus();
			}, 0);
		}
	}

	// Set up event listeners
	onMount(() => {
		if (browser) {
			document.addEventListener('keydown', handleKeydown);
			setupModal();
		}
	});

	// Clean up on destroy
	onDestroy(() => {
		if (browser) {
			document.removeEventListener('keydown', handleKeydown);
			cleanupModal();
		}
	});

	// Handle modal open/close state changes
	$effect(() => {
		if (isOpen) {
			setupModal();
		} else {
			cleanupModal();
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
		in:scale={{ duration: transitionDuration, opacity: 0, start: 0.95 }}
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
						<div><!-- Empty div to maintain flex layout --></div>
					{/if}

					{#if showCloseButton}
						<button
							type="button"
							class="btn-close"
							on:click={handleClose}
							aria-label={$i18n.modal.common.close}
						>
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
		z-index: 1000;
		border: none;
		background: transparent;
		padding: 0;
		overflow: hidden;
	}

	.modal::backdrop {
		background-color: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(2px);
		animation: backdropFadeIn 300ms ease forwards;
	}

	.modal.modal-open::backdrop {
		animation: backdropFadeIn 300ms ease forwards;
	}

	.modal:not(.modal-open)::backdrop {
		animation: backdropFadeOut 200ms ease forwards;
	}

	@keyframes backdropFadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes backdropFadeOut {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
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

	.modal-box {
		max-height: calc(100vh - 5rem);
		overflow-y: auto;
		background: white;
		border-radius: 0.5rem;
		box-shadow:
			0 20px 25px -5px rgb(0 0 0 / 0.1),
			0 8px 10px -6px rgb(0 0 0 / 0.1);
	}
</style>
