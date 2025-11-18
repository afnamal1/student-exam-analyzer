@echo off
echo ========================================
echo   OGRENCI PERFORMANS ANALIZ SISTEMI
echo   React + Material-UI
echo ========================================
echo.
echo Bağımlılıklar yükleniyor...
call npm install
echo.
echo Sunucu başlatılıyor...
echo Tarayıcı otomatik olarak açılacak.
echo.
echo Durdurmak için Ctrl+C tuşlarına basın.
echo.
call npm run dev
pause

