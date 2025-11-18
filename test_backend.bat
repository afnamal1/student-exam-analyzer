@echo off
echo Backend sunucusu test ediliyor...
echo.
echo Flask backend başlatılıyor (Port 5000)...
echo Tarayıcıda http://localhost:5000/api/health adresine gidip test edebilirsiniz.
echo.
echo Durdurmak için Ctrl+C tuşlarına basın.
echo.

python app.py

pause

