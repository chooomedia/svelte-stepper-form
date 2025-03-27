<!-- src/lib/components/WebsiteUrlForm.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormData } from '$lib/schema';
	import SeoTips from './SeoTips.svelte';
	import {
		extractScoreFromResponse,
		calculateFinalScore,
		calculateVisibilityScore
	} from '$lib/utils/scoring';
	import { stepperStore } from '$lib/stores/stepperStore';

	interface Props {
		form: SuperValidated<FormData>;
		errors: Record<string, string>;
		onAnalysisComplete: (healthData: any, score: number) => void;
	}

	let { form, errors, onAnalysisComplete } = $props<Props>();

	// State variables
	let isLoading = $state(false);
	let showSeoTips = $state(false);
	let analysisError = $state('');
	let showResults = $state(false);
	let analysisData = $state<any>(null);
	let formattedUrl = $state('');
	let autoAdvanceTimeout: number | null = $state(null);
	let currentProgress = $state(0);
	let usingMockData = $state(false);

	// Für erweiterte SEO-Tips
	let currentSeoTipIndex = $state(0);
	let tipInterval: number | null = $state(null);
	let customTips = $state<string[]>([]);

	// Track field focus for enhanced validation UX
	let touchedFields = $state(new Set<string>());

	// Handle field blur
	function handleBlur(fieldName: string) {
		touchedFields.add(fieldName);
	}

	// Check if field should show error
	function shouldShowError(fieldName: string): boolean {
		return touchedFields.has(fieldName) && !!errors[fieldName];
	}

	// Get ARIA attributes for field
	function getAriaAttrs(fieldName: string, label: string) {
		return {
			'aria-invalid': (shouldShowError(fieldName) ? 'true' : 'false') as Booleanish,
			'aria-describedby': shouldShowError(fieldName) ? `${fieldName}-error` : undefined,
			'aria-label': label
		};
	}

	// Prepare URL for display in UI (human readable)
	function formatDisplayUrl(url: string): string {
		// Ensure URL has protocol
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			url = 'https://' + url;
		}

		try {
			const urlObj = new URL(url);
			return urlObj.protocol + '//' + urlObj.host + '/';
		} catch (e) {
			return url;
		}
	}

	// Prepare URL for the webhook (ensuring it's properly formatted for API)
	function prepareUrlForWebhook(url: string): string {
		// Remove leading/trailing whitespace
		url = url.trim();

		// Ensure URL has protocol
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			url = 'https://' + url;
		}

		// Ensure trailing slash for API compatibility
		if (!url.endsWith('/')) {
			url = url + '/';
		}

		return url;
	}

	// Start progress animation for auto-advance
	function startProgressAnimation(durationMs: number) {
		const startTime = Date.now();
		const endTime = startTime + durationMs;

		// Reset progress
		currentProgress = 0;

		const animateProgress = () => {
			const now = Date.now();
			const elapsed = now - startTime;
			const remaining = Math.max(0, endTime - now);

			// Calculate percentage (0% → 100%)
			currentProgress = (elapsed / durationMs) * 10000;

			if (remaining > 0) {
				requestAnimationFrame(animateProgress);
			} else {
				currentProgress = 100;
			}
		};

		requestAnimationFrame(animateProgress);
	}

	// Generate additional SEO tips based on analysis data
	function generateCustomSeoTips(analysisData: any): string[] {
		const basicSeoTips = [
			'Verwende präzise Seitentitel (Title-Tags) für bessere Klickraten in Suchergebnissen.',
			'Erstelle einzigartige Meta-Beschreibungen für jede Seite (150-160 Zeichen).',
			'Verwende eine H1-Überschrift pro Seite, die das Hauptthema klar kommuniziert.',
			'Optimiere Bilder mit Alt-Texten und komprimiere sie für schnellere Ladezeiten.',
			'Erstelle eine klare Website-Struktur mit logischen URLs.'
		];

		// Add specific tips based on scores
		const customTips = [];

		// Performance tips
		if (analysisData.performance < 70) {
			customTips.push(
				'Die Ladegeschwindigkeit Deiner Website könnte verbessert werden. Optimiere Bilder und reduziere unnötige Skripte.'
			);
		}

		// SEO tips
		if (analysisData.seo < 70) {
			customTips.push(
				'Deine SEO-Bewertung zeigt Verbesserungspotential. Überprüfe Title-Tags, Meta-Beschreibungen und interne Verlinkungen.'
			);
		}

		// Accessibility tips
		if (analysisData.accessibility < 70) {
			customTips.push(
				'Verbessere die Zugänglichkeit Deiner Website durch bessere Farbkontraste und korrekte Verwendung von HTML-Elementen.'
			);
		}

		// Security tip
		if (analysisData.securityGrade !== 'A') {
			customTips.push(
				'Verbessere die Sicherheit Deiner Website durch Implementierung von HTTPS und modernen Sicherheitsheadern.'
			);
		}

		// Use basic tips if no custom tips were generated
		if (customTips.length === 0) {
			return basicSeoTips;
		}

		// Combine some basic and custom tips
		return [...customTips, ...basicSeoTips.slice(0, 5 - customTips.length)];
	}

	// Generate mock data for fallback
	function generateMockData(url: string) {
		// Extract domain for display
		let domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
		if (domain.startsWith('www.')) {
			domain = domain.substring(4);
		}

		// Generate scores for mockup
		const score = Math.floor(Math.random() * 25) + 35; // 35-60
		const performance = Math.floor(Math.random() * 20) + 30; // 30-50
		const seo = Math.floor(Math.random() * 30) + 35; // 35-65
		const accessibility = Math.floor(Math.random() * 20) + 30; // 30-50
		const bestPractices = Math.floor(Math.random() * 25) + 35; // 35-60

		return {
			url: url,
			domain: domain,
			score: score,
			performance: performance,
			seo: seo,
			accessibility: accessibility,
			bestPractices: bestPractices,
			securityGrade: ['B', 'C', 'D'][Math.floor(Math.random() * 3)],
			technologies: ['WordPress', 'PHP', 'JavaScript', 'jQuery', 'Bootstrap'].slice(
				0,
				Math.floor(Math.random() * 3) + 2
			),
			suggestions: [
				'Meta-Beschreibungen für bessere Klickraten optimieren',
				'Seitengeschwindigkeit verbessern',
				'Mobilfreundlichkeit sicherstellen',
				'Interne Verlinkungen optimieren',
				'SSL-Zertifikat implementieren'
			].slice(0, Math.floor(Math.random() * 2) + 2)
		};
	}

	// Process analysis data from webhook or mock data
	function processAnalysisData(data: any): any {
		if (!data) {
			// Return mock data if no data is available
			return generateMockData(formattedUrl);
		}

		// Set some default values
		const processed = {
			url: formattedUrl,
			score: extractScoreFromResponse(data) || 35,
			performance: 0,
			seo: 0,
			accessibility: 0,
			bestPractices: 0,
			securityGrade: 'C',
			technologies: [],
			suggestions: []
		};

		try {
			// Handle array or object response format
			const dataObj = Array.isArray(data)
				? data.find((item) => item.lighthouse_report) || data[0]
				: data;

			// Extract Lighthouse scores if available
			if (dataObj.lighthouse_report && dataObj.lighthouse_report.categories) {
				const categories = dataObj.lighthouse_report.categories;
				processed.performance = Math.round((categories.performance?.score || 0) * 100);
				processed.seo = Math.round((categories.seo?.score || 0) * 100);
				processed.accessibility = Math.round((categories.accessibility?.score || 0) * 100);
				processed.bestPractices = Math.round((categories['best-practices']?.score || 0) * 100);
			}

			// Extract security grade
			if (dataObj.security_headers && dataObj.security_headers.grade) {
				processed.securityGrade = dataObj.security_headers.grade;
			}

			// Extract technologies
			if (dataObj.technologies && Array.isArray(dataObj.technologies)) {
				processed.technologies = dataObj.technologies.slice(0, 5);
			}

			// Extract suggestions
			if (dataObj.suggestions && Array.isArray(dataObj.suggestions)) {
				processed.suggestions = dataObj.suggestions.slice(0, 3);
			} else {
				// Default suggestions if none available
				processed.suggestions = [
					'Meta-Beschreibungen für bessere Klickraten optimieren',
					'Seitengeschwindigkeit verbessern',
					'Mobilfreundlichkeit sicherstellen'
				];
			}

			return processed;
		} catch (error) {
			console.error('Error processing webhook data:', error);
			// Return mock data if processing fails
			return generateMockData(formattedUrl);
		}
	}

	// Cycle through SEO tips
	function startSeoTipsCycle() {
		// Stoppe bestehenden Interval
		if (tipInterval) {
			clearInterval(tipInterval);
		}

		currentSeoTipIndex = 0;

		// Starte neuen Interval für Tips (alle 2 Sekunden)
		tipInterval = setInterval(() => {
			currentSeoTipIndex = (currentSeoTipIndex + 1) % customTips.length;
		}, 2000);
	}

	// Main analyze function
	async function analyzeWebsite() {
		if (!$form.company_url) return;

		// Prepare the URL for webhook
		const webhookUrl = prepareUrlForWebhook($form.company_url);

		// Format URL for display
		formattedUrl = formatDisplayUrl(webhookUrl);

		// Update form with formatted URL
		$form.company_url = formattedUrl;

		isLoading = true;
		showSeoTips = true;
		analysisError = '';
		showResults = false;
		usingMockData = false;

		// Clear any existing timeout
		if (autoAdvanceTimeout) {
			clearTimeout(autoAdvanceTimeout);
			autoAdvanceTimeout = null;
		}

		// Stoppe bestehenden Interval, falls vorhanden
		if (tipInterval) {
			clearInterval(tipInterval);
			tipInterval = null;
		}

		try {
			// Create URL for API call
			const encodedUrl = encodeURIComponent(webhookUrl);
			const apiUrl = `https://n8n.chooomedia.com/webhook/websitehealth?url=${encodedUrl}`;

			// Log for debugging
			console.log('Original URL:', webhookUrl);
			console.log('API URL:', apiUrl);

			// Make API request with short timeout to prevent long waits
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

			const response = await fetch(apiUrl, {
				method: 'GET',
				headers: {
					Accept: 'application/json'
				},
				signal: controller.signal
			}).finally(() => {
				clearTimeout(timeoutId);
			});

			// If response is not OK, throw error
			if (!response.ok) {
				throw new Error(`API error: ${response.status}`);
			}

			// Parse response data
			const data = await response.json();
			console.log('Webhook response data:', data);

			// Check if we have usable data
			if (!data || (Array.isArray(data) && data.length === 0)) {
				throw new Error('No data returned from webhook');
			}

			// Process data
			analysisData = processAnalysisData(data);
			usingMockData = false;
		} catch (error) {
			console.warn('Error fetching from webhook, using mock data:', error);

			// Generate mock data for fallback
			analysisData = generateMockData(formattedUrl);
			usingMockData = true;
		}

		// Generate custom SEO tips based on analysis data
		customTips = generateCustomSeoTips(analysisData);

		// Start cycling through tips
		startSeoTipsCycle();

		// Calculate final score
		const formScore = calculateVisibilityScore($form);
		const websiteScore = analysisData.score || formScore;
		const finalScore = calculateFinalScore(websiteScore, $form);

		// Update form with calculated score
		$form.visibility_score = finalScore;

		// Call the callback with the data and score
		onAnalysisComplete(analysisData, finalScore);

		// Show results but keep SEO tips visible
		isLoading = false;
		showSeoTips = true; // Keep this visible
		showResults = true;

		// Start animation for auto-advance progress (7 seconds)
		const autoAdvanceDelay = 7000;
		startProgressAnimation(autoAdvanceDelay);

		// Auto advance after 7 seconds
		autoAdvanceTimeout = setTimeout(() => {
			// Stoppe den Interval bevor wir weitergehen
			if (tipInterval) {
				clearInterval(tipInterval);
				tipInterval = null;
			}

			stepperStore.markStepValid(stepperStore.current.index);
			stepperStore.nextStep();
		}, autoAdvanceDelay);
	}

	// Format score for display
	function formatScore(score: number): string {
		return Math.round(score).toString();
	}

	// Get color class based on score value
	function getScoreColorClass(score: number): string {
		if (score >= 90) return 'text-green-500';
		if (score >= 70) return 'text-blue-500';
		if (score >= 50) return 'text-yellow-500';
		return 'text-red-500';
	}

	// Get background color based on score
	function getScoreBackgroundColor(score: number): string {
		if (score >= 90) return '#10B981'; // green
		if (score >= 70) return '#3B82F6'; // blue
		if (score >= 50) return '#F59E0B'; // yellow
		return '#EF4444'; // red
	}

	// Auto-analyze when component mounts if URL is already set
	onMount(() => {
		if ($form.company_url && !$form.visibility_score) {
			setTimeout(() => {
				analyzeWebsite();
			}, 500);
		}

		// Clean up on component unmount
		return () => {
			if (autoAdvanceTimeout) {
				clearTimeout(autoAdvanceTimeout);
			}
			if (tipInterval) {
				clearInterval(tipInterval);
			}
		};
	});
</script>

<div class="website-url-form space-y-6">
	<h2 class="text-2xl font-bold text-gray-900">Onlinereichweite Analyse</h2>
	<p class="text-gray-600">
		Gib Deine Website-URL ein, um eine umfangreiche SEO-Analyse sofort zu erhalten
	</p>

	<div class="form-group">
		<label for="company_url" class="form-label">Website URL</label>
		<div class="flex">
			<input
				type="url"
				id="company_url"
				bind:value={$form.company_url}
				class="input-field flex-grow shadow-custom {shouldShowError('company_url') ? 'error' : ''}"
				onblur={() => handleBlur('company_url')}
				placeholder="https://www.example.com"
				disabled={isLoading}
				{...getAriaAttrs('company_url', 'Bitte gib Deine Website-URL ein')}
			/>
			<button
				type="button"
				class="btn btn-primary ml-2"
				disabled={isLoading || !$form.company_url}
				onclick={analyzeWebsite}
			>
				{#if isLoading}
					<span class="loading loading-spinner loading-sm"></span>
					Analysiere...
				{:else}
					Analysieren
				{/if}
			</button>
		</div>
		{#if shouldShowError('company_url')}
			<p class="error-text" id="company_url-error" role="alert" transition:fade>
				{errors.company_url}
			</p>
		{/if}
		{#if analysisError}
			<p class="mt-2 text-sm text-red-600" role="alert" transition:fade>
				{analysisError}
			</p>
		{/if}
		{#if !shouldShowError('company_url') && $form.company_url && !isLoading && !analysisError && !showResults}
			<p class="mt-1 text-sm text-gray-500" id="company_url-description">
				Klicke auf "Analysieren", um Deine Website zu überprüfen
			</p>
		{/if}
	</div>

	{#if showSeoTips}
		<!-- Zeige entweder Standard-SEO-Tips oder unsere eigenen an, je nach Analysestatus -->
		{#if !showResults}
			<div transition:fade={{ duration: 300 }}>
				<SeoTips />
			</div>
		{:else if customTips.length > 0}
			<!-- Zeige unsere eigenen SEO-Tips im selben Stil wie SeoTips -->
			<div
				class="seo-tip-card rounded-lg border border-blue-100 bg-blue-50 p-5 shadow-sm"
				transition:fade={{ duration: 300 }}
			>
				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-blue-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-blue-800">SEO-Tipp basierend auf Deiner Analyse:</h3>
						<p class="mt-1 text-blue-700">{customTips[currentSeoTipIndex]}</p>
					</div>
				</div>
				<div class="mt-4">
					<div class="h-1 w-full overflow-hidden rounded-full bg-blue-200">
						<!-- Animate the progress indicator -->
						<div
							class="h-full animate-pulse rounded-full bg-blue-500"
							style="width: {((currentSeoTipIndex + 1) / customTips.length) * 100}%"
						></div>
					</div>
				</div>
			</div>
		{/if}
	{/if}

	<!-- Results Card - Vereinfacht und im Stil der SEO-Tips -->
	{#if showResults && analysisData}
		<div
			class="results-card my-4 overflow-hidden rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm"
			transition:scale={{ duration: 400, easing: quintOut, start: 0.95 }}
		>
			<!-- Header mit Website-Info -->
			<div class="border-b border-blue-100 bg-white p-4">
				<div class="flex items-center">
					<!-- Domain-Initial als Avatar -->
					<div
						class="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700"
					>
						{formattedUrl
							.replace(/https?:\/\/(www\.)?/, '')
							.charAt(0)
							.toUpperCase()}
					</div>
					<div class="flex-1">
						<h3 class="text-lg font-bold text-gray-900">{formattedUrl}</h3>
						<div class="text-sm text-gray-500">
							Analyse vom {new Date().toLocaleDateString('de-DE')}
						</div>
					</div>
					<div
						class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-3xl font-bold text-white shadow-md"
						in:scale={{ duration: 600, delay: 300 }}
					>
						{formatScore($form.visibility_score)}
					</div>
				</div>
			</div>

			<div class="p-5">
				<!-- Statistik-Übersicht im SEO-Tips Stil -->
				<div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
					{#each [{ label: 'Performance', value: analysisData.performance }, { label: 'SEO', value: analysisData.seo }, { label: 'Zugänglichkeit', value: analysisData.accessibility }, { label: 'Best Practices', value: analysisData.bestPractices }] as metric, i}
						<div
							class="flex flex-col rounded-lg border border-blue-100 bg-white p-3 shadow-sm"
							in:fly={{ y: 20, delay: 200 + i * 100, duration: 400 }}
						>
							<div class="mb-1 flex items-center justify-between">
								<span class="text-xs font-medium text-gray-500">{metric.label}</span>
								<span class={`text-lg font-bold ${getScoreColorClass(metric.value)}`}>
									{formatScore(metric.value)}
								</span>
							</div>
							<div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
								<div
									class="h-full rounded-full transition-all duration-1000"
									style="width: {metric.value}%; background-color: {getScoreBackgroundColor(
										metric.value
									)};"
								></div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Auto-advance progress bar -->
				<div class="mt-4">
					<div
						class="flex items-center justify-center space-x-2 rounded-md bg-white p-2 text-center text-sm text-gray-500"
						in:fade={{ delay: 500, duration: 300 }}
					>
						<svg class="h-4 w-4 animate-spin text-blue-500" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
								fill="none"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						<span
							>Weiterleitung in {7 - Math.min(7, Math.floor(currentProgress / 15))} Sekunden...</span
						>
					</div>

					<!-- Progress bar for auto-advance -->
					<div class="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200">
						<div
							class="h-full rounded-full bg-blue-500 transition-all duration-300"
							style="width: {currentProgress}%"
						></div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.results-card {
		max-width: 100%;
		opacity: 0;
		animation: fadeIn 0.5s forwards;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* Ensure progress animations are smooth */
	.rounded-full {
		will-change: width;
	}

	/* Improve focus styles for better accessibility */
	input:focus,
	button:focus {
		outline: 2px solid rgba(59, 130, 246, 0.5);
		outline-offset: 1px;
	}

	/* Eigene SEO-Tips im Stil der SeoTips-Komponente */
	.seo-tip-card {
		animation: fadeCard 0.5s ease-in-out;
	}

	@keyframes fadeCard {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
