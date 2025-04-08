<!-- src/lib/components/modal/ModalContent/SuccessContent.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicInOut, cubicOut } from 'svelte/easing';
	import { formatTime } from '$lib/utils/animation';
	import Icon from '$lib/components/Icon.svelte';
	import { celebrationConfetti } from '$lib/utils/confetti';
	import { i18n } from '$lib/i18n';

	// Props
	const {
		paymentDetails = {},
		selectedPlan = '3-MONATS PLAN',
		paymentType = 'monatlich',
		donationAmount = 0,
		customerName = '',
		redirectUrl = '',
		onSuccess = () => {}
	} = $props();

	// State
	let showCheckmark = $state(false);
	let showConfetti = $state(false);
	let showNextSteps = $state(false);
	let showMainMessage = $state(false);
	let showPaymentDetails = $state(false);
	let showDonation = $state(false);
	let showUpgradeOffer = $state(false);
	let showSupportInfo = $state(false);
	let showActionButtons = $state(false);
	let progress = $state(0);
	let timers: number[] = [];

	// Animation controllers
	const upsellSeconds = tweened(0, {
		duration: 1000,
		easing: cubicInOut
	});

	const animatedDonation = tweened(0, {
		duration: 1200,
		easing: cubicInOut
	});

	// Helper for animations
	function addTimer(callback: () => void, delay: number) {
		const id = setTimeout(callback, delay);
		timers.push(id);
		return id;
	}

	function clearAllTimers() {
		timers.forEach(clearTimeout);
		timers = [];
	}

	// Trigger confetti effect
	function triggerConfetti() {
		showConfetti = true;
		celebrationConfetti();
		console.log('Confetti animation triggered');
	}

	// Track analytic events (optional)
	function trackEvent(action: string) {
		if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
			window.gtag('event', action, {
				event_category: 'success_modal',
				event_label: paymentType
			});
		}
	}

	// Handle redirect to dashboard
	function redirectToDashboard() {
		if (redirectUrl) {
			trackEvent('redirect_to_dashboard');
			window.location.href = redirectUrl;
		}
	}

	// Start animations in sequence
	function startAnimations() {
		// Reset state
		clearAllTimers();
		progress = 0;

		// Smooth Progress Animation
		const progressInterval = setInterval(() => {
			if (progress < 100) {
				progress += 0.5; // Noch sanfter
			} else {
				clearInterval(progressInterval);
			}
		}, 40);
		timers.push(progressInterval as unknown as number);

		// 1. Checkmark (sanft nach 700ms)
		addTimer(() => {
			showCheckmark = true;
		}, 700);

		// 2. Confetti sanft nach Checkmark (nach 1400ms)
		addTimer(() => {
			triggerConfetti();
		}, 1400);

		// 3. Hauptnachricht später für bessere Aufnahme (2100ms)
		addTimer(() => {
			showMainMessage = true;
		}, 2100);

		// 4. Zahlungsdetails mit Delay für sanftere Wahrnehmung (2800ms)
		addTimer(() => {
			showPaymentDetails = true;
		}, 2800);

		// 5. Donation Feedback falls vorhanden (3500ms)
		if (donationAmount > 0) {
			addTimer(() => {
				showDonation = true;
				animatedDonation.set(donationAmount);
			}, 3500);
		}

		// 6. Nächste Schritte (4200ms, später für bessere UX)
		addTimer(() => {
			showNextSteps = true;
		}, 4200);

		// 7. Support-Info (5000ms)
		addTimer(() => {
			showSupportInfo = true;
		}, 5000);

		// 8. Upgrade-Angebot **ganz zum Schluss** (6000ms)
		addTimer(() => {
			showUpgradeOffer = true;
		}, 6000);

		// 9. Action Buttons (6500ms, das Letzte)
		addTimer(() => {
			showActionButtons = true;
		}, 6500);

		// Track event
		trackEvent('success_modal_viewed');
	}

	// Lifecycle hooks
	onMount(() => {
		startAnimations();

		// Countdown für Sonderangebot
		upsellSeconds.set(1800);
		const countdownInterval = setInterval(() => {
			upsellSeconds.update((val) => Math.max(0, val - 1));
		}, 1000);
		timers.push(countdownInterval as unknown as number);
	});

	onDestroy(() => {
		clearAllTimers();
	});
</script>

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
			in:scale={{ duration: 800, easing: cubicOut }}
		>
			{#if showCheckmark}
				<svg
					class="h-12 w-12"
					in:scale={{ duration: 600, easing: cubicOut }}
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
	{#if showMainMessage}
		<div class="mb-8 text-center" in:fly={{ y: 30, duration: 600 }}>
			<h3 class="mb-1 text-2xl font-bold text-gray-900">
				🎉 {$i18n.modal.success.mainMessage}{customerName ? ', ' + customerName : ''}!
			</h3>
			<p class="mt-2 text-lg text-gray-700">
				{$i18n.modal.success.selectedPlan.replace('{plan}', selectedPlan)}
			</p>
		</div>
	{/if}

	<!-- Payment Details -->
	{#if showPaymentDetails}
		<div class="mx-auto mb-6 rounded-xl bg-white p-4 shadow-sm" in:fly={{ y: 20, duration: 500 }}>
			<div class="flex items-center justify-between border-b border-gray-200 pb-3">
				<span class="text-sm font-medium text-gray-500"
					>{$i18n.modal.success.paymentDetails.id}</span
				>
				<span class="font-mono text-sm text-gray-700">
					{paymentDetails?.id || 'DP-' + Math.random().toString(36).substr(2, 9)}
				</span>
			</div>
			<div class="flex items-center justify-between py-3">
				<span class="text-sm font-medium text-gray-500"
					>{$i18n.modal.success.paymentDetails.date}</span
				>
				<span class="text-sm text-gray-700">{new Date().toLocaleDateString('de-DE')}</span>
			</div>
			<div class="flex items-center justify-between border-t border-gray-200 pt-3">
				<span class="text-sm font-medium text-gray-500"
					>{$i18n.modal.success.paymentDetails.status}</span
				>
				<span class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
					>{$i18n.modal.success.paymentDetails.paid}</span
				>
			</div>
		</div>
	{/if}

	<!-- Donation Feedback (if applicable) -->
	{#if donationAmount > 0 && showDonation}
		<div
			class="mb-8 overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50 shadow-sm"
			in:fly={{ y: 30, duration: 500 }}
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
						<h4 class="mb-1 font-semibold text-emerald-700">
							{$i18n.modal.success.donation.title}
						</h4>
						<p class="text-sm text-emerald-700">
							{$i18n.modal.success.donation.description.replace(
								'{amount}',
								$animatedDonation.toFixed(2).replace('.', ',')
							)}
						</p>
					</div>
				</div>

				<!-- Impact Visualization -->
				<div class="mt-3 flex justify-between gap-2 rounded-md bg-white p-3">
					<div class="text-center">
						<div class="text-lg font-bold text-emerald-600">93%</div>
						<div class="text-xs text-gray-500">{$i18n.modal.success.donation.impact.direct}</div>
					</div>
					<div class="text-center">
						<div class="text-lg font-bold text-emerald-600">5+</div>
						<div class="text-xs text-gray-500">{$i18n.modal.success.donation.impact.projects}</div>
					</div>
					<div class="text-center">
						<div class="text-lg font-bold text-emerald-600">100%</div>
						<div class="text-xs text-gray-500">
							{$i18n.modal.success.donation.impact.transparency}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Next Steps -->
	{#if showNextSteps}
		<div
			class="mb-8 rounded-lg border border-primary-100 bg-blue-50 p-4"
			in:fly={{ y: 20, duration: 500 }}
		>
			<h4 class="mb-3 font-medium text-primary-700">{$i18n.modal.success.nextSteps.title}</h4>
			<ul class="space-y-3">
				{#each $i18n.modal.success.nextSteps.steps as step, i}
					<li class="flex items-start" in:fly={{ x: -20, duration: 400, delay: 200 * i }}>
						<div
							class="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-200 text-xs font-bold text-primary-700"
						>
							{i + 1}
						</div>
						<span class="text-sm text-primary-700">{step}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Exclusive Upgrade Offer -->
	{#if showUpgradeOffer}
		<div
			class="mb-8 overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl"
			in:fly={{ y: 20, duration: 500 }}
		>
			<div class="relative p-5 text-white">
				<!-- Limited Time Offer Badge -->
				<div
					class="absolute -right-10 top-5 rotate-45 bg-yellow-400 px-10 py-1 text-center text-xs font-bold uppercase text-gray-800 shadow-md"
				>
					{$i18n.modal.success.upgradeOffer.exclusive}
				</div>

				<div class="flex flex-col items-center md:flex-row md:items-center">
					<div class="mb-4 text-left md:mb-0 md:flex-1">
						<h4 class="mb-1 text-lg font-bold">{$i18n.modal.success.upgradeOffer.title}</h4>
						<p class="text-sm text-indigo-100">
							{$i18n.modal.success.upgradeOffer.subtitle}
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
							{$i18n.modal.success.upgradeOffer.countdown}
							<span class="ml-1 font-mono">{formatTime($upsellSeconds)}</span>
						</div>
					</div>

					<div class="flex-shrink-0">
						<button
							class="btn btn-sm bg-white px-4 font-bold text-indigo-600 transition-transform hover:scale-105 hover:bg-primary hover:shadow-lg"
							on:click={() => trackEvent('upsell_clicked')}
						>
							{$i18n.modal.success.upgradeOffer.button}
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Support Information -->
	{#if showSupportInfo}
		<div class="mb-6 text-center" in:fade={{ duration: 500 }}>
			<p class="mb-2 text-sm text-gray-600">
				{$i18n.modal.success.support.confirmation}
			</p>
			<p class="text-sm text-gray-500">
				{$i18n.modal.success.support.contact}

				<a
					href="mailto:support@digitalpusher.de"
					class="font-medium text-primary-600 hover:underline"
				>
					{$i18n.common.support}
				</a>
			</p>
		</div>
	{/if}

	<!-- Action Buttons -->
	{#if showActionButtons}
		<div class="mt-8 flex flex-row justify-center gap-4" in:scale={{ duration: 400 }}>
			{#if redirectUrl}
				<button
					class="btn btn-primary flex items-center justify-center gap-2"
					on:click={redirectToDashboard}
				>
					<span>{$i18n.modal.success.buttons.dashboard}</span>
					<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			{/if}
			<button
				class="btn btn-outline flex items-center justify-center gap-2 hover:bg-secondary-900"
				on:click={() => trackEvent('share_clicked')}
			>
				<Icon name="share" size={20} />
				{$i18n.modal.success.buttons.share}
			</button>
		</div>
	{/if}
</div>

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
