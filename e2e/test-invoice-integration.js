/**
 * Invoice Integration Tests
 * Tests the integration between Svelte app and n8n workflow for invoice generation
 *
 * Usage:
 * - CLI: node e2e/test-invoice-integration.js
 * - E2E: npm run test:e2e
 * - Frontend: Import and use in browser tests
 */

// Configuration
const CONFIG = {
	n8nBaseUrl: 'https://n8n.chooomedia.com',
	webhookPath: '/webhook/invoice',
	timeout: 10000,
	retries: 3
};

// Test data for invoice webhook
const testInvoiceData = {
	type: 'invoice',
	customerName: 'Max Mustermann',
	customerEmail: 'test@example.com',
	invoiceNumber: 'DP-INV-1703123456789-001',
	invoiceDate: '2024-01-15',
	dueDate: '2024-01-29',
	items: [
		{
			description: '3-MONATS PLAN - Monatlich',
			quantity: 1,
			unitPrice: 3.98,
			total: 3.98
		}
	],
	subtotal: 3.98,
	taxAmount: 0.76,
	totalAmount: 4.74,
	donationAmount: 0.12,
	donationPercentage: 3,
	currency: 'EUR',
	language: 'de'
};

/**
 * Send HTTP request to n8n webhook
 * @param {string} url - Webhook URL
 * @param {object} data - Data to send
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<object>} Response data
 */
async function sendWebhookRequest(url, data, retryCount = 0) {
	console.log(`🧪 Teste Rechnungs-Webhook (Attempt ${retryCount + 1})...`);
	console.log('📤 Sende Test-Daten:', JSON.stringify(data, null, 2));

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'Invoice-Test/1.0'
			},
			body: JSON.stringify(data),
			signal: AbortSignal.timeout(CONFIG.timeout)
		});

		console.log('📥 Response Status:', response.status);
		console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));

		const responseData = await response.text();

		if (response.ok) {
			console.log('✅ Webhook erfolgreich! Response:', responseData);
			return {
				statusCode: response.status,
				headers: Object.fromEntries(response.headers.entries()),
				data: responseData,
				success: true
			};
		} else {
			console.log('❌ Webhook fehlgeschlagen! Response:', responseData);
			return {
				statusCode: response.status,
				headers: Object.fromEntries(response.headers.entries()),
				data: responseData,
				success: false
			};
		}
	} catch (error) {
		console.error('❌ Request Error:', error.message);

		// Retry logic
		if (retryCount < CONFIG.retries - 1) {
			console.log(`🔄 Retrying... (${retryCount + 1}/${CONFIG.retries})`);
			await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
			return sendWebhookRequest(url, data, retryCount + 1);
		} else {
			throw error;
		}
	}
}

/**
 * Test invoice webhook with different data variations
 * @returns {Promise<object[]>} Test results
 */
async function testInvoiceWebhook() {
	const results = [];

	try {
		// Test 1: Standard invoice data
		console.log('\n🧪 Test 1: Standard Rechnungs-Webhook...');
		const result1 = await sendWebhookRequest(
			`${CONFIG.n8nBaseUrl}${CONFIG.webhookPath}`,
			testInvoiceData
		);
		results.push({ test: 'standard', ...result1 });

		// Test 2: Variation with different customer data
		console.log('\n🧪 Test 2: Rechnungs-Webhook (Variation)...');
		const variationData = {
			...testInvoiceData,
			customerName: 'Anna Schmidt',
			customerEmail: 'anna@example.com',
			invoiceNumber: 'DP-INV-1703123456789-002',
			items: [
				{
					description: '6-MONATS PLAN - Monatlich',
					quantity: 1,
					unitPrice: 5.98,
					total: 5.98
				}
			],
			subtotal: 5.98,
			taxAmount: 1.14,
			totalAmount: 7.12,
			donationAmount: 0.18,
			donationPercentage: 3
		};

		const result2 = await sendWebhookRequest(
			`${CONFIG.n8nBaseUrl}${CONFIG.webhookPath}`,
			variationData
		);
		results.push({ test: 'variation', ...result2 });

		// Test 3: Without donation
		console.log('\n🧪 Test 3: Rechnungs-Webhook (Ohne Spende)...');
		const noDonationData = {
			...testInvoiceData,
			customerName: 'Peter Müller',
			customerEmail: 'peter@example.com',
			invoiceNumber: 'DP-INV-1703123456789-003',
			donationAmount: 0,
			donationPercentage: 0
		};

		const result3 = await sendWebhookRequest(
			`${CONFIG.n8nBaseUrl}${CONFIG.webhookPath}`,
			noDonationData
		);
		results.push({ test: 'no-donation', ...result3 });

		return results;
	} catch (error) {
		console.error('❌ Test Error:', error.message);
		throw error;
	}
}

/**
 * Test invoice service integration
 * @returns {Promise<object>} Test result
 */
async function testInvoiceService() {
	console.log('\n🧪 Teste InvoiceService...');

	// Simulate PayPal Payment Details
	const paymentDetails = {
		purchase_units: [
			{
				amount: { value: '3.98' }
			}
		],
		selectedPlan: '3-MONATS PLAN',
		paymentType: 'monatlich',
		includeDonation: true
	};

	const customerData = {
		first_name: 'Max',
		last_name: 'Mustermann',
		email: 'test@example.com'
	};

	try {
		console.log('📋 Erstelle Rechnungsdaten...');
		console.log('💰 Payment Details:', paymentDetails);
		console.log('👤 Customer Data:', customerData);

		// Simulate invoice data creation
		const invoiceData = {
			invoiceNumber: 'DP-INV-' + Date.now() + '-001',
			date: new Date().toISOString().split('T')[0],
			dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
			customer: {
				name: customerData.first_name + ' ' + customerData.last_name,
				email: customerData.email
			},
			items: [
				{
					description: '3-MONATS PLAN - Monatlich',
					quantity: 1,
					unitPrice: 3.98,
					total: 3.98
				}
			],
			subtotal: 3.98,
			taxAmount: 0.76,
			taxRate: 19,
			total: 4.74,
			currency: 'EUR',
			donationAmount: 0.12,
			donationPercentage: 3,
			paymentMethod: 'PayPal',
			transactionId: 'TEST-' + Date.now()
		};

		console.log('📄 Erstellte Rechnungsdaten:', invoiceData);

		// Test webhook call
		const result = await sendWebhookRequest(`${CONFIG.n8nBaseUrl}${CONFIG.webhookPath}`, {
			type: 'invoice',
			...invoiceData
		});

		return { test: 'invoice-service', ...result };
	} catch (error) {
		console.error('❌ InvoiceService Error:', error);
		throw error;
	}
}

/**
 * Main test runner function
 * @returns {Promise<void>}
 */
async function runTests() {
	console.log('🚀 Starte Rechnungs-Tests...\n');
	console.log('='.repeat(60));

	try {
		const webhookResults = await testInvoiceWebhook();
		const serviceResult = await testInvoiceService();

		const results = [...webhookResults, serviceResult];

		console.log('\n' + '='.repeat(60));
		console.log('📊 Test Results Summary:');
		console.log('='.repeat(60));

		results.forEach((result, index) => {
			const status = result.success ? '✅ PASS' : '❌ FAIL';
			console.log(`${index + 1}. ${result.test}: ${status} (${result.statusCode})`);
		});

		const passedTests = results.filter((r) => r.success).length;
		const totalTests = results.length;

		console.log('\n' + '='.repeat(60));
		console.log(`🎯 Final Result: ${passedTests}/${totalTests} Tests erfolgreich`);
		console.log('='.repeat(60));

		if (passedTests === totalTests) {
			console.log('✅ Alle Tests abgeschlossen!');
			process.exit(0);
		} else {
			console.log('❌ Einige Tests fehlgeschlagen!');
			process.exit(1);
		}
	} catch (error) {
		console.error('❌ Test Suite Error:', error.message);
		process.exit(1);
	}
}

// Export for E2E testing
export {
	sendWebhookRequest,
	testInvoiceWebhook,
	testInvoiceService,
	runTests,
	testInvoiceData,
	CONFIG
};

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	runTests();
}
