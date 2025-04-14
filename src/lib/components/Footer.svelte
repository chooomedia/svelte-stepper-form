<!-- src/lib/components/Footer.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { currentLocale, changeLocale, initLocale } from '$lib/i18n';
	import { i18n } from '$lib/i18n';
	import { translations } from '$lib/i18n';

	// Dynamically get supported languages from translations object
	const supportedLanguages = Object.keys(translations).map((code) => {
		// Get native language name based on code
		const nativeNames = {
			de: 'Deutsch',
			en: 'English',
			ar: 'العربية' // Arabic
		};

		return {
			code,
			label: nativeNames[code] || code.toUpperCase()
		};
	});

	function handleLanguageChange(locale: string) {
		changeLocale(locale);
	}

	// Initialize i18n on mount (browser-only)
	onMount(() => {
		if (browser) {
			initLocale();
		}
	});
</script>

<footer
	class="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8"
>
	<div class="flex items-center justify-center">
		<div class="text-center text-xs text-gray-500 lg:text-sm">
			© {new Date().getFullYear()} Digital Pusher. {$i18n.footer.copyright}
		</div>

		<div class="ml-4 flex space-x-1">
			{#each supportedLanguages as lang}
				<button
					class="rounded-md px-2 py-1 text-xs {$currentLocale === lang.code
						? 'bg-primary-100 text-primary-800'
						: 'text-gray-600 hover:bg-gray-100'}"
					on:click={() => handleLanguageChange(lang.code)}
					aria-pressed={$currentLocale === lang.code}
					aria-label={`Switch to ${lang.label}`}
				>
					{lang.code.toUpperCase()}
				</button>
			{/each}
		</div>
	</div>
</footer>
