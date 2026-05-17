'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Assignment {
  id: string
  title: string
  description?: string
  subject: string
  dueDate: string
  grade: string
  status: string
  submissions: any[]
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [submitContent, setSubmitContent] = useState('')
  const [newAssignment, setNewAssignment] = useState({
    title: '', description: '', subject: '', dueDate: '', grade: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''

  const subjects = ['Math', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Other']
  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'College']

  useEffect(() => { fetchAssignments() }, [])

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setAssignments(data)
    } catch (err) {
      setError('Failed to load assignments')
    } finally {
      setIsLoading(false)
    }
  }

  const createAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newAssignment)
      })
      if (!res.ok) throw new Error('Failed')
      setShowModal(false)
      setNewAssignment({ title: '', description: '', subject: '', dueDate: '', grade: '' })
      setSuccess('Assignment created!')
      fetchAssignments()
    } catch {
      setError('Failed to create assignment')
    }
  }

  const submitAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAssignment) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/${selectedAssignment.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: submitContent })
      })
      if (!res.ok) throw new Error('Failed')
      setShowSubmitModal(false)
      setSubmitContent('')
      setSuccess('Assignment submitted!')
      fetchAssignments()
    } catch {
      setError('Failed to submit assignment')
    }
  }

  const getDaysLeft = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - new Date().getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return { text: 'Overdue', color: '#EF4444' }
    if (days === 0) return { text: 'Due today', color: '#F59E0B' }
    if (days <= 3) return { text: `${days} days left`, color: '#F59E0B' }
    return { text: `${days} days left`, color: '#10B981' }
  }

  const subjectColors: Record<string, string> = {
    'Math': '#3B82F6', 'Science': '#10B981', 'English': '#8B5CF6',
    'History': '#F59E0B', 'Physics': '#EF4444', 'Chemistry': '#EC4899',
    'Biology': '#14B8A6', 'Computer Science': '#6366F1',
  }

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
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>🗂️ Assignments</h1>
            <p style={{ color: '#6B7280', marginTop: '4px' }}>Manage and submit your assignments</p>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ padding: '12px 24px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
            + Create Assignment
          </button>
        </div>

        {error && <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '12px', marginBottom: '16px' }}>{error}</div>}
        {success && <div style={{ padding: '12px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '12px', marginBottom: '16px' }}>{success}</div>}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <p style={{ color: '#6B7280' }}>Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', backgroundColor: 'white', borderRadius: '16px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🗂️</div>
            <p style={{ color: '#111827', fontSize: '20px', fontWeight: 600 }}>No assignments yet!</p>
            <p style={{ color: '#6B7280' }}>Create the first assignment</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {assignments.map((assignment) => {
              const daysLeft = getDaysLeft(assignment.dueDate)
              return (
                <div key={assignment.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <span style={{ padding: '4px 12px', backgroundColor: subjectColors[assignment.subject] + '20', color: subjectColors[assignment.subject] || '#6C63FF', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                      {assignment.subject}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: daysLeft.color }}>
                      {daysLeft.text}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>{assignment.title}</h3>
                  {assignment.description && (
                    <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '12px' }}>{assignment.description}</p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6B7280' }}>{assignment.grade}</p>
                      <p style={{ fontSize: '12px', color: '#6B7280' }}>
                        {assignment.submissions?.length || 0} submissions
                      </p>
                    </div>
                    <button
                      onClick={() => { setSelectedAssignment(assignment); setShowSubmitModal(true) }}
                      style={{ padding: '8px 16px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                      Submit
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Create Assignment</h2>
            <form onSubmit={createAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Title</label>
                <input type="text" value={newAssignment.title} onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  placeholder="Assignment title" required
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Description</label>
                <textarea value={newAssignment.description} onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  placeholder="Assignment description" rows={3}
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', resize: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Subject</label>
                <select value={newAssignment.subject} onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})} required
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px' }}>
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Grade</label>
                <select value={newAssignment.grade} onChange={(e) => setNewAssignment({...newAssignment, grade: e.target.value})} required
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px' }}>
                  <option value="">Select grade</option>
                  {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Due Date</label>
                <input type="date" value={newAssignment.dueDate} onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})} required
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
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

      {/* Submit Assignment Modal */}
      {showSubmitModal && selectedAssignment && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Submit Assignment</h2>
            <p style={{ color: '#6B7280', marginBottom: '24px' }}>{selectedAssignment.title}</p>
            <form onSubmit={submitAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Your Answer</label>
                <textarea value={submitContent} onChange={(e) => setSubmitContent(e.target.value)}
                  placeholder="Write your answer here..." rows={6} required
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', resize: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowSubmitModal(false)}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ flex: 1, padding: '12px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}