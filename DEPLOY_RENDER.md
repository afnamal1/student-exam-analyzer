# Render.com'a Deployment (Tüm Uygulama)

Render'a hem backend hem frontend'i birlikte yükleyin. Flask hem API hem de static dosyaları serve eder.

## Adımlar:

1. **Projeyi GitHub'a yükleyin:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Render.com'a gidin:**

   - https://render.com
   - GitHub ile giriş yapın
   - "New" → "Web Service"

3. **GitHub repo'nuzu seçin**

4. **Ayarları yapın:**

   - **Name:** `ogrenci-performans-analiz`
   - **Environment:** `Python 3`
   - **Region:** En yakın bölgeyi seçin
   - **Branch:** `main`
   - **Root Directory:** (boş bırakın)
   - **Build Command:**
     ```
     pip install -r requirements.txt && npm install && npm run build
     ```
   - **Start Command:**
     ```
     python app.py
     ```
   - **Plan:** Free (ücretsiz)

5. **Environment Variables (Gerekirse):**

   - `PORT` - Render otomatik ayarlar (gerekmez)

6. **"Create Web Service" butonuna tıklayın**

7. **İlk deploy 5-10 dakika sürebilir**

## Önemli Notlar:

- Render ücretsiz planında uygulama 15 dakika kullanılmazsa uyku moduna geçer
- İlk istekte 30-60 saniye sürebilir (cold start)
- Ücretli plan alırsanız sürekli çalışır

## Build Sonrası:

Build tamamlandıktan sonra Render size bir URL verecek:

- Örnek: `https://ogrenci-performans-analiz.onrender.com`

Bu URL'yi kullanıcılarınızla paylaşabilirsiniz!
