import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/ui/Sidebar'

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Clean, minimal design with accent colors. Perfect for tech roles.',
    color: '#6366f1',
    font: "'Inter', sans-serif",
    preview: (
      <div style={{ padding: 16, fontFamily: "'Inter', sans-serif", fontSize: 9, color: '#111', lineHeight: 1.5, background: '#fff', minHeight: 180 }}>
        <div style={{ borderLeft: '3px solid #6366f1', paddingLeft: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#111' }}>John Doe</div>
          <div style={{ color: '#6366f1', fontSize: 9, fontWeight: 600 }}>Software Engineer</div>
          <div style={{ color: '#888', fontSize: 8 }}>john@email.com • +91 00000</div>
        </div>
        <div style={{ fontSize: 8, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Experience</div>
        {['Senior Dev at TechCorp', 'Junior Dev at StartupXYZ'].map(t => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
            <div style={{ width: 4, height: 4, background: '#6366f1', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ fontSize: 8 }}>{t}</div>
          </div>
        ))}
        <div style={{ fontSize: 8, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1, marginTop: 6, marginBottom: 4 }}>Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {['React', 'Node.js', 'AWS', 'Docker'].map(s => (
            <span key={s} style={{ background: '#6366f122', color: '#6366f1', padding: '1px 5px', borderRadius: 3, fontSize: 7, fontWeight: 600 }}>{s}</span>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Traditional professional layout. Ideal for corporate & finance.',
    color: '#1e293b',
    font: "'Georgia', serif",
    preview: (
      <div style={{ padding: 16, fontFamily: "'Georgia', serif", fontSize: 9, color: '#111', lineHeight: 1.5, background: '#fff', minHeight: 180 }}>
        <div style={{ textAlign: 'center', borderBottom: '2px solid #1e293b', paddingBottom: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1 }}>JOHN DOE</div>
          <div style={{ fontSize: 8, color: '#555' }}>john@email.com • +91 00000 • Chennai</div>
        </div>
        <div style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #1e293b', paddingBottom: 2, marginBottom: 5 }}>EXPERIENCE</div>
        {['Senior Developer — TechCorp (2022–Present)', 'Developer — StartupXYZ (2020–2022)'].map(t => (
          <div key={t} style={{ fontSize: 8, marginBottom: 3 }}>• {t}</div>
        ))}
        <div style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #1e293b', paddingBottom: 2, marginTop: 6, marginBottom: 5 }}>EDUCATION</div>
        <div style={{ fontSize: 8 }}>• B.E. Computer Science — Anna University (2020)</div>
      </div>
    )
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Ultra-clean whitespace design. Great for designers & creatives.',
    color: '#0d0d0d',
    font: "'DM Sans', sans-serif",
    preview: (
      <div style={{ padding: 16, fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: '#111', lineHeight: 1.8, background: '#fff', minHeight: 180 }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 300, letterSpacing: 2 }}>John Doe</div>
          <div style={{ fontSize: 8, color: '#999', letterSpacing: 1 }}>SOFTWARE ENGINEER</div>
        </div>
        <div style={{ width: 24, height: 1, background: '#0d0d0d', marginBottom: 8 }} />
        <div style={{ fontSize: 8, color: '#555', marginBottom: 8 }}>Aspiring full-stack developer with 5 years of experience.</div>
        {['Experience', 'Education', 'Skills'].map(s => (
          <div key={s} style={{ marginBottom: 5 }}>
            <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#999', marginBottom: 2 }}>{s}</div>
            <div style={{ fontSize: 8, color: '#444' }}>Senior Developer • TechCorp • 2022</div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'executive',
    name: 'Executive',
    desc: 'Bold two-column layout. Perfect for senior & leadership roles.',
    color: '#0f172a',
    font: "'Cabinet Grotesk', 'Syne', sans-serif",
    preview: (
      <div style={{ display: 'flex', fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 9, lineHeight: 1.5, minHeight: 180 }}>
        <div style={{ width: '38%', background: '#0f172a', color: '#fff', padding: 12, borderRadius: '8px 0 0 8px' }}>
          <div style={{ width: 32, height: 32, background: '#e8ff4d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#0f172a', fontSize: 12, marginBottom: 8 }}>J</div>
          <div style={{ fontSize: 10, fontWeight: 800, marginBottom: 2 }}>John Doe</div>
          <div style={{ fontSize: 7, color: '#94a3b8', marginBottom: 8 }}>Software Engineer</div>
          <div style={{ fontSize: 7, color: '#cbd5e1', marginBottom: 2 }}>📧 john@email.com</div>
          <div style={{ fontSize: 7, color: '#cbd5e1', marginBottom: 8 }}>📍 Chennai, TN</div>
          <div style={{ fontSize: 7, fontWeight: 700, color: '#e8ff4d', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Skills</div>
          {['React', 'Node.js', 'AWS'].map(s => (
            <div key={s} style={{ fontSize: 7, color: '#cbd5e1', marginBottom: 2 }}>▸ {s}</div>
          ))}
        </div>
        <div style={{ flex: 1, padding: 12, background: '#fff', borderRadius: '0 8px 8px 0' }}>
          <div style={{ fontSize: 7, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: 3, marginBottom: 5 }}>Experience</div>
          {['Senior Dev — TechCorp', 'Dev — StartupXYZ'].map(t => (
            <div key={t} style={{ fontSize: 7.5, color: '#334155', marginBottom: 3 }}>• {t}</div>
          ))}
          <div style={{ fontSize: 7, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: 3, marginTop: 7, marginBottom: 5 }}>Education</div>
          <div style={{ fontSize: 7.5, color: '#334155' }}>• B.E. CS — Anna University</div>
        </div>
      </div>
    )
  },
]

export default function TemplatesPage() {
  const [selected, setSelected] = useState(() => localStorage.getItem('selectedTemplate') || 'modern')
  const navigate = useNavigate()

  const handleSelect = (id) => {
    setSelected(id)
    localStorage.setItem('selectedTemplate', id)
  }

  const handleUseTemplate = () => {
    localStorage.setItem('selectedTemplate', selected)
    navigate('/builder')
  }

  const selectedTemplate = TEMPLATES.find(t => t.id === selected)

  return (
    <div className="app-layout gradient-mesh">
      <Sidebar />
      <div className="main-content" style={{ padding: '32px 36px' }}>
        <div className="fade-in" style={{ marginBottom: 32 }}>
          <h4 style={{ fontFamily: "'Cabinet Grotesk', 'Syne', sans-serif", fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Resume Templates</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '4px 0 0' }}>Choose a template — it will be applied when you build your resume</p>
        </div>

        {/* Templates Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
          {TEMPLATES.map(t => (
            <div key={t.id} onClick={() => handleSelect(t.id)}
              style={{ background: 'var(--bg-card)', border: `2px solid ${selected === t.id ? t.color : 'var(--border)'}`, borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s', transform: selected === t.id ? 'translateY(-6px)' : 'none', boxShadow: selected === t.id ? `0 16px 40px ${t.color}33` : 'none' }}>
              {/* Preview */}
              <div style={{ background: '#f8f8f4', borderBottom: '1px solid #e5e5e0', position: 'relative', padding: 4 }}>
                {t.preview}
                {selected === t.id && (
                  <div style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, background: t.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-check-lg" style={{ color: '#fff', fontSize: 13 }} />
                  </div>
                )}
              </div>
              {/* Info */}
              <div style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <div style={{ width: 10, height: 10, background: t.color, borderRadius: '50%' }} />
                  <span style={{ fontFamily: "'Cabinet Grotesk', 'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>{t.name}</span>
                  {selected === t.id && (
                    <span style={{ marginLeft: 'auto', background: t.color + '22', color: t.color, fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>Selected ✓</span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{t.desc}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '6px 0 0', opacity: 0.6 }}>
                  <i className="bi bi-fonts me-1" />Font: {t.font.split(',')[0].replace(/'/g, '')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 700, fontFamily: "'Cabinet Grotesk', 'Syne', sans-serif", margin: 0, fontSize: 15 }}>
              Selected: <span style={{ color: selectedTemplate?.color }}>{selectedTemplate?.name}</span> Template
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '3px 0 0' }}>
              This template will be applied in the Resume Builder
            </p>
          </div>
          <button onClick={handleUseTemplate} className="btn-glow"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', fontSize: 14, borderRadius: 12 }}>
            Use This Template <i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  )
}
