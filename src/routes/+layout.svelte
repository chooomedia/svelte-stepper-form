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

	// RTL/LTR Support - reaktive Textrichtung
	let textDirection = $derived(getTextDirection());
	let currentLang = $derived($currentLocale);

	// Track text direction based on locale - nur html element
	$effect(() => {
		textDirection = getTextDirection();
		currentLang = $currentLocale;

		// Update document attributes for A11y - nur html element
		if (typeof document !== 'undefined') {
			document.documentElement.lang = currentLang;
			document.documentElement.dir = textDirection;
		}
	});

	onMount(() => {
		isIframe = window.self !== window.top;
		isEmbedded = isIframe;

		// Remove automatically added classes from head elements
		const removeHeadClasses = () => {
			const headElements = document.head.querySelectorAll('link, meta, title');
			headElements.forEach((element) => {
				if (element.classList && element.classList.length > 0) {
					element.removeAttribute('class');
				}
			});
		};

		// Remove classes immediately
		removeHeadClasses();

		// Set up mutation observer to remove classes from new head elements
		let observer: MutationObserver | null = null;
		let interval: ReturnType<typeof setInterval> | null = null;

		if (typeof MutationObserver !== 'undefined') {
			observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.type === 'childList') {
						mutation.addedNodes.forEach((node) => {
							if (node.nodeType === Node.ELEMENT_NODE) {
								const element = node as Element;
								if (element.classList && element.classList.length > 0) {
									element.removeAttribute('class');
								}
							}
						});
					}
				});
			});

			observer.observe(document.head, {
				childList: true,
				subtree: true
			});
		} else {
			// Fallback: periodically check for new head elements
			interval = setInterval(removeHeadClasses, 1000);
		}

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

		// Schema Markup hinzufügen
		const script = document.createElement('script');
		script.setAttribute('type', 'application/ld+json');
		script.innerHTML = JSON.stringify(schemaMarkup);
		document.head.appendChild(script);

		return () => {
			window.removeEventListener('navigateToStep', handleNavigateToStep);
			if (observer) {
				observer.disconnect();
			}
			if (interval) {
				clearInterval(interval);
			}
		};
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
	<link rel="alternate" hreflang={currentLang} href={$page.url.href} />
	<!-- A11y Meta Tags -->
	<meta name="theme-color" content="#1f2937" />
	<meta name="color-scheme" content="light dark" />
</svelte:head>

<!-- RTL/LTR Support mit HTML-Attributen - E-E-A-T und A11y Best Practices -->
<div dir={textDirection} role="main" aria-label={$i18n.meta.title}>
	<!-- Main content -->
	<main
		class="mx-auto flex min-h-screen max-w-screen-lg flex-col"
		role="main"
		aria-label="Hauptinhalt"
	>
		<header itemscope itemtype="https://schema.org/WPHeader" role="banner">
			<div class="mx-auto cursor-pointer px-4 py-2 sm:px-6 lg:px-8">
				<nav
					class="flex justify-center"
					itemscope
					itemtype="https://schema.org/SiteNavigationElement"
					role="navigation"
					aria-label="Hauptnavigation"
				>
					<div class="flex items-center">
						<a
							on:click={navigateHome}
							href="?home"
							class="flex items-center space-x-2"
							aria-label="Digital Pusher - Zur Startseite"
							itemprop="url"
							role="link"
						>
							<img
								src={logoMain}
								alt="Digital Pusher Logo"
								class="h-14 w-auto"
								itemprop="logo"
								role="img"
								aria-label="Digital Pusher Logo"
							/>
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
				<nav aria-label="Breadcrumb" class="mb-4" role="navigation">
					<ol
						class="flex text-sm text-gray-500"
						itemscope
						itemtype="https://schema.org/BreadcrumbList"
						role="list"
					>
						<li
							itemprop="itemListElement"
							itemscope
							itemtype="https://schema.org/ListItem"
							role="listitem"
						>
							<a href="/" itemprop="item" class="hover:text-gray-700" role="link">
								<span itemprop="name">Home</span>
							</a>
							<meta itemprop="position" content="1" />
						</li>
						<li class="mx-2" aria-hidden="true">/</li>
						<li
							itemprop="itemListElement"
							itemscope
							itemtype="https://schema.org/ListItem"
							role="listitem"
						>
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
			role="region"
			aria-label="Hauptinhalt"
		>
			<slot />
		</section>

		{#if !isIframe && $currentStepIndex === 1}
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

	/* RTL-specific adjustments - E-E-A-T und A11y Best Practices */
	[dir='rtl'] .icon-flip-rtl {
		transform: scaleX(-1);
	}

	[dir='rtl'] .space-x-2 > :not([hidden]) ~ :not([hidden]) {
		--tw-space-x-reverse: 1;
	}

	[dir='rtl'] .space-x-4 > :not([hidden]) ~ :not([hidden]) {
		--tw-space-x-reverse: 1;
	}

	/* A11y Verbesserungen für RTL */
	[dir='rtl'] [role='navigation'] {
		direction: rtl;
	}

	[dir='rtl'] [role='list'] {
		direction: rtl;
	}

	/* E-E-A-T Best Practices - Semantische Struktur */
	[dir='rtl'] h1,
	[dir='rtl'] h2,
	[dir='rtl'] h3,
	[dir='rtl'] h4,
	[dir='rtl'] h5,
	[dir='rtl'] h6 {
		text-align: right;
	}

	[dir='rtl'] p {
		text-align: right;
	}
</style>
