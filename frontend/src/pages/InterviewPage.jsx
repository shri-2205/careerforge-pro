import React, { useState } from 'react'
import Sidebar from '../components/ui/Sidebar'
import api from '../services/api'

const CATEGORIES = ['Technical', 'Behavioral', 'Situational', 'Role-Specific']

export default function InterviewPage() {
  const [jd, setJd] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [category, setCategory] = useState('All')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(null)

  const handleGenerate = async () => {
    console.log('Generate clicked',{jd, resumeText})
    if (!jd || !resumeText) { setError('Please provide both resume and job description'); return }
    setLoading(true); setError(''); setQuestions([])
    try {
      console.log('Sending request...')
      const res = await api.post('/ai/interview-questions', { jd, resumeText })
      setQuestions(res.data.questions)
    } catch (e) {
      console.log('Error:', e.response?.status, e.response?.data)
      setError(e.response?.data?.error || 'Generation failed')
    } finally { setLoading(false) }
  }

  const filtered = category === 'All' ? questions : questions.filter(q => q.category === category)
  const categoryColor = c => ({ Technical: '#6366f1', Behavioral: '#22c55e', Situational: '#f59e0b', 'Role-Specific': '#fc5c7d' }[c] || 'var(--accent)')

  return (
    <div className="app-layout gradient-mesh">
      <Sidebar />
      <div className="main-content" style={{ padding: '32px 36px' }}>

        <div className="fade-in" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #6366f1, #22c55e)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-patch-question-fill" style={{ color: '#fff', fontSize: 18 }} />
            </div>
            <div>
              <h4 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, margin: 0 }}>Interview Prep</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>AI-generated questions tailored to your resume & job</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24 }}>
          {/* Left Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
              <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
                <i className="bi bi-file-earmark-person-fill me-2" style={{ color: '#22c55e' }} />Your Resume
              </h6>
              <textarea className="input-modern" rows={7}
                placeholder="Paste your resume highlights or full resume text..."
                value={resumeText} onChange={e => setResumeText(e.target.value)}
                style={{ resize: 'none' }} />
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
              <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
                <i className="bi bi-briefcase-fill me-2" style={{ color: 'var(--accent)' }} />Job Description
              </h6>
              <textarea className="input-modern" rows={7}
                placeholder="Paste the job description here..."
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
                ? <><span className="spinner-border spinner-border-sm" style={{ borderColor: '#fff', borderRightColor: 'transparent' }} />Generating Questions...</>
                : <><i className="bi bi-stars" />Generate Questions</>}
            </button>
          </div>

          {/* Right Output */}
          <div>
            {/* Category filter */}
            {questions.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {['All', ...CATEGORIES].map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    style={{ padding: '6px 16px', borderRadius: 20, border: `1px solid ${category === c ? categoryColor(c) : 'var(--border)'}`, background: category === c ? categoryColor(c) + '20' : 'var(--surface)', color: category === c ? categoryColor(c) : 'var(--text-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {c}
                    <span style={{ marginLeft: 6, background: 'var(--surface)', color: 'var(--text-muted)', fontSize: 10, padding: '1px 6px', borderRadius: 10 }}>
                      {c === 'All' ? questions.length : questions.filter(q => q.category === c).length}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Questions */}
            {!questions.length && !loading ? (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 60, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, background: 'var(--surface)', borderRadius: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <i className="bi bi-patch-question" style={{ fontSize: 28, color: 'var(--text-muted)' }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 6px' }}>No questions yet</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>Fill in your details and generate interview questions</p>
              </div>
            ) : loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1,2,3,4,5].map(i => <div key={i} className="shimmer-box" style={{ height: 72, borderRadius: 16 }} />)}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((q, i) => (
                  <div key={i} style={{ background: 'var(--bg-card)', border: `1px solid ${expanded === i ? categoryColor(q.category) : 'var(--border)'}`, borderRadius: 16, overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
                    onClick={() => setExpanded(expanded === i ? null : i)}>
                    <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <span style={{ background: categoryColor(q.category) + '20', color: categoryColor(q.category), border: `1px solid ${categoryColor(q.category)}40`, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, flexShrink: 0, marginTop: 1 }}>
                        {q.category}
                      </span>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14, flex: 1, lineHeight: 1.5 }}>{q.question}</p>
                      <i className={`bi bi-chevron-${expanded === i ? 'up' : 'down'}`} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
                    </div>
                    {expanded === i && q.tip && (
                      <div style={{ padding: '0 18px 14px 18px', borderTop: `1px solid ${categoryColor(q.category)}30` }}>
                        <div style={{ background: categoryColor(q.category) + '10', border: `1px solid ${categoryColor(q.category)}25`, borderRadius: 10, padding: '10px 14px', marginTop: 10 }}>
                          <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: categoryColor(q.category), textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            <i className="bi bi-lightbulb-fill me-1" />Answer Tip
                          </p>
                          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{q.tip}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
