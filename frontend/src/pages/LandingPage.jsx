import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const { theme, toggleTheme } = useAuth()
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      color: Math.random() > 0.5 ? 'rgba(124,92,252,' : 'rgba(252,92,125,',
    }))

    let animId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + '0.7)'
        ctx.fill()
      })
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const dist = Math.hypot(p.x - q.x, p.y - q.y)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(124,92,252,${0.08 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5; ctx.stroke()
          }
        })
      })
      animId = requestAnimationFrame(animate)
    }
    animate()
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(rgba(124,92,252,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.04) 1px, transparent 1px)`, backgroundSize: '64px 64px' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', top: '-150px', left: '-100px', background: 'radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 65%)', animation: 'floatOrb1 9s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', top: '15%', right: '-100px', background: 'radial-gradient(circle, rgba(252,92,125,0.1) 0%, transparent 65%)', animation: 'floatOrb2 11s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', bottom: '5%', left: '25%', background: 'radial-gradient(circle, rgba(124,92,252,0.08) 0%, transparent 65%)', animation: 'floatOrb1 13s ease-in-out infinite reverse' }} />
      </div>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '14px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-lightning-fill" style={{ color: '#fff', fontSize: 14 }} />
          </div>
          <span style={{ fontFamily: "'Cabinet Grotesk', 'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '-0.3px' }}>ResumeAI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={toggleTheme} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 9, padding: '7px 11px', cursor: 'pointer', fontSize: 15 }}>
            <i className={`bi bi-${theme === 'dark' ? 'sun-fill' : 'moon-fill'}`} />
          </button>
          <Link to="/login" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 10, padding: '7px 16px', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Login</Link>
          <Link to="/register" className="btn-glow" style={{ padding: '8px 18px', fontSize: 14, borderRadius: 10, textDecoration: 'none', display: 'inline-block' }}>Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '110px 48px 80px' }}>
        <h1 style={{ fontFamily: "'Cabinet Grotesk', 'Syne', sans-serif", fontSize: 'clamp(44px,6.5vw,78px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-2.5px', marginBottom: 28, maxWidth: 820 }}>
          Beat the ATS.<br />
          <span style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Land the Interview.
          </span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-muted)', maxWidth: 520, lineHeight: 1.75, marginBottom: 40 }}>
          Upload your resume, paste any job description, and let AI rewrite it for maximum ATS compatibility — in under 30 seconds.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
          <Link to="/register" className="btn-glow" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px', fontSize: 16, borderRadius: 14, textDecoration: 'none' }}>
            <i className="bi bi-stars" /> Start Optimizing Free <i className="bi bi-arrow-right" />
          </Link>
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', padding: '14px 24px', borderRadius: 14, textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>
            Sign In
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          {['No credit card required', 'Free to use', 'ATS-tested format', 'JWT secured'].map(t => (
            <span key={t} style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 7 }}>
              <i className="bi bi-check-circle-fill" style={{ color: 'var(--success)' }} />{t}
            </span>
          ))}
        </div>
      </section>

      {/* Score Demo */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 48px 80px' }}>
        <div style={{ display: 'flex', gap: 16, maxWidth: 480, alignItems: 'center' }}>
          {[
            { label: 'BEFORE', score: '34%', color: '#ef4444', dim: true },
            { label: 'AFTER AI', score: '91%', color: '#22c55e', highlight: true },
          ].map(({ label, score, color, dim, highlight }) => (
            <div key={label} style={{ flex: 1, background: highlight ? 'var(--bg-card)' : 'var(--surface)', border: `1px solid ${highlight ? color + '44' : 'var(--border)'}`, borderRadius: 20, padding: '24px', textAlign: 'center', opacity: dim ? 0.5 : 1, boxShadow: highlight ? `0 8px 32px ${color}22` : 'none' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>{label}</p>
              <p style={{ fontSize: 40, fontWeight: 800, fontFamily: "'Cabinet Grotesk', sans-serif", color, letterSpacing: '-1px', margin: 0 }}>{score}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0' }}>ATS Score</p>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
            <div className="btn-glow pulse" style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-stars" style={{ color: '#fff', fontSize: 18 }} />
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>AI<br />Magic</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 1, background: 'var(--surface)', padding: '80px 48px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Features</p>
            <h2 style={{ fontFamily: "'Cabinet Grotesk', 'Syne', sans-serif", fontWeight: 800, fontSize: 38, letterSpacing: '-1.5px', margin: 0 }}>
              Everything you need to<br /><span className="gradient-text">land the job</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { icon: 'bi-file-earmark-arrow-up-fill', title: 'Smart Resume Parsing', desc: 'Upload PDF or paste text. Extract full work history instantly.', color: 'var(--accent)' },
              { icon: 'bi-search-heart-fill', title: 'JD Keyword Extraction', desc: 'AI identifies every required skill and tool from the job description.', color: '#fc5c7d' },
              { icon: 'bi-stars', title: 'AI Resume Rewriting', desc: 'Bullets rewritten with ATS keywords while staying truthful.', color: '#22c55e' },
              { icon: 'bi-bar-chart-line-fill', title: 'ATS Score Analysis', desc: 'Real compatibility score with keyword match and readability breakdown.', color: '#f59e0b' },
              { icon: 'bi-pencil-square', title: 'Inline Editing', desc: 'Click any text in the preview to edit before downloading.', color: '#06b6d4' },
              { icon: 'bi-file-earmark-pdf-fill', title: 'PDF Export', desc: 'One-click download of a clean, professional PDF resume.', color: '#a855f7' },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}>
                <div style={{ width: 44, height: 44, background: color + '18', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30`, marginBottom: 16 }}>
                  <i className={`bi ${icon}`} style={{ color, fontSize: 19 }} />
                </div>
                <h6 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, marginBottom: 6, fontSize: 15 }}>{title}</h6>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Cabinet Grotesk', 'Syne', sans-serif", fontWeight: 800, fontSize: 42, letterSpacing: '-1.5px', marginBottom: 12 }}>
            Ready to <span className="gradient-text">get hired?</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32, lineHeight: 1.7 }}>
            Join thousands of job seekers who optimized their resumes with ResumeAI Pro.
          </p>
          <Link to="/register" className="btn-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 36px', fontSize: 17, borderRadius: 14, textDecoration: 'none' }}>
            <i className="bi bi-stars" /> Get Started Free <i className="bi bi-arrow-right" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-lightning-fill" style={{ color: '#fff', fontSize: 11 }} />
          </div>
          <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 14 }}>ResumeAI Pro</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Built with React, Node.js, MongoDB & Groq AI</p>
      </footer>
    </div>
  )
}
