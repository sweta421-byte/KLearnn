'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: string
  points: number
  unlocked: boolean
  progress?: number
  total?: number
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [totalPoints, setTotalPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const router = useRouter()

  const allAchievements: Achievement[] = [
    { id: '1', title: 'First Step', description: 'Log your first study session', icon: '👣', category: 'study', points: 10, unlocked: true },
    { id: '2', title: 'Study Streak', description: 'Study 3 days in a row', icon: '🔥', category: 'study', points: 25, unlocked: true },
    { id: '3', title: 'Marathon Learner', description: 'Study for 10+ hours total', icon: '🏃', category: 'study', points: 50, unlocked: false, progress: 6, total: 10 },
    { id: '4', title: 'Night Owl', description: 'Study after 10 PM', icon: '🦉', category: 'study', points: 15, unlocked: true },
    { id: '5', title: 'Early Bird', description: 'Study before 7 AM', icon: '🐦', category: 'study', points: 15, unlocked: false },
    { id: '6', title: 'Century Club', description: 'Study for 100+ hours total', icon: '💯', category: 'study', points: 200, unlocked: false, progress: 6, total: 100 },
    { id: '7', title: 'Note Taker', description: 'Create your first note', icon: '📝', category: 'notes', points: 10, unlocked: true },
    { id: '8', title: 'Knowledge Sharer', description: 'Get 5 likes on your notes', icon: '❤️', category: 'notes', points: 30, unlocked: false, progress: 2, total: 5 },
    { id: '9', title: 'Prolific Writer', description: 'Create 10 notes', icon: '✍️', category: 'notes', points: 50, unlocked: false, progress: 5, total: 10 },
    { id: '10', title: 'Popular Note', description: 'Get 10 likes on a single note', icon: '⭐', category: 'notes', points: 75, unlocked: false, progress: 2, total: 10 },
    { id: '11', title: 'Curious Mind', description: 'Ask your first doubt', icon: '🤔', category: 'doubts', points: 10, unlocked: true },
    { id: '12', title: 'Question Master', description: 'Ask 10 doubts', icon: '❓', category: 'doubts', points: 40, unlocked: true },
    { id: '13', title: 'Deep Thinker', description: 'Ask 25 doubts', icon: '🧠', category: 'doubts', points: 100, unlocked: false, progress: 18, total: 25 },
    { id: '14', title: 'Team Player', description: 'Join your first study room', icon: '🤝', category: 'social', points: 15, unlocked: true },
    { id: '15', title: 'Room Creator', description: 'Create a study room', icon: '🏠', category: 'social', points: 25, unlocked: false },
    { id: '16', title: 'Social Butterfly', description: 'Join 5 study rooms', icon: '🦋', category: 'social', points: 50, unlocked: false, progress: 1, total: 5 },
    { id: '17', title: 'On Time', description: 'Submit your first assignment', icon: '📋', category: 'assignments', points: 10, unlocked: false },
    { id: '18', title: 'Consistent', description: 'Submit 5 assignments', icon: '✅', category: 'assignments', points: 40, unlocked: false, progress: 0, total: 5 },
    { id: '19', title: 'Pomodoro Pro', description: 'Complete 10 focus sessions', icon: '🍅', category: 'special', points: 60, unlocked: false, progress: 0, total: 10 },
    { id: '20', title: 'Organizer', description: 'Add 5 calendar events', icon: '📅', category: 'special', points: 30, unlocked: false, progress: 0, total: 5 },
    { id: '21', title: 'Resource Hoarder', description: 'Save 10 resources', icon: '📚', category: 'special', points: 40, unlocked: false, progress: 1, total: 10 },
    { id: '22', title: 'Legend', description: 'Earn 500 points', icon: '👑', category: 'special', points: 100, unlocked: false, progress: 0, total: 500 },
  ]

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'study', label: 'Study' },
    { value: 'notes', label: 'Notes' },
    { value: 'doubts', label: 'Doubts' },
    { value: 'social', label: 'Social' },
    { value: 'assignments', label: 'Assignments' },
    { value: 'special', label: 'Special' },
  ]

  useEffect(() => {
    setAchievements(allAchievements)
    const pts = allAchievements.filter(a => a.unlocked).reduce((acc, a) => acc + a.points, 0)
    setTotalPoints(pts)
    setLevel(Math.floor(pts / 50) + 1)
  }, [])

  const filtered = activeCategory === 'all' ? achievements : achievements.filter(a => a.category === activeCategory)
  const unlocked = achievements.filter(a => a.unlocked).length
  const levelProgress = (totalPoints % 50) / 50 * 100
  const nextLevelPoints = level * 50

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', padding: '24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
            Back to Dashboard
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>🏆 Achievements</h1>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>Track your learning milestones</p>
        </div>

        {/* Level Card */}
        <div style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', borderRadius: '20px', padding: '28px', marginBottom: '24px', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Current Level</p>
              <p style={{ fontSize: '42px', fontWeight: 800, margin: 0 }}>Level {level}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Total Points</p>
              <p style={{ fontSize: '36px', fontWeight: 800, margin: 0 }}>⭐ {totalPoints}</p>
            </div>
          </div>
          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', opacity: 0.9 }}>
            <span>{totalPoints} pts</span>
            <span>{nextLevelPoints} pts needed</span>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px', height: '10px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '999px', height: '10px', width: `${levelProgress}%` }} />
          </div>
          <div style={{ display: 'flex', gap: '24px', marginTop: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>{unlocked}</p>
              <p style={{ fontSize: '12px', opacity: 0.8 }}>Unlocked</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>{achievements.length - unlocked}</p>
              <p style={{ fontSize: '12px', opacity: 0.8 }}>Locked</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>{achievements.length > 0 ? Math.round(unlocked / achievements.length * 100) : 0}%</p>
              <p style={{ fontSize: '12px', opacity: 0.8 }}>Complete</p>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
              style={{
                padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                backgroundColor: activeCategory === cat.value ? '#6C63FF' : 'white',
                color: activeCategory === cat.value ? 'white' : '#374151',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map(a => (
            <div key={a.id} style={{
              backgroundColor: 'white', borderRadius: '16px', padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              opacity: a.unlocked ? 1 : 0.65,
              border: a.unlocked ? '2px solid #6C63FF40' : '2px solid #F3F4F6',
              position: 'relative',
            }}>
              {a.unlocked && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#6C63FF', color: 'white', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
                  UNLOCKED
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: a.unlocked ? '#6C63FF15' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
                  {a.unlocked ? a.icon : '🔒'}
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px', margin: 0 }}>{a.title}</p>
                  <div style={{ marginTop: '4px', display: 'inline-block', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                    {a.points} pts
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px', lineHeight: 1.5 }}>{a.description}</p>
              {a.progress !== undefined && a.total !== undefined && !a.unlocked && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
                    <span>Progress</span>
                    <span>{a.progress}/{a.total}</span>
                  </div>
                  <div style={{ backgroundColor: '#F3F4F6', borderRadius: '999px', height: '6px' }}>
                    <div style={{ backgroundColor: '#6C63FF', borderRadius: '999px', height: '6px', width: `${Math.min((a.progress / a.total) * 100, 100)}%` }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}