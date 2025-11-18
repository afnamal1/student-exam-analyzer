# Deployment (Yayınlama) Talimatları

Bu uygulamayı internet üzerinde yayınlamak için aşağıdaki adımları izleyin.

## Ön Hazırlık

1. **Frontend'i build edin:**

```bash
npm run build
```

Bu komut `dist/` klasörü oluşturur.

## Deployment Seçenekleri

### Seçenek 1: Render.com (Önerilen - Ücretsiz)

1. **GitHub'a yükleyin:**

   - Projeyi GitHub'a push edin

2. **Render'da hesap oluşturun:**

   - https://render.com adresine gidin
   - GitHub hesabınızla giriş yapın

3. **Yeni Web Service oluşturun:**

   - "New" → "Web Service"
   - GitHub repo'nuzu seçin
   - Ayarlar:
     - **Name:** ogrenci-performans-analiz
     - **Environment:** Python 3
     - **Build Command:** `pip install -r requirements.txt && npm install && npm run build`
     - **Start Command:** `python app.py`
     - **Port:** 5000 (otomatik algılanır)

4. **Environment Variables (Gerekirse):**

   - `PORT=5000` (Render otomatik ayarlar)

5. **Deploy edin:**
   - "Create Web Service" butonuna tıklayın
   - İlk deploy 5-10 dakika sürebilir

### Seçenek 2: Railway.app (Ücretsiz)

1. **Railway'a gidin:** https://railway.app
2. **GitHub ile giriş yapın**
3. **"New Project" → "Deploy from GitHub repo"**
4. **Ayarlar:**
   - Build Command: `pip install -r requirements.txt && npm install && npm run build`
   - Start Command: `python app.py`

### Seçenek 3: Heroku (Ücretli - Aylık 1 saat ücretsiz)

1. **Heroku CLI'yı yükleyin:**

   ```bash
   # https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Heroku'da uygulama oluşturun:**

   ```bash
   heroku login
   heroku create ogrenci-performans-analiz
   ```

3. **Deploy edin:**
   ```bash
   git add .
   git commit -m "Initial deploy"
   git push heroku main
   ```

### Seçenek 4: Kendi Sunucunuz (VPS)

1. **Sunucuya bağlanın:**

   ```bash
   ssh user@your-server.com
   ```

2. **Gerekli paketleri yükleyin:**

   ```bash
   sudo apt update
   sudo apt install python3 python3-pip nodejs npm nginx
   ```

3. **Projeyi kopyalayın:**

   ```bash
   git clone your-repo-url
   cd your-project
   ```

4. **Bağımlılıkları yükleyin:**

   ```bash
   pip3 install -r requirements.txt
   npm install
   npm run build
   ```

5. **Systemd service oluşturun:**

   ```bash
   sudo nano /etc/systemd/system/ogrenci-analiz.service
   ```

   İçerik:

   ```ini
   [Unit]
   Description=Ogrenci Performans Analiz
   After=network.target

   [Service]
   User=www-data
   WorkingDirectory=/path/to/your/project
   Environment="PORT=5000"
   ExecStart=/usr/bin/python3 app.py
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

6. **Nginx reverse proxy:**

   ```bash
   sudo nano /etc/nginx/sites-available/ogrenci-analiz
   ```

   İçerik:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

7. **Başlatın:**
   ```bash
   sudo systemctl enable ogrenci-analiz
   sudo systemctl start ogrenci-analiz
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## Önemli Notlar

- **PDF Dosyaları:** Production'da PDF dosyaları geçici olarak işlenir ve silinir (güvenlik için)
- **Port:** Backend port 5000'de çalışır (değiştirilebilir)
- **Static Files:** Frontend build'i `dist/` klasöründe, Flask otomatik serve eder
- **CORS:** Flask-CORS tüm origin'lere izin verir (production'da kısıtlayabilirsiniz)

## Build ve Test

Yerel olarak test etmek için:

```bash
npm run build
python app.py
```

Tarayıcıda http://localhost:5000 adresine gidin.
