import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getResumes, deleteResume } from '../services/api'
import Sidebar from '../components/ui/Sidebar'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getResumes().then(r => setResumes(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Delete this resume?')) return
    await deleteResume(id)
    setResumes(prev => prev.filter(r => r._id !== id))
  }

  const optimized = resumes.filter(r => r.isOptimized).length
  const scores = resumes.filter(r => r.atsScore?.overall > 0)
  const avgScore = scores.length ? Math.round(scores.reduce((s, r) => s + r.atsScore.overall, 0) / scores.length) : 0

  const scoreColor = s => s >= 80 ? '#22c55e' : s >= 60 ? '#f59e0b' : '#ef4444'
  const scoreBadge = s => s >= 80 ? 'badge-success' : s >= 60 ? 'badge-warning' : 'badge-danger'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="app-layout gradient-mesh">
      <Sidebar />
      <div className="main-content" style={{ padding: '32px 36px' }}>

        {/* Header */}
        <div className="fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 4px', fontWeight: 500 }}>{greeting} 👋</p>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, margin: 0, fontSize: 26, letterSpacing: '-0.5px' }}>
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '6px 0 0' }}>
              {resumes.length === 0 ? "Let's create your first AI-optimized resume" : `You have ${resumes.length} resume${resumes.length > 1 ? 's' : ''} — keep optimizing!`}
            </p>
          </div>
          <Link to="/builder" className="btn-glow" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', fontSize: 14, borderRadius: 12, textDecoration: 'none' }}>
            <i className="bi bi-plus-lg" /> New Resume
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
          {[
            { label: 'Total Resumes', value: resumes.length, icon: 'bi-collection-fill', color: 'var(--accent)', sub: 'All time' },
            { label: 'AI Optimized', value: optimized, icon: 'bi-stars', color: '#22c55e', sub: `${resumes.length > 0 ? Math.round((optimized/resumes.length)*100) : 0}% of total` },
            { label: 'Avg ATS Score', value: avgScore ? `${avgScore}%` : '—', icon: 'bi-bar-chart-fill', color: '#f59e0b', sub: avgScore >= 80 ? 'Excellent' : avgScore >= 60 ? 'Good' : 'Needs work' },
          ].map(({ label, value, icon, color, sub }, i) => (
            <div key={label} className="stat-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 2px', fontWeight: 500 }}>{label}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, opacity: 0.7 }}>{sub}</p>
                </div>
                <div style={{ width: 40, height: 40, background: color + '18', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
                  <i className={`bi ${icon}`} style={{ color, fontSize: 17 }} />
                </div>
              </div>
              <p style={{ fontSize: 36, fontWeight: 800, fontFamily: 'Syne,sans-serif', margin: 0, color: 'var(--text)', letterSpacing: '-1px' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
          {[
            { to: '/builder', icon: 'bi-file-earmark-plus-fill', label: 'New Resume', desc: 'Start from scratch', color: 'var(--accent)' },
            { to: '/templates', icon: 'bi-layout-text-window-reverse', label: 'Templates', desc: 'Browse 4 designs', color: '#fc5c7d' },
            { to: '/profile', icon: 'bi-person-fill', label: 'Profile', desc: 'Update your info', color: '#22c55e' },
          ].map(({ to, icon, label, desc, color }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}22` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ width: 40, height: 40, background: color + '18', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30`, flexShrink: 0 }}>
                  <i className={`bi ${icon}`} style={{ color, fontSize: 17 }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{label}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{desc}</p>
                </div>
                <i className="bi bi-arrow-right" style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 14 }} />
              </div>
            </Link>
          ))}
        </div>

        {/* Resumes */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h5 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, margin: 0, fontSize: 17 }}>My Resumes</h5>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{resumes.length} resume{resumes.length !== 1 ? 's' : ''} total</p>
            </div>
            <Link to="/builder" className="btn-glow" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13, borderRadius: 10, textDecoration: 'none' }}>
              <i className="bi bi-plus-lg" /> Create New
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1,2,3].map(i => <div key={i} className="shimmer-box" style={{ height: 72 }} />)}
            </div>
          ) : resumes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ width: 72, height: 72, background: 'var(--surface)', borderRadius: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, border: '1px solid var(--border)' }}>
                <i className="bi bi-file-earmark-text" style={{ fontSize: 30, color: 'var(--text-muted)' }} />
              </div>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>No resumes yet</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>Create your first AI-optimized resume and land more interviews</p>
              <Link to="/builder" className="btn-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', fontSize: 14, borderRadius: 12, textDecoration: 'none' }}>
                <i className="bi bi-stars" /> Create Resume
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {resumes.map((r, i) => (
                <div key={r._id} className="resume-card fade-in" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => navigate(`/builder/${r._id}`)}>
                  {/* Icon */}
                  <div style={{ width: 46, height: 46, background: 'linear-gradient(135deg, var(--accent)18, var(--accent-2)18)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent)25', flexShrink: 0 }}>
                    <i className="bi bi-file-earmark-text-fill" style={{ fontSize: 20, color: 'var(--accent)' }} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{r.title || 'Untitled Resume'}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 3 }}>
                      {r.isOptimized
                        ? <span className="badge-success" style={{ fontSize: 11 }}><i className="bi bi-check-circle-fill me-1" />AI Optimized</span>
                        : <span className="badge-purple" style={{ fontSize: 11 }}>Draft</span>}
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {new Date(r.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* ATS Score */}
                  {r.atsScore?.overall > 0 && (
                    <div style={{ textAlign: 'center', minWidth: 56 }}>
                      <p style={{ margin: 0, fontSize: 22, fontWeight: 800, fontFamily: 'Syne,sans-serif', color: scoreColor(r.atsScore.overall), letterSpacing: '-0.5px' }}>{r.atsScore.overall}</p>
                      <p style={{ margin: 0, fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>ATS %</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={e => { e.stopPropagation(); navigate(`/builder/${r._id}`) }}
                      className="btn-ghost" style={{ padding: '7px 14px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <i className="bi bi-pencil-fill" style={{ fontSize: 11 }} /> Edit
                    </button>
                    <button onClick={e => handleDelete(e, r._id)}
                      className="btn-danger" style={{ padding: '7px 10px', fontSize: 13, display: 'flex', alignItems: 'center', borderRadius: 10 }}>
                      <i className="bi bi-trash3-fill" style={{ fontSize: 12 }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
