# 🚀 Vercel Deployment für quiz.digitalpusher.de

## 📋 Übersicht

**Deployment-Strategie:**
- ✅ Vercel Free Tier (kostenlos)
- ✅ Auto-Deployment via Git Push
- ✅ Custom Domain: `quiz.digitalpusher.de`
- ✅ SSL/HTTPS automatisch
- ✅ Global CDN (Frankfurt Region)
- ✅ Serverless Functions für API Routes

---

## 🎯 SEO-Optimale Subdomain-Strategie

### **Empfehlung: `quiz.digitalpusher.de`** ✅

**Vorteile für SEO & ICP:**
1. **Keyword-Optimierung**: "quiz" = hohe Suchintention
2. **Klare User Journey**: Quiz → Analyse → Termin
3. **Trust-Signal**: Unter Haupt-Domain `digitalpusher.de`
4. **ICP-Targeting**: B2B/Handwerk erkennt sofort Mehrwert
5. **Link-Equity**: Profitiert von Domain Authority

**Alternative Subdomains (falls gewünscht):**
- `analyse.digitalpusher.de` - Fokus auf "Website-Analyse"
- `check.digitalpusher.de` - Fokus auf "Website-Check"
- `potenzial.digitalpusher.de` - Fokus auf "Potenzial-Analyse"
- `marketing-check.digitalpusher.de` - Keyword-optimiert

**SEO-Tipp:** Bleib bei `quiz.digitalpusher.de` - kurz, prägnant, merkbar!

---

## 📦 Vercel Deployment - Step by Step

### **Schritt 1: Git Repository vorbereiten**

```bash
cd /Users/chooom/dev/digitalpusher/dev/svelte-stepper-form

# Falls noch kein Git Repo:
git init
git add .
git commit -m "feat: initial commit for Vercel deployment"

# GitHub/GitLab Repo erstellen und pushen
git remote add origin https://github.com/YOUR-USERNAME/digitalpusher-quiz.git
git branch -M main
git push -u origin main
```

---

### **Schritt 2: Vercel Account & Projekt**

1. **Vercel Account erstellen:**
   - Gehe zu: https://vercel.com/signup
   - Sign up mit GitHub/GitLab Account
   - Free Tier auswählen

2. **Neues Projekt importieren:**
   - Dashboard → "Add New Project"
   - GitHub Repository auswählen: `digitalpusher-quiz`
   - Framework: **SvelteKit** (wird automatisch erkannt)
   - Klick auf "Deploy"

3. **Build Settings (automatisch erkannt):**
   ```
   Framework Preset: SvelteKit
   Build Command: npm run build
   Output Directory: .vercel/output
   Install Command: npm ci
   ```

---

### **Schritt 3: Environment Variables in Vercel**

Im Vercel Dashboard → Settings → Environment Variables:

```bash
# Production Environment Variables
VITE_DEV_MODE=false
VITE_DEBUG_ENABLED=false

# n8n Webhooks (PRODUCTION)
VITE_N8N_BASE_URL=https://n8n.chooomedia.com/webhook
VITE_N8N_WEBHOOK_URL=https://n8n.chooomedia.com/webhook/websitehealth__done
VITE_N8N_WEBSITE_HEALTH_URL=https://n8n.chooomedia.com/webhook/websitehealth

# API Keys
VITE_PAYPAL_CLIENT_ID=AdmDAC7lH7dqxGb8A9LiS92NmW1hvdLJ3Z7iK6AuRiyXyHlx6h7SGH0we3EoJeTc4Tir5EMTtP_rFQr3
VITE_BETTERPLACE_PROJECT_ID=49121
VITE_BETTERPLACE_API_KEY=b2b1b2b3b4b5b6b7b8b9b0
VITE_TIDYCAL_API_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYTU0ZjhlMmUwODkwNjYzYjJlNGNlMWNhNWRjNTc4M2UwZWUzZTY1YmI4NjIyZWE1NzVjOGMwZGNiOWIzMjI4MzMwMjYwZGUyY2JhOTQzN2QiLCJpYXQiOjE3NzI1Njk5MjMuODMyODY0LCJuYmYiOjE3NzI1Njk5MjMuODMyODY2LCJleHAiOjQ5MjgyNDM1MjMuODIzMTIsInN1YiI6IjMwMTQzMCIsInNjb3BlcyI6W119.F0JpHLi0wdwco_skczPBaJ2JqX0lBvf3Q_-RCT6EeAMFofVnANMUBZyf-MCVS8MSxLeur3ObT6_DQzvlTxeYG74L3JwVVkqg7Fpr7y0hMeI35LQlx9JXAOFj9BxBMe7_esKn1s1Pclcqn4TmXDqPjpnlcZgTBdwH5sV-3kaM3IQu035h5fbLYu_uHGxt2D8lrd_LEFszbaqvIPP8ziaoUj4gSgJD21m6zlq-xcxAoRkSI-24xfY_xN6LwEeP0z9GBIrT6SxmvVp5pW5VuYGwXG9UN3854Hu2ziXCALCdwAagyfnOVAabOaNqCjyfn6FfLfb0LPSs8LP8ea0mbIhnAyJEoPWSs-WkqX4msjALx9IqCs3t0BIScGQCzI3AB99NXxmWjGFSUWC0VRqwvTOTbyatgsvEoBs5mnuekLVm7nRQRWlxGuFp-lYITxOKbCOaYtBqGwYSgA3kCrsHw10PV8tP0GaJ3iEvxIc9Pc3DAg_8WnNGpLTaPMHW9vS-7dV-672xvAIwYg9Zlc6cGYUIbxQ-oH6hOiFWDkWVQz4Ojynru6bEpUNOPYcGrvluhKd4aG6eGTaFeCsH5oxNa1JaZvEYUhrcp4tPRTQLj4KnnrIVZ8crxL5Zyu2dyy_WzXxJNDSMnRl0lXl19w1SIfTG9M8w8P36ij2ygez43SgSsIg
VITE_TIDYCAL_CALENDAR_ID=digitalpusher

# Demo Data
VITE_DEMO_URL=https://moderniqs.com
VITE_DEMO_EMAIL=cm@chooo.de
VITE_DEMO_PHONE=+49123456789
VITE_DEMO_COMPANY_NAME=Test Company
```

**Wichtig:**
- Für jede Variable: Environment = **Production**
- **NICHT** in `.env` committen (steht in `.gitignore`)

---

### **Schritt 4: Custom Domain `quiz.digitalpusher.de` einrichten**

#### **4.1 In Vercel:**

1. Vercel Dashboard → Settings → Domains
2. "Add Domain" klicken
3. `quiz.digitalpusher.de` eingeben
4. Vercel zeigt DNS-Konfiguration an:

```
Type: CNAME
Name: quiz
Value: cname.vercel-dns.com
```

#### **4.2 Bei All-Inkl DNS konfigurieren:**

1. **All-Inkl Login:**
   - KAS (Kunden-Administrations-System)
   - → Domain-Verwaltung
   - → `digitalpusher.de` auswählen

2. **DNS-Einstellungen:**
   - → "Subdomains"
   - → "Neue Subdomain anlegen"
   
   **CNAME Record:**
   ```
   Subdomain: quiz
   Ziel:      cname.vercel-dns.com
   TTL:       3600
   ```

3. **Speichern & Warten:**
   - DNS-Propagation: 5-60 Minuten
   - SSL-Zertifikat: Vercel erstellt automatisch

4. **Verifizierung in Vercel:**
   - Vercel prüft DNS automatisch
   - Wenn OK: ✅ "Valid Configuration"
   - SSL wird automatisch ausgestellt (Let's Encrypt)

---

### **Schritt 5: Deployment testen**

Nach erfolgreichem DNS-Setup:

```bash
# 1. Änderung im Code machen
echo "// Test" >> src/routes/+page.svelte

# 2. Committen & Pushen
git add .
git commit -m "test: verify auto-deployment"
git push origin main

# 3. Vercel deployed automatisch!
# → Dashboard zeigt Build-Status
# → Nach ~2-3 Minuten live auf quiz.digitalpusher.de
```

**Vercel Auto-Deployment:**
- ✅ Jeder Push auf `main` → Production Deployment
- ✅ Preview Deployments für Pull Requests
- ✅ Rollback mit 1 Klick möglich

---

## 🌐 DNS-Konfiguration für All-Inkl (Zusammenfassung)

### **All-Inkl KAS - DNS Zone Editor:**

```dns
# Subdomain: quiz.digitalpusher.de
Type:   CNAME
Host:   quiz
Value:  cname.vercel-dns.com
TTL:    3600
```

**Alternative (falls CNAME nicht funktioniert):**
Falls All-Inkl CNAME-Records für Subdomains nicht unterstützt, nutze **A-Records**:

1. In Vercel: Domains → "quiz.digitalpusher.de" → "Show DNS Records"
2. Vercel zeigt A-Records an (z.B. `76.76.21.21`)
3. Bei All-Inkl:
   ```dns
   Type:   A
   Host:   quiz
   Value:  76.76.21.21   (von Vercel übernehmen!)
   TTL:    3600
   ```

**WICHTIG:** Nutze die **exakten IP-Adressen** die Vercel anzeigt!

---

## 📊 SEO-Optimierung für quiz.digitalpusher.de

### **1. Canonical URL setzen**

In `src/routes/+layout.svelte`:

```svelte
<svelte:head>
  <link rel="canonical" href="https://quiz.digitalpusher.de{$page.url.pathname}" />
</svelte:head>
```

### **2. Sitemap generieren**

Erstelle `src/routes/sitemap.xml/+server.ts`:

```typescript
export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://quiz.digitalpusher.de/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600'
    }
  });
}
```

### **3. robots.txt**

Erstelle `static/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://quiz.digitalpusher.de/sitemap.xml

# Disallow admin/test pages
Disallow: /api/
Disallow: /test/
```

### **4. Open Graph & Meta Tags**

In `src/app.html`:

```html
<meta property="og:title" content="Website-Analyse Quiz | Digital Pusher" />
<meta property="og:description" content="Finde heraus, wie sichtbar dein Unternehmen online ist. Kostenlose Website-Analyse in 2 Minuten." />
<meta property="og:url" content="https://quiz.digitalpusher.de" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://quiz.digitalpusher.de/og-image.jpg" />
```

---

## 🚀 Vercel Free Tier - Limits & Best Practices

### **Free Tier Limits:**
```
✅ 100 GB Bandwidth / Monat
✅ 100 Deployments / Tag
✅ 10 Serverless Functions / Deployment
✅ 10 Sekunden Function Execution Time
✅ 1 GB Serverless Function Size
✅ Unlimited Custom Domains
✅ Automatisches SSL/HTTPS
```

**Für dein Projekt ausreichend?** ✅ **JA!**
- Quiz-App hat wenig Traffic-Spitzen
- API Routes sind leichtgewichtig
- 100 GB Bandwidth = ~500.000 Pageviews/Monat

### **Performance-Optimierung:**

1. **Edge Caching:**
   ```javascript
   // In API Routes:
   export const config = {
     runtime: 'edge',
     regions: ['fra1']
   };
   ```

2. **Image Optimization:**
   - Nutze Vercels Next/Image (falls Bilder groß)
   - Oder WebP-Format mit `<picture>` Tag

3. **Static Assets:**
   - Alle Bilder/Icons in `static/`
   - Werden automatisch CDN-cached

---

## 🔄 Update Workflow

### **Lokale Entwicklung:**

```bash
# 1. Änderungen machen
git add .
git commit -m "feat: neue Feature xyz"
git push origin main

# 2. Vercel deployed automatisch!
# → Build läuft ~2-3 Minuten
# → Live auf quiz.digitalpusher.de
```

### **Preview Deployments (für Testing):**

```bash
# 1. Feature Branch erstellen
git checkout -b feature/new-quiz-step

# 2. Änderungen pushen
git push origin feature/new-quiz-step

# 3. Vercel erstellt Preview URL:
# → Beispiel: https://digitalpusher-quiz-abc123.vercel.app
```

**Vorteil:** Test auf Live-System ohne Production zu beeinflussen!

---

## 🎯 ICP-Optimierte Landing-Page Strategie

### **Für Handwerk & Mittelstand B2B:**

1. **Subdomain-Struktur:**
   ```
   quiz.digitalpusher.de          → Quiz/Analyse (Einstieg)
   analyse.digitalpusher.de       → Detailanalyse (Follow-up)
   check.digitalpusher.de         → Quick-Check (Mikro-Conversion)
   ```

2. **SEO-Keywords (Haupt-Subdomain):**
   - "Website Analyse Handwerk"
   - "Online Marketing Check"
   - "Digitale Sichtbarkeit testen"

3. **Content-Strategie:**
   - Blog auf `digitalpusher.de/blog/`
   - Case Studies → Link zu Quiz
   - Quiz → CTA zu Termin

---

## 🔍 Monitoring & Analytics

### **1. Vercel Analytics (kostenlos):**

In `svelte.config.js`:
```javascript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  analytics: {
    enabled: true
  }
});
```

Dann in Vercel Dashboard → Analytics aktivieren.

### **2. Google Analytics 4:**

In `src/app.html`:
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 📞 Support & Troubleshooting

### **Häufige Probleme:**

1. **DNS propagiert nicht:**
   ```bash
   # DNS-Check:
   nslookup quiz.digitalpusher.de
   # Sollte zeigen: cname.vercel-dns.com
   ```

2. **SSL-Zertifikat fehlt:**
   - Vercel Dashboard → Domains → "Refresh Certificate"
   - DNS muss korrekt sein (CNAME)

3. **Build Failed:**
   - Vercel Dashboard → Deployments → Log anschauen
   - Meist: Environment Variables fehlen

4. **Function Timeout (10s exceeded):**
   - API Route optimieren
   - Oder Vercel Pro upgraden (60s timeout)

---

## ✅ Deployment Checklist

- [ ] Git Repository erstellt (GitHub/GitLab)
- [ ] Vercel Account angelegt (mit Git verbunden)
- [ ] Projekt importiert & deployed
- [ ] Environment Variables gesetzt (Production)
- [ ] Custom Domain `quiz.digitalpusher.de` hinzugefügt
- [ ] DNS bei All-Inkl konfiguriert (CNAME)
- [ ] SSL-Zertifikat automatisch ausgestellt
- [ ] Test-Deployment durchgeführt
- [ ] Sitemap & robots.txt erstellt
- [ ] Analytics aktiviert (Vercel + GA4)
- [ ] n8n Webhooks auf Production-URLs gesetzt

---

## 🎉 Fertig!

**Live URL:** https://quiz.digitalpusher.de

**Vorteile dieser Setup:**
✅ **Kostenlos** (Vercel Free Tier)
✅ **Automatisches Deployment** (Git Push = Live)
✅ **Schnell** (Global CDN, Frankfurt Edge)
✅ **Sicher** (Auto SSL, Security Headers)
✅ **Skalierbar** (bis 100 GB/Monat Traffic)
✅ **SEO-optimiert** (Custom Domain, schnelle Ladezeit)

---

**Support:**
- Vercel Docs: https://vercel.com/docs
- SvelteKit Docs: https://kit.svelte.dev/docs
- All-Inkl Support: https://all-inkl.com/wichtig/anleitungen/
