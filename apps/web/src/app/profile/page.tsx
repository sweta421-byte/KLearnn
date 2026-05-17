'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({ notes: 0, doubts: 0, studyHours: 0, assignments: 0 })
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''

  useEffect(() => {
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (userData) setUser(JSON.parse(userData))
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [notes, doubts, reports] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/my`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/doubts`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/my`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      ])
      setStats({
        notes: Array.isArray(notes) ? notes.length : 0,
        doubts: Array.isArray(doubts) ? doubts.length : 0,
        studyHours: Array.isArray(reports) ? reports.reduce((acc: number, r: any) => acc + (r.duration || 0), 0) : 0,
        assignments: 0,
      })
    } catch {}
  }

  const badges = [
    { icon: '🎯', label: 'First Doubt', unlocked: stats.doubts > 0 },
    { icon: '📝', label: 'Note Creator', unlocked: stats.notes > 0 },
    { icon: '🔥', label: 'Study Streak', unlocked: stats.studyHours > 0 },
    { icon: '🤝', label: 'Team Player', unlocked: true },
    { icon: '🌟', label: 'Top Learner', unlocked: false },
    { icon: '👑', label: 'Legend', unlocked: false },
  ]

  if (!user) return (
    <div style={{ padding: '24px', color: '#6B7280', textAlign: 'center', marginTop: '80px' }}>
      Loading...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', padding: '24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ marginBottom: '24px' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
            ← Back to Dashboard
          </button>
        </div>

        {/* Profile Header */}
        <div style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', borderRadius: '24px', padding: '32px', marginBottom: '24px', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '88px', height: '88px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 700, flexShrink: 0 }}>
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>{user?.name || 'User'}</h1>
              <p style={{ fontSize: '14px', opacity: 0.85, marginTop: '4px' }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
                  {user?.role || 'Student'}
                </span>
                <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
                  🌱 Beginner
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '28px' }}>
            {[
              { label: 'Notes', value: stats.notes, icon: '📝' },
              { label: 'Doubts', value: stats.doubts, icon: '❓' },
              { label: 'Study Mins', value: stats.studyHours, icon: '⏱️' },
              { label: 'Assignments', value: stats.assignments, icon: '📋' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center', padding: '12px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <p style={{ fontSize: '20px', marginBottom: '4px' }}>{stat.icon}</p>
                <p style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>{stat.value}</p>
                <p style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[
            { value: 'overview', label: '📊 Overview' },
            { value: 'activity', label: '📅 Activity' },
            { value: 'badges', label: '🏆 Badges' },
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

        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { title: 'Account Info', items: [
                { label: 'Full Name', value: user?.name || 'N/A' },
                { label: 'Email', value: user?.email || 'N/A' },
                { label: 'Role', value: user?.role || 'Student' },
                { label: 'Member Since', value: 'May 2026' },
              ]},
              { title: 'Learning Stats', items: [
                { label: 'Total Notes', value: `${stats.notes} notes` },
                { label: 'Doubts Asked', value: `${stats.doubts} doubts` },
                { label: 'Study Time', value: `${stats.studyHours} mins` },
                { label: 'Current Level', value: '🌱 Beginner' },
              ]},
            ].map(section => (
              <div key={section.title} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>{section.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {section.items.map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                      <span style={{ fontSize: '13px', color: '#6B7280' }}>{item.label}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', gridColumn: '1 / -1' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Quick Actions</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: '⚙️ Edit Profile', href: '/settings' },
                  { label: '📊 View Reports', href: '/reports' },
                  { label: '🏆 Achievements', href: '/achievements' },
                  { label: '🏅 Leaderboard', href: '/leaderboard' },
                ].map(action => (
                  <button key={action.label} onClick={() => router.push(action.href)}
                    style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '📝', text: 'Created a new note', time: '2 hours ago', color: '#3B82F6' },
                { icon: '❓', text: 'Asked a doubt in Math', time: '5 hours ago', color: '#8B5CF6' },
                { icon: '📚', text: 'Joined Study Room', time: '1 day ago', color: '#10B981' },
                { icon: '🏆', text: 'Earned "First Step" badge', time: '2 days ago', color: '#F59E0B' },
                { icon: '📋', text: 'Submitted assignment', time: '3 days ago', color: '#EF4444' },
              ].map((activity, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', borderRadius: '12px', backgroundColor: '#F9FAFB' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: activity.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                    {activity.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827', margin: 0 }}>{activity.text}</p>
                    <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>Your Badges</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
              {badges.map(badge => (
                <div key={badge.label} style={{
                  textAlign: 'center', padding: '20px 12px', borderRadius: '16px',
                  backgroundColor: badge.unlocked ? '#6C63FF10' : '#F9FAFB',
                  border: `2px solid ${badge.unlocked ? '#6C63FF40' : '#F3F4F6'}`,
                  opacity: badge.unlocked ? 1 : 0.5,
                }}>
                  <p style={{ fontSize: '36px', marginBottom: '8px' }}>{badge.unlocked ? badge.icon : '🔒'}</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: badge.unlocked ? '#111827' : '#9CA3AF' }}>{badge.label}</p>
                  {badge.unlocked && <p style={{ fontSize: '11px', color: '#6C63FF', fontWeight: 600, marginTop: '4px' }}>Unlocked!</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}