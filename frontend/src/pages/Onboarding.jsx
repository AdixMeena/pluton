import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SUBJECTS = ['C Programming', 'Python', 'JavaScript', 'Math', 'DSA', 'Web Development']

const LEVELS = ['Never heard of it', 'Know the basics', 'Comfortable', 'Advanced']

const SAMPLE_QUESTIONS = [
  { q: 'What is a variable?', options: ['A loop', 'A stored value', 'A function', 'A condition'], ans: 1 },
  { q: 'What does a loop do?', options: ['Stores data', 'Repeats code', 'Ends program', 'Declares variable'], ans: 1 },
  { q: 'What is a function?', options: ['A data type', 'Reusable block of code', 'A loop', 'An error'], ans: 1 },
  { q: 'What is an array?', options: ['Single value', 'Collection of values', 'A condition', 'A class'], ans: 1 },
  { q: 'What is recursion?', options: ['A loop type', 'Function calling itself', 'Array method', 'Error handling'], ans: 1 },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [subject, setSubject] = useState('')
  const [customSubject, setCustomSubject] = useState('')
  const [selfLevel, setSelfLevel] = useState('')
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)

  // Final subject is either picked or custom typed
  const finalSubject = customSubject || subject

  const handleStep1 = () => {
    if (!finalSubject || !selfLevel) return
    setStep(2)
  }

  const handleAnswer = (i) => {
    setSelected(i)
    if (i === SAMPLE_QUESTIONS[current].ans) setScore(s => s + 1)
    setTimeout(() => {
      setSelected(null)
      if (current + 1 < SAMPLE_QUESTIONS.length) {
        setCurrent(c => c + 1)
      } else {
        setStep(3)
      }
    }, 800)
  }

  const getFinalLevel = () => {
    if (score <= 1) return 'Beginner'
    if (score <= 3) return 'Intermediate'
    return 'Advanced'
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        {step === 1 && (
          <>
            <h2 style={styles.title}>What do you want to learn?</h2>
            <p style={styles.sub}>Pick a subject or type your own</p>

            <div style={styles.grid}>
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  style={subject === s && !customSubject ? styles.activeChip : styles.chip}
                  onClick={() => { setSubject(s); setCustomSubject('') }}
                >{s}</button>
              ))}
            </div>

            <p style={styles.label}>Or type your own:</p>
            <input
              style={styles.input}
              placeholder="e.g. Machine Learning, Physics, Chemistry..."
              value={customSubject}
              onChange={(e) => { setCustomSubject(e.target.value); setSubject('') }}
            />

            <p style={styles.label}>
              How would you rate yourself in {finalSubject || 'this subject'}?
            </p>
            <div style={styles.grid}>
              {LEVELS.map(l => (
                <button
                  key={l}
                  style={selfLevel === l ? styles.activeChip : styles.chip}
                  onClick={() => setSelfLevel(l)}
                >{l}</button>
              ))}
            </div>

            <button style={styles.btn} onClick={handleStep1}>
              Start Quick Test →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p style={styles.progress}>Question {current + 1} of {SAMPLE_QUESTIONS.length}</p>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${((current + 1) / SAMPLE_QUESTIONS.length) * 100}%` }} />
            </div>
            <h2 style={styles.question}>{SAMPLE_QUESTIONS[current].q}</h2>
            <div style={styles.optionsGrid}>
              {SAMPLE_QUESTIONS[current].options.map((opt, i) => (
                <button
                  key={i}
                  style={
                    selected === null ? styles.option :
                    i === SAMPLE_QUESTIONS[current].ans ? styles.correctOption :
                    selected === i ? styles.wrongOption : styles.option
                  }
                  onClick={() => selected === null && handleAnswer(i)}
                >{opt}</button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={styles.resultIcon}>🎯</div>
            <h2 style={styles.title}>
              Your Level: <span style={styles.accent}>{getFinalLevel()}</span>
            </h2>
            <p style={styles.sub}>
              You scored {score}/{SAMPLE_QUESTIONS.length} in {finalSubject}
            </p>
            <p style={styles.sub}>
              Your AI tutor will teach you at <strong style={styles.accent}>{getFinalLevel()}</strong> level.
            </p>
            <button style={styles.btn} onClick={() => navigate('/dashboard')}>
              Go to Dashboard →
            </button>
          </>
        )}

      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh', background: '#0a0a0f',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '20px',
  },
  card: {
    background: '#111118', border: '1px solid #1e1e2e',
    borderRadius: '20px', padding: 'clamp(24px, 5vw, 48px)',
    width: '100%', maxWidth: '520px',
    display: 'flex', flexDirection: 'column', gap: '20px',
  },
  title: { fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: '700', color: '#fff', margin: 0 },
  sub: { color: '#9ca3af', fontSize: '14px', margin: 0 },
  label: { color: '#9ca3af', fontSize: '14px', margin: '8px 0 0' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  chip: {
    background: '#0a0a0f', border: '1px solid #1e1e2e',
    color: '#9ca3af', padding: '8px 16px', borderRadius: '20px',
    cursor: 'pointer', fontSize: '13px',
  },
  activeChip: {
    background: 'rgba(124,58,237,0.2)', border: '1px solid #7c3aed',
    color: '#a78bfa', padding: '8px 16px', borderRadius: '20px',
    cursor: 'pointer', fontSize: '13px',
  },
  input: {
    background: '#0a0a0f', border: '1px solid #1e1e2e',
    borderRadius: '10px', padding: '12px 16px',
    color: '#fff', fontSize: '14px',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  btn: {
    background: '#7c3aed', color: '#fff', border: 'none',
    borderRadius: '10px', padding: '14px', fontSize: '15px',
    fontWeight: '600', cursor: 'pointer',
  },
  progress: { color: '#9ca3af', fontSize: '13px', margin: 0 },
  progressBar: { background: '#1e1e2e', borderRadius: '10px', height: '6px' },
  progressFill: { background: '#7c3aed', height: '6px', borderRadius: '10px', transition: 'width 0.3s' },
  question: { fontSize: 'clamp(16px, 4vw, 22px)', fontWeight: '600', color: '#fff', margin: 0 },
  optionsGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  option: {
    background: '#0a0a0f', border: '1px solid #1e1e2e',
    color: '#fff', padding: '14px 16px', borderRadius: '10px',
    cursor: 'pointer', textAlign: 'left', fontSize: '14px',
  },
  correctOption: {
    background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e',
    color: '#22c55e', padding: '14px 16px', borderRadius: '10px',
    cursor: 'pointer', textAlign: 'left', fontSize: '14px',
  },
  wrongOption: {
    background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444',
    color: '#ef4444', padding: '14px 16px', borderRadius: '10px',
    cursor: 'pointer', textAlign: 'left', fontSize: '14px',
  },
  resultIcon: { fontSize: '48px', textAlign: 'center' },
  accent: { color: '#a78bfa' },
}