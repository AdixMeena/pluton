// ProtectedRoute.jsx — wraps pages that require login
// If no session → redirect to /auth

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/auth')
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div style={styles.wrapper}>
      <p style={styles.text}>⚡ Loading...</p>
    </div>
  )

  return children
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#a78bfa', fontSize: '18px' }
}