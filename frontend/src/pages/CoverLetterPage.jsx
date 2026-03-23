import React, { useState } from 'react'
import Sidebar from '../components/ui/Sidebar'
import api from '../services/api'

export default function CoverLetterPage() {
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jd, setJd] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [tone, setTone] = useState('professional')
  const [letter, setLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!jobTitle || !company || !jd || !resumeText) {
      setError('Please fill all fields'); return
    }
    setLoading(true); setError(''); setLetter('')
    try {
      const res = await api.post('/ai/cover-letter', { jobTitle, company, jd, resumeText, tone })
      setLetter(res.data.letter)
    } catch (e) {
      setError(e.response?.data?.error || 'Generation failed. Please try again.')
    } finally { setLoading(false) }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(letter)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([letter], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `Cover_Letter_${company.replace(/\s+/g, '_')}.txt`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="app-layout gradient-mesh">
      <Sidebar />
      <div className="main-content" style={{ padding: '32px 36px' }}>

        {/* Header */}
        <div className="fade-in" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #fc5c7d, #6a82fb)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-envelope-fill" style={{ color: '#fff', fontSize: 18 }} />
            </div>
            <div>
              <h4 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Cover Letter Generator</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>AI-powered personalized cover letters in seconds</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Left — Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Job Details */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
              <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: 18, fontSize: 15 }}>
                <i className="bi bi-briefcase-fill me-2" style={{ color: 'var(--accent)' }} />Job Details
              </h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label className="form-label-modern">Job Title</label>
                  <input className="input-modern" placeholder="e.g. Senior Software Engineer"
                    value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
                </div>
                <div>
                  <label className="form-label-modern">Company Name</label>
                  <input className="input-modern" placeholder="e.g. Google, Microsoft, Startup XYZ"
                    value={company} onChange={e => setCompany(e.target.value)} />
                </div>
                <div>
                  <label className="form-label-modern">Tone</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[['professional', 'bi-tie', 'Professional'], ['enthusiastic', 'bi-stars', 'Enthusiastic'], ['concise', 'bi-lightning-fill', 'Concise']].map(([t, icon, label]) => (
                      <button key={t} onClick={() => setTone(t)}
                        style={{ flex: 1, padding: '8px 6px', borderRadius: 10, border: `1px solid ${tone === t ? 'var(--accent)' : 'var(--border)'}`, background: tone === t ? 'var(--accent-glow)' : 'var(--surface)', color: tone === t ? 'var(--accent)' : 'var(--text-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                        <i className={`bi ${icon}`} />{label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Text */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
              <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: 4, fontSize: 15 }}>
                <i className="bi bi-file-earmark-person-fill me-2" style={{ color: '#22c55e' }} />Your Resume Summary
              </h6>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Paste key highlights from your resume</p>
              <textarea className="input-modern" rows={6}
                placeholder="e.g. 5 years React/Node.js experience, built apps for 50K+ users, led team of 4 engineers, B.E. CS from Anna University..."
                value={resumeText} onChange={e => setResumeText(e.target.value)}
                style={{ resize: 'none' }} />
            </div>

            {/* JD */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
              <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: 4, fontSize: 15 }}>
                <i className="bi bi-card-text me-2" style={{ color: '#f59e0b' }} />Job Description
              </h6>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Paste the job description</p>
              <textarea className="input-modern" rows={6}
                placeholder="Paste the full job description here..."
                value={jd} onChange={e => setJd(e.target.value)}
                style={{ resize: 'none' }} />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '10px 14px', color: '#ef4444', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="bi bi-exclamation-circle-fill" />{error}
              </div>
            )}

            <button onClick={handleGenerate} disabled={loading} className="btn-glow"
              style={{ padding: '13px', fontSize: 15, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              {loading
                ? <><span className="spinner-border spinner-border-sm" style={{ borderColor: '#fff', borderRightColor: 'transparent' }} />Generating Cover Letter...</>
                : <><i className="bi bi-stars" />Generate Cover Letter</>}
            </button>
          </div>

          {/* Right — Output */}
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, margin: 0, fontSize: 15 }}>
                  <i className="bi bi-file-earmark-text-fill me-2" style={{ color: 'var(--accent)' }} />Generated Letter
                </h6>
                {letter && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleCopy} className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <i className={`bi bi-${copied ? 'check-lg' : 'clipboard'}`} />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={handleDownload} className="btn-glow" style={{ padding: '6px 14px', fontSize: 12, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <i className="bi bi-download" />Download
                    </button>
                  </div>
                )}
              </div>

              {!letter && !loading ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <div style={{ width: 72, height: 72, background: 'var(--surface)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                    <i className="bi bi-envelope-paper" style={{ fontSize: 28, color: 'var(--text-muted)' }} />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>Your cover letter will appear here</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', margin: 0 }}>Fill in the details on the left and click generate</p>
                </div>
              ) : loading ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, padding: '8px 0' }}>
                  {[100, 90, 95, 85, 80, 90].map((w, i) => (
                    <div key={i} className="shimmer-box" style={{ height: 16, width: `${w}%` }} />
                  ))}
                </div>
              ) : (
                <textarea
                  value={letter}
                  onChange={e => setLetter(e.target.value)}
                  style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, color: 'var(--text)', fontSize: 13, lineHeight: 1.8, resize: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif', minHeight: 500 }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
