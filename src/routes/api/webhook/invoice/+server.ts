// src/routes/api/webhook/invoice/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { InvoiceService } from '$lib/services/invoiceService';
import { BetterplaceService } from '$lib/services/betterplaceService';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { invoiceData, emailTemplate, customerEmail, subject } = body;

		// Validate required data
		if (!invoiceData || !customerEmail) {
			return json(
				{ error: 'Missing required data: invoiceData or customerEmail' },
				{ status: 400 }
			);
		}

		// Generate invoice HTML
		const invoiceHTML = InvoiceService.generateInvoiceHTML(invoiceData);

		// If donation is included, trigger Betterplace donation
		if (invoiceData.donationAmount && invoiceData.donationAmount > 0) {
			try {
				await BetterplaceService.createDonation({
					amount: invoiceData.donationAmount,
					currency: invoiceData.currency,
					email: customerEmail,
					name: invoiceData.customer.name,
					message: `Spende von ${invoiceData.customer.name} via Digital Pusher`,
					fundraisingEventId: '49121'
				});
				console.log('✅ Betterplace donation created successfully');
			} catch (error) {
				console.error('❌ Error creating Betterplace donation:', error);
				// Don't fail the entire process if donation fails
			}
		}

		// Prepare email data for n8n
		const emailData = {
			to: customerEmail,
			subject: subject || `Rechnung ${invoiceData.invoiceNumber} - Digital Pusher`,
			html: invoiceHTML,
			invoiceData,
			timestamp: new Date().toISOString(),
			type: 'invoice'
		};

		// Send to n8n webhook for email processing
		const n8nResponse = await fetch(
			process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/invoice',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-N8N-API-KEY': process.env.N8N_API_KEY || ''
				},
				body: JSON.stringify(emailData)
			}
		);

		if (!n8nResponse.ok) {
			throw new Error(`n8n webhook failed: ${n8nResponse.statusText}`);
		}

		return json({
			success: true,
			invoiceNumber: invoiceData.invoiceNumber,
			message: 'Invoice generated and sent successfully'
		});
	} catch (error) {
		console.error('❌ Invoice webhook error:', error);
		return json({ error: 'Internal server error', details: error.message }, { status: 500 });
	}
};
