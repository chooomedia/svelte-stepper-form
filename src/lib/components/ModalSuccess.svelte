<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { elasticOut, cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import Modal from './Modal.svelte';
	import { modalStore } from '$lib/stores/modalStore';
	import { formatTime } from '$lib/utils/animation';
	import { type PayPalOrderDetails } from '$lib/utils/payment';

	interface Props {
		onClose: () => void;
		data?: {
			details?: PayPalOrderDetails | null;
			selectedPlan?: string;
			paymentType?: 'monatlich' | 'einmalig' | 'longtime';
			includeDonation?: boolean;
			donationAmount?: number;
			customerName?: string;
			redirectUrl?: string;
		};
	}

	const { onClose = () => {}, data = {} } = $props<Props>();

	// Dynamic import of confetti to ensure it only runs in browser
	let confetti: Function | undefined;
	if (typeof window !== 'undefined') {
		import('$lib/utils/confetti').then((module) => {
			confetti = module.default;
		});
	}

	// State management
	let showCheckmark = $state(false);
	let showConfetti = $state(false);
	let showNextSteps = $state(false);
	let progress = $state(0);

	// Animation timers
	let timers: number[] = [];

	// Countdown for special offer
	const upsellSeconds = tweened(30, {
		duration: 1000,
		easing: cubicOut
	});

	// Donation animation
	const animatedDonation = tweened(0, {
		duration: 1200,
		easing: cubicOut
	});

	// Content information
	const nextSteps = [
		'Überprüfe deine E-Mail für die Zahlungsbestätigung',
		'Entdecke nützliche Ressourcen in deinem Dashboard',
		'Lade ein Teammitglied ein für bessere Ergebnisse'
	];

	// Helper functions
	function addTimer(callback: () => void, delay: number) {
		const id = setTimeout(callback, delay);
		timers.push(id);
		return id;
	}

	function clearAllTimers() {
		timers.forEach((id) => clearTimeout(id));
		timers = [];
	}

	function triggerConfetti() {
		if (typeof window !== 'undefined' && confetti) {
			confetti({
				particleCount: 200,
				spread: 100,
				origin: { y: 0.5 },
				colors: ['#FF5252', '#FFD740', '#2196F3', '#4CAF50', '#9C27B0']
			});
		}
	}

	function trackEvent(action: string) {
		if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
			const paymentData = $modalStore.data || {};
			window.gtag('event', action, {
				event_category: 'success_modal',
				event_label: paymentData.paymentType || 'unknown'
			});
		}
	}

	function redirectToDashboard() {
		const paymentData = data || $modalStore.data || {};
		if (paymentData.redirectUrl) {
			trackEvent('redirect_to_dashboard');
			window.location.href = paymentData.redirectUrl;
		}
	}

	function startAnimations() {
		// Reset state
		clearAllTimers();
		progress = 0;
		showCheckmark = false;
		showConfetti = false;
		showNextSteps = false;

		// Progress animation
		const progressInterval = setInterval(() => {
			if (progress < 100) {
				progress += 1;
			} else {
				clearInterval(progressInterval);
			}
		}, 20);

		// Animation sequence
		addTimer(() => {
			showCheckmark = true;
		}, 3500);
		addTimer(() => {
			showConfetti = true;
			triggerConfetti();
		}, 31000);
		addTimer(() => {
			showNextSteps = true;
		}, 31500);

		// Countdown timer
		upsellSeconds.set(1800);
		const countdownInterval = setInterval(() => {
			upsellSeconds.update((val) => Math.max(0, val - 1));
		}, 31000);
		timers.push(countdownInterval as unknown as number);

		// Donation animation if applicable
		const paymentData = data || $modalStore.data || {};
		if (paymentData.includeDonation && paymentData.donationAmount > 0) {
			animatedDonation.set(paymentData.donationAmount);
		}

		// Track view event
		trackEvent('success_modal_viewed');
	}

	// Effect to handle modal open state
	$effect(() => {
		const isSuccessModalOpen = $modalStore.isOpen && $modalStore.type === 'success';

		if (isSuccessModalOpen) {
			startAnimations();
		}
	});

	// Cleanup on component destroy
	onDestroy(() => {
		clearAllTimers();
	});
</script>

<Modal
	isOpen={$modalStore.isOpen && $modalStore.type === 'success'}
	{onClose}
	type="success"
	title="Zahlung erfolgreich!"
	subtitle="Vielen Dank für Deinen Kauf."
	size="xl"
	primaryAction={{
		label: data?.redirectUrl || $modalStore.data?.redirectUrl ? 'Zum Dashboard' : 'Schließen',
		onClick: data?.redirectUrl || $modalStore.data?.redirectUrl ? redirectToDashboard : onClose,
		variant: 'primary'
	}}
>
	<!-- Success Modal Content -->
	<div class="success-modal-content">
		<!-- Progress Bar -->
		<div class="relative mb-8">
			<div class="h-1.5 w-full rounded-full bg-gray-100">
				<div
					class="h-full rounded-full bg-green-500 transition-all duration-300 ease-out"
					style="width: {progress}%"
				></div>
			</div>
		</div>

		<!-- Success Animation -->
		<div class="mb-10 flex justify-center">
			<div
				class="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-500"
				in:scale={{ duration: 800, easing: elasticOut }}
			>
				{#if showCheckmark}
					<svg
						class="h-12 w-12"
						in:scale={{ duration: 600, delay: 200, easing: elasticOut }}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"
						></path>
					</svg>

					<!-- Animated rings -->
					<div class="absolute -inset-1 animate-ping rounded-full bg-green-200 opacity-75"></div>
					<div
						class="absolute -inset-3 animate-ping rounded-full bg-green-100 opacity-50"
						style="animation-delay: 0.3s"
					></div>
				{/if}
			</div>
		</div>

		<!-- Main Message -->
		<div class="mb-8 text-center">
			<h3 class="mb-1 text-2xl font-bold text-gray-900" in:fly={{ y: 30, duration: 600 }}>
				🎉 Perfekt! Deine Bestellung ist erfolgreich
			</h3>
			<p class="mb-4 text-lg text-gray-700" in:fly={{ y: 20, duration: 600, delay: 200 }}>
				Wir haben dein {data?.selectedPlan || $modalStore.data?.selectedPlan || 'Paket'} für dich freigeschaltet
			</p>

			<!-- Payment Details -->
			<div
				class="mx-auto mb-6 rounded-xl bg-gray-50 p-4 shadow-sm"
				in:fly={{ y: 20, duration: 500, delay: 400 }}
			>
				<div class="flex items-center justify-between border-b border-gray-200 pb-3">
					<span class="text-sm font-medium text-gray-500">Zahlungs-ID</span>
					<span class="font-mono text-sm text-gray-700"
						>{data?.details?.id ||
							$modalStore.data?.details?.id ||
							'DP-' + Math.random().toString(36).substr(2, 9)}</span
					>
				</div>
				<div class="flex items-center justify-between py-3">
					<span class="text-sm font-medium text-gray-500">Datum</span>
					<span class="text-sm text-gray-700">{new Date().toLocaleDateString('de-DE')}</span>
				</div>
				<div class="flex items-center justify-between border-t border-gray-200 pt-3">
					<span class="text-sm font-medium text-gray-500">Status</span>
					<span class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
						>Bezahlt</span
					>
				</div>
			</div>
		</div>

		<!-- Donation Feedback (if applicable) -->
		{#if $modalStore.data?.includeDonation && $animatedDonation > 0}
			<div
				class="mb-8 overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50 shadow-sm"
				in:fly={{ y: 30, duration: 500, delay: 600 }}
			>
				<div class="p-4">
					<div class="flex items-center">
						<div class="mr-4 flex-shrink-0">
							<div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
								<svg class="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
									/>
								</svg>
							</div>
						</div>
						<div>
							<h4 class="mb-1 font-semibold text-emerald-700">Impact bereit!</h4>
							<p class="text-sm text-emerald-700">
								Deine großzügige Spende von <span class="font-mono font-bold"
									>{$animatedDonation.toFixed(2).replace('.', ',')}€</span
								>
								unterstützt wichtige Umweltprojekte. Zusammen bewirken wir Großes!
							</p>
						</div>
					</div>

					<!-- Impact Visualization -->
					<div class="mt-3 flex justify-between gap-2 rounded-md bg-white p-3">
						<div class="text-center">
							<div class="text-lg font-bold text-emerald-600">93%</div>
							<div class="text-xs text-gray-500">Direkte Hilfe</div>
						</div>
						<div class="text-center">
							<div class="text-lg font-bold text-emerald-600">5+</div>
							<div class="text-xs text-gray-500">Projekte</div>
						</div>
						<div class="text-center">
							<div class="text-lg font-bold text-emerald-600">100%</div>
							<div class="text-xs text-gray-500">Transparenz</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Next Steps -->
		{#if showNextSteps}
			<div
				class="mb-8 rounded-lg border border-blue-100 bg-blue-50 p-4"
				in:fly={{ y: 20, duration: 500, delay: 800 }}
			>
				<h4 class="mb-3 font-medium text-blue-700">Deine nächsten Schritte:</h4>
				<ul class="space-y-2">
					{#each nextSteps as step, i}
						<li class="flex items-start" in:fly={{ x: -20, duration: 300, delay: 1000 + i * 150 }}>
							<div
								class="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-700"
							>
								{i + 1}
							</div>
							<span class="text-sm text-blue-700">{step}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Exclusive Upgrade Offer -->
		<div
			class="mb-8 overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg"
			in:fly={{ y: 20, duration: 500, delay: 1000 }}
		>
			<div class="relative p-5 text-white">
				<!-- Limited Time Offer Badge -->
				<div
					class="absolute -right-9 top-4 rotate-45 bg-yellow-400 px-10 py-1 text-center text-xs font-bold uppercase text-gray-800 shadow-md"
				>
					Exklusiv
				</div>

				<div class="flex-end flex flex-col md:flex-row md:items-center">
					<div class="mb-4 text-left md:mb-0 md:flex-1">
						<h4 class="mb-1 text-lg font-bold">Erweitere dein Paket und spare 30%</h4>
						<p class="text-sm text-indigo-100">
							Nur für Neukunden: Füge jetzt Premium-Features hinzu und hebe dein Ergebnis auf das
							nächste Level!
						</p>

						<!-- Countdown Timer -->
						<div class="mt-2 flex items-center text-xs font-medium text-indigo-100">
							<svg class="mr-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Angebot endet in <span class="ml-1 font-mono">{formatTime($upsellSeconds)}</span>
						</div>
					</div>

					<div class="flex-shrink-0">
						<button
							class="btn btn-sm bg-white px-4 font-bold text-indigo-600 transition-transform hover:scale-105 hover:shadow-lg"
							on:click={() => trackEvent('upsell_clicked')}
						>
							Upgrade sichern
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Support Information -->
		<div class="mb-6 text-center" in:fade={{ duration: 500, delay: 1200 }}>
			<p class="mb-2 text-sm text-gray-600">
				Eine Bestätigung mit allen Details wurde an deine E-Mail-Adresse gesendet.
			</p>
			<p class="text-sm text-gray-500">
				Fragen? Kontaktiere unseren
				<a href="mailto:support@digitalpusher.de" class="font-medium text-blue-600 hover:underline"
					>Kundensupport</a
				>
			</p>
		</div>

		<!-- Action Buttons -->
		<div class="mt-8 flex flex-row gap-3 sm:justify-center sm:gap-4">
			<button
				class="btn btn-primary flex items-center justify-center gap-2"
				on:click={() => {
					trackEvent('redirect_clicked');
					window.location.href = $modalStore.data.redirectUrl;
				}}
			>
				<span>Zum Dashboard</span>
				<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<button
				class="btn btn-outline flex items-center justify-center gap-2"
				on:click={() => {
					trackEvent('share_clicked');
				}}
			>
				<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
					<path
						d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
					/>
				</svg>
				Teilen
			</button>
		</div>
	</div>
</Modal>

<style>
	/* Animation styles */
	@keyframes pulse-ring {
		0% {
			transform: scale(0.8);
			opacity: 0.8;
		}
		70% {
			transform: scale(1.2);
			opacity: 0;
		}
		100% {
			transform: scale(1.2);
			opacity: 0;
		}
	}

	@keyframes shine {
		0% {
			background-position: -100px;
		}
		40%,
		100% {
			background-position: 300px;
		}
	}

	.btn-primary {
		position: relative;
		overflow: hidden;
	}

	.btn-primary::after {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: linear-gradient(
			to right,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.3) 50%,
			rgba(255, 255, 255, 0) 100%
		);
		transform: rotate(30deg);
		animation: shine 4s infinite;
	}
</style>
