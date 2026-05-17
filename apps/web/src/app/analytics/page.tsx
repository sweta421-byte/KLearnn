'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AnalyticsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [doubts, setDoubts] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setIsLoading(true)
    try {
      const [r, d, n] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/my`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/doubts`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/my`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      ])
      setReports(Array.isArray(r) ? r : [])
      setDoubts(Array.isArray(d) ? d : [])
      setNotes(Array.isArray(n) ? n : [])
    } catch {}
    setIsLoading(false)
  }

  const totalStudyMins = reports.reduce((acc, r) => acc + (r.duration || 0), 0)
  const totalStudyHrs = (totalStudyMins / 60).toFixed(1)
  const resolvedDoubts = doubts.filter(d => d.status === 'RESOLVED').length
  const pendingDoubts = doubts.filter(d => d.status === 'PENDING').length

  const subjectMap: Record<string, number> = {}
  reports.forEach(r => {
    subjectMap[r.subject] = (subjectMap[r.subject] || 0) + (r.duration || 0)
  })
  const subjectData = Object.entries(subjectMap).sort((a, b) => b[1] - a[1])

  const doubtSubjectMap: Record<string, number> = {}
  doubts.forEach(d => {
    doubtSubjectMap[d.subject] = (doubtSubjectMap[d.subject] || 0) + 1
  })
  const doubtSubjectData = Object.entries(doubtSubjectMap).sort((a, b) => b[1] - a[1])

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  const studyByDay: Record<string, number> = {}
  last7Days.forEach(day => { studyByDay[day] = 0 })
  reports.forEach(r => {
    const day = new Date(r.date || r.createdAt).toISOString().split('T')[0]
    if (studyByDay[day] !== undefined) studyByDay[day] += (r.duration || 0)
  })

  const maxDay = Math.max(...Object.values(studyByDay), 1)
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const colors = ['#6C63FF', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899']

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', padding: '24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
            ← Back to Dashboard
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>📈 Analytics Dashboard</h1>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>Track your learning progress</p>
        </div>

        {/* Top Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: '⏱️', label: 'Study Hours', value: totalStudyHrs, sub: `${totalStudyMins} mins total`, color: '#6C63FF' },
            { icon: '❓', label: 'Total Doubts', value: doubts.length, sub: `${resolvedDoubts} resolved`, color: '#10B981' },
            { icon: '📝', label: 'Notes Created', value: notes.length, sub: 'All time', color: '#F59E0B' },
            { icon: '🎯', label: 'Subjects', value: subjectData.length, sub: 'Studied', color: '#EF4444' },
          ].map(stat => (
            <div key={stat.label} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: stat.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  {stat.icon}
                </div>
                <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>{stat.label}</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: 0 }}>{stat.value}</p>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[
            { value: 'overview', label: '📊 Overview' },
            { value: 'subjects', label: '📚 Subjects' },
            { value: 'doubts', label: '❓ Doubts' },
          ].map(tab => (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)}
              style={{
                padding: '10px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                backgroundColor: activeTab === tab.value ? '#6C63FF' : 'white',
                color: activeTab === tab.value ? 'white' : '#374151',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#6B7280' }}>Loading analytics...</div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* 7-Day Study Chart */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>📅 Last 7 Days Study Activity</h3>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '140px' }}>
                    {last7Days.map((day, i) => {
                      const val = studyByDay[day] || 0
                      const height = maxDay > 0 ? Math.max((val / maxDay) * 120, val > 0 ? 8 : 4) : 4
                      const date = new Date(day)
                      return (
                        <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10px', color: '#6B7280' }}>{val > 0 ? `${val}m` : ''}</span>
                          <div style={{ width: '100%', height: `${height}px`, backgroundColor: val > 0 ? '#6C63FF' : '#E5E7EB', borderRadius: '6px 6px 0 0', transition: 'height 0.3s' }} />
                          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{dayLabels[date.getDay()]}</span>
                        </div>
                      )
                    })}
                  </div>
                  {totalStudyMins === 0 && (
                    <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '13px', marginTop: '8px' }}>No study sessions logged yet. Add one from Reports!</p>
                  )}
                </div>

                {/* Doubt Status */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>❓ Doubt Status Breakdown</h3>
                  {doubts.length === 0 ? (
                    <p style={{ color: '#9CA3AF', fontSize: '13px' }}>No doubts asked yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { label: 'Resolved', count: resolvedDoubts, color: '#10B981' },
                        { label: 'Pending', count: pendingDoubts, color: '#F59E0B' },
                        { label: 'AI Responded', count: doubts.filter(d => d.status === 'AI_RESPONDED').length, color: '#3B82F6' },
                        { label: 'Teacher Responded', count: doubts.filter(d => d.status === 'TEACHER_RESPONDED').length, color: '#8B5CF6' },
                      ].map(item => (
                        <div key={item.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>{item.label}</span>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{item.count}</span>
                          </div>
                          <div style={{ height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${doubts.length > 0 ? (item.count / doubts.length) * 100 : 0}%`, backgroundColor: item.color, borderRadius: '4px', transition: 'width 0.5s' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Subjects Tab */}
            {activeTab === 'subjects' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>⏱️ Study Time by Subject</h3>
                  {subjectData.length === 0 ? (
                    <p style={{ color: '#9CA3AF', fontSize: '13px' }}>No study sessions logged yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {subjectData.map(([subject, mins], i) => (
                        <div key={subject}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors[i % colors.length] }} />
                              <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{subject}</span>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: colors[i % colors.length] }}>{mins} mins</span>
                          </div>
                          <div style={{ height: '10px', backgroundColor: '#F3F4F6', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(mins / subjectData[0][1]) * 100}%`, backgroundColor: colors[i % colors.length], borderRadius: '5px' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Doubts Tab */}
            {activeTab === 'doubts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>📚 Doubts by Subject</h3>
                  {doubtSubjectData.length === 0 ? (
                    <p style={{ color: '#9CA3AF', fontSize: '13px' }}>No doubts asked yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {doubtSubjectData.map(([subject, count], i) => (
                        <div key={subject}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors[i % colors.length] }} />
                              <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{subject}</span>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: colors[i % colors.length] }}>{count} doubts</span>
                          </div>
                          <div style={{ height: '10px', backgroundColor: '#F3F4F6', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(count / doubtSubjectData[0][1]) * 100}%`, backgroundColor: colors[i % colors.length], borderRadius: '5px' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Doubts List */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>🕐 Recent Doubts</h3>
                  {doubts.slice(0, 5).map((doubt: any) => (
                    <div key={doubt.id} style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#F9FAFB', marginBottom: '10px', border: '1px solid #E5E7EB' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#6C63FF' }}>{doubt.subject}</span>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', backgroundColor: doubt.status === 'RESOLVED' ? '#D1FAE5' : '#FEF3C7', color: doubt.status === 'RESOLVED' ? '#065F46' : '#92400E', fontWeight: 600 }}>
                          {doubt.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: 1.5 }}>{doubt.question.slice(0, 100)}{doubt.question.length > 100 ? '...' : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}