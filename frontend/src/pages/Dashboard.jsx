// export default function Dashboard() {
//   return <div>Dashboard Page</div>
// }


// Dashboard.jsx — Main hub after login. Shows all subjects user is learning, level per subject, and quick actions.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Placeholder data — later this comes from Supabase
const MOCK_SUBJECTS = [
  { name: 'Python', level: 'Intermediate', progress: 60, emoji: '🐍' },
  { name: 'DSA', level: 'Beginner', progress: 20, emoji: '🧩' },
  { name: 'Math', level: 'Advanced', progress: 85, emoji: '📐' },
]

const LEVEL_COLORS = {
  Beginner: { bg: 'rgba(59,130,246,0.15)', border: '#3b82f6', color: '#60a5fa' },
  Intermediate: { bg: 'rgba(245,158,11,0.15)', border: '#f59e0b', color: '#fbbf24' },
  Advanced: { bg: 'rgba(34,197,94,0.15)', border: '#22c55e', color: '#4ade80' },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS)

  return (
    <div style={styles.wrapper}>

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>⚡ Pluton</div>
        <nav style={styles.nav}>
          {[
            { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
            { icon: '💬', label: 'General Chat', path: '/chat/general' },
            { icon: '📊', label: 'History', path: '/history' },
            { icon: '📄', label: 'Exam Prep', path: '/exam-prep' },
            { icon: '👤', label: 'Profile', path: '/profile' },
          ].map(item => (
            <button key={item.label} style={styles.navItem} onClick={() => navigate(item.path)}>
              <span>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main style={styles.main}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.greeting}>Good morning, Aditya 👋</h1>
            <p style={styles.sub}>Continue where you left off</p>
          </div>
          <button style={styles.addBtn} onClick={() => navigate('/onboarding')}>
            + New Subject
          </button>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          {[
            { label: 'Subjects', value: subjects.length },
            { label: 'Quizzes Done', value: 12 },
            { label: 'Chats', value: 34 },
            { label: 'Streak', value: '5 days 🔥' },
          ].map(s => (
            <div key={s.label} style={styles.statCard}>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Subjects */}
        <h2 style={styles.sectionTitle}>Your Subjects</h2>
        <div style={styles.subjectsGrid}>
          {subjects.map(s => (
            <div key={s.name} style={styles.subjectCard}>

              {/* Top row */}
              <div style={styles.subjectTop}>
                <span style={styles.subjectEmoji}>{s.emoji}</span>
                <span style={{
                  ...styles.levelBadge,
                  background: LEVEL_COLORS[s.level].bg,
                  border: `1px solid ${LEVEL_COLORS[s.level].border}`,
                  color: LEVEL_COLORS[s.level].color,
                }}>{s.level}</span>
              </div>

              <h3 style={styles.subjectName}>{s.name}</h3>

              {/* Progress bar */}
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${s.progress}%` }} />
              </div>
              <p style={styles.progressText}>{s.progress}% complete</p>

              {/* Action buttons */}
              <div style={styles.actionRow}>
                <button style={styles.chatBtn} onClick={() => navigate(`/chat/${s.name}`)}>
                  💬 Chat
                </button>
                <button style={styles.quizBtn} onClick={() => navigate(`/quiz/${s.name}`)}>
                  📝 Quiz
                </button>
                <button style={styles.roadmapBtn} onClick={() => navigate(`/subject/${s.name}`)}>
                  🗺️ Roadmap
                </button>
              </div>

            </div>
          ))}

          {/* Add new subject card */}
          <div style={styles.addCard} onClick={() => navigate('/onboarding')}>
            <span style={styles.addIcon}>+</span>
            <p style={styles.addText}>Add New Subject</p>
          </div>
        </div>

      </main>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh', background: '#0a0a0f',
    display: 'flex', color: '#fff',
    fontFamily: "'Segoe UI', sans-serif",
  },
  sidebar: {
    width: '220px', minHeight: '100vh',
    background: '#111118', borderRight: '1px solid #1e1e2e',
    padding: '24px 16px', display: 'flex',
    flexDirection: 'column', gap: '32px',
    position: 'sticky', top: 0, height: '100vh',
  },
  logo: { fontSize: '20px', fontWeight: '700', color: '#a78bfa', padding: '0 8px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'transparent', border: 'none', color: '#9ca3af',
    padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
    fontSize: '14px', textAlign: 'left', width: '100%',
  },
  navLabel: { fontSize: '14px' },
  main: { flex: 1, padding: 'clamp(20px, 4vw, 40px)', overflowY: 'auto' },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px',
  },
  greeting: { fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '700', margin: '0 0 4px' },
  sub: { color: '#9ca3af', fontSize: '14px', margin: 0 },
  addBtn: {
    background: '#7c3aed', color: '#fff', border: 'none',
    padding: '10px 20px', borderRadius: '10px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '600',
  },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px', marginBottom: '40px',
  },
  statCard: {
    background: '#111118', border: '1px solid #1e1e2e',
    borderRadius: '14px', padding: '20px', textAlign: 'center',
  },
  statValue: { fontSize: '28px', fontWeight: '700', color: '#a78bfa' },
  statLabel: { fontSize: '12px', color: '#9ca3af', marginTop: '4px' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px' },
  subjectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
  },
  subjectCard: {
    background: '#111118', border: '1px solid #1e1e2e',
    borderRadius: '16px', padding: '24px',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  subjectTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  subjectEmoji: { fontSize: '32px' },
  levelBadge: {
    fontSize: '12px', padding: '4px 12px',
    borderRadius: '20px', fontWeight: '600',
  },
  subjectName: { fontSize: '18px', fontWeight: '600', margin: 0 },
  progressBar: { background: '#1e1e2e', borderRadius: '10px', height: '6px' },
  progressFill: { background: '#7c3aed', height: '6px', borderRadius: '10px' },
  progressText: { fontSize: '12px', color: '#9ca3af', margin: 0 },
  actionRow: { display: 'flex', gap: '8px', marginTop: '4px' },
  chatBtn: {
    flex: 1, background: 'rgba(124,58,237,0.15)', border: '1px solid #7c3aed',
    color: '#a78bfa', padding: '8px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '12px',
  },
  quizBtn: {
    flex: 1, background: 'rgba(245,158,11,0.15)', border: '1px solid #f59e0b',
    color: '#fbbf24', padding: '8px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '12px',
  },
  roadmapBtn: {
    flex: 1, background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e',
    color: '#4ade80', padding: '8px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '12px',
  },
  addCard: {
    background: '#111118', border: '2px dashed #1e1e2e',
    borderRadius: '16px', padding: '24px',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', gap: '8px', minHeight: '200px',
  },
  addIcon: { fontSize: '32px', color: '#4b5563' },
  addText: { color: '#4b5563', fontSize: '14px', margin: 0 },
}