// Modal directive for enhancing the HTML dialog element
import type { Action } from 'svelte/action';

/**
 * Svelte action for enhancing the native dialog element with additional functionality
 */
export const enhancedModal: Action<HTMLDialogElement> = (node) => {
	// Handle click outside to close modal
	const handleClick = (event: MouseEvent) => {
		// If the click was on the backdrop (dialog itself, not its children)
		if (event.target === node) {
			node.close();
		}
	};

	// Handle escape key
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && node.open) {
			node.close();
		}
	};

	// A11y - trap focus inside modal
	const handleFocusTrap = (event: FocusEvent) => {
		if (!node.open) return;

		const focusableElements = node.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);

		if (focusableElements.length === 0) return;

		const firstElement = focusableElements[0] as HTMLElement;
		const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

		// Refocus if focus moves outside the dialog
		if (!node.contains(document.activeElement)) {
			firstElement.focus();
		}
	};

	// Set up initial state and listeners
	const initialize = () => {
		node.addEventListener('click', handleClick);
		document.addEventListener('keydown', handleKeydown);
		document.addEventListener('focusin', handleFocusTrap);
	};

	// Observe for modal-open class changes to focus first element when opened
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (
				mutation.type === 'attributes' &&
				mutation.attributeName === 'class' &&
				node.classList.contains('modal-open') &&
				node.open
			) {
				// Focus the first focusable element inside the modal
				setTimeout(() => {
					const focusable = node.querySelector(
						'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
					) as HTMLElement;
					if (focusable) focusable.focus();
				}, 50);
			}
		});
	});

	// Start observing
	observer.observe(node, { attributes: true });
	initialize();

	return {
		destroy() {
			observer.disconnect();
			node.removeEventListener('click', handleClick);
			document.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('focusin', handleFocusTrap);
		}
	};
};
