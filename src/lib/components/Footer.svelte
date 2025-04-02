<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { initLocale } from '$lib/i18n';
	import { i18n } from '$lib/i18n';

	// Ensure that the currentLocale store is writable and initialized correctly
	const currentLocale = writable('de'); // default language as 'de'

	function changeLanguage(locale: string) {
		console.log('Changing language to:', locale); // Debug log
		currentLocale.set(locale);
	}

	onMount(() => {
		initLocale();
	});
</script>

<footer
	class="fixed bottom-0 left-0 right-0 inline-block border-t border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8"
	itemscope
	itemtype="https://schema.org/WPFooter"
>
	<div
		class="flex items-center justify-center gap-1 text-center text-[10px] text-gray-500 lg:text-sm"
	>
		© <span itemprop="copyrightYear">{new Date().getFullYear()}</span> Digital Pusher. {$i18n
			.footer.copyright}

		<button
			class="rounded-md px-2 py-1 text-sm {$currentLocale === 'de'
				? 'bg-primary-100 text-primary-800'
				: 'text-gray-600 hover:bg-gray-100'}"
			on:click={() => changeLanguage('de')}
		>
			DE
		</button>
		<button
			class="rounded-md px-2 py-1 text-sm {$currentLocale === 'en'
				? 'bg-primary-100 text-primary-800'
				: 'text-gray-600 hover:bg-gray-100'}"
			on:click={() => changeLanguage('en')}
		>
			EN
		</button>
		<button
			class="rounded-md px-2 py-1 text-sm {$currentLocale === 'ru'
				? 'bg-primary-100 text-primary-800'
				: 'text-gray-600 hover:bg-gray-100'}"
			on:click={() => changeLanguage('ru')}
		>
			RU
		</button>
		<button
			class="rounded-md px-2 py-1 text-sm {$currentLocale === 'ar'
				? 'bg-primary-100 text-primary-800'
				: 'text-gray-600 hover:bg-gray-100'}"
			on:click={() => changeLanguage('ar')}
		>
			AR
		</button>
	</div>
</footer>
