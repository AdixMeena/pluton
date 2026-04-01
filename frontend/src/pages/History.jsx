import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function History() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [chats, setChats] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState(['All'])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // Load chats
    const { data: chatData } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    // Load quizzes
    const { data: quizData } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (chatData) setChats(chatData)
    if (quizData) setQuizzes(quizData)

    // Build unique subjects list
    const allSubjects = new Set(['All'])
    chatData?.forEach(c => allSubjects.add(c.subject))
    quizData?.forEach(q => allSubjects.add(q.subject))
    setSubjects([...allSubjects])

    setLoading(false)
  }

  const formatTime = (ts) => {
    const d = new Date(ts)
    const now = new Date()
    const diff = now - d
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return d.toLocaleDateString()
  }

  // Combine and filter
  const allItems = [
    ...chats.map(c => ({ ...c, type: 'chat', title: c.message?.slice(0, 50) || 'Chat' })),
    ...quizzes.map(q => ({ ...q, type: 'quiz', title: `${q.subject} Quiz - ${q.topic}` })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const filtered = allItems.filter(h => {
    const typeMatch = filter === 'All' || h.type === filter
    const subjectMatch = subjectFilter === 'All' || h.subject === subjectFilter
    return typeMatch && subjectMatch
  })

  const typeIcon = { chat: '💬', quiz: '📝' }
  const typeColor = {
    chat: { bg: 'rgba(124,58,237,0.15)', border: '#7c3aed', color: '#a78bfa' },
    quiz: { bg: 'rgba(245,158,11,0.15)', border: '#f59e0b', color: '#fbbf24' },
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h2 style={styles.title}>📊 History</h2>
        <div />
      </div>

      <div style={styles.content}>
        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{chats.length}</span>
            <span style={styles.statLabel}>💬 Total Chats</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{quizzes.length}</span>
            <span style={styles.statLabel}>📝 Quizzes Taken</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>
              {quizzes.length > 0
                ? Math.round(quizzes.reduce((a, q) => a + (q.score / q.total) * 100, 0) / quizzes.length)
                : 0}%
            </span>
            <span style={styles.statLabel}>🎯 Avg Quiz Score</span>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Type:</span>
            {['All', 'chat', 'quiz'].map(t => (
              <button
                key={t}
                style={filter === t ? styles.activeFilter : styles.filterBtn}
                onClick={() => setFilter(t)}
              >
                {t === 'All' ? 'All' : t === 'chat' ? '💬 Chat' : '📝 Quiz'}
              </button>
            ))}
          </div>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Subject:</span>
            {subjects.map(s => (
              <button
                key={s}
                style={subjectFilter === s ? styles.activeFilter : styles.filterBtn}
                onClick={() => setSubjectFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div style={styles.empty}>
            <p style={{ fontSize: '40px', margin: 0 }}>⏳</p>
            <p style={{ color: '#4b5563', margin: 0 }}>Loading history...</p>
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map((h, i) => (
              <div key={i} style={styles.card}>
                <div style={{
                  ...styles.typeBadge,
                  background: typeColor[h.type].bg,
                  border: `1px solid ${typeColor[h.type].border}`,
                  color: typeColor[h.type].color
                }}>
                  {typeIcon[h.type]} {h.type}
                </div>
                <div style={styles.cardMain}>
                  <h3 style={styles.cardTitle}>{h.title}</h3>
                  <div style={styles.cardMeta}>
                    <span style={styles.metaTag}>📚 {h.subject}</span>
                    <span style={styles.metaTag}>🕐 {formatTime(h.created_at)}</span>
                    {h.type === 'quiz' && (
                      <span style={styles.metaTag}>✅ {h.score}/{h.total}</span>
                    )}
                  </div>
                </div>
                {h.type === 'chat' && (
                  <button
                    style={styles.viewBtn}
                    onClick={() => navigate(`/chat/${h.subject === 'General' ? 'general' : h.subject}`)}
                  >
                    Chat →
                  </button>
                )}
                {h.type === 'quiz' && (
                  <button
                    style={styles.viewBtn}
                    onClick={() => navigate(`/quiz/${h.subject}`)}
                  >
                    Retry →
                  </button>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={styles.empty}>
                <p style={{ fontSize: '40px', margin: 0 }}>📭</p>
                <p style={{ color: '#4b5563', margin: 0 }}>No history found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#0a0a0f', color: '#fff', fontFamily: "'Segoe UI', sans-serif" },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #1e1e2e', background: '#111118' },
  backBtn: { background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '14px' },
  title: { fontSize: '18px', fontWeight: '700', margin: 0 },
  content: { padding: 'clamp(20px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: '24px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' },
  statCard: { background: '#111118', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  statValue: { fontSize: '28px', fontWeight: '700', color: '#a78bfa' },
  statLabel: { fontSize: '12px', color: '#9ca3af' },
  filters: { display: 'flex', flexDirection: 'column', gap: '12px' },
  filterGroup: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  filterLabel: { color: '#9ca3af', fontSize: '13px' },
  filterBtn: { background: '#111118', border: '1px solid #1e1e2e', color: '#9ca3af', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' },
  activeFilter: { background: 'rgba(124,58,237,0.2)', border: '1px solid #7c3aed', color: '#a78bfa', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: '#111118', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  typeBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', flexShrink: 0 },
  cardMain: { flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' },
  cardTitle: { fontSize: '15px', fontWeight: '600', margin: 0 },
  cardMeta: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  metaTag: { background: '#0a0a0f', border: '1px solid #1e1e2e', color: '#9ca3af', padding: '2px 10px', borderRadius: '12px', fontSize: '11px' },
  viewBtn: { background: 'transparent', border: '1px solid #1e1e2e', color: '#9ca3af', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '60px 0' },
}