'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import Sidebar from './Sidebar'
import { TopBar } from './TopBar'
import { ProfilePanel } from './ProfilePanel'

const PUBLIC_ROUTES = ['/login', '/register', '/']

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [profileOpen, setProfileOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'desktop' | 'phone'>('desktop')
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isDark = theme === 'dark'

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'desktop' ? 'phone' : 'desktop')
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

  if (isPublicRoute) return <>{children}</>

  return (
    <div style={{
      backgroundColor: isDark ? '#0F0F1A' : '#F8F9FA',
      color: isDark ? '#F1F5F9' : '#111827',
      minHeight: '100vh',
      transition: 'all 0.3s ease',
    }}>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 35, backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar */}
      {(!isMobile || sidebarOpen) && (
        <Sidebar isDark={isDark} />
      )}

      {/* Main Content */}
      <div style={{
        marginLeft: isMobile ? '0' : '260px',
        paddingTop: '64px',
        minHeight: '100vh',
        transition: 'all 0.3s ease',
      }}>
        <TopBar
          onProfileClick={() => setProfileOpen(true)}
          isDark={isDark}
          toggleTheme={toggleTheme}
          viewMode={viewMode}
          toggleViewMode={toggleViewMode}
          isMobile={isMobile}
          onMenuClick={() => setSidebarOpen(prev => !prev)}
        />

        {!isMobile && viewMode === 'phone' ? (
          <div style={{
            width: '100%', display: 'flex', justifyContent: 'center',
            alignItems: 'flex-start', paddingBottom: '40px', paddingTop: '20px',
          }}>
            <div style={{
              width: '390px', height: '844px',
              border: '10px solid #111', borderRadius: '42px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
            }}>
              <main style={{
                height: '100%', overflowY: 'auto', padding: '24px',
                backgroundColor: isDark ? '#0F0F1A' : '#F8F9FA',
                color: isDark ? '#F1F5F9' : '#111827',
              }}>
                {children}
              </main>
            </div>
          </div>
        ) : (
          <main style={{
            padding: isMobile ? '16px' : '24px',
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: isDark ? '#0F0F1A' : '#F8F9FA',
            color: isDark ? '#F1F5F9' : '#111827',
          }}>
            {children}
          </main>
        )}
      </div>

      <ProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  )
}