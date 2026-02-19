# E2E Integration Tests

Diese Tests überprüfen die Integration zwischen der Svelte-App und den n8n Workflows.

## 🚀 Verfügbare Tests

### Website Analysis Integration

```bash
# CLI Test
npm run test:webhook:website

# Direkt mit Node
node e2e/test-website-analysis-integration.js
```

### Invoice Integration

```bash
# CLI Test
npm run test:webhook:invoice

# Direkt mit Node
node e2e/test-invoice-integration.js
```

### Alle Integration Tests

```bash
# Alle Tests zusammen
npm run test:webhook:all
npm run test:integration

# Direkt mit Node
node e2e/e2e-test-suite.js
```

## 📋 Test-Features

### ✅ Website Analysis Tests

- **Standard Test**: Normale Website-Analyse Daten
- **Variation Test**: Verschiedene Unternehmensdaten
- **English Test**: Englische Sprache
- **Retry Logic**: Automatische Wiederholung bei Fehlern
- **Timeout Handling**: 10 Sekunden Timeout
- **Detailed Logging**: Umfassende Ausgabe

### ✅ Invoice Tests

- **Standard Test**: Normale Rechnungsdaten
- **Variation Test**: Verschiedene Kunden- und Produktdaten
- **No Donation Test**: Rechnung ohne Betterplace-Spende
- **Invoice Service Test**: Vollständige Service-Integration
- **Retry Logic**: Automatische Wiederholung bei Fehlern
- **Timeout Handling**: 10 Sekunden Timeout

## 🔧 Konfiguration

Die Tests verwenden eine zentrale Konfiguration:

```javascript
const CONFIG = {
	n8nBaseUrl: 'https://n8n.chooomedia.com',
	webhookPath: '/webhook/[endpoint]',
	timeout: 10000,
	retries: 3
};
```

## 📊 Test-Ergebnisse

### Erfolgreicher Test

```
🎯 Final Result: 3/3 Tests erfolgreich
============================================================
✅ Alle Tests abgeschlossen!
```

### Fehlgeschlagener Test

```
🎯 Final Result: 2/3 Tests erfolgreich
============================================================
❌ Einige Tests fehlgeschlagen!
```

## 🛠️ Entwicklung

### Neue Tests hinzufügen

1. Test-Datei in `e2e/` erstellen
2. Export-Funktionen hinzufügen
3. In `e2e-test-suite.js` integrieren
4. Package.json Script hinzufügen

### Test-Daten anpassen

- Test-Daten sind in den jeweiligen Dateien definiert
- Verschiedene Szenarien durch Variation der Daten testen
- Realistische Daten für bessere Test-Abdeckung verwenden

## 🔍 Debugging

### Detaillierte Logs

```bash
# Mit Debug-Informationen
DEBUG=true npm run test:webhook:website
```

### Einzelne Tests

```bash
# Nur einen spezifischen Test ausführen
node -e "require('./e2e/test-website-analysis-integration').sendWebhookRequest('https://n8n.chooomedia.com/webhook/websitehealth__done', {test: 'data'})"
```

## 📝 Best Practices

1. **Retry Logic**: Alle Tests haben automatische Wiederholung
2. **Timeout Handling**: Verhindert hängende Tests
3. **Error Handling**: Umfassende Fehlerbehandlung
4. **Modular Design**: Tests können einzeln oder zusammen ausgeführt werden
5. **Clear Logging**: Verständliche Ausgabe für Debugging
6. **Exit Codes**: Korrekte Exit-Codes für CI/CD Integration

## 🚀 CI/CD Integration

Die Tests sind für CI/CD-Pipelines optimiert:

```yaml
# GitHub Actions Beispiel
- name: Run Integration Tests
  run: npm run test:integration
```

## 📈 Monitoring

### Erfolgsrate

- Alle Tests müssen erfolgreich sein
- Exit-Code 0 bei Erfolg, 1 bei Fehler
- Detaillierte Berichte für Monitoring

### Performance

- Timeout nach 10 Sekunden
- Retry-Logik für flaky Tests
- Optimierte für schnelle Ausführung
