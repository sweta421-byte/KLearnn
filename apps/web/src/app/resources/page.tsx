'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Resource {
  id: string
  title: string
  description?: string
  url?: string
  fileType: string
  category: string
  tags?: string
  createdAt: string
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [newResource, setNewResource] = useState({ title: '', description: '', url: '', fileType: 'link', category: 'general', tags: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''

  const categories = [
    { value: 'all', label: '🌐 All', color: '#6C63FF' },
    { value: 'general', label: '📁 General', color: '#6B7280' },
    { value: 'notes', label: '📝 Notes', color: '#3B82F6' },
    { value: 'video', label: '🎥 Video', color: '#EF4444' },
    { value: 'article', label: '📰 Article', color: '#10B981' },
    { value: 'book', label: '📚 Book', color: '#F59E0B' },
    { value: 'tool', label: '🛠️ Tool', color: '#8B5CF6' },
  ]

  const fileTypes = [
    { value: 'link', label: '🔗 Link' },
    { value: 'pdf', label: '📄 PDF' },
    { value: 'video', label: '🎥 Video' },
    { value: 'image', label: '🖼️ Image' },
    { value: 'doc', label: '📝 Document' },
    { value: 'other', label: '📎 Other' },
  ]

  const fileTypeIcons: Record<string, string> = {
    link: '🔗', pdf: '📄', video: '🎥', image: '🖼️', doc: '📝', other: '📎'
  }

  useEffect(() => { fetchResources() }, [activeCategory])

  const fetchResources = async () => {
    setIsLoading(true)
    try {
      const url = searchQuery
        ? `${process.env.NEXT_PUBLIC_API_URL}/resources/search?q=${searchQuery}`
        : `${process.env.NEXT_PUBLIC_API_URL}/resources?category=${activeCategory}`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setResources(data)
    } catch {
      setError('Failed to load resources')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchResources()
  }

  const createResource = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newResource)
      })
      if (!res.ok) throw new Error('Failed')
      setShowModal(false)
      setNewResource({ title: '', description: '', url: '', fileType: 'link', category: 'general', tags: '' })
      setSuccess('Resource added!')
      setTimeout(() => setSuccess(''), 3000)
      fetchResources()
    } catch {
      setError('Failed to add resource')
    }
  }

  const deleteResource = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resources/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchResources()
    } catch {
      setError('Failed to delete resource')
    }
  }

  const getCategoryColor = (cat: string) => categories.find(c => c.value === cat)?.color || '#6C63FF'

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
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>📎 Resources</h1>
            <p style={{ color: '#6B7280', marginTop: '4px' }}>Your study materials library</p>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ padding: '12px 24px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
            + Add Resource
          </button>
        </div>

        {error && <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '12px', marginBottom: '16px' }}>{error}</div>}
        {success && <div style={{ padding: '12px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '12px', marginBottom: '16px' }}>{success}</div>}

        {/* Search */}
        <form onSubmit={handleSearch} style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            style={{ flex: 1, padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '14px', outline: 'none' }} />
          <button type="submit"
            style={{ padding: '12px 24px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
            Search
          </button>
          {searchQuery && (
            <button type="button" onClick={() => { setSearchQuery(''); fetchResources() }}
              style={{ padding: '12px 16px', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
              Clear
            </button>
          )}
        </form>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
              style={{
                padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                backgroundColor: activeCategory === cat.value ? cat.color : '#F3F4F6',
                color: activeCategory === cat.value ? 'white' : '#374151',
              }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#6B7280' }}>Loading resources...</div>
        ) : resources.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', backgroundColor: 'white', borderRadius: '16px' }}>
            <p style={{ fontSize: '48px' }}>📎</p>
            <p style={{ color: '#111827', fontWeight: 600, fontSize: '18px' }}>No resources yet!</p>
            <p style={{ color: '#6B7280' }}>Add your first study material</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {resources.map(resource => (
              <div key={resource.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: `4px solid ${getCategoryColor(resource.category)}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{fileTypeIcons[resource.fileType] || '📎'}</span>
                  <button onClick={() => deleteResource(resource.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '16px' }}>
                    🗑️
                  </button>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>{resource.title}</h3>
                {resource.description && (
                  <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px', lineHeight: 1.5 }}>{resource.description}</p>
                )}
                {resource.tags && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                    {resource.tags.split(',').map(tag => (
                      <span key={tag} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', backgroundColor: getCategoryColor(resource.category) + '20', color: getCategoryColor(resource.category), fontWeight: 500 }}>
                    {categories.find(c => c.value === resource.category)?.label || resource.category}
                  </span>
                  {resource.url && (
                    <a href={resource.url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: '12px', color: '#6C63FF', fontWeight: 600, textDecoration: 'none' }}>
                      Open →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Resource Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Add Resource</h2>
            <form onSubmit={createResource} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Title</label>
                <input type="text" value={newResource.title} onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  placeholder="Resource title" required
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>URL (optional)</label>
                <input type="url" value={newResource.url} onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>File Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {fileTypes.map(ft => (
                    <button key={ft.value} type="button"
                      onClick={() => setNewResource({...newResource, fileType: ft.value})}
                      style={{ padding: '8px', borderRadius: '8px', border: `2px solid ${newResource.fileType === ft.value ? '#6C63FF' : '#E5E7EB'}`, backgroundColor: newResource.fileType === ft.value ? '#6C63FF20' : 'white', cursor: 'pointer', fontSize: '12px' }}>
                      {ft.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Category</label>
                <select value={newResource.category} onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px' }}>
                  {categories.filter(c => c.value !== 'all').map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Description (optional)</label>
                <textarea value={newResource.description} onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  placeholder="Brief description..." rows={3}
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', resize: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>Tags (comma separated)</label>
                <input type="text" value={newResource.tags} onChange={(e) => setNewResource({...newResource, tags: e.target.value})}
                  placeholder="math, algebra, notes"
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ flex: 1, padding: '12px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}