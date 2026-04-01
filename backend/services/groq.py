from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def ask_groq(prompt: str) -> str:
    response = client.chat.completions.create(
        model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content