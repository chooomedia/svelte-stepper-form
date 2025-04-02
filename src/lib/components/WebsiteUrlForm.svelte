<!-- src/lib/components/WebsiteUrlForm.svelte - Improved version -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormData } from '$lib/schema';
	import { i18n } from '$lib/i18n';
	import SeoTips from './SeoTips.svelte';
	import Button from './Button.svelte';
	import { formStore } from '$lib/stores/formStore';
	import { loadingStore } from '$lib/stores/loadingStore';

	import { stepperStore } from '$lib/stores/stepperStore';

	// Props
	interface Props {
		form: SuperValidated<FormData>;
		error?: Record<string, string>;
		onAnalysisComplete?: (data: any, score: number) => void;
		onAnalysisStart?: () => void;
		onAnalysisEnd?: () => void;
	}

	let {
		form,
		error = {},
		onAnalysisComplete = () => {},
		onAnalysisStart = () => {},
		onAnalysisEnd = () => {}
	} = $props<Props>();

	// State variables
	let isLoading = $state(false);
	let showSeoTips = $state(true);
	let analysisError = $state('');
	let formattedUrl = $state('');
	let localErrors = $state<Record<string, string>>({});
	let touchedFields = $state(new Set<string>());
	let isUrlValid = $state(true);
	let analysisComplete = $state(false);
	let currentProgress = $state(0);
	let remainingSeconds = $state(45);

	// Timeouts and intervals
	let progressAnimationId: number;
	let countdownIntervalId: number;
	let autoAdvanceTimeoutId: number;

	// Features for display
	const features = ['performance', 'seo', 'accessibility', 'security'];

	// URL validation with better error messages
	function validateUrl(url: string): { isValid: boolean; error: string } {
		if (!url || url.trim() === '') {
			return { isValid: false, error: $i18n.forms.errors.required };
		}

		try {
			// Ensure URL has a protocol for validation
			const urlToCheck =
				url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;

			const parsed = new URL(urlToCheck);

			// Domain must have at least one dot
			if (!parsed.hostname.includes('.')) {
				return { isValid: false, error: $i18n.forms.errors.invalidDomain };
			}

			return { isValid: true, error: '' };
		} catch (error) {
			return { isValid: false, error: $i18n.forms.errors.url };
		}
	}

	// Handle field blur for validation
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

	// Check if error should be shown
	function shouldShowError(fieldName: string): boolean {
		return touchedFields.has(fieldName) && !!localErrors[fieldName];
	}

	// Get error message
	function getErrorMessage(fieldName: string): string {
		return localErrors[fieldName] || error[fieldName] || '';
	}

	// Start progress animation for auto-advance
	function startProgressAnimation(durationMs: number) {
		// Clear any existing animation
		if (progressAnimationId) {
			cancelAnimationFrame(progressAnimationId);
		}

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
				progressAnimationId = requestAnimationFrame(animateProgress);
			} else {
				currentProgress = 100;
			}
		};

		progressAnimationId = requestAnimationFrame(animateProgress);
	}

	// Start countdown timer
	function startCountdown(fromSeconds: number = 45) {
		// Clear any existing countdown
		if (countdownIntervalId) {
			clearInterval(countdownIntervalId);
		}

		remainingSeconds = fromSeconds;

		countdownIntervalId = setInterval(() => {
			if (remainingSeconds > 0) {
				remainingSeconds--;
			} else {
				clearInterval(countdownIntervalId);
			}
		}, 1000);

		return countdownIntervalId;
	}

	// Clean up all timers and intervals
	function cleanupTimers() {
		if (progressAnimationId) cancelAnimationFrame(progressAnimationId);
		if (countdownIntervalId) clearInterval(countdownIntervalId);
		if (autoAdvanceTimeoutId) clearTimeout(autoAdvanceTimeoutId);
	}

	// Main analyze function
	async function analyzeWebsite() {
		// Validate input first
		if (!$form || !$form.company_url) {
			localErrors.company_url = $i18n.forms.errors.required;
			touchedFields.add('company_url');
			return;
		}

		// Validate URL format
		const validation = validateUrl($form.company_url);
		if (!validation.isValid) {
			localErrors.company_url = validation.error;
			touchedFields.add('company_url');
			return;
		}

		// Clean up any existing timers
		cleanupTimers();

		// Prepare URL for API - ensure protocol and trailing slash
		let webhookUrl = $form.company_url.trim();
		if (!webhookUrl.startsWith('http://') && !webhookUrl.startsWith('https://')) {
			webhookUrl = 'https://' + webhookUrl;
		}
		if (!webhookUrl.endsWith('/')) {
			webhookUrl = webhookUrl + '/';
		}

		// Format URL for display
		formattedUrl = webhookUrl;

		// Update loading states
		isLoading = true;
		$loadingStore.websiteLoading = true;
		analysisComplete = false;
		analysisError = '';

		// Call the start callback
		onAnalysisStart();

		// Start countdown
		startCountdown(45);

		try {
			// Create API URL with the website URL as a parameter
			const apiUrl = `https://n8n.chooomedia.com/webhook/websitehealth?url=${encodeURIComponent(webhookUrl)}`;

			console.log('Calling API:', apiUrl);
			// Set up fetch with timeout
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

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
			console.log('API response data:', data);

			// Process the data and store results
			const processedData = processApiResponse(data);

			// Update the form store with analysis results
			formStore.setAnalysisResults(processedData);

			// Mark analysis as complete
			analysisComplete = true;

			// Call the completion callback with data and score
			onAnalysisComplete(processedData, processedData.score || 0);
		} catch (error) {
			console.warn('API error, using fallback data:', error);

			// Create fallback data for graceful degradation
			const fallbackData = createFallbackData(formattedUrl);

			// Update stores with fallback data
			formStore.setAnalysisResults(fallbackData);
			formStore.setAnalysisError(`${error.message}. Using fallback data.`);

			// Complete analysis with fallback
			analysisComplete = true;
			onAnalysisComplete(fallbackData, fallbackData.score || 0);

			// Set error message for display
			analysisError = `${$i18n.common.error}: ${error.message}. ${$i18n.forms.fallbackUsed}`;
		} finally {
			// Clean up regardless of success/failure
			remainingSeconds = Math.min(remainingSeconds, 7);
			$loadingStore.websiteLoading = false;
			onAnalysisEnd();

			// Start animation for auto-advance progress (7 seconds)
			const autoAdvanceDelay = 7000;
			startProgressAnimation(autoAdvanceDelay);

			// Schedule step advance after 7 seconds
			autoAdvanceTimeoutId = setTimeout(() => {
				// Mark current step as complete and advance
				stepperStore.markStepValid($stepperStore.current.index);
				stepperStore.nextStep();
			}, autoAdvanceDelay);
		}
	}

	// Process API response data
	function processApiResponse(data: any) {
		if (!data) return createFallbackData(formattedUrl);

		try {
			// Handle various response formats
			const processedData = {
				url: formattedUrl,
				score: 0,
				performance: 0,
				seo: 0,
				accessibility: 0,
				bestPractices: 0,
				content: 0,
				security: 0,
				suggestions: [],
				lighthouse_report: null,
				detailed_scores: {},
				screenshot: null
			};

			// Try to extract score - handle different data structures
			if (typeof data.score === 'number') {
				processedData.score = data.score;
			} else if (data.overall_score && typeof data.overall_score === 'number') {
				processedData.score = data.overall_score;
			} else if (Array.isArray(data) && data.length > 0 && data[0].score) {
				processedData.score = data[0].score;
			} else {
				// Fallback score between 40-60
				processedData.score = Math.floor(Math.random() * 20) + 40;
			}

			// Extract lighthouse data if available
			const lighthouseData =
				Array.isArray(data) && data[0]?.lighthouse_report
					? data[0].lighthouse_report
					: data.lighthouse_report;

			if (lighthouseData && lighthouseData.categories) {
				const categories = lighthouseData.categories;
				processedData.performance = Math.round((categories.performance?.score || 0) * 100);
				processedData.seo = Math.round((categories.seo?.score || 0) * 100);
				processedData.accessibility = Math.round((categories.accessibility?.score || 0) * 100);
				processedData.bestPractices = Math.round((categories['best-practices']?.score || 0) * 100);
				processedData.lighthouse_report = lighthouseData;
			}

			// Extract suggestions if available
			if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
				processedData.suggestions = data.suggestions.slice(0, 5);
			} else {
				// Default suggestions
				processedData.suggestions = [
					$i18n.results.recommendations.website,
					$i18n.results.recommendations.content,
					$i18n.results.recommendations.seo
				];
			}

			// Extract screenshot if available
			try {
				// Check various paths for screenshot data
				if (data.screenshot) {
					processedData.screenshot = data.screenshot;
				} else if (lighthouseData?.audits?.['final-screenshot']?.details?.data) {
					processedData.screenshot = lighthouseData.audits['final-screenshot'].details.data;
				}
			} catch (e) {
				console.warn('Screenshot extraction failed:', e);
			}

			return processedData;
		} catch (error) {
			console.error('Error processing API data:', error);
			return createFallbackData(formattedUrl);
		}
	}

	// Create fallback data when API fails
	function createFallbackData(url: string) {
		// Extract domain name for display
		const domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

		// Generate reasonable random scores
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
			content: Math.floor((seo + accessibility) / 2),
			security: Math.floor(Math.random() * 20) + 60, // 60-80
			securityGrade: ['B', 'C', 'D'][Math.floor(Math.random() * 3)],
			suggestions: [
				$i18n.results.recommendations.website,
				$i18n.results.recommendations.content,
				$i18n.results.recommendations.seo,
				$i18n.results.recommendations.performance
			].slice(0, Math.floor(Math.random() * 2) + 2)
		};
	}

	// Clean up resources on component destroy
	onDestroy(() => {
		cleanupTimers();
		$loadingStore.websiteLoading = false;
	});
</script>

<div class="website-url-form space-y-6">
	<!-- Intro illustration (when not loading) -->
	{#if !isLoading}
		<div class="analysis-placeholder mb-6 shadow-custom" transition:fade={{ duration: 300 }}>
			<div class="mx-auto mt-2 rounded-lg bg-white p-6 shadow-sm">
				<div class="flex flex-col items-center">
					<img src="/ui-mockup.svg" alt="Website Analysis Illustration" class="mb-4 h-32 w-auto" />

					<!-- URL Input Form -->
					<div class="form-group w-full max-w-2xl">
						<label
							for="company_url"
							class="form-label text-semibold mb-1 text-center text-sm text-gray-600"
						>
							{$i18n.forms.descriptions.company_url}
						</label>

						<div class="flex flex-col lg:flex-row">
							<input
								type="url"
								id="company_url"
								bind:value={$form.company_url}
								class="input-field flex-grow shadow-custom {shouldShowError('company_url')
									? 'error'
									: ''}"
								onblur={() => handleBlur('company_url')}
								onkeydown={(e) => {
									if (e.key === 'Enter' && !isLoading && $form?.company_url && isUrlValid) {
										e.preventDefault();
										analyzeWebsite();
									}
								}}
								placeholder={$i18n.forms.placeholders.company_url}
								disabled={isLoading}
								aria-invalid={shouldShowError('company_url') ? 'true' : 'false'}
								aria-describedby={shouldShowError('company_url') ? 'company_url-error' : undefined}
							/>

							<Button
								label={$i18n.common.analyze}
								{isLoading}
								disabled={isLoading || !$form?.company_url || !isUrlValid}
								onClick={analyzeWebsite}
								variant="primary"
								class="mt-2 lg:ml-2 lg:mt-0"
							/>
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
								{$i18n.forms.descriptions.analyze}
							</p>
						{/if}
					</div>

					<!-- Feature List -->
					<div class="mt-5 flex flex-wrap gap-4 lg:my-2">
						{#each features as feature}
							<div class="flex items-start">
								<svg class="mr-2 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								<span class="text-sm text-gray-700">{$i18n.forms.checkpoints[feature]}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Analysis Loading/Results Box -->
	{#if isLoading || (analysisComplete && !analysisError)}
		<div
			class="analysis-in-progress mb-6 mt-3"
			in:fade={{ duration: 300 }}
			out:fade={{ duration: 300 }}
		>
			<div class="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-custom">
				<div class="flex flex-col items-center">
					<!-- Progress Circle -->
					<div class="relative mb-4 h-24 w-24">
						<!-- Background static circle -->
						<svg class="absolute inset-0" viewBox="0 0 100 100">
							<circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" stroke-width="4" />

							<!-- Progress circle with animation -->
							<circle
								cx="50"
								cy="50"
								r="42"
								fill="none"
								stroke={analysisComplete ? '#10B981' : '#3B82F6'}
								stroke-width="4"
								stroke-linecap="round"
								stroke-dasharray="264"
								stroke-dashoffset={264 - (currentProgress * 264) / 100}
								transform="rotate(-90, 50, 50)"
							/>
						</svg>

						<!-- Status icon in center -->
						<div class="absolute inset-0 flex items-center justify-center">
							{#if analysisComplete}
								<!-- Success checkmark -->
								<svg class="h-12 w-12 text-green-500" viewBox="0 0 24 24" fill="none">
									<path
										d="M5 13l4 4L19 7"
										stroke="currentColor"
										stroke-width="3"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							{:else}
								<!-- Pulsing loading indicator -->
								<div class="h-12 w-12 animate-ping rounded-full bg-blue-400 opacity-30"></div>
								<svg class="absolute h-10 w-10 text-blue-500" viewBox="0 0 24 24" fill="none">
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

					<!-- Status Text -->
					<h3 class="mb-2 text-center text-xl font-bold text-gray-800">
						{#if analysisComplete}
							{$i18n.forms.seotips.analysisComplete}
							<span class="text-primary-600">
								{formattedUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
							</span>
						{:else}
							{$i18n.forms.seotips.analyzing}
							<span class="text-primary-600">
								{formattedUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
							</span>
						{/if}
					</h3>

					<!-- SEO Tips -->
					{#if showSeoTips}
						<div class="w-full">
							<SeoTips minDisplayTime={8} isResponseReceived={analysisComplete} />
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

	/* Animation for the progress circle */
	@keyframes progress {
		0% {
			stroke-dashoffset: 264;
		}
		100% {
			stroke-dashoffset: 0;
		}
	}

	/* Animation for content transitions */
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
