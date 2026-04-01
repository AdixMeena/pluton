import { useNavigate, useParams } from 'react-router-dom'

const MOCK_ROADMAP = [
  { title: 'Basics & Syntax', done: true },
  { title: 'Control Flow', done: true },
  { title: 'Functions', done: false },
  { title: 'Data Structures', done: false },
  { title: 'OOP Concepts', done: false },
  { title: 'File Handling', done: false },
]

export default function SubjectHome() {
  const navigate = useNavigate()
  const { subjectName } = useParams()

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h2 style={styles.title}>{subjectName}</h2>
        <span style={styles.levelBadge}>📊 Intermediate</span>
      </div>

      <div style={styles.content}>
        {/* Quick actions */}
        <div style={styles.actionsGrid}>
          {[
            { icon: '💬', label: 'Chat with AI', desc: 'Ask anything', color: '#7c3aed', action: () => navigate(`/chat/${subjectName}`) },
            { icon: '📝', label: 'Take Quiz', desc: 'Test yourself', color: '#f59e0b', action: () => navigate(`/quiz/${subjectName}`) },
            { icon: '📄', label: 'Exam Prep', desc: 'Upload PYQ', color: '#22c55e', action: () => navigate('/exam-prep') },
            { icon: '📊', label: 'History', desc: 'Past sessions', color: '#3b82f6', action: () => navigate('/history') },
          ].map(a => (
            <button key={a.label} style={styles.actionCard} onClick={a.action}>
              <span style={{ fontSize: '32px' }}>{a.icon}</span>
              <span style={{ ...styles.actionLabel, color: a.color }}>{a.label}</span>
              <span style={styles.actionDesc}>{a.desc}</span>
            </button>
          ))}
        </div>

        {/* Roadmap */}
        <div style={styles.roadmapSection}>
          <div style={styles.roadmapHeader}>
            <h3 style={styles.sectionTitle}>🗺️ Learning Roadmap</h3>
            <span style={styles.roadmapProgress}>2/6 completed</span>
          </div>
          <div style={styles.roadmapList}>
            {MOCK_ROADMAP.map((step, i) => (
              <div key={i} style={styles.roadmapItem}>
                <div style={step.done ? styles.stepDone : styles.stepTodo}>
                  {step.done ? '✓' : i + 1}
                </div>
                {i < MOCK_ROADMAP.length - 1 && (
                  <div style={{ ...styles.connector, background: step.done ? '#7c3aed' : '#1e1e2e' }} />
                )}
                <span style={{ ...styles.stepTitle, color: step.done ? '#a78bfa' : '#9ca3af' }}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#0a0a0f', color: '#fff', fontFamily: "'Segoe UI', sans-serif" },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #1e1e2e', background: '#111118' },
  backBtn: { background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '14px' },
  title: { fontSize: '20px', fontWeight: '700', margin: 0 },
  levelBadge: { background: 'rgba(245,158,11,0.15)', border: '1px solid #f59e0b', color: '#fbbf24', padding: '4px 14px', borderRadius: '20px', fontSize: '12px' },
  content: { padding: 'clamp(20px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: '32px' },
  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' },
  actionCard: { background: '#111118', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  actionLabel: { fontSize: '15px', fontWeight: '600' },
  actionDesc: { fontSize: '12px', color: '#4b5563' },
  roadmapSection: { background: '#111118', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '24px' },
  roadmapHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', margin: 0 },
  roadmapProgress: { fontSize: '13px', color: '#a78bfa' },
  roadmapList: { display: 'flex', flexDirection: 'column', gap: '0' },
  roadmapItem: { display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', paddingBottom: '0' },
  stepDone: { width: '32px', height: '32px', borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 },
  stepTodo: { width: '32px', height: '32px', borderRadius: '50%', background: '#1e1e2e', border: '2px solid #1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#4b5563', flexShrink: 0 },
  connector: { position: 'absolute', left: '15px', top: '32px', width: '2px', height: '24px', zIndex: 0 },
  stepTitle: { fontSize: '14px', padding: '12px 0' },
}