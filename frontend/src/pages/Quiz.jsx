import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { generateQuiz } from '../api'
import { supabase } from '../supabase'

export default function Quiz() {
  const navigate = useNavigate()
  const { subjectName } = useParams()
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [level] = useState('Intermediate')

  const startQuiz = async () => {
    setLoading(true)
    setError('')
    try {
      const qs = await generateQuiz(subjectName, level)
      setQuestions(qs)
      setStarted(true)
    } catch (e) {
      setError('Failed to generate quiz. Try again.')
    }
    setLoading(false)
  }

const handleAnswer = async (i) => {
  if (selected !== null) return
  setSelected(i)
  const correct = i === questions[current].ans
  const newScore = correct ? score + 1 : score
  if (correct) setScore(newScore)
  
  const newAnswers = [...answers, {
    q: questions[current].q,
    selected: i,
    correct,
    correctAns: questions[current].ans
  }]
  setAnswers(newAnswers)

  setTimeout(async () => {
    setSelected(null)
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1)
    } else {
      setFinished(true)
      // Save quiz score to Supabase
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await supabase.from('quizzes').insert({
          user_id: session.user.id,
          subject: subjectName,
          topic: topic || subjectName,
          score: newScore,
          total: questions.length,
          level: level,
        })
      }
    }
  }, 900)
}

  const restart = () => {
    setStarted(false); setCurrent(0); setScore(0)
    setSelected(null); setFinished(false)
    setAnswers([]); setQuestions([])
  }

  // Start screen
  if (!started && !loading) return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <div style={styles.emoji}>📝</div>
        <h2 style={styles.title}>{subjectName} Quiz</h2>
        <p style={styles.sub}>AI will generate 5 adaptive questions based on your level</p>
        <div style={styles.infoRow}>
          <span style={styles.infoBadge}>⏱ ~5 mins</span>
          <span style={styles.infoBadge}>❓ 5 questions</span>
          <span style={styles.infoBadge}>📊 {level}</span>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.startBtn} onClick={startQuiz}>
          Generate Quiz with AI →
        </button>
      </div>
    </div>
  )

  // Loading screen
  if (loading) return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.emoji}>🤖</div>
        <h2 style={styles.title}>AI is generating your quiz...</h2>
        <p style={styles.sub}>Creating {level} level questions for {subjectName}</p>
        <div style={styles.loadingBar}>
          <div style={styles.loadingFill} />
        </div>
      </div>
    </div>
  )

  // Result screen
  if (finished) return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.emoji}>{score >= 4 ? '🎉' : score >= 2 ? '👍' : '📚'}</div>
        <h2 style={styles.title}>Quiz Complete!</h2>
        <div style={styles.scoreCircle}>
          <span style={styles.scoreNum}>{score}/{questions.length}</span>
          <span style={styles.scoreLabel}>Score</span>
        </div>
        <p style={styles.sub}>
          {score >= 4 ? 'Excellent! You are mastering this topic 🔥' :
           score >= 2 ? 'Good job! Keep practicing 💪' :
           'Keep going! Review the basics 📚'}
        </p>
        <div style={styles.reviewList}>
          {answers.map((a, i) => (
            <div key={i} style={a.correct ? styles.reviewCorrect : styles.reviewWrong}>
              <span>{a.correct ? '✅' : '❌'}</span>
              <span style={styles.reviewQ}>{a.q}</span>
            </div>
          ))}
        </div>
        <div style={styles.btnRow}>
          <button style={styles.startBtn} onClick={restart}>Try Again 🔄</button>
          <button style={styles.outlineBtn} onClick={() => navigate('/dashboard')}>Dashboard</button>
        </div>
      </div>
    </div>
  )

  // Quiz screen
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.quizHeader}>
          <span style={styles.qCount}>Question {current + 1}/{questions.length}</span>
          <span style={styles.qScore}>Score: {score} 🎯</span>
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
        <h2 style={styles.question}>{questions[current].q}</h2>
        <div style={styles.options}>
          {questions[current].options.map((opt, i) => (
            <button
              key={i}
              style={
                selected === null ? styles.option :
                i === questions[current].ans ? styles.correctOption :
                selected === i ? styles.wrongOption : styles.option
              }
              onClick={() => handleAnswer(i)}
            >{opt}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', color: '#fff', fontFamily: "'Segoe UI', sans-serif" },
  card: { background: '#111118', border: '1px solid #1e1e2e', borderRadius: '20px', padding: 'clamp(24px, 5vw, 48px)', width: '100%', maxWidth: '540px', display: 'flex', flexDirection: 'column', gap: '20px' },
  backBtn: { background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '13px', textAlign: 'left' },
  emoji: { fontSize: '48px', textAlign: 'center' },
  title: { fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: '700', margin: 0, textAlign: 'center' },
  sub: { color: '#9ca3af', fontSize: '14px', margin: 0, textAlign: 'center' },
  infoRow: { display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' },
  infoBadge: { background: '#0a0a0f', border: '1px solid #1e1e2e', color: '#9ca3af', padding: '6px 14px', borderRadius: '20px', fontSize: '12px' },
  error: { color: '#f87171', fontSize: '13px', textAlign: 'center', margin: 0 },
  startBtn: { background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  outlineBtn: { background: 'transparent', color: '#a78bfa', border: '1px solid #7c3aed', borderRadius: '10px', padding: '14px', fontSize: '15px', cursor: 'pointer' },
  btnRow: { display: 'flex', gap: '12px' },
  loadingBar: { background: '#1e1e2e', borderRadius: '10px', height: '6px', overflow: 'hidden' },
  loadingFill: { background: '#7c3aed', height: '6px', borderRadius: '10px', width: '60%', animation: 'pulse 1.5s ease-in-out infinite' },
  scoreCircle: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(124,58,237,0.15)', border: '2px solid #7c3aed', borderRadius: '50%', width: '100px', height: '100px', justifyContent: 'center', margin: '0 auto' },
  scoreNum: { fontSize: '28px', fontWeight: '700', color: '#a78bfa' },
  scoreLabel: { fontSize: '12px', color: '#9ca3af' },
  reviewList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  reviewCorrect: { display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', borderRadius: '8px', padding: '10px 14px' },
  reviewWrong: { display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: '8px', padding: '10px 14px' },
  reviewQ: { fontSize: '13px', color: '#e5e7eb' },
  quizHeader: { display: 'flex', justifyContent: 'space-between' },
  qCount: { fontSize: '13px', color: '#9ca3af' },
  qScore: { fontSize: '13px', color: '#a78bfa', fontWeight: '600' },
  progressBar: { background: '#1e1e2e', borderRadius: '10px', height: '6px' },
  progressFill: { background: '#7c3aed', height: '6px', borderRadius: '10px', transition: 'width 0.3s' },
  question: { fontSize: 'clamp(16px, 4vw, 22px)', fontWeight: '600', margin: 0 },
  options: { display: 'flex', flexDirection: 'column', gap: '10px' },
  option: { background: '#0a0a0f', border: '1px solid #1e1e2e', color: '#fff', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontSize: '14px' },
  correctOption: { background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', color: '#22c55e', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontSize: '14px' },
  wrongOption: { background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontSize: '14px' },
}