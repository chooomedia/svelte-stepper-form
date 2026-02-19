<script lang="ts">
	import { i18n } from '$lib/i18n';
	import Icon from './Icon.svelte';

	let { 
		message = $derived($i18n.modal.payment.loading.default),
		showSpinner = true,
		showProgress = false,
		progress = 0,
		className = ''
	} = $props();

	// PayPal-specific loading messages based on current language
	const loadingMessages = $derived({
		de: {
			default: 'PayPal wird geladen...',
			initializing: 'PayPal wird initialisiert...',
			connecting: 'Verbindung zu PayPal wird hergestellt...',
			processing: 'Zahlung wird verarbeitet...',
			validating: 'Zahlung wird validiert...'
		},
		en: {
			default: 'Loading PayPal...',
			initializing: 'Initializing PayPal...',
			connecting: 'Connecting to PayPal...',
			processing: 'Processing payment...',
			validating: 'Validating payment...'
		},
		hu: {
			default: 'PayPal betöltése...',
			initializing: 'PayPal inicializálása...',
			connecting: 'Kapcsolódás a PayPal-hoz...',
			processing: 'Fizetés feldolgozása...',
			validating: 'Fizetés ellenőrzése...'
		},
		ar: {
			default: 'جاري تحميل PayPal...',
			initializing: 'جاري تهيئة PayPal...',
			connecting: 'جاري الاتصال بـ PayPal...',
			processing: 'جاري معالجة الدفع...',
			validating: 'جاري التحقق من الدفع...'
		},
		tr: {
			default: 'PayPal yükleniyor...',
			initializing: 'PayPal başlatılıyor...',
			connecting: 'PayPal\'a bağlanılıyor...',
			processing: 'Ödeme işleniyor...',
			validating: 'Ödeme doğrulanıyor...'
		},
		ro: {
			default: 'Se încarcă PayPal...',
			initializing: 'Se inițializează PayPal...',
			connecting: 'Se conectează la PayPal...',
			processing: 'Se procesează plata...',
			validating: 'Se validează plata...'
		},
		ru: {
			default: 'Загрузка PayPal...',
			initializing: 'Инициализация PayPal...',
			connecting: 'Подключение к PayPal...',
			processing: 'Обработка платежа...',
			validating: 'Проверка платежа...'
		}
	});

	// Get current language-specific messages
	const currentMessages = $derived(loadingMessages[$i18n.locale] || loadingMessages.en);
</script>

<div class="paypal-loading-container flex flex-col items-center justify-center p-8 {className}">
	<!-- PayPal Logo/Icon -->
	<div class="mb-4 flex items-center justify-center">
		<Icon 
			name="paypal" 
			className="h-12 w-12 text-blue-600 animate-pulse" 
		/>
	</div>

	<!-- Loading Spinner -->
	{#if showSpinner}
		<div class="mb-4">
			<div class="spinner h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
		</div>
	{/if}

	<!-- Loading Message -->
	<div class="text-center">
		<p class="text-lg font-medium text-gray-700 mb-2">
			{message}
		</p>
		
		<!-- Progress Bar -->
		{#if showProgress}
			<div class="w-64 bg-gray-200 rounded-full h-2 mb-2">
				<div 
					class="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
					style="width: {progress}%"
				></div>
			</div>
			<p class="text-sm text-gray-500">
				{Math.round(progress)}%
			</p>
		{/if}
	</div>

	<!-- Security Notice -->
	<div class="mt-4 text-center">
		<p class="text-xs text-gray-500 flex items-center justify-center gap-1">
			<Icon name="shield-check" className="h-3 w-3 text-green-600" />
			{$i18n.modal.payment.loading.securityNotice}
		</p>
	</div>
</div>

<style>
	.paypal-loading-container {
		min-height: 200px;
	}

	.spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* PayPal brand colors */
	:global(.paypal-loading-container .text-blue-600) {
		color: #0070ba;
	}

	:global(.paypal-loading-container .border-blue-600) {
		border-color: #0070ba;
	}

	:global(.paypal-loading-container .bg-blue-600) {
		background-color: #0070ba;
	}
</style>
