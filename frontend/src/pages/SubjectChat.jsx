import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { sendChatMessage } from '../api'
import { supabase } from '../supabase'

const MessageText = ({ text }) => {
  const parts = text.split(/(```[\s\S]*?```)/g)
  return (
    <div>
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.replace(/```\w*\n?/, '').replace(/```$/, '')
          return (
            <div key={i} style={styles.codeBlock}>
              <div style={styles.codeHeader}>
                <span style={styles.codeLang}>code</span>
                <button style={styles.copyBtn} onClick={() => navigator.clipboard.writeText(code)}>Copy</button>
              </div>
              <pre style={styles.codePre}>{code}</pre>
            </div>
          )
        }
        return (
          <div key={i}>
            {part.split('\n').map((line, j) => {
              if (line.startsWith('**') && line.endsWith('**'))
                return <p key={j} style={styles.boldLine}>{line.replace(/\*\*/g, '')}</p>
              if (line.startsWith('* ') || line.startsWith('- '))
                return <p key={j} style={styles.bulletLine}>• {line.slice(2)}</p>
              if (line.startsWith('### ') || line.startsWith('## '))
                return <p key={j} style={styles.headingLine}>{line.replace(/##+ /, '')}</p>
              if (line.trim() === '') return <br key={j} />
              return <p key={j} style={styles.normalLine}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
            })}
          </div>
        )
      })}
    </div>
  )
}

export default function SubjectChat() {
  const navigate = useNavigate()
  const { subjectName } = useParams()
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm your AI tutor for ${subjectName}. Ask me anything! 🚀` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [level] = useState('Intermediate')
  const [maxWords, setMaxWords] = useState(150)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)
    try {
      const response = await sendChatMessage(userMsg, subjectName, level, maxWords)
      setMessages(prev => [...prev, { role: 'ai', text: response }])
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await supabase.from('chats').insert({
          user_id: session.user.id,
          subject: subjectName,
          message: userMsg,
          response: response,
        })
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: '⚠️ Something went wrong. Try again.' }])
    }
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
        <div style={styles.headerCenter}>
          <h2 style={styles.title}>{subjectName} Tutor</h2>
          <span style={styles.levelBadge}>📊 {level}</span>
        </div>
        <button style={styles.quizBtn} onClick={() => navigate(`/quiz/${subjectName}`)}>Take Quiz →</button>
      </div>

      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={msg.role === 'user' ? styles.userRow : styles.aiRow}>
            {msg.role === 'ai' && <div style={styles.avatar}>⚡</div>}
            <div style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
              <MessageText text={msg.text} />
            </div>
          </div>
        ))}
        {loading && (
          <div style={styles.aiRow}>
            <div style={styles.avatar}>⚡</div>
            <div style={styles.aiBubble}><span style={styles.typing}>Thinking...</span></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={styles.chips}>
        {[`Explain basics of ${subjectName}`, 'Give me an example', 'What should I learn next?'].map(s => (
          <button key={s} style={styles.chip} onClick={() => setInput(s)}>{s}</button>
        ))}
      </div>

      <div style={styles.lengthRow}>
        <span style={styles.lengthLabel}>Response length:</span>
        {[75, 150, 300].map(w => (
          <button
            key={w}
            style={maxWords === w ? styles.activeLength : styles.lengthBtn}
            onClick={() => setMaxWords(w)}
          >
            {w === 75 ? '⚡ Short' : w === 150 ? '📝 Medium' : '📖 Detailed'}
          </button>
        ))}
      </div>

      <div style={styles.inputArea}>
        <textarea
          style={styles.input}
          placeholder={`Ask anything about ${subjectName}...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button
          style={input.trim() ? styles.sendBtn : styles.sendBtnDisabled}
          onClick={sendMessage}
          disabled={!input.trim() || loading}
        >➤</button>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column', color: '#fff', fontFamily: "'Segoe UI', sans-serif" },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #1e1e2e', background: '#111118' },
  backBtn: { background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' },
  headerCenter: { display: 'flex', alignItems: 'center', gap: '10px' },
  title: { margin: 0 },
  levelBadge: { background: '#1e1e2e', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' },
  quizBtn: { background: '#7c3aed', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' },
  messages: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' },
  userRow: { display: 'flex', justifyContent: 'flex-end' },
  aiRow: { display: 'flex', gap: '10px' },
  avatar: { width: '32px', height: '32px', background: '#7c3aed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  userBubble: { background: '#7c3aed', padding: '12px 16px', borderRadius: '16px', maxWidth: '70%' },
  aiBubble: { background: '#111118', border: '1px solid #1e1e2e', padding: '12px 16px', borderRadius: '16px', maxWidth: '70%' },
  typing: { color: '#9ca3af' },
  chips: { display: 'flex', gap: '8px', padding: '10px 20px', flexWrap: 'wrap' },
  chip: { background: '#111118', border: '1px solid #1e1e2e', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', color: '#9ca3af', fontSize: '12px' },
  lengthRow: { display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px 8px', flexWrap: 'wrap' },
  lengthLabel: { fontSize: '12px', color: '#4b5563' },
  lengthBtn: { background: '#111118', border: '1px solid #1e1e2e', color: '#9ca3af', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' },
  activeLength: { background: 'rgba(124,58,237,0.2)', border: '1px solid #7c3aed', color: '#a78bfa', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' },
  inputArea: { display: 'flex', gap: '10px', padding: '16px 20px', borderTop: '1px solid #1e1e2e', background: '#111118', alignItems: 'flex-end' },
  input: { flex: 1, background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: '10px', padding: '12px', color: '#fff', resize: 'none', fontFamily: "'Segoe UI', sans-serif" },
  sendBtn: { background: '#7c3aed', border: 'none', color: '#fff', width: '44px', height: '44px', borderRadius: '10px', cursor: 'pointer', fontSize: '18px' },
  sendBtnDisabled: { background: '#1e1e2e', border: 'none', color: '#555', width: '44px', height: '44px', borderRadius: '10px' },
  boldLine: { fontWeight: '700', color: '#fff', margin: '4px 0' },
  bulletLine: { margin: '4px 0', paddingLeft: '8px', color: '#e5e7eb' },
  headingLine: { fontWeight: '700', fontSize: '15px', color: '#a78bfa', margin: '8px 0 4px' },
  normalLine: { margin: '2px 0', color: '#e5e7eb' },
  codeBlock: { background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: '10px', marginTop: '8px', overflow: 'hidden' },
  codeHeader: { display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#1e1e2e', fontSize: '12px' },
  codeLang: { color: '#a78bfa' },
  copyBtn: { background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' },
  codePre: { padding: '12px', overflowX: 'auto', color: '#e5e7eb', fontSize: '13px' },
}