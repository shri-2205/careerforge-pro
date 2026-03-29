import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_SECTIONS = [
  {
    title: 'Main',
    items: [
      { to: '/dashboard', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
      { to: '/builder', icon: 'bi-file-earmark-plus-fill', label: 'New Resume' },
      { to: '/templates', icon: 'bi-layout-text-window-reverse', label: 'Templates' },
    ]
  },
  {
    title: 'AI Tools',
    items: [
      { to: '/cover-letter', icon: 'bi-envelope-fill', label: 'Cover Letter' },
      { to: '/interview', icon: 'bi-patch-question-fill', label: 'Interview Prep' },
      
      
    ]
  },
  {
    title: 'Account',
    items: [
      { to: '/pricing', icon: 'bi-star-fill', label: 'Upgrade Pro' },
      { to: '/profile', icon: 'bi-person-fill', label: 'Profile' },
    ]
  }
]

export default function Sidebar() {
  const { user, logout, theme, toggleTheme } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="sidebar">
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 16px var(--accent-glow)' }}>
          <i className="bi bi-lightning-fill" style={{ color: '#fff', fontSize: 16 }} />
        </div>
        <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, letterSpacing: '-0.3px' }}>ResumeAI Pro</span>
        <span style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>PRO</span>
      </div>

      {/* Nav Sections */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {NAV_SECTIONS.map(({ title, items }) => (
          <div key={title} style={{ marginBottom: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, padding: '6px 12px 4px', margin: 0 }}>{title}</p>
            {items.map(({ to, icon, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <i className={`bi ${icon}`} style={{ fontSize: 15 }} />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '10px 8px', borderTop: '1px solid var(--border)' }}>
        <button onClick={toggleTheme} className="nav-item" style={{ marginBottom: 6 }}>
          <i className={`bi bi-${theme === 'dark' ? 'sun-fill' : 'moon-fill'}`} style={{ fontSize: 15 }} />
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '10px 12px', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
              <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.plan} plan</p>
            </div>
            <button onClick={handleLogout} title="Logout" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6, fontSize: 16, display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              <i className="bi bi-box-arrow-right" />
            </button>
          </div>
        </div>

        <button onClick={handleLogout} className="btn-danger" style={{ width: '100%', padding: '8px 12px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 10 }}>
          <i className="bi bi-box-arrow-right" /> Sign Out
        </button>
      </div>
    </div>
  )
}
