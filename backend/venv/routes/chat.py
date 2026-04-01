from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class ChatRequest(BaseModel):
    message: str
    subject: str
    level: str


@router.post("/ask")
async def chat(req: ChatRequest):

    prompt = f"""You are a friendly AI tutor teaching {req.subject} to a {req.level} level student.
Student question: {req.message}

Rules:
- Keep response SHORT TRY TO GIVE IT IN 150 WORDS
- Use emojis to make it engaging 🎯
- Use simple bullet points with emojis like ✅ 💡 🔥
- NO markdown symbols like ** or ## or --- 
- Write in plain friendly language
- Add code examples only if needed, in triple backticks
- End with an encouraging line 🚀"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return {
        "response": response.choices[0].message.content
    }