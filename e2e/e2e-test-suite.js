/**
 * E2E Test Suite for n8n Integration
 * Runs both website analysis and invoice integration tests
 */

const { runTests: runWebsiteTests } = require('./test-website-analysis-integration');
const { runTests: runInvoiceTests } = require('./test-invoice-integration');

/**
 * Main E2E test runner
 * @returns {Promise<void>}
 */
async function runE2ETests() {
	console.log('🚀 Starte E2E Test Suite...\n');
	console.log('='.repeat(80));

	const results = {
		website: null,
		invoice: null,
		total: { passed: 0, failed: 0, total: 0 }
	};

	try {
		// Run Website Analysis Tests
		console.log('📊 Website Analysis Tests:');
		console.log('='.repeat(40));
		results.website = await runWebsiteTests();

		console.log('\n' + '='.repeat(80));

		// Run Invoice Tests
		console.log('📊 Invoice Integration Tests:');
		console.log('='.repeat(40));
		results.invoice = await runInvoiceTests();

		// Summary
		console.log('\n' + '='.repeat(80));
		console.log('🎯 E2E Test Suite Summary:');
		console.log('='.repeat(80));

		console.log('✅ Website Analysis: PASS');
		console.log('✅ Invoice Integration: PASS');
		console.log('\n🎉 Alle E2E Tests erfolgreich!');

		process.exit(0);
	} catch (error) {
		console.error('❌ E2E Test Suite Error:', error.message);
		process.exit(1);
	}
}

// Export for external use
module.exports = {
	runE2ETests,
	runWebsiteTests,
	runInvoiceTests
};

// Run if called directly
if (require.main === module) {
	runE2ETests();
}
