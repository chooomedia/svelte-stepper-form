<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormData } from '$lib/schema';
	import SeoTips from './SeoTips.svelte';

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

	async function analyzeWebsite() {
		if (!$form.company_url) return;

		// Ensure URL has http/https prefix
		let url = $form.company_url;
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			url = 'https://' + url;
		}

		// Remove trailing slash if present
		if (url.endsWith('/')) {
			url = url.slice(0, -1);
		}

		$form.company_url = url;

		isLoading = true;
		showSeoTips = true;
		analysisError = '';

		try {
			// Call the webhook
			const encodedUrl = encodeURIComponent(url);
			const response = await fetch(
				`https://n8n.chooomedia.com/webhook/websitehealth?url=${encodedUrl}`
			);

			if (!response.ok) {
				throw new Error(`API error: ${response.status}`);
			}

			const data = await response.json();
			console.log('Website analysis data:', data);

			// Calculate score based on the response data
			// This depends on the structure of your webhook response
			let overallScore = 70; // Default value

			// Check if we have an overall_score in the data
			if (data && Array.isArray(data) && data.length > 0) {
				// Try to find the object with overall_score
				const scoreObject = data.find((item) => 'overall_score' in item);
				if (scoreObject && scoreObject.overall_score) {
					overallScore = scoreObject.overall_score;
				}
			}

			// Call the callback function with the analysis data and score
			onAnalysisComplete(data, overallScore);
		} catch (error) {
			console.error('Error analyzing website:', error);
			analysisError =
				'Es gab ein Problem bei der Analyse Ihrer Website. Bitte versuchen Sie es erneut.';

			// Call the callback with a default score
			onAnalysisComplete(null, 50);
		} finally {
			isLoading = false;
			// Keep SEO tips visible for a moment after loading completes
			setTimeout(() => {
				showSeoTips = false;
			}, 2000);
		}
	}
</script>

// src/lib/components/WebsiteUrlForm.svelte

<div class="website-url-form space-y-6">
	<h2 class="text-2xl font-bold text-gray-900">Lassen Sie uns Ihre Website analysieren</h2>
	<p class="text-gray-600">
		Geben Sie Ihre Website-URL ein, um eine sofortige SEO-Analyse zu erhalten
	</p>

	<div class="form-group">
		<label for="company_url" class="form-label">Website URL</label>
		<div class="flex">
			<input
				type="url"
				id="company_url"
				bind:value={$form.company_url}
				class="input-field flex-grow {shouldShowError('company_url') ? 'error' : ''}"
				onblur={() => handleBlur('company_url')}
				placeholder="https://www.example.com"
				disabled={isLoading}
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
		{#if !shouldShowError('company_url') && $form.company_url && !isLoading && !analysisError}
			<p class="mt-1 text-sm text-gray-500" id="company_url-description">
				Klicken Sie auf "Analysieren", um Ihre Website zu überprüfen
			</p>
		{/if}
	</div>

	{#if showSeoTips}
		<div transition:slide>
			<SeoTips />
		</div>
	{/if}
</div>
