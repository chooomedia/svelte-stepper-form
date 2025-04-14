<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Stepper from '$lib/components/Stepper.svelte';
	import { currentStepIndex, stepperStore } from '$lib/stores/stepperStore';
	import { i18n, currentLocale, getTextDirection } from '$lib/i18n';
	import { FORM_STEPS } from '$lib/schema';
	import Footer from '$lib/components/Footer.svelte';

	const logoMain = '/logo-digitalpusher.svg';

	// Event handler for step change
	function handleStepChange(event: any) {
		const targetStep = event.detail.step;

		// Dispatch a global event to coordinate with page.svelte
		if (typeof window !== 'undefined') {
			window.dispatchEvent(
				new CustomEvent('navigateToStep', {
					detail: { step: targetStep }
				})
			);
		}
	}

	let isEmbedded = false;
	let isIframe = false;
	let parentFontFamily = 'Baron Neue';
	let textDirection = $state('ltr');

	// Track text direction based on locale
	$effect(() => {
		textDirection = getTextDirection();
	});

	onMount(() => {
		isIframe = window.self !== window.top;
		isEmbedded = isIframe;

		// If embedded, try to get font styles from parent
		if (isEmbedded) {
			try {
				// Create a messaging system to get styles from parent
				window.addEventListener('message', (event) => {
					if (event.data && event.data.type === 'FONT_FAMILY') {
						parentFontFamily = event.data.fontFamily;
						document.documentElement.style.setProperty('--parent-font-family', parentFontFamily);
					}
				});

				// Also handle resize requests from the form content
				window.addEventListener('resize', () => {
					// Send height to parent
					const height = document.body.scrollHeight;
					window.parent.postMessage({ type: 'RESIZE', height }, '*');
				});

				// Notify parent that we're ready to receive style info
				window.parent.postMessage({ type: 'READY_FOR_STYLES' }, '*');
			} catch (e) {
				console.warn('Could not communicate with parent frame', e);
			}
		}

		// Erweitertes Schema Markup
		const schemaMarkup = {
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'Organization',
					'@id': 'https://digitalpusher.de/#organization',
					name: 'Digital Pusher',
					url: 'https://digitalpusher.de',
					logo: `${logoMain}`,
					sameAs: [
						'https://www.facebook.com/digitalpusher',
						'https://www.instagram.com/digitalpusher',
						'https://www.linkedin.com/company/digitalpusher'
					],
					contactPoint: {
						'@type': 'ContactPoint',
						telephone: '+49 157 355 96 338',
						contactType: 'customer service',
						areaServed: 'DE',
						availableLanguage: ['German', 'English']
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
					'@id': 'https://digitalpusher.de/#webpage',
					url: $page.url.href,
					name: 'Digital Marketing Assessment | Digital Pusher',
					isPartOf: {
						'@id': 'https://digitalpusher.de/#website'
					},
					about: {
						'@id': 'https://digitalpusher.de/#organization'
					},
					primaryImageOfPage: {
						'@type': 'ImageObject',
						url: `${logoMain}`
					}
				}
			]
		};

		console.log('Layout mounted, initializing stepper with', FORM_STEPS.length, 'steps');

		// Listen for navigation events from the Stepper
		const handleNavigateToStep = (event: any) => {
			const targetStep = event.detail.step;
			stepperStore.goToStep(targetStep);
		};

		window.addEventListener('navigateToStep', handleNavigateToStep);

		return () => {
			window.removeEventListener('navigateToStep', handleNavigateToStep);
		};

		// Schema Markup hinzufügen
		const script = document.createElement('script');
		script.setAttribute('type', 'application/ld+json');
		script.innerHTML = JSON.stringify(schemaMarkup);
		document.head.appendChild(script);

		// Meta Description dynamisch aktualisieren
		const metaDesc = document.querySelector('meta[name="description"]');
		if (!metaDesc) {
			const meta = document.createElement('meta');
			meta.name = 'description';
			meta.content =
				'Ermittle Deine digitalen Marketing-Score und erhalte exklusive Tipps aus Deiner Branche für Dein Unternehmen mit Digital Pusher.';
			document.head.appendChild(meta);
		}
	});

	function navigateHome() {
		stepperStore.goToStep(1);
	}
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

<!-- Add dir attribute based on current text direction -->
<div class="rtl-wrapper" dir={textDirection}>
	<!-- Main content -->
	<main class="mx-auto flex min-h-screen max-w-screen-lg flex-col">
		<header itemscope itemtype="https://schema.org/WPHeader">
			<div class="mx-auto cursor-pointer px-4 py-2 sm:px-6 lg:px-8">
				<nav
					class="flex justify-center"
					itemscope
					itemtype="https://schema.org/SiteNavigationElement"
				>
					<div class="flex items-center">
						<a
							on:click={navigateHome}
							href="?home"
							class="flex items-center space-x-2"
							aria-label="Digital Pusher - Zur Startseite"
							itemprop="url"
						>
							<img src={logoMain} alt="Digital Pusher Logo" class="h-14 w-auto" itemprop="logo" />
							<span class="sr-only text-xl font-semibold text-gray-900" itemprop="name">
								Digital Pusher - {$i18n.meta.title}
							</span>
						</a>
					</div>
				</nav>

				<!-- Improved Stepper with proper store connections -->
				{#if $currentStepIndex > 1}
					<Stepper on:stepChange={handleStepChange} exclude={11} />
				{/if}
			</div>
			<!-- Breadcrumb Navigation für SEO -->
			<div class="p-lg-2 sr-only mx-auto mb-8 max-w-4xl">
				<nav aria-label="Breadcrumb" class="mb-4">
					<ol
						class="flex text-sm text-gray-500"
						itemscope
						itemtype="https://schema.org/BreadcrumbList"
					>
						<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
							<a href="/" itemprop="item" class="hover:text-gray-700">
								<span itemprop="name">Home</span>
							</a>
							<meta itemprop="position" content="1" />
						</li>
						<li class="mx-2">/</li>
						<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
							<span itemprop="name" class="text-gray-900">Marketing Assessment</span>
							<meta itemprop="position" content="2" />
						</li>
					</ol>
				</nav>
			</div>
		</header>

		<section
			class="w-full px-4 py-6 sm:px-6 lg:max-w-6xl lg:px-8"
			itemscope
			itemtype="https://schema.org/WebPageElement"
		>
			<slot />
		</section>

		{#if !isIframe}
			<Footer />
		{/if}
	</main>
</div>

<style lang="css">
	:global(:root) {
		--parent-font-family: inherit;
	}

	:global(body) {
		font-family: var(
			--parent-font-family,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif
		);
	}

	/* Add responsive adjustments for embedded mode */
	:global(.embedded) {
		padding: 0 !important;
		margin: 0 !important;
		background: transparent !important;
	}

	/* RTL-specific adjustments */
	:global([dir='rtl'] .icon-flip-rtl) {
		transform: scaleX(-1);
	}

	:global([dir='rtl'] .space-x-2 > :not([hidden]) ~ :not([hidden])) {
		--tw-space-x-reverse: 1;
	}

	:global([dir='rtl'] .space-x-4 > :not([hidden]) ~ :not([hidden])) {
		--tw-space-x-reverse: 1;
	}
</style>
