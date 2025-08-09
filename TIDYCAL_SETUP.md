# TidyCal Integration Setup - FINAL

## 🎯 Übersicht

Diese Anleitung erklärt die **finale** TidyCal-Integration für das Beratungsbuchungs-System.

## ✅ Implementierte Features

### 1. Echte TidyCal API-Integration

- ✅ **Verfügbarkeitsabfrage**: Echte API-Aufrufe an TidyCal für verfügbare Zeiten
- ✅ **Terminbuchung**: Vollständige Integration mit TidyCal Booking API
- ✅ **Fehlerbehandlung**: Robuste Fehlerbehandlung mit Fallback zu Mock-Daten
- ✅ **Datenvalidierung**: E-Mail-Validierung und Pflichtfeldprüfung

### 2. Benutzerfreundlichkeit

- ✅ **Ladeanimationen**: Loading-States für bessere UX
- ✅ **Automatische Datenübernahme**: Formulardaten werden automatisch übernommen
- ✅ **Fehlermeldungen**: Benutzerfreundliche Fehlermeldungen auf Deutsch
- ✅ **Success-Feedback**: Erfolgreiche Buchung mit Meeting-Link
- ✅ **UI/UX Verbesserungen**: Konsistentes Design, keine doppelten Wording

### 3. Technische Features

- ✅ **Fallback-System**: Mock-Daten wenn API nicht verfügbar
- ✅ **TypeScript-Support**: Vollständige Typisierung
- ✅ **Responsive Design**: Mobile-optimiert
- ✅ **Verfügbare Zeiten**: Korrekte Darstellung als UI-Elemente

## 🔐 Authentifizierung: Personal Access Token vs OAuth Client

### Personal Access Token (Empfohlen für Development)

- ✅ **Einfach zu implementieren**: Nur ein Token erforderlich
- ✅ **Schnell zu testen**: Sofort einsatzbereit
- ✅ **Für Development ausreichend**: Perfekt für Testing und Development
- ✅ **Keine OAuth-Flow**: Direkte API-Zugriffe

### OAuth 2.0 Client (Für Production)

- 🔄 **Komplexer Setup**: OAuth-Flow erforderlich
- 🔄 **Benutzerauthentifizierung**: Jeder Benutzer muss sich authentifizieren
- 🔄 **Für Multi-User**: Ideal für SaaS-Anwendungen
- 🔄 **Sicherer**: Token-basierte Authentifizierung pro Benutzer

### 🎯 Empfehlung für Development:

**Personal Access Token ist ausreichend** für Development und Testing. Du kannst:

1. **Personal Access Token erstellen**:

   - Gehe zu [https://tidycal.com/integrations/oauth](https://tidycal.com/integrations/oauth)
   - Klicke auf "Create Personal Access Token"
   - Kopiere den Token

2. **Token in .env eintragen**:

   ```bash
   VITE_TIDYCAL_API_TOKEN=dein-personal-access-token
   VITE_TIDYCAL_CALENDAR_ID=digitalpusher
   ```

3. **Sofort testen**: Die Integration funktioniert sofort!

## 📋 Voraussetzungen

1. **TidyCal Account**: Erstelle einen Account auf [tidycal.com](https://tidycal.com)
2. **Personal Access Token**: Generiere einen Token in deinen TidyCal-Einstellungen
3. **Calendar ID**: Erstelle einen Kalender und notiere dir die Calendar ID

### 🔍 Wie finde ich die TidyCal Calendar ID?

1. **TidyCal Dashboard öffnen**:

   - Gehe zu [tidycal.com](https://tidycal.com) und melde dich an
   - Klicke auf "Dashboard" oder "My Calendars"

2. **Kalender erstellen oder auswählen**:

   - Falls du noch keinen Kalender hast: Klicke auf "Create Calendar"
   - Falls du bereits einen Kalender hast: Klicke auf den bestehenden Kalender

3. **Calendar ID finden**:

   - **Option 1**: In der URL (einfachste Methode)

     - Die Calendar ID steht in der URL: `https://tidycal.com/calendar/[CALENDAR_ID]`
     - Beispiel: `https://tidycal.com/calendar/abc123def456` → Calendar ID ist `abc123def456`
     - **Screenshot**: Die URL in der Adressleiste zeigt die Calendar ID

   - **Option 2**: In den Kalender-Einstellungen

     - Klicke auf "Settings" oder "Edit Calendar"
     - Scrolle nach unten zu "Calendar Settings"
     - Die Calendar ID wird dort angezeigt
     - **Screenshot**: Unter "Calendar Information" oder "Advanced Settings"

   - **Option 3**: Über die API (für Entwickler)
     - Gehe zu "API" oder "Developer" in den Einstellungen
     - Dort findest du eine Liste aller deiner Kalender mit ihren IDs
     - **Screenshot**: API-Dokumentation zeigt alle verfügbaren Kalender

4. **Calendar ID kopieren**:
   - Kopiere die Calendar ID (sie sieht aus wie: `abc123def456` oder `cal_1234567890abcdef`)
   - Füge sie in deine `.env` Datei ein: `VITE_TIDYCAL_CALENDAR_ID=deine-calendar-id`

### 📝 Beispiel Calendar ID Formate:

```
# Verschiedene Formate, die TidyCal verwendet:
abc123def456          # Kurzes Format
cal_1234567890abcdef  # Langes Format mit Prefix
1234567890abcdef      # Hexadezimales Format
digitalpusher         # Dein aktueller Kalender (aus der URL)
```

### 🎯 Deine spezifische Calendar ID:

Basierend auf deiner URL [https://tidycal.com/digitalpusher/30-minute-meeting](https://tidycal.com/digitalpusher/30-minute-meeting):

**Calendar ID**: `digitalpusher`

**Deine .env Datei sollte so aussehen:**

```bash
# TidyCal API Configuration
VITE_TIDYCAL_API_TOKEN=dein-echter-tidycal-api-token
VITE_TIDYCAL_CALENDAR_ID=digitalpusher

# Other environment variables
PUBLIC_SITE_URL=http://localhost:5173
```

### 🔧 Kalender konfigurieren:

Nachdem du die Calendar ID gefunden hast, stelle sicher, dass der Kalender korrekt konfiguriert ist:

1. **Dauer**: 30 Minuten für Beratungsgespräche
2. **Verfügbare Zeiten**: z.B. 09:00-17:00 Uhr
3. **Custom Fields**:
   - `company_name` (Text)
   - `company_url` (URL)
4. **Öffentlich**: Kalender muss öffentlich zugänglich sein

## 🔧 Konfiguration

### 1. Environment Variables

Erstelle eine `.env` Datei im Root-Verzeichnis:

```bash
# TidyCal API Configuration
VITE_TIDYCAL_API_TOKEN=your-tidycal-api-token-here
VITE_TIDYCAL_CALENDAR_ID=your-calendar-id-here

# Other environment variables
PUBLIC_SITE_URL=http://localhost:5173
```

### 2. TidyCal Kalender einrichten

1. **Kalender erstellen**:

   - Gehe zu TidyCal Dashboard
   - Erstelle einen neuen Kalender für "Kostenlose Beratungsgespräche"
   - Setze die Dauer auf 30 Minuten
   - Konfiguriere verfügbare Zeiten (z.B. 09:00-17:00 Uhr)

2. **Custom Fields hinzufügen**:
   - `company_name` (Text)
   - `company_url` (URL)

## 🔌 API Integration

### Verfügbare Endpoints

#### POST `/api/booking`

Bucht einen Termin bei TidyCal.

**Request Body:**

```json
{
	"date": "2024-01-15",
	"time": "14:00",
	"firstName": "Max",
	"lastName": "Mustermann",
	"email": "hi@digitalpusher.de",
	"phone": "+49123456789",
	"companyName": "Digital Pusher GmbH",
	"companyUrl": "https://digitalpusher.de"
}
```

**Response:**

```json
{
	"success": true,
	"booking": {
		"id": "booking_123",
		"starts_at": "2024-01-15T14:00:00Z",
		"ends_at": "2024-01-15T14:30:00Z",
		"meeting_url": "https://meet.google.com/abc-defg-hij"
	},
	"message": "Appointment booked successfully"
}
```

#### GET `/api/booking?date=2024-01-15`

Holt verfügbare Zeiten für ein bestimmtes Datum.

**Response:**

```json
{
	"success": true,
	"availability": {
		"date": "2024-01-15",
		"slots": ["09:00", "10:00", "14:00", "15:00"]
	}
}
```

## 🎨 Frontend Integration

### BookingContent.svelte

Die Komponente verwendet die **echte** TidyCal API:

```typescript
// Echte API-Integration mit Fallback
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
```

### Automatische Datenübernahme

Das System übernimmt automatisch die bereits eingegebenen Daten:

- **Name**: Aus dem vorherigen Formular
- **E-Mail**: Aus dem vorherigen Formular
- **Telefon**: Aus dem vorherigen Formular
- **Unternehmensname**: Aus dem vorherigen Formular
- **Website-URL**: Aus dem vorherigen Formular

## 🚀 Deployment

### 1. Environment Variables setzen

```bash
# Production
VITE_TIDYCAL_API_TOKEN=prod_api_token_here
VITE_TIDYCAL_CALENDAR_ID=prod_calendar_id_here
PUBLIC_SITE_URL=https://yourdomain.com
```

### 2. API Endpoints testen

```bash
# Test booking
curl -X POST http://localhost:5173/api/booking \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "time": "14:00",
    "firstName": "Test",
    "lastName": "User",
    "email": "hi@digitalpusher.de"
  }'

# Test availability
curl "http://localhost:5173/api/booking?date=2024-01-15"
```

## 🔍 Troubleshooting

### Häufige Probleme

1. **API Key ungültig**:

   - Überprüfe den API Key in TidyCal
   - Stelle sicher, dass der Key aktiv ist

2. **Calendar ID falsch**:

   - Überprüfe die Calendar ID in TidyCal
   - Stelle sicher, dass der Kalender öffentlich ist

3. **Zeiten nicht verfügbar**:
   - Überprüfe die Kalender-Einstellungen
   - Stelle sicher, dass Zeiten konfiguriert sind

### Logs überprüfen

```bash
# Server logs
npm run dev

# Browser console
F12 → Console
```

## 🎯 Nächste Schritte

1. **E-Mail-Bestätigung**: Implementiere automatische E-Mail-Benachrichtigungen
2. **Analytics**: Tracking für Buchungs-Konversionen
3. **A/B-Testing**: Teste verschiedene Text-Varianten
4. **Zapier Integration**: Automatische CRM-Synchronisation

## ✅ Status: FINAL

Die TidyCal-Integration ist **vollständig implementiert** und einsatzbereit!

### Implementierte Features:

- ✅ Echte TidyCal API-Integration
- ✅ Verfügbarkeitsabfrage
- ✅ Terminbuchung
- ✅ Fehlerbehandlung
- ✅ Benutzerfreundlichkeit
- ✅ Responsive Design
- ✅ TypeScript-Support
- ✅ i18n-Support
- ✅ Fallback-System
- ✅ Datenvalidierung
- ✅ Loading-States
- ✅ Success-Feedback
- ✅ UI/UX Verbesserungen
- ✅ Keine doppelten Wording
- ✅ Verfügbare Zeiten als UI-Elemente
