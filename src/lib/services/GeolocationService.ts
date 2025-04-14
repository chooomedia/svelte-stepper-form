// src/lib/services/GeolocationService.ts
import { browser } from '$app/environment';

export interface GeoData {
	country: string;
	countryCode: string;
	continent: string;
	city?: string;
	currency?: string;
	timezone?: string;
}

export class GeolocationService {
	// Cache the result to avoid multiple API calls
	private static cachedResult: GeoData | null = null;

	/**
	 * Detects user's location using multiple services with fallbacks
	 */
	static async detectLocation(): Promise<GeoData | null> {
		if (!browser) return null;

		// Return cached result if available
		if (this.cachedResult) return this.cachedResult;

		try {
			// Try primary service (ipapi.co)
			const result = await this.tryIpapiService();
			if (result) {
				this.cachedResult = result;
				return result;
			}

			// Fallback to secondary service (ipinfo.io)
			const fallbackResult = await this.tryIpinfoService();
			if (fallbackResult) {
				this.cachedResult = fallbackResult;
				return fallbackResult;
			}

			// Last resort fallback (ipapi.com)
			const lastResortResult = await this.tryIpapiComService();
			if (lastResortResult) {
				this.cachedResult = lastResortResult;
				return lastResortResult;
			}

			return null;
		} catch (error) {
			console.error('All geolocation services failed:', error);
			return null;
		}
	}

	/**
	 * Try to get location from ipapi.co (primary)
	 */
	private static async tryIpapiService(): Promise<GeoData | null> {
		try {
			const response = await fetch('https://ipapi.co/json/', {
				signal: AbortSignal.timeout(3000) // Abort after 3 seconds
			});

			if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

			const data = await response.json();
			return {
				country: data.country_name,
				countryCode: data.country_code?.toLowerCase() || '',
				continent: data.continent_code,
				city: data.city,
				currency: data.currency,
				timezone: data.timezone
			};
		} catch (error) {
			console.warn('Primary geolocation service failed:', error);
			return null;
		}
	}

	/**
	 * Try to get location from ipinfo.io (fallback)
	 */
	private static async tryIpinfoService(): Promise<GeoData | null> {
		try {
			const response = await fetch('https://ipinfo.io/json', {
				signal: AbortSignal.timeout(3000) // Abort after 3 seconds
			});

			if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

			const data = await response.json();
			return {
				country: data.country || '',
				countryCode: data.country?.toLowerCase() || '',
				continent: '', // Not provided by this service
				city: data.city,
				currency: '', // Not provided by this service
				timezone: data.timezone
			};
		} catch (error) {
			console.warn('Secondary geolocation service failed:', error);
			return null;
		}
	}

	/**
	 * Try to get location from ipapi.com (last resort)
	 */
	private static async tryIpapiComService(): Promise<GeoData | null> {
		try {
			const response = await fetch('https://ipapi.com/ip_api.php?format=json', {
				signal: AbortSignal.timeout(3000) // Abort after 3 seconds
			});

			if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

			const data = await response.json();
			return {
				country: data.country_name || '',
				countryCode: data.country_code?.toLowerCase() || '',
				continent: data.continent_code || '',
				city: data.city || '',
				currency: data.currency?.code || '',
				timezone: data.time_zone?.name || ''
			};
		} catch (error) {
			console.warn('Last resort geolocation service failed:', error);
			return null;
		}
	}

	/**
	 * Reset cached result
	 */
	static resetCache(): void {
		this.cachedResult = null;
	}
}
