# 📊 Öğrenci Performans Analiz Sistemi

Modern React ve Material-UI ile geliştirilmiş öğrenci performans analiz sistemi.

## 🚀 Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcı otomatik olarak `http://localhost:3000` adresinde açılacak.

### 3. Production Build

```bash
npm run build
```

## 📋 Özellikler

- ✅ **168 öğrenci** verisi
- 🔍 **Gelişmiş arama** özelliği
- 📊 **Detaylı performans analizi**:
  - Her ders için Doğru/Yanlış/Net değerleri
  - LGS Puanı
  - Sınıf, Okul, İlçe, İl, Genel dereceler
- 📈 **İnteraktif grafikler** (Chart.js)
- 🎨 **Modern Material-UI tasarımı**
- 📱 **Responsive** (mobil uyumlu)
- 🔄 **Öğrenci karşılaştırma** özelliği

## 🛠️ Teknolojiler

- **React 18**
- **Material-UI (MUI) 5**
- **Vite** (Build tool)
- **Chart.js** (Grafikler)
- **React Chart.js 2**

## 📁 Proje Yapısı

```
src/
├── components/
│   ├── StudentList.jsx      # Öğrenci listesi
│   ├── StudentDetails.jsx   # Öğrenci detayları
│   └── ComparisonView.jsx   # Karşılaştırma görünümü
├── App.jsx                   # Ana uygulama
├── main.jsx                  # Giriş noktası
└── index.css                 # Global stiller
```

## 🔄 Veri Güncelleme

PDF'ten yeni veri çıkarmak için:

```bash
python extract_pdf_data.py
```

Bu komut `YAHO 8LER LİSTE.pdf` dosyasından verileri çıkarır ve `student_data.json` dosyasına kaydeder.

## 📝 Notlar

- Veriler `student_data.json` dosyasından yüklenir
- `public/` klasörüne `student_data.json` dosyasını koyun
- Tüm veriler tarayıcıda işlenir
