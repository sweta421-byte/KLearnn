'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useTheme } from '@/context/ThemeContext'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function apiGet(path: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''
  return fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(r => r.ok ? r.json() : null).catch(() => null)
}

interface DashStats {
  studyHours: number
  streak: number
  points: number
  badge: string | null
  rank: number | null
  assignments: number
  doubts: number
  studyRooms: number
}

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const router = useRouter()

  const [stats, setStats] = useState<DashStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState(false)
  const [greeting, setGreeting] = useState('Hello')

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
  }, [user, isLoading, router])

  // Greeting based on time
  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12) setGreeting('Good morning')
    else if (h < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    setStatsError(false)
    try {
      const [rankData, assignmentsData, doubtsData, roomsData] = await Promise.all([
        apiGet('/leaderboard/my-rank'),
        apiGet('/assignments'),
        apiGet('/doubts'),
        apiGet('/study-rooms'),
      ])

      setStats({
        studyHours: rankData?.studyHours ?? 0,
        streak: rankData?.streak ?? 0,
        points: rankData?.points ?? 0,
        badge: rankData?.badge ?? null,
        rank: rankData?.rank ?? null,
        assignments: Array.isArray(assignmentsData) ? assignmentsData.length : 0,
        doubts: Array.isArray(doubtsData) ? doubtsData.length : 0,
        studyRooms: Array.isArray(roomsData) ? roomsData.length : 0,
      })
    } catch {
      setStatsError(true)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) fetchStats()
  }, [user, fetchStats])

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? '#0F0F1A' : '#F8F9FA' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid transparent', borderTopColor: '#6C63FF', borderRightColor: '#EC4899', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: isDark ? '#94A3B8' : '#6B7280', fontSize: '14px' }}>Loading your dashboard...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  const bg = isDark ? '#0F0F1A' : '#F8F9FA'
  const card = isDark ? '#1A1A2E' : 'white'
  const border = isDark ? '#2D2D44' : '#E5E7EB'
  const text = isDark ? '#F1F5F9' : '#111827'
  const muted = isDark ? '#94A3B8' : '#6B7280'
  const cardBg = isDark ? '#13131F' : '#FAFAFA'
  const cardBorder = isDark ? '#2D2D44' : '#F3F4F6'

  const statCards = [
    {
      label: 'Study Hours',
      value: statsLoading ? '—' : `${stats?.studyHours ?? 0}h`,
      detail: stats?.studyHours ? `${stats.studyHours}h logged total` : 'Start studying to log hours',
      icon: '📖',
      color: '#6C63FF',
      live: true,
    },
    {
      label: 'Study Streak',
      value: statsLoading ? '—' : `${stats?.streak ?? 0} days`,
      detail: stats?.streak ? (stats.streak >= 7 ? '🔥 On fire! Keep going!' : 'Keep the momentum!') : 'Start your streak today',
      icon: '🔥',
      color: '#F97316',
      live: true,
    },
    {
      label: 'Assignments',
      value: statsLoading ? '—' : `${stats?.assignments ?? 0}`,
      detail: stats?.assignments ? `${stats.assignments} total assignments` : 'No assignments yet',
      icon: '📋',
      color: '#3B82F6',
      live: true,
    },
    {
      label: 'Points',
      value: statsLoading ? '—' : `${stats?.points ?? 0}`,
      detail: stats?.rank ? `Rank #${stats.rank} on leaderboard` : 'Keep learning to earn points',
      icon: '⭐',
      color: '#F59E0B',
      live: true,
    },
    {
      label: 'Doubts Asked',
      value: statsLoading ? '—' : `${stats?.doubts ?? 0}`,
      detail: 'Questions answered by AI',
      icon: '❓',
      color: '#8B5CF6',
      live: true,
    },
    {
      label: 'Study Rooms',
      value: statsLoading ? '—' : `${stats?.studyRooms ?? 0}`,
      detail: 'Active study rooms',
      icon: '🏠',
      color: '#10B981',
      live: true,
    },
  ]

  const features = [
    { icon: '🤖', title: 'AI Doubt Helper', desc: 'Get AI-powered hints', color: '#8B5CF6', href: '/doubt-helper' },
    { icon: '📚', title: 'Study Rooms', desc: 'Collaborative study', color: '#6366F1', href: '/study-rooms' },
    { icon: '📝', title: 'Notes', desc: 'Share peer notes', color: '#EC4899', href: '/notes' },
    { icon: '👩‍🏫', title: 'Teacher', desc: 'Teacher dashboard', color: '#10B981', href: '/teacher' },
    { icon: '👨‍👩‍👧', title: 'Parent', desc: 'Track progress', color: '#F59E0B', href: '/parent' },
    { icon: '🛡️', title: 'Safety', desc: 'Anonymous reporting', color: '#EF4444', href: '/safety' },
    { icon: '🗂️', title: 'Assignments', desc: 'Submit assignments', color: '#3B82F6', href: '/assignments' },
    { icon: '🎓', title: 'Courses', desc: 'Enroll in courses', color: '#14B8A6', href: '/courses' },
    { icon: '📆', title: 'Calendar', desc: 'Manage schedule', color: '#6C63FF', href: '/calendar' },
    { icon: '📊', title: 'Reports', desc: 'Track progress', color: '#F97316', href: '/reports' },
    { icon: '📎', title: 'Resources', desc: 'Study materials', color: '#84CC16', href: '/resources' },
    { icon: '⏱️', title: 'Focus Timer', desc: 'Pomodoro timer', color: '#06B6D4', href: '/focus' },
    { icon: '🏆', title: 'Achievements', desc: 'View badges', color: '#F59E0B', href: '/achievements' },
    { icon: '🔔', title: 'Notifications', desc: 'Stay updated', color: '#8B5CF6', href: '/notifications' },
    { icon: '🏅', title: 'Leaderboard', desc: 'Top students', color: '#EF4444', href: '/leaderboard' },
    { icon: '📈', title: 'Analytics', desc: 'Learning insights', color: '#10B981', href: '/analytics' },
    { icon: '💬', title: 'Messages', desc: 'Chat with peers', color: '#6366F1', href: '/chat' },
    { icon: '🔍', title: 'Search', desc: 'Find anything', color: '#6C63FF', href: '/search' },
    { icon: '👤', title: 'Profile', desc: 'Your profile', color: '#F97316', href: '/profile' },
    { icon: '⚙️', title: 'Settings', desc: 'App settings', color: '#6B7280', href: '/settings' },
    { icon: '🆘', title: 'Support', desc: 'Get help', color: '#EF4444', href: '/support' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, padding: '24px', transition: 'all 0.3s ease' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .stat-skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Welcome Card */}
        <div style={{
          background: 'linear-gradient(135deg, #6C63FF 0%, #EC4899 100%)',
          borderRadius: '24px', padding: '32px', marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(108,99,255,0.35)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', right: '120px', width: '140px', height: '140px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>✨ Dashboard</p>
            <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'white', margin: 0, lineHeight: 1.2 }}>
              {greeting}, {user?.name?.split(' ')[0] || 'Learner'} 👋
            </h1>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', marginTop: '8px' }}>
              {statsLoading ? 'Loading your stats...' : statsError ? 'Welcome back! Start learning today.' : `You have ${stats?.assignments ?? 0} assignments & ${stats?.studyRooms ?? 0} study rooms waiting.`}
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: 500 }}>
                🔥 {statsLoading ? '...' : `${stats?.streak ?? 0} day streak`}
              </span>
              <span style={{ fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: 500 }}>
                ⭐ {statsLoading ? '...' : `${stats?.points ?? 0} points`}
              </span>
              {stats?.badge && (
                <span style={{ fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: 500 }}>
                  🏅 {stats.badge}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
            <button onClick={fetchStats}
              style={{ padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
              🔄 Refresh
            </button>
            <button onClick={async () => { await logout(); router.push('/login') }}
              style={{ padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
              Logout
            </button>
          </div>
        </div>

        {/* Error banner */}
        {statsError && !statsLoading && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '14px', padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <p style={{ color: '#FCA5A5', fontSize: '14px', margin: 0 }}>⚠️ Could not connect to backend. Showing placeholder data. Make sure the backend is running on port 3001.</p>
            <button onClick={fetchStats} style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px', color: '#FCA5A5', fontSize: '13px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>Retry</button>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {statCards.map(stat => (
            <div key={stat.label}
              style={{
                backgroundColor: card,
                borderRadius: '20px',
                padding: '20px',
                boxShadow: `0 4px 16px ${stat.color}25`,
                borderTop: `4px solid ${stat.color}`,
                border: `1px solid ${border}`,
                borderTopColor: stat.color,
                transition: 'transform 0.2s ease',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Live indicator */}
              <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statsLoading ? '#94A3B8' : statsError ? '#EF4444' : '#10B981', animation: statsLoading ? 'pulse 1.5s ease-in-out infinite' : 'none' }} />
                <span style={{ fontSize: '10px', color: statsLoading ? '#94A3B8' : statsError ? '#EF4444' : '#10B981', fontWeight: 600 }}>{statsLoading ? 'LOADING' : statsError ? 'OFFLINE' : 'LIVE'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: stat.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                  {stat.icon}
                </div>
                <span style={{ fontSize: '13px', color: muted }}>{stat.label}</span>
              </div>

              {statsLoading ? (
                <>
                  <div className="stat-skeleton" style={{ height: '36px', width: '80px', marginBottom: '8px' }} />
                  <div className="stat-skeleton" style={{ height: '14px', width: '120px' }} />
                </>
              ) : (
                <>
                  <p style={{ fontSize: '32px', fontWeight: 700, color: text, margin: 0 }}>{stat.value}</p>
                  <p style={{ fontSize: '13px', color: muted, marginTop: '4px' }}>{stat.detail}</p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* All Features Grid */}
        <div style={{ backgroundColor: card, borderRadius: '24px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: `1px solid ${border}` }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: text, marginBottom: '20px' }}>🚀 All Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
            {features.map(feature => (
              <div key={feature.title} onClick={() => router.push(feature.href)}
                style={{ padding: '16px', borderRadius: '16px', cursor: 'pointer', border: `1px solid ${cardBorder}`, backgroundColor: cardBg, transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '8px' }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = feature.color + '20'
                  e.currentTarget.style.borderColor = feature.color + '40'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = cardBg
                  e.currentTarget.style.borderColor = cardBorder
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: feature.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                  {feature.icon}
                </div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: text, margin: 0 }}>{feature.title}</p>
                <p style={{ fontSize: '12px', color: muted, margin: 0 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
