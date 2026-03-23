import React, { useState } from 'react'

// Template style definitions
const TEMPLATE_STYLES = {
  modern: {
    font: "'Inter', 'DM Sans', sans-serif",
    accentColor: '#6366f1',
    headerStyle: 'left-accent',
  },
  classic: {
    font: "'Georgia', serif",
    accentColor: '#1e293b',
    headerStyle: 'center',
  },
  minimal: {
    font: "'DM Sans', sans-serif",
    accentColor: '#0d0d0d',
    headerStyle: 'minimal',
  },
  executive: {
    font: "'Cabinet Grotesk', 'Syne', sans-serif",
    accentColor: '#0f172a',
    headerStyle: 'two-column',
  },
}

function Editable({ value, onSave, multi }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)
  const commit = () => { onSave(val); setEditing(false) }
  if (editing) return multi
    ? <textarea autoFocus rows={2} value={val} onChange={e => setVal(e.target.value)} onBlur={commit}
        style={{ width: '100%', fontSize: 'inherit', fontFamily: 'inherit', border: '2px solid #6366f1', borderRadius: 4, padding: '2px 4px', resize: 'none', outline: 'none' }} />
    : <input autoFocus value={val} onChange={e => setVal(e.target.value)} onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit() }}
        style={{ fontSize: 'inherit', fontFamily: 'inherit', border: '2px solid #6366f1', borderRadius: 4, padding: '1px 4px', outline: 'none', minWidth: 60 }} />
  return <span className="editable" onClick={() => { setVal(value); setEditing(true) }}>{value}</span>
}

// ── Modern Template ──
function ModernTemplate({ resume, onUpdate }) {
  const accent = '#6366f1'
  const upd = (key, val) => onUpdate({ ...resume, [key]: val })
  const updBullet = (ei, bi, val) => {
    const r = { ...resume, experience: resume.experience.map((e, i) => i === ei ? { ...e, bullets: e.bullets.map((b, j) => j === bi ? val : b) } : e) }
    onUpdate(r)
  }
  return (
    <div style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ borderLeft: `4px solid ${accent}`, paddingLeft: 16, marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0d0d0d', margin: '0 0 4px', fontFamily: "'Inter', sans-serif" }}>
          <Editable value={resume.name || 'Your Name'} onSave={v => upd('name', v)} />
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', fontSize: 13, color: '#555' }}>
          {resume.email && <span style={{ color: accent }}>✉ <Editable value={resume.email} onSave={v => upd('email', v)} /></span>}
          {resume.phone && <span>📱 <Editable value={resume.phone} onSave={v => upd('phone', v)} /></span>}
          {resume.location && <span>📍 <Editable value={resume.location} onSave={v => upd('location', v)} /></span>}
          {resume.linkedin && <span>🔗 <Editable value={resume.linkedin} onSave={v => upd('linkedin', v)} /></span>}
        </div>
      </div>
      {/* Summary */}
      {resume.summary && <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Summary</div>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: '#374151', margin: 0 }}><Editable value={resume.summary} onSave={v => upd('summary', v)} multi /></p>
      </div>}
      {/* Experience */}
      {resume.experience?.length > 0 && <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Experience</div>
        {resume.experience.map((exp, ei) => (
          <div key={ei} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div><span style={{ fontWeight: 700, fontSize: 14 }}><Editable value={exp.title} onSave={v => { const r = { ...resume, experience: resume.experience.map((e, i) => i === ei ? { ...e, title: v } : e) }; onUpdate(r) }} /></span><span style={{ color: '#6b7280', fontSize: 13 }}> · {exp.company}</span></div>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>{exp.duration}</span>
            </div>
            <ul style={{ margin: '4px 0 0', paddingLeft: 0, listStyle: 'none' }}>
              {(exp.bullets || []).map((b, bi) => (
                <li key={bi} style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, display: 'flex', gap: 8, marginBottom: 2 }}>
                  <span style={{ color: accent, marginTop: 2, flexShrink: 0 }}>▸</span>
                  <Editable value={b} onSave={v => updBullet(ei, bi, v)} multi />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>}
      {/* Skills */}
      {resume.skills?.length > 0 && <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {resume.skills.map((s, i) => <span key={i} style={{ background: accent + '15', color: accent, border: `1px solid ${accent}30`, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s}</span>)}
        </div>
      </div>}
      {/* Education */}
      {resume.education?.length > 0 && <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Education</div>
        {resume.education.map((e, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13 }}><strong>{e.degree}</strong> · {e.institution}</span>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>{e.year}</span>
          </div>
        ))}
      </div>}
    </div>
  )
}

// ── Classic Template ──
function ClassicTemplate({ resume, onUpdate }) {
  const upd = (key, val) => onUpdate({ ...resume, [key]: val })
  const updBullet = (ei, bi, val) => {
    onUpdate({ ...resume, experience: resume.experience.map((e, i) => i === ei ? { ...e, bullets: e.bullets.map((b, j) => j === bi ? val : b) } : e) })
  }
  const SectionTitle = ({ children }) => (
    <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#1e293b', borderBottom: '2px solid #1e293b', paddingBottom: 3, marginBottom: 10, marginTop: 16 }}>{children}</div>
  )
  return (
    <div style={{ fontFamily: "'Georgia', serif" }}>
      <div style={{ textAlign: 'center', borderBottom: '2px solid #1e293b', paddingBottom: 14, marginBottom: 4 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 6px', fontFamily: "'Georgia', serif" }}>
          <Editable value={resume.name || 'Your Name'} onSave={v => upd('name', v)} />
        </h1>
        <div style={{ fontSize: 12, color: '#555', display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          {resume.email && <Editable value={resume.email} onSave={v => upd('email', v)} />}
          {resume.phone && <><span>|</span><Editable value={resume.phone} onSave={v => upd('phone', v)} /></>}
          {resume.location && <><span>|</span><Editable value={resume.location} onSave={v => upd('location', v)} /></>}
        </div>
      </div>
      {resume.summary && <><SectionTitle>Professional Summary</SectionTitle>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: '#374151', fontStyle: 'italic' }}><Editable value={resume.summary} onSave={v => upd('summary', v)} multi /></p></>}
      {resume.experience?.length > 0 && <><SectionTitle>Experience</SectionTitle>
        {resume.experience.map((exp, ei) => (
          <div key={ei} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}><Editable value={exp.title} onSave={v => { onUpdate({ ...resume, experience: resume.experience.map((e, i) => i === ei ? { ...e, title: v } : e) }) }} /> — {exp.company}</span>
              <span style={{ fontSize: 12, color: '#6b7280' }}>{exp.duration}</span>
            </div>
            {(exp.bullets || []).map((b, bi) => <div key={bi} style={{ fontSize: 12, color: '#374151', lineHeight: 1.7, paddingLeft: 12 }}>• <Editable value={b} onSave={v => updBullet(ei, bi, v)} multi /></div>)}
          </div>
        ))}</>}
      {resume.skills?.length > 0 && <><SectionTitle>Skills</SectionTitle>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.8 }}>{resume.skills.join(' • ')}</p></>}
      {resume.education?.length > 0 && <><SectionTitle>Education</SectionTitle>
        {resume.education.map((e, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
            <span><strong>{e.degree}</strong> — {e.institution}</span>
            <span style={{ color: '#6b7280' }}>{e.year}</span>
          </div>
        ))}</>}
    </div>
  )
}

// ── Minimal Template ──
function MinimalTemplate({ resume, onUpdate }) {
  const upd = (key, val) => onUpdate({ ...resume, [key]: val })
  const updBullet = (ei, bi, val) => {
    onUpdate({ ...resume, experience: resume.experience.map((e, i) => i === ei ? { ...e, bullets: e.bullets.map((b, j) => j === bi ? val : b) } : e) })
  }
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: 3, margin: '0 0 4px', color: '#0d0d0d' }}>
          <Editable value={resume.name || 'Your Name'} onSave={v => upd('name', v)} />
        </h1>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 10 }}>Software Engineer</div>
        <div style={{ width: 32, height: 1.5, background: '#0d0d0d', marginBottom: 10 }} />
        <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {resume.email && <Editable value={resume.email} onSave={v => upd('email', v)} />}
          {resume.phone && <Editable value={resume.phone} onSave={v => upd('phone', v)} />}
          {resume.location && <Editable value={resume.location} onSave={v => upd('location', v)} />}
        </div>
      </div>
      {resume.summary && <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 6 }}>About</div>
        <p style={{ fontSize: 13, lineHeight: 1.8, color: '#4b5563', margin: 0 }}><Editable value={resume.summary} onSave={v => upd('summary', v)} multi /></p>
      </div>}
      {resume.experience?.length > 0 && <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 10 }}>Experience</div>
        {resume.experience.map((exp, ei) => (
          <div key={ei} style={{ marginBottom: 14, display: 'flex', gap: 16 }}>
            <div style={{ width: 60, fontSize: 10, color: '#9ca3af', flexShrink: 0, marginTop: 2, lineHeight: 1.4 }}>{exp.duration}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}><Editable value={exp.title} onSave={v => { onUpdate({ ...resume, experience: resume.experience.map((e, i) => i === ei ? { ...e, title: v } : e) }) }} /></div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>{exp.company}</div>
              {(exp.bullets || []).map((b, bi) => <div key={bi} style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.7 }}>— <Editable value={b} onSave={v => updBullet(ei, bi, v)} multi /></div>)}
            </div>
          </div>
        ))}
      </div>}
      {resume.skills?.length > 0 && <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 8 }}>Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {resume.skills.map((s, i) => <span key={i} style={{ fontSize: 12, color: '#374151', border: '1px solid #e5e7eb', padding: '3px 10px', borderRadius: 4 }}>{s}</span>)}
        </div>
      </div>}
      {resume.education?.length > 0 && <div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 8 }}>Education</div>
        {resume.education.map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 4 }}>
            <div style={{ width: 60, fontSize: 10, color: '#9ca3af', flexShrink: 0 }}>{e.year}</div>
            <div style={{ fontSize: 13 }}><strong>{e.degree}</strong> · {e.institution}</div>
          </div>
        ))}
      </div>}
    </div>
  )
}

// ── Executive Template ──
function ExecutiveTemplate({ resume, onUpdate }) {
  const upd = (key, val) => onUpdate({ ...resume, [key]: val })
  const updBullet = (ei, bi, val) => {
    onUpdate({ ...resume, experience: resume.experience.map((e, i) => i === ei ? { ...e, bullets: e.bullets.map((b, j) => j === bi ? val : b) } : e) })
  }
  return (
    <div style={{ display: 'flex', fontFamily: "'Cabinet Grotesk', 'Syne', sans-serif", minHeight: 600 }}>
      {/* Left sidebar */}
      <div style={{ width: '34%', background: '#0f172a', color: '#fff', padding: 24, flexShrink: 0 }}>
        <div style={{ width: 52, height: 52, background: '#e8ff4d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, color: '#0f172a', marginBottom: 12 }}>
          {resume.name?.charAt(0)?.toUpperCase() || 'J'}
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 3px', color: '#fff' }}><Editable value={resume.name || 'Your Name'} onSave={v => upd('name', v)} /></h2>
        <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 16px' }}>Software Engineer</p>
        <div style={{ fontSize: 11, color: '#cbd5e1', marginBottom: 4 }}>✉ <Editable value={resume.email || 'email'} onSave={v => upd('email', v)} /></div>
        <div style={{ fontSize: 11, color: '#cbd5e1', marginBottom: 4 }}>📱 <Editable value={resume.phone || 'phone'} onSave={v => upd('phone', v)} /></div>
        <div style={{ fontSize: 11, color: '#cbd5e1', marginBottom: 20 }}>📍 <Editable value={resume.location || 'location'} onSave={v => upd('location', v)} /></div>
        {resume.skills?.length > 0 && <>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#e8ff4d', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Skills</div>
          {resume.skills.slice(0, 10).map((s, i) => <div key={i} style={{ fontSize: 11, color: '#cbd5e1', marginBottom: 4 }}>▸ {s}</div>)}
        </>}
        {resume.certifications?.length > 0 && <>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#e8ff4d', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 16, marginBottom: 8 }}>Certifications</div>
          {resume.certifications.map((c, i) => <div key={i} style={{ fontSize: 11, color: '#cbd5e1', marginBottom: 4 }}>▸ {c}</div>)}
        </>}
      </div>
      {/* Right content */}
      <div style={{ flex: 1, padding: 24, background: '#fff' }}>
        {resume.summary && <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: 3, marginBottom: 8 }}>Summary</div>
          <p style={{ fontSize: 12, lineHeight: 1.7, color: '#334155', margin: 0 }}><Editable value={resume.summary} onSave={v => upd('summary', v)} multi /></p>
        </div>}
        {resume.experience?.length > 0 && <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: 3, marginBottom: 10 }}>Experience</div>
          {resume.experience.map((exp, ei) => (
            <div key={ei} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}><Editable value={exp.title} onSave={v => { onUpdate({ ...resume, experience: resume.experience.map((e, i) => i === ei ? { ...e, title: v } : e) }) }} /></span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{exp.duration}</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{exp.company}</div>
              {(exp.bullets || []).map((b, bi) => <div key={bi} style={{ fontSize: 12, color: '#334155', lineHeight: 1.6, paddingLeft: 10 }}>• <Editable value={b} onSave={v => updBullet(ei, bi, v)} multi /></div>)}
            </div>
          ))}
        </div>}
        {resume.education?.length > 0 && <div>
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: 3, marginBottom: 10 }}>Education</div>
          {resume.education.map((e, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span><strong>{e.degree}</strong> · {e.institution}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{e.year}</span>
            </div>
          ))}
        </div>}
      </div>
    </div>
  )
}

// ── Main ResumePreview Component ──
export default function ResumePreview({ resume, onUpdate }) {
  const selectedTemplate = localStorage.getItem('selectedTemplate') || 'modern'

  if (!resume) return (
    <div className="resume-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <p style={{ color: '#9ca3af', fontSize: 14 }}>Run AI optimization to see preview</p>
    </div>
  )

  const templateProps = { resume, onUpdate }

  return (
    <div id="resume-preview-content" className="resume-preview" style={{ padding: selectedTemplate === 'executive' ? 0 : 40, overflow: 'hidden' }}>
      {selectedTemplate === 'modern' && <ModernTemplate {...templateProps} />}
      {selectedTemplate === 'classic' && <ClassicTemplate {...templateProps} />}
      {selectedTemplate === 'minimal' && <MinimalTemplate {...templateProps} />}
      {selectedTemplate === 'executive' && <ExecutiveTemplate {...templateProps} />}
      <p style={{ textAlign: 'center', fontSize: 11, color: '#d1d5db', marginTop: 20, fontFamily: 'DM Sans, sans-serif' }}>
        Click any text to edit inline · Template: {selectedTemplate}
      </p>
    </div>
  )
}
