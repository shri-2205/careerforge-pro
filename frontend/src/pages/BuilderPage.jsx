import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import Sidebar from '../components/ui/Sidebar'
import ATSScoreCard from '../components/resume/ATSScoreCard'
import KeywordList from '../components/resume/KeywordList'
import ResumePreview from '../components/resume/ResumePreview'
import { uploadResumeFile, submitResumeText, optimizeResume, getResume, updateResume } from '../services/api'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const SAMPLE_JD = `Senior Full Stack Developer - FinTech

We need a passionate Senior Full Stack Developer to join our team.

Responsibilities:
- Design and develop scalable applications using React.js and Node.js
- Build RESTful APIs and microservices architecture
- Work with Agile/Scrum methodology
- Implement CI/CD pipelines using GitHub Actions and Docker
- Work with AWS (EC2, S3, Lambda)

Requirements:
- 2+ years full-stack development experience
- React.js, Node.js, Express.js, MongoDB
- TypeScript, GraphQL, Docker, Kubernetes
- AWS/GCP cloud knowledge
- Strong communication skills`

export default function BuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [step, setStep] = useState('upload')
  const [resumeId, setResumeId] = useState(id || null)
  const [title, setTitle] = useState('My Resume')
  const [jd, setJd] = useState('')
  const [mode, setMode] = useState('file')
  const [pastedText, setPastedText] = useState('')
  const [keywords, setKeywords] = useState(null)
  const [resumeData, setResumeData] = useState(null)
  const [atsScore, setAtsScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [loadingStage, setLoadingStage] = useState(0)
  const [error, setError] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  useEffect(() => {
    if (id) {
      setLoading(true)
      getResume(id).then(res => {
        const r = res.data
        setResumeId(r._id); setTitle(r.title || 'My Resume')
        if (r.jobDescription) setJd(r.jobDescription)
        if (r.structuredResume?.name) setResumeData(r.structuredResume)
        if (r.atsScore?.overall > 0) setAtsScore(r.atsScore)
        if (r.extractedKeywords?.skills?.length) setKeywords(r.extractedKeywords)
        setStep(r.status === 'optimized' ? 'optimized' : r.status === 'uploaded' ? 'analyze' : 'upload')
      }).catch(() => setError('Could not load resume')).finally(() => setLoading(false))
    }
  }, [id])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    maxFiles: 1, disabled: loading,
    onDrop: async ([file]) => {
      if (!file) return
      setLoading(true); setError(''); setLoadingMsg('Parsing your resume...')
      try {
        const res = await uploadResumeFile(file, title)
        setResumeId(res.data.resumeId); setStep('analyze')
      } catch (e) { setError(e.response?.data?.error || 'Upload failed') }
      finally { setLoading(false); setLoadingMsg('') }
    }
  })

  const handleTextSubmit = async () => {
    if (pastedText.trim().length < 50) return
    setLoading(true); setError(''); setLoadingMsg('Processing resume...')
    try {
      const res = await submitResumeText(pastedText, title)
      setResumeId(res.data.resumeId); setStep('analyze')
    } catch (e) { setError(e.response?.data?.error || 'Failed') }
    finally { setLoading(false); setLoadingMsg('') }
  }

  const handleOptimize = async () => {
    if (!resumeId || jd.trim().length < 50) return
    setLoading(true); setError(''); setLoadingStage(0)
    const stages = ['Extracting keywords...', 'Rewriting resume...', 'Calculating ATS score...']
    setLoadingMsg(stages[0])
    const iv = setInterval(() => {
      setLoadingStage(prev => {
        const next = Math.min(prev + 1, 2)
        setLoadingMsg(stages[next])
        return next
      })
    }, 8000)
    try {
      const res = await optimizeResume(resumeId, jd)
      setKeywords(res.data.keywords); setResumeData(res.data.structuredResume); setAtsScore(res.data.atsScore)
      setStep('optimized')
    } catch (e) { setError(e.response?.data?.error || 'Optimization failed') }
    finally { clearInterval(iv); setLoading(false); setLoadingMsg('') }
  }

  const handleUpdate = async (updated) => {
    setResumeData(updated)
    if (resumeId) { try { await updateResume(resumeId, { structuredResume: updated }) } catch {} }
  }

  const handlePDF = async () => {
    const el = document.getElementById('resume-preview-content')
    if (!el) return
    setPdfLoading(true)
    try {
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#fff', useCORS: true })
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const w = 210, h = w / (canvas.width / canvas.height)
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, h)
      pdf.save(`${resumeData?.name || 'Resume'}_Optimized.pdf`)
    } catch { alert('PDF generation failed') }
    finally { setPdfLoading(false) }
  }

  const reset = () => {
    setStep('upload'); setResumeId(null); setJd(''); setPastedText('')
    setKeywords(null); setResumeData(null); setAtsScore(null); setError('')
    navigate('/builder')
  }

  const STEPS = [
    { key: 'upload', label: 'Upload Resume', icon: 'bi-file-earmark-arrow-up-fill' },
    { key: 'analyze', label: 'Add Job Description', icon: 'bi-briefcase-fill' },
    { key: 'optimized', label: 'View Results', icon: 'bi-stars' }
  ]
  const stepIdx = STEPS.findIndex(s => s.key === step)

  return (
    <div className="app-layout gradient-mesh">
      <Sidebar />

      {loading && (
        <div className="overlay">
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '40px 48px', textAlign: 'center', maxWidth: 360, width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
            <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px var(--accent-glow)', animation: 'pulse-glow 2s infinite' }}>
              <i className="bi bi-stars" style={{ color: '#fff', fontSize: 30 }} />
            </div>
            <h5 style={{ fontFamily: "'Cabinet Grotesk','Syne',sans-serif", fontWeight: 800, margin: '0 0 8px', fontSize: 20 }}>AI is Working</h5>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 20px', minHeight: 24 }}>{loadingMsg}</p>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
              {['Keywords', 'Rewrite', 'Score'].map((s, i) => (
                <div key={s} style={{ flex: 1, padding: '6px 0', borderRadius: 8, background: loadingStage >= i ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--surface)', border: `1px solid ${loadingStage >= i ? 'var(--accent)' : 'var(--border)'}`, fontSize: 11, fontWeight: 600, color: loadingStage >= i ? '#fff' : 'var(--text-muted)', transition: 'all 0.3s', textAlign: 'center' }}>
                  {loadingStage > i ? '✓' : loadingStage === i ? '...' : ''} {s}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Usually 15–30 seconds</p>
          </div>
        </div>
      )}

      <div className="main-content" style={{ padding: '32px 36px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transition: 'all 0.5s ease' }}>
          <div>
            <h4 style={{ fontFamily: "'Cabinet Grotesk','Syne',sans-serif", fontWeight: 800, margin: 0, fontSize: 24, letterSpacing: '-0.5px' }}>Resume Builder</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '4px 0 0' }}>Upload → Add JD → <span style={{ color: 'var(--accent)', fontWeight: 600 }}>AI Optimize</span> → Download PDF</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {step !== 'upload' && (
              <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                <i className="bi bi-arrow-counterclockwise" /> Start Over
              </button>
            )}
            {step === 'optimized' && (
              <button onClick={handlePDF} disabled={pdfLoading} className="btn-glow" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', fontSize: 14, borderRadius: 12 }}>
                {pdfLoading ? <span className="spinner-border spinner-border-sm" style={{ borderColor: '#fff', borderRightColor: 'transparent' }} /> : <i className="bi bi-download" />}
                Download PDF
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 20px', gap: 8 }}>
          {STEPS.map(({ key, label, icon }, i) => {
            const done = stepIdx > i, active = step === key
            return (
              <React.Fragment key={key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, background: done ? '#22c55e' : active ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--surface)', color: done || active ? '#fff' : 'var(--text-muted)', border: `2px solid ${done ? '#22c55e' : active ? 'var(--accent)' : 'var(--border)'}`, boxShadow: active ? '0 4px 16px var(--accent-glow)' : 'none', transition: 'all 0.3s' }}>
                    {done ? <i className="bi bi-check-lg" style={{ fontSize: 14 }} /> : <i className={`bi ${icon}`} style={{ fontSize: 13 }} />}
                  </div>
                  <div className="d-none d-sm-block">
                    <p style={{ margin: 0, fontSize: 13, fontWeight: active ? 700 : 500, color: active ? 'var(--text)' : done ? '#22c55e' : 'var(--text-muted)' }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Step {i + 1}</p>
                  </div>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 2, background: done ? '#22c55e' : 'var(--border)', borderRadius: 2, minWidth: 20, transition: 'background 0.5s' }} />}
              </React.Fragment>
            )
          })}
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, color: '#ef4444', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="bi bi-exclamation-circle-fill" />{error}
          </div>
        )}

        {step === 'upload' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'all 0.5s ease 0.1s' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
              <h6 style={{ fontFamily: "'Cabinet Grotesk','Syne',sans-serif", fontWeight: 700, marginBottom: 4, fontSize: 16 }}>
                <i className="bi bi-file-earmark-person-fill me-2" style={{ color: 'var(--accent)' }} />Upload Your Resume
              </h6>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>PDF, TXT, or paste your resume text</p>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>Resume Title</label>
                <input className="input-modern" placeholder="e.g. Software Engineer Resume" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 6, padding: 6, background: 'var(--surface)', borderRadius: 14, marginBottom: 20 }}>
                {[['file', 'bi-upload', 'Upload File'], ['text', 'bi-type', 'Paste Text']].map(([m, ico, lbl]) => (
                  <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', background: mode === m ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'transparent', color: mode === m ? '#fff' : 'var(--text-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <i className={`bi ${ico}`} />{lbl}
                  </button>
                ))}
              </div>
              <div style={{ background: 'var(--surface)', borderRadius: 12, padding: 14, border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <i className="bi bi-lightbulb-fill" />Tips for best results
                </p>
                {['Include all work experience with bullet points', 'Add skills, education, and certifications', 'More detail = better AI optimization'].map(t => (
                  <p key={t} style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="bi bi-check-circle-fill" style={{ color: '#22c55e', fontSize: 11 }} />{t}
                  </p>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column' }}>
              {mode === 'file' ? (
                <div {...getRootProps()} style={{ flex: 1, border: `2px dashed ${isDragActive ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', cursor: 'pointer', background: isDragActive ? 'var(--accent-glow)' : 'var(--surface)', transition: 'all 0.2s', minHeight: 280 }}>
                  <input {...getInputProps()} />
                  <div style={{ width: 72, height: 72, background: isDragActive ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--bg-card)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, border: '2px solid var(--border)', boxShadow: isDragActive ? '0 8px 32px var(--accent-glow)' : 'none', transition: 'all 0.3s' }}>
                    <i className="bi bi-cloud-arrow-up-fill" style={{ fontSize: 30, color: isDragActive ? '#fff' : 'var(--accent)' }} />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 6px', fontFamily: "'Cabinet Grotesk',sans-serif" }}>{isDragActive ? '🎯 Drop it here!' : 'Drag & drop your resume'}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 16px' }}>PDF or TXT · Max 10MB</p>
                  <span style={{ fontSize: 12, padding: '6px 16px', borderRadius: 20, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>or click to browse files</span>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <textarea className="input-modern" rows={11}
                    placeholder={"Paste your full resume here...\n\nJohn Doe\njohn@email.com | +91 00000\n\nSUMMARY\nSoftware engineer with 2 years...\n\nEXPERIENCE\nSoftware Engineer at Company (2022-Present)\n• Built React applications..."}
                    value={pastedText} onChange={e => setPastedText(e.target.value)}
                    style={{ fontFamily: 'monospace', fontSize: 12, resize: 'none', flex: 1 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pastedText.split(/\s+/).filter(Boolean).length} words</span>
                    <button onClick={handleTextSubmit} disabled={pastedText.trim().length < 50} className="btn-glow" style={{ padding: '9px 20px', fontSize: 13, borderRadius: 10 }}>
                      Use This Resume →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'analyze' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, opacity: visible ? 1 : 0, transition: 'all 0.4s ease' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, background: 'rgba(34,197,94,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(34,197,94,0.3)', flexShrink: 0 }}>
                  <i className="bi bi-check-lg" style={{ color: '#22c55e', fontSize: 22 }} />
                </div>
                <div>
                  <h6 style={{ fontFamily: "'Cabinet Grotesk','Syne',sans-serif", fontWeight: 700, margin: 0 }}>Resume Uploaded! ✅</h6>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>Now paste the job description</p>
                </div>
              </div>
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
                <p style={{ fontSize: 13, color: '#22c55e', margin: 0, lineHeight: 1.6 }}>
                  <i className="bi bi-info-circle-fill me-2" />Resume parsed and saved. Add a job description to begin AI optimization.
                </p>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>What AI will do:</p>
                {[
                  { icon: 'bi-search', text: 'Extract keywords from JD', color: 'var(--accent)' },
                  { icon: 'bi-pencil-fill', text: 'Rewrite resume bullets', color: '#fc5c7d' },
                  { icon: 'bi-bar-chart-fill', text: 'Calculate ATS score', color: '#f59e0b' },
                  { icon: 'bi-file-earmark-pdf-fill', text: 'Generate optimized PDF', color: '#22c55e' },
                ].map(({ icon, text, color }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, background: color + '18', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${color}30` }}>
                      <i className={`bi ${icon}`} style={{ color, fontSize: 13 }} />
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{text}</span>
                  </div>
                ))}
              </div>
              <button onClick={reset} style={{ fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0, marginTop: 8 }}>
                Upload a different resume
              </button>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h6 style={{ fontFamily: "'Cabinet Grotesk','Syne',sans-serif", fontWeight: 700, margin: 0, fontSize: 16 }}>
                  <i className="bi bi-briefcase-fill me-2" style={{ color: '#fc5c7d' }} />Job Description
                </h6>
                <button onClick={() => setJd(SAMPLE_JD)} style={{ fontSize: 12, color: 'var(--accent)', background: 'var(--accent-glow)', border: '1px solid rgba(124,92,252,0.3)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <i className="bi bi-stars" />Sample JD
                </button>
              </div>
              <textarea className="input-modern" rows={14}
                placeholder="Paste the full job description here..."
                value={jd} onChange={e => setJd(e.target.value)}
                style={{ fontSize: 13, lineHeight: 1.7, resize: 'none' }} />
              <div style={{ marginTop: 10 }}>
                <span style={{ fontSize: 12, color: jd.trim().length >= 50 ? '#22c55e' : 'var(--text-muted)' }}>
                  {jd.trim().length >= 50 ? <><i className="bi bi-check-circle-fill me-1" />Good length</> : `${jd.split(/\s+/).filter(Boolean).length} words`}
                </span>
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button onClick={handleOptimize} disabled={loading || jd.trim().length < 50} className="btn-glow"
                style={{ width: '100%', padding: '16px', fontSize: 17, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <i className="bi bi-stars" style={{ fontSize: 20 }} />
                Optimize My Resume with AI
                <i className="bi bi-arrow-right" />
              </button>
            </div>
          </div>
        )}

        {step === 'optimized' && (
          <div style={{ opacity: visible ? 1 : 0, transition: 'all 0.4s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, marginBottom: 24 }}>
              <ATSScoreCard atsScore={atsScore} />
              <KeywordList keywords={keywords} atsScore={atsScore} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h5 style={{ fontFamily: "'Cabinet Grotesk','Syne',sans-serif", fontWeight: 800, margin: 0 }}>Optimized Resume</h5>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '3px 0 0' }}>Click any text to edit inline</p>
              </div>
              <button onClick={handlePDF} disabled={pdfLoading} className="btn-glow"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', fontSize: 14, borderRadius: 12 }}>
                {pdfLoading ? <span className="spinner-border spinner-border-sm" style={{ borderColor: '#fff', borderRightColor: 'transparent' }} /> : <i className="bi bi-download" />}
                Download PDF
              </button>
            </div>
            <ResumePreview resume={resumeData} onUpdate={handleUpdate} />
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, marginTop: 24 }}>
              <h6 style={{ fontFamily: "'Cabinet Grotesk','Syne',sans-serif", fontWeight: 700, marginBottom: 4 }}>Try a Different Job Description</h6>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>Optimize for another role without re-uploading</p>
              <textarea className="input-modern" rows={5} value={jd} onChange={e => setJd(e.target.value)} style={{ fontSize: 13, resize: 'none', marginBottom: 12 }} />
              <button onClick={handleOptimize} disabled={loading || jd.trim().length < 50} className="btn-glow"
                style={{ padding: '9px 22px', fontSize: 13, borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <i className="bi bi-arrow-repeat" />Re-Optimize
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}