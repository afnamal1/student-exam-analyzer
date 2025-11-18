from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import tempfile
import shutil
from extract_pdf_data import extract_student_data

app = Flask(__name__, static_folder='dist', static_url_path='')
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/api/upload-pdf', methods=['POST', 'OPTIONS'])
def upload_pdf():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        if 'pdf' not in request.files:
            return jsonify({'success': False, 'error': 'No PDF file provided'}), 400
        
        file = request.files['pdf']
        
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'success': False, 'error': 'File must be a PDF'}), 400
        
        temp_dir = tempfile.mkdtemp()
        temp_pdf_path = os.path.join(temp_dir, file.filename)
        
        file.save(temp_pdf_path)
        
        students = extract_student_data(temp_pdf_path)
        
        shutil.rmtree(temp_dir)
        
        return jsonify({
            'success': True,
            'students': students,
            'count': len(students)
        })
    
    except Exception as e:
        import traceback
        error_msg = str(e)
        traceback_str = traceback.format_exc()
        print(f"Error in upload_pdf: {error_msg}")
        print(traceback_str)
        return jsonify({
            'success': False,
            'error': error_msg,
            'traceback': traceback_str if app.debug else None
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/<path:filename>')
def serve_static(filename):
    if filename.startswith('api/'):
        return jsonify({'error': 'Not found'}), 404
    
    if filename.endswith('.json'):
        if os.path.exists(f'public/{filename}'):
            return send_from_directory('public', filename)
        elif os.path.exists(filename):
            return send_from_directory('.', filename)
    
    static_path = os.path.join(app.static_folder, filename)
    if filename != "" and os.path.exists(static_path):
        return send_from_directory(app.static_folder, filename)
    
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

