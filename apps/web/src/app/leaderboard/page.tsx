'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface LeaderboardEntry {
  id: string
  userId: string
  userName: string
  avatar?: string
  points: number
  studyHours: number
  streak: number
  rank: number
  badge: string
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'points' | 'hours' | 'streak'>('points')
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {}

  useEffect(() => {
    fetchLeaderboard()
    fetchMyRank()
  }, [])

  const fetchLeaderboard = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setEntries(Array.isArray(data) ? data : [])
    } catch {
      setEntries([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMyRank = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/my-rank`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data?.userId) setMyRank(data)
    } catch {}
  }

  const joinLeaderboard = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ points: 10, studyHours: 0, streak: 1, badge: '🌱 Beginner' })
      })
      fetchLeaderboard()
      fetchMyRank()
    } catch {}
  }

  const getSorted = () => {
    if (activeTab === 'hours') return [...entries].sort((a, b) => b.studyHours - a.studyHours)
    if (activeTab === 'streak') return [...entries].sort((a, b) => b.streak - a.streak)
    return [...entries].sort((a, b) => b.points - a.points)
  }

  const getMedalColor = (rank: number) => {
    if (rank === 1) return '#FFD700'
    if (rank === 2) return '#C0C0C0'
    if (rank === 3) return '#CD7F32'
    return '#6B7280'
  }

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const sorted = getSorted()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
            ← Back to Dashboard
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>🏅 Leaderboard</h1>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>Top learners of KiwiLearn</p>
        </div>

        {/* My Rank Card */}
        {myRank ? (
          <div style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', borderRadius: '20px', padding: '24px', marginBottom: '24px', color: 'white' }}>
            <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '8px' }}>Your Ranking</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700 }}>
                  {myRank.userName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{myRank.userName}</p>
                  <p style={{ fontSize: '13px', opacity: 0.8, marginTop: '2px' }}>{myRank.badge}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '36px', fontWeight: 800, margin: 0 }}>#{myRank.rank}</p>
                <p style={{ fontSize: '13px', opacity: 0.8 }}>⭐ {myRank.points} pts</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>{myRank.points}</p>
                <p style={{ fontSize: '11px', opacity: 0.8 }}>Points</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>{myRank.studyHours}h</p>
                <p style={{ fontSize: '11px', opacity: 0.8 }}>Study Hours</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>{myRank.streak}</p>
                <p style={{ fontSize: '11px', opacity: 0.8 }}>Streak</p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', marginBottom: '24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '32px' }}>🏅</p>
            <p style={{ fontWeight: 600, color: '#111827', marginBottom: '8px' }}>You're not on the leaderboard yet!</p>
            <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '16px' }}>Join to compete with other learners</p>
            <button onClick={joinLeaderboard}
              style={{ padding: '12px 28px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
              Join Leaderboard 🚀
            </button>
          </div>
        )}

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[
            { key: 'points', label: '⭐ Points' },
            { key: 'hours', label: '⏱️ Study Hours' },
            { key: 'streak', label: '🔥 Streak' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                backgroundColor: activeTab === tab.key ? '#6C63FF' : 'white',
                color: activeTab === tab.key ? 'white' : '#374151',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard List */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#6B7280' }}>Loading...</div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '48px' }}>🏅</p>
            <p style={{ color: '#111827', fontWeight: 600, fontSize: '18px' }}>No entries yet!</p>
            <p style={{ color: '#6B7280' }}>Be the first to join the leaderboard</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sorted.map((entry, index) => (
              <div key={entry.id}
                style={{
                  backgroundColor: 'white', borderRadius: '16px', padding: '16px 20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: entry.userId === user?.id ? '2px solid #6C63FF' : '2px solid transparent',
                  display: 'flex', alignItems: 'center', gap: '16px',
                }}>
                <div style={{ width: '36px', textAlign: 'center', fontSize: index < 3 ? '24px' : '15px', fontWeight: 700, color: getMedalColor(index + 1), flexShrink: 0 }}>
                  {getMedalEmoji(index + 1)}
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#6C63FF20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#6C63FF', flexShrink: 0 }}>
                  {entry.userName?.charAt(0)?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>{entry.userName}</p>
                    {entry.userId === user?.id && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', backgroundColor: '#6C63FF', color: 'white', fontWeight: 600 }}>You</span>}
                  </div>
                  <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{entry.badge}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
                    {activeTab === 'points' ? `⭐ ${entry.points}` : activeTab === 'hours' ? `⏱️ ${entry.studyHours}h` : `🔥 ${entry.streak}`}
                  </p>
                  <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                    {activeTab === 'points' ? 'points' : activeTab === 'hours' ? 'hours' : 'day streak'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}