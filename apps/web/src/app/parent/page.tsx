'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ParentPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [doubts, setDoubts] = useState<any[]>([])
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [ann, dbt] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher/announcements`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/doubts`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()),
      ])
      setAnnouncements(Array.isArray(ann) ? ann : [])
      setDoubts(Array.isArray(dbt) ? dbt : [])
    } catch {}
  }

  const childStats = [
    { label: 'Doubts Asked', value: doubts.length, icon: '❓', color: '#8B5CF6' },
    { label: 'Announcements', value: announcements.length, icon: '📢', color: '#3B82F6' },
    { label: 'Study Streak', value: '3 days', icon: '🔥', color: '#F59E0B' },
    { label: 'Overall Grade', value: 'A+', icon: '🎯', color: '#10B981' },
  ]

  const tabs = [
    { value: 'overview', label: '📊 Overview' },
    { value: 'announcements', label: '📢 Announcements' },
    { value: 'doubts', label: '❓ Doubts' },
    { value: 'safety', label: '🛡️ Safety' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', padding: '24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
            ← Back to Dashboard
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>👨‍👩‍👧 Parent Dashboard</h1>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>Monitor your child's learning progress</p>
        </div>

        {/* Child Info Card */}
        <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '20px', padding: '24px', marginBottom: '24px', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700 }}>
              S
            </div>
            <div>
              <p style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Sweta Yadav</p>
              <p style={{ fontSize: '13px', opacity: 0.85, marginTop: '2px' }}>Class 10 • KiwiLearn Student</p>
              <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
                🌱 Beginner Level
              </span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {childStats.map(stat => (
              <div key={stat.label} style={{ textAlign: 'center', padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <p style={{ fontSize: '20px', marginBottom: '4px' }}>{stat.icon}</p>
                <p style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>{stat.value}</p>
                <p style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)}
              style={{
                padding: '10px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                backgroundColor: activeTab === tab.value ? '#10B981' : 'white',
                color: activeTab === tab.value ? 'white' : '#374151',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>📈 Weekly Progress</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Study Sessions', value: '5', change: '+2 this week', color: '#10B981' },
                  { label: 'Doubts Resolved', value: `${doubts.filter((d: any) => d.status === 'RESOLVED').length}`, change: 'Total resolved', color: '#3B82F6' },
                  { label: 'Notes Created', value: '3', change: '+1 this week', color: '#8B5CF6' },
                ].map(item => (
                  <div key={item.label} style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                    <p style={{ fontSize: '28px', fontWeight: 700, color: item.color, margin: 0 }}>{item.value}</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginTop: '4px' }}>{item.label}</p>
                    <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{item.change}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>📅 Recent Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { icon: '❓', text: 'Asked a doubt in Mathematics', time: '2 hours ago', color: '#8B5CF6' },
                  { icon: '📝', text: 'Created a note on Physics', time: '5 hours ago', color: '#3B82F6' },
                  { icon: '📚', text: 'Joined a Study Room', time: '1 day ago', color: '#10B981' },
                  { icon: '✅', text: 'Completed an assignment', time: '2 days ago', color: '#F59E0B' },
                ].map((activity, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', backgroundColor: '#F9FAFB' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: activity.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                      {activity.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: '#111827', margin: 0 }}>{activity.text}</p>
                      <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>📢 School Announcements</h3>
            {announcements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>
                <p style={{ fontSize: '40px' }}>📢</p>
                <p style={{ fontWeight: 600 }}>No announcements yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {announcements.map((ann: any) => (
                  <div key={ann.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F0FDF4', border: '1px solid #86EFAC' }}>
                    <p style={{ fontSize: '14px', color: '#111827', margin: 0, lineHeight: 1.6 }}>{ann.message}</p>
                    <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '8px' }}>
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Doubts Tab */}
        {activeTab === 'doubts' && (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>❓ Child's Doubts</h3>
            {doubts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>
                <p style={{ fontSize: '40px' }}>❓</p>
                <p style={{ fontWeight: 600 }}>No doubts asked yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {doubts.slice(0, 10).map((doubt: any) => (
                  <div key={doubt.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>{doubt.subject}</p>
                      <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', backgroundColor: doubt.status === 'RESOLVED' ? '#D1FAE5' : '#FEF3C7', color: doubt.status === 'RESOLVED' ? '#065F46' : '#92400E', fontWeight: 600 }}>
                        {doubt.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: 1.5 }}>{doubt.question}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Safety Tab */}
        {activeTab === 'safety' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: '#F0FDF4', borderRadius: '16px', padding: '24px', border: '1px solid #86EFAC' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#065F46', marginBottom: '8px' }}>✅ Safety Status</h3>
              <p style={{ fontSize: '14px', color: '#047857' }}>Your child is safe and actively learning on KiwiLearn. No safety concerns reported.</p>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>🛡️ Safety Features</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { icon: '🔒', title: 'Anonymous Reporting', desc: 'Child can report concerns anonymously' },
                  { icon: '👁️', title: 'Activity Monitoring', desc: 'All learning activities are tracked' },
                  { icon: '🚫', title: 'Content Filtering', desc: 'All content is educationally appropriate' },
                  { icon: '📞', title: 'Emergency Contact', desc: 'Reach school admin directly from app' },
                ].map(feature => (
                  <div key={feature.title} style={{ display: 'flex', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: '#F9FAFB' }}>
                    <span style={{ fontSize: '22px' }}>{feature.icon}</span>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>{feature.title}</p>
                      <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}