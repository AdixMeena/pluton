from fastapi import APIRouter, UploadFile, File, Form
import sys, os, json, re, io
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from services.groq import ask_groq
import pdfplumber

router = APIRouter()

@router.post("/extract")
async def extract_questions(file: UploadFile = File(...), subject: str = Form("")):
    # Read PDF and extract text
    content = await file.read()
    text = ""
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""

    if not text.strip():
        return {"questions": [], "error": "Could not read PDF text"}

    prompt = f"""Extract 5 most important exam questions from this paper.

Content: {text[:3000]}

Return ONLY a JSON array:
[
  {{"question": "question text here"}}
]
Only JSON, no extra text."""

    response = await ask_groq(prompt)
    clean = re.sub(r'```json|```', '', response).strip()
    questions = json.loads(clean)
    return {"questions": questions}