// export default function Landing() {
//   return <div>Landing Page</div>
// }






// Landing.jsx — Homepage. Shows hero, features, and CTA button to go to login.

import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  // Animated particle background
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      o: Math.random() * 0.5 + 0.1,
    }))

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139, 92, 246, ${p.o})`
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  const features = [
    { icon: '🎯', title: 'Adaptive Learning', desc: 'AI detects your level per subject and teaches accordingly' },
    { icon: '🤖', title: 'AI Tutor', desc: 'Chat with AI that explains topics based on your understanding' },
    { icon: '📝', title: 'Smart Quizzes', desc: 'Adaptive quizzes that get harder as you improve' },
    { icon: '📄', title: 'Exam Prep', desc: 'Upload PYQ papers and AI extracts the most important questions' },
    { icon: '🗺️', title: 'Roadmaps', desc: 'AI generates a personalized learning roadmap for any topic' },
    { icon: '📊', title: 'Track Progress', desc: 'See your growth across all subjects in one dashboard' },
  ]

  return (
    <div style={styles.wrapper}>
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* Navbar */}
      <nav style={styles.nav}>
        <span style={styles.logo}>⚡ Pluton</span>
        <button style={styles.navBtn} onClick={() => navigate('/auth')}>
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.badge}>🚀 AI-Powered Adaptive Learning</div>
        <h1 style={styles.h1}>
          Learn Anything.<br />
          <span style={styles.accent}>At Your Level.</span>
        </h1>
        <p style={styles.sub}>
          Pluton is your personal AI tutor that adapts to your understanding,
          generates quizzes, builds roadmaps, and helps you ace exams.
        </p>
        <div style={styles.btnRow}>
          <button style={styles.primaryBtn} onClick={() => navigate('/auth')}>
            Start Learning Free →
          </button>
          <button style={styles.ghostBtn} onClick={() => navigate('/auth')}>
            Login
          </button>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <h2 style={styles.h2}>Everything you need to master any skill</h2>
        <div style={styles.grid}>
          {features.map((f, i) => (
            <div key={i} style={styles.card}>
              <span style={styles.icon}>{f.icon}</span>
              <h3 style={styles.cardTitle}>{f.title}</h3>
              <p style={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaH2}>Ready to learn smarter?</h2>
        <button style={styles.primaryBtn} onClick={() => navigate('/auth')}>
          Create Free Account →
        </button>
      </section>

      <footer style={styles.footer}>
        Built for Skitech Innothon 3.0 ⚡
      </footer>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#0a0a0f',
    color: '#fff',
    fontFamily: "'Segoe UI', sans-serif",
    overflowX: 'hidden',
    position: 'relative',
  },
  canvas: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  nav: {
    position: 'relative', zIndex: 10,
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '16px 24px',
    borderBottom: '1px solid #1a1a2e',
  },
  logo: { fontSize: '20px', fontWeight: '700', color: '#a78bfa' },
  navBtn: {
    background: 'transparent', border: '1px solid #a78bfa',
    color: '#a78bfa', padding: '8px 16px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px',
  },
  hero: {
    position: 'relative', zIndex: 10,
    textAlign: 'center', padding: 'clamp(40px, 10vw, 100px) 20px 60px',
  },
  badge: {
    display: 'inline-block', background: 'rgba(139,92,246,0.15)',
    border: '1px solid rgba(139,92,246,0.3)', borderRadius: '20px',
    padding: '6px 16px', fontSize: '13px', color: '#a78bfa', marginBottom: '24px',
  },
  h1: { fontSize: 'clamp(32px, 8vw, 64px)', fontWeight: '800', lineHeight: 1.1, margin: '0 0 20px' },
  accent: { color: '#a78bfa' },
  sub: { fontSize: 'clamp(14px, 4vw, 18px)', color: '#9ca3af', maxWidth: '520px', margin: '0 auto 40px' },
  btnRow: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: {
    background: '#7c3aed', color: '#fff', border: 'none',
    padding: '12px 24px', borderRadius: '10px', fontSize: 'clamp(14px, 4vw, 16px)',
    cursor: 'pointer', fontWeight: '600',
  },
  ghostBtn: {
    background: 'transparent', color: '#fff',
    border: '1px solid #333', padding: '12px 24px',
    borderRadius: '10px', fontSize: 'clamp(14px, 4vw, 16px)', cursor: 'pointer',
  },
  features: {
    position: 'relative', zIndex: 10,
    padding: '60px 20px', textAlign: 'center',
  },
  h2: { fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: '700', marginBottom: '40px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px', maxWidth: '1000px', margin: '0 auto',
  },
  card: {
    background: '#111118', border: '1px solid #1e1e2e',
    borderRadius: '16px', padding: '24px', textAlign: 'left',
  },
  icon: { fontSize: '28px' },
  cardTitle: { fontSize: '16px', fontWeight: '600', margin: '12px 0 8px' },
  cardDesc: { fontSize: '13px', color: '#9ca3af', margin: 0 },
  cta: {
    position: 'relative', zIndex: 10,
    textAlign: 'center', padding: '60px 20px',
    borderTop: '1px solid #1a1a2e',
  },
  ctaH2: { fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: '700', marginBottom: '32px' },
  footer: {
    position: 'relative', zIndex: 10,
    textAlign: 'center', padding: '24px',
    color: '#4b5563', fontSize: '13px',
    borderTop: '1px solid #1a1a2e',
  },
}