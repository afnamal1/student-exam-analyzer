@echo off
echo ========================================
echo   OGRENCI PERFORMANS ANALIZ SISTEMI
echo   React + Material-UI + Backend
echo ========================================
echo.

echo Backend sunucusu başlatılıyor (Flask)...
start "Backend Server" cmd /k "python app.py"

timeout /t 3 /nobreak >nul

echo Frontend sunucusu başlatılıyor...
echo.
echo Her iki sunucu da çalışıyor:
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
echo.
echo Durdurmak için her iki pencereyi de kapatın.
echo.

call npm run dev

pause

