/**
 * Website Analysis Integration Tests
 * Tests the integration between Svelte app and n8n workflow for website analysis
 *
 * Usage:
 * - CLI: node e2e/test-website-analysis-integration.js
 * - E2E: npm run test:e2e
 * - Frontend: Import and use in browser tests
 */

import https from 'https';

// Configuration
const CONFIG = {
	n8nBaseUrl: 'https://n8n.chooomedia.com',
	webhookPath: '/webhook/websitehealth__done',
	timeout: 10000,
	retries: 3
};

// Test data for website analysis webhook
const websiteAnalysisData = {
	email: 'test@example.com',
	language: 'de',
	formData: {
		visibility: ['search_engines', 'social_media'],
		advertising_frequency: 'weekly',
		goals: 'more_online',
		campaign_management: 'digitalpusher',
		online_reviews: 'none',
		previous_campaigns: 'no',
		business_phase: 'less_than_6_months',
		implementation_time: 'immediate',
		company_name: 'Test Company',
		company_url: 'https://example.com',
		salutation: 'Herr',
		first_name: 'Max',
		last_name: 'Mustermann',
		email: 'test@example.com',
		phone: '+49123456789',
		privacy_agreement: true,
		marketing_consent: true,
		visibility_score: 65,
		language: 'de'
	},
	templateData: {
		templateTexts: {
			title: 'Ihre Website-Analyse Ergebnisse',
			subtitle: 'Hier sind Ihre individuellen Analyseergebnisse',
			companyName: 'Unternehmen',
			website: 'Website',
			score: {
				title: 'Ihr Marketing Score',
				low: {
					title: 'Kritisch! Ihr Unternehmen ist kaum sichtbar.',
					suggestion: 'Wir zeigen Ihnen, wie Sie sofort mehr Kunden erreichen.'
				},
				medium: {
					title: 'Ihre Sichtbarkeit kann verbessert werden.',
					suggestion: 'Steigern Sie Ihre Reichweite durch intelligente Online-Marketing-Strategien.'
				},
				high: {
					title: 'Gut! Aber es gibt noch Potenzial.',
					suggestion: 'Mit gezielter Optimierung können Sie noch mehr Sichtbarkeit gewinnen.'
				},
				excellent: {
					title: 'Ausgezeichnet! Ihre digitale Präsenz ist herausragend.',
					suggestion: 'Nutzen Sie erweiterte Strategien, um Ihre Dominanz weiter auszubauen!'
				}
			},
			recommendations: {
				title: 'Unsere Empfehlungen',
				website: 'Website-Optimierung für bessere Nutzererfahrung',
				content: 'Content-Strategie zur Steigerung der Sichtbarkeit',
				performance:
					'Verbessern Sie die Website-Ladegeschwindigkeit durch Optimierung von Bildern und Scripts',
				seo: 'SEO-Optimierung durch verbesserte Meta-Tags und strukturierte Daten',
				accessibility: 'Verbessern Sie die Zugänglichkeit für besseren Zugang',
				contentQuality:
					'Optimieren Sie die Content-Qualität durch bessere Strukturierung und Keywords',
				basicSeo: 'Grundlegende SEO-Optimierung Ihrer Website',
				googleBusiness: 'Erstellen Sie ein Google Business Profil',
				advancedSeo: 'Erweiterte SEO-Maßnahmen für mehr organischen Traffic',
				localSeo: 'Lokale SEO-Optimierung für regionale Sichtbarkeit',
				contentMarketing: 'Content-Marketing-Strategie zur Stärkung Ihrer Marktposition',
				backlinks: 'Backlink-Aufbau zur Steigerung der Domain-Autorität',
				extendedContent: 'Erweiterte Content-Strategie für maximale Sichtbarkeit',
				competitorAnalysis: 'Wettbewerbsanalyse zur Identifizierung von Wachstumschancen'
			},
			contact: 'Kontakt',
			language: 'de'
		},
		visibility: 'Suchmaschinen, Social Media',
		advertising_frequency: 'Wöchentlich',
		goals: 'Mehr Online-Präsenz',
		campaign_management: 'Digital Pusher',
		online_reviews: 'none',
		previous_campaigns: 'no',
		business_phase: 'Jünger als 6 Monate',
		implementation_time: 'Sofortige Umsetzung',
		company_name: 'Test Company',
		company_url: 'https://example.com',
		salutation: 'Herr',
		first_name: 'Max',
		last_name: 'Mustermann',
		email: 'test@example.com',
		phone: '+49123456789',
		privacy_agreement: 'true',
		marketing_consent: 'true',
		visibility_score: '65',
		language: 'de'
	}
};

/**
 * Send HTTP request to n8n webhook
 * @param {string} url - Webhook URL
 * @param {object} data - Data to send
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<object>} Response data
 */
function sendWebhookRequest(url, data, retryCount = 0) {
	return new Promise((resolve, reject) => {
		const postData = JSON.stringify(data);

		const options = {
			hostname: CONFIG.n8nBaseUrl.replace('https://', ''),
			port: 443,
			path: CONFIG.webhookPath,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(postData),
				'User-Agent': 'Website-Analysis-Test/1.0'
			},
			timeout: CONFIG.timeout
		};

		console.log(`🧪 Teste Website-Analyse Webhook (Attempt ${retryCount + 1})...`);
		console.log('📤 Sende Test-Daten:', JSON.stringify(data, null, 2));

		const req = https.request(options, (res) => {
			let responseData = '';

			res.on('data', (chunk) => {
				responseData += chunk;
			});

			res.on('end', () => {
				console.log('📥 Response Status:', res.statusCode);
				console.log('📥 Response Headers:', res.headers);

				if (res.statusCode === 200) {
					console.log('✅ Webhook erfolgreich! Response:', responseData);
					resolve({
						statusCode: res.statusCode,
						headers: res.headers,
						data: responseData,
						success: true
					});
				} else {
					console.log('❌ Webhook fehlgeschlagen! Response:', responseData);
					resolve({
						statusCode: res.statusCode,
						headers: res.headers,
						data: responseData,
						success: false
					});
				}
			});
		});

		req.on('error', (error) => {
			console.error('❌ Request Error:', error.message);

			// Retry logic
			if (retryCount < CONFIG.retries - 1) {
				console.log(`🔄 Retrying... (${retryCount + 1}/${CONFIG.retries})`);
				setTimeout(
					() => {
						sendWebhookRequest(url, data, retryCount + 1)
							.then(resolve)
							.catch(reject);
					},
					1000 * (retryCount + 1)
				);
			} else {
				reject(error);
			}
		});

		req.on('timeout', () => {
			req.destroy();
			console.error('❌ Request Timeout');
			reject(new Error('Request timeout'));
		});

		req.write(postData);
		req.end();
	});
}

/**
 * Test website analysis webhook with different data variations
 * @returns {Promise<object[]>} Test results
 */
async function testWebsiteAnalysisWebhook() {
	const results = [];

	try {
		// Test 1: Standard website analysis data
		console.log('\n🧪 Test 1: Standard Website-Analyse Webhook...');
		const result1 = await sendWebhookRequest(
			`${CONFIG.n8nBaseUrl}${CONFIG.webhookPath}`,
			websiteAnalysisData
		);
		results.push({ test: 'standard', ...result1 });

		// Test 2: Variation with different company data
		console.log('\n🧪 Test 2: Website-Analyse Webhook (Variation)...');
		const variationData = {
			...websiteAnalysisData,
			email: 'variation@example.com',
			formData: {
				...websiteAnalysisData.formData,
				company_name: 'Variation Company',
				company_url: 'https://variation.com',
				visibility_score: 45
			}
		};

		const result2 = await sendWebhookRequest(
			`${CONFIG.n8nBaseUrl}${CONFIG.webhookPath}`,
			variationData
		);
		results.push({ test: 'variation', ...result2 });

		// Test 3: English language variation
		console.log('\n🧪 Test 3: Website-Analyse Webhook (English)...');
		const englishData = {
			...websiteAnalysisData,
			language: 'en',
			email: 'english@example.com',
			formData: {
				...websiteAnalysisData.formData,
				language: 'en',
				company_name: 'English Company',
				company_url: 'https://english.com'
			}
		};

		const result3 = await sendWebhookRequest(
			`${CONFIG.n8nBaseUrl}${CONFIG.webhookPath}`,
			englishData
		);
		results.push({ test: 'english', ...result3 });

		return results;
	} catch (error) {
		console.error('❌ Test Error:', error.message);
		throw error;
	}
}

/**
 * Main test runner function
 * @returns {Promise<void>}
 */
async function runTests() {
	console.log('🚀 Starte Website-Analyse Tests...\n');
	console.log('='.repeat(60));

	try {
		const results = await testWebsiteAnalysisWebhook();

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
export { sendWebhookRequest, testWebsiteAnalysisWebhook, runTests, websiteAnalysisData, CONFIG };

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	runTests();
}
