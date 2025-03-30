<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import type { PayPalOrderDetails } from '$lib/utils/payment';
	import Modal from './Modal.svelte';
	import { modalStore } from '$lib/stores/modalStore';
	import { formatTime, AnimationSequencer } from '$lib/utils/animation';

	// Import confetti function if available
	let confetti: Function | undefined;

	// Dynamisch importieren, damit es nur im Browser ausgeführt wird
	if (typeof window !== 'undefined') {
		import('$lib/utils/confetti').then((module) => {
			confetti = module.default;
		});
	}

	interface Props {
		onClose: () => void;
		data?: any;
	}

	const { onClose, data = {} } = $props<Props>();

	// Daten aus dem Store extrahieren
	const storeData = $derived($modalStore.type === 'success' ? $modalStore.data || {} : {});

	// Kombiniere Daten aus Props und Store mit Vorrang für Store-Daten
	const paymentData = $derived({
		...data,
		...storeData
	});

	// Daten extrahieren
	const selectedPlan = $derived(paymentData?.selectedPlan || '');
	const paymentType = $derived(paymentData?.paymentType || 'einmalig');
	const paymentDetails = $derived(paymentData?.details || null);
	const includeDonation = $derived(paymentData?.includeDonation || false);
	const donationAmount = $derived(paymentData?.donationAmount || 0);
	const customerName = $derived(paymentData?.customerName || '');
	const redirectUrl = $derived(paymentData?.redirectUrl || '');

	// Animation States
	let showCheckmark = $state(false);
	let showConfetti = $state(false);
	let showNextSteps = $state(false);
	let progress = $state(0);

	// Animation Sequencer für ordentliches Timing
	const animationSequencer = new AnimationSequencer();

	// Nächste Schritte zum Erfolg
	const nextSteps = [
		'Überprüfe deine E-Mail für die Zahlungsbestätigung',
		'Entdecke nützliche Ressourcen in deinem Dashboard',
		'Lade ein Teammitglied ein für bessere Ergebnisse'
	];

	// Animierter Countdown für begrenzte Angebote
	const upsellSeconds = tweened(1800, {
		// 30 Minuten
		duration: 1000,
		easing: cubicOut
	});

	// Animierte Darstellung der Spende
	const animatedDonation = tweened(0, {
		duration: 1200,
		easing: cubicOut
	});

	// Animation sequence starten
	function startAnimationSequence() {
		// Alle bestehenden Timer löschen
		animationSequencer.clearAll();

		// Progress-Animation starten
		let progressComplete = false;
		animationSequencer.addInterval(() => {
			if (progress < 100) {
				progress += 1;
				return false;
			} else {
				progressComplete = true;
				return true;
			}
		}, 20);

		// Animationssequenz
		animationSequencer.add(() => {
			showCheckmark = true;
		}, 500);

		animationSequencer.add(() => {
			showConfetti = true;
			triggerConfetti();
		}, 1000);

		animationSequencer.add(() => {
			showNextSteps = true;
		}, 1500);

		// Upsell Countdown starten
		upsellSeconds.set(1800);
		animationSequencer.addInterval(() => {
			upsellSeconds.update((val) => Math.max(0, val - 1));
			return false; // Niemals automatisch beenden
		}, 1000);

		// Donation-Animation starten wenn vorhanden
		if (includeDonation && donationAmount > 0) {
			animatedDonation.set(donationAmount);
		}
	}

	// Confetti-Animation auslösen
	function triggerConfetti() {
		if (typeof window !== 'undefined' && confetti) {
			confetti({
				particleCount: 300, // Erhöht für besseren visuellen Effekt
				spread: 100, // Breitere Verteilung
				origin: { y: 0.5 }, // Mitte des Bildschirms
				colors: ['#FF5252', '#FFD740', '#2196F3', '#4CAF50', '#9C27B0'] // Bunte Farben
			});
		}
	}

	// Event Tracking
	function trackEvent(action: string) {
		if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
			window.gtag('event', action, {
				event_category: 'success_modal',
				event_label: paymentType
			});
		}
	}

	// Zum Dashboard weiterleiten
	function redirectToDashboard() {
		if (redirectUrl) {
			trackEvent('redirect_to_dashboard');
			window.location.href = redirectUrl;
		}
	}

	// Effekt wenn Modal geöffnet wird via Store
	$effect(() => {
		const isSuccessModalOpen = $modalStore.isOpen && $modalStore.type === 'success';

		if (isSuccessModalOpen) {
			console.log('Success modal opened with data:', $modalStore.data);

			// States zurücksetzen
			progress = 0;
			showCheckmark = false;
			showConfetti = false;
			showNextSteps = false;

			// Animation starten
			startAnimationSequence();

			// Event tracken
			trackEvent('success_modal_viewed');
		}
	});

	// Clean up
	onDestroy(() => {
		animationSequencer.clearAll();
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
		label: redirectUrl ? 'Zum Dashboard' : 'Schließen',
		onClick: redirectUrl ? redirectToDashboard : onClose,
		variant: 'primary'
	}}
>
	<!-- Success Modal Content -->
	<div class="success-modal-content">
		<!-- Header mit animiertem Fortschrittsbalken -->
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

					<!-- Pulsierende Ringe -->
					<div class="absolute -inset-1 animate-ping rounded-full bg-green-200 opacity-75"></div>
					<div
						class="absolute -inset-3 animate-ping rounded-full bg-green-100 opacity-50"
						style="animation-delay: 0.3s"
					></div>
				{/if}
			</div>
		</div>

		<!-- Hauptnachricht -->
		<div class="mb-8 text-center">
			<h3 class="mb-1 text-2xl font-bold text-gray-900" in:fly={{ y: 30, duration: 600 }}>
				🎉 Perfekt! Deine Bestellung ist erfolgreich
			</h3>
			<p class="mb-4 text-lg text-gray-700" in:fly={{ y: 20, duration: 600, delay: 200 }}>
				Wir haben dein {selectedPlan || 'Paket'} für dich freigeschaltet
			</p>

			<!-- Zahlungsdetails -->
			<div
				class="mx-auto mb-6 max-w-md rounded-xl bg-gray-50 p-4 shadow-sm"
				in:fly={{ y: 20, duration: 500, delay: 400 }}
			>
				<div class="flex items-center justify-between border-b border-gray-200 pb-3">
					<span class="text-sm font-medium text-gray-500">Zahlungs-ID</span>
					<span class="font-mono text-sm text-gray-700"
						>{paymentDetails?.id || 'DP-' + Math.random().toString(36).substr(2, 9)}</span
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

		<!-- Spenden-Feedback wenn aktiviert -->
		{#if includeDonation && $animatedDonation > 0}
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

					<!-- Impact-Visualisierung -->
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

		<!-- Nächste Schritte -->
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

		<!-- Exklusives Upgrade-Angebot (Upsell) -->
		<div
			class="mb-8 overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg"
			in:fly={{ y: 20, duration: 500, delay: 1000 }}
		>
			<div class="relative p-5 text-white">
				<!-- Zeitlich begrenztes Angebot Badge -->
				<div
					class="absolute -right-8 top-4 rotate-45 bg-yellow-400 px-10 py-1 text-center text-xs font-bold uppercase text-gray-800 shadow-md"
				>
					Exklusiv
				</div>

				<div class="flex flex-col md:flex-row md:items-center">
					<div class="mb-4 md:mb-0 md:flex-1">
						<h4 class="mb-1 text-lg font-bold">Erweitere dein Paket und spare 30%</h4>
						<p class="text-sm text-indigo-100">
							Nur für Neukunden: Füge jetzt Premium-Features hinzu und hebe dein Ergebnis auf das
							nächste Level!
						</p>

						<!-- Countdown-Timer -->
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

		<!-- Verweise und Support-Infos -->
		<div class="mb-6 text-center" in:fade={{ duration: 500, delay: 1200 }}>
			<p class="mb-2 text-sm text-gray-600">
				Eine Bestätigung mit allen Details wurde an deine E-Mail-Adresse gesendet.
			</p>
			<p class="text-sm text-gray-500">
				Fragen? Kontaktiere unseren <a
					href="mailto:support@digitalpusher.de"
					class="font-medium text-blue-600 hover:underline">Kundensupport</a
				>
			</p>
		</div>

		<!-- Action-Buttons -->
		<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
			{#if redirectUrl}
				<button
					class="btn btn-primary flex items-center justify-center gap-2"
					on:click={() => {
						trackEvent('redirect_clicked');
						window.location.href = redirectUrl;
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
			{:else}
				<button
					class="btn btn-outline flex items-center justify-center gap-2"
					on:click={() => {
						trackEvent('share_clicked');
						// Hier könnte eine Share-Funktion implementiert werden
					}}
				>
					<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
						<path
							d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
						/>
					</svg>
					Teilen
				</button>
			{/if}
		</div>
	</div>
</Modal>

<style>
	/* Zusätzliche Styles für Animationen */
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
