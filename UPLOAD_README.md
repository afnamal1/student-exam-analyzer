# PDF Yükleme Özelliği

Bu özellik sayesinde kendi PDF dosyanızı yükleyip analiz edebilirsiniz.

## Kullanım

1. **Upload sunucusunu başlatın:**

   ```bash
   python upload_server.py
   ```

   Bu sunucu `http://localhost:8001` adresinde çalışacak.

2. **Ana uygulamayı başlatın:**

   ```bash
   npm run dev
   ```

   veya

   ```bash
   start.bat
   ```

3. **PDF Yükle:**
   - Uygulamanın üst kısmındaki "PDF Yükle" butonuna tıklayın
   - Benzer formatta bir PDF dosyası seçin
   - PDF otomatik olarak işlenecek ve öğrenci verileri yüklenecek

## Notlar

- PDF formatı mevcut sınav sonuçlarıyla benzer olmalıdır
- Yüklenen PDF'ler geçici olarak işlenir ve sunucuda saklanmaz
- Yüklenen sınav sonuçları dropdown menüsüne otomatik olarak eklenir
- Aynı anda hem upload sunucusu hem de ana uygulama çalışmalıdır

## Sorun Giderme

- "Sunucuya bağlanılamadı" hatası alıyorsanız, `upload_server.py`'nin çalıştığından emin olun
- PDF işlenemiyorsa, PDF formatının doğru olduğundan emin olun
- Port 8001 kullanımda ise, `upload_server.py` dosyasındaki PORT değerini değiştirebilirsiniz
