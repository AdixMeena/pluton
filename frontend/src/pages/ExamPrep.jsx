import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { extractExamQuestions } from '../api'

export default function ExamPrep() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') setFile(f)
    else alert('Please upload a PDF file')
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const analyze = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setQuestions([])
    try {
      const result = await extractExamQuestions(file, '')
      setQuestions(result)
    } catch (e) {
      setError('Failed to extract questions. Try again.')
    }
    setLoading(false)
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h2 style={styles.title}>📄 Exam Prep</h2>
        <div />
      </div>

      <div style={styles.content}>
        <div style={styles.left}>
          <h3 style={styles.sectionTitle}>Upload Previous Year Paper</h3>
          <p style={styles.sub}>AI will extract the most important questions from your exam paper</p>

          <div
            style={{ ...styles.dropZone, borderColor: dragOver ? '#7c3aed' : '#1e1e2e' }}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])}
            />
            {file ? (
              <>
                <div style={styles.fileIcon}>📄</div>
                <p style={styles.fileName}>{file.name}</p>
                <p style={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <div style={styles.uploadIcon}>⬆️</div>
                <p style={styles.dropText}>Drop PDF here or click to upload</p>
                <p style={styles.dropSub}>Supports PDF files only</p>
              </>
            )}
          </div>

          {file && (
            <button
              style={loading ? styles.loadingBtn : styles.analyzeBtn}
              onClick={analyze}
              disabled={loading}
            >
              {loading ? '🤖 AI is reading your paper...' : 'Extract Important Questions →'}
            </button>
          )}

          {error && <p style={styles.error}>{error}</p>}
        </div>

        <div style={styles.right}>
          <h3 style={styles.sectionTitle}>
            {questions.length > 0
              ? `✅ ${questions.length} Important Questions Found`
              : 'Questions will appear here'}
          </h3>

          {questions.length === 0 && !loading && (
            <div style={styles.emptyState}>
              <p style={styles.emptyIcon}>🔍</p>
              <p style={styles.emptyText}>Upload a PDF and click analyze</p>
            </div>
          )}

          {loading && (
            <div style={styles.emptyState}>
              <p style={styles.emptyIcon}>⏳</p>
              <p style={styles.emptyText}>AI is reading your paper...</p>
            </div>
          )}

          {questions.map((q, i) => (
            <div key={i} style={styles.questionCard}>
              <span style={styles.qNum}>Q{i + 1}</span>
              <p style={styles.qText}>{q.question}</p>
              <button
                style={styles.practiceBtn}
                onClick={() => navigate('/chat/general')}
              >
                Practice →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#0a0a0f', color: '#fff', fontFamily: "'Segoe UI', sans-serif" },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #1e1e2e', background: '#111118' },
  backBtn: { background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '14px' },
  title: { fontSize: '18px', fontWeight: '700', margin: 0 },
  content: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', padding: 'clamp(20px, 4vw, 40px)' },
  left: { display: 'flex', flexDirection: 'column', gap: '16px' },
  right: { display: 'flex', flexDirection: 'column', gap: '12px' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', margin: 0 },
  sub: { color: '#9ca3af', fontSize: '13px', margin: 0 },
  dropZone: { background: '#111118', border: '2px dashed', borderRadius: '16px', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  uploadIcon: { fontSize: '40px' },
  dropText: { color: '#e5e7eb', fontSize: '15px', margin: 0, fontWeight: '600' },
  dropSub: { color: '#4b5563', fontSize: '12px', margin: 0 },
  fileIcon: { fontSize: '40px' },
  fileName: { color: '#a78bfa', fontSize: '14px', fontWeight: '600', margin: 0 },
  fileSize: { color: '#4b5563', fontSize: '12px', margin: 0 },
  analyzeBtn: { background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  loadingBtn: { background: '#4b5563', color: '#9ca3af', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', cursor: 'not-allowed' },
  error: { color: '#f87171', fontSize: '13px', margin: 0 },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '12px' },
  emptyIcon: { fontSize: '48px', margin: 0 },
  emptyText: { color: '#4b5563', fontSize: '14px', textAlign: 'center', margin: 0 },
  questionCard: { background: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' },
  qNum: { background: 'rgba(124,58,237,0.2)', color: '#a78bfa', padding: '2px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  qText: { flex: 1, fontSize: '14px', color: '#e5e7eb', margin: 0, lineHeight: '1.5' },
  practiceBtn: { background: 'transparent', border: '1px solid #1e1e2e', color: '#9ca3af', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', flexShrink: 0 },
}