'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: string
  category: string
  color: string
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', category: 'general', color: '#6C63FF' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''

  const categories = [
    { value: 'general', label: '📅 General', color: '#6C63FF' },
    { value: 'exam', label: '📝 Exam', color: '#EF4444' },
    { value: 'assignment', label: '🗂️ Assignment', color: '#F59E0B' },
    { value: 'study', label: '📚 Study', color: '#10B981' },
    { value: 'holiday', label: '🎉 Holiday', color: '#EC4899' },
    { value: 'meeting', label: '👥 Meeting', color: '#3B82F6' },
  ]

  useEffect(() => { fetchEvents() }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setEvents(data)
    } catch {
      setError('Failed to load events')
    }
  }

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newEvent)
      })
      if (!res.ok) throw new Error('Failed')
      setShowModal(false)
      setNewEvent({ title: '', description: '', date: '', category: 'general', color: '#6C63FF' })
      setSuccess('Event created!')
      setTimeout(() => setSuccess(''), 3000)
      fetchEvents()
    } catch {
      setError('Failed to create event')
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchEvents()
    } catch {
      setError('Failed to delete event')
    }
  }

  // Calendar logic
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
    })
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const today = new Date()

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
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>📆 Calendar</h1>
            <p style={{ color: '#6B7280', marginTop: '4px' }}>Manage your schedule and events</p>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ padding: '12px 24px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
            + Add Event
          </button>
        </div>

        {error && <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '12px', marginBottom: '16px' }}>{error}</div>}
        {success && <div style={{ padding: '12px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '12px', marginBottom: '16px' }}>{success}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>

          {/* Calendar Grid */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {/* Month Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                style={{ padding: '8px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', background: 'white' }}>
                ←
              </button>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                style={{ padding: '8px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', background: 'white' }}>
                →
              </button>
            </div>

            {/* Day Names */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
              {dayNames.map(day => (
                <div key={day} style={{ textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#6B7280', padding: '8px' }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dayEvents = getEventsForDay(day)
                const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()

                return (
                  <div key={day}
                    onClick={() => {
                      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                      setNewEvent({...newEvent, date: dateStr})
                      setShowModal(true)
                    }}
                    style={{
                      padding: '8px', borderRadius: '8px', cursor: 'pointer', minHeight: '60px',
                      backgroundColor: isToday ? '#6C63FF' : dayEvents.length > 0 ? '#F3F4F6' : 'white',
                      border: isToday ? 'none' : '1px solid #F3F4F6',
                    }}>
                    <p style={{ fontSize: '14px', fontWeight: isToday ? 700 : 500, color: isToday ? 'white' : '#111827', marginBottom: '4px' }}>{day}</p>
                    {dayEvents.slice(0, 2).map(event => (
                      <div key={event.id} style={{ fontSize: '10px', padding: '2px 4px', borderRadius: '4px', backgroundColor: event.color + '30', color: event.color, marginBottom: '2px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {event.title}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>📋 Upcoming Events</h3>
              {events.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px' }}>
                  <p style={{ fontSize: '32px' }}>📅</p>
                  <p style={{ color: '#6B7280', fontSize: '14px' }}>No events yet!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
                  {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
                    <div key={event.id} style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${event.color}30`, borderLeft: `4px solid ${event.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{event.title}</p>
                          <p style={{ fontSize: '12px', color: '#6B7280' }}>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', backgroundColor: event.color + '20', color: event.color }}>
                            {categories.find(c => c.value === event.category)?.label || event.category}
                          </span>
                        </div>
                        <button onClick={() => deleteEvent(event.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '16px' }}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Add Event</h2>
            <form onSubmit={createEvent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Title</label>
                <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Event title" required
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Date</label>
                <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} required
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Category</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {categories.map(cat => (
                    <button key={cat.value} type="button"
                      onClick={() => setNewEvent({...newEvent, category: cat.value, color: cat.color})}
                      style={{ padding: '8px', borderRadius: '8px', border: `2px solid ${newEvent.category === cat.value ? cat.color : '#E5E7EB'}`, backgroundColor: newEvent.category === cat.value ? cat.color + '20' : 'white', cursor: 'pointer', fontSize: '12px', color: '#374151' }}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Description (optional)</label>
                <textarea value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Event description" rows={3}
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', resize: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ flex: 1, padding: '12px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}