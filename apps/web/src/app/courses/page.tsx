'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Course {
  id: string
  title: string
  description?: string
  subject: string
  grade: string
  lessons: any[]
  enrollments: any[]
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newCourse, setNewCourse] = useState({ title: '', description: '', subject: '', grade: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''

  const subjects = ['Math', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Other']
  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'College']

  const subjectColors: Record<string, string> = {
    'Math': '#3B82F6', 'Science': '#10B981', 'English': '#8B5CF6',
    'History': '#F59E0B', 'Physics': '#EF4444', 'Chemistry': '#EC4899',
    'Biology': '#14B8A6', 'Computer Science': '#6366F1', 'Other': '#6C63FF'
  }

  const subjectEmojis: Record<string, string> = {
    'Math': '📐', 'Science': '🔬', 'English': '📖', 'History': '🏛️',
    'Physics': '⚡', 'Chemistry': '🧪', 'Biology': '🌿', 'Computer Science': '💻', 'Other': '📚'
  }

  useEffect(() => { fetchCourses() }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setCourses(data)
    } catch {
      setError('Failed to load courses')
    } finally {
      setIsLoading(false)
    }
  }

  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newCourse)
      })
      if (!res.ok) throw new Error('Failed')
      setShowModal(false)
      setNewCourse({ title: '', description: '', subject: '', grade: '' })
      setSuccess('Course created successfully!')
      fetchCourses()
    } catch {
      setError('Failed to create course')
    }
  }

  const enrollCourse = async (courseId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess('Enrolled successfully!')
      fetchCourses()
    } catch {
      setError('Failed to enroll')
    }
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
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>🎓 Courses</h1>
            <p style={{ color: '#6B7280', marginTop: '4px' }}>Explore and enroll in courses</p>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ padding: '12px 24px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
            + Create Course
          </button>
        </div>

        {error && <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '12px', marginBottom: '16px' }}>{error}</div>}
        {success && <div style={{ padding: '12px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '12px', marginBottom: '16px' }}>{success}</div>}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <p style={{ color: '#6B7280' }}>Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', backgroundColor: 'white', borderRadius: '16px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎓</div>
            <p style={{ color: '#111827', fontSize: '20px', fontWeight: 600 }}>No courses yet!</p>
            <p style={{ color: '#6B7280' }}>Create the first course</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {courses.map((course) => (
              <div key={course.id} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB' }}>
                {/* Course Header */}
                <div style={{ backgroundColor: subjectColors[course.subject] || '#6C63FF', padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '48px' }}>{subjectEmojis[course.subject] || '📚'}</span>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ padding: '4px 10px', backgroundColor: (subjectColors[course.subject] || '#6C63FF') + '20', color: subjectColors[course.subject] || '#6C63FF', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                      {course.subject}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>{course.grade}</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>{course.title}</h3>
                  {course.description && (
                    <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '12px', lineHeight: 1.5 }}>{course.description}</p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <span style={{ fontSize: '13px', color: '#6B7280' }}>📖 {course.lessons?.length || 0} lessons</span>
                      <span style={{ fontSize: '13px', color: '#6B7280' }}>👥 {course.enrollments?.length || 0} enrolled</span>
                    </div>
                    <button onClick={() => enrollCourse(course.id)}
                      style={{ padding: '8px 16px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Create Course</h2>
            <form onSubmit={createCourse} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Title</label>
                <input type="text" value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  placeholder="Course title" required
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Description</label>
                <textarea value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  placeholder="Course description" rows={3}
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', resize: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Subject</label>
                <select value={newCourse.subject} onChange={(e) => setNewCourse({...newCourse, subject: e.target.value})} required
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px' }}>
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Grade</label>
                <select value={newCourse.grade} onChange={(e) => setNewCourse({...newCourse, grade: e.target.value})} required
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px' }}>
                  <option value="">Select grade</option>
                  {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
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
    </div>
  )
}