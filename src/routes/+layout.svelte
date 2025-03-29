<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Stepper from '$lib/components/Stepper.svelte';
	import { stepperStore } from '$lib/stores/stepperStore';
	import { FORM_STEPS } from '$lib/schema';

	const logoMain =
		'<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-auto" viewBox="0 0 1000 320" version="1.1"><path d="M 749 93 L 749 160 848.500 160 L 948 160 948 93 L 948 26 848.500 26 L 749 26 749 93 M 819 89.500 L 819 117 856.500 117 L 894 117 894 89.500 L 894 62 856.500 62 L 819 62 819 89.500 M 283 174.105 C 257.993 182.960, 249.775 215.775, 268 234 C 274.587 240.587, 282.837 243.745, 298.177 245.550 C 314.533 247.475, 319.864 267.387, 305.987 274.725 C 295.971 280.022, 282.538 275.425, 279.950 265.815 L 278.923 262 268.333 262 L 257.742 262 258.437 267.250 C 261.045 286.956, 276.952 298.827, 299.394 297.815 C 310.205 297.328, 317.284 294.545, 324.405 287.981 C 331.068 281.839, 334.274 274.605, 334.804 264.517 C 335.529 250.705, 330.808 239.539, 321.302 232.579 C 315.150 228.075, 309.546 226.138, 299.172 224.930 C 285.039 223.285, 279.590 218.766, 279.711 208.791 C 279.787 202.493, 282.520 198.020, 287.985 195.250 C 298.646 189.846, 311.595 194.726, 313.633 204.916 L 314.250 208 324.754 208 L 335.258 208 334.563 202.750 C 332.745 189.008, 324.037 178.657, 310.327 173.940 C 302.826 171.360, 290.544 171.434, 283 174.105 M 54.667 173.667 C 54.300 174.033, 54.003 178.646, 54.007 183.917 L 54.014 193.500 63.545 208.500 L 73.077 223.500 63.788 224 L 54.500 224.500 54.237 260.250 L 53.975 296 64.987 296 L 76 296 76 270.500 L 76 245 89.250 244.988 C 108.939 244.970, 119.957 241.291, 128.382 231.920 C 134.196 225.453, 136.431 218.892, 136.404 208.361 C 136.387 201.230, 135.984 199.409, 133.147 193.647 C 128.167 183.532, 119.386 177.459, 105.483 174.514 C 98.274 172.987, 56.050 172.283, 54.667 173.667 M 351 234.500 L 351 296 361.500 296 L 372 296 372 270.500 L 372 245 397 245 L 422 245 422 270.500 L 422 296 432.500 296 L 443 296 443 234.500 L 443 173 432.500 173 L 422 173 422 198.500 L 422 224 397 224 L 372 224 372 198.500 L 372 173 361.500 173 L 351 173 351 234.500 M 463.667 173.667 C 463.300 174.033, 463 201.708, 463 235.167 L 463 296 504.500 296 L 546 296 546 285.500 L 546 275 515.500 275 L 485 275 485 260 L 485 245 510.535 245 L 536.070 245 535.785 234.750 L 535.500 224.500 510.250 224.233 L 485 223.966 485 208.983 L 485 194 515.500 194 L 546 194 546 183.500 L 546 173 505.167 173 C 482.708 173, 464.033 173.300, 463.667 173.667 M 560 183.937 L 560 194.873 569 208.945 C 573.950 216.685, 578 223.239, 578 223.509 C 578 223.779, 573.950 224, 569 224 L 560 224 560 260 L 560 296 570.500 296 L 581 296 581 270.500 L 581 245 586.392 245 L 591.783 245 607.642 270.485 L 623.500 295.969 635.750 295.985 C 642.487 295.993, 648 295.812, 648 295.582 C 648 295.352, 640.800 283.657, 632 269.593 C 623.200 255.529, 616 243.834, 616 243.605 C 616 243.376, 618.813 241.866, 622.250 240.250 C 629.616 236.786, 635.888 230.827, 639.104 224.236 C 641.036 220.276, 641.422 217.860, 641.458 209.500 C 641.496 200.541, 641.211 198.911, 638.720 193.839 C 633.933 184.091, 626.062 178.469, 612.259 174.938 C 605.871 173.305, 601.170 173, 582.340 173 L 560 173 560 183.937 M 149.207 219.750 C 149.550 264.710, 149.596 265.599, 151.851 271.252 C 156.270 282.331, 164.602 290.298, 176.895 295.200 C 181.726 297.126, 184.365 297.435, 196 297.435 C 207.720 297.435, 210.256 297.134, 215.238 295.150 C 223.444 291.882, 229.877 287.255, 234.212 281.500 C 241.559 271.748, 241.412 272.927, 241.771 220.750 L 242.092 174 231.585 174 L 221.079 174 220.789 218.415 L 220.500 262.830 217.491 267.111 C 215.669 269.701, 212.522 272.399, 209.518 273.945 C 205.271 276.131, 203.249 276.499, 195.527 276.496 C 183.482 276.491, 177.250 273.266, 172.903 264.790 C 171.118 261.311, 171 258.371, 171 217.540 L 171 174 159.929 174 L 148.857 174 149.207 219.750 M 749 213.500 L 749 240 784 240 L 819 240 819 213.500 L 819 187 784 187 L 749 187 749 213.500 M 80.502 195.101 C 80.945 195.871, 85.149 202.704, 89.846 210.287 C 98.286 223.915, 98.420 224.067, 101.442 223.415 C 106.287 222.371, 111.824 219.198, 113.641 216.425 C 116.055 212.742, 115.959 205.780, 113.448 202.324 C 109.659 197.109, 103.256 194.819, 90.816 194.229 C 81.473 193.787, 79.826 193.926, 80.502 195.101 M 586.108 196.113 C 586.943 197.426, 591.198 204.263, 595.563 211.307 C 603.260 223.726, 603.589 224.096, 606.457 223.540 C 617.617 221.377, 623.594 212.269, 619.507 203.655 C 618.234 200.973, 616.376 199.352, 612.268 197.343 C 607.554 195.037, 605.113 194.572, 595.666 194.183 L 584.591 193.726 586.108 196.113" stroke="none" fill="#74d4dc" fill-rule="evenodd"/><path d="M 475.709 84.243 C 462.686 117.935, 451.751 146.287, 451.409 147.250 C 450.839 148.851, 451.758 149, 462.179 149 L 473.573 149 476.007 141.981 L 478.440 134.962 499.887 135.231 L 521.333 135.500 523.805 142.250 L 526.276 149 537.745 149 C 546.511 149, 549.100 148.705, 548.731 147.750 C 527.853 93.673, 500.658 24.305, 500.116 23.743 C 499.715 23.327, 488.732 50.552, 475.709 84.243 M 266 26.519 C 238.523 33.956, 220 58.794, 220 88.202 C 220 119.880, 236.314 142.661, 263.974 149.605 C 268.801 150.817, 273.382 151.113, 281.974 150.768 C 294.574 150.261, 298.997 148.984, 307.478 143.399 C 313.050 139.730, 313.960 140.129, 313.985 146.250 L 314 150 323.500 150 L 333 150 333 115 L 333 80 306 80 L 279 80 279 89 L 279 98 295.500 98 L 312 98 312 107.433 L 312 116.866 307.680 120.406 C 305.304 122.353, 300.692 125.195, 297.430 126.723 C 292.043 129.246, 290.492 129.496, 280.500 129.451 C 271.546 129.411, 268.450 128.987, 263.853 127.168 C 249.640 121.544, 241 106.891, 241 88.413 C 241 70.933, 249.592 56.428, 264 49.587 C 269.991 46.742, 271.322 46.501, 281 46.515 C 292.693 46.532, 297.019 47.908, 305.920 54.441 L 310.642 57.907 318.040 50.460 L 325.438 43.012 321.969 40.011 C 316.414 35.206, 308.007 30.353, 301 27.907 C 292.628 24.984, 274.349 24.260, 266 26.519 M 72 87.491 L 72 149.202 92.750 148.753 C 109.798 148.383, 114.891 147.924, 121.296 146.181 C 144.881 139.760, 159.078 125.609, 163.616 104 C 166.027 92.514, 165.101 73.929, 161.596 63.500 C 155.470 45.274, 143.479 34.527, 122.910 28.831 C 116.857 27.155, 111.516 26.687, 93.750 26.279 L 72 25.780 72 87.491 M 182 87.500 L 182 149 192.500 149 L 203 149 203 87.500 L 203 26 192.500 26 L 182 26 182 87.500 M 352 87.500 L 352 149 362.500 149 L 373 149 373 87.500 L 373 26 362.500 26 L 352 26 352 87.500 M 383 35.500 L 383 45 396 45 L 409 45 409 97 L 409 149 419.500 149 L 430 149 430 97 L 430 45 443 45 L 456 45 456 35.500 L 456 26 419.500 26 L 383 26 383 35.500 M 555 87.500 L 555 149 588.500 149 L 622 149 622 138.500 L 622 128 599.500 128 L 577 128 577 77 L 577 26 566 26 L 555 26 555 87.500 M 94 87.500 L 94 129 99.750 128.983 C 111.905 128.946, 124.246 124.905, 131.706 118.519 C 147.370 105.112, 147.851 71.256, 132.577 57.178 C 124.623 49.846, 113.781 46.043, 100.750 46.015 L 94 46 94 87.500 M 819 89.500 L 819 117 856.500 117 L 894 117 894 89.500 L 894 62 856.500 62 L 819 62 819 89.500 M 492.633 96.198 C 488.969 106.814, 485.978 115.838, 485.986 116.250 C 486 116.994, 514 117.356, 514 116.613 C 514 115.492, 500.702 78.378, 500.056 77.698 C 499.638 77.256, 496.297 85.581, 492.633 96.198 M 694 228 L 694 296 794 296 L 894 296 894 228 L 894 160 794 160 L 694 160 694 228 M 749 213.5 L 749 240 784 240 L 819 240 819 213.5 L 819 187 784 187 L 749 187 749 213.5" stroke="none" fill="currentColor" fill-rule="evenodd"/></svg>';

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
	<title>Digital Marketing Assessment | Digital Pusher</title>
	<meta
		name="description"
		content="Ermittle Deine digitalen Marketing-Score und erhalte exklusive Tipps aus Deiner Branche für Dein Unternehmen mit Digital Pusher."
	/>
	<meta property="og:title" content="Digital Marketing Assessment | Digital Pusher" />
	<meta
		property="og:description"
		content="Ermittle Deine digitalen Marketing-Score und erhalte exklusive Tipps aus Deiner Branche für Dein Unternehmen mit Digital Pusher."
	/>
	<meta property="og:image" content="https://digitalpusher.de/og-image.jpg" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href={$page.url.href} />
	<meta name="robots" content="index, follow" />
	<meta name="language" content="de" />
	<link rel="alternate" hreflang="de" href={$page.url.href} />
</svelte:head>

<!-- Layout HTML remains largely unchanged, but with improved Stepper integration -->
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
						on:click={navigateHome}
						href="?home"
						class="flex items-center space-x-2"
						aria-label="Digital Pusher - Zur Startseite"
						itemprop="url"
					>
						<span itemprop="logo">{@html logoMain}</span>
						<span class="sr-only text-xl font-semibold text-gray-900" itemprop="name">
							Digital Pusher - Digitales Marketing Assessment
						</span>
					</a>
				</div>
			</nav>

			<!-- Improved Stepper with proper store connections -->
			{#if $stepperStore.current.index > 1}
				<Stepper on:stepChange={handleStepChange} />
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
		class="px-4 py-6 sm:px-6 lg:px-8"
		style="height: calc(100vh - 102px);"
		itemscope
		itemtype="https://schema.org/WebPageElement"
	>
		<div class="relative w-full lg:max-w-6xl">
			<slot />
		</div>
	</section>

	{#if !isIframe}
		<footer
			class="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white"
			itemscope
			itemtype="https://schema.org/WPFooter"
		>
			<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
				<div class="text-center text-sm text-gray-500">
					© {new Date().getFullYear()} Digital Pusher. Alle Rechte vorbehalten.
				</div>
			</div>
		</footer>
	{/if}
</main>

<style>
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

	:global(body) {
		transition: height 0.3s ease;
	}
</style>
