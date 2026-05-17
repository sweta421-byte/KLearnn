'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''

  const typeIcons: Record<string, string> = {
    info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌',
  }
  const typeColors: Record<string, string> = {
    info: '#3B82F6', success: '#10B981', warning: '#F59E0B', error: '#EF4444',
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
    } catch {
      setNotifications([])
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    })
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/mark-all-read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', padding: '24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
            ← Back to Dashboard
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>
                🔔 Notifications
                {unreadCount > 0 && (
                  <span style={{ marginLeft: '10px', fontSize: '16px', padding: '2px 10px', borderRadius: '20px', backgroundColor: '#EF4444', color: 'white', fontWeight: 600 }}>
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p style={{ color: '#6B7280', marginTop: '4px' }}>Stay updated with your activity</p>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead}
                style={{ padding: '10px 20px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                Mark all read
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {(['all', 'unread'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                backgroundColor: filter === f ? '#6C63FF' : 'white',
                color: filter === f ? 'white' : '#374151',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
              {f === 'all' ? `All (${notifications.length})` : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#6B7280' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '48px' }}>🔔</p>
            <p style={{ color: '#111827', fontWeight: 600, fontSize: '18px' }}>No notifications!</p>
            <p style={{ color: '#6B7280' }}>{filter === 'unread' ? 'All caught up!' : 'No notifications yet'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(n => (
              <div key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                style={{
                  backgroundColor: 'white', borderRadius: '16px', padding: '18px 20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  borderLeft: `4px solid ${typeColors[n.type] || '#6C63FF'}`,
                  opacity: n.read ? 0.75 : 1,
                  cursor: n.read ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                }}>
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{typeIcons[n.type] || 'ℹ️'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontSize: '15px', fontWeight: n.read ? 500 : 700, color: '#111827', margin: 0 }}>{n.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                      {!n.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6C63FF' }} />}
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{timeAgo(n.createdAt)}</span>
                      <button onClick={(e) => { e.stopPropagation(); deleteNotification(n.id) }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D1D5DB', fontSize: '14px', padding: '0' }}>
                        ✕
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px', lineHeight: 1.5 }}>{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}