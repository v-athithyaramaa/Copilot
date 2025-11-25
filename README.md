# AI-Powered Code Review Assistant

A professional-grade code review automation tool that leverages Google's Gemini 2.0 AI to provide comprehensive code analysis, quality metrics, and actionable improvement suggestions.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)

## Overview

The Code Review Assistant automates the code review process using advanced AI capabilities. It analyzes code for readability, maintainability, security vulnerabilities, performance issues, and adherence to best practices across multiple programming languages.

**Key Capabilities:**

- Automated code quality assessment with scoring metrics
- Multi-language support (Python, JavaScript, Java, C++, Go, and more)
- Security vulnerability detection
- Performance optimization suggestions
- Best practices validation
- Historical review tracking and analytics

## Features

### Core Functionality

- **AI-Powered Analysis**: Utilizes Google Gemini 2.0 Flash for intelligent code review
- **Comprehensive Scoring**: Overall quality score with detailed breakdowns
- **Security Scanning**: Identifies potential security vulnerabilities and risks
- **Performance Analysis**: Detects performance bottlenecks and optimization opportunities
- **Analytics Dashboard**: Visual insights into code quality trends and statistics
- **Detailed Reports**: In-depth analysis with actionable recommendations
- **Review History**: Persistent storage of all code reviews for tracking improvements
- **Multi-Language Support**: Automatic language detection and specialized analysis

### User Interface

- **Modern React UI**: Beautiful, responsive interface with gradient design
- **Drag-and-Drop Upload**: Easy file upload with visual feedback
- **Real-time Processing**: Live progress indicators during analysis
- **Interactive Reports**: Expandable sections with syntax-highlighted code snippets
- **Filter & Search**: Quick access to historical reviews
- **Statistics Visualization**: Charts and graphs for code quality metrics

## Tech Stack

### Backend

- **Framework**: Flask 3.0.0 (Python web framework)
- **AI/ML**: Google Generative AI 0.8.5 (Gemini 2.0 Flash model)
- **Database**: SQLite3 (Lightweight relational database)
- **File Processing**: Werkzeug utilities for secure file handling
- **CORS**: Flask-CORS for cross-origin resource sharing
- **Environment Management**: python-dotenv for configuration

### Frontend

- **Framework**: React 18.3.1 (Modern UI library)
- **Build Tool**: Vite 7.2.4 (Fast development and build tool)
- **Routing**: React Router DOM 7.1.1 (Client-side routing)
- **HTTP Client**: Axios 1.7.9 (Promise-based HTTP client)
- **Icons**: Lucide React 0.468.0 (Beautiful icon library)
- **Styling**: Custom CSS with gradient design system

### Development Tools

- **Version Control**: Git
- **Package Managers**: pip (Python), npm (JavaScript)
- **Code Quality**: ESLint (JavaScript linting)

## Project Structure

```
code-review-assistant/
├── backend/                    # Flask backend application
│   ├── app.py                 # Main Flask application & API routes
│   ├── models.py              # Database models & operations
│   ├── review_service.py      # Gemini AI integration & review logic
│   ├── utils.py               # Helper functions & file validation
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (create from .env.example)
│   ├── .env.example           # Environment variables template
│   ├── uploads/               # Temporary file storage (auto-created)
│   └── reviews.db             # SQLite database (auto-created)
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   └── ReviewReport.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── ReviewPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── StatsPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── venv/                       # Python virtual environment (auto-created)
└── README.md                  # Project documentation
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+**: [Download Python](https://www.python.org/downloads/)
- **Node.js 16+**: [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Google Gemini API Key**: [Get API Key](https://makersuite.google.com/app/apikey)

### Verify Installations

```bash
# Check Python version
python --version

# Check Node.js version
node --version

# Check npm version
npm --version
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd code-review-assistant
```

### 2. Backend Setup

#### Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

#### Install Python Dependencies

```bash
pip install -r backend/requirements.txt
```

#### Configure Environment Variables

```bash
# Copy the example environment file
cp backend/.env.example backend/.env

# Edit backend/.env and add your Gemini API key
# Windows: notepad backend/.env
# macOS/Linux: nano backend/.env
```

Add your API key to `backend/.env`:

```env
GEMINI_API_KEY=your_actual_api_key_here
FLASK_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Return to root directory
cd ..
```

## Running the Application

### Development Mode

You need two terminal windows:

#### Terminal 1: Start Backend Server

```bash
# Make sure virtual environment is activated
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Run Flask backend
python backend/app.py
```

Backend will start on: **http://localhost:5000**

#### Terminal 2: Start Frontend Server

```bash
# Navigate to frontend directory
cd frontend

# Start Vite development server
npm run dev
```

Frontend will start on: **http://localhost:5173**

### Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

## Usage

### 1. Upload Code for Review

1. Navigate to the **"Review Code"** page
2. Either drag-and-drop a code file or click to browse
3. Optionally select the programming language (auto-detected if not specified)
4. Click **"Analyze Code"** button
5. Wait for AI analysis to complete

### 2. View Review Report

- Review report displays automatically after analysis
- Includes:
  - Overall quality score (0-100)
  - Readability metrics and suggestions
  - Modularity assessment
  - Security vulnerabilities
  - Performance issues
  - Bug predictions
  - Best practice recommendations

### 3. Browse Review History

- Go to **"Reports"** page to view all past reviews
- Search and filter by filename or language
- View detailed reports by clicking the eye icon
- Delete old reports if needed

### 4. View Analytics

- Visit **"Statistics"** page for insights
- See average quality scores
- Review language distribution
- Track recent review trends

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### 1. Health Check

```http
GET /api/health

Response:
{
  "status": "healthy",
  "message": "Code Review Assistant API is running"
}
```

#### 2. Submit Code for Review

```http
POST /api/review
Content-Type: multipart/form-data

Parameters:
- file: File (required) - The code file to review
- language: String (optional) - Programming language (auto-detected if omitted)

Success Response (200):
{
  "success": true,
  "report_id": "uuid-string",
  "review": {
    "overall_score": 85,
    "readability": {
      "score": 90,
      "issues": [...],
      "suggestions": [...]
    },
    "modularity": {
      "score": 80,
      "issues": [...],
      "suggestions": [...]
    },
    "bugs": [...],
    "security": [...],
    "performance": [...],
    "best_practices": [...]
  }
}

Error Response (400/500):
{
  "success": false,
  "error": "Error message"
}
```

#### 3. Get Specific Report

```http
GET /api/report/:id

Success Response (200):
{
  "success": true,
  "report": {
    "id": "uuid",
    "filename": "example.py",
    "language": "python",
    "review_data": {...},
    "created_at": "2025-11-25T20:30:00Z"
  }
}
```

#### 4. Get All Reports

```http
GET /api/reports

Success Response (200):
{
  "success": true,
  "reports": [
    {
      "id": "uuid",
      "filename": "example.py",
      "language": "python",
      "review_data": {...},
      "created_at": "2025-11-25T20:30:00Z"
    },
    ...
  ]
}
```

#### 5. Delete Report

```http
DELETE /api/report/:id

Success Response (200):
{
  "success": true,
  "message": "Report deleted successfully"
}
```

#### 6. Get Statistics

```http
GET /api/stats

Success Response (200):
{
  "success": true,
  "stats": {
    "total_reviews": 42,
    "average_score": 78.5,
    "languages": {
      "python": 15,
      "javascript": 12,
      "java": 8,
      ...
    },
    "recent_reviews": [...]
  }
}
```

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Required: Your Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

**Note**: Database and upload paths are automatically configured relative to the backend directory.

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key"
4. Copy the generated key
5. Paste it in your `.env` file

## Notes

### Supported Languages

The AI model can analyze code in the following languages:

- Python
- JavaScript / TypeScript
- Java
- C / C++
- Go
- Ruby
- PHP
- Rust
- Swift
- Kotlin
- And many more...

### File Size Limits

- Maximum file size: 10 MB (configurable)
- Supported file extensions: `.py`, `.js`, `.ts`, `.java`, `.cpp`, `.go`, `.rb`, `.php`, etc.
