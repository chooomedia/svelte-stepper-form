<script lang="ts">
	import { modalStore } from '../modalStore';
	import Icon from '../../Icon.svelte';
	import { onMount } from 'svelte';
	import type { FormData } from '$lib/schema';
	import type { SuperForm } from 'sveltekit-superforms';
	import { formData as formStoreData, updateFormData, setFormStatus } from '$lib/stores/formStore';

	// UI State
	let isLoading = $state(false);
	let isBookingSuccessful = $state(false);
	let isLoadingSlots = $state(false);
	let errorMessage = $state('');
	let bookingResult = $state<any>(null);
	let technicalError = $state<string | null>(null);
	let showTechnicalError = $state(false);

	// Funktion zum Parsen und Formatieren technischer Fehler
	function parseTechnicalError(error: string): string {
		try {
			// Versuche den Fehler als Code-Block zu erkennen
			if (
				error.includes('function subscribe') ||
				error.includes('function set') ||
				error.includes('function update')
			) {
				return 'Ein technischer Fehler ist aufgetreten. Bitte laden Sie die Seite neu.';
			}
			return error;
		} catch {
			return 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
		}
	}

	let { form } = $props<{
		form: SuperForm<FormData>;
	}>();

	// Form Data
	let selectedDate = $state('');
	let selectedTime = $state('');
	let availableSlots = $state<Array<{ date: string; time: string; available: boolean }>>([]);

	// Intelligente Datenquelle: formStore -> SuperForm -> localStorage -> Fallback
	let contactData = $derived(() => {
		// 1. Priorität: formStore (wenn verfügbar)
		if ($formStoreData && Object.keys($formStoreData).length > 0) {
			console.log('🔍 Using formStore data:', $formStoreData);
			return $formStoreData;
		}

		// 2. Priorität: SuperForm data
		if ($form?.data && Object.keys($form.data).length > 0) {
			console.log('🔍 Using SuperForm data:', $form.data);
			return $form.data;
		}

		// 3. Priorität: localStorage (als Fallback)
		try {
			const localStorageData = localStorage.getItem('digitalpusher_form_data');
			if (localStorageData) {
				const parsedData = JSON.parse(localStorageData);
				console.log('🔍 Using localStorage data:', parsedData);
				return parsedData;
			}
		} catch (error) {
			console.log('Error parsing localStorage data:', error);
		}

		// 4. Fallback: Leeres Objekt
		console.log('🔍 No data available, using fallback');
		return {};
	});

	// Force re-evaluation when modal opens and ensure data sync
	$effect(() => {
		if ($modalStore.isOpen) {
			console.log('🔍 Modal opened, re-evaluating contact data');
			console.log('🔍 Current formStore data:', $formStoreData);
			console.log('🔍 Current SuperForm data:', $form?.data);

			// Ensure SuperForm data is synced to formStore
			if ($form?.data && Object.keys($form.data).length > 0) {
				console.log('🔍 Syncing SuperForm data to formStore on modal open');
				updateFormData($form.data);
			}
		}
	});

	// Computed user data with intelligent fallbacks
	let userEmail = $derived(contactData().email || '');
	let userName = $derived(contactData().first_name || '');
	let userLastName = $derived(contactData().last_name || '');
	let userPhone = $derived(contactData().phone || '');
	let companyName = $derived(contactData().company_name || '');
	let companyUrl = $derived(contactData().company_url || '');

	// Determine if we have existing contact data
	let hasExistingData = $derived(Boolean(userName && userLastName && userEmail));

	// Sync data back to formStore when available
	$effect(() => {
		if ($form?.data && Object.keys($form.data).length > 0) {
			console.log('🔍 Syncing SuperForm data to formStore');
			updateFormData($form.data);
		}
	});

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

	// Generate available slots for the next 7 days (excluding weekends and before 10:00)
	async function generateAvailableSlots(): Promise<
		Array<{ date: string; time: string; available: boolean }>
	> {
		const slots: Array<{ date: string; time: string; available: boolean }> = [];
		const today = new Date();

		for (let i = 1; i <= 14; i++) {
			// Increased to 14 days to account for weekends
			const date = new Date(today);
			date.setDate(today.getDate() + i);
			const dateString = date.toISOString().split('T')[0];

			// Skip weekends (Saturday = 6, Sunday = 0)
			const dayOfWeek = date.getDay();
			if (dayOfWeek === 0 || dayOfWeek === 6) {
				continue;
			}

			// Fetch real availability from TidyCal API
			const availableTimes = await fetchAvailableSlots(dateString);

			if (availableTimes.length > 0) {
				// Filter times to only include 10:00 and later
				const filteredTimes = availableTimes.filter((time) => {
					const hour = parseInt(time.split(':')[0]);
					return hour >= 10;
				});

				filteredTimes.forEach((time) => {
					slots.push({
						date: dateString,
						time,
						available: true
					});
				});
			} else {
				// Fallback to default time slots (10:00 and later)
				const defaultTimeSlots = ['10:00', '11:00', '14:00', '15:00', '16:00'];
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
		console.log('🔍 BookingContent mounted, contact data:', contactData());
		console.log('🔍 Has existing data:', hasExistingData);

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

	// Fallback mock slots generator (excluding weekends and before 10:00)
	function generateMockSlots(): Array<{ date: string; time: string; available: boolean }> {
		const slots: Array<{ date: string; time: string; available: boolean }> = [];
		const today = new Date();

		for (let i = 1; i <= 14; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() + i);

			// Skip weekends
			const dayOfWeek = date.getDay();
			if (dayOfWeek === 0 || dayOfWeek === 6) {
				continue;
			}

			const timeSlots = ['10:00', '11:00', '14:00', '15:00', '16:00'];

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

	async function validateBookingData(): Promise<boolean> {
		// Reset error message
		errorMessage = '';

		// Validate date and time
		if (!selectedDate || !selectedTime) {
			errorMessage = 'Bitte wähle ein Datum und eine Uhrzeit aus.';
			return false;
		}

		// Validate user data
		if (!hasExistingData) {
			if (!userName || !userLastName || !userEmail) {
				errorMessage = 'Bitte fülle alle erforderlichen Felder aus.';
				return false;
			}

			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(userEmail)) {
				errorMessage = 'Bitte gib eine gültige E-Mail-Adresse ein.';
				return false;
			}
		}

		return true;
	}

	async function handleBooking() {
		// Validate booking data
		if (!(await validateBookingData())) {
			return;
		}

		// Start loading state
		isLoading = true;
		errorMessage = '';
		setFormStatus('submitting');

		try {
			// Prepare booking data
			const bookingData = {
				date: selectedDate,
				time: selectedTime,
				firstName: userName,
				lastName: userLastName,
				email: userEmail,
				phone: userPhone,
				companyName: companyName,
				companyUrl: companyUrl,
				formData: contactData, // Include complete contact data
				source: 'booking_modal'
			};

			console.log('🔍 Booking data:', bookingData);

			// Update formStore with latest contact data
			updateFormData({
				first_name: userName,
				last_name: userLastName,
				email: userEmail,
				phone: userPhone,
				company_name: companyName,
				company_url: companyUrl
			});

			// Call TidyCal API endpoint
			const response = await fetch('/api/booking', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(bookingData)
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Buchung fehlgeschlagen');
			}

			console.log('🔍 Booking successful:', result);

			// Update UI state
			bookingResult = result;
			isBookingSuccessful = true;
			setFormStatus('success');

			// Erfolgreiche Buchung - Modal bleibt offen für Benutzer-Interaktion
			// Das Modal wird nur durch Benutzer-Interaktion geschlossen
			console.log('🔍 Booking successful - Modal remains open for user interaction');
		} catch (error) {
			console.error('🔍 Booking error:', error);
			setFormStatus('error');

			// Prüfe auf technische Fehler
			if (error instanceof Error && error.message.includes('function')) {
				technicalError = parseTechnicalError(error.message);
				showTechnicalError = true;
				errorMessage = 'Ein technischer Fehler ist aufgetreten.';
			} else {
				errorMessage =
					error instanceof Error
						? error.message
						: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
			}
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

	// ContactForm-Style Funktionen
	let touchedFields = $state(new Set<string>());

	function handleBlur(fieldName: string) {
		touchedFields.add(fieldName);
	}

	function getAriaAttrs(_fieldName: string, label: string) {
		return {
			'aria-invalid': false,
			'aria-describedby': undefined,
			'aria-label': label
		};
	}
</script>

<div class="booking-content mx-auto max-w-2xl">
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
						fill="none"
					/>
				</div>
			</div>

			<!-- Date Selection -->
			<div class="space-y-4">
				<h4 class="font-semibold text-secondary-700">Datum auswählen</h4>

				{#if isLoadingSlots}
					<div class="flex items-center justify-center py-8">
						<div class="flex items-center space-x-2">
							<div class="h-6 w-6 animate-spin rounded-full border-b-2 border-primary-600"></div>
							<span class="text-gray-600">Verfügbare Termine werden geladen...</span>
						</div>
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
								onclick={() => handleDateSelect(date)}
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
								onclick={() => handleTimeSelect(time)}
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

						<!-- Error Messages -->
						{#if errorMessage || showTechnicalError}
							<div class="space-y-4">
								<!-- Hauptfehlermeldung -->
								<div class="rounded-lg border border-red-200 bg-red-50 p-4">
									<div class="flex">
										<div class="flex-shrink-0">
											<div class="h-5 w-5 text-red-400">
												<Icon name="closeX" size={20} stroke="currentColor" />
											</div>
										</div>
										<div class="ml-3">
											<h3 class="text-sm font-medium text-red-800">
												{errorMessage}
											</h3>
										</div>
									</div>
								</div>

								<!-- Technische Details (wenn vorhanden) -->
								{#if showTechnicalError && technicalError}
									<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
										<div class="flex">
											<div class="flex-shrink-0">
												<div class="h-5 w-5 text-gray-400">
													<Icon name="info" size={20} stroke="currentColor" />
												</div>
											</div>
											<div class="ml-3">
												<div class="text-sm text-gray-700">
													<p class="font-medium">Technische Details:</p>
													<p class="mt-1">{technicalError}</p>
													<button
														class="mt-2 text-sm font-medium text-primary-600 hover:text-primary-500"
														onclick={() => {
															showTechnicalError = false;
															technicalError = null;
														}}
													>
														Details ausblenden
													</button>
												</div>
											</div>
										</div>
									</div>
								{/if}
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
									class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
									placeholder="Dein Vorname"
									onblur={() => handleBlur('first_name')}
									{...getAriaAttrs('first_name', 'Vorname')}
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
									class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
									placeholder="Dein Nachname"
									onblur={() => handleBlur('last_name')}
									{...getAriaAttrs('last_name', 'Nachname')}
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
									class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
									placeholder="deine@email.de"
									onblur={() => handleBlur('email')}
									{...getAriaAttrs('email', 'E-Mail-Adresse')}
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
									class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
									placeholder="Telefonnummer"
									onblur={() => handleBlur('phone')}
									{...getAriaAttrs('phone', 'Telefonnummer')}
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
									class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
									placeholder="Dein Unternehmen"
									onblur={() => handleBlur('company_name')}
									{...getAriaAttrs('company_name', 'Unternehmensname')}
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
									class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
									placeholder="https://www.meinewebsite.de"
									onblur={() => handleBlur('company_url')}
									{...getAriaAttrs('company_url', 'Website-URL')}
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
						onclick={handleBooking}
					>
						{#if isLoading}
							<div class="flex items-center justify-center">
								<div class="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
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
				onclick={closeModal}
			>
				Abbrechen
			</button>
		</div>
	{/if}
</div>
