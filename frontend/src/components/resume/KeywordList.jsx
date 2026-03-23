// KeywordList.jsx
import React, { useState } from 'react'

export default function KeywordList({ keywords, atsScore }) {
  const [open, setOpen] = useState(true)
  const presentSet = new Set((atsScore?.presentKeywords||[]).map(k=>k.toLowerCase()))
  const missingSet = new Set((atsScore?.missingKeywords||[]).map(k=>k.toLowerCase()))
  const cls = kw => presentSet.has(kw.toLowerCase()) ? 'kw-present' : missingSet.has(kw.toLowerCase()) ? 'kw-missing' : 'kw-neutral'
  const ico = kw => presentSet.has(kw.toLowerCase()) ? 'check-circle-fill' : missingSet.has(kw.toLowerCase()) ? 'x-circle-fill' : null
  const total = [...(keywords?.skills||[]),...(keywords?.tools||[]),...(keywords?.softSkills||[])].length

  if (!keywords) return null

  const Section = ({ title, items }) => items?.length > 0 && (
    <div className="mb-3">
      <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>{title}</p>
      <div className="d-flex flex-wrap gap-1">
        {items.map((kw, i) => (
          <span key={i} className={`badge px-2 py-1 ${cls(kw)}`} style={{ fontSize: 12, fontWeight: 500, borderRadius: 8 }}>
            {ico(kw) && <i className={`bi bi-${ico(kw)} me-1`} style={{ fontSize: 10 }} />}{kw}
          </span>
        ))}
      </div>
    </div>
  )

  return (
    <div className="card p-4 fade-in">
      <button onClick={() => setOpen(!open)} style={{ background: 'transparent', border: 'none', color: 'var(--text)', padding: 0, cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: open ? 16 : 0 }}>
        <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-tags-fill" style={{ color: 'var(--accent)' }} />JD Keywords
          <span style={{ background: 'var(--surface)', color: 'var(--text-muted)', fontSize: 11, padding: '2px 8px', borderRadius: 12, fontWeight: 400 }}>{presentSet.size}/{total} matched</span>
        </h6>
        <i className={`bi bi-chevron-${open?'up':'down'}`} style={{ color: 'var(--text-muted)' }} />
      </button>
      {open && (
        <div>
          {(keywords.jobTitle||keywords.experienceLevel) && (
            <div className="d-flex flex-wrap gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
              {keywords.jobTitle && <span className="badge px-2 py-1" style={{ background: 'var(--accent)', color: 'var(--accent-text)', fontSize: 12 }}>{keywords.jobTitle}</span>}
              {keywords.experienceLevel && <span className="badge kw-neutral px-2 py-1 text-capitalize">{keywords.experienceLevel} level</span>}
              {keywords.industry && <span className="badge kw-neutral px-2 py-1">{keywords.industry}</span>}
            </div>
          )}
          <div className="d-flex gap-4 mb-3" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            <span className="d-flex align-items-center gap-1"><i className="bi bi-check-circle-fill text-success" />In resume</span>
            <span className="d-flex align-items-center gap-1"><i className="bi bi-x-circle-fill text-danger" />Missing</span>
          </div>
          <Section title="Technical Skills" items={keywords.skills} />
          <Section title="Tools & Platforms" items={keywords.tools} />
          <Section title="Soft Skills" items={keywords.softSkills} />
          <Section title="Key Responsibilities" items={keywords.responsibilities} />
        </div>
      )}
    </div>
  )
}
