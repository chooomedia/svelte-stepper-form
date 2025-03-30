// In routes/api/generate-client-token/+server.ts
import { json } from '@sveltejs/kit';

export async function GET() {
	try {
		// Anfrage an PayPal für ein Client-Token
		const response = await fetch('https://api-m.sandbox.paypal.com/v1/identity/generate-token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Basic ${Buffer.from(import.meta.env.VITE_PAYPAL_CLIENT_ID + ':' + import.meta.env.VITE_PAYPAL_SECRET).toString('base64')}`
			}
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('PayPal token error:', errorData);
			return json({ error: 'Failed to generate client token' }, { status: 500 });
		}

		const data = await response.json();
		return json({ clientToken: data.client_token });
	} catch (error) {
		console.error('Error generating client token:', error);
		return json({ error: 'Server error' }, { status: 500 });
	}
}
