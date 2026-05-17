'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'

export default function SafetyCenterPage() {
  const [concerns, setConcerns] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''

  const bg = isDark ? '#0F0F1A' : '#F8F9FA'
  const card = isDark ? '#1A1A2E' : 'white'
  const border = isDark ? '#2D2D44' : '#E5E7EB'
  const text = isDark ? '#F1F5F9' : '#111827'
  const muted = isDark ? '#94A3B8' : '#6B7280'
  const inputBg = isDark ? '#0F0F1A' : 'white'

  const categories = [
    '🤝 Bullying', '😔 Mental Health', '⚠️ Safety Concern',
    '📚 Academic Pressure', '👨‍👩‍👧 Family Issue', '🔒 Privacy Issue', '🆘 Emergency', '📝 Other'
  ]

  useEffect(() => { fetchConcerns() }, [])

  const fetchConcerns = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/safety/concerns`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setConcerns(await res.json())
    } catch (err) { console.error(err) }
  }

  const submitConcern = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !category) return
    setIsLoading(true)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/safety/concerns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message, category, isAnonymous })
      })
      setSubmitted(true); setMessage(''); setCategory(''); fetchConcerns()
    } catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }

  const statusColor = (status: string) => {
    if (status === 'RESOLVED') return { bg: '#10B98120', color: '#10B981' }
    if (status === 'IN_PROGRESS') return { bg: '#F59E0B20', color: '#F59E0B' }
    return { bg: '#F9731620', color: '#F97316' }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, padding: '24px', transition: 'all 0.3s ease' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ color: muted, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
            ← Back to Dashboard
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: text, margin: 0 }}>🛡️ Safety Center</h1>
          <p style={{ color: muted, marginTop: '4px' }}>Your safe space — report concerns anonymously</p>
        </div>

        {/* Info Banner */}
        <div style={{ backgroundColor: isDark ? '#1E3A5F' : '#EFF6FF', border: `1px solid ${isDark ? '#2D5986' : '#BFDBFE'}`, borderRadius: '16px', padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '28px' }}>🔒</span>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: text, marginBottom: '6px' }}>Your Privacy is Protected</h2>
            <p style={{ color: muted, fontSize: '14px', lineHeight: 1.6 }}>
              All concerns submitted here are completely confidential. When anonymous mode is on, your identity is never revealed. Our team reviews every concern and takes appropriate action.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

          {/* Submit Form */}
          <div style={{ backgroundColor: card, borderRadius: '20px', padding: '24px', border: `1px solid ${border}` }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: text, marginBottom: '20px' }}>📝 Report a Concern</h2>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: text, marginBottom: '8px' }}>Concern Submitted!</h3>
                <p style={{ color: muted, marginBottom: '24px', fontSize: '14px' }}>Your concern has been received. We will look into it shortly.</p>
                <button onClick={() => setSubmitted(false)}
                  style={{ padding: '12px 24px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={submitConcern} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', color: muted, marginBottom: '8px', display: 'block' }}>Category</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {categories.map((cat) => (
                      <button key={cat} type="button" onClick={() => setCategory(cat)}
                        style={{
                          padding: '8px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 500,
                          cursor: 'pointer', textAlign: 'left', border: `1px solid ${category === cat ? '#6C63FF' : border}`,
                          backgroundColor: category === cat ? '#6C63FF' : isDark ? '#2D2D44' : '#F9FAFB',
                          color: category === cat ? 'white' : text,
                        }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '14px', color: muted, marginBottom: '6px', display: 'block' }}>Your Concern</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your concern here. Be as detailed as possible..." rows={5} required
                    style={{ width: '100%', padding: '12px', border: `1px solid ${border}`, borderRadius: '10px', fontSize: '14px', resize: 'none', backgroundColor: inputBg, color: text, boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', backgroundColor: isDark ? '#2D2D44' : '#F9FAFB', borderRadius: '12px', border: `1px solid ${border}` }}>
                  <button type="button" onClick={() => setIsAnonymous(!isAnonymous)}
                    style={{ width: '44px', height: '24px', borderRadius: '999px', border: 'none', cursor: 'pointer', backgroundColor: isAnonymous ? '#6C63FF' : '#D1D5DB', position: 'relative', flexShrink: 0 }}>
                    <span style={{ position: 'absolute', top: '4px', width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', transition: 'left 0.2s', left: isAnonymous ? '24px' : '4px' }} />
                  </button>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: text, margin: 0 }}>Anonymous Mode</p>
                    <p style={{ fontSize: '12px', color: muted, margin: 0 }}>{isAnonymous ? '🔒 Your identity is hidden' : '👤 Your name will be visible'}</p>
                  </div>
                </div>
                <button type="submit" disabled={isLoading || !category}
                  style={{ padding: '14px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: isLoading || !category ? 'not-allowed' : 'pointer', opacity: isLoading || !category ? 0.6 : 1 }}>
                  {isLoading ? 'Submitting...' : '🛡️ Submit Concern'}
                </button>
              </form>
            )}
          </div>

          {/* Recent Concerns */}
          <div style={{ backgroundColor: card, borderRadius: '20px', padding: '24px', border: `1px solid ${border}` }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: text, marginBottom: '20px' }}>📋 Recent Concerns</h2>
            {concerns.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌟</div>
                <p style={{ color: text, fontWeight: 500 }}>No concerns reported yet.</p>
                <p style={{ color: muted, fontSize: '13px', marginTop: '4px' }}>This is a safe space for you.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
                {concerns.map((concern) => {
                  const sc = statusColor(concern.status)
                  return (
                    <div key={concern.id} style={{ padding: '14px', borderRadius: '12px', backgroundColor: isDark ? '#2D2D44' : '#F9FAFB', border: `1px solid ${border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#6C63FF', backgroundColor: '#6C63FF20', padding: '2px 8px', borderRadius: '20px' }}>{concern.category}</span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {concern.isAnonymous && <span style={{ fontSize: '11px', color: muted }}>🔒 Anonymous</span>}
                          <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', backgroundColor: sc.bg, color: sc.color }}>{concern.status}</span>
                        </div>
                      </div>
                      <p style={{ color: text, fontSize: '13px', lineHeight: 1.5 }}>{concern.message}</p>
                      <p style={{ color: muted, fontSize: '11px', marginTop: '8px' }}>{new Date(concern.createdAt).toLocaleDateString()}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Emergency Resources */}
        <div style={{ backgroundColor: isDark ? '#2D1515' : '#FEF2F2', border: `1px solid ${isDark ? '#7F1D1D' : '#FECACA'}`, borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: text, marginBottom: '16px' }}>🆘 Emergency Resources</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { title: 'iCall Helpline', number: '9152987821', desc: 'Mental health support' },
              { title: 'Childline India', number: '1098', desc: 'Child protection helpline' },
              { title: 'Vandrevala Foundation', number: '1860-2662-345', desc: '24/7 mental health support' },
            ].map((resource) => (
              <div key={resource.title} style={{ backgroundColor: card, borderRadius: '12px', padding: '16px', border: `1px solid ${border}` }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: text, marginBottom: '4px' }}>{resource.title}</h3>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#EF4444', marginBottom: '4px' }}>{resource.number}</p>
                <p style={{ fontSize: '12px', color: muted }}>{resource.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}