'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useTheme } from '@/context/ThemeContext'

export default function DoubtHelperPage() {
  const [question, setQuestion] = useState('')
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentDoubt, setCurrentDoubt] = useState<any>(null)
  const [error, setError] = useState('')
  const { user, isLoading: authLoading } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const router = useRouter()

  const bg = isDark ? '#0F0F1A' : '#F8F9FA'
  const card = isDark ? '#1A1A2E' : 'white'
  const border = isDark ? '#2D2D44' : '#E5E7EB'
  const text = isDark ? '#F1F5F9' : '#111827'
  const muted = isDark ? '#94A3B8' : '#6B7280'
  const inputBg = isDark ? '#0F0F1A' : 'white'

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  const subjects = ['Math', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Other']
  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'College', 'Other']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || !subject || !grade) { setError('Please fill in all fields'); return }
    setIsLoading(true); setError(''); setCurrentDoubt(null)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) { setError('Please login first'); return }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doubts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ question, subject, grade }),
      })
      if (!response.ok) {
        if (response.status === 401) setError('Authentication failed. Please login again.')
        else if (response.status === 500) setError('Server error. Please try again later.')
        else setError('Failed to submit doubt')
        return
      }
      const doubt = await response.json()
      setCurrentDoubt(doubt)
      setQuestion('')
    } catch (err: any) {
      setError(err.message || 'Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const selectStyle = {
    width: '100%', padding: '12px', border: `1px solid ${border}`,
    borderRadius: '10px', fontSize: '14px',
    backgroundColor: inputBg, color: text,
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, padding: '24px', transition: 'all 0.3s ease' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ color: muted, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
            ← Back to Dashboard
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: '#10B98120', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
              🤔
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: text, margin: 0 }}>AI Doubt Helper</h1>
              <p style={{ color: muted, marginTop: '4px' }}>Get helpful hints and guidance for your learning questions</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* Ask Form */}
          <div style={{ backgroundColor: card, borderRadius: '20px', padding: '28px', border: `1px solid ${border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: text, marginBottom: '20px' }}>Ask Your Question</h2>
            {error && (
              <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: muted, marginBottom: '6px', display: 'block' }}>Subject</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} required style={selectStyle}>
                  <option value="">Select a subject</option>
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: muted, marginBottom: '6px', display: 'block' }}>Grade Level</label>
                <select value={grade} onChange={(e) => setGrade(e.target.value)} required style={selectStyle}>
                  <option value="">Select your grade</option>
                  {grades.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: muted, marginBottom: '6px', display: 'block' }}>Your Question</label>
                <textarea value={question} onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Describe your doubt or question here..." rows={6} required
                  style={{ width: '100%', padding: '12px', border: `1px solid ${border}`, borderRadius: '10px', fontSize: '14px', resize: 'none', backgroundColor: inputBg, color: text, boxSizing: 'border-box' }} />
              </div>
              <button type="submit" disabled={isLoading}
                style={{ padding: '14px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, fontSize: '15px' }}>
                {isLoading ? 'Getting AI Hint...' : '✨ Get AI Hint'}
              </button>
            </form>
          </div>

          {/* AI Response */}
          <div style={{ backgroundColor: card, borderRadius: '20px', padding: '28px', border: `1px solid ${border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: text, marginBottom: '20px' }}>💡 AI Hint</h2>
            {isLoading && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🤖</div>
                <p style={{ color: muted }}>AI is thinking...</p>
              </div>
            )}
            {currentDoubt && !isLoading && (
              <div>
                <div style={{ padding: '12px', backgroundColor: isDark ? '#2D2D44' : '#F3F4F6', borderRadius: '10px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: text }}>{currentDoubt.question}</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#10B98115', border: '1px solid #10B98130', borderRadius: '12px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#10B981', marginBottom: '8px' }}>🤖 AI Hint</p>
                  <p style={{ color: text, lineHeight: 1.7, fontSize: '14px' }}>{currentDoubt.aiResponse}</p>
                </div>
              </div>
            )}
            {!currentDoubt && !isLoading && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💡</div>
                <p style={{ color: muted, fontSize: '15px' }}>Submit a question to get AI-powered hints!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}