import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../services/api'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, theme, toggleTheme } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true); setError('')
    try {
      const res = await registerUser({ name: form.name, email: form.email, password: form.password })
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <button onClick={toggleTheme} style={{ position: 'fixed', top: 16, right: 16, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 10, padding: '7px 12px', cursor: 'pointer', fontSize: 16 }}>
        <i className={`bi bi-${theme === 'dark' ? 'sun-fill' : 'moon-fill'}`} />
      </button>

      <div style={{ width: '100%', maxWidth: 420 }} className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 8px 32px var(--accent-glow)' }}>
            <i className="bi bi-lightning-fill" style={{ color: '#fff', fontSize: 24 }} />
          </div>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>Create account</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>Start optimizing with <span className="gradient-text" style={{ fontWeight: 700 }}>ResumeAI Pro</span></p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '32px' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '10px 14px', marginBottom: 20, color: '#ef4444', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="bi bi-exclamation-circle-fill" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { field: 'name', type: 'text', label: 'Full Name', ph: 'John Doe' },
              { field: 'email', type: 'email', label: 'Email Address', ph: 'you@example.com' },
              { field: 'password', type: 'password', label: 'Password', ph: 'Min. 6 characters' },
              { field: 'confirm', type: 'password', label: 'Confirm Password', ph: 'Re-enter password' },
            ].map(({ field, type, label, ph }) => (
              <div key={field}>
                <label className="form-label-modern">{label}</label>
                <input type={type} className="input-modern" placeholder={ph}
                  value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} required />
              </div>
            ))}
            <button type="submit" className="btn-glow" disabled={loading} style={{ padding: '12px', fontSize: 15, borderRadius: 12, marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><span className="spinner-border spinner-border-sm" style={{ borderColor: '#fff', borderRightColor: 'transparent' }} />Creating...</> : <><i className="bi bi-person-plus-fill" />Create Account</>}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="gradient-text" style={{ fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
        </p>
      </div>
    </div>
  )
}
