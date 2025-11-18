#!/usr/bin/env python3
"""
Basit HTTP sunucusu - Projeyi çalıştırmak için
"""
import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORS header'ları ekle
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # Cache kontrolü
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    # Mevcut dizinde çalış
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print("=" * 60)
        print(f"🌐 Sunucu başlatıldı!")
        print(f"📂 Çalışma dizini: {os.getcwd()}")
        print(f"🔗 URL: {url}")
        print("=" * 60)
        print(f"\n✅ Tarayıcı otomatik olarak açılacak...")
        print(f"⏹️  Durdurmak için Ctrl+C tuşlarına basın\n")
        
        # Tarayıcıyı otomatik aç
        webbrowser.open(url)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n⏹️  Sunucu durduruldu.")
            httpd.shutdown()

if __name__ == "__main__":
    main()

