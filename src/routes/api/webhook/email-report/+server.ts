// src/routes/api/webhook/email-report/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$lib/config/env';

const N8N_WEBHOOK_URL = env.N8N_WEBHOOK_URL;
const N8N_API_KEY = process.env.N8N_API_KEY || '';

/**
 * POST handler - proxy to n8n webhook
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		// Parse the request body
		const requestData = await request.json();

		// Prepare headers for n8n webhook
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		};

		// Add API key if available
		if (N8N_API_KEY) {
			headers['Authorization'] = `Bearer ${N8N_API_KEY}`;
		}

		// Forward the request to n8n webhook
		const response = await fetch(N8N_WEBHOOK_URL, {
			method: 'POST',
			headers,
			body: JSON.stringify(requestData)
		});

		// Check if the request was successful
		if (!response.ok) {
			const errorText = await response.text();
			console.error('Error from n8n webhook:', errorText);

			return json(
				{
					success: false,
					message: `n8n webhook returned status ${response.status}: ${response.statusText}`,
					error: errorText
				},
				{ status: response.status }
			);
		}

		// Parse and return the response
		const responseData = await response.json();

		return json({
			success: true,
			message: 'Email report request processed successfully',
			data: responseData
		});
	} catch (error) {
		console.error('Error processing email report request:', error);

		return json(
			{
				success: false,
				message: error instanceof Error ? error.message : 'Unknown error occurred',
				error: String(error)
			},
			{ status: 500 }
		);
	}
};
