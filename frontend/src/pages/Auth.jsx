import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Auth() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('Please fill all fields')
      return
    }
    if (!isLogin && !form.name) {
      setError('Please enter your name')
      return
    }
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (error) throw error
        navigate('/dashboard')
      } else {
        // Signup
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name }
          }
        })
        if (error) throw error
        navigate('/onboarding')
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={styles.wrapper}>
      <span style={styles.back} onClick={() => navigate('/')}>← Back</span>

      <div style={styles.card}>
        <div style={styles.logo}>⚡ Pluton</div>

        <div style={styles.toggle}>
          <button
            style={isLogin ? styles.activeTab : styles.tab}
            onClick={() => { setIsLogin(true); setError('') }}
          >Login</button>
          <button
            style={!isLogin ? styles.activeTab : styles.tab}
            onClick={() => { setIsLogin(false); setError('') }}
          >Sign Up</button>
        </div>

        {!isLogin && (
          <input
            style={styles.input}
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            onKeyDown={handleKey}
          />
        )}
        <input
          style={styles.input}
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          onKeyDown={handleKey}
        />
        <input
          style={styles.input}
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          onKeyDown={handleKey}
        />

        {error && <p style={styles.error}>⚠️ {error}</p>}

        <button style={loading ? styles.loadingBtn : styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Login →' : 'Create Account →'}
        </button>

        <p style={styles.switchText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={styles.link} onClick={() => { setIsLogin(!isLogin); setError('') }}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative' },
  back: { position: 'absolute', top: '24px', left: '24px', color: '#9ca3af', cursor: 'pointer', fontSize: '14px' },
  card: { background: '#111118', border: '1px solid #1e1e2e', borderRadius: '20px', padding: 'clamp(24px, 5vw, 48px)', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '16px' },
  logo: { fontSize: '24px', fontWeight: '700', color: '#a78bfa', textAlign: 'center', marginBottom: '8px' },
  toggle: { display: 'flex', background: '#0a0a0f', borderRadius: '10px', padding: '4px' },
  activeTab: { flex: 1, padding: '10px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  tab: { flex: 1, padding: '10px', background: 'transparent', color: '#9ca3af', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  input: { background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '15px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  error: { color: '#f87171', fontSize: '13px', margin: 0 },
  btn: { background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  loadingBtn: { background: '#4b5563', color: '#9ca3af', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '16px', cursor: 'not-allowed' },
  switchText: { color: '#9ca3af', fontSize: '13px', textAlign: 'center', margin: 0 },
  link: { color: '#a78bfa', cursor: 'pointer' },
}