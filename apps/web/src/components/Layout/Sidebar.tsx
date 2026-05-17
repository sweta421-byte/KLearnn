'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Search', href: '/search', icon: '🔍' },
  { label: 'Profile', href: '/profile', icon: '👤' },
  { label: 'Notifications', href: '/notifications', icon: '🔔' },
  { label: 'Leaderboard', href: '/leaderboard', icon: '🏅' },
  { label: 'Analytics', href: '/analytics', icon: '📈' },
  { label: 'Messages', href: '/chat', icon: '💬' },
  { label: 'Study Rooms', href: '/study-rooms', icon: '📚' },
  { label: 'Doubt Helper', href: '/doubt-helper', icon: '❓' },
  { label: 'Notes', href: '/notes', icon: '📝' },
  { label: 'Teacher', href: '/teacher', icon: '👩‍🏫' },
  { label: 'Parent', href: '/parent', icon: '👨‍👩‍👧' },
  { label: 'Safety', href: '/safety', icon: '🛡️' },
  { label: 'Assignments', href: '/assignments', icon: '🗂️' },
  { label: 'Courses', href: '/courses', icon: '🎓' },
  { label: 'Calendar', href: '/calendar', icon: '📆' },
  { label: 'Reports', href: '/reports', icon: '📊' },
  { label: 'Resources', href: '/resources', icon: '📎' },
  { label: 'Focus Timer', href: '/focus', icon: '⏱️' },
  { label: 'Achievements', href: '/achievements', icon: '🏆' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
  { label: 'Support', href: '/support', icon: '💬' },
]

interface SidebarProps {
  isDark: boolean
}

export default function Sidebar({ isDark }: SidebarProps) {
  const pathname = usePathname() || '/'

  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '260px',
      height: '100vh',
      background: isDark
        ? 'linear-gradient(180deg, #1A1035 0%, #13131F 100%)'
        : 'linear-gradient(180deg, #F3F1FF 0%, #FFFFFF 100%)',
      borderRight: `1px solid ${isDark ? '#2D2D44' : '#E5E7EB'}`,
      overflow: 'hidden',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
    }}>

      {/* Logo */}
      <div style={{
        padding: '20px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: `1px solid ${isDark ? '#2D2D4460' : '#E5E7EB'}`,
        marginTop: '64px',
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '14px',
          background: 'linear-gradient(135deg, #6C63FF 0%, #EC4899 100%)',
          color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '16px', flexShrink: 0,
          boxShadow: '0 4px 12px rgba(108,99,255,0.4)',
        }}>K</div>
        <div>
          <p style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#111827', margin: 0 }}>
            Kiwilearn
          </p>
          <p style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#6B7280', margin: 0 }}>
            Every study path in one place
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s ease',
                background: isActive
                  ? 'linear-gradient(135deg, #6C63FF20 0%, #EC489920 100%)'
                  : 'transparent',
                borderLeft: isActive ? '3px solid #6C63FF' : '3px solid transparent',
                color: isActive ? '#6C63FF' : isDark ? '#94A3B8' : '#6B7280',
              }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom accent */}
      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, #6C63FF 0%, #EC4899 100%)',
      }} />
    </aside>
  )
}