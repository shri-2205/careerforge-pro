import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/ui/Sidebar'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    bio: '',
  })

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: 240, flex: 1, padding: '32px 32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h4 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, margin: 0 }}>My Profile</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '4px 0 0' }}>Manage your account settings</p>
          </div>
          {/* Logout button */}
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', border: '1px solid #fecaca', color: '#ef4444', padding: '9px 18px', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444' }}>
            <i className="bi bi-box-arrow-right" /> Logout
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>

          {/* Left — Avatar Card */}
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
              {/* Avatar */}
              <div style={{ width: 90, height: 90, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32, fontWeight: 800, color: 'var(--accent-text)', fontFamily: 'Syne,sans-serif' }}>
                {initials}
              </div>
              <h5 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, margin: '0 0 4px' }}>{user?.name}</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 16px' }}>{user?.email}</p>

              {/* Plan badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--accent)', color: 'var(--accent-text)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                <i className="bi bi-stars" /> {user?.plan?.toUpperCase()} PLAN
              </div>

              {/* Stats */}
              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Member since', value: '2026' },
                  { label: 'Plan', value: user?.plan || 'Free' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: 'var(--surface)', borderRadius: 12, padding: '12px', border: '1px solid var(--border)' }}>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, textTransform: 'capitalize' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Edit Form */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
            <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: 24, fontSize: 16 }}>Personal Information</h6>

            {saved && (
              <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 16px', marginBottom: 20, color: '#166534', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="bi bi-check-circle-fill" /> Profile saved successfully!
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {[
                { field: 'name', label: 'Full Name', icon: 'bi-person', type: 'text', placeholder: '', full: false },
                { field: 'email', label: 'Email Address', icon: 'bi-envelope', type: 'email', placeholder: 'you@example.com', full: false },
                { field: 'phone', label: 'Phone Number', icon: 'bi-phone', type: 'text', placeholder: '+91 00000 00000', full: false },
                { field: 'location', label: 'Location', icon: 'bi-geo-alt', type: 'text', placeholder: 'Trichy, Tamil Nadu', full: false },
                { field: 'linkedin', label: 'LinkedIn URL', icon: 'bi-linkedin', type: 'text', placeholder: 'linkedin.com/in/username', full: false },
                { field: 'github', label: 'GitHub URL', icon: 'bi-github', type: 'text', placeholder: 'github.com/username', full: false },
              ].map(({ field, label, icon, type, placeholder }) => (
                <div key={field}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    <i className={`bi ${icon} me-1`} />{label}
                  </label>
                  <input type={type} className="form-control" placeholder={placeholder}
                    value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                    style={{ fontSize: 14 }} />
                </div>
              ))}

              {/* Bio — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  <i className="bi bi-file-text me-1" />Professional Bio
                </label>
                <textarea rows={4} className="form-control" placeholder="Brief professional summary about yourself..."
                  value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                  style={{ fontSize: 14, resize: 'none' }} />
              </div>

              {/* Save button */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={() => setForm({ name: user?.name||'', email: user?.email||'', phone:'', location:'', linkedin:'', github:'', bio:'' })}
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '9px 20px', borderRadius: 10, fontWeight: 500, fontSize: 14, cursor: 'pointer' }}>
                  Reset
                </button>
                <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--accent)', color: 'var(--accent-text)', padding: '9px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                  <i className="bi bi-check-lg" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid #fecaca', borderRadius: 20, padding: 24, marginTop: 24 }}>
          <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>
            <i className="bi bi-exclamation-triangle me-2" />Danger Zone
          </h6>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Once you log out, you'll need to sign in again with your credentials.</p>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ef4444', color: '#fff', padding: '9px 20px', borderRadius: 10, fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}>
            <i className="bi bi-box-arrow-right" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
