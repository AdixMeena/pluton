from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("AIzaSyBmqTTKuHt_kMmVj6IjHdbXAtgcgJ-64Gw"))

async def ask_gemini(prompt: str) -> str:
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    return response.text