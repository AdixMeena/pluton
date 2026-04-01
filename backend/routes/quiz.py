from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os, json, re
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
router = APIRouter()

class QuizRequest(BaseModel):
    subject: str
    level: str

@router.post("/generate")
async def generate_quiz(req: QuizRequest):
    prompt = f"""Generate 5 MCQs for a {req.level} student in {req.subject}.
Return ONLY a JSON array:
[{{"q": "question", "options": ["a","b","c","d"], "ans": 0}}]
Vary the ans index. Only JSON, no extra text."""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": prompt}]
    )
    clean = re.sub(r'```json|```', '', response.choices[0].message.content).strip()
    return {"questions": json.loads(clean)}