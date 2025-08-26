// src/lib/services/rateLimiting.ts
import { browser } from '$app/environment';

// Store for rate limiting data
const STORAGE_KEY = 'digitalpusher_email_reports';

// Daily limit for email reports
const DAILY_LIMIT = 3;

/**
 * Checks if the user has reached the daily limit for email reports
 * @returns boolean indicating if limit has been reached
 */
export function hasReachedDailyLimit(): boolean {
	if (!browser) return false;

	// Get stored data from localStorage
	const storedData = localStorage.getItem(STORAGE_KEY);

	if (!storedData) {
		return false; // No data stored yet
	}

	try {
		// Parse stored data
		const data = JSON.parse(storedData);

		// Check if data is for the current day
		const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

		if (data.date !== today) {
			// It's a new day, reset counter
			resetDailyCounter();
			return false;
		}

		// Check if limit is reached
		return data.count >= DAILY_LIMIT;
	} catch (error) {
		// If there's an error parsing the data, reset the counter
		console.error('Error parsing stored rate limit data:', error);
		resetDailyCounter();
		return false;
	}
}

/**
 * Increments the daily counter for email reports
 */
export function incrementDailyCounter(): void {
	if (!browser) return;

	const today = new Date().toISOString().split('T')[0];
	let count = 1;

	// Get stored data
	const storedData = localStorage.getItem(STORAGE_KEY);

	if (storedData) {
		try {
			const data = JSON.parse(storedData);

			// If same day, increment counter
			if (data.date === today) {
				count = data.count + 1;
			}
		} catch (error) {
			// Ignore parsing errors
			console.error('Error parsing stored rate limit data:', error);
		}
	}

	// Store updated data
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			date: today,
			count
		})
	);
}

/**
 * Increments the daily counter for quiz results
 */
export function incrementEmailSendCount(): void {
	incrementDailyCounter();
}

/**
 * Resets the daily counter for email reports
 */
export function resetDailyCounter(): void {
	if (!browser) return;

	const today = new Date().toISOString().split('T')[0];

	// Reset counter for today
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			date: today,
			count: 0
		})
	);
}
