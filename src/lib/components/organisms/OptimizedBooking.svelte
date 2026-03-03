<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import Icon from '../atoms/Icon.svelte';
	import type { FormData } from '$lib/schema';
	import { i18n } from '$lib/i18n';

	let { formData }: { formData: FormData } = $props();

	// UI State
	let isLoading = $state(false);
	let isBookingSuccessful = $state(false);
	let isLoadingSlots = $state(false);
	let errorMessage = $state('');
	let bookingResult = $state<any>(null);
	let selectedDate = $state('');
	let selectedTime = $state('');
	let currentMonth = $state(new Date());

	// Form state - nur noch Name, Email, Telefon
	let firstName = $state(formData?.first_name || '');
	let lastName = $state(formData?.last_name || '');
	let email = $state(formData?.email || '');
	let phone = $state(formData?.phone || '');

	// Determine if we have existing contact data
	let hasExistingData = $derived(
		Boolean(formData?.first_name && formData?.last_name && formData?.email)
	);

	// Available slots structure
	let availableSlotsByDate = $state<Record<string, string[]>>({});

	// Get expert profile and booking texts from i18n
	const profile = $derived($i18n.results.expertProfile);
	const booking = $derived($i18n.modal.booking);

	// Trust elements from i18n
	const trustElements = $derived([
		{
			icon: 'shield',
			title: booking.trustElements.free.title,
			subtitle: booking.trustElements.free.subtitle
		},
		{
			icon: 'clock',
			title: booking.trustElements.duration.title,
			subtitle: booking.trustElements.duration.subtitle
		},
		{
			icon: 'users',
			title: booking.trustElements.projects.title,
			subtitle: booking.trustElements.projects.subtitle
		}
	]);

	// Calendar functions
	function getDaysInMonth(date: Date): Date[] {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const days: Date[] = [];

		const firstDayOfWeek = firstDay.getDay();
		const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

		for (let i = daysFromPrevMonth; i > 0; i--) {
			days.push(new Date(year, month, 1 - i));
		}

		for (let i = 1; i <= lastDay.getDate(); i++) {
			days.push(new Date(year, month, i));
		}

		const lastDayOfWeek = lastDay.getDay();
		const daysFromNextMonth = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;

		for (let i = 1; i <= daysFromNextMonth; i++) {
			days.push(new Date(year, month + 1, i));
		}

		return days;
	}

	function isPastDate(date: Date): boolean {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return date < today;
	}

	function isWeekend(date: Date): boolean {
		const day = date.getDay();
		return day === 0 || day === 6;
	}

	function isCurrentMonth(date: Date): boolean {
		return (
			date.getMonth() === currentMonth.getMonth() &&
			date.getFullYear() === currentMonth.getFullYear()
		);
	}

	function formatDate(date: Date): string {
		return date.toISOString().split('T')[0];
	}

	function hasAvailableSlots(date: Date): boolean {
		const dateStr = formatDate(date);
		return availableSlotsByDate[dateStr]?.length > 0;
	}

	async function fetchSlotsForMonth(month: Date): Promise<void> {
		isLoadingSlots = true;
		const days = getDaysInMonth(month);

		try {
			const promises = days
				.filter((day) => !isPastDate(day) && !isWeekend(day) && isCurrentMonth(day))
				.map(async (day) => {
					const dateStr = formatDate(day);
					try {
						const response = await fetch(`/api/booking?date=${dateStr}`);
						if (response.ok) {
							const data = await response.json();
							const slots = data.availability?.slots || [];
							const filteredSlots = slots.filter((time: string) => {
								const hour = parseInt(time.split(':')[0]);
								return hour >= 10;
							});
							return { date: dateStr, slots: filteredSlots };
						}
					} catch (error) {
						console.error(`Error fetching slots for ${dateStr}:`, error);
					}
					return { date: dateStr, slots: [] };
				});

			const results = await Promise.all(promises);
			const newSlots: Record<string, string[]> = {};
			results.forEach(({ date, slots }) => {
				newSlots[date] = slots;
			});
			availableSlotsByDate = newSlots;
		} catch (error) {
			console.error('Error fetching slots:', error);
			generateMockSlots();
		} finally {
			isLoadingSlots = false;
		}
	}

	function generateMockSlots(): void {
		const days = getDaysInMonth(currentMonth);
		const mockSlots: Record<string, string[]> = {};
		const timeSlots = ['10:00', '11:00', '14:00', '15:00', '16:00'];

		days
			.filter((day) => !isPastDate(day) && !isWeekend(day) && isCurrentMonth(day))
			.forEach((day) => {
				const dateStr = formatDate(day);
				const availableCount = Math.floor(Math.random() * 3) + 2;
				mockSlots[dateStr] = timeSlots.slice(0, availableCount);
			});

		availableSlotsByDate = mockSlots;
	}

	function previousMonth(): void {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
		selectedDate = '';
		selectedTime = '';
		fetchSlotsForMonth(currentMonth);
	}

	function nextMonth(): void {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
		selectedDate = '';
		selectedTime = '';
		fetchSlotsForMonth(currentMonth);
	}

	function selectDate(date: Date): void {
		if (isPastDate(date) || isWeekend(date) || !isCurrentMonth(date) || !hasAvailableSlots(date)) {
			return;
		}
		selectedDate = formatDate(date);
		selectedTime = '';
		errorMessage = '';
	}

	function selectTime(time: string): void {
		selectedTime = time;
		errorMessage = '';
	}

	function validateBooking(): boolean {
		if (!selectedDate) {
			errorMessage = booking.error.dateRequired;
			return false;
		}
		if (!selectedTime) {
			errorMessage = booking.error.timeRequired;
			return false;
		}

		if (!hasExistingData) {
			if (!firstName || !lastName || !email) {
				errorMessage = booking.error.allFieldsRequired;
				return false;
			}

			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				errorMessage = 'Bitte gib eine gültige E-Mail-Adresse ein.';
				return false;
			}
		}

		return true;
	}

	async function handleBooking(): Promise<void> {
		if (!validateBooking()) {
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const bookingData = {
				date: selectedDate,
				time: selectedTime,
				firstName: hasExistingData ? formData.first_name : firstName,
				lastName: hasExistingData ? formData.last_name : lastName,
				email: hasExistingData ? formData.email : email,
				phone: hasExistingData ? formData.phone : phone,
				companyName: formData.company_name || '',
				companyUrl: formData.company_url || '',
				source: 'results_page'
			};

			const response = await fetch('/api/booking', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(bookingData)
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Buchung fehlgeschlagen');
			}

			bookingResult = result;
			isBookingSuccessful = true;

			// Auto-scroll to success message with smooth animation
			setTimeout(() => {
				const successElement = document.querySelector('.success-state');
				if (successElement) {
					successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}
			}, 100);
		} catch (error) {
			console.error('❌ Booking error:', error);
			errorMessage =
				error instanceof Error
					? error.message
					: booking.error.generic;
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		fetchSlotsForMonth(currentMonth);
	});

	let availableTimes = $derived(availableSlotsByDate[selectedDate] || []);

	// Month and day names from i18n
	const monthNames = $derived(booking.calendar.months);
	const dayNames = $derived(booking.calendar.days);
</script>

<div class="optimized-booking">
	{#if isBookingSuccessful}
		<!-- Success State - Modern & Fancy -->
		<div class="success-state max-w-3xl mx-auto" in:scale={{ duration: 400, start: 0.95 }}>
			<!-- Main Success Card -->
			<div class="rounded-3xl bg-gradient-to-br from-green-50 via-white to-primary-50 p-8 shadow-2xl border border-green-200/50">
				<!-- Animated Check Icon -->
				<div class="mb-6 flex justify-center">
					<div class="relative">
						<div class="absolute inset-0 rounded-full bg-green-400 blur-xl opacity-50 animate-pulse"></div>
						<div class="relative rounded-full bg-gradient-to-br from-green-400 to-green-600 p-5 shadow-lg">
							<Icon name="checkCircle" size={72} className="text-white" stroke="none" />
						</div>
					</div>
				</div>

				<!-- Success Message -->
				<div class="text-center mb-8">
					<h3 class="mb-4 text-4xl font-bold bg-gradient-to-r from-green-600 to-primary-600 bg-clip-text text-transparent">
						{booking.success.title}
					</h3>
					<div class="mb-2 text-xl text-gray-700 leading-relaxed">
						{booking.success.message}
					</div>
					<div class="inline-flex flex-wrap items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-md border border-gray-100">
						<Icon name="calendar" size={20} className="text-primary-600" stroke="currentColor" strokeWidth="2" />
						<strong class="text-2xl text-primary-600">
							{new Date(selectedDate).toLocaleDateString('de-DE', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</strong>
						<span class="text-gray-400">•</span>
						<Icon name="clock" size={20} className="text-primary-600" stroke="currentColor" strokeWidth="2" />
						<strong class="text-2xl text-primary-600">{selectedTime} {booking.success.oclock}</strong>
					</div>
				</div>

				<!-- Email Confirmation Badge -->
				<div class="mb-6 flex items-center justify-center gap-3 rounded-xl bg-green-50 border-2 border-green-200 p-4" in:fly={{ y: 10, delay: 200, duration: 400 }}>
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 shadow-md">
						<Icon name="checkCircle" size={20} className="text-white" stroke="currentColor" strokeWidth="2" />
					</div>
					<div class="flex-1 text-left">
						<p class="text-sm font-semibold text-green-900">Bestätigung versendet</p>
						<p class="text-xs text-green-700">{email || formData.email}</p>
					</div>
				</div>

				<!-- Bonus Section - Enhanced -->
				<div class="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 shadow-lg border border-yellow-200" in:fly={{ y: 10, delay: 300, duration: 400 }}>
					<div class="relative p-6">
						<!-- Decorative Elements -->
						<div class="absolute top-0 right-0 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-30"></div>
						<div class="absolute bottom-0 left-0 w-24 h-24 bg-orange-200 rounded-full blur-2xl opacity-30"></div>
						
						<div class="relative">
							<div class="mb-4 flex items-center justify-center gap-3">
								<div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
									<Icon name="star" size={24} className="text-white" fill="currentColor" />
								</div>
								<h4 class="text-2xl font-bold text-gray-900">{booking.success.bonusTitle}</h4>
							</div>
							
							<p class="mb-4 text-center text-gray-700 leading-relaxed">
								{booking.success.bonusDescription}
							</p>
							
							<div class="flex items-center justify-center gap-2 rounded-lg bg-white/80 backdrop-blur-sm p-3 shadow-sm">
								<Icon
									name="mail"
									size={18}
									className="text-primary-600"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<span class="text-sm font-medium text-gray-700">{booking.success.bonusEmail}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Meeting Link Button (if available) -->
				{#if bookingResult?.booking?.meeting_url}
					<div class="flex flex-col gap-3" in:fly={{ y: 10, delay: 400, duration: 400 }}>
						<a
							href={bookingResult.booking.meeting_url}
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-4 font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:scale-105"
						>
							<Icon name="external-link" size={20} stroke="currentColor" strokeWidth="2" />
							<span>{booking.success.meetingLink}</span>
							<Icon name="arrowRight" size={20} className="transition-transform group-hover:translate-x-1" stroke="currentColor" strokeWidth="2" />
						</a>
						<p class="text-center text-xs text-gray-500">Du kannst den Link auch später in der E-Mail finden</p>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<!-- Calendly-Style Layout -->
		<div class="booking-container grid gap-6 lg:grid-cols-12">
			<!-- Left Side: Expert Profile & Info -->
			<div class="flex flex-col gap-6 lg:col-span-5">
				<!-- Expert Profile Card - kompakt für gleiche Höhe -->
				<div
					class="expert-card flex h-full flex-col rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-white shadow-xl"
					in:fade={{ duration: 500 }}
				>
					<!-- Expert Profile - größeres Bild -->
					<div class="mb-6 flex flex-col items-center text-center">
						<div
							class="relative mb-4 h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-white/30 shadow-lg"
						>
							<img
								src={profile.imageUrl}
								alt={profile.imageAlt}
								class="h-full w-full object-cover"
								loading="lazy"
							/>
						</div>
						<div>
							<h3 class="text-xl font-bold">{profile.name}</h3>
							<p class="text-sm text-primary-100">{profile.role}</p>
						</div>
					</div>

					<div class="mb-6">
						<h4 class="mb-2 text-xl font-bold">{booking.expert.title}</h4>
						<p class="text-sm leading-relaxed text-primary-50">
							{booking.expert.description}
						</p>
					</div>

					<!-- Trust Elements - kompakter -->
					<div class="mb-6 space-y-2">
						{#each trustElements as trust, i}
							<div
								class="flex items-center gap-3 rounded-lg bg-white/10 p-2.5 backdrop-blur-sm"
								in:fly={{ x: -20, delay: 300 + i * 100, duration: 400 }}
							>
								<div
									class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20"
								>
									<Icon
										name={trust.icon}
										size={16}
										stroke="currentColor"
										strokeWidth="2"
										fill="none"
									/>
								</div>
								<div class="min-w-0 flex-1">
									<div class="text-sm font-semibold">{trust.title}</div>
									<div class="text-xs text-primary-100">{trust.subtitle}</div>
								</div>
							</div>
						{/each}
					</div>

					<!-- Partner Logos -->
					<div class="mt-auto">
						<div class="mb-3 border-t border-white/20 pt-4">
							<p class="text-center text-xs font-semibold uppercase tracking-wide text-primary-100">
								Unsere Partner
							</p>
						</div>
						<div
							class="grid grid-cols-2 gap-3 lg:grid-cols-4"
							in:fly={{ y: 20, delay: 600, duration: 400 }}
						>
							<div
								class="flex items-center justify-center rounded-lg bg-white/10 p-2 backdrop-blur-sm transition-all hover:bg-white/20"
							>
								<img
									src="/wordpress-vip.png"
									alt="WordPress VIP Partner"
									class="h-auto w-full max-w-[80px] object-contain brightness-0 invert"
									loading="lazy"
								/>
							</div>
							<div
								class="flex items-center justify-center rounded-lg bg-white/10 p-2 backdrop-blur-sm transition-all hover:bg-white/20"
							>
								<img
									src="/google-partner.png"
									alt="Google Partner"
									class="h-auto w-full max-w-[80px] object-contain brightness-0 invert"
									loading="lazy"
								/>
							</div>
							<div
								class="flex items-center justify-center rounded-lg bg-white/10 p-2 backdrop-blur-sm transition-all hover:bg-white/20"
							>
								<img
									src="/meta-business.png"
									alt="Meta Business Partner"
									class="h-auto w-full max-w-[80px] object-contain brightness-0 invert"
									loading="lazy"
								/>
							</div>
							<div
								class="flex items-center justify-center rounded-lg bg-white/10 p-2 backdrop-blur-sm transition-all hover:bg-white/20"
							>
								<img
									src="/brevo.png"
									alt="Brevo Partner"
									class="h-auto w-full max-w-[80px] object-contain brightness-0 invert"
									loading="lazy"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Side: Calendar - größer -->
			<div class="lg:col-span-7">
				<div class="calendar-card h-full rounded-2xl bg-white p-6 shadow-xl">
					<!-- Calendar Header -->
					<div class="mb-6">
						<h3 class="mb-2 text-2xl font-bold text-gray-900">{booking.calendar.title}</h3>
						<p class="text-gray-600">
							<Icon
								name="clock"
								size={16}
								className="mr-1 inline text-primary-600"
								stroke="currentColor"
								strokeWidth="2"
							/>
							{booking.calendar.description}
						</p>
					</div>

					<!-- Month Navigation -->
					<div class="mb-6 flex items-center justify-between rounded-lg bg-gray-50 p-4">
						<button
							class="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-700 transition-all hover:border-primary-500 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50"
							onclick={previousMonth}
							disabled={currentMonth.getMonth() === new Date().getMonth() &&
								currentMonth.getFullYear() === new Date().getFullYear()}
						>
							<Icon name="chevronLeft" size={20} stroke="currentColor" strokeWidth="2" />
						</button>
						<h4 class="text-xl font-bold text-gray-900">
							{monthNames[currentMonth.getMonth()]}
							{currentMonth.getFullYear()}
						</h4>
						<button
							class="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-700 transition-all hover:border-primary-500 hover:bg-primary-50"
							onclick={nextMonth}
						>
							<Icon name="chevronRight" size={20} stroke="currentColor" strokeWidth="2" />
						</button>
					</div>

					<!-- Day Names -->
					<div class="mb-3 grid grid-cols-7 gap-2">
						{#each dayNames as day}
							<div class="text-center text-sm font-semibold text-gray-600">{day}</div>
						{/each}
					</div>

					<!-- Calendar Grid -->
					{#if isLoadingSlots}
						<div class="flex flex-col items-center justify-center py-12">
							<div
								class="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"
							></div>
							<p class="text-gray-600">Lade verfügbare Termine...</p>
						</div>
					{:else}
						<div class="calendar-grid mb-6 grid grid-cols-7 gap-2">
							{#each getDaysInMonth(currentMonth) as day, i}
								{@const dateStr = formatDate(day)}
								{@const isSelected = selectedDate === dateStr}
								{@const isPast = isPastDate(day)}
								{@const isWeekendDay = isWeekend(day)}
								{@const isOtherMonth = !isCurrentMonth(day)}
								{@const hasSlots = hasAvailableSlots(day)}
								{@const isClickable = !isPast && !isWeekendDay && !isOtherMonth && hasSlots}

								<button
									class="calendar-day relative flex h-12 flex-col items-center justify-center rounded-lg border-2 text-sm font-medium transition-all"
									class:border-primary-600={isSelected}
									class:bg-primary-600={isSelected}
									class:text-white={isSelected}
									class:border-transparent={!isSelected && isClickable}
									class:bg-gray-50={!isSelected && isClickable}
									class:hover:border-primary-400={!isSelected && isClickable}
									class:hover:bg-primary-50={!isSelected && isClickable}
									class:text-gray-900={!isSelected && isClickable}
									class:text-gray-400={isPast || isWeekendDay || isOtherMonth}
									class:bg-gray-100={isPast || isWeekendDay || isOtherMonth}
									class:line-through={isPast}
									class:cursor-not-allowed={!isClickable}
									disabled={!isClickable}
									onclick={() => isClickable && selectDate(day)}
									in:fade={{ duration: 200, delay: i * 5 }}
								>
									{day.getDate()}
									{#if hasSlots && !isPast && !isWeekendDay && isCurrentMonth(day)}
										<span
											class="absolute bottom-1 h-1 w-1 rounded-full {isSelected
												? 'bg-white'
												: 'bg-primary-600'}"
										></span>
									{/if}
								</button>
							{/each}
						</div>
					{/if}

					<!-- Time Slots -->
					{#if selectedDate && availableTimes.length > 0}
						<div class="time-section mb-6" in:fly={{ y: 20, duration: 300 }}>
							<h4 class="mb-3 font-semibold text-gray-900">Verfügbare Zeiten</h4>
							<div class="grid grid-cols-3 gap-3 md:grid-cols-4">
								{#each availableTimes as time, i}
									{@const isSelected = selectedTime === time}
									<button
										class="flex items-center justify-center gap-2 rounded-lg border-2 py-3 text-sm font-medium transition-all"
										class:border-primary-600={isSelected}
										class:bg-primary-600={isSelected}
										class:text-white={isSelected}
										class:border-gray-300={!isSelected}
										class:hover:border-primary-500={!isSelected}
										class:hover:bg-primary-50={!isSelected}
										onclick={() => selectTime(time)}
										in:scale={{ duration: 200, delay: i * 30 }}
									>
										{time}
									</button>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Contact Form -->
					{#if selectedDate && selectedTime}
						<div
							class="contact-form border-t-2 border-gray-100 pt-6"
							in:fly={{ y: 20, duration: 300 }}
						>
							{#if hasExistingData}
								<!-- Existing Data Summary -->
								<div class="mb-4 rounded-lg bg-green-50 p-4">
									<div class="mb-2 flex items-center gap-2 text-green-800">
										<Icon name="checkCircle" size={20} stroke="currentColor" strokeWidth="2" />
										<h4 class="font-semibold">Deine Kontaktdaten</h4>
									</div>
									<div class="grid gap-2 text-sm text-gray-700">
										<div><strong>Name:</strong> {formData.first_name} {formData.last_name}</div>
										<div><strong>E-Mail:</strong> {formData.email}</div>
										{#if formData.phone}
											<div><strong>Telefon:</strong> {formData.phone}</div>
										{/if}
									</div>
								</div>
							{:else}
								<!-- Contact Input Form -->
								<h4 class="mb-4 font-semibold text-gray-900">Deine Kontaktdaten</h4>
								<div class="space-y-4">
									<div class="grid gap-4 md:grid-cols-2">
										<div>
											<label for="firstName" class="mb-2 block text-sm font-medium text-gray-700">
												{booking.form.firstName} *
											</label>
											<input
												id="firstName"
												type="text"
												bind:value={firstName}
												placeholder={booking.form.firstName}
												class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
												required
											/>
										</div>
										<div>
											<label for="lastName" class="mb-2 block text-sm font-medium text-gray-700">
												{booking.form.lastName} *
											</label>
											<input
												id="lastName"
												type="text"
												bind:value={lastName}
												placeholder={booking.form.lastName}
												class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
												required
											/>
										</div>
									</div>
									<div>
										<label for="email" class="mb-2 block text-sm font-medium text-gray-700">
											{booking.form.email} *
										</label>
										<input
											id="email"
											type="email"
											bind:value={email}
											placeholder="deine@email.de"
											class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
											required
										/>
									</div>
									<div>
										<label for="phone" class="mb-2 block text-sm font-medium text-gray-700">
											{booking.form.phone}
										</label>
										<input
											id="phone"
											type="tel"
											bind:value={phone}
											placeholder="+49 123 456789"
											class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
										/>
									</div>
								</div>
							{/if}

							<!-- Error Message -->
							{#if errorMessage}
								<div
									class="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-800"
									in:fly={{ y: -10, duration: 300 }}
								>
									<Icon name="alertCircle" size={20} stroke="currentColor" strokeWidth="2" />
									<span class="text-sm font-medium">{errorMessage}</span>
								</div>
							{/if}

							<!-- Book Button -->
							<button
								class="mt-6 w-full rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-primary-700 hover:to-primary-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:from-primary-600 disabled:hover:to-primary-700"
								disabled={isLoading || (!hasExistingData && (!firstName || !lastName || !email))}
								onclick={handleBooking}
							>
								{#if isLoading}
									<span class="flex items-center justify-center gap-3">
										<div
											class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
										></div>
										{booking.form.submitting}
									</span>
								{:else}
									<span class="flex items-center justify-center gap-2">
										<Icon
											name="calendar"
											size={20}
											stroke="currentColor"
											strokeWidth="2"
											fill="none"
										/>
										{booking.form.submit}
									</span>
								{/if}
							</button>

							<!-- Privacy Note -->
							<p class="mt-4 text-center text-xs text-gray-500">
								<Icon
									name="shield"
									size={12}
									className="mr-1 inline text-green-600"
									stroke="currentColor"
									strokeWidth="2"
								/>
								{booking.form.privacy}
							</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.optimized-booking {
		width: 100%;
		margin: 0 auto;
	}

	.success-state {
		max-width: 42rem;
		margin: 0 auto;
	}

	/* Responsive adjustments */
	@media (max-width: 1024px) {
		.booking-container {
			grid-template-columns: 1fr;
		}
	}
</style>
