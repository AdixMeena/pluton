import sys
import os
sys.path.append(os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat, quiz, exam

app = FastAPI(title="Pluton AI Tutor Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/chat")
app.include_router(quiz.router, prefix="/quiz")
app.include_router(exam.router, prefix="/exam")

@app.get("/")
def root():
    return {"message": "Pluton Backend Running!"}