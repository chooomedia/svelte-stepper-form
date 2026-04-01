<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import Icon from '../atoms/Icon.svelte';
	import type { FormData } from '$lib/schema';

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

	// Form state for users without existing data
	let firstName = $state(formData?.first_name || '');
	let lastName = $state(formData?.last_name || '');
	let email = $state(formData?.email || '');
	let phone = $state(formData?.phone || '');
	let companyName = $state(formData?.company_name || '');
	let companyUrl = $state(formData?.company_url || '');

	// Determine if we have existing contact data
	let hasExistingData = $derived(Boolean(formData?.first_name && formData?.last_name && formData?.email));

	// Available slots structure: { [date: string]: string[] }
	let availableSlotsByDate = $state<Record<string, string[]>>({});

	// Get days in current month view
	function getDaysInMonth(date: Date): Date[] {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const days: Date[] = [];

		// Add padding days from previous month
		const firstDayOfWeek = firstDay.getDay();
		const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
		
		for (let i = daysFromPrevMonth; i > 0; i--) {
			const day = new Date(year, month, 1 - i);
			days.push(day);
		}

		// Add days of current month
		for (let i = 1; i <= lastDay.getDate(); i++) {
			days.push(new Date(year, month, i));
		}

		// Add padding days from next month
		const lastDayOfWeek = lastDay.getDay();
		const daysFromNextMonth = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
		
		for (let i = 1; i <= daysFromNextMonth; i++) {
			days.push(new Date(year, month + 1, i));
		}

		return days;
	}

	// Check if date is in the past
	function isPastDate(date: Date): boolean {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return date < today;
	}

	// Check if date is weekend
	function isWeekend(date: Date): boolean {
		const day = date.getDay();
		return day === 0 || day === 6;
	}

	// Check if date is in current month
	function isCurrentMonth(date: Date): boolean {
		return date.getMonth() === currentMonth.getMonth() && 
		       date.getFullYear() === currentMonth.getFullYear();
	}

	// Format date to YYYY-MM-DD
	function formatDate(date: Date): string {
		return date.toISOString().split('T')[0];
	}

	// Check if date has available slots
	function hasAvailableSlots(date: Date): boolean {
		const dateStr = formatDate(date);
		return availableSlotsByDate[dateStr]?.length > 0;
	}

	// Fetch available slots for a date range
	async function fetchSlotsForMonth(month: Date): Promise<void> {
		isLoadingSlots = true;
		const days = getDaysInMonth(month);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		try {
			// Fetch slots for all valid days in the month
			const promises = days
				.filter(day => !isPastDate(day) && !isWeekend(day) && isCurrentMonth(day))
				.map(async (day) => {
					const dateStr = formatDate(day);
					try {
						const response = await fetch(`/api/booking?date=${dateStr}`);
						if (response.ok) {
							const data = await response.json();
							const slots = data.availability?.slots || [];
							// Filter slots to only include 10:00 and later
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
			
			// Update available slots
			const newSlots: Record<string, string[]> = {};
			results.forEach(({ date, slots }) => {
				newSlots[date] = slots;
			});
			availableSlotsByDate = newSlots;
		} catch (error) {
			console.error('Error fetching slots:', error);
			// Fallback to mock data
			generateMockSlots();
		} finally {
			isLoadingSlots = false;
		}
	}

	// Generate mock slots for testing
	function generateMockSlots(): void {
		const days = getDaysInMonth(currentMonth);
		const mockSlots: Record<string, string[]> = {};
		const timeSlots = ['10:00', '11:00', '14:00', '15:00', '16:00'];

		days
			.filter(day => !isPastDate(day) && !isWeekend(day) && isCurrentMonth(day))
			.forEach(day => {
				const dateStr = formatDate(day);
				// Random availability
				const availableCount = Math.floor(Math.random() * 3) + 2;
				mockSlots[dateStr] = timeSlots.slice(0, availableCount);
			});

		availableSlotsByDate = mockSlots;
	}

	// Navigate to previous month
	function previousMonth(): void {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
		selectedDate = '';
		selectedTime = '';
		fetchSlotsForMonth(currentMonth);
	}

	// Navigate to next month
	function nextMonth(): void {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
		selectedDate = '';
		selectedTime = '';
		fetchSlotsForMonth(currentMonth);
	}

	// Select a date
	function selectDate(date: Date): void {
		if (isPastDate(date) || isWeekend(date) || !isCurrentMonth(date) || !hasAvailableSlots(date)) {
			return;
		}
		selectedDate = formatDate(date);
		selectedTime = '';
		errorMessage = '';
	}

	// Select a time
	function selectTime(time: string): void {
		selectedTime = time;
		errorMessage = '';
	}

	// Validate booking data
	function validateBooking(): boolean {
		if (!selectedDate || !selectedTime) {
			errorMessage = 'Bitte wähle ein Datum und eine Uhrzeit aus.';
			return false;
		}

		if (!hasExistingData) {
			if (!firstName || !lastName || !email) {
				errorMessage = 'Bitte fülle alle erforderlichen Felder aus.';
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

	// Handle booking submission
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
				companyName: hasExistingData ? formData.company_name : companyName,
				companyUrl: hasExistingData ? formData.company_url : companyUrl,
				source: 'results_page'
			};

			console.log('📅 Booking appointment:', bookingData);

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
			console.log('✅ Booking successful:', result);
		} catch (error) {
			console.error('❌ Booking error:', error);
			errorMessage = error instanceof Error 
				? error.message 
				: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
		} finally {
			isLoading = false;
		}
	}

	// Initialize on mount
	onMount(() => {
		fetchSlotsForMonth(currentMonth);
	});

	// Get available times for selected date
	let availableTimes = $derived(availableSlotsByDate[selectedDate] || []);

	// Month names
	const monthNames = [
		'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
		'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
	];

	// Day names
	const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
</script>

<div class="tidycal-booking">
	{#if isBookingSuccessful}
		<!-- Success State -->
		<div class="success-state" in:scale={{ duration: 400 }}>
			<div class="success-icon">
				<Icon name="checkCircle" size={80} className="text-green-500" stroke="none" />
			</div>
			<h3 class="success-title">Termin erfolgreich gebucht!</h3>
			<p class="success-message">
				Dein kostenloses Beratungsgespräch wurde für den 
				<strong>{new Date(selectedDate).toLocaleDateString('de-DE', { 
					weekday: 'long', 
					year: 'numeric', 
					month: 'long', 
					day: 'numeric' 
				})}</strong> um <strong>{selectedTime} Uhr</strong> reserviert.
			</p>
			<div class="success-info">
				<Icon name="mail" size={20} className="text-green-600" stroke="currentColor" strokeWidth="2" />
				<p>Du erhältst in Kürze eine Bestätigungs-E-Mail mit allen Details und dem Meeting-Link.</p>
			</div>
			{#if bookingResult?.booking?.meeting_url}
				<a
					href={bookingResult.booking.meeting_url}
					target="_blank"
					rel="noopener noreferrer"
					class="meeting-link"
				>
					<Icon name="external-link" size={16} stroke="currentColor" strokeWidth="2" />
					Meeting-Link öffnen
				</a>
			{/if}
		</div>
	{:else}
		<!-- Booking Form -->
		<div class="booking-form">
			<!-- Header -->
			<div class="booking-header">
				<Icon name="calendar" size={48} className="text-primary-600" stroke="currentColor" strokeWidth="2" fill="none" />
				<h3 class="booking-title">Wähle deinen Wunschtermin</h3>
				<p class="booking-subtitle">Kostenlose 30-minütige Beratung</p>
			</div>

			<!-- Calendar Section -->
			<div class="calendar-section">
				<!-- Month Navigation -->
				<div class="month-navigation">
					<button 
						class="nav-button" 
						onclick={previousMonth}
						disabled={currentMonth.getMonth() === new Date().getMonth() && 
						         currentMonth.getFullYear() === new Date().getFullYear()}
					>
						<Icon name="chevronLeft" size={20} stroke="currentColor" strokeWidth="2" />
					</button>
					<h4 class="month-title">
						{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
					</h4>
					<button class="nav-button" onclick={nextMonth}>
						<Icon name="chevronRight" size={20} stroke="currentColor" strokeWidth="2" />
					</button>
				</div>

				<!-- Day Names -->
				<div class="day-names">
					{#each dayNames as day}
						<div class="day-name">{day}</div>
					{/each}
				</div>

				<!-- Calendar Grid -->
				{#if isLoadingSlots}
					<div class="loading-calendar">
						<div class="spinner"></div>
						<p>Verfügbare Termine werden geladen...</p>
					</div>
				{:else}
					<div class="calendar-grid">
						{#each getDaysInMonth(currentMonth) as day, i}
							{@const dateStr = formatDate(day)}
							{@const isSelected = selectedDate === dateStr}
							{@const isPast = isPastDate(day)}
							{@const isWeekendDay = isWeekend(day)}
							{@const isOtherMonth = !isCurrentMonth(day)}
							{@const hasSlots = hasAvailableSlots(day)}
							{@const isClickable = !isPast && !isWeekendDay && !isOtherMonth && hasSlots}
							
							<button
								class="calendar-day"
								class:selected={isSelected}
								class:past={isPast}
								class:weekend={isWeekendDay}
								class:other-month={isOtherMonth}
								class:has-slots={hasSlots}
								class:clickable={isClickable}
								disabled={!isClickable}
								onclick={() => isClickable && selectDate(day)}
								in:fade={{ duration: 200, delay: i * 10 }}
							>
								<span class="day-number">{day.getDate()}</span>
								{#if hasSlots && !isPast && !isWeekendDay && isCurrentMonth(day)}
									<span class="availability-indicator"></span>
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Time Slot Selection -->
			{#if selectedDate && availableTimes.length > 0}
				<div class="time-section" in:fly={{ y: 20, duration: 300 }}>
					<h4 class="time-title">Verfügbare Uhrzeiten</h4>
					<div class="time-grid">
						{#each availableTimes as time, i}
							{@const isSelected = selectedTime === time}
							<button
								class="time-slot"
								class:selected={isSelected}
								onclick={() => selectTime(time)}
								in:scale={{ duration: 200, delay: i * 50 }}
							>
								<Icon name="clock" size={16} stroke="currentColor" strokeWidth="2" />
								{time} Uhr
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Contact Information -->
			{#if selectedDate && selectedTime}
				<div class="contact-section" in:fly={{ y: 20, duration: 300 }}>
					{#if hasExistingData}
						<!-- Show existing contact data -->
						<div class="existing-data">
							<h4 class="contact-title">Deine Kontaktdaten</h4>
							<div class="data-grid">
								<div class="data-item">
									<span class="data-label">Name:</span>
									<span class="data-value">{formData.first_name} {formData.last_name}</span>
								</div>
								<div class="data-item">
									<span class="data-label">E-Mail:</span>
									<span class="data-value">{formData.email}</span>
								</div>
								{#if formData.phone}
									<div class="data-item">
										<span class="data-label">Telefon:</span>
										<span class="data-value">{formData.phone}</span>
									</div>
								{/if}
								{#if formData.company_name}
									<div class="data-item">
										<span class="data-label">Unternehmen:</span>
										<span class="data-value">{formData.company_name}</span>
									</div>
								{/if}
							</div>
						</div>
					{:else}
						<!-- Contact form -->
						<h4 class="contact-title">Kontaktdaten</h4>
						<div class="form-grid">
							<div class="form-field">
								<label for="firstName">Vorname *</label>
								<input
									id="firstName"
									type="text"
									bind:value={firstName}
									placeholder="Dein Vorname"
									required
								/>
							</div>
							<div class="form-field">
								<label for="lastName">Nachname *</label>
								<input
									id="lastName"
									type="text"
									bind:value={lastName}
									placeholder="Dein Nachname"
									required
								/>
							</div>
							<div class="form-field">
								<label for="email">E-Mail *</label>
								<input
									id="email"
									type="email"
									bind:value={email}
									placeholder="deine@email.de"
									required
								/>
							</div>
							<div class="form-field">
								<label for="phone">Telefon</label>
								<input
									id="phone"
									type="tel"
									bind:value={phone}
									placeholder="Telefonnummer"
								/>
							</div>
							<div class="form-field">
								<label for="companyName">Unternehmensname</label>
								<input
									id="companyName"
									type="text"
									bind:value={companyName}
									placeholder="Dein Unternehmen"
								/>
							</div>
							<div class="form-field">
								<label for="companyUrl">Website-URL</label>
								<input
									id="companyUrl"
									type="url"
									bind:value={companyUrl}
									placeholder="https://www.meinewebsite.de"
								/>
							</div>
						</div>
					{/if}

					<!-- Error Message -->
					{#if errorMessage}
						<div class="error-message" in:fly={{ y: -10, duration: 300 }}>
							<Icon name="alertCircle" size={20} stroke="currentColor" strokeWidth="2" />
							{errorMessage}
						</div>
					{/if}

					<!-- Book Button -->
					<button
						class="book-button"
						disabled={isLoading || (!hasExistingData && (!firstName || !lastName || !email))}
						onclick={handleBooking}
					>
						{#if isLoading}
							<div class="button-spinner"></div>
							Termin wird gebucht...
						{:else}
							<Icon name="calendar" size={20} stroke="currentColor" strokeWidth="2" fill="none" />
							Jetzt kostenlos buchen
						{/if}
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.tidycal-booking {
		width: 100%;
		max-width: 56rem;
		margin: 0 auto;
	}

	/* Success State */
	.success-state {
		text-align: center;
		padding: 3rem 1.5rem;
	}

	.success-icon {
		margin-bottom: 1.5rem;
		display: flex;
		justify-content: center;
	}

	.success-title {
		font-size: 1.875rem;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.success-message {
		font-size: 1.125rem;
		color: #4b5563;
		margin-bottom: 1.5rem;
		line-height: 1.75;
	}

	.success-info {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1rem;
		background: #d1fae5;
		border: 1px solid #10b981;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.success-info p {
		margin: 0;
		color: #065f46;
		font-size: 0.875rem;
	}

	.meeting-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: #10b981;
		color: white;
		text-decoration: none;
		border-radius: 0.5rem;
		font-weight: 600;
		transition: all 0.2s;
	}

	.meeting-link:hover {
		background: #059669;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	}

	/* Booking Form */
	.booking-form {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.booking-header {
		text-align: center;
		padding-bottom: 1.5rem;
		border-bottom: 2px solid #e5e7eb;
	}

	.booking-title {
		font-size: 1.875rem;
		font-weight: 700;
		color: #1f2937;
		margin: 1rem 0 0.5rem;
	}

	.booking-subtitle {
		font-size: 1rem;
		color: #6b7280;
	}

	/* Calendar Section */
	.calendar-section {
		background: #f9fafb;
		border-radius: 1rem;
		padding: 1.5rem;
	}

	.month-navigation {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	.nav-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid #d1d5db;
		background: white;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.nav-button:hover:not(:disabled) {
		background: #f3f4f6;
		border-color: #3b82f6;
	}

	.nav-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.month-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
	}

	.day-names {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.day-name {
		text-align: center;
		font-size: 0.875rem;
		font-weight: 600;
		color: #6b7280;
		padding: 0.5rem;
	}

	.loading-calendar {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem;
		gap: 1rem;
	}

	.spinner {
		width: 2.5rem;
		height: 2.5rem;
		border: 3px solid #e5e7eb;
		border-top-color: #3b82f6;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.5rem;
	}

	.calendar-day {
		position: relative;
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 2px solid transparent;
		background: white;
		border-radius: 0.75rem;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.calendar-day:not(.clickable) {
		cursor: not-allowed;
	}

	.calendar-day.other-month {
		color: #d1d5db;
		background: #f9fafb;
	}

	.calendar-day.past,
	.calendar-day.weekend {
		color: #9ca3af;
		background: #f3f4f6;
		text-decoration: line-through;
	}

	.calendar-day.has-slots:not(.past):not(.weekend):not(.other-month) {
		border-color: #3b82f6;
		background: white;
	}

	.calendar-day.clickable:hover {
		background: #dbeafe;
		border-color: #2563eb;
		transform: scale(1.05);
	}

	.calendar-day.selected {
		background: #3b82f6 !important;
		color: white !important;
		border-color: #2563eb !important;
	}

	.day-number {
		font-size: 1rem;
		font-weight: 600;
	}

	.availability-indicator {
		position: absolute;
		bottom: 0.25rem;
		width: 4px;
		height: 4px;
		background: #10b981;
		border-radius: 50%;
	}

	.calendar-day.selected .availability-indicator {
		background: white;
	}

	/* Time Section */
	.time-section {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 1rem;
		padding: 1.5rem;
	}

	.time-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.time-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 0.75rem;
	}

	.time-slot {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.875rem;
		border: 2px solid #d1d5db;
		background: white;
		border-radius: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.time-slot:hover {
		border-color: #3b82f6;
		background: #dbeafe;
	}

	.time-slot.selected {
		background: #3b82f6;
		color: white;
		border-color: #2563eb;
	}

	/* Contact Section */
	.contact-section {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 1rem;
		padding: 1.5rem;
	}

	.contact-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.existing-data {
		margin-bottom: 1.5rem;
	}

	.data-grid {
		display: grid;
		gap: 0.75rem;
	}

	.data-item {
		display: flex;
		justify-content: space-between;
		padding: 0.75rem;
		background: #f9fafb;
		border-radius: 0.5rem;
	}

	.data-label {
		font-weight: 500;
		color: #6b7280;
	}

	.data-value {
		color: #1f2937;
		font-weight: 600;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-field label {
		font-weight: 500;
		color: #374151;
		font-size: 0.875rem;
	}

	.form-field input {
		padding: 0.75rem;
		border: 2px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 1rem;
		transition: all 0.2s;
	}

	.form-field input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: #fee2e2;
		border: 1px solid #ef4444;
		border-radius: 0.5rem;
		color: #991b1b;
		margin-bottom: 1rem;
	}

	.book-button {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
		color: white;
		border: none;
		border-radius: 0.75rem;
		font-size: 1.125rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s;
	}

	.book-button:hover:not(:disabled) {
		background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
	}

	.book-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.button-spinner {
		width: 1.25rem;
		height: 1.25rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	/* Responsive Design */
	@media (max-width: 640px) {
		.calendar-grid {
			gap: 0.25rem;
		}

		.day-name {
			font-size: 0.75rem;
			padding: 0.25rem;
		}

		.calendar-day {
			font-size: 0.75rem;
		}

		.time-grid {
			grid-template-columns: 1fr 1fr;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
