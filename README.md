# Svelte Stepper Form

Ein modernes, mehrstufiges Formular-System mit SvelteKit und SuperForms.

## 🚀 Schnellstart

### Voraussetzungen

- Node.js 18+
- npm oder yarn

### Installation

1. Repository klonen:

```bash
git clone <repository-url>
cd svelte-stepper-form
```

2. Dependencies installieren:

```bash
npm install
```

3. Umgebungsvariablen konfigurieren:

```bash
cp .env.example .env
```

4. `.env` Datei mit deinen Werten bearbeiten:

```bash
# Demo/Test Data
VITE_DEMO_URL=https://digitalpusher.de
VITE_DEMO_EMAIL=hi@digitalpusher.de
VITE_DEMO_PHONE=+49123456789
VITE_DEMO_COMPANY_NAME=Test Company

# API Configuration
VITE_TIDYCAL_API_TOKEN=your_tidycal_api_token_here

# Development Settings
VITE_DEV_MODE=true
VITE_DEBUG_ENABLED=false
```

5. Entwicklungsserver starten:

```bash
npm run dev
```

## 🔧 Konfiguration

### Umgebungsvariablen

Alle privaten Daten und Konfigurationswerte sind in Umgebungsvariablen ausgelagert:

- `VITE_DEMO_URL`: Demo-URL für Tests (Standard: https://digitalpusher.de)
- `VITE_DEMO_EMAIL`: Demo-E-Mail für Tests (Standard: hi@digitalpusher.de)
- `VITE_DEMO_PHONE`: Demo-Telefonnummer für Tests (Standard: +49123456789)
- `VITE_DEMO_COMPANY_NAME`: Demo-Firmenname für Tests (Standard: Test Company)
- `VITE_TIDYCAL_API_TOKEN`: TidyCal API Token für Buchungen
- `VITE_DEV_MODE`: Entwicklungsmodus aktivieren (Standard: true)
- `VITE_DEBUG_ENABLED`: Debug-Modus aktivieren (Standard: false)

### Zentrale Konfiguration

Alle Umgebungsvariablen werden zentral in `src/lib/config/env.ts` verwaltet:

```typescript
import { env } from '$lib/config/env';

// Verwendung
const demoUrl = env.DEMO_URL;
const demoEmail = env.DEMO_EMAIL;
```

## 📁 Projektstruktur

```
src/
├── lib/
│   ├── config/
│   │   └── env.ts              # Zentrale Umgebungsvariablen-Konfiguration
│   ├── components/
│   │   ├── forms/              # Formular-Komponenten
│   │   └── modal/              # Modal-Komponenten
│   ├── stores/                 # Svelte Stores
│   ├── utils/                  # Utility-Funktionen
│   └── schema.ts              # Zod-Schemas
├── routes/
│   ├── +page.svelte           # Hauptseite
│   └── +page.server.ts        # Server-seitige Logik
└── app.html                   # HTML-Template
```

## 🔒 Sicherheit

- **Keine privaten Daten im Code**: Alle privaten Daten sind in `.env` Dateien ausgelagert
- **Gitignore**: `.env` Dateien sind in `.gitignore` eingetragen
- **Beispiel-Konfiguration**: `.env.example` zeigt alle benötigten Variablen
- **Zentrale Verwaltung**: Alle Umgebungsvariablen werden zentral in `env.ts` verwaltet

## 🚀 Deployment

1. Umgebungsvariablen in der Produktionsumgebung setzen
2. Build erstellen: `npm run build`
3. Build testen: `npm run preview`
4. Deployment durchführen

## 📝 Entwicklung

### Code-Standards

- TypeScript für alle Dateien
- ESLint für Code-Qualität
- Prettier für Code-Formatierung
- SvelteKit Best Practices

### Debugging

Debug-Modus aktivieren:

```bash
VITE_DEBUG_ENABLED=true npm run dev
```

## 🤝 Beitragen

1. Fork erstellen
2. Feature-Branch erstellen: `git checkout -b feature/amazing-feature`
3. Änderungen committen: `git commit -m 'Add amazing feature'`
4. Branch pushen: `git push origin feature/amazing-feature`
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.
