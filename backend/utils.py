import os
import time
from datetime import datetime, timedelta

# Allowed file extensions for code files
ALLOWED_EXTENSIONS = {
    'py', 'js', 'jsx', 'ts', 'tsx', 'java', 'cpp', 'c', 'h', 'hpp',
    'cs', 'go', 'rb', 'php', 'swift', 'kt', 'rs', 'scala', 'r',
    'html', 'css', 'scss', 'sass', 'sql', 'sh', 'bash', 'yaml', 'yml',
    'json', 'xml', 'md', 'txt', 'vue', 'dart', 'lua', 'pl', 'pm'
}

# Language mapping from file extension
LANGUAGE_MAP = {
    'py': 'Python',
    'js': 'JavaScript',
    'jsx': 'JavaScript React',
    'ts': 'TypeScript',
    'tsx': 'TypeScript React',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'h': 'C/C++ Header',
    'hpp': 'C++ Header',
    'cs': 'C#',
    'go': 'Go',
    'rb': 'Ruby',
    'php': 'PHP',
    'swift': 'Swift',
    'kt': 'Kotlin',
    'rs': 'Rust',
    'scala': 'Scala',
    'r': 'R',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'sass': 'Sass',
    'sql': 'SQL',
    'sh': 'Shell',
    'bash': 'Bash',
    'yaml': 'YAML',
    'yml': 'YAML',
    'json': 'JSON',
    'xml': 'XML',
    'md': 'Markdown',
    'vue': 'Vue',
    'dart': 'Dart',
    'lua': 'Lua',
    'pl': 'Perl',
    'pm': 'Perl'
}


def allowed_file(filename):
    """
    Check if the file extension is allowed
    
    Args:
        filename: Name of the file
    
    Returns:
        bool: True if file extension is allowed
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_file_extension(filename):
    """
    Get the file extension
    
    Args:
        filename: Name of the file
    
    Returns:
        str: File extension or empty string
    """
    if '.' in filename:
        ext = filename.rsplit('.', 1)[1].lower()
        return LANGUAGE_MAP.get(ext, ext.upper())
    return 'Unknown'


def format_file_size(size_bytes):
    """
    Format file size in human-readable format
    
    Args:
        size_bytes: Size in bytes
    
    Returns:
        str: Formatted size string
    """
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"


def clean_old_files(upload_folder, max_age_hours=24):
    """
    Clean up old files from upload folder
    
    Args:
        upload_folder: Path to upload folder
        max_age_hours: Maximum age of files in hours
    """
    try:
        if not os.path.exists(upload_folder):
            return
        
        current_time = time.time()
        max_age_seconds = max_age_hours * 3600
        
        cleaned_count = 0
        
        for filename in os.listdir(upload_folder):
            if filename == '.gitkeep':
                continue
            
            filepath = os.path.join(upload_folder, filename)
            
            # Check if file is older than max_age
            if os.path.isfile(filepath):
                file_age = current_time - os.path.getmtime(filepath)
                
                if file_age > max_age_seconds:
                    os.remove(filepath)
                    cleaned_count += 1
        
        if cleaned_count > 0:
            print(f"🧹 Cleaned up {cleaned_count} old file(s) from uploads")
    
    except Exception as e:
        print(f"Error cleaning old files: {str(e)}")


def validate_code_content(content, max_lines=10000):
    """
    Validate code content before review
    
    Args:
        content: Code content
        max_lines: Maximum number of lines allowed
    
    Returns:
        tuple: (is_valid, error_message)
    """
    if not content or content.strip() == '':
        return False, "File is empty"
    
    lines = content.split('\n')
    
    if len(lines) > max_lines:
        return False, f"File too large. Maximum {max_lines} lines allowed."
    
    return True, None


def get_severity_color(severity):
    """
    Get color code for severity level
    
    Args:
        severity: Severity level (critical, high, medium, low)
    
    Returns:
        str: Color code
    """
    severity_colors = {
        'critical': '#dc2626',  # red-600
        'high': '#ea580c',      # orange-600
        'medium': '#f59e0b',    # amber-500
        'low': '#3b82f6'        # blue-500
    }
    
    return severity_colors.get(severity.lower(), '#6b7280')  # gray-500 default


def calculate_code_metrics(code_content):
    """
    Calculate basic code metrics
    
    Args:
        code_content: Source code string
    
    Returns:
        dict: Code metrics
    """
    lines = code_content.split('\n')
    
    total_lines = len(lines)
    blank_lines = sum(1 for line in lines if line.strip() == '')
    comment_lines = sum(1 for line in lines if line.strip().startswith(('#', '//', '/*', '*', '"""', "'''")))
    code_lines = total_lines - blank_lines - comment_lines
    
    return {
        'total_lines': total_lines,
        'code_lines': code_lines,
        'blank_lines': blank_lines,
        'comment_lines': comment_lines,
        'comment_ratio': round(comment_lines / total_lines * 100, 2) if total_lines > 0 else 0
    }


def truncate_text(text, max_length=500):
    """
    Truncate text to maximum length
    
    Args:
        text: Text to truncate
        max_length: Maximum length
    
    Returns:
        str: Truncated text
    """
    if len(text) <= max_length:
        return text
    
    return text[:max_length] + '...'


def sanitize_filename(filename):
    """
    Sanitize filename to prevent security issues
    
    Args:
        filename: Original filename
    
    Returns:
        str: Sanitized filename
    """
    # Remove any directory traversal attempts
    filename = os.path.basename(filename)
    
    # Replace unsafe characters
    unsafe_chars = '<>:"/\\|?*'
    for char in unsafe_chars:
        filename = filename.replace(char, '_')
    
    return filename


# Example usage
if __name__ == '__main__':
    # Test utilities
    print("Testing utilities...")
    
    print(f"allowed_file('test.py'): {allowed_file('test.py')}")
    print(f"allowed_file('test.exe'): {allowed_file('test.exe')}")
    print(f"get_file_extension('example.py'): {get_file_extension('example.py')}")
    print(f"format_file_size(1536): {format_file_size(1536)}")
    print(f"get_severity_color('critical'): {get_severity_color('critical')}")
    
    test_code = """
def hello():
    # This is a comment
    print("Hello World")
    
hello()
"""
    
    metrics = calculate_code_metrics(test_code)
    print(f"\nCode metrics: {metrics}")
