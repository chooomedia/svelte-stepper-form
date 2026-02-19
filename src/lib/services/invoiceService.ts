// src/lib/services/invoiceService.ts
import { browser } from '$app/environment';
import { env } from '$lib/config/env';
import { BetterplaceService } from './betterplaceService';
import { calculateTax } from '$lib/utils/payment';
import { getPlanDisplayName } from '$lib/types/plans';

/**
 * Invoice Data Interface
 */
export interface InvoiceData {
	invoiceNumber: string;
	date: string;
	dueDate: string;
	customer: {
		name: string;
		email: string;
		company?: string;
		address?: string;
	};
	items: InvoiceItem[];
	subtotal: number;
	taxAmount: number;
	taxRate: number;
	total: number;
	currency: string;
	donationAmount?: number;
	donationPercentage?: number;
	paymentMethod: string;
	transactionId: string;
}

/**
 * Invoice Item Interface
 */
export interface InvoiceItem {
	description: string;
	quantity: number;
	unitPrice: number;
	total: number;
}

/**
 * Invoice Service Class
 */
export class InvoiceService {
	private static readonly INVOICE_PREFIX = 'DP-INV';
	private static readonly TAX_RATE = 19; // German VAT rate

	/**
	 * Generate invoice number
	 */
	public static generateInvoiceNumber(): string {
		const timestamp = Date.now();
		const random = Math.floor(Math.random() * 1000)
			.toString()
			.padStart(3, '0');
		return `${this.INVOICE_PREFIX}-${timestamp}-${random}`;
	}

	/**
	 * Create invoice data from payment details
	 */
	public static createInvoiceData(paymentDetails: any, customerData: any): InvoiceData {
		const invoiceNumber = this.generateInvoiceNumber();
		const date = new Date().toISOString().split('T')[0];
		const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 14 days

		// Calculate amounts
		const baseAmount = parseFloat(paymentDetails.purchase_units[0].amount.value);
		const donationAmount = paymentDetails.includeDonation ? baseAmount * 0.03 : 0;
		const subtotal = baseAmount + donationAmount;
		const taxCalculation = calculateTax(subtotal, this.TAX_RATE);
		const total = subtotal + taxCalculation.vat;

		// Create invoice items
		const items: InvoiceItem[] = [
			{
				description: getPlanDisplayName(paymentDetails.selectedPlan, paymentDetails.paymentType),
				quantity: 1,
				unitPrice: baseAmount,
				total: baseAmount
			}
		];

		// Add donation item if applicable
		if (donationAmount > 0) {
			items.push({
				description: 'Betterplace Spende (3%)',
				quantity: 1,
				unitPrice: donationAmount,
				total: donationAmount
			});
		}

		return {
			invoiceNumber,
			date,
			dueDate,
			customer: {
				name: `${customerData.first_name} ${customerData.last_name}`,
				email: customerData.email,
				company: customerData.company_name,
				address: customerData.address || ''
			},
			items,
			subtotal,
			taxAmount: taxCalculation.vat,
			taxRate: this.TAX_RATE,
			total,
			currency: paymentDetails.purchase_units[0].amount.currency_code,
			donationAmount,
			donationPercentage: donationAmount > 0 ? 3 : 0,
			paymentMethod: 'PayPal',
			transactionId: paymentDetails.id
		};
	}

	/**
	 * Generate HTML invoice template
	 */
	public static generateInvoiceHTML(invoiceData: InvoiceData): string {
		return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rechnung ${invoiceData.invoiceNumber}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f4f4f4;
        }
        .invoice-container {
            max-width: 800px;
            margin: 20px auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background: #022b2f;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .logo {
            max-width: 200px;
            margin-bottom: 10px;
        }
        .invoice-info {
            display: flex;
            justify-content: space-between;
            padding: 30px;
            border-bottom: 2px solid #eee;
        }
        .customer-info {
            padding: 30px;
            border-bottom: 2px solid #eee;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        .items-table th,
        .items-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .items-table th {
            background: #f8f9fa;
            font-weight: bold;
        }
        .totals {
            padding: 30px;
            text-align: right;
        }
        .total-row {
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #eee;
        }
        .donation-info {
            background: #e8f5e8;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            border-left: 4px solid #28a745;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <img src="https://digitalpusher.de/wp-content/uploads/2024/08/logo-digitalpuser-background-08-2024.png" alt="Digital Pusher" class="logo">
            <h1>Rechnung</h1>
            <p>Digital Pusher by Matt Interfaces</p>
        </div>

        <div class="invoice-info">
            <div>
                <h3>Rechnung an:</h3>
                <p><strong>${invoiceData.customer.name}</strong></p>
                ${invoiceData.customer.company ? `<p>${invoiceData.customer.company}</p>` : ''}
                ${invoiceData.customer.address ? `<p>${invoiceData.customer.address}</p>` : ''}
                <p>${invoiceData.customer.email}</p>
            </div>
            <div>
                <h3>Rechnungsdetails:</h3>
                <p><strong>Rechnungsnummer:</strong> ${invoiceData.invoiceNumber}</p>
                <p><strong>Datum:</strong> ${invoiceData.date}</p>
                <p><strong>Fälligkeitsdatum:</strong> ${invoiceData.dueDate}</p>
                <p><strong>Zahlungsart:</strong> ${invoiceData.paymentMethod}</p>
                <p><strong>Transaktions-ID:</strong> ${invoiceData.transactionId}</p>
            </div>
        </div>

        <div class="customer-info">
            <h3>Leistungsbeschreibung:</h3>
            <p>Digital Marketing Services - ${getPlanDisplayName(invoiceData.items[0].description, 'monthly')}</p>
        </div>

        ${
					invoiceData.donationAmount && invoiceData.donationAmount > 0
						? `
        <div class="donation-info">
            <h4>💚 Betterplace Spende</h4>
            <p>Vielen Dank für Ihre Spende von ${invoiceData.donationAmount.toFixed(2)}€ an Umweltschutzprojekte!</p>
            <p>93% Ihrer Spende fließt direkt in nachhaltige Projekte - nachweislich und transparent.</p>
        </div>
        `
						: ''
				}

        <table class="items-table">
            <thead>
                <tr>
                    <th>Beschreibung</th>
                    <th>Menge</th>
                    <th>Einzelpreis</th>
                    <th>Gesamt</th>
                </tr>
            </thead>
            <tbody>
                ${invoiceData.items
									.map(
										(item) => `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice.toFixed(2)}€</td>
                    <td>${item.total.toFixed(2)}€</td>
                </tr>
                `
									)
									.join('')}
            </tbody>
        </table>

        <div class="totals">
            <div>
                <p><strong>Zwischensumme:</strong> ${invoiceData.subtotal.toFixed(2)}€</p>
                <p><strong>MwSt. (${invoiceData.taxRate}%):</strong> ${invoiceData.taxAmount.toFixed(2)}€</p>
                <p class="total-row"><strong>Gesamtbetrag:</strong> ${invoiceData.total.toFixed(2)}€</p>
            </div>
        </div>

        <div class="footer">
            <p><strong>Digital Pusher by Matt Interfaces</strong></p>
            <p>Christopher Matt | cm@chooo.de</p>
            <p>USt-IdNr.: DE370051614</p>
            <p>Diese Rechnung wurde automatisch generiert und ist gültig ohne Unterschrift.</p>
        </div>
    </div>
</body>
</html>`;
	}

	/**
	 * Send invoice via email
	 */
	public static async sendInvoiceEmail(
		invoiceData: InvoiceData,
		emailTemplate: string
	): Promise<boolean> {
		if (!browser) {
			console.warn('InvoiceService: Can only be called in browser environment');
			return false;
		}

		try {
			// Send to n8n webhook for email processing
			const response = await fetch(env.N8N_INVOICE_WEBHOOK_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					type: 'invoice',
					customerName: invoiceData.customer.name,
					customerEmail: invoiceData.customer.email,
					invoiceNumber: invoiceData.invoiceNumber,
					invoiceDate: invoiceData.date,
					dueDate: invoiceData.dueDate,
					items: invoiceData.items,
					subtotal: invoiceData.subtotal,
					taxAmount: invoiceData.taxAmount,
					totalAmount: invoiceData.total,
					donationAmount: invoiceData.donationAmount || 0,
					donationPercentage: invoiceData.donationPercentage || 0,
					currency: invoiceData.currency,
					language: 'de'
				})
			});

			if (!response.ok) {
				throw new Error(`Invoice email failed: ${response.statusText}`);
			}

			console.log('✅ Invoice email sent successfully');
			return true;
		} catch (error) {
			console.error('❌ Error sending invoice email:', error);
			return false;
		}
	}

	/**
	 * Generate PDF invoice (placeholder for future implementation)
	 */
	public static async generatePDFInvoice(invoiceData: InvoiceData): Promise<Blob | null> {
		// This would integrate with a PDF generation service
		// For now, return null as placeholder
		console.log('PDF generation not yet implemented');
		return null;
	}
}
