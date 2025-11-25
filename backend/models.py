import sqlite3
import json
import os
from datetime import datetime
from contextlib import contextmanager

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'reviews.db')


@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


def init_db():
    """Initialize the database with required tables"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Create reviews table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS reviews (
                id TEXT PRIMARY KEY,
                filename TEXT NOT NULL,
                language TEXT NOT NULL,
                review_data TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create index for faster queries
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_created_at 
            ON reviews(created_at DESC)
        ''')
        
        print("✅ Database initialized successfully")


def save_review(report_id, filename, language, review_data):
    """
    Save a code review to the database
    
    Args:
        report_id: Unique identifier for the review
        filename: Name of the reviewed file
        language: Programming language
        review_data: Dictionary containing review results
    
    Returns:
        bool: True if saved successfully
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO reviews (id, filename, language, review_data, created_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                report_id,
                filename,
                language,
                json.dumps(review_data),
                datetime.now().isoformat()
            ))
            
            return True
    
    except Exception as e:
        print(f"Error saving review: {str(e)}")
        return False


def get_review(report_id):
    """
    Retrieve a specific review by ID
    
    Args:
        report_id: Unique identifier for the review
    
    Returns:
        dict: Review data or None if not found
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT id, filename, language, review_data, created_at
                FROM reviews
                WHERE id = ?
            ''', (report_id,))
            
            row = cursor.fetchone()
            
            if row:
                return {
                    'id': row['id'],
                    'filename': row['filename'],
                    'language': row['language'],
                    'review_data': row['review_data'],
                    'created_at': row['created_at']
                }
            
            return None
    
    except Exception as e:
        print(f"Error retrieving review: {str(e)}")
        return None


def get_all_reviews(page=1, per_page=20):
    """
    Get all reviews with pagination
    
    Args:
        page: Page number (starting from 1)
        per_page: Number of reviews per page
    
    Returns:
        list: List of review dictionaries
    """
    try:
        offset = (page - 1) * per_page
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT id, filename, language, review_data, created_at
                FROM reviews
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
            ''', (per_page, offset))
            
            rows = cursor.fetchall()
            
            reviews = []
            for row in rows:
                reviews.append({
                    'id': row['id'],
                    'filename': row['filename'],
                    'language': row['language'],
                    'review_data': row['review_data'],
                    'created_at': row['created_at']
                })
            
            return reviews
    
    except Exception as e:
        print(f"Error retrieving reviews: {str(e)}")
        return []


def delete_review(report_id):
    """
    Delete a specific review
    
    Args:
        report_id: Unique identifier for the review
    
    Returns:
        bool: True if deleted successfully
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute('''
                DELETE FROM reviews
                WHERE id = ?
            ''', (report_id,))
            
            return cursor.rowcount > 0
    
    except Exception as e:
        print(f"Error deleting review: {str(e)}")
        return False


def get_review_count():
    """
    Get total number of reviews
    
    Returns:
        int: Total count of reviews
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute('SELECT COUNT(*) as count FROM reviews')
            row = cursor.fetchone()
            
            return row['count'] if row else 0
    
    except Exception as e:
        print(f"Error getting review count: {str(e)}")
        return 0
