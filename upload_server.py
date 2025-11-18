#!/usr/bin/env python3
"""
PDF yükleme ve analiz sunucusu
"""
import http.server
import socketserver
import json
import os
import tempfile
import shutil
import cgi
import sys

PORT = 8001

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_pdf_data import extract_student_data

class UploadHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/upload-pdf':
            self.handle_upload()
        else:
            self.send_response(404)
            self.send_cors_headers()
            self.end_headers()

    def handle_upload(self):
        try:
            content_type = self.headers.get('Content-Type', '')
            
            if not content_type.startswith('multipart/form-data'):
                self.send_response(400)
                self.send_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'Content-Type must be multipart/form-data'}).encode('utf-8'))
                return

            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={'REQUEST_METHOD': 'POST'}
            )

            if 'pdf' not in form:
                self.send_response(400)
                self.send_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'No PDF file provided'}).encode('utf-8'))
                return

            file_item = form['pdf']
            
            if not file_item.filename:
                self.send_response(400)
                self.send_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'No file selected'}).encode('utf-8'))
                return

            if not file_item.filename.lower().endswith('.pdf'):
                self.send_response(400)
                self.send_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'File must be a PDF'}).encode('utf-8'))
                return

            temp_dir = tempfile.mkdtemp()
            temp_pdf_path = os.path.join(temp_dir, file_item.filename)
            
            with open(temp_pdf_path, 'wb') as f:
                f.write(file_item.file.read())

            students = extract_student_data(temp_pdf_path)
            
            shutil.rmtree(temp_dir)

            response_data = {
                'success': True,
                'students': students,
                'count': len(students)
            }

            self.send_response(200)
            self.send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))

        except Exception as e:
            import traceback
            error_msg = str(e)
            traceback.print_exc()
            
            self.send_response(500)
            self.send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_response = {
                'success': False,
                'error': error_msg
            }
            self.wfile.write(json.dumps(error_response).encode('utf-8'))

    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def end_headers(self):
        super().end_headers()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), UploadHandler) as httpd:
        print("=" * 60)
        print(f"📤 PDF Yükleme Sunucusu başlatıldı!")
        print(f"🔗 URL: http://localhost:{PORT}")
        print(f"📡 Endpoint: http://localhost:{PORT}/api/upload-pdf")
        print("=" * 60)
        print(f"\n⏹️  Durdurmak için Ctrl+C tuşlarına basın\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n⏹️  Sunucu durduruldu.")

if __name__ == "__main__":
    main()

