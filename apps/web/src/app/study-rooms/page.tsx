'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'

interface Room {
  id: string
  name: string
  subject: string
  goalMinutes: number
  isPublic: boolean
  members: any[]
}

export default function StudyRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newRoom, setNewRoom] = useState({ name: '', subject: '', goalMinutes: 25, isPublic: true })
  const [error, setError] = useState('')
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''

  const bg = isDark ? '#0F0F1A' : '#F8F9FA'
  const card = isDark ? '#1A1A2E' : 'white'
  const border = isDark ? '#2D2D44' : '#E5E7EB'
  const text = isDark ? '#F1F5F9' : '#111827'
  const muted = isDark ? '#94A3B8' : '#6B7280'

  const subjects = ['Math', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Other']

  useEffect(() => { fetchRooms() }, [])

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-rooms`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setRooms(Array.isArray(data) ? data : [])
    } catch {
      setError('Failed to load rooms')
      setRooms([])
    } finally {
      setIsLoading(false)
    }
  }

  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newRoom)
      })
      if (!res.ok) throw new Error('Failed')
      setShowModal(false)
      fetchRooms()
    } catch {
      setError('Failed to create room')
    }
  }

  const joinRoom = async (roomId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-rooms/${roomId}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push(`/study-rooms/${roomId}`)
    } catch {
      setError('Failed to join room')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, padding: '24px', transition: 'all 0.3s ease' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <button onClick={() => router.push('/dashboard')}
              style={{ color: muted, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
              ← Back to Dashboard
            </button>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: text, margin: 0 }}>📚 Study Rooms</h1>
            <p style={{ color: muted, marginTop: '4px' }}>Join a room and study together!</p>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ padding: '12px 24px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
            + Create Room
          </button>
        </div>

        {error && <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '12px', marginBottom: '16px' }}>{error}</div>}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: muted }}>Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', backgroundColor: card, borderRadius: '16px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📚</div>
            <p style={{ color: text, fontSize: '20px', fontWeight: 600 }}>No study rooms yet!</p>
            <p style={{ color: muted }}>Create the first one!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {rooms.map((room) => (
              <div key={room.id} style={{ backgroundColor: card, borderRadius: '16px', padding: '24px', border: `1px solid ${border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', backgroundColor: '#6C63FF20', color: '#6C63FF', borderRadius: '20px', fontSize: '13px', fontWeight: 500 }}>
                    {room.subject}
                  </span>
                  <span style={{ color: muted, fontSize: '13px' }}>⏱ {room.goalMinutes} min</span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: text, marginBottom: '8px' }}>{room.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <span style={{ color: muted, fontSize: '14px' }}>👥 {room.members?.length || 0} members</span>
                  <button onClick={() => joinRoom(room.id)}
                    style={{ padding: '8px 16px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                    Join Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: card, borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px', border: `1px solid ${border}` }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: text, marginBottom: '24px' }}>Create Study Room</h2>
            <form onSubmit={createRoom} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: muted, marginBottom: '6px', display: 'block' }}>Room Name</label>
                <input type="text" value={newRoom.name} onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                  placeholder="e.g. Math Study Group" required
                  style={{ width: '100%', padding: '12px', border: `1px solid ${border}`, borderRadius: '10px', fontSize: '14px', backgroundColor: isDark ? '#0F0F1A' : 'white', color: text, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: muted, marginBottom: '6px', display: 'block' }}>Subject</label>
                <select value={newRoom.subject} onChange={(e) => setNewRoom({...newRoom, subject: e.target.value})} required
                  style={{ width: '100%', padding: '12px', border: `1px solid ${border}`, borderRadius: '10px', fontSize: '14px', backgroundColor: isDark ? '#0F0F1A' : 'white', color: text }}>
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: muted, marginBottom: '6px', display: 'block' }}>Goal (minutes)</label>
                <input type="number" value={newRoom.goalMinutes} onChange={(e) => setNewRoom({...newRoom, goalMinutes: parseInt(e.target.value)})}
                  min="5" max="120"
                  style={{ width: '100%', padding: '12px', border: `1px solid ${border}`, borderRadius: '10px', fontSize: '14px', backgroundColor: isDark ? '#0F0F1A' : 'white', color: text, boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '12px', backgroundColor: isDark ? '#2D2D44' : '#F3F4F6', color: text, border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ flex: 1, padding: '12px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}