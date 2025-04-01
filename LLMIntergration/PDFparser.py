from langchain_ollama import OllamaLLM
from pypdf import PdfReader
import json

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF file"""
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

# def create_prompt(cv_text):
#     """Create a structured prompt for information extraction"""
#     return f"""
#     Analyze the following CV and extract the following information in JSON format:
#     - Full name
#     - Email address
#     - Mobile number
#     - Education history (degree, institution, years)
#     - Technical skills
#     - Key projects
#     - Professional qualifications
    
#     Return only valid JSON without any additional commentary.
    
#     CV Content:
#     {cv_text}
#     """

def create_prompt(cv_text):
    """Create a structured prompt with specific skills array formatting"""
    return f"""
    Analyze the CV content below and extract information only from the CV content as JSON with this EXACT structure:
    {{
      "name": "[full name]",
      "email": "[email]",
      "mobile": "[phone]",
      "education": [{{"Degree": "", "Institution": "", "Years": ""}}],
      "skills": [],
      "projects": [],
      "qualifications": []
    }}

    Formatting Rules:
    1. Skills must be individual technologies/tools in lowercase
    2. Only include specific technical skills (e.g., "python", "java", "next.js", "cloud computing")
    3. No sentences or phrases in skills - only single technology names
    4. Maintain JSON validity

    Example of valid skills:
    "skills": ["python", "django", "postgresql", "aws-ec2"]

    CV Content:
    {cv_text}
    """

def parse_response(model_response):
    """Convert model response to JSON"""
    try:
        # Remove markdown code blocks if present
        cleaned = model_response.replace('```json', '').replace('```', '')
        #return json.loads(cleaned)
        return cleaned
    except json.JSONDecodeError:
        print("Error parsing JSON response")
        return None

# Main workflow
def process_cv(pdf_path):
    # Initialize model
    model = OllamaLLM(model="deepseek-r1:1.5b")
    
    # Extract text from PDF
    cv_text = extract_text_from_pdf(pdf_path)
    
    # Generate prompt
    prompt = create_prompt(cv_text)
    
    # Get model response
    response = model.invoke(prompt)
    
    # Parse response
    return parse_response(response)

# Example usage
result = process_cv('C:/Users/ISHAN/Downloads/Documents/software-engineering-intern.pdf')
#print(json.dumps(result, indent=2))
print(result)