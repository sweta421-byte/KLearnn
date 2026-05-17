'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'

interface Note {
  id: string
  title: string
  content: string
  subject: string
  grade: string
  visibility: string
  likes: number
  author: { name: string }
  createdAt: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [newNote, setNewNote] = useState({ title: '', content: '', subject: '', grade: '', visibility: 'PUBLIC' })
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
  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'College']

  const subjectColors: Record<string, string> = {
    'Math': '#3B82F6', 'Science': '#10B981', 'English': '#8B5CF6',
    'History': '#F59E0B', 'Physics': '#EF4444', 'Chemistry': '#EC4899',
    'Biology': '#14B8A6', 'Computer Science': '#6366F1', 'Other': '#6C63FF'
  }

  useEffect(() => { fetchNotes() }, [])

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setNotes(data)
    } catch {
      setError('Failed to load notes')
    } finally {
      setIsLoading(false)
    }
  }

  const createNote = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newNote)
      })
      if (!res.ok) throw new Error('Failed')
      setShowModal(false)
      setNewNote({ title: '', content: '', subject: '', grade: '', visibility: 'PUBLIC' })
      fetchNotes()
    } catch {
      setError('Failed to create note')
    }
  }

  const likeNote = async (noteId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchNotes()
    } catch { console.error('like failed') }
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
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: text, margin: 0 }}>📝 Notes Marketplace</h1>
            <p style={{ color: muted, marginTop: '4px' }}>Share and discover peer notes!</p>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ padding: '12px 24px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
            + Share Note
          </button>
        </div>

        {error && <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '12px', marginBottom: '16px' }}>{error}</div>}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: muted }}>Loading notes...</div>
        ) : notes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', backgroundColor: card, borderRadius: '16px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
            <p style={{ color: text, fontSize: '20px', fontWeight: 600 }}>No notes yet!</p>
            <p style={{ color: muted }}>Be the first to share!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {notes.map((note) => (
              <div key={note.id}
                onClick={() => setSelectedNote(note)}
                style={{ backgroundColor: card, borderRadius: '16px', padding: '24px', border: `1px solid ${border}`, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: (subjectColors[note.subject] || '#6C63FF') + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px' }}>📄</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: text, marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.title}</h3>
                <p style={{ color: muted, fontSize: '14px', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{note.content}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6C63FF', backgroundColor: '#6C63FF20', padding: '2px 8px', borderRadius: '20px' }}>{note.subject}</span>
                    <span style={{ fontSize: '12px', color: muted, marginLeft: '8px' }}>{note.grade}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); likeNote(note.id) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, fontSize: '14px' }}>
                    ❤️ {note.likes}
                  </button>
                </div>
                <p style={{ color: muted, fontSize: '12px', marginTop: '12px' }}>by {note.author?.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: card, borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${border}` }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: text, marginBottom: '24px' }}>Share a Note</h2>
            <form onSubmit={createNote} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: muted, marginBottom: '6px', display: 'block' }}>Title</label>
                <input type="text" value={newNote.title} onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  placeholder="Note title" required
                  style={{ width: '100%', padding: '12px', border: `1px solid ${border}`, borderRadius: '10px', fontSize: '14px', backgroundColor: isDark ? '#0F0F1A' : 'white', color: text, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: muted, marginBottom: '6px', display: 'block' }}>Subject</label>
                <select value={newNote.subject} onChange={(e) => setNewNote({...newNote, subject: e.target.value})} required
                  style={{ width: '100%', padding: '12px', border: `1px solid ${border}`, borderRadius: '10px', fontSize: '14px', backgroundColor: isDark ? '#0F0F1A' : 'white', color: text }}>
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: muted, marginBottom: '6px', display: 'block' }}>Grade</label>
                <select value={newNote.grade} onChange={(e) => setNewNote({...newNote, grade: e.target.value})} required
                  style={{ width: '100%', padding: '12px', border: `1px solid ${border}`, borderRadius: '10px', fontSize: '14px', backgroundColor: isDark ? '#0F0F1A' : 'white', color: text }}>
                  <option value="">Select grade</option>
                  {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: muted, marginBottom: '6px', display: 'block' }}>Content</label>
                <textarea value={newNote.content} onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  placeholder="Write your note here..." rows={6} required
                  style={{ width: '100%', padding: '12px', border: `1px solid ${border}`, borderRadius: '10px', fontSize: '14px', resize: 'none', backgroundColor: isDark ? '#0F0F1A' : 'white', color: text, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: muted, marginBottom: '6px', display: 'block' }}>Visibility</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {['PUBLIC', 'FRIENDS', 'PRIVATE'].map((v) => (
                    <button key={v} type="button" onClick={() => setNewNote({...newNote, visibility: v})}
                      style={{ padding: '8px', borderRadius: '10px', border: `1px solid ${newNote.visibility === v ? '#6C63FF' : border}`, backgroundColor: newNote.visibility === v ? '#6C63FF' : 'transparent', color: newNote.visibility === v ? 'white' : text, cursor: 'pointer', fontSize: '13px' }}>
                      {v === 'PUBLIC' ? '🌍 Public' : v === 'FRIENDS' ? '👥 Friends' : '🔒 Private'}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '12px', backgroundColor: isDark ? '#2D2D44' : '#F3F4F6', color: text, border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ flex: 1, padding: '12px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                  Share Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Note Modal */}
      {selectedNote && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}
          onClick={() => setSelectedNote(null)}>
          <div style={{ backgroundColor: card, borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${border}` }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: '#6C63FF', backgroundColor: '#6C63FF20', padding: '4px 10px', borderRadius: '20px' }}>
                {selectedNote.subject} • {selectedNote.grade}
              </span>
              <button onClick={() => setSelectedNote(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, fontSize: '18px' }}>✕</button>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: text, marginBottom: '8px' }}>{selectedNote.title}</h2>
            <p style={{ color: muted, fontSize: '14px', marginBottom: '16px' }}>by {selectedNote.author?.name}</p>
            <p style={{ color: text, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selectedNote.content}</p>
            <div style={{ marginTop: '24px' }}>
              <button onClick={() => likeNote(selectedNote.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, fontSize: '14px' }}>
                ❤️ {selectedNote.likes} likes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}