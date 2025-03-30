<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';

	export type ModalType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'action';
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
		| 'full'
		| 'wide';
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
		primaryAction?: { label: string; onClick: () => void; variant?: string };
		secondaryAction?: { label: string; onClick: () => void; variant?: string };
		icon?: string;
	}

	const {
		isOpen = false,
		onClose,
		type = 'default',
		size = '2xl',
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

	let dialogElement: HTMLDialogElement;
	let isClosing = $state(false);
	let scrollPosition = $state(0);

	const typeStyles = $derived(() => {
		switch (type) {
			case 'success':
				return {
					iconBg: 'bg-success bg-opacity-20',
					iconColor: 'text-success',
					icon: icon || 'M5 13l4 4L19 7'
				};
			case 'error':
				return {
					iconBg: 'bg-error bg-opacity-20',
					iconColor: 'text-error',
					icon: icon || 'M6 18L18 6M6 6l12 12'
				};
			case 'warning':
				return {
					iconBg: 'bg-warning bg-opacity-20',
					iconColor: 'text-warning',
					icon: icon || 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
				};
			case 'info':
				return {
					iconBg: 'bg-info bg-opacity-20',
					iconColor: 'text-info',
					icon: icon || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
				};
			case 'action':
				return {
					iconBg: 'bg-primary bg-opacity-20',
					iconColor: 'text-primary',
					icon: icon || 'M8.228 9c.549-1.165 2.03-2 3.772-2'
				};
			default:
				return {
					iconBg: 'bg-neutral bg-opacity-10',
					iconColor: 'text-neutral',
					icon: icon || null
				};
		}
	});

	function getSizeClass(currentSize: ModalSize): string {
		switch (currentSize) {
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
			case 'wide':
				return 'max-w-[900px]';
			default:
				return 'max-w-lg';
		}
	}

	const getButtonVariant = (actionType: 'primary' | 'secondary', defaultVariant: string) => {
		const action = actionType === 'primary' ? primaryAction : secondaryAction;
		return action?.variant || defaultVariant;
	};

	function handleOutsideClick(e: MouseEvent) {
		if (!closeOnClickOutside) return;
		const target = e.target as HTMLElement;
		if (target === dialogElement) handleClose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (closeOnEsc && e.key === 'Escape' && isOpen && !isClosing) {
			e.preventDefault();
			handleClose();
		}
	}

	function handleClose() {
		isClosing = true;
		setTimeout(() => {
			isClosing = false;
			onClose();
		}, transitionDuration);
	}

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

	function manageBodyScroll(lock: boolean) {
		if (!bodyScrollLock) return;
		if (lock) {
			scrollPosition = window.scrollY;
			document.body.style.position = 'fixed';
			document.body.style.top = `-${scrollPosition}px`;
			document.body.style.width = '100%';
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.width = '';
			document.body.style.overflow = '';
			window.scrollTo(0, scrollPosition);
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);

		if (isOpen) {
			trapFocus();
			if (bodyScrollLock) manageBodyScroll(true);
		}

		return () => {
			if (bodyScrollLock) manageBodyScroll(false);
		};
	});

	onDestroy(() => {
		document.removeEventListener('keydown', handleKeydown);

		if (bodyScrollLock) manageBodyScroll(false);
	});

	$effect(() => {
		if (isOpen) {
			if (dialogElement && !dialogElement.open) {
				dialogElement.showModal();
			}
			trapFocus();
			if (bodyScrollLock) manageBodyScroll(true);
		} else {
			if (dialogElement && dialogElement.open) {
				dialogElement.close();
			}
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
		class="modal-box relative {getSizeClass(size)} {fullHeight ? 'h-full' : ''} p-0"
		in:fade={{ duration: transitionDuration }}
		out:fade={{ duration: transitionDuration * 0.75 }}
	>
		{#if title || showCloseButton}
			<div class="sticky top-0 z-10 rounded-t-xl bg-base-100 px-4 py-4 lg:px-6 lg:pt-6">
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
