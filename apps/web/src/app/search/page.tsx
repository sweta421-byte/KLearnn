'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface SearchResult {
  id: string
  type: 'note' | 'doubt' | 'course' | 'resource' | 'assignment'
  title: string
  subtitle: string
  href: string
  icon: string
  color: string
}

function SearchContent() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [notes, setNotes] = useState<any[]>([])
  const [doubts, setDoubts] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''

  useEffect(() => {
    inputRef.current?.focus()
    fetchAllData()
  }, [])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    performSearch(query)
  }, [query, activeFilter, notes, doubts, courses, resources, assignments])

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      const [n, d, c, r, a] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/my`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/doubts`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/resources`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      ])
      setNotes(Array.isArray(n) ? n : [])
      setDoubts(Array.isArray(d) ? d : [])
      setCourses(Array.isArray(c) ? c : [])
      setResources(Array.isArray(r) ? r : [])
      setAssignments(Array.isArray(a) ? a : [])
    } catch {}
    setIsLoading(false)
  }

  const performSearch = (q: string) => {
    const lower = q.toLowerCase()
    const all: SearchResult[] = []

    if (activeFilter === 'all' || activeFilter === 'notes') {
      notes.filter(n => n.title?.toLowerCase().includes(lower) || n.subject?.toLowerCase().includes(lower) || n.content?.toLowerCase().includes(lower))
        .forEach(n => all.push({ id: n.id, type: 'note', title: n.title, subtitle: `📚 ${n.subject} • ${n.grade}`, href: '/notes', icon: '📝', color: '#3B82F6' }))
    }

    if (activeFilter === 'all' || activeFilter === 'doubts') {
      doubts.filter(d => d.question?.toLowerCase().includes(lower) || d.subject?.toLowerCase().includes(lower))
        .forEach(d => all.push({ id: d.id, type: 'doubt', title: d.question.slice(0, 60) + (d.question.length > 60 ? '...' : ''), subtitle: `❓ ${d.subject} • ${d.status}`, href: '/doubt-helper', icon: '❓', color: '#8B5CF6' }))
    }

    if (activeFilter === 'all' || activeFilter === 'courses') {
      courses.filter(c => c.title?.toLowerCase().includes(lower) || c.subject?.toLowerCase().includes(lower))
        .forEach(c => all.push({ id: c.id, type: 'course', title: c.title, subtitle: `🎓 ${c.subject} • ${c.grade}`, href: '/courses', icon: '🎓', color: '#10B981' }))
    }

    if (activeFilter === 'all' || activeFilter === 'resources') {
      resources.filter(r => r.title?.toLowerCase().includes(lower) || r.category?.toLowerCase().includes(lower))
        .forEach(r => all.push({ id: r.id, type: 'resource', title: r.title, subtitle: `📎 ${r.category} • ${r.fileType}`, href: '/resources', icon: '📎', color: '#F59E0B' }))
    }

    if (activeFilter === 'all' || activeFilter === 'assignments') {
      assignments.filter(a => a.title?.toLowerCase().includes(lower) || a.subject?.toLowerCase().includes(lower))
        .forEach(a => all.push({ id: a.id, type: 'assignment', title: a.title, subtitle: `📋 ${a.subject} • Due: ${new Date(a.dueDate).toLocaleDateString()}`, href: '/assignments', icon: '📋', color: '#EF4444' }))
    }

    setResults(all)
  }

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'notes', label: '📝 Notes' },
    { value: 'doubts', label: '❓ Doubts' },
    { value: 'courses', label: '🎓 Courses' },
    { value: 'resources', label: '📎 Resources' },
    { value: 'assignments', label: '📋 Assignments' },
  ]

  const recentPages = [
    { icon: '📊', label: 'Analytics', href: '/analytics' },
    { icon: '🏅', label: 'Leaderboard', href: '/leaderboard' },
    { icon: '⏱️', label: 'Focus Timer', href: '/focus' },
    { icon: '🏆', label: 'Achievements', href: '/achievements' },
    { icon: '📆', label: 'Calendar', href: '/calendar' },
    { icon: '💬', label: 'Messages', href: '/chat' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', padding: '24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '12px', display: 'block' }}>
            ← Back to Dashboard
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>🔍 Global Search</h1>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>Search across notes, doubts, courses, and more</p>
        </div>

        {/* Search Box */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search anything..."
            style={{
              width: '100%', padding: '16px 16px 16px 48px', borderRadius: '16px',
              border: '2px solid #E5E7EB', fontSize: '16px', outline: 'none',
              backgroundColor: 'white', boxSizing: 'border-box',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#6C63FF'}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
          />
          {query && (
            <button onClick={() => setQuery('')}
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#9CA3AF' }}>
              ✕
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f.value} onClick={() => setActiveFilter(f.value)}
              style={{
                padding: '7px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                backgroundColor: activeFilter === f.value ? '#6C63FF' : 'white',
                color: activeFilter === f.value ? 'white' : '#374151',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {query.trim().length < 2 ? (
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Access</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {recentPages.map(page => (
                <div key={page.href} onClick={() => router.push(page.href)}
                  style={{ backgroundColor: 'white', borderRadius: '14px', padding: '16px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px', transition: 'transform 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                  <span style={{ fontSize: '22px' }}>{page.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{page.label}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B7280', marginBottom: '12px' }}>SEARCH TIPS</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { tip: 'Search by subject', example: '"Math", "Physics", "English"' },
                  { tip: 'Search notes by title', example: '"Chapter 1", "Summary"' },
                  { tip: 'Search doubts by keyword', example: '"derivative", "photosynthesis"' },
                  { tip: 'Search courses by name', example: '"Algebra", "Chemistry"' },
                ].map(item => (
                  <div key={item.tip} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>{item.tip}</span>
                    <span style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>{item.example}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>Searching...</div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '48px' }}>🔍</p>
            <p style={{ fontWeight: 600, color: '#111827', fontSize: '18px' }}>No results found</p>
            <p style={{ color: '#6B7280', fontSize: '13px' }}>Try a different keyword or filter</p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>
              Found <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for "<strong>{query}</strong>"
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {results.map((result, i) => (
                <div key={`${result.id}-${i}`} onClick={() => router.push(result.href)}
                  style={{ backgroundColor: 'white', borderRadius: '14px', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: `4px solid ${result.color}`, transition: 'transform 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(4px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateX(0)')}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: result.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    {result.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{result.title}</p>
                    <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '3px' }}>{result.subtitle}</p>
                  </div>
                  <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', backgroundColor: result.color + '20', color: result.color, fontWeight: 600, flexShrink: 0, textTransform: 'capitalize' }}>
                    {result.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '24px' }}>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}