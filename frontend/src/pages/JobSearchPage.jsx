import React, { useState } from 'react'
import Sidebar from '../components/ui/Sidebar'

const SAMPLE_JOBS = [
  { id: 1, title: 'Senior React Developer', company: 'TechCorp India', location: 'Bangalore, Karnataka', type: 'Full-time', salary: '₹18-25 LPA', posted: '2 days ago', logo: 'T', color: '#6366f1', skills: ['React', 'Node.js', 'AWS'], match: 92 },
  { id: 2, title: 'Full Stack Engineer', company: 'StartupXYZ', location: 'Chennai, Tamil Nadu', type: 'Full-time', salary: '₹12-18 LPA', posted: '1 day ago', logo: 'S', color: '#22c55e', skills: ['React', 'MongoDB', 'Express'], match: 87 },
  { id: 3, title: 'Frontend Developer', company: 'Infosys', location: 'Hyderabad (Remote)', type: 'Hybrid', salary: '₹8-14 LPA', posted: '3 days ago', logo: 'I', color: '#f59e0b', skills: ['React', 'TypeScript', 'CSS'], match: 78 },
  { id: 4, title: 'MERN Stack Developer', company: 'Wipro Digital', location: 'Mumbai, Maharashtra', type: 'Full-time', salary: '₹10-16 LPA', posted: '5 days ago', logo: 'W', color: '#fc5c7d', skills: ['MongoDB', 'Express', 'React', 'Node.js'], match: 95 },
  { id: 5, title: 'Backend Node.js Engineer', company: 'Zoho Corp', location: 'Chennai, Tamil Nadu', type: 'Full-time', salary: '₹15-22 LPA', posted: '1 week ago', logo: 'Z', color: '#06b6d4', skills: ['Node.js', 'PostgreSQL', 'Docker'], match: 71 },
  { id: 6, title: 'Cloud Solutions Architect', company: 'Amazon India', location: 'Bangalore (Hybrid)', type: 'Hybrid', salary: '₹30-45 LPA', posted: '4 days ago', logo: 'A', color: '#f97316', skills: ['AWS', 'Kubernetes', 'Terraform'], match: 65 },
]

export default function JobSearchPage() {
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [saved, setSaved] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)

  const filtered = SAMPLE_JOBS.filter(j => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()) || j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchLocation = !locationFilter || j.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchType = typeFilter === 'All' || j.type === typeFilter
    return matchSearch && matchLocation && matchType
  }).sort((a, b) => b.match - a.match)

  const toggleSave = (id) => setSaved(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  const scoreColor = s => s >= 85 ? '#22c55e' : s >= 70 ? '#f59e0b' : '#ef4444'

  return (
    <div className="app-layout gradient-mesh">
      <Sidebar />
      <div className="main-content" style={{ padding: '32px 36px' }}>

        {/* Header */}
        <div className="fade-in" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #f97316, #fc5c7d)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-search-heart-fill" style={{ color: '#fff', fontSize: 18 }} />
            </div>
            <div>
              <h4 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, margin: 0 }}>Job Search</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>Find jobs matching your optimized resume</p>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <i className="bi bi-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 15 }} />
              <input className="input-modern" placeholder="Search jobs, companies, skills..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 40 }} />
            </div>
            <div style={{ position: 'relative', width: 220 }}>
              <i className="bi bi-geo-alt-fill" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 15 }} />
              <input className="input-modern" placeholder="Location..."
                value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
                style={{ paddingLeft: 40 }} />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['All', 'Full-time', 'Hybrid', 'Remote'].map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  style={{ padding: '8px 14px', borderRadius: 10, border: `1px solid ${typeFilter === t ? 'var(--accent)' : 'var(--border)'}`, background: typeFilter === t ? 'var(--accent-glow)' : 'var(--surface)', color: typeFilter === t ? 'var(--accent)' : 'var(--text-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? '1fr 400px' : '1fr', gap: 20 }}>
          {/* Job List */}
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
              <span style={{ color: 'var(--text)', fontWeight: 700 }}>{filtered.length} jobs</span> found · Sorted by match score
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map((job, i) => (
                <div key={job.id} className="fade-in" style={{ animationDelay: `${i * 0.05}s`, background: 'var(--bg-card)', border: `1px solid ${selectedJob?.id === job.id ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 18, padding: '18px 20px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                  onMouseEnter={e => { if (selectedJob?.id !== job.id) e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { if (selectedJob?.id !== job.id) e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    {/* Logo */}
                    <div style={{ width: 48, height: 48, background: job.color + '20', border: `1px solid ${job.color}40`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: job.color, flexShrink: 0, fontFamily: 'Syne,sans-serif' }}>
                      {job.logo}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{job.title}</p>
                          <p style={{ margin: '2px 0 8px', fontSize: 13, color: 'var(--text-muted)' }}>{job.company} · {job.location}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 12 }}>
                          {/* Match score */}
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, fontFamily: 'Syne,sans-serif', color: scoreColor(job.match), letterSpacing: '-0.5px' }}>{job.match}%</p>
                            <p style={{ margin: 0, fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Match</p>
                          </div>
                          <button onClick={e => { e.stopPropagation(); toggleSave(job.id) }}
                            style={{ background: saved.includes(job.id) ? 'rgba(124,92,252,0.15)' : 'var(--surface)', border: `1px solid ${saved.includes(job.id) ? 'var(--accent)' : 'var(--border)'}`, color: saved.includes(job.id) ? 'var(--accent)' : 'var(--text-muted)', width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', fontSize: 15 }}>
                            <i className={`bi bi-bookmark${saved.includes(job.id) ? '-fill' : ''}`} />
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, background: 'rgba(34,197,94,0.1)', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(34,197,94,0.2)' }}>{job.salary}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--surface)', padding: '3px 10px', borderRadius: 20, border: '1px solid var(--border)' }}>{job.type}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}><i className="bi bi-clock me-1" />{job.posted}</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {job.skills.slice(0, 3).map(s => (
                            <span key={s} style={{ fontSize: 11, color: job.color, background: job.color + '15', border: `1px solid ${job.color}30`, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Detail Panel */}
          {selectedJob && (
            <div style={{ position: 'sticky', top: 20 }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ width: 52, height: 52, background: selectedJob.color + '20', border: `1px solid ${selectedJob.color}40`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, color: selectedJob.color, fontFamily: 'Syne,sans-serif' }}>
                    {selectedJob.logo}
                  </div>
                  <button onClick={() => setSelectedJob(null)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14 }}>
                    <i className="bi bi-x-lg" />
                  </button>
                </div>
                <h5 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, margin: '0 0 4px' }}>{selectedJob.title}</h5>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 16px' }}>{selectedJob.company} · {selectedJob.location}</p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, background: 'rgba(34,197,94,0.1)', padding: '4px 12px', borderRadius: 20 }}>{selectedJob.salary}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--surface)', padding: '4px 12px', borderRadius: 20 }}>{selectedJob.type}</span>
                </div>
                {/* Match score */}
                <div style={{ background: 'var(--surface)', borderRadius: 14, padding: 16, marginBottom: 20, textAlign: 'center' }}>
                  <p style={{ fontSize: 40, fontWeight: 800, fontFamily: 'Syne,sans-serif', color: scoreColor(selectedJob.match), margin: 0, letterSpacing: '-1px' }}>{selectedJob.match}%</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>Resume Match Score</p>
                </div>
                {/* Skills */}
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Required Skills</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                  {selectedJob.skills.map(s => (
                    <span key={s} style={{ fontSize: 12, color: selectedJob.color, background: selectedJob.color + '15', border: `1px solid ${selectedJob.color}30`, padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
                <button className="btn-glow" style={{ width: '100%', padding: '12px', fontSize: 14, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <i className="bi bi-send-fill" /> Apply Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
