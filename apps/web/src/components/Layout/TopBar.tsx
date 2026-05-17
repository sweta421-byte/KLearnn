'use client'

import { Menu, Grid, Smartphone, Moon, Sun } from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'

interface TopBarProps {
  onProfileClick: () => void
  isDark: boolean
  toggleTheme: () => void
  viewMode: 'desktop' | 'phone'
  toggleViewMode: () => void
  isMobile?: boolean
  onMenuClick?: () => void
}

export function TopBar({
  onProfileClick,
  isDark,
  toggleTheme,
  viewMode,
  toggleViewMode,
  isMobile = false,
  onMenuClick,
}: TopBarProps) {
  const { toggleSidebar } = useSidebar()

  const barStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '64px',
    background: 'linear-gradient(135deg, #6C63FF 0%, #EC4899 100%)',
    borderBottom: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    zIndex: 50,
    boxShadow: '0 4px 20px rgba(108,99,255,0.3)',
  }

  const btnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(8px)',
  }

  const iconBtnStyle = {
    ...btnStyle,
    padding: '8px',
  }

  const ghostBtnStyle = {
    ...btnStyle,
    backgroundColor: 'transparent',
  }

  return (
    <header style={barStyle}>
      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button style={ghostBtnStyle} onClick={isMobile ? onMenuClick : toggleSidebar}>
          <Menu size={20} color="white" />
        </button>

        <span style={{ fontWeight: 800, color: 'white', fontSize: '20px', letterSpacing: '-0.5px' }}>
          Kiwilearn
        </span>

        {!isMobile && (
          <div style={{ marginLeft: '4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: 0 }}>
              Welcome back
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', margin: 0 }}>
              A brighter learning experience starts here.
            </p>
          </div>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

        {/* Phone view toggle */}
        {!isMobile && (
          <button style={btnStyle} onClick={toggleViewMode}>
            {viewMode === 'desktop' ? <Smartphone size={16} color="white" /> : <Grid size={16} color="white" />}
            <span style={{ fontSize: '14px', color: 'white' }}>
              {viewMode === 'desktop' ? 'Phone view' : 'Desktop view'}
            </span>
          </button>
        )}

        {/* Dark mode toggle */}
        <button style={isMobile ? iconBtnStyle : btnStyle} onClick={toggleTheme}>
          {isDark
            ? <Sun size={16} color="white" />
            : <Moon size={16} color="white" />}
          {!isMobile && (
            <span style={{ fontSize: '14px', color: 'white' }}>
              {isDark ? 'Light mode' : 'Dark mode'}
            </span>
          )}
        </button>

        {/* Profile button */}
        <button style={isMobile ? iconBtnStyle : btnStyle} onClick={onProfileClick}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.25)',
            border: '2px solid rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 700,
          }}>
            S
          </div>
          {!isMobile && <span style={{ fontSize: '14px', color: 'white' }}>Profile</span>}
        </button>
      </div>
    </header>
  )
}