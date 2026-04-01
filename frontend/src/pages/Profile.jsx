import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ chats: 0, quizzes: 0, avgScore: 0 })
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    setUser(session.user)

    // Load chat count
    const { count: chatCount } = await supabase
      .from('chats')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)

    // Load quizzes
    const { data: quizData } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', session.user.id)

    // Load subjects
    const { data: subjectData } = await supabase
      .from('user_subjects')
      .select('*')
      .eq('user_id', session.user.id)

    const avgScore = quizData?.length > 0
      ? Math.round(quizData.reduce((a, q) => a + (q.score / q.total) * 100, 0) / quizData.length)
      : 0

    setStats({
      chats: chatCount || 0,
      quizzes: quizData?.length || 0,
      avgScore,
    })

    setSubjects(subjectData || [])
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const LEVEL_COLORS = {
    Beginner: { bg: 'rgba(59,130,246,0.15)', border: '#3b82f6', color: '#60a5fa' },
    Intermediate: { bg: 'rgba(245,158,11,0.15)', border: '#f59e0b', color: '#fbbf24' },
    Advanced: { bg: 'rgba(34,197,94,0.15)', border: '#22c55e', color: '#4ade80' },
  }

  if (loading) return (
    <div style={styles.loading}>
      <p style={{ color: '#a78bfa' }}>⚡ Loading profile...</p>
    </div>
  )

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const joined = new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h2 style={styles.title}>👤 Profile</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.content}>
        {/* User card */}
        <div style={styles.userCard}>
          <div style={styles.avatar}>{name[0].toUpperCase()}</div>
          <div>
            <h2 style={styles.name}>{name}</h2>
            <p style={styles.email}>{user?.email}</p>
            <p style={styles.joined}>Member since {joined}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Chats', value: stats.chats, icon: '💬' },
            { label: 'Quizzes Done', value: stats.quizzes, icon: '📝' },
            { label: 'Avg Score', value: `${stats.avgScore}%`, icon: '🎯' },
            { label: 'Subjects', value: subjects.length, icon: '📚' },
          ].map(s => (
            <div key={s.label} style={styles.statCard}>
              <span style={styles.statIcon}>{s.icon}</span>
              <span style={styles.statValue}>{s.value}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Subjects */}
        <h3 style={styles.sectionTitle}>My Subjects</h3>
        {subjects.length === 0 ? (
          <div style={styles.emptySubjects}>
            <p style={styles.emptyText}>No subjects yet</p>
            <button style={styles.addBtn} onClick={() => navigate('/onboarding')}>
              + Add Subject
            </button>
          </div>
        ) : (
          <div style={styles.subjectList}>
            {subjects.map(s => (
              <div key={s.id} style={styles.subjectCard}>
                <span style={styles.subjectName}>{s.subject}</span>
                <span style={{
                  ...styles.levelBadge,
                  background: LEVEL_COLORS[s.level]?.bg || LEVEL_COLORS.Beginner.bg,
                  border: `1px solid ${LEVEL_COLORS[s.level]?.border || LEVEL_COLORS.Beginner.border}`,
                  color: LEVEL_COLORS[s.level]?.color || LEVEL_COLORS.Beginner.color,
                }}>
                  {s.level}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Settings */}
        <h3 style={styles.sectionTitle}>Account</h3>
        <div style={styles.settingsList}>
          <button style={styles.settingItem} onClick={() => navigate('/onboarding')}>
            <span>➕ Add New Subject</span>
            <span style={styles.arrow}>→</span>
          </button>
          <button style={styles.settingItem} onClick={() => navigate('/history')}>
            <span>📊 View History</span>
            <span style={styles.arrow}>→</span>
          </button>
          <button style={{ ...styles.settingItem, color: '#f87171' }} onClick={handleLogout}>
            <span>🚪 Logout</span>
            <span style={styles.arrow}>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  loading: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  wrapper: { minHeight: '100vh', background: '#0a0a0f', color: '#fff', fontFamily: "'Segoe UI', sans-serif" },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #1e1e2e', background: '#111118' },
  backBtn: { background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '14px' },
  title: { fontSize: '18px', fontWeight: '700', margin: 0 },
  logoutBtn: { background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  content: { padding: 'clamp(20px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '700px', margin: '0 auto' },
  userCard: { background: '#111118', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' },
  avatar: { width: '64px', height: '64px', background: '#7c3aed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', flexShrink: 0 },
  name: { fontSize: '22px', fontWeight: '700', margin: '0 0 4px' },
  email: { color: '#9ca3af', fontSize: '14px', margin: '0 0 2px' },
  joined: { color: '#4b5563', fontSize: '12px', margin: 0 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' },
  statCard: { background: '#111118', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  statIcon: { fontSize: '24px' },
  statValue: { fontSize: '24px', fontWeight: '700', color: '#a78bfa' },
  statLabel: { fontSize: '12px', color: '#9ca3af', textAlign: 'center' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', margin: 0 },
  emptySubjects: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px', background: '#111118', borderRadius: '14px', border: '1px solid #1e1e2e' },
  emptyText: { color: '#4b5563', margin: 0 },
  addBtn: { background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', fontSize: '14px' },
  subjectList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  subjectCard: { background: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  subjectName: { fontSize: '15px', fontWeight: '600' },
  levelBadge: { fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' },
  settingsList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  settingItem: { background: '#111118', border: '1px solid #1e1e2e', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#e5e7eb', fontSize: '14px', width: '100%' },
  arrow: { color: '#4b5563' },
}