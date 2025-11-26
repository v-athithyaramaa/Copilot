import os
import json
import uuid
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import traceback

from models import init_db, save_review, get_review, get_all_reviews, delete_review
from review_service import ReviewService
from utils import allowed_file, get_file_extension, clean_old_files

# Load environment variables from backend directory
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Initialize Flask app
app = Flask(__name__)
# Configure CORS to allow requests from frontend
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_FILE_SIZE', 10485760))  # 10MB
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Initialize database
init_db()

# Initialize review service
review_service = ReviewService()

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'Code Review Assistant API is running',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/review', methods=['POST'])
def review_code():
    """
    Main endpoint to review code
    Accepts: multipart/form-data with 'file' and optional 'language'
    Returns: JSON with review report
    """
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided'
            }), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': 'File type not supported. Please upload a code file.'
            }), 400
        
        # Get optional language parameter
        language = request.form.get('language', '')
        if not language:
            language = get_file_extension(file.filename)
        
        # Save file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], f"{uuid.uuid4()}_{filename}")
        file.save(filepath)
        
        try:
            # Read file content
            with open(filepath, 'r', encoding='utf-8') as f:
                code_content = f.read()
            
            # Perform code review using Gemini
            review_result = review_service.review_code(code_content, language, filename)
            
            # Generate unique report ID
            report_id = str(uuid.uuid4())
            
            # Save to database
            save_review(
                report_id=report_id,
                filename=filename,
                language=language,
                review_data=review_result
            )
            
            # Clean up uploaded file
            if os.path.exists(filepath):
                os.remove(filepath)
            
            return jsonify({
                'success': True,
                'report_id': report_id,
                'filename': filename,
                'language': language,
                'review': review_result,
                'timestamp': datetime.now().isoformat()
            })
        
        except Exception as e:
            # Clean up file on error
            if os.path.exists(filepath):
                os.remove(filepath)
            raise e
    
    except Exception as e:
        print(f"Error in review_code: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': f'Failed to review code: {str(e)}'
        }), 500


@app.route('/api/report/<report_id>', methods=['GET'])
def get_report(report_id):
    """Get a specific review report by ID"""
    try:
        report = get_review(report_id)
        
        if not report:
            return jsonify({
                'success': False,
                'error': 'Report not found'
            }), 404
        
        return jsonify({
            'success': True,
            'report': report
        })
    
    except Exception as e:
        print(f"Error in get_report: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to retrieve report: {str(e)}'
        }), 500


@app.route('/api/reports', methods=['GET'])
def list_reports():
    """Get all review reports"""
    try:
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        reports = get_all_reviews(page=page, per_page=per_page)
        
        return jsonify({
            'success': True,
            'reports': reports,
            'page': page,
            'per_page': per_page
        })
    
    except Exception as e:
        print(f"Error in list_reports: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to retrieve reports: {str(e)}'
        }), 500


@app.route('/api/report/<report_id>', methods=['DELETE'])
def delete_report_endpoint(report_id):
    """Delete a specific review report"""
    try:
        success = delete_review(report_id)
        
        if not success:
            return jsonify({
                'success': False,
                'error': 'Report not found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': 'Report deleted successfully'
        })
    
    except Exception as e:
        print(f"Error in delete_report: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to delete report: {str(e)}'
        }), 500


@app.route('/api/stats', methods=['GET'])
def get_statistics():
    """Get statistics about reviews"""
    try:
        reports = get_all_reviews(page=1, per_page=1000)  # Get all for stats
        
        total_reviews = len(reports)
        
        if total_reviews == 0:
            return jsonify({
                'success': True,
                'stats': {
                    'total_reviews': 0,
                    'average_score': 0,
                    'languages': {}
                }
            })
        
        # Calculate statistics
        total_score = 0
        languages = {}
        
        for report in reports:
            review_data = json.loads(report['review_data'])
            if 'overall_score' in review_data:
                total_score += review_data['overall_score']
            
            lang = report['language']
            languages[lang] = languages.get(lang, 0) + 1
        
        average_score = total_score / total_reviews if total_reviews > 0 else 0
        
        return jsonify({
            'success': True,
            'stats': {
                'total_reviews': total_reviews,
                'average_score': round(average_score, 2),
                'languages': languages
            }
        })
    
    except Exception as e:
        print(f"Error in get_statistics: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to get statistics: {str(e)}'
        }), 500


@app.errorhandler(413)
def file_too_large(e):
    """Handle file too large error"""
    return jsonify({
        'success': False,
        'error': 'File too large. Maximum size is 10MB.'
    }), 413


@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(e):
    """Handle internal server errors"""
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


# Clean old uploaded files on startup
@app.before_request
def before_request():
    """Run before each request"""
    if not hasattr(app, 'cleanup_done'):
        clean_old_files(app.config['UPLOAD_FOLDER'])
        app.cleanup_done = True


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"""
    ╔═══════════════════════════════════════════════╗
    ║  🔍 Code Review Assistant API                 ║
    ║  Starting on http://localhost:{port}            ║
    ╚═══════════════════════════════════════════════╝
    """)
    
    app.run(host='0.0.0.0', port=port, debug=debug)
