# Panduan Instalasi QUBOT di VPS (Virtual Private Server)

QUBOT dapat diinstal di VPS mana pun (Ubuntu, Debian, AlmaLinux, CentOS) seperti DigitalOcean, Hetzner, AWS EC2, Contabo, Biznet Gio, IDCloudHost, dll.

---

## Cara 1: Menggunakan Docker & Docker Compose (Paling Mudah & Direkomendasikan)

### 1. Install Docker & Git di VPS
Jalankan perintah berikut di terminal VPS:
```bash
sudo apt update && sudo apt install -y git docker.io docker-compose-v2
```

### 2. Clone atau Copy Source Code QUBOT
```bash
cd /opt
git clone <URL_REPO_ANDA> qubot
cd qubot
```

### 3. Buat File Konfigurasi `.env` (Opsional)
```bash
cp .env.example .env
nano .env
# Masukkan GEMINI_API_KEY Anda jika ada (bisa juga diisi lewat UI Settings nanti)
```

### 4. Jalankan QUBOT
```bash
docker compose up -d --build
```
QUBOT kini berjalan di background pada port `3000`. Akses melalui browser:
`http://IP_VPS_ANDA:3000`

---

## Cara 2: Tanpa Docker (Native Node.js + PM2)

### 1. Install Node.js (v20 atau v22)
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 3. Build & Jalankan Aplikasi
```bash
cd /opt/qubot
npm install
npm run build
pm2 start npm --name "qubot" -- run start
pm2 save
pm2 startup
```

---

## Cara 3: Menghubungkan Domain & SSL Gratis (Nginx + Let's Encrypt)

Agar bisa diakses via `https://qubot.domain-anda.com`:

### 1. Install Nginx & Certbot
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 2. Konfigurasi Nginx
Buat file `/etc/nginx/sites-available/qubot`:
```nginx
server {
    server_name qubot.domain-anda.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan konfigurasi:
```bash
sudo ln -s /etc/nginx/sites-available/qubot /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 3. Pasang SSL Gratis
```bash
sudo certbot --nginx -d qubot.domain-anda.com
```

Selesai! QUBOT Anda kini online 24/7 di domain HTTPS Anda sendiri.
