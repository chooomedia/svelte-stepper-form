<script lang="ts">
	import { modalStore } from '../modalStore';
	import Icon from '../../Icon.svelte';
	import { onMount } from 'svelte';
	import type { FormData } from '$lib/schema';
	import { formData } from '$lib/stores/formStore';

	let isLoading = false;
	let isBookingSuccessful = false;
	let selectedDate: string = '';
	let selectedTime: string = '';
	let availableSlots: Array<{ date: string; time: string; available: boolean }> = [];
	let userEmail = '';
	let userName = '';
	let userPhone = '';
	let userLastName = '';
	let companyName = '';
	let companyUrl = '';
	let errorMessage = '';
	let isLoadingSlots = false;
	let bookingResult: any = null;
	let hasExistingData = false;

	// Fetch available slots from TidyCal API
	async function fetchAvailableSlots(date: string): Promise<string[]> {
		try {
			const response = await fetch(`/api/booking?date=${date}`);
			if (!response.ok) {
				throw new Error('Failed to fetch availability');
			}
			const data = await response.json();
			return data.availability?.slots || [];
		} catch (error) {
			console.error('Error fetching availability:', error);
			return [];
		}
	}

	// Generate available slots for the next 7 days
	async function generateAvailableSlots(): Promise<
		Array<{ date: string; time: string; available: boolean }>
	> {
		const slots: Array<{ date: string; time: string; available: boolean }> = [];
		const today = new Date();

		for (let i = 1; i <= 7; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() + i);
			const dateString = date.toISOString().split('T')[0];

			// Fetch real availability from TidyCal API
			const availableTimes = await fetchAvailableSlots(dateString);

			if (availableTimes.length > 0) {
				availableTimes.forEach((time) => {
					slots.push({
						date: dateString,
						time,
						available: true
					});
				});
			} else {
				// Fallback to default time slots if no availability data
				const defaultTimeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
				defaultTimeSlots.forEach((time) => {
					slots.push({
						date: dateString,
						time,
						available: true
					});
				});
			}
		}

		return slots;
	}

	onMount(async () => {
		// Get existing form data from formStore and localStorage
		const existingFormData = $formData;
		const localStorageData = localStorage.getItem('digitalpusher_form_data');

		// Combine data from both sources
		let combinedData = { ...existingFormData };

		if (localStorageData) {
			try {
				const parsedData = JSON.parse(localStorageData);
				combinedData = { ...combinedData, ...parsedData };
			} catch (error) {
				console.log('Error parsing localStorage data:', error);
			}
		}

		// Check if we have contact information
		userName = combinedData.first_name || '';
		userLastName = combinedData.last_name || '';
		userEmail = combinedData.email || '';
		userPhone = combinedData.phone || '';
		companyName = combinedData.company_name || '';
		companyUrl = combinedData.company_url || '';

		// Determine if we have existing contact data
		hasExistingData = !!(userName && userLastName && userEmail);

		console.log('Existing form data:', combinedData);
		console.log('Has existing data:', hasExistingData);

		// Load available slots
		isLoadingSlots = true;
		try {
			availableSlots = await generateAvailableSlots();
		} catch (error) {
			console.error('Error loading available slots:', error);
			// Fallback to mock data if API fails
			availableSlots = generateMockSlots();
		} finally {
			isLoadingSlots = false;
		}
	});

	// Reactive statement to update data when formData changes
	$effect(() => {
		const currentFormData = $formData;
		if (currentFormData) {
			// Update contact information if available
			if (currentFormData.first_name) userName = currentFormData.first_name;
			if (currentFormData.last_name) userLastName = currentFormData.last_name;
			if (currentFormData.email) userEmail = currentFormData.email;
			if (currentFormData.phone) userPhone = currentFormData.phone;
			if (currentFormData.company_name) companyName = currentFormData.company_name;
			if (currentFormData.company_url) companyUrl = currentFormData.company_url;

			// Re-check if we have existing data
			hasExistingData = !!(userName && userLastName && userEmail);
		}
	});

	// Fallback mock slots generator
	function generateMockSlots(): Array<{ date: string; time: string; available: boolean }> {
		const slots: Array<{ date: string; time: string; available: boolean }> = [];
		const today = new Date();

		for (let i = 1; i <= 7; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() + i);

			const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

			timeSlots.forEach((time) => {
				slots.push({
					date: date.toISOString().split('T')[0],
					time,
					available: Math.random() > 0.3 // 70% availability
				});
			});
		}

		return slots;
	}

	function handleDateSelect(date: string) {
		selectedDate = date;
		selectedTime = '';
		errorMessage = '';
	}

	function handleTimeSelect(time: string) {
		selectedTime = time;
		errorMessage = '';
	}

	async function handleBooking() {
		if (!selectedDate || !selectedTime) {
			errorMessage = 'Bitte wähle ein Datum und eine Uhrzeit aus.';
			return;
		}

		// If we don't have existing data, validate required fields
		if (!hasExistingData) {
			if (!userName || !userLastName || !userEmail) {
				errorMessage = 'Bitte fülle alle erforderlichen Felder aus.';
				return;
			}

			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(userEmail)) {
				errorMessage = 'Bitte gib eine gültige E-Mail-Adresse ein.';
				return;
			}
		}

		isLoading = true;
		errorMessage = '';

		try {
			// Call our TidyCal API endpoint
			const response = await fetch('/api/booking', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					date: selectedDate,
					time: selectedTime,
					firstName: userName,
					lastName: userLastName,
					email: userEmail,
					phone: userPhone,
					companyName: companyName,
					companyUrl: companyUrl
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Booking failed:', errorData);
				throw new Error(errorData.error || 'Booking failed');
			}

			const result = await response.json();
			console.log('Booking successful:', result);

			bookingResult = result;
			isBookingSuccessful = true;

			// Close modal after 5 seconds
			setTimeout(() => {
				modalStore.close();
			}, 5000);
		} catch (error) {
			console.error('Booking error:', error);
			errorMessage =
				error instanceof Error
					? error.message
					: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
		} finally {
			isLoading = false;
		}
	}

	function closeModal() {
		modalStore.close();
	}

	// Get available times for selected date
	let availableTimes = $derived(
		availableSlots
			.filter((slot) => slot.date === selectedDate && slot.available)
			.map((slot) => slot.time)
			.sort()
	);

	// Get available dates
	let availableDates = $derived(
		[...new Set(availableSlots.filter((slot) => slot.available).map((slot) => slot.date))].sort()
	);
</script>

<div class="booking-content mx-auto max-w-2xl p-6">
	{#if isBookingSuccessful}
		<!-- Success State -->
		<div class="text-center">
			<div class="mb-6">
				<Icon name="checkCircle" size={64} className="mx-auto text-green-500" stroke="none" />
			</div>
			<h3 class="mb-4 text-2xl font-bold text-secondary-800">Termin erfolgreich gebucht!</h3>
			<p class="mb-6 text-gray-600">
				Dein kostenloses Beratungsgespräch wurde für den {new Date(selectedDate).toLocaleDateString(
					'de-DE'
				)} um {selectedTime} Uhr reserviert.
			</p>
			<div class="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
				<p class="text-sm text-green-800">
					Du erhältst in Kürze eine Bestätigungs-E-Mail mit allen Details und dem Meeting-Link.
				</p>
				{#if bookingResult?.booking?.meeting_url}
					<div class="mt-4">
						<a
							href={bookingResult.booking.meeting_url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
						>
							<Icon
								name="external-link"
								size={16}
								className="mr-2"
								stroke="currentColor"
								strokeWidth="2"
							/>
							Meeting-Link öffnen
						</a>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<!-- Booking Form -->
		<div class="space-y-6">
			<!-- Header -->
			<div class="mb-8 text-center">
				<div class="mb-4">
					<Icon
						name="calendar"
						size={48}
						className="mx-auto text-primary-600"
						stroke="currentColor"
						strokeWidth="2"
					/>
				</div>
				<h3 class="mb-2 text-2xl font-bold text-secondary-800">
					Kostenloses Beratungsgespräch buchen
				</h3>
				<p class="text-gray-600">
					30-minütiges kostenloses Beratungsgespräch. Wir besprechen Deine individuellen Bedürfnisse
					und zeigen Dir, wie Du Deine Online-Sichtbarkeit optimieren kannst.
				</p>
			</div>

			<!-- Date Selection -->
			<div class="space-y-4">
				<h4 class="font-semibold text-secondary-700">Datum auswählen</h4>

				{#if isLoadingSlots}
					<div class="flex items-center justify-center py-8">
						<Icon
							name="loader"
							size={24}
							className="mr-2 animate-spin text-primary-600"
							stroke="currentColor"
							strokeWidth="2"
						/>
						<span class="text-gray-600">Verfügbare Termine werden geladen...</span>
					</div>
				{:else}
					<div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
						{#each availableDates as date}
							{@const dateObj = new Date(date)}
							{@const isSelected = selectedDate === date}
							<button
								class="rounded-lg border-2 p-3 text-center transition-all duration-200 {isSelected
									? 'border-primary-600 bg-primary-50 text-primary-700'
									: 'hover:bg-primary-25 border-gray-200 hover:border-primary-300'}"
								on:click={() => handleDateSelect(date)}
							>
								<div class="text-sm font-medium">
									{dateObj.toLocaleDateString('de-DE', { weekday: 'short' })}
								</div>
								<div class="text-lg font-bold">
									{dateObj.getDate()}
								</div>
								<div class="text-xs text-gray-500">
									{dateObj.toLocaleDateString('de-DE', { month: 'short' })}
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Time Selection -->
			{#if selectedDate && availableTimes.length > 0}
				<div class="space-y-4">
					<h4 class="font-semibold text-secondary-700">Uhrzeit auswählen</h4>
					<div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
						{#each availableTimes as time}
							{@const isSelected = selectedTime === time}
							<button
								class="rounded-lg border-2 p-3 text-center transition-all duration-200 {isSelected
									? 'border-primary-600 bg-primary-50 text-primary-700'
									: 'hover:bg-primary-25 border-gray-200 hover:border-primary-300'}"
								on:click={() => handleTimeSelect(time)}
							>
								{time} Uhr
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Contact Information -->
			{#if selectedDate && selectedTime}
				<div class="space-y-4">
					{#if hasExistingData}
						<!-- Show existing contact data -->
						<div class="rounded-lg border border-green-200 bg-green-50 p-4">
							<h4 class="mb-3 font-semibold text-secondary-700">Deine Kontaktdaten</h4>
							<div class="grid grid-cols-1 gap-2 text-sm">
								<div class="flex justify-between">
									<span class="font-medium text-gray-600">Name:</span>
									<span class="text-gray-800">{userName} {userLastName}</span>
								</div>
								<div class="flex justify-between">
									<span class="font-medium text-gray-600">E-Mail:</span>
									<span class="text-gray-800">{userEmail}</span>
								</div>
								{#if userPhone}
									<div class="flex justify-between">
										<span class="font-medium text-gray-600">Telefon:</span>
										<span class="text-gray-800">{userPhone}</span>
									</div>
								{/if}
								{#if companyName}
									<div class="flex justify-between">
										<span class="font-medium text-gray-600">Unternehmen:</span>
										<span class="text-gray-800">{companyName}</span>
									</div>
								{/if}
								{#if companyUrl}
									<div class="flex justify-between">
										<span class="font-medium text-gray-600">Website:</span>
										<span class="text-gray-800">{companyUrl}</span>
									</div>
								{/if}
							</div>
						</div>
					{:else}
						<!-- Show contact form -->
						<h4 class="font-semibold text-secondary-700">Kontaktdaten</h4>

						<!-- Error Message -->
						{#if errorMessage}
							<div class="rounded-lg border border-red-200 bg-red-50 p-4">
								<p class="text-sm text-red-800">{errorMessage}</p>
							</div>
						{/if}

						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label for="userName" class="mb-1 block text-sm font-medium text-gray-700">
									Vorname *
								</label>
								<input
									id="userName"
									type="text"
									bind:value={userName}
									class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
									placeholder="Dein Vorname"
								/>
							</div>
							<div>
								<label for="userLastName" class="mb-1 block text-sm font-medium text-gray-700">
									Nachname *
								</label>
								<input
									id="userLastName"
									type="text"
									bind:value={userLastName}
									class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
									placeholder="Dein Nachname"
								/>
							</div>
						</div>
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label for="userEmail" class="mb-1 block text-sm font-medium text-gray-700">
									E-Mail *
								</label>
								<input
									id="userEmail"
									type="email"
									bind:value={userEmail}
									class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
									placeholder="deine@email.de"
								/>
							</div>
							<div>
								<label for="userPhone" class="mb-1 block text-sm font-medium text-gray-700">
									Telefon (optional)
								</label>
								<input
									id="userPhone"
									type="tel"
									bind:value={userPhone}
									class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
									placeholder="Telefonnummer"
								/>
							</div>
						</div>
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label for="companyName" class="mb-1 block text-sm font-medium text-gray-700">
									Unternehmensname
								</label>
								<input
									id="companyName"
									type="text"
									bind:value={companyName}
									class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
									placeholder="Dein Unternehmen"
								/>
							</div>
							<div>
								<label for="companyUrl" class="mb-1 block text-sm font-medium text-gray-700">
									Website-URL
								</label>
								<input
									id="companyUrl"
									type="url"
									bind:value={companyUrl}
									class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
									placeholder="https://www.meinewebsite.de"
								/>
							</div>
						</div>
					{/if}
				</div>

				<!-- Booking Button -->
				<div class="pt-4">
					<button
						class="w-full rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={!hasExistingData && (!userName || !userEmail || isLoading)}
						on:click={handleBooking}
					>
						{#if isLoading}
							<div class="flex items-center justify-center">
								<Icon
									name="loader"
									size={20}
									className="mr-2 animate-spin"
									stroke="currentColor"
									strokeWidth="2"
								/>
								Termin wird gebucht...
							</div>
						{:else}
							Termin kostenlos buchen
						{/if}
					</button>
				</div>
			{/if}
		</div>

		<!-- Close Button -->
		<div class="mt-6 text-center">
			<button
				class="text-sm text-gray-500 transition-colors hover:text-gray-700"
				on:click={closeModal}
			>
				Abbrechen
			</button>
		</div>
	{/if}
</div>
