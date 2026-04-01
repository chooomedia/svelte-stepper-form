# 🚀 Deployment Anleitung für quiz.digitalpusher.de

## 📋 Voraussetzungen

- **Node.js**: Version 18.x oder höher
- **PM2**: Process Manager für Node.js (`npm install -g pm2`)
- **Nginx**: Reverse Proxy (optional, empfohlen)

---

## 🏗️ Production Build (Lokal)

### 1. Dependencies installieren
```bash
cd /Users/chooom/dev/digitalpusher/dev/svelte-stepper-form
npm ci --production=false
```

### 2. Production Build erstellen
```bash
npm run build
```

**Output:**
- `build/` Verzeichnis mit komplettem Production Build
- `build/index.js` - Node.js Server Entry Point
- `build/client/` - Static Assets (CSS, JS, Images)

---

## 📦 Deployment auf Server

### Methode 1: Manuelles Deployment via SCP/SFTP

```bash
# 1. Build-Verzeichnis auf Server kopieren
scp -r build/ user@quiz.digitalpusher.de:/var/www/quiz.digitalpusher.de/

# 2. .env.production auf Server kopieren
scp .env.production user@quiz.digitalpusher.de:/var/www/quiz.digitalpusher.de/.env

# 3. package.json kopieren (für node_modules)
scp package.json package-lock.json user@quiz.digitalpusher.de:/var/www/quiz.digitalpusher.de/

# 4. Auf dem Server: Production Dependencies installieren
ssh user@quiz.digitalpusher.de
cd /var/www/quiz.digitalpusher.de
npm ci --production
```

### Methode 2: Git Deployment (Empfohlen)

```bash
# 1. Auf dem Server: Repository clonen
ssh user@quiz.digitalpusher.de
cd /var/www/
git clone https://github.com/your-repo/svelte-stepper-form.git quiz.digitalpusher.de
cd quiz.digitalpusher.de

# 2. .env.production anlegen (siehe unten)

# 3. Build erstellen
npm ci
npm run build

# 4. Production Dependencies installieren
npm ci --production
```

---

## ⚙️ Server Konfiguration

### 1. Environment Variables auf dem Server

Erstelle `/var/www/quiz.digitalpusher.de/.env`:

```bash
# Production Environment
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
ORIGIN=https://quiz.digitalpusher.de

# App Configuration (aus .env.production kopieren)
VITE_DEV_MODE=false
VITE_DEBUG_ENABLED=false
VITE_N8N_BASE_URL=https://n8n.chooomedia.com/webhook
VITE_N8N_WEBHOOK_URL=https://n8n.chooomedia.com/webhook/websitehealth__done
VITE_N8N_WEBSITE_HEALTH_URL=https://n8n.chooomedia.com/webhook/websitehealth
# ... (weitere Variablen aus .env.production)
```

### 2. PM2 Konfiguration

Erstelle `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'quiz-digitalpusher',
    script: './build/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
```

### 3. Server starten mit PM2

```bash
# Erste Deployment
pm2 start ecosystem.config.js

# PM2 bei Server-Neustart automatisch starten
pm2 startup
pm2 save

# Server Status checken
pm2 status
pm2 logs quiz-digitalpusher

# Server neu starten
pm2 restart quiz-digitalpusher

# Server stoppen
pm2 stop quiz-digitalpusher
```

---

## 🌐 Nginx Reverse Proxy (Empfohlen)

### Nginx Konfiguration

Erstelle `/etc/nginx/sites-available/quiz.digitalpusher.de`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name quiz.digitalpusher.de;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name quiz.digitalpusher.de;

    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/quiz.digitalpusher.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/quiz.digitalpusher.de/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    # Static Assets
    location /_app/ {
        alias /var/www/quiz.digitalpusher.de/build/client/_app/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Proxy to Node.js App
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }
}
```

Aktiviere die Konfiguration:

```bash
# Symlink erstellen
sudo ln -s /etc/nginx/sites-available/quiz.digitalpusher.de /etc/nginx/sites-enabled/

# Nginx Konfiguration testen
sudo nginx -t

# Nginx neu laden
sudo systemctl reload nginx
```

### SSL Zertifikat mit Let's Encrypt

```bash
# Certbot installieren
sudo apt install certbot python3-certbot-nginx

# Zertifikat erstellen
sudo certbot --nginx -d quiz.digitalpusher.de

# Auto-Renewal aktivieren
sudo certbot renew --dry-run
```

---

## 🔄 Update Workflow

Bei Code-Änderungen:

```bash
# Auf dem Server
cd /var/www/quiz.digitalpusher.de

# 1. Neuesten Code pullen
git pull origin main

# 2. Dependencies aktualisieren
npm ci

# 3. Neu builden
npm run build

# 4. Production Dependencies installieren
npm ci --production

# 5. PM2 neu starten
pm2 restart quiz-digitalpusher

# 6. Logs checken
pm2 logs quiz-digitalpusher --lines 100
```

---

## 📊 Monitoring & Logs

### PM2 Monitoring

```bash
# Echtzeit-Monitoring
pm2 monit

# Logs anzeigen
pm2 logs quiz-digitalpusher

# Nur Error Logs
pm2 logs quiz-digitalpusher --err

# Memory/CPU Stats
pm2 show quiz-digitalpusher
```

### Nginx Logs

```bash
# Access Logs
tail -f /var/log/nginx/access.log

# Error Logs
tail -f /var/log/nginx/error.log
```

---

## 🔍 Troubleshooting

### Server startet nicht

```bash
# PM2 Logs checken
pm2 logs quiz-digitalpusher --err

# Port verfügbar?
sudo lsof -i :3000

# Environment Variables checken
pm2 env quiz-digitalpusher
```

### 502 Bad Gateway (Nginx)

```bash
# PM2 Status checken
pm2 status

# Server neu starten
pm2 restart quiz-digitalpusher

# Nginx Error Logs
tail -f /var/log/nginx/error.log
```

### Hoher Memory Verbrauch

```bash
# PM2 Memory Limit setzen
pm2 restart quiz-digitalpusher --max-memory-restart 500M

# Logs rotieren
pm2 flush
```

---

## 🎯 Production Checklist

- [ ] `.env` Datei mit Production-Werten erstellt
- [ ] Build erfolgreich (`npm run build`)
- [ ] SSL Zertifikat konfiguriert
- [ ] Nginx Reverse Proxy aktiv
- [ ] PM2 läuft im Cluster Mode
- [ ] PM2 Auto-Startup konfiguriert
- [ ] Firewall konfiguriert (Port 80, 443 offen)
- [ ] Monitoring aktiv (PM2, Nginx Logs)
- [ ] Backup-Strategie definiert
- [ ] n8n Webhooks auf Production-URLs gesetzt

---

## 📞 Support

Bei Problemen:
- **Logs checken**: `pm2 logs quiz-digitalpusher`
- **Server Status**: `pm2 status`
- **Nginx Status**: `sudo systemctl status nginx`
- **Port checken**: `sudo lsof -i :3000`

**Production URL**: https://quiz.digitalpusher.de
**n8n Webhooks**: https://n8n.chooomedia.com/webhook/websitehealth__done
