<!-- src/lib/components/RtlHandler.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { currentLocale } from '$lib/i18n';

	// RTL languages list
	const rtlLanguages = ['ar'];

	// Set document direction based on language
	function updateDirection(locale: string) {
		if (typeof document !== 'undefined') {
			const isRtl = rtlLanguages.includes(locale);
			document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
			document.documentElement.lang = locale;

			// Add or remove RTL class for additional styling
			if (isRtl) {
				document.documentElement.classList.add('rtl');
			} else {
				document.documentElement.classList.remove('rtl');
			}
		}
	}

	// Update direction when the locale changes
	$: if ($currentLocale) {
		updateDirection($currentLocale);
	}

	onMount(() => {
		updateDirection($currentLocale);
	});

	onDestroy(() => {
		// Reset to LTR on component destroy (if needed)
		if (typeof document !== 'undefined') {
			document.documentElement.dir = 'ltr';
			document.documentElement.classList.remove('rtl');
		}
	});
</script>

<slot />
