<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';

	// Modal types for controlling appearance and behavior
	export type ModalType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'action';
	export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
	export type ModalPosition = 'center' | 'top' | 'bottom';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		type?: ModalType;
		size?: ModalSize;
		position?: ModalPosition;
		title?: string;
		subtitle?: string;
		closeOnClickOutside?: boolean;
		closeOnEsc?: boolean;
		showCloseButton?: boolean;
		preventScroll?: boolean;
		backdropBlur?: boolean;
		fullHeight?: boolean;
		transitionDuration?: number;
		bodyScrollLock?: boolean;
		// Action-specific props
		primaryAction?: {
			label: string;
			onClick: () => void;
			variant?: string;
		};
		secondaryAction?: {
			label: string;
			onClick: () => void;
			variant?: string;
		};
		icon?: string; // SVG path or predefined icon key
	}

	// Props with defaults
	const {
		isOpen = false,
		onClose,
		type = 'default',
		size = 'md',
		position = 'center',
		title = '',
		subtitle = '',
		closeOnClickOutside = true,
		closeOnEsc = true,
		showCloseButton = true,
		preventScroll = true,
		backdropBlur = true,
		fullHeight = false,
		transitionDuration = 200,
		bodyScrollLock = true,
		primaryAction = undefined,
		secondaryAction = undefined,
		icon = undefined
	} = $props<Props>();

	// Internal state
	let dialogElement: HTMLDialogElement;
	let isClosing = $state(false);
	let scrollPosition = $state(0);

	// Styles based on type
	const typeStyles = $derived(() => {
		switch (type) {
			case 'success':
				return {
					iconBg: 'bg-success bg-opacity-20',
					iconColor: 'text-success',
					headerBg: '',
					headerText: 'text-success-content',
					icon: icon || 'M5 13l4 4L19 7'
				};
			case 'error':
				return {
					iconBg: 'bg-error bg-opacity-20',
					iconColor: 'text-error',
					headerBg: '',
					headerText: 'text-error-content',
					icon: icon || 'M6 18L18 6M6 6l12 12'
				};
			case 'warning':
				return {
					iconBg: 'bg-warning bg-opacity-20',
					iconColor: 'text-warning',
					headerBg: '',
					headerText: 'text-warning-content',
					icon:
						icon ||
						'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
				};
			case 'info':
				return {
					iconBg: 'bg-info bg-opacity-20',
					iconColor: 'text-info',
					headerBg: '',
					headerText: 'text-info-content',
					icon: icon || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
				};
			case 'action':
				return {
					iconBg: 'bg-primary bg-opacity-20',
					iconColor: 'text-primary',
					headerBg: '',
					headerText: 'text-primary-content',
					icon:
						icon ||
						'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
				};
			default:
				return {
					iconBg: 'bg-neutral bg-opacity-10',
					iconColor: 'text-neutral',
					headerBg: '',
					headerText: 'text-base-content',
					icon: icon || null
				};
		}
	});

	// Size classes for the modal
	const sizeClasses = $derived(() => {
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
			case 'full':
				return 'max-w-full';
			default:
				return 'max-w-md';
		}
	});

	// Position classes
	const positionClasses = $derived(() => {
		switch (position) {
			case 'top':
				return 'items-start pt-24';
			case 'bottom':
				return 'items-end pb-24';
			default:
				return 'items-center';
		}
	});

	// Action variant styles
	const getButtonVariant = (actionType: 'primary' | 'secondary', defaultVariant: string) => {
		const action = actionType === 'primary' ? primaryAction : secondaryAction;
		return action?.variant || defaultVariant;
	};

	// Handle outside click - close when clicking outside the modal content
	function handleOutsideClick(e: MouseEvent) {
		if (!closeOnClickOutside) return;

		const target = e.target as HTMLElement;
		if (target === dialogElement) {
			handleClose();
		}
	}

	// Handle ESC key press
	function handleKeydown(e: KeyboardEvent) {
		if (closeOnEsc && e.key === 'Escape' && isOpen && !isClosing) {
			e.preventDefault(); // Prevent the default ESC behavior
			handleClose();
		}
	}

	// Close with animation
	function handleClose() {
		isClosing = true;
		setTimeout(() => {
			isClosing = false;
			onClose();
		}, transitionDuration);
	}

	// A11y focus management
	function trapFocus() {
		if (!dialogElement || !isOpen) return;

		const focusableElements = dialogElement.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);

		if (focusableElements.length === 0) return;

		const firstElement = focusableElements[0] as HTMLElement;
		const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

		// Focus the first element when opened (after animation completes)
		setTimeout(() => {
			firstElement.focus();
		}, transitionDuration + 50);

		// Override tab behavior for focus trapping
		dialogElement.addEventListener('keydown', (e) => {
			if (e.key !== 'Tab') return;

			// If shift+tab on first element, go to last element
			if (e.shiftKey && document.activeElement === firstElement) {
				e.preventDefault();
				lastElement.focus();
			}
			// If tab on last element, go to first element
			else if (!e.shiftKey && document.activeElement === lastElement) {
				e.preventDefault();
				firstElement.focus();
			}
		});
	}

	// Manage body scroll locking
	function manageBodyScroll(lock: boolean) {
		if (!bodyScrollLock) return;

		if (lock) {
			// Store current scroll position
			scrollPosition = window.scrollY;
			// Lock the scroll
			document.body.style.position = 'fixed';
			document.body.style.top = `-${scrollPosition}px`;
			document.body.style.width = '100%';
			document.body.style.overflow = 'hidden';
		} else {
			// Restore scroll
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.width = '';
			document.body.style.overflow = '';
			window.scrollTo(0, scrollPosition);
		}
	}

	// Set up event listeners and initial states
	onMount(() => {
		// Apply event listeners
		document.addEventListener('keydown', handleKeydown);

		// Initial focus trap setup if modal is open
		if (isOpen) {
			trapFocus();
			if (bodyScrollLock) manageBodyScroll(true);
		}

		// Ensure we clean up scroll locking when the component unmounts
		return () => {
			if (bodyScrollLock) manageBodyScroll(false);
		};
	});

	// Clean up event listeners
	onDestroy(() => {
		document.removeEventListener('keydown', handleKeydown);

		// Ensure we restore scroll when the component is destroyed
		if (bodyScrollLock) manageBodyScroll(false);
	});

	// React to changes in isOpen
	$effect(() => {
		if (isOpen) {
			// Show the dialog when isOpen becomes true
			if (dialogElement && !dialogElement.open) {
				dialogElement.showModal();
			}
			// Set up focus trapping and scroll locking
			trapFocus();
			if (bodyScrollLock) manageBodyScroll(true);
		} else {
			// Close the dialog when isOpen becomes false
			if (dialogElement && dialogElement.open) {
				dialogElement.close();
			}
			// Restore scroll
			if (bodyScrollLock) manageBodyScroll(false);
		}
	});
</script>

<dialog
	bind:this={dialogElement}
	class="modal flex items-center justify-center {backdropBlur ? 'backdrop-blur-sm' : ''}"
	class:modal-open={isOpen && !isClosing}
	on:click={handleOutsideClick}
	aria-labelledby={title ? 'modal-title' : undefined}
	aria-describedby={subtitle ? 'modal-subtitle' : undefined}
>
	<div
		class="modal-box relative {sizeClasses} {fullHeight ? 'h-full' : ''} overflow-visible p-0"
		in:fade={{ duration: transitionDuration }}
		out:fade={{ duration: transitionDuration * 0.75 }}
	>
		<!-- Modal Header -->
		{#if title || showCloseButton}
			<div class="sticky top-0 z-10 rounded-t-xl bg-base-100 p-4 shadow-sm">
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
						<button
							type="button"
							class="btn btn-circle btn-sm"
							on:click={handleClose}
							aria-label="Schließen"
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

		<!-- Content Section -->
		<div class="p-4 lg:p-6">
			<!-- Type-specific icon, if applicable -->
			{#if type !== 'default' && typeStyles.icon}
				<div class="mb-6 flex justify-center">
					<div
						class="flex h-24 w-24 items-center justify-center rounded-full {typeStyles.iconBg}"
						in:scale={{ duration: transitionDuration, delay: 150 }}
					>
						<svg
							class="h-12 w-12 {typeStyles.iconColor}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d={typeStyles.icon}
							/>
						</svg>
					</div>
				</div>
			{/if}

			<!-- Main Content -->
			<div class={type !== 'default' ? 'text-center' : ''}>
				<slot />
			</div>

			<!-- Action Buttons -->
			{#if primaryAction || secondaryAction}
				<div class="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center sm:gap-4">
					{#if secondaryAction}
						<button
							class="btn btn-{getButtonVariant('secondary', 'outline')}"
							on:click={secondaryAction.onClick}
						>
							{secondaryAction.label}
						</button>
					{/if}

					{#if primaryAction}
						<button
							class="btn btn-{getButtonVariant('primary', 'primary')}"
							on:click={primaryAction.onClick}
						>
							{primaryAction.label}
						</button>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Footer Slot -->
		<slot name="footer" />
	</div>
</dialog>

<style>
	dialog {
		border: none;
		background: transparent;
		padding: 0;
		max-height: 100vh;
		overflow: visible;
	}

	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
	}

	.modal-open {
		transition: opacity 0.2s ease-out;
	}
</style>
