import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../services/api'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const { login, theme, toggleTheme } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await loginUser(form)
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <button onClick={toggleTheme} style={{ position: 'fixed', top: 16, right: 16, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 10, padding: '7px 12px', cursor: 'pointer', fontSize: 16 }}>
        <i className={`bi bi-${theme === 'dark' ? 'sun-fill' : 'moon-fill'}`} />
      </button>

      <div style={{ width: '100%', maxWidth: 420 }} className="fade-in">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 8px 32px var(--accent-glow)' }}>
            <i className="bi bi-lightning-fill" style={{ color: '#fff', fontSize: 24 }} />
          </div>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>Welcome back</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>Sign in to <span className="gradient-text" style={{ fontWeight: 700 }}>ResumeAI Pro</span></p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '32px' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '10px 14px', marginBottom: 20, color: '#ef4444', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="bi bi-exclamation-circle-fill" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="form-label-modern">Email Address</label>
              <input type="email" className="input-modern" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="form-label-modern">Password</label>
              <div style={{ position: 'relative' }}>
                <input type={show ? 'text' : 'password'} className="input-modern" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: 42 }} />
                <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 15 }}>
                  <i className={`bi bi-eye${show ? '-slash' : ''}-fill`} />
                </button>
              </div>
            </div>
            <button type="submit" className="btn-glow" disabled={loading} style={{ padding: '12px', fontSize: 15, borderRadius: 12, marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><span className="spinner-border spinner-border-sm" style={{ borderColor: '#fff', borderRightColor: 'transparent' }} />Signing in...</> : <><i className="bi bi-arrow-right-circle-fill" />Sign In</>}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
          No account?{' '}
          <Link to="/register" className="gradient-text" style={{ fontWeight: 700, textDecoration: 'none' }}>Create one free →</Link>
        </p>
      </div>
    </div>
  )
}
