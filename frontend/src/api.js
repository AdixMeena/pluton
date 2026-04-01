const BASE_URL = "http://localhost:8000"

// Send chat message
export const sendChatMessage = async (message, subject, level, maxWords = 150) => {
  try {
    const res = await fetch(`${BASE_URL}/chat/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, subject, level, max_words: maxWords })
    })
    const data = await res.json()
    return data.response
  } catch (err) {
    throw new Error("Chat failed: " + err.message)
  }
}

// Generate quiz questions
export const generateQuiz = async (subject, level) => {
  try {
    const res = await fetch(`${BASE_URL}/quiz/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, level })
    })
    const data = await res.json()
    return data.questions
  } catch (err) {
    throw new Error("Quiz generation failed: " + err.message)
  }
}

// Extract questions from PDF
export const extractExamQuestions = async (file, subject) => {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("subject", subject)
    const res = await fetch(`${BASE_URL}/exam/extract`, {
      method: "POST",
      body: formData
    })
    const data = await res.json()
    return data.questions
  } catch (err) {
    throw new Error("Exam extraction failed: " + err.message)
  }
}