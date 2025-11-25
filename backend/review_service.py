import os
import json
import re
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()


class ReviewService:
    """Service for performing code reviews using Google Gemini AI"""
    
    def __init__(self):
        """Initialize the Gemini API"""
        api_key = os.getenv('GEMINI_API_KEY')
        
        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY not found in environment variables. "
                "Please set it in your .env file."
            )
        
        genai.configure(api_key=api_key)
        
        # Use Gemini 2.0 Flash - stable and fast model
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        
        print("✅ Gemini AI initialized successfully")
    
    def review_code(self, code_content, language, filename):
        """
        Perform comprehensive code review using Gemini AI
        
        Args:
            code_content: The source code to review
            language: Programming language of the code
            filename: Name of the file being reviewed
        
        Returns:
            dict: Structured review results
        """
        
        # Construct detailed prompt for Gemini
        prompt = self._construct_prompt(code_content, language, filename)
        
        try:
            # Generate review using Gemini
            response = self.model.generate_content(prompt)
            review_text = response.text
            
            # Parse and structure the review
            structured_review = self._parse_review(review_text, language)
            
            return structured_review
        
        except Exception as e:
            print(f"Error generating review: {str(e)}")
            
            # Return error response with basic structure
            return {
                'success': False,
                'error': str(e),
                'overall_score': 0,
                'summary': 'Failed to generate review due to an error.',
                'readability': {'score': 0, 'issues': []},
                'modularity': {'score': 0, 'issues': []},
                'bugs': [],
                'security': [],
                'performance': [],
                'suggestions': []
            }
    
    def _construct_prompt(self, code_content, language, filename):
        """Construct a detailed prompt for Gemini"""
        
        prompt = f"""You are an expert code reviewer with deep knowledge of software engineering best practices, design patterns, and {language} programming.

**Task**: Perform a comprehensive code review of the following {language} code file: `{filename}`

**Code to Review**:
```{language}
{code_content}
```

**Review Requirements**:
Analyze the code thoroughly across these dimensions:

1. **Readability & Code Style** (Score: 0-100)
   - Variable and function naming conventions
   - Code comments and documentation quality
   - Code formatting and consistency
   - Code complexity and understandability

2. **Modularity & Architecture** (Score: 0-100)
   - Function/class structure and organization
   - Code reusability and DRY principle
   - Separation of concerns
   - Dependency management
   - Coupling and cohesion

3. **Potential Bugs & Edge Cases**
   - Syntax errors or warnings
   - Logic errors
   - Unhandled edge cases
   - Null/undefined handling
   - Type-related issues
   - Error handling completeness

4. **Security Vulnerabilities**
   - Injection vulnerabilities (SQL, XSS, etc.)
   - Authentication/authorization issues
   - Data exposure risks
   - Input validation problems
   - Hardcoded credentials or secrets
   - Insecure dependencies

5. **Performance Issues**
   - Algorithm efficiency (time/space complexity)
   - Memory leaks or excessive memory usage
   - Database query optimization
   - Resource management (file handles, connections, etc.)
   - Unnecessary computations

6. **Best Practices Compliance**
   - Language-specific conventions
   - Design patterns usage
   - SOLID principles
   - Testing considerations
   - Error handling patterns

**Output Format** (respond in valid JSON):
{{
    "overall_score": <0-100>,
    "summary": "<brief 2-3 sentence overview>",
    "readability": {{
        "score": <0-100>,
        "strengths": ["<strength 1>", "<strength 2>"],
        "issues": [
            {{
                "severity": "<high|medium|low>",
                "line": <line number or null>,
                "description": "<issue description>",
                "suggestion": "<how to fix>"
            }}
        ]
    }},
    "modularity": {{
        "score": <0-100>,
        "strengths": ["<strength 1>", "<strength 2>"],
        "issues": [
            {{
                "severity": "<high|medium|low>",
                "description": "<issue description>",
                "suggestion": "<how to improve>"
            }}
        ]
    }},
    "bugs": [
        {{
            "severity": "<critical|high|medium|low>",
            "line": <line number or null>,
            "type": "<bug type>",
            "description": "<detailed description>",
            "suggestion": "<fix with code example if possible>"
        }}
    ],
    "security": [
        {{
            "severity": "<critical|high|medium|low>",
            "line": <line number or null>,
            "vulnerability": "<vulnerability type>",
            "description": "<detailed description>",
            "suggestion": "<how to fix>"
        }}
    ],
    "performance": [
        {{
            "severity": "<high|medium|low>",
            "line": <line number or null>,
            "issue": "<performance issue>",
            "impact": "<performance impact>",
            "suggestion": "<optimization suggestion>"
        }}
    ],
    "best_practices": [
        {{
            "category": "<category name>",
            "current": "<what code currently does>",
            "recommended": "<what it should do>",
            "example": "<code example if applicable>"
        }}
    ],
    "suggestions": [
        {{
            "priority": "<high|medium|low>",
            "category": "<readability|modularity|security|performance|bugs>",
            "title": "<suggestion title>",
            "description": "<detailed suggestion>",
            "code_example": "<code example if applicable>"
        }}
    ]
}}

Provide a thorough, constructive review with specific, actionable feedback. Be precise about line numbers when referencing issues. Respond ONLY with valid JSON, no additional text."""

        return prompt
    
    def _parse_review(self, review_text, language):
        """
        Parse the review text from Gemini and structure it
        
        Args:
            review_text: Raw text response from Gemini
            language: Programming language
        
        Returns:
            dict: Structured review data
        """
        
        try:
            # Try to extract JSON from markdown code blocks if present
            json_match = re.search(r'```json\s*(\{.*?\})\s*```', review_text, re.DOTALL)
            if json_match:
                review_text = json_match.group(1)
            
            # Try to parse as JSON
            review_data = json.loads(review_text)
            
            # Ensure all required fields exist
            review_data.setdefault('overall_score', 75)
            review_data.setdefault('summary', 'Code review completed.')
            review_data.setdefault('readability', {'score': 75, 'issues': []})
            review_data.setdefault('modularity', {'score': 75, 'issues': []})
            review_data.setdefault('bugs', [])
            review_data.setdefault('security', [])
            review_data.setdefault('performance', [])
            review_data.setdefault('suggestions', [])
            
            return review_data
        
        except json.JSONDecodeError:
            # If JSON parsing fails, create structured data from text
            print("Failed to parse JSON, creating structured review from text")
            
            return self._fallback_parse(review_text, language)
    
    def _fallback_parse(self, review_text, language):
        """
        Fallback parser when JSON parsing fails
        Creates basic structure from text response
        """
        
        # Extract score if present
        score_match = re.search(r'(?:overall[_\s]?score|score)[:\s]*(\d+)', review_text, re.IGNORECASE)
        overall_score = int(score_match.group(1)) if score_match else 70
        
        # Split into sections
        sections = review_text.split('\n\n')
        summary = sections[0] if sections else "Code review completed."
        
        return {
            'overall_score': overall_score,
            'summary': summary[:500],  # Limit summary length
            'readability': {
                'score': overall_score,
                'strengths': [],
                'issues': []
            },
            'modularity': {
                'score': overall_score,
                'strengths': [],
                'issues': []
            },
            'bugs': [],
            'security': [],
            'performance': [],
            'best_practices': [],
            'suggestions': [
                {
                    'priority': 'medium',
                    'category': 'general',
                    'title': 'Review Analysis',
                    'description': review_text[:1000],  # Include part of raw text
                    'code_example': ''
                }
            ],
            'raw_review': review_text  # Include full text for reference
        }


# Example usage and testing
if __name__ == '__main__':
    # Test the review service
    test_code = """
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total = total + num
    return total / len(numbers)

result = calculate_average([1, 2, 3, 4, 5])
print(result)
"""
    
    service = ReviewService()
    review = service.review_code(test_code, 'python', 'test.py')
    
    print("\n" + "="*50)
    print("TEST REVIEW RESULT")
    print("="*50)
    print(json.dumps(review, indent=2))
