<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { celebrationConfetti } from '$lib/utils/confetti';
	import { i18n } from '$lib/i18n';

	// Props
	const {
		selectedDate = '',
		selectedTime = '',
		email = '',
		meetingUrl = '',
		onClose = () => {}
	} = $props();

	const booking = $derived($i18n.modal.booking);

	// State
	let showCheckmark = $state(false);
	let showMainMessage = $state(false);
	let showDetails = $state(false);
	let showBonus = $state(false);
	let showCalendar = $state(false);
	let timers: number[] = [];

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
		celebrationConfetti();
	}

	// Generate calendar links
	function generateGoogleCalendarLink() {
		const startDate = new Date(selectedDate + 'T' + selectedTime);
		const endDate = new Date(startDate.getTime() + 30 * 60000);

		const formatDate = (date: Date) => {
			return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
		};

		const title = encodeURIComponent('Digital Pusher Beratungsgespräch');
		const details = encodeURIComponent('30-minütige Beratung mit Digital Pusher Team');

		return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}`;
	}

	function downloadICS() {
		const startDate = new Date(selectedDate + 'T' + selectedTime);
		const endDate = new Date(startDate.getTime() + 30 * 60000);

		const formatICSDate = (date: Date) => {
			return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
		};

		const icsContent = [
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'PRODID:-//Digital Pusher//Booking//DE',
			'BEGIN:VEVENT',
			`DTSTART:${formatICSDate(startDate)}`,
			`DTEND:${formatICSDate(endDate)}`,
			'SUMMARY:Digital Pusher Beratungsgespräch',
			'DESCRIPTION:30-minütige Beratung mit Digital Pusher Team',
			`URL:${meetingUrl || 'https://digitalpusher.de'}`,
			'END:VEVENT',
			'END:VCALENDAR'
		].join('\r\n');

		const blob = new Blob([icsContent], { type: 'text/calendar' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'digitalpusher-termin.ics';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	// Start animations in sequence
	function startAnimations() {
		clearAllTimers();

		// 1. Checkmark
		addTimer(() => {
			showCheckmark = true;
		}, 300);

		// 2. Confetti
		addTimer(() => {
			triggerConfetti();
		}, 700);

		// 3. Main Message
		addTimer(() => {
			showMainMessage = true;
		}, 1000);

		// 4. Details (Date/Time)
		addTimer(() => {
			showDetails = true;
		}, 1300);

		// 5. Calendar Options
		addTimer(() => {
			showCalendar = true;
		}, 1600);

		// 6. Bonus Section
		addTimer(() => {
			showBonus = true;
		}, 1900);
	}

	onMount(() => {
		startAnimations();
	});

	onDestroy(() => {
		clearAllTimers();
	});
</script>

<!-- Booking Success Modal Content - Smoother, cleaner design -->
<div class="booking-success-content px-4 pt-2 pb-6">
	<!-- Success Animation - Minimal & Clean -->
	<div class="mb-4 flex justify-center">
		<div class="relative">
			<!-- Animated Glow -->
			<div
				class="absolute inset-0 animate-pulse rounded-full bg-green-400 opacity-40 blur-3xl"
			></div>
			<!-- Modern Check Icon -->
			<div
				class="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-xl"
				in:scale={{ duration: 600, start: 0.7 }}
			>
				{#if showCheckmark}
					<!-- Clean Check Icon (no circle, just check mark) -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="64"
						height="64"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-white drop-shadow-lg"
						in:scale={{ duration: 400 }}
					>
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				{/if}
			</div>
		</div>
	</div>

	<!-- Main Message - Clean Typography with Social Proof -->
	{#if showMainMessage}
		<div class="mb-6 text-center" in:fade={{ duration: 400 }}>
			<h3 class="mb-2 text-3xl font-bold text-gray-900">
				{booking.success.title}
			</h3>
			<p class="text-lg text-gray-600">
				{booking.success.message}
			</p>
			<!-- Social Proof Badge -->
			<div class="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-1.5">
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
					<circle cx="9" cy="7" r="4"></circle>
					<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
					<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
				</svg>
				<span class="text-xs font-medium text-green-800">{booking.success.socialProof}</span>
			</div>
		</div>
	{/if}

	<!-- Date/Time Details - Minimal Card -->
	{#if showDetails}
		<div class="mb-6" in:fly={{ y: 10, duration: 400 }}>
			<div
				class="flex items-center justify-center gap-6 rounded-xl border border-gray-200 bg-gray-50 px-6 py-4"
			>
				<div class="flex items-center gap-2 text-gray-700">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
						<line x1="16" y1="2" x2="16" y2="6"></line>
						<line x1="8" y1="2" x2="8" y2="6"></line>
						<line x1="3" y1="10" x2="21" y2="10"></line>
					</svg>
					<span class="font-medium">
						{new Date(selectedDate).toLocaleDateString('de-DE', {
							day: 'numeric',
							month: 'short',
							year: 'numeric'
						})}
					</span>
				</div>

				<div class="h-6 w-px bg-gray-300"></div>

				<div class="flex items-center gap-2 text-gray-700">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="10"></circle>
						<polyline points="12 6 12 12 16 14"></polyline>
					</svg>
					<span class="font-medium">{selectedTime} Uhr</span>
				</div>
			</div>

			<!-- Email Confirmation - Inline & Minimal -->
			<p class="mt-3 text-center text-sm text-gray-500">
				✓ Bestätigung gesendet an <span class="font-medium text-gray-700">{email}</span>
			</p>
		</div>
	{/if}

	<!-- Calendar Integration - Modern, ICP-friendly -->
	{#if showCalendar}
		<div class="mb-6" in:fly={{ y: 10, duration: 400 }}>
			<p class="mb-3 text-center text-sm font-medium text-gray-600">
				{booking.calendar.addToCalendar}
			</p>
			<div class="grid grid-cols-2 gap-3">
				<!-- Google Calendar -->
				<a
					href={generateGoogleCalendarLink()}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:border-primary-500 hover:bg-primary-50"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path
							d="M19.5 3h-3V1.5a.5.5 0 00-1 0V3h-7V1.5a.5.5 0 00-1 0V3h-3A2.5 2.5 0 002 5.5v14A2.5 2.5 0 004.5 22h15a2.5 2.5 0 002.5-2.5v-14A2.5 2.5 0 0019.5 3zm1.5 16.5a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5V9h18v10.5z"
						/>
					</svg>
					Google
				</a>

				<!-- Apple Calendar / Outlook (ICS Download) -->
				<button
					onclick={downloadICS}
					class="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:border-primary-500 hover:bg-primary-50"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					{booking.calendar.download}
				</button>
			</div>
		</div>
	{/if}

	<!-- Bonus Section - Ticket/Coupon Style with Perforation + Urgency -->
	{#if showBonus}
		<div class="bonus-ticket" in:fly={{ y: 10, duration: 400 }}>
			<!-- Ticket Header with Perforation -->
			<div class="ticket-header">
				<div class="flex items-center justify-center gap-3 py-4">
					<!-- Gift Emoji (larger) -->
					<div class="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
						<span class="text-3xl">🎁</span>
					</div>
					<div>
						<h4 class="text-xl font-bold text-gray-900">{booking.success.bonusTitle}</h4>
						<p class="text-xs font-medium text-orange-700">{booking.success.bonusValue}</p>
					</div>
				</div>
			</div>

			<!-- Perforation Line -->
			<div class="perforation-line"></div>

			<!-- Ticket Body -->
			<div class="ticket-body">
				<p class="mb-3 text-center text-sm leading-relaxed text-gray-700">
					{booking.success.bonusDescription}
				</p>
				<div class="mb-3 flex items-center justify-center gap-2 rounded-lg bg-white/80 px-3 py-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
						></path>
						<polyline points="22,6 12,13 2,6"></polyline>
					</svg>
					<span class="text-xs font-medium text-gray-700">{booking.success.bonusEmail}</span>
				</div>
				<!-- Urgency Element -->
				<div class="flex items-center justify-center gap-1.5 text-xs text-orange-700">
					<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"></circle>
						<polyline points="12 6 12 12 16 14"></polyline>
					</svg>
					<span class="font-medium">{booking.success.bonusUrgency}</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Ticket/Coupon Style with Perforation */
	.bonus-ticket {
		position: relative;
		background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
		border-radius: 12px;
		overflow: hidden;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}

	.ticket-header {
		background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
		position: relative;
	}

	/* Perforation Line - Realistic ticket tear effect */
	.perforation-line {
		height: 2px;
		background-image: repeating-linear-gradient(
			90deg,
			transparent,
			transparent 8px,
			#d97706 8px,
			#d97706 12px
		);
		position: relative;
	}

	.perforation-line::before,
	.perforation-line::after {
		content: '';
		position: absolute;
		top: -6px;
		width: 12px;
		height: 12px;
		background: white;
		border-radius: 50%;
		z-index: 10;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.perforation-line::before {
		left: -6px;
	}

	.perforation-line::after {
		right: -6px;
	}

	.ticket-body {
		padding: 1.5rem 1.5rem 1.25rem;
		background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
	}

	/* Corner notches for ticket effect */
	.bonus-ticket::before,
	.bonus-ticket::after {
		content: '';
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 16px;
		height: 16px;
		background: white;
		border-radius: 50%;
		z-index: 20;
		box-shadow: 
			0 2px 8px rgba(0, 0, 0, 0.15),
			inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.bonus-ticket::before {
		left: -8px;
	}

	.bonus-ticket::after {
		right: -8px;
	}
</style>
