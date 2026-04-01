import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendChatMessage } from '../api'
import { supabase } from '../supabase'

export default function GeneralChat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am your AI assistant. Ask me anything! 🚀' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [maxWords, setMaxWords] = useState(150)
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load chat history from Supabase on mount
  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('subject', 'General')
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setSessions(data)
  }

  const loadSession = (chat) => {
    setActiveSession(chat.id)
    setMessages([
      { role: 'user', text: chat.message },
      { role: 'ai', text: chat.response }
    ])
  }

  const newChat = () => {
    setActiveSession(null)
    setMessages([{ role: 'ai', text: 'Hi! I am your AI assistant. Ask me anything! 🚀' }])
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)
    try {
      const response = await sendChatMessage(userMsg, 'General', 'Intermediate', maxWords)
      setMessages(prev => [...prev, { role: 'ai', text: response }])
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await supabase.from('chats').insert({
          user_id: session.user.id,
          subject: 'General',
          message: userMsg,
          response: response,
        })
        loadSessions() // refresh sidebar
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: '⚠️ Something went wrong. Try again.' }])
    }
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const formatTime = (ts) => {
    const d = new Date(ts)
    const now = new Date()
    const diff = now - d
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return d.toLocaleDateString()
  }

  return (
    <div style={styles.wrapper}>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <aside style={styles.sidebar}>
          <div style={styles.sidebarTop}>
            <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
            <button style={styles.newChatBtn} onClick={newChat}>+ New Chat</button>
          </div>

          <p style={styles.historyLabel}>Recent Chats</p>

          <div style={styles.sessionList}>
            {sessions.length === 0 && (
              <p style={styles.noHistory}>No chats yet</p>
            )}
            {sessions.map(s => (
              <button
                key={s.id}
                style={activeSession === s.id ? styles.activeSession : styles.session}
                onClick={() => loadSession(s)}
              >
                <span style={styles.sessionTitle}>
                  💬 {s.message.slice(0, 30)}{s.message.length > 30 ? '...' : ''}
                </span>
                <span style={styles.sessionTime}>{formatTime(s.created_at)}</span>
              </button>
            ))}
          </div>
        </aside>
      )}

      {/* MAIN CHAT */}
      <main style={styles.main}>
        <div style={styles.topBar}>
          <button style={styles.iconBtn} onClick={() => setSidebarOpen(o => !o)}>☰</button>
          <h2 style={styles.title}>💬 General Chat</h2>
          <div />
        </div>

        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div key={i} style={msg.role === 'user' ? styles.userRow : styles.aiRow}>
              {msg.role === 'ai' && <div style={styles.avatar}>⚡</div>}
              <div style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
                {msg.text}
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
            placeholder="Ask anything..."
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
      </main>

    </div>
  )
}

const styles = {
  wrapper: { height: '100vh', background: '#0a0a0f', display: 'flex', color: '#fff', fontFamily: "'Segoe UI', sans-serif", overflow: 'hidden' },
  sidebar: { width: '260px', background: '#111118', borderRight: '1px solid #1e1e2e', display: 'flex', flexDirection: 'column', padding: '16px', gap: '12px', height: '100vh', overflowY: 'auto', flexShrink: 0 },
  sidebarTop: { display: 'flex', flexDirection: 'column', gap: '8px' },
  backBtn: { background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '13px', textAlign: 'left', padding: '4px 0' },
  newChatBtn: { background: 'rgba(124,58,237,0.15)', border: '1px solid #7c3aed', color: '#a78bfa', padding: '10px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  historyLabel: { fontSize: '11px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '1px', margin: '4px 0 0' },
  sessionList: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  noHistory: { color: '#4b5563', fontSize: '13px', textAlign: 'center', marginTop: '20px' },
  session: { background: 'transparent', border: 'none', color: '#9ca3af', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2px' },
  activeSession: { background: 'rgba(124,58,237,0.15)', border: 'none', color: '#a78bfa', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2px' },
  sessionTitle: { fontSize: '13px' },
  sessionTime: { fontSize: '11px', color: '#4b5563' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' },
  topBar: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderBottom: '1px solid #1e1e2e', background: '#111118' },
  iconBtn: { background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '18px' },
  title: { fontSize: '16px', fontWeight: '700', margin: 0, flex: 1 },
  messages: { flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  userRow: { display: 'flex', justifyContent: 'flex-end' },
  aiRow: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
  avatar: { width: '32px', height: '32px', background: '#7c3aed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 },
  userBubble: { background: '#7c3aed', color: '#fff', padding: '12px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '65%', fontSize: '14px', lineHeight: '1.6' },
  aiBubble: { background: '#111118', border: '1px solid #1e1e2e', color: '#e5e7eb', padding: '14px 16px', borderRadius: '4px 18px 18px 18px', maxWidth: '70%', fontSize: '14px', lineHeight: '1.6' },
  typing: { color: '#9ca3af', fontStyle: 'italic' },
  lengthRow: { display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px 8px', flexWrap: 'wrap' },
  lengthLabel: { fontSize: '12px', color: '#4b5563' },
  lengthBtn: { background: '#111118', border: '1px solid #1e1e2e', color: '#9ca3af', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' },
  activeLength: { background: 'rgba(124,58,237,0.2)', border: '1px solid #7c3aed', color: '#a78bfa', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' },
  inputArea: { display: 'flex', gap: '10px', padding: '16px 24px', borderTop: '1px solid #1e1e2e', background: '#111118', alignItems: 'flex-end' },
  input: { flex: 1, background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: "'Segoe UI', sans-serif" },
  sendBtn: { background: '#7c3aed', border: 'none', color: '#fff', width: '44px', height: '44px', borderRadius: '12px', cursor: 'pointer', fontSize: '18px', flexShrink: 0 },
  sendBtnDisabled: { background: '#1e1e2e', border: 'none', color: '#4b5563', width: '44px', height: '44px', borderRadius: '12px', cursor: 'not-allowed', fontSize: '18px', flexShrink: 0 },
}