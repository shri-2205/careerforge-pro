import React, { useEffect, useState } from 'react'

export default function ATSScoreCard({ atsScore }) {
  const [anim, setAnim] = useState(0)
  const { overall=0, keywordMatch=0, formatting=0, readability=0, verdict='', suggestions=[] } = atsScore || {}

  useEffect(() => {
    if (!overall) return
    let cur = 0
    const t = setInterval(() => { cur = Math.min(cur + overall/40, overall); setAnim(Math.round(cur)); if (cur >= overall) clearInterval(t) }, 30)
    return () => clearInterval(t)
  }, [overall])

  const R = 52, C = 2 * Math.PI * R
  const offset = C - (overall / 100) * C
  const color = overall >= 80 ? '#22c55e' : overall >= 60 ? '#f59e0b' : '#ef4444'
  const vStyle = verdict?.includes('Strong') ? { bg: '#dcfce7', c: '#166534' } : verdict?.includes('Moderate') ? { bg: '#fef9c3', c: '#854d0e' } : { bg: '#fee2e2', c: '#991b1b' }

  return (
    <div className="card p-4 h-100 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-bar-chart-fill" style={{ color: 'var(--accent)' }} />ATS Score
        </h6>
        {verdict && <span style={{ background: vStyle.bg, color: vStyle.c, fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>{verdict}</span>}
      </div>
      <div className="d-flex justify-content-center my-2">
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={R} fill="none" stroke="var(--surface)" strokeWidth="9" />
          <circle cx="65" cy="65" r={R} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={offset} transform="rotate(-90 65 65)"
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }} />
          <text x="65" y="60" textAnchor="middle" style={{ fontFamily: 'Syne,sans-serif', fontSize: 26, fontWeight: 700, fill: 'var(--text)' }}>{anim}</text>
          <text x="65" y="76" textAnchor="middle" style={{ fontSize: 10, fill: 'var(--text-muted)' }}>out of 100</text>
        </svg>
      </div>
      <div className="d-flex flex-column gap-2 mb-3">
        {[['Keyword Match', keywordMatch], ['Formatting', formatting], ['Readability', readability]].map(([l, s]) => (
          <div key={l}>
            <div className="d-flex justify-content-between mb-1">
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: s>=80?'#22c55e':s>=60?'#f59e0b':'#ef4444' }}>{s}%</span>
            </div>
            <div style={{ height: 5, background: 'var(--surface)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${s}%`, height: '100%', background: s>=80?'#22c55e':s>=60?'#f59e0b':'#ef4444', borderRadius: 4, transition: 'width 1s ease' }} />
            </div>
          </div>
        ))}
      </div>
      {suggestions?.length > 0 && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>Suggestions</p>
          {suggestions.slice(0,4).map((s,i) => (
            <div key={i} className="d-flex gap-2 mb-1">
              <i className="bi bi-lightbulb-fill mt-1" style={{ color: '#f59e0b', fontSize: 11, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
