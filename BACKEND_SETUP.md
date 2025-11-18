# Backend Sunucusu Kurulumu

PDF yükleme özelliği için backend sunucusunu çalıştırmanız gerekiyor.

## Hızlı Başlatma

### Yöntem 1: Otomatik Başlatma (Önerilen)

```bash
start_all.bat
```

Bu komut hem backend hem de frontend sunucularını başlatır.

### Yöntem 2: Manuel Başlatma

**Backend için:**

```bash
start_backend.bat
```

veya

```bash
python upload_server.py
```

**Frontend için (ayrı terminal):**

```bash
npm run dev
```

veya

```bash
start.bat
```

## Windows'ta Otomatik Başlatma

### Task Scheduler ile (Bilgisayar açıldığında otomatik başlatma)

1. **Task Scheduler'ı açın:**

   - Windows tuşu + R
   - `taskschd.msc` yazın ve Enter'a basın

2. **Yeni görev oluşturun:**

   - Sağ taraftan "Create Basic Task" seçin
   - İsim: "PDF Upload Backend Server"
   - Trigger: "When I log on" veya "When the computer starts"
   - Action: "Start a program"
   - Program: Python'un tam yolu (örn: `C:\Python\python.exe`)
   - Arguments: `"C:\Users\afnamal\Desktop\Nalan Teyze\upload_server.py"`
   - Start in: `"C:\Users\afnamal\Desktop\Nalan Teyze"`

3. **Ayarlar:**
   - "Run whether user is logged on or not" seçeneğini işaretleyin
   - "Run with highest privileges" seçeneğini işaretleyin

### Windows Service Olarak (Gelişmiş)

Daha gelişmiş bir çözüm için `nssm` (Non-Sucking Service Manager) kullanabilirsiniz:

1. NSSM'i indirin: https://nssm.cc/download
2. Komut satırından:

```bash
nssm install PDFUploadServer "C:\Python\python.exe" "C:\Users\afnamal\Desktop\Nalan Teyze\upload_server.py"
nssm set PDFUploadServer AppDirectory "C:\Users\afnamal\Desktop\Nalan Teyze"
nssm start PDFUploadServer
```

## Port Kontrolü

Eğer port 8001 kullanımda ise, `upload_server.py` dosyasındaki `PORT = 8001` değerini değiştirebilirsiniz.

## Sorun Giderme

- **"Port already in use" hatası:** Port 8001 başka bir program tarafından kullanılıyor. Port numarasını değiştirin veya diğer programı kapatın.
- **Python bulunamadı:** Python'un PATH'te olduğundan emin olun veya tam yolunu kullanın.
- **CORS hatası:** Backend sunucusunun çalıştığından emin olun.
