<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { currentLocale, changeLocale, initLocale } from '$lib/i18n';
	import { i18n } from '$lib/i18n';

	function handleLanguageChange(locale: string) {
		changeLocale(locale);
	}

	// Initialisierung nur im Browser
	onMount(() => {
		if (browser) {
			initLocale();
		}
	});
</script>

<footer
	class="fixed bottom-0 left-0 right-0 inline-block border-t border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8"
>
	<div
		class="flex items-center justify-center gap-1 text-center text-[10px] text-gray-500 lg:text-sm"
	>
		© <span>{new Date().getFullYear()}</span> Digital Pusher. {$i18n.footer.copyright}

		<!-- Vereinfachte Buttons ohne isInitialized-Abhängigkeit -->
		<button
			class="rounded-md px-2 py-1 text-sm {$currentLocale === 'de'
				? 'bg-primary-100 text-primary-800'
				: 'text-gray-600 hover:bg-gray-100'}"
			on:click={() => handleLanguageChange('de')}
			aria-pressed={$currentLocale === 'de'}
		>
			DE
		</button>
		<button
			class="rounded-md px-2 py-1 text-sm {$currentLocale === 'en'
				? 'bg-primary-100 text-primary-800'
				: 'text-gray-600 hover:bg-gray-100'}"
			on:click={() => handleLanguageChange('en')}
			aria-pressed={$currentLocale === 'en'}
		>
			EN
		</button>
	</div>
</footer>
