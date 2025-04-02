<!-- src/routes/+layout.svelte - Improved version -->
<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import Stepper from '$lib/components/Stepper.svelte';
	import { stepperStore } from '$lib/stores/stepperStore';
	import { i18n, currentLocale, initLocale } from '$lib/i18n';
	import { TOTAL_STEPS } from '$lib/schema';
	import Footer from '$lib/components/Footer.svelte';
	import { ModalController } from '$lib/components/modal';

	// Company logo SVG
	const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-auto" viewBox="0 0 1000 320"><!-- SVG content --></svg>`;

	// Handle step change events
	function handleStepChange(event: CustomEvent<{ step: number }>) {
		const targetStep = event.detail.step;
		jumpToStep(targetStep);
	}

	// Jump to specific step
	function jumpToStep(step: number) {
		if (step >= 1 && step <= TOTAL_STEPS) {
			stepperStore.goToStep(step);

			// Dispatch event for page component
			if (browser) {
				window.dispatchEvent(
					new CustomEvent('navigateToStep', {
						detail: { step }
					})
				);
			}
		}
	}

	// Navigate to home/first step
	function navigateHome() {
		stepperStore.goToStep(1);
	}

	// Add Schema.org markup for SEO
	function addSchemaMarkup() {
		if (!browser) return;

		const schemaMarkup = {
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'Organization',
					'@id': 'https://digitalpusher.de/#organization',
					name: 'Digital Pusher',
					url: 'https://digitalpusher.de',
					logo: {
						'@type': 'ImageObject',
						url: 'https://digitalpusher.de/logo.png'
					}
				},
				{
					'@type': 'WebSite',
					'@id': 'https://digitalpusher.de/#website',
					url: 'https://digitalpusher.de',
					name: 'Digital Pusher',
					publisher: {
						'@id': 'https://digitalpusher.de/#organization'
					}
				},
				{
					'@type': 'WebPage',
					'@id': `${$page.url.href}/#webpage`,
					url: $page.url.href,
					name: `${$i18n.meta.title} | Digital Pusher`,
					isPartOf: {
						'@id': 'https://digitalpusher.de/#website'
					},
					about: {
						'@id': 'https://digitalpusher.de/#organization'
					}
				}
			]
		};

		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.text = JSON.stringify(schemaMarkup);
		document.head.appendChild(script);
	}

	// Initialize language and add schema markup
	onMount(() => {
		if (browser) {
			initLocale();
			addSchemaMarkup();

			// Event listener for step navigation
			const handleNavigateToStep = (event: CustomEvent<{ step: number }>) => {
				const targetStep = event.detail.step;
				stepperStore.goToStep(targetStep);
			};

			window.addEventListener('navigateToStep', handleNavigateToStep as EventListener);

			return () => {
				window.removeEventListener('navigateToStep', handleNavigateToStep as EventListener);
			};
		}
	});

	// Is this an embedded version?
	const isEmbedded = browser && window.self !== window.top;
</script>

<svelte:head>
	<title>{$i18n.meta.title} | Digital Pusher</title>
	<meta name="description" content={$i18n.meta.description} />
	<meta property="og:title" content={$i18n.meta.title} />
	<meta property="og:description" content={$i18n.meta.description} />
	<meta property="og:image" content="https://digitalpusher.de/og-image.jpg" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href={$page.url.href} />
	<meta name="robots" content="index, follow" />
	<meta name="language" content={$currentLocale} />
	<link rel="alternate" hreflang={$currentLocale} href={$page.url.href} />
</svelte:head>

<main class="mx-auto flex min-h-screen max-w-screen-lg flex-col">
	<header class="bg-transparent" itemscope itemtype="https://schema.org/WPHeader">
		<div class="mx-auto px-4 py-2 sm:px-6 lg:px-8">
			<nav
				class="flex justify-center"
				itemscope
				itemtype="https://schema.org/SiteNavigationElement"
			>
				<div class="flex items-center">
					<a
						on:click|preventDefault={navigateHome}
						href="/"
						class="flex items-center space-x-2"
						aria-label="Digital Pusher - Zur Startseite"
						itemprop="url"
					>
						<span itemprop="logo">{@html logoSvg}</span>
						<span class="sr-only text-xl font-semibold text-gray-900" itemprop="name">
							Digital Pusher - {$i18n.meta.title}
						</span>
					</a>
				</div>
			</nav>

			<!-- Step Progress Indicator -->
			{#if $stepperStore.current.index > 1}
				<Stepper on:stepChange={handleStepChange} />
			{/if}
		</div>

		<!-- SEO Breadcrumb (visible only to search engines) -->
		<div class="sr-only mx-auto mb-8 max-w-4xl">
			<nav aria-label="Breadcrumb">
				<ol
					class="flex text-sm text-gray-500"
					itemscope
					itemtype="https://schema.org/BreadcrumbList"
				>
					<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
						<a href="/" itemprop="item"><span itemprop="name">Home</span></a>
						<meta itemprop="position" content="1" />
					</li>
					<li class="mx-2">/</li>
					<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
						<span itemprop="name">{$i18n.meta.breadcrumb}</span>
						<meta itemprop="position" content="2" />
					</li>
				</ol>
			</nav>
		</div>
	</header>

	<section
		class="px-4 py-6 sm:px-6 lg:px-8"
		style="min-height: calc(100vh - 130px);"
		itemscope
		itemtype="https://schema.org/WebPageElement"
	>
		<div class="mx-auto w-full lg:max-w-6xl">
			<slot />
		</div>
	</section>

	{#if !isEmbedded}
		<Footer />
	{/if}
</main>

<!-- Global Modal Controller -->
<ModalController />

<style>
	:global(:root) {
		--parent-font-family:
			system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}

	:global(body) {
		font-family: var(--parent-font-family);
		transition: height 0.3s ease;
	}

	/* Special styles for embedded mode */
	:global(.embedded) {
		padding: 0 !important;
		margin: 0 !important;
		background: transparent !important;
	}
</style>
