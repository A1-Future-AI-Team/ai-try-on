from flask import Flask, request, jsonify, render_template, send_from_directory
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime
from gemini_engine import GeminiTryOn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize Gemini Try-On engine
try_on_engine = GeminiTryOn()

@app.route('/')
def index():
    """Main page with the virtual try-on interface"""
    return render_template('index.html')

@app.route('/api/try-on', methods=['POST'])
def try_on():
    """Handle virtual try-on request"""
    try:
        # Check if files are present
        if 'person_image' not in request.files or 'garment_image' not in request.files:
            return jsonify({'error': 'Both person and garment images are required'}), 400
        
        person_file = request.files['person_image']
        garment_file = request.files['garment_image']
        
        # Check if files are selected
        if person_file.filename == '' or garment_file.filename == '':
            return jsonify({'error': 'Please select both images'}), 400
        
        # Save uploaded files
        person_filename = secure_filename(f"person_{uuid.uuid4()}{os.path.splitext(person_file.filename or '')[1]}")
        garment_filename = secure_filename(f"garment_{uuid.uuid4()}{os.path.splitext(garment_file.filename or '')[1]}")
        
        person_path = os.path.join(app.config['UPLOAD_FOLDER'], person_filename)
        garment_path = os.path.join(app.config['UPLOAD_FOLDER'], garment_filename)
        
        person_file.save(person_path)
        garment_file.save(garment_path)
        
        # Process try-on
        result_filename = f"result_{int(datetime.now().timestamp() * 1000)}.png"
        result_path = os.path.join(app.config['UPLOAD_FOLDER'], result_filename)
        
        # Call Gemini AI for try-on
        result_path = try_on_engine.try_on(person_path, garment_path)
        
        # Clean up uploaded files
        os.remove(person_path)
        os.remove(garment_path)
        
        return jsonify({
            'success': True,
            'result_image': result_filename
        })
        
    except Exception as e:
        print(f"Error in try-on: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded and result images"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 