'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [profileForm, setProfileForm] = useState({ name: '', email: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    studyReminders: true,
    darkMode: false,
    language: 'English',
    timezone: 'Asia/Kolkata',
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''

  useEffect(() => {
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (userData) {
      const parsed = JSON.parse(userData)
      setUser(parsed)
      setProfileForm({ name: parsed.name || '', email: parsed.email || '' })
    }
  }, [])

  const showSuccess = (msg: string) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    const updated = { ...user, ...profileForm }
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
    showSuccess('Profile updated successfully!')
  }

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters!')
      return
    }
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    showSuccess('Password updated successfully!')
  }

  const handlePreferenceSave = () => {
    localStorage.setItem('preferences', JSON.stringify(preferences))
    showSuccess('Preferences saved!')
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const tabs = [
    { value: 'profile', label: '👤 Profile' },
    { value: 'password', label: '🔒 Password' },
    { value: 'preferences', label: '⚙️ Preferences' },
    { value: 'account', label: '🗂️ Account' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
            ← Back to Dashboard
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>⚙️ Settings</h1>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>Manage your account and preferences</p>
        </div>

        {success && <div style={{ padding: '12px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '12px', marginBottom: '16px' }}>{success}</div>}
        {error && <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '12px', marginBottom: '16px' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>

          {/* Sidebar Tabs */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
            {tabs.map(tab => (
              <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  textAlign: 'left', fontSize: '14px', fontWeight: 500, marginBottom: '4px',
                  backgroundColor: activeTab === tab.value ? '#6C63FF20' : 'transparent',
                  color: activeTab === tab.value ? '#6C63FF' : '#374151',
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>👤 Profile Information</h2>
                
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#6C63FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: 'white', fontWeight: 700 }}>
                    {profileForm.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{profileForm.name || 'Your Name'}</p>
                    <p style={{ fontSize: '13px', color: '#6B7280' }}>{profileForm.email || 'your@email.com'}</p>
                    <span style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '20px', backgroundColor: '#6C63FF20', color: '#6C63FF', fontWeight: 500 }}>
                      {user?.role || 'Student'}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Full Name</label>
                    <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      placeholder="Your full name"
                      style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Email Address</label>
                    <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      placeholder="your@email.com"
                      style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Role</label>
                    <input type="text" value={user?.role || 'Student'} disabled
                      style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', backgroundColor: '#F9FAFB', color: '#6B7280', boxSizing: 'border-box' }} />
                  </div>
                  <button type="submit"
                    style={{ padding: '12px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>🔒 Change Password</h2>
                <form onSubmit={handlePasswordSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Current Password</label>
                    <input type="password" value={passwordForm.currentPassword}
                      onChange={(e) => { setError(''); setPasswordForm({...passwordForm, currentPassword: e.target.value}) }}
                      placeholder="Enter current password" required
                      style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block', fontWeight: 500 }}>New Password</label>
                    <input type="password" value={passwordForm.newPassword}
                      onChange={(e) => { setError(''); setPasswordForm({...passwordForm, newPassword: e.target.value}) }}
                      placeholder="Enter new password" required
                      style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Confirm New Password</label>
                    <input type="password" value={passwordForm.confirmPassword}
                      onChange={(e) => { setError(''); setPasswordForm({...passwordForm, confirmPassword: e.target.value}) }}
                      placeholder="Confirm new password" required
                      style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#F0F9FF', borderRadius: '10px', fontSize: '13px', color: '#0369A1' }}>
                    💡 Password must be at least 6 characters long
                  </div>
                  <button type="submit"
                    style={{ padding: '12px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>⚙️ Preferences</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates and alerts via email' },
                    { key: 'studyReminders', label: 'Study Reminders', desc: 'Get daily study session reminders' },
                    { key: 'darkMode', label: 'Dark Mode', desc: 'Switch to dark theme (coming soon)' },
                  ].map(pref => (
                    <div key={pref.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>{pref.label}</p>
                        <p style={{ fontSize: '12px', color: '#6B7280' }}>{pref.desc}</p>
                      </div>
                      <div onClick={() => setPreferences({...preferences, [pref.key]: !preferences[pref.key as keyof typeof preferences]})}
                        style={{
                          width: '48px', height: '26px', borderRadius: '999px', cursor: 'pointer', position: 'relative', transition: 'background 0.3s',
                          backgroundColor: preferences[pref.key as keyof typeof preferences] ? '#6C63FF' : '#D1D5DB',
                        }}>
                        <div style={{
                          width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px',
                          left: preferences[pref.key as keyof typeof preferences] ? '25px' : '3px', transition: 'left 0.3s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }} />
                      </div>
                    </div>
                  ))}

                  <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '8px', display: 'block' }}>Language</label>
                    <select value={preferences.language} onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}>
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Marathi</option>
                      <option>Gujarati</option>
                    </select>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '8px', display: 'block' }}>Timezone</label>
                    <select value={preferences.timezone} onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}>
                      <option value="Asia/Kolkata">India (IST)</option>
                      <option value="America/New_York">New York (EST)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Asia/Dubai">Dubai (GST)</option>
                    </select>
                  </div>

                  <button onClick={handlePreferenceSave}
                    style={{ padding: '12px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>🗂️ Account</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Account Information</h3>
                    <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Name: <strong>{user?.name || 'N/A'}</strong></p>
                    <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Email: <strong>{user?.email || 'N/A'}</strong></p>
                    <p style={{ fontSize: '13px', color: '#6B7280' }}>Role: <strong>{user?.role || 'Student'}</strong></p>
                  </div>

                  <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #FEE2E2', backgroundColor: '#FFF5F5' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#DC2626', marginBottom: '8px' }}>⚠️ Danger Zone</h3>
                    <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>These actions are irreversible. Please be careful.</p>
                    <button onClick={handleLogout}
                      style={{ padding: '10px 20px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}