// src/lib/utils/emailUtils.ts
import type { FormData } from '$lib/schema';

/**
 * Formats form data for sending to the email webhook
 * Ensuring all fields are properly structured and named
 *
 * @param formData The form data to format
 * @returns Formatted data ready for email generation
 */
export function formatEmailData(formData: Partial<FormData>) {
	// Ensure we have a valid score
	const visibilityScore = Math.min(Math.max(formData.visibility_score || 50, 0), 100);

	// Extract current locale for emails
	const locale = document.documentElement.lang || 'de';

	// Current date formatted according to locale
	const formattedDate = new Date().toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	// Format form data for email template
	return {
		// Personal info
		salutation: formData.salutation || 'Sehr geehrte/r',
		first_name: formData.first_name || '',
		last_name: formData.last_name || 'Interessent/in',
		company_name: formData.company_name || 'Ihr Unternehmen',
		company_url: formData.company_url || 'Ihre Website',
		email: formData.email || '',
		phone: formData.phone || '',

		// Form selections
		visibility: formData.visibility || 'social_media',
		advertising_frequency: formData.advertising_frequency || 'monthly',
		goals: formData.goals || 'more_online',
		campaign_management: formData.campaign_management || 'self',
		online_reviews: formData.online_reviews || 'positive',
		previous_campaigns: formData.previous_campaigns || 'no',
		business_phase: formData.business_phase || 'planning',
		implementation_time: formData.implementation_time || 'immediate',

		// Scores and metrics
		visibility_score: visibilityScore,
		marketing_consent: formData.marketing_consent || false,

		// Additional metadata
		locale: locale,
		date: formattedDate,
		source: 'digital-pusher-assessment',
		timestamp: new Date().toISOString(),

		// For PDF generation
		requiresPdf: true
	};
}

/**
 * Determines whether to generate a PDF attachment or just send HTML email
 *
 * @param formData The form data
 * @returns Boolean indicating if PDF should be generated
 */
export function shouldGeneratePdf(formData: Partial<FormData>): boolean {
	// Generate PDF if:
	// 1. Email is provided
	// 2. AND either company name or URL is provided
	// 3. AND visibility score is calculated
	return (
		!!formData.email &&
		(!!formData.company_name || !!formData.company_url) &&
		formData.visibility_score !== undefined
	);
}

/**
 * Validates email format
 *
 * @param email Email to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
	// Basic email validation regex
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}
