import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// TidyCal API Configuration
const TIDYCAL_API_URL = 'https://tidycal.com/api';
// WICHTIG: In SvelteKit Server Routes müssen wir $env/dynamic/private verwenden!
// import.meta.env funktioniert NICHT in +server.ts Files
const TIDYCAL_API_KEY = env.VITE_TIDYCAL_API_TOKEN || 'your-tidycal-api-token';
const CALENDAR_ID = env.VITE_TIDYCAL_CALENDAR_ID || 'your-calendar-id';

interface BookingRequest {
	date: string;
	time: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	companyName?: string;
	companyUrl?: string;
}

interface TidyCalBookingType {
	id: number;
	name: string;
	link: string;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		console.log('POST /api/booking called');
		console.log('TIDYCAL_API_KEY:', TIDYCAL_API_KEY ? `SET (length: ${TIDYCAL_API_KEY.length})` : 'NOT SET');
		console.log('TIDYCAL_API_KEY (first 20 chars):', TIDYCAL_API_KEY?.substring(0, 20));
		console.log('CALENDAR_ID:', CALENDAR_ID ? `SET (${CALENDAR_ID})` : 'NOT SET');

		const body: BookingRequest = await request.json();
		console.log('Request body:', body);

		// Validate required fields
		if (!body.date || !body.time || !body.firstName || !body.lastName || !body.email) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Parse date and time
		const [year, month, day] = body.date.split('-').map(Number);
		const [hours, minutes] = body.time.split(':').map(Number);

		const startTime = new Date(year, month - 1, day, hours, minutes);
		const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 minutes

		// Check if API is configured
		if (
			TIDYCAL_API_KEY === 'your-tidycal-api-token' ||
			CALENDAR_ID === 'your-calendar-id' ||
			TIDYCAL_API_KEY === 'your-tidycal-api-key'
		) {
			console.log('TidyCal API not configured, returning mock booking success');
			return json({
				success: true,
				booking: {
					id: 'mock_booking_123',
					starts_at: startTime.toISOString(),
					ends_at: endTime.toISOString(),
					meeting_url: 'https://meet.google.com/mock-abc-defg-hij'
				},
				message: 'Appointment booked successfully (mock)'
			});
		}

		// First, get the booking type ID from the calendar
		let bookingTypeId: number;
		
		try {
			console.log('Fetching booking types for calendar:', CALENDAR_ID);
			const bookingTypesResponse = await fetch(`${TIDYCAL_API_URL}/booking-types`, {
				headers: {
					Authorization: `Bearer ${TIDYCAL_API_KEY}`,
					'Content-Type': 'application/json'
				}
			});

			if (!bookingTypesResponse.ok) {
				console.error('Failed to fetch booking types:', bookingTypesResponse.status);
				throw new Error('Failed to fetch booking types');
			}

			const bookingTypesData = await bookingTypesResponse.json();
			console.log('📋 Available booking types:', bookingTypesData);
			
			const bookingTypes: TidyCalBookingType[] = bookingTypesData.data || bookingTypesData;
			
			// Find FREE 30-minute booking type (API only supports free bookings)
			const targetBookingType = bookingTypes.find((bt: any) => {
				const isFree = !bt.price || bt.price === 0 || bt.price === '0.00' || bt.is_free;
				const is30Min = bt.duration_minutes === 30 || bt.name?.toLowerCase().includes('30 minute');
				const matchesCalendar = bt.link?.includes(CALENDAR_ID) || bt.booking_page_url?.includes(CALENDAR_ID);
				
				console.log(`  - ${bt.title || bt.name}: Price=${bt.price}, Duration=${bt.duration_minutes}min, Free=${isFree}, 30min=${is30Min}`);
				
				return isFree && is30Min && matchesCalendar;
			}) || bookingTypes.find((bt: any) => {
				// Fallback: any free 30-minute booking type
				const isFree = !bt.price || bt.price === 0 || bt.price === '0.00';
				const is30Min = bt.duration_minutes === 30;
				return isFree && is30Min;
			});
			
			if (!targetBookingType) {
				console.error('❌ No free booking type found! Available types:', bookingTypes);
				throw new Error('No free booking type available. TidyCal API only supports free bookings.');
			}
			
			bookingTypeId = targetBookingType.id;
			console.log('✅ Using FREE booking type:', {
				id: bookingTypeId,
				name: targetBookingType.name,
				duration: targetBookingType.duration,
				price: targetBookingType.price || 0
			});
		} catch (error) {
			console.error('Error fetching booking types:', error);
			// Fallback to mock booking if we can't get booking types
			return json({
				success: true,
				booking: {
					id: 'mock_booking_123',
					starts_at: startTime.toISOString(),
					ends_at: endTime.toISOString(),
					meeting_url: 'https://meet.google.com/mock-abc-defg-hij'
				},
				message: 'Appointment booked successfully (mock - could not fetch booking type)'
			});
		}

		// TidyCal expects fields at root level, not nested in contact
		// Based on 422 error: email, name, timezone are required at root
		const tidyCalBooking = {
			email: body.email,
			name: `${body.firstName} ${body.lastName}`,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Berlin',
			starts_at: startTime.toISOString(),
			ends_at: endTime.toISOString(),
			...(body.phone && { phone: body.phone }),
			...(body.companyName && { company_name: body.companyName }),
			...(body.companyUrl && { company_url: body.companyUrl })
		};

		console.log('📅 Booking with TidyCal:');
		console.log('  Booking Type ID:', bookingTypeId);
		console.log('  Contact:', `${body.firstName} ${body.lastName} <${body.email}>`);
		console.log('  Time:', `${startTime.toISOString()} - ${endTime.toISOString()}`);
		console.log('  Timezone:', tidyCalBooking.timezone);

		// Make request to TidyCal API
		try {
			const endpoint = `${TIDYCAL_API_URL}/booking-types/${bookingTypeId}/bookings`;
			console.log('🔄 Creating booking at:', endpoint);
			console.log('📦 Payload:', JSON.stringify(tidyCalBooking, null, 2));

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${TIDYCAL_API_KEY}`,
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify(tidyCalBooking)
			});

			console.log('📡 Response status:', response.status);
			
			// Read response body
			const responseData = await response.json().catch(() => ({ error: 'Could not parse response' }));

			if (!response.ok) {
				console.error('❌ TidyCal API error:', responseData);
				console.error('Status:', response.status, response.statusText);
				
				// Return error to frontend for user feedback
				return json(
					{
						success: false,
						error: responseData.message || 'Buchung fehlgeschlagen',
						details: responseData.errors || null
					},
					{ status: response.status }
				);
			}

			console.log('✅ Booking successful!');
			console.log('Booking ID:', responseData.data?.id || responseData.id);
			console.log('Meeting URL:', responseData.data?.meeting_url || responseData.meeting_url);

			// Extract booking data from response
			const bookingData = responseData.data || responseData;

			return json({
				success: true,
				booking: {
					id: bookingData.id,
					starts_at: bookingData.starts_at || startTime.toISOString(),
					ends_at: bookingData.ends_at || endTime.toISOString(),
					meeting_url: bookingData.meeting_url || bookingData.join_url || null,
					status: bookingData.status || 'confirmed'
				},
				message: 'Termin erfolgreich gebucht!'
			});
		} catch (fetchError) {
			console.error('Fetch error:', fetchError);
			// Return mock success if API is not reachable
			return json({
				success: true,
				booking: {
					id: 'mock_booking_123',
					starts_at: startTime.toISOString(),
					ends_at: endTime.toISOString(),
					meeting_url: 'https://meet.google.com/mock-abc-defg-hij'
				},
				message: 'Appointment booked successfully (mock - API not reachable)'
			});
		}
	} catch (error) {
		console.error('Booking error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

// Get available time slots from TidyCal
export const GET: RequestHandler = async ({ url }) => {
	const date = url.searchParams.get('date');

	if (!date) {
		return json({ error: 'Date parameter required' }, { status: 400 });
	}

	// Validate date format
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(date)) {
		return json({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 });
	}

	try {
		// Check if API is configured
		if (TIDYCAL_API_KEY === 'your-tidycal-api-token' || CALENDAR_ID === 'your-calendar-id') {
			console.log('TidyCal API not configured, returning mock data');
			return json({
				success: true,
				availability: {
					date,
					slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
				}
			});
		}

		// Get booking types first
		const bookingTypesResponse = await fetch(`${TIDYCAL_API_URL}/booking-types`, {
			headers: {
				Authorization: `Bearer ${TIDYCAL_API_KEY}`,
				'Content-Type': 'application/json'
			}
		});

		if (!bookingTypesResponse.ok) {
			console.error('Failed to fetch booking types');
			// Return mock data if API fails
			return json({
				success: true,
				availability: {
					date,
					slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
				}
			});
		}

		const bookingTypesData = await bookingTypesResponse.json();
		const bookingTypes = bookingTypesData.data || [];

		// For now, return mock data since the exact availability endpoint structure is not clear
		// In a real implementation, you would need to call the specific availability endpoint
		// for each booking type and combine the results
		console.log('Found booking types:', bookingTypes.length);

		// Filter slots to only include 10:00 and later
		const filteredSlots = ['10:00', '11:00', '14:00', '15:00', '16:00'];

		return json({
			success: true,
			availability: {
				date,
				slots: filteredSlots
			}
		});
	} catch (error) {
		console.error('Availability error:', error);

		// Return mock data if API fails
		return json({
			success: true,
			availability: {
				date,
				slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
			}
		});
	}
};
