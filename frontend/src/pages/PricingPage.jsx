import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/ui/Sidebar'
import { useAuth } from '../context/AuthContext'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    desc: 'Perfect for getting started',
    color: '#6b7280',
    features: [
      { text: '1 Resume', included: true },
      { text: 'AI Resume Optimization', included: true },
      { text: 'ATS Score Analysis', included: true },
      { text: 'PDF Export', included: true },
      { text: 'Cover Letter Generator', included: false },
      { text: 'Interview Prep', included: false },
      { text: 'Premium Templates', included: false },
      { text: 'Unlimited Resumes', included: false },
    ],
    cta: 'Current Plan',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹499',
    period: 'per month',
    desc: 'For serious job seekers',
    color: '#7c5cfc',
    features: [
      { text: 'Unlimited Resumes', included: true },
      { text: 'AI Resume Optimization', included: true },
      { text: 'ATS Score Analysis', included: true },
      { text: 'PDF Export', included: true },
      { text: 'Cover Letter Generator', included: true },
      { text: 'Interview Prep', included: true },
      { text: 'Premium Templates (4)', included: true },
      { text: 'Priority Support', included: true },
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
]

export default function PricingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [upgrading, setUpgrading] = useState(false)
  const [upgraded, setUpgraded] = useState(user?.plan === 'pro')

  const handleUpgrade = () => {
    setUpgrading(true)
    // Demo — simulate payment processing
    setTimeout(() => {
      setUpgrading(false)
      setUpgraded(true)
    }, 2000)
  }

  return (
    <div className="app-layout gradient-mesh">
      <Sidebar />
      <div className="main-content" style={{ padding: '32px 36px' }}>

        {/* Header */}
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.25)', borderRadius: 20, padding: '6px 16px', marginBottom: 16, fontSize: 13 }}>
            <i className="bi bi-stars" style={{ color: 'var(--accent)' }} />
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Simple, transparent pricing</span>
          </div>
          <h3 style={{ fontFamily: "'Cabinet Grotesk','Syne',sans-serif", fontWeight: 800, fontSize: 36, letterSpacing: '-1px', margin: '0 0 12px' }}>
            Choose Your Plan
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, margin: 0 }}>
            Start free, upgrade when you need more power
          </p>
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 800, margin: '0 auto 48px' }}>
          {PLANS.map((plan, i) => (
            <div key={plan.id} className="fade-in" style={{
              animationDelay: `${i * 0.1}s`,
              background: 'var(--bg-card)',
              border: `2px solid ${plan.popular ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 24, padding: 32, position: 'relative',
              boxShadow: plan.popular ? '0 20px 60px rgba(124,92,252,0.2)' : 'none',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>

              {/* Popular badge */}
              {plan.popular && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 16px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                  ⭐ Most Popular
                </div>
              )}

              {/* Plan header */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, background: plan.color + '20', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${plan.color}40` }}>
                    <i className={`bi bi-${plan.popular ? 'stars' : 'person-fill'}`} style={{ color: plan.color, fontSize: 18 }} />
                  </div>
                  <div>
                    <h5 style={{ fontFamily: "'Cabinet Grotesk','Syne',sans-serif", fontWeight: 800, margin: 0 }}>{plan.name}</h5>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{plan.desc}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 42, fontWeight: 800, fontFamily: "'Cabinet Grotesk',sans-serif", color: plan.popular ? 'var(--accent)' : 'var(--text)', letterSpacing: '-1px' }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {plan.features.map(({ text, included }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: included ? 'rgba(34,197,94,0.15)' : 'rgba(107,114,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`bi bi-${included ? 'check-lg' : 'x-lg'}`} style={{ color: included ? '#22c55e' : '#6b7280', fontSize: 11 }} />
                    </div>
                    <span style={{ fontSize: 14, color: included ? 'var(--text)' : 'var(--text-muted)', textDecoration: included ? 'none' : 'none' }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              {plan.popular ? (
                upgraded ? (
                  <div style={{ width: '100%', padding: '13px', borderRadius: 14, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: 15, fontWeight: 700, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <i className="bi bi-check-circle-fill" /> Pro Plan Active!
                  </div>
                ) : (
                  <button onClick={handleUpgrade} disabled={upgrading} className="btn-glow"
                    style={{ width: '100%', padding: '13px', fontSize: 15, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {upgrading
                      ? <><span className="spinner-border spinner-border-sm" style={{ borderColor: '#fff', borderRightColor: 'transparent' }} />Processing...</>
                      : <><i className="bi bi-lightning-fill" />{plan.cta}</>}
                  </button>
                )
              ) : (
                <button style={{ width: '100%', padding: '13px', fontSize: 15, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', fontWeight: 600, cursor: 'default' }}>
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Feature comparison */}
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
            <h6 style={{ fontFamily: "'Cabinet Grotesk','Syne',sans-serif", fontWeight: 700, marginBottom: 20, fontSize: 16 }}>
              <i className="bi bi-grid-3x3-gap-fill me-2" style={{ color: 'var(--accent)' }} />
              Why Upgrade to Pro?
            </h6>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {[
                { icon: 'bi-infinity', title: 'Unlimited Resumes', desc: 'Create as many resumes as you need for different roles', color: 'var(--accent)' },
                { icon: 'bi-envelope-fill', title: 'Cover Letter AI', desc: 'Generate personalized cover letters for every application', color: '#fc5c7d' },
                { icon: 'bi-patch-question-fill', title: 'Interview Prep', desc: 'AI-generated questions tailored to your resume and JD', color: '#22c55e' },
                { icon: 'bi-layout-text-window-reverse', title: 'Premium Templates', desc: '4 professional resume templates for any industry', color: '#f59e0b' },
              ].map(({ icon, title, desc, color }) => (
                <div key={title} style={{ display: 'flex', gap: 12, padding: 16, background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
                  <div style={{ width: 38, height: 38, background: color + '18', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${color}30` }}>
                    <i className={`bi ${icon}`} style={{ color, fontSize: 16 }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 3px' }}>{title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 800, margin: '24px auto 0' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
            <h6 style={{ fontFamily: "'Cabinet Grotesk','Syne',sans-serif", fontWeight: 700, marginBottom: 16, fontSize: 16 }}>
              <i className="bi bi-question-circle-fill me-2" style={{ color: 'var(--accent)' }} />FAQ
            </h6>
            {[
              { q: 'Can I cancel anytime?', a: 'Yes! Cancel your subscription anytime with no questions asked.' },
              { q: 'Is my data secure?', a: 'Absolutely. All data is encrypted and stored securely in MongoDB Atlas.' },
              { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI, and net banking.' },
            ].map(({ q, a }) => (
              <div key={q} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <p style={{ fontWeight: 600, fontSize: 14, margin: '0 0 4px' }}>{q}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
