<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	// Logo URL als Variable für einfache Änderung
	const logoUrl = '/path-to-your-logo.svg'; // Anpassen

	// Prüfen ob wir uns im iframe befinden
	$: isIframe = typeof window !== 'undefined' && window.self !== window.top;
</script>

<svelte:head>
	<title>Digital Marketing Assessment | Digital Pusher</title>
	<meta
		name="description"
		content="Ermitteln Sie Ihren digitalen Marketing-Score und erhalten Sie personalisierte Empfehlungen für Ihr Unternehmen."
	/>
</svelte:head>

<div class="flex min-h-screen flex-col bg-gray-50">
	{#if !isIframe}
		<!-- Header nur anzeigen, wenn nicht im iframe -->
		<header class="bg-white shadow-sm">
			<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<a href="/" class="flex items-center space-x-2">
							<img src={logoUrl} alt="Logo" class="h-8 w-auto" />
							<span class="text-xl font-semibold text-gray-900">Digital Pusher</span>
						</a>
					</div>
					<!-- Optional: Weitere Header-Elemente -->
				</div>
			</div>
		</header>
	{/if}

	<!-- Hauptcontainer mit bedingter Padding-Anpassung -->
	<main class="flex flex-1 flex-col {isIframe ? 'py-0' : 'py-8'}">
		<div class="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
			<slot />
		</div>
	</main>

	{#if !isIframe}
		<!-- Footer nur anzeigen, wenn nicht im iframe -->
		<footer class="border-t border-gray-200 bg-white">
			<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
				<div class="text-center text-sm text-gray-500">
					© {new Date().getFullYear()} Digital Pusher. Alle Rechte vorbehalten.
				</div>
			</div>
		</footer>
	{/if}
</div>
