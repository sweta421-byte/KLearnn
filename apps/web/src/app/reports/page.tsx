'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Report {
  totalStudyMinutes: number
  totalStudyHours: number
  totalDoubts: number
  totalNotes: number
  totalSubmissions: number
  subjectWise: Record<string, number>
  recentLogs: any[]
}

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLogModal, setShowLogModal] = useState(false)
  const [newLog, setNewLog] = useState({ subject: '', duration: 30, notes: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''

  const subjects = ['Math', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Other']

  const subjectColors: Record<string, string> = {
    'Math': '#3B82F6', 'Science': '#10B981', 'English': '#8B5CF6',
    'History': '#F59E0B', 'Physics': '#EF4444', 'Chemistry': '#EC4899',
    'Biology': '#14B8A6', 'Computer Science': '#6366F1', 'Other': '#6C63FF'
  }

  useEffect(() => { fetchReport() }, [])

  const fetchReport = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setReport(data)
    } catch {
      setError('Failed to load report')
    } finally {
      setIsLoading(false)
    }
  }

  const addStudyLog = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/study-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newLog)
      })
      if (!res.ok) throw new Error('Failed')
      setShowLogModal(false)
      setNewLog({ subject: '', duration: 30, notes: '' })
      setSuccess('Study log added!')
      setTimeout(() => setSuccess(''), 3000)
      fetchReport()
    } catch {
      setError('Failed to add study log')
    }
  }

  const maxSubjectMinutes = report ? Math.max(...Object.values(report.subjectWise), 1) : 1

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <button onClick={() => router.push('/dashboard')}
              style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
              ← Back to Dashboard
            </button>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>📊 Reports</h1>
            <p style={{ color: '#6B7280', marginTop: '4px' }}>Track your learning progress</p>
          </div>
          <button onClick={() => setShowLogModal(true)}
            style={{ padding: '12px 24px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
            + Log Study Session
          </button>
        </div>

        {error && <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '12px', marginBottom: '16px' }}>{error}</div>}
        {success && <div style={{ padding: '12px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '12px', marginBottom: '16px' }}>{success}</div>}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <p style={{ color: '#6B7280' }}>Loading report...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Study Hours', value: `${report?.totalStudyHours || 0}h`, icon: '⏱️', color: '#6C63FF' },
                { label: 'Study Minutes', value: `${report?.totalStudyMinutes || 0}m`, icon: '📚', color: '#10B981' },
                { label: 'Doubts Asked', value: report?.totalDoubts || 0, icon: '❓', color: '#F59E0B' },
                { label: 'Notes Created', value: report?.totalNotes || 0, icon: '📝', color: '#3B82F6' },
                { label: 'Assignments Done', value: report?.totalSubmissions || 0, icon: '✅', color: '#EC4899' },
              ].map((stat) => (
                <div key={stat.label} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: `4px solid ${stat.color}` }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                  <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>{stat.value}</p>
                  <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

              {/* Subject Wise Chart */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>📈 Subject-wise Study Time</h3>
                {Object.keys(report?.subjectWise || {}).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                    <p style={{ fontSize: '32px' }}>📊</p>
                    <p>No study logs yet!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Object.entries(report?.subjectWise || {}).map(([subject, minutes]) => (
                      <div key={subject}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{subject}</span>
                          <span style={{ fontSize: '13px', color: '#6B7280' }}>{minutes}m</span>
                        </div>
                        <div style={{ backgroundColor: '#F3F4F6', borderRadius: '999px', height: '8px' }}>
                          <div style={{
                            backgroundColor: subjectColors[subject] || '#6C63FF',
                            borderRadius: '999px', height: '8px',
                            width: `${(minutes / maxSubjectMinutes) * 100}%`,
                            transition: 'width 0.5s ease'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Study Logs */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>📋 Recent Study Logs</h3>
                {report?.recentLogs?.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                    <p style={{ fontSize: '32px' }}>📋</p>
                    <p>No logs yet! Start studying.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                    {report?.recentLogs?.map((log: any) => (
                      <div key={log.id} style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#F9FAFB', borderLeft: `4px solid ${subjectColors[log.subject] || '#6C63FF'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{log.subject}</span>
                          <span style={{ fontSize: '13px', color: '#6B7280' }}>{log.duration} min</span>
                        </div>
                        {log.notes && <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{log.notes}</p>}
                        <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
                          {new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Study Log Modal */}
      {showLogModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Log Study Session</h2>
            <form onSubmit={addStudyLog} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Subject</label>
                <select value={newLog.subject} onChange={(e) => setNewLog({...newLog, subject: e.target.value})} required
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px' }}>
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Duration (minutes): {newLog.duration}</label>
                <input type="range" min="5" max="240" step="5" value={newLog.duration}
                  onChange={(e) => setNewLog({...newLog, duration: parseInt(e.target.value)})}
                  style={{ width: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280' }}>
                  <span>5 min</span>
                  <span>4 hours</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Notes (optional)</label>
                <textarea value={newLog.notes} onChange={(e) => setNewLog({...newLog, notes: e.target.value})}
                  placeholder="What did you study?" rows={3}
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', resize: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowLogModal(false)}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ flex: 1, padding: '12px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                  Log Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}