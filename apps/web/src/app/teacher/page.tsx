'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useTheme } from '@/context/ThemeContext'

export default function TeacherDashboardPage() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [polls, setPolls] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [doubts, setDoubts] = useState<any[]>([])
  const [pollQuestion, setPollQuestion] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const [replies, setReplies] = useState<Record<string, string>>({})
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''

  const bg = isDark ? '#0F0F1A' : '#F8F9FA'
  const card = isDark ? '#1A1A2E' : 'white'
  const border = isDark ? '#2D2D44' : '#E5E7EB'
  const text = isDark ? '#F1F5F9' : '#111827'
  const muted = isDark ? '#94A3B8' : '#6B7280'
  const inputBg = isDark ? '#0F0F1A' : 'white'

  useEffect(() => {
    fetchPolls(); fetchAnnouncements(); fetchDoubts()
  }, [])

  const fetchPolls = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher/polls`, { headers: { Authorization: `Bearer ${token}` } })
    setPolls(await res.json())
  }
  const fetchAnnouncements = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher/announcements`, { headers: { Authorization: `Bearer ${token}` } })
    setAnnouncements(await res.json())
  }
  const fetchDoubts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher/doubts`, { headers: { Authorization: `Bearer ${token}` } })
    setDoubts(await res.json())
  }
  const sendPoll = async () => {
    if (!pollQuestion.trim()) return
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher/polls`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ question: pollQuestion })
    })
    setPollQuestion(''); fetchPolls(); alert('Poll sent! ✅')
  }
  const sendAnnouncement = async () => {
    if (!announcement.trim()) return
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher/announcements`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message: announcement })
    })
    setAnnouncement(''); fetchAnnouncements(); alert('Announcement sent! ✅')
  }
  const replyToDoubt = async (doubtId: string) => {
    if (!replies[doubtId]?.trim()) return
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher/doubts/${doubtId}/reply`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reply: replies[doubtId] })
    })
    setReplies({...replies, [doubtId]: ''}); fetchDoubts(); alert('Reply sent! ✅')
  }

  const tabs = ['overview', 'doubts', 'polls', 'announcements']

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, padding: '24px', transition: 'all 0.3s ease' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <button onClick={() => router.push('/dashboard')}
              style={{ color: muted, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
              ← Back to Dashboard
            </button>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: text, margin: 0 }}>👩‍🏫 Teacher Dashboard</h1>
            <p style={{ color: muted, marginTop: '4px' }}>Manage your classes and students</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 600, color: text }}>{user?.name}</p>
            <p style={{ fontSize: '13px', color: muted }}>Teacher</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Polls', value: polls.length, icon: '📊', color: '#3B82F6' },
            { label: 'Announcements', value: announcements.length, icon: '📢', color: '#8B5CF6' },
            { label: 'Doubts Pending', value: doubts.filter(d => d.status === 'PENDING' || d.status === 'AI_RESPONDED').length, icon: '❓', color: '#F97316' },
            { label: 'Total Doubts', value: doubts.length, icon: '✅', color: '#10B981' },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: card, borderRadius: '16px', padding: '20px', border: `1px solid ${border}`, borderTop: `4px solid ${stat.color}` }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
              <p style={{ fontSize: '28px', fontWeight: 700, color: text, margin: 0 }}>{stat.value}</p>
              <p style={{ fontSize: '13px', color: muted, marginTop: '4px' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '14px', textTransform: 'capitalize',
                backgroundColor: activeTab === tab ? '#6C63FF' : isDark ? '#2D2D44' : '#F3F4F6',
                color: activeTab === tab ? 'white' : text,
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ backgroundColor: card, borderRadius: '20px', padding: '24px', border: `1px solid ${border}` }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: text, marginBottom: '16px' }}>📊 Quick Poll</h2>
              <input type="text" value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Type your question..."
                style={{ width: '100%', padding: '12px', border: `1px solid ${border}`, borderRadius: '10px', fontSize: '14px', backgroundColor: inputBg, color: text, marginBottom: '12px', boxSizing: 'border-box' }} />
              <button onClick={sendPoll}
                style={{ width: '100%', padding: '12px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                Send Poll 📊
              </button>
            </div>
            <div style={{ backgroundColor: card, borderRadius: '20px', padding: '24px', border: `1px solid ${border}` }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: text, marginBottom: '16px' }}>📢 Announcement</h2>
              <textarea value={announcement} onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Write an announcement..." rows={3}
                style={{ width: '100%', padding: '12px', border: `1px solid ${border}`, borderRadius: '10px', fontSize: '14px', backgroundColor: inputBg, color: text, resize: 'none', marginBottom: '12px', boxSizing: 'border-box' }} />
              <button onClick={sendAnnouncement}
                style={{ width: '100%', padding: '12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                Send Announcement 📢
              </button>
            </div>
          </div>
        )}

        {/* Doubts Tab */}
        {activeTab === 'doubts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {doubts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', color: muted, backgroundColor: card, borderRadius: '16px' }}>No doubts yet!</div>
            ) : doubts.map((doubt) => (
              <div key={doubt.id} style={{ backgroundColor: card, borderRadius: '16px', padding: '24px', border: `1px solid ${border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: text, marginBottom: '4px' }}>{doubt.author?.name}</p>
                    <span style={{ fontSize: '12px', color: '#6C63FF', backgroundColor: '#6C63FF20', padding: '2px 8px', borderRadius: '20px' }}>{doubt.subject}</span>
                  </div>
                  <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', backgroundColor: doubt.status === 'RESOLVED' ? '#10B98120' : '#F9731620', color: doubt.status === 'RESOLVED' ? '#10B981' : '#F97316' }}>
                    {doubt.status}
                  </span>
                </div>
                <p style={{ color: muted, marginBottom: '12px', fontSize: '14px' }}>{doubt.question}</p>
                {doubt.teacherReply && (
                  <p style={{ color: '#10B981', fontSize: '13px', marginBottom: '12px' }}>✅ Your reply: {doubt.teacherReply}</p>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" value={replies[doubt.id] || ''} onChange={(e) => setReplies({...replies, [doubt.id]: e.target.value})}
                    placeholder="Write your reply..."
                    style={{ flex: 1, padding: '10px 14px', border: `1px solid ${border}`, borderRadius: '10px', fontSize: '14px', backgroundColor: inputBg, color: text }} />
                  <button onClick={() => replyToDoubt(doubt.id)}
                    style={{ padding: '10px 20px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Polls Tab */}
        {activeTab === 'polls' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {polls.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', color: muted, backgroundColor: card, borderRadius: '16px' }}>No polls yet! Create one from Overview tab.</div>
            ) : polls.map((poll) => (
              <div key={poll.id} style={{ backgroundColor: card, borderRadius: '16px', padding: '24px', border: `1px solid ${border}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: text, marginBottom: '16px' }}>{poll.question}</h3>
                {[{ label: 'Yes', count: poll.yesCount, color: '#10B981' }, { label: 'No', count: poll.noCount, color: '#EF4444' }].map(opt => (
                  <div key={opt.label} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', color: opt.color, fontWeight: 500 }}>{opt.label}</span>
                      <span style={{ fontSize: '13px', color: muted }}>{opt.count} votes</span>
                    </div>
                    <div style={{ backgroundColor: isDark ? '#2D2D44' : '#F3F4F6', borderRadius: '999px', height: '8px' }}>
                      <div style={{ backgroundColor: opt.color, borderRadius: '999px', height: '8px', width: `${poll.yesCount + poll.noCount > 0 ? (opt.count / (poll.yesCount + poll.noCount)) * 100 : 0}%`, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {announcements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', color: muted, backgroundColor: card, borderRadius: '16px' }}>No announcements yet!</div>
            ) : announcements.map((ann) => (
              <div key={ann.id} style={{ backgroundColor: card, borderRadius: '16px', padding: '24px', border: `1px solid ${border}` }}>
                <p style={{ color: text, lineHeight: 1.6 }}>{ann.message}</p>
                <p style={{ fontSize: '12px', color: muted, marginTop: '12px' }}>{new Date(ann.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}