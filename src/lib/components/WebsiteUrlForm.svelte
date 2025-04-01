<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormData } from '$lib/schema';
	import SeoTips from './SeoTips.svelte';
	import {
		extractScoreFromResponse,
		calculateFinalScore,
		calculateVisibilityScore,
		extractScreenshot,
		analyzeResponseStructure
	} from '$lib/utils/scoring';
	import { stepperStore } from '$lib/stores/stepperStore';
	import { scoreStore } from '$lib/utils/scoring';
	import { websiteLoading } from '$lib/stores/loadingStore';

	interface Props {
		form: SuperValidated<FormData>;
		errors: Record<string, string>;
		onAnalysisComplete: (healthData: any, score: number) => void;
		onAnalysisStart?: () => void;
		onAnalysisEnd?: () => void;
	}

	let {
		form,
		errors = {},
		onAnalysisComplete,
		onAnalysisStart = () => {},
		onAnalysisEnd = () => {}
	} = $props<Props>();

	// State variables
	let isLoading = $state(false);
	let showSeoTips = $state(true); // Always show SEO tips
	let analysisError = $state('');
	let autoAdvanceTimeout: number | undefined;
	let currentProgress = $state(0);
	let analysisData = $state<any>(null);
	let formattedUrl = $state('');
	let remainingSeconds = $state(45); // Start with 45 seconds
	let localErrors = $state<Record<string, string>>({});
	let touchedFields = $state(new Set<string>());
	let isUrlValid = $state(true);
	let analysisComplete = $state(false); // New state to track when analysis is complete

	// Für erweiterte SEO-Tips
	let tipInterval: number | undefined;
	let customTips = $state<string[]>([
		// Default SEO tips that show immediately
		'Verwende präzise Seitentitel (Title-Tags) für bessere Klickraten in Suchergebnissen.',
		'Erstelle einzigartige Meta-Beschreibungen für jede Seite (150-160 Zeichen).',
		'Verwende eine H1-Überschrift pro Seite, die das Hauptthema klar kommuniziert.',
		'Optimiere Bilder mit Alt-Texten und komprimiere sie für schnellere Ladezeiten.',
		'Erstelle eine klare Website-Struktur mit logischen URLs.'
	]);

	// URL validation function
	function validateUrl(url: string): { isValid: boolean; error: string } {
		if (!url || url.trim() === '') {
			return { isValid: false, error: 'Bitte eine URL eingeben' };
		}

		// Check if URL has a valid format
		try {
			// Ensure URL has a protocol for validation
			const urlToCheck =
				url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;

			const parsed = new URL(urlToCheck);

			// Check if domain has a dot (as per schema)
			if (!parsed.hostname.includes('.')) {
				return { isValid: false, error: 'Ungültige Domain' };
			}

			return { isValid: true, error: '' };
		} catch (error) {
			return { isValid: false, error: 'Ungültiges URL-Format' };
		}
	}

	// Handle field blur
	function handleBlur(fieldName: string) {
		touchedFields.add(fieldName);

		if (fieldName === 'company_url' && $form?.company_url !== undefined) {
			const validation = validateUrl($form.company_url);
			if (!validation.isValid) {
				localErrors.company_url = validation.error;
				isUrlValid = false;
			} else {
				delete localErrors.company_url;
				isUrlValid = true;
			}
		}
	}

	// Check if field should show error
	function shouldShowError(fieldName: string): boolean {
		// Safely check if form is defined and has the company_url property
		if (touchedFields.has(fieldName)) {
			return !!errors[fieldName] || !!localErrors[fieldName];
		}
		return false;
	}

	// Get error message
	function getErrorMessage(fieldName: string): string {
		return localErrors[fieldName] || errors[fieldName] || '';
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
			currentProgress = (elapsed / durationMs) * 100;

			if (remaining > 0) {
				requestAnimationFrame(animateProgress);
			} else {
				currentProgress = 100;
			}
		};

		requestAnimationFrame(animateProgress);
	}

	// Start countdown timer
	function startCountdown(fromSeconds: number = 45) {
		remainingSeconds = fromSeconds;

		const countdownInterval = setInterval(() => {
			if (remainingSeconds > 0) {
				remainingSeconds--;
			} else {
				clearInterval(countdownInterval);
			}
		}, 1000);

		return countdownInterval;
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
		if (analysisData?.performance < 70) {
			customTips.push(
				'Die Ladegeschwindigkeit Deiner Website könnte verbessert werden. Optimiere Bilder und reduziere unnötige Skripte.'
			);
		}

		// SEO tips
		if (analysisData?.seo < 70) {
			customTips.push(
				'Deine SEO-Bewertung zeigt Verbesserungspotential. Überprüfe Title-Tags, Meta-Beschreibungen und interne Verlinkungen.'
			);
		}

		// Accessibility tips
		if (analysisData?.accessibility < 70) {
			customTips.push(
				'Verbessere die Zugänglichkeit Deiner Website durch bessere Farbkontraste und korrekte Verwendung von HTML-Elementen.'
			);
		}

		// Security tip
		if (analysisData?.securityGrade !== 'A') {
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
			score: extractScoreFromResponse(data) || 25,
			performance: 0,
			seo: 0,
			accessibility: 0,
			bestPractices: 0,
			content: 0,
			security: 0,
			technologies: [],
			suggestions: [],
			lighthouse_report: null,
			detailed_scores: {}
		};

		try {
			// Handle array or object response format
			const dataObj = Array.isArray(data)
				? data.find((item) => item.lighthouse_report) || data[0]
				: data;

			// Store the entire lighthouse report
			if (dataObj.lighthouse_report) {
				processed.lighthouse_report = dataObj.lighthouse_report;
			}

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
				processed.security = dataObj.security_headers.grade;
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

			if (data.detailed_scores) {
				processed.detailed_scores = data.detailed_scores;
				// Berechnung des Content-Scores
				const contentFactors = [
					data.detailed_scores.meta_description || 0,
					data.detailed_scores.h1 || 0,
					data.detailed_scores.alt_attributes || 0
				];
				processed.content = Math.round(
					contentFactors.reduce((sum, score) => sum + score, 0) / contentFactors.length
				);
			}

			try {
				// Extract screenshot if available in the response
				const screenshotData = extractScreenshot(data);
				if (screenshotData) {
					processed.screenshot = screenshotData;
					console.log('Screenshot erfolgreich verarbeitet');
				} else {
					console.log('Kein Screenshot in den API-Daten gefunden');
				}
			} catch (screenshotError) {
				console.error('Fehler bei der Screenshot-Verarbeitung:', screenshotError);
			}

			return processed;
		} catch (error) {
			console.error('Error processing webhook data:', error);
			// Return mock data if processing fails
			return generateMockData(formattedUrl);
		}
	}

	// Main analyze function
	async function analyzeWebsite() {
		// Check if form and company_url are defined
		if (!$form || !$form.company_url) {
			localErrors.company_url = 'Bitte eine URL eingeben';
			touchedFields.add('company_url');
			return;
		}

		// Validate URL
		const validation = validateUrl($form.company_url);
		if (!validation.isValid) {
			localErrors.company_url = validation.error;
			touchedFields.add('company_url');
			return;
		}

		// Prepare URL for webhook - just basic formatting
		let webhookUrl = $form.company_url.trim();
		// Ensure URL has protocol
		if (!webhookUrl.startsWith('http://') && !webhookUrl.startsWith('https://')) {
			webhookUrl = 'https://' + webhookUrl;
		}
		// Ensure trailing slash for API compatibility
		if (!webhookUrl.endsWith('/')) {
			webhookUrl = webhookUrl + '/';
		}

		// Format URL for display
		formattedUrl = webhookUrl;

		// Update loading states
		$websiteLoading = true;
		isLoading = true;
		analysisComplete = false;
		analysisError = '';

		onAnalysisStart();

		// Clear any existing timeout
		if (autoAdvanceTimeout) {
			clearTimeout(autoAdvanceTimeout);
			autoAdvanceTimeout = undefined;
		}

		// Stop existing interval if present
		if (tipInterval) {
			clearInterval(tipInterval);
			tipInterval = undefined;
		}

		// Start countdown
		let countdownInterval = startCountdown(45);

		try {
			// Use the URL directly in the API call
			const apiUrl = `https://n8n.chooomedia.com/webhook/websitehealth?url=${webhookUrl}`;

			// Log for debugging
			console.log('API URL:', apiUrl);

			// Make API request with longer timeout to ensure we get a response
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 180000); // 180 second timeout

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

			// Parse response data - explicitly wait for this
			const data = await response.json();
			console.log('Webhook response data:', data);

			// On success
			analysisData = processAnalysisData(data);
			scoreStore.setWebsiteAnalysis(analysisData, $form);
			analysisComplete = true;

			analyzeResponseStructure(data);

			// Check if we have usable data
			if (!data || (Array.isArray(data) && data.length === 0)) {
				throw new Error('No data returned from webhook');
			}

			// Process data
			analysisData = processAnalysisData(data);

			// Update the score store with the new data
			if (data?.lighthouseResult) {
				console.log('Lighthouse metrics available:', data.lighthouseResult.categories);
			}

			// Update the score store with the new data
			scoreStore.setWebsiteAnalysis(analysisData, $form);

			// Mark analysis as complete
			analysisComplete = true;
		} catch (error) {
			console.warn('Error fetching from webhook, using mock data:', error);
			analysisError = `Fehler bei der API-Anfrage: ${error.message}. Fallback-Daten werden verwendet.`;

			analysisData = generateMockData(formattedUrl);

			scoreStore.setWebsiteAnalysis(analysisData, $form);

			analysisComplete = true;
		} finally {
			const generatedTips = generateCustomSeoTips(analysisData);
			if (generatedTips.length > 0) {
				customTips = generatedTips;
			}

			onAnalysisEnd();

			remainingSeconds = Math.min(remainingSeconds, 7);
			$websiteLoading = false;
		}

		// Calculate final score
		const formScore = calculateVisibilityScore($form);
		const websiteScore = analysisData?.score || formScore;
		const finalScore = calculateFinalScore(websiteScore, $form);

		// Update form with calculated score - this is crucial
		if ($form && typeof $form === 'object') {
			$form.visibility_score = finalScore;
		}

		// Call the callback with the data and score
		onAnalysisComplete(analysisData, finalScore);

		// Start animation for auto-advance progress (7 seconds)
		const autoAdvanceDelay = 7000;
		startProgressAnimation(autoAdvanceDelay);

		// Auto advance after 7 seconds
		autoAdvanceTimeout = setTimeout(() => {
			// Stop the interval before advancing
			if (tipInterval) {
				clearInterval(tipInterval);
				tipInterval = undefined;
			}
			if (countdownInterval) {
				clearInterval(countdownInterval);
			}

			$websiteLoading = false;

			// Mark current step as valid in the stepper store
			stepperStore.markStepValid($stepperStore.current.index);
			// Navigate to the next step
			stepperStore.nextStep();
		}, autoAdvanceDelay);
	}

	// URL validation effect when value changes
	$effect(() => {
		if ($form?.company_url !== undefined && touchedFields.has('company_url')) {
			const validation = validateUrl($form.company_url);
			if (!validation.isValid) {
				localErrors.company_url = validation.error;
				isUrlValid = false;
			} else {
				delete localErrors.company_url;
				isUrlValid = true;
			}
		}
	});

	// Auto-analyze when component mounts if URL is already set
	onMount(() => {
		if ($form?.company_url && !$form.visibility_score) {
			// Validate URL first
			const validation = validateUrl($form.company_url);
			if (validation.isValid) {
				setTimeout(() => {
					analyzeWebsite();
				}, 500);
			} else {
				localErrors.company_url = validation.error;
				touchedFields.add('company_url');
			}
		}

		// Clean up on component unmount
		return () => {
			if (autoAdvanceTimeout) {
				clearTimeout(autoAdvanceTimeout);
			}
			if (tipInterval) {
				clearInterval(tipInterval);
			}
			$websiteLoading = false;
		};
	});
</script>

<div class="website-url-form space-y-6">
	<!-- Ansprechende Illustration im Stil des Beispiels -->
	{#if !isLoading}
		<div class="analysis-placeholder mb-6 shadow-custom" transition:fade={{ duration: 300 }}>
			<div class="mx-auto mt-2 rounded-lg bg-white p-6 shadow-sm">
				<div class="flex flex-col items-center">
					<img src="/ui-mockup.svg" alt="Website Analysis Illustration" class="mb-4 h-32 w-auto" />
					<!-- Input Form (always visible) -->
					<div class="form-group">
						<label
							for="company_url"
							class="form-label text-semibold mb-1 hyphens-auto break-words text-center text-sm text-gray-600"
						>
							Gib die URL Deiner Website ein und klicke auf "Analysieren", um einen umfassenden
							Bericht zu erhalten.
						</label>

						<div class="flex flex-col lg:flex-row">
							<input
								type="url"
								id="company_url"
								bind:value={$form.company_url}
								class="input-field flex-grow shadow-custom {shouldShowError('company_url')
									? 'error'
									: ''}"
								on:blur={() => handleBlur('company_url')}
								on:keydown={(e) => {
									if (e.key === 'Enter' && !isLoading && $form?.company_url && isUrlValid) {
										e.preventDefault();
										analyzeWebsite();
									}
								}}
								placeholder="https://www.meinewebsite.com"
								disabled={isLoading}
								aria-invalid={shouldShowError('company_url') ? 'true' : 'false'}
								aria-describedby={shouldShowError('company_url') ? 'company_url-error' : undefined}
								aria-label="Bitte gib Deine Website-URL ein"
							/>
							<button
								type="button"
								class="btn btn-primary mt-2 lg:ml-2 lg:mt-0"
								disabled={isLoading || !$form?.company_url || !isUrlValid}
								on:click={analyzeWebsite}
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
								{getErrorMessage('company_url')}
							</p>
						{/if}
						{#if analysisError}
							<p class="mt-2 text-sm text-red-600" role="alert" transition:fade>
								{analysisError}
							</p>
						{/if}
						{#if !shouldShowError('company_url') && $form?.company_url && !isLoading && !analysisError}
							<p class="mt-1 text-sm text-gray-500" id="company_url-description">
								Klicke auf "Analysieren", um Deine Website zu überprüfen
							</p>
						{/if}
					</div>

					<!-- Feature List -->
					<div class="mt-5 flex flex-wrap gap-4 lg:my-2">
						{#each ['Performance-Check', 'SEO-Analyse', 'Zugänglichkeitstest', 'Sicherheitscheck'] as feature, i}
							<div class="flex items-start">
								<svg class="mr-2 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								<span class="text-sm text-gray-700">{feature}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Analysis Loading Box (stays visible during load and after) -->
	{#if isLoading || (analysisData && !analysisError)}
		<div class="analysis-in-progress mb-6" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
			<div class="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-custom">
				<div class="flex flex-col items-center">
					<!-- Animated Progress Indicator - Only shows animation while not complete -->
					<div class="relative mb-4 h-24 w-24">
						<!-- Static completed circle when analysis is complete -->
						{#if analysisComplete}
							<svg class="absolute inset-0" viewBox="0 0 100 100">
								<circle
									class="text-blue-100"
									stroke-width="4"
									stroke="currentColor"
									fill="transparent"
									r="42"
									cx="50"
									cy="50"
								/>
								<circle
									class="text-blue-500"
									stroke-width="4"
									stroke-dasharray="264"
									stroke-dashoffset="0"
									stroke-linecap="round"
									stroke="currentColor"
									fill="transparent"
									r="42"
									cx="50"
									cy="50"
								/>
							</svg>
						{:else}
							<!-- Animated circle during loading -->
							<svg class="absolute inset-0" viewBox="0 0 100 100">
								<circle
									class="text-blue-100"
									stroke-width="4"
									stroke="currentColor"
									fill="transparent"
									r="42"
									cx="50"
									cy="50"
								/>
								<circle
									class="text-blue-500 transition-all duration-300 ease-in-out"
									stroke-width="4"
									stroke-dasharray="264"
									stroke-dashoffset={264 - (currentProgress * 264) / 100}
									stroke-linecap="round"
									stroke="currentColor"
									fill="transparent"
									r="42"
									cx="50"
									cy="50"
								/>
							</svg>
						{/if}

						<!-- Pulse effect in center - only while loading -->
						{#if !analysisComplete}
							<div class="absolute inset-0 flex items-center justify-center">
								<div class="h-16 w-16 animate-ping rounded-full bg-blue-400 opacity-30"></div>
							</div>
						{/if}

						<!-- Icon in center -->
						<div class="absolute inset-0 flex items-center justify-center">
							{#if analysisComplete}
								<svg class="h-12 w-12 text-blue-600" viewBox="0 0 24 24" fill="none">
									<path
										d="M5 13l4 4L19 7"
										stroke="currentColor"
										stroke-width="3"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							{:else}
								<svg class="h-12 w-12 text-blue-600" viewBox="0 0 24 24" fill="none">
									<path
										d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										stroke="currentColor"
										stroke-width="1.5"
									/>
									<path
										d="M12 8v4l3 3"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
									/>
								</svg>
							{/if}
						</div>
					</div>

					<h3 class="mb-2 text-center text-xl font-bold text-gray-800">
						{#if analysisComplete}
							Analyse der Website <span class="text-blue-600"
								>{formattedUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span
							> abgeschlossen
						{:else}
							Analyse Deiner Website <span class="text-blue-600"
								>{formattedUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span
							>
						{/if}
					</h3>

					<p class="mb-4 text-center text-gray-600">
						{#if analysisComplete}
							Bericht wurde erstellt. Du wirst automatisch zum nächsten Schritt weitergeleitet.
						{:else}
							Wir analysieren Deine Website und erstellen einen umfassenden Performance-Bericht.
						{/if}
					</p>

					<!-- SEO Tips integrated within the loading box (always visible) -->
					{#if showSeoTips && customTips.length > 0}
						<div class="w-full">
							<SeoTips {customTips} minDisplayTime={8} isResponseReceived={analysisComplete} />
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Improve focus styles for better accessibility */
	input:focus,
	button:focus {
		outline: 2px solid rgba(59, 130, 246, 0.5);
		outline-offset: 1px;
	}

	/* Animation for the progress */
	@keyframes progress {
		0% {
			stroke-dashoffset: 264;
		}
		100% {
			stroke-dashoffset: 0;
		}
	}

	/* Animation for the analysis elements */
	.analysis-in-progress,
	.analysis-placeholder {
		animation: fadeIn 0.5s ease-in-out;
	}

	@keyframes fadeIn {
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
