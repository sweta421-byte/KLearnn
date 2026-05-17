'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-[var(--foreground)] text-xl font-semibold">Loading...</div>
      </div>
    )
  }

  const cards = [
    { icon: '🤖', title: 'AI Doubt Helper', desc: 'Get hints powered by Gemini AI', color: 'from-blue-500 to-cyan-500', href: '/doubts' },
    { icon: '📚', title: 'Study Rooms', desc: 'Join collaborative focus rooms', color: 'from-purple-500 to-pink-500', href: '/study-rooms' },
    { icon: '📝', title: 'Notes Marketplace', desc: 'Share and discover peer notes', color: 'from-orange-500 to-red-500', href: '/notes' },
    { icon: '👩‍🏫', title: 'Teacher Dashboard', desc: 'Manage classes and assignments', color: 'from-green-500 to-emerald-500', href: '/teacher' },
    { icon: '🛡️', title: 'Safety Center', desc: 'Anonymous concern reporting', color: 'from-red-500 to-pink-500', href: '/safety' },
    { icon: '📋', title: 'Assignments', desc: 'View and submit assignments', color: 'from-yellow-500 to-orange-500', href: '/assignments' },
    { icon: '🎓', title: 'Courses', desc: 'Browse and enroll in courses', color: 'from-indigo-500 to-purple-500', href: '/courses' },
    { icon: '📆', title: 'Calendar', desc: 'Manage your schedule and events', color: 'from-teal-500 to-cyan-500', href: '/calendar' },
    { icon: '📊', title: 'Reports', desc: 'Track your learning progress', color: 'from-pink-500 to-rose-500', href: '/reports' },
    { icon: '📎', title: 'Resources', desc: 'Your study materials library', color: 'from-amber-500 to-yellow-500', href: '/resources' },
    { icon: '⏱️', title: 'Focus Timer', desc: 'Stay focused with Pomodoro', color: 'from-violet-500 to-purple-500', href: '/focus' },
    { icon: '🏆', title: 'Achievements', desc: 'Track your learning milestones', color: 'from-yellow-400 to-orange-500', href: '/achievements' },
    { icon: '🆘', title: 'Support', desc: 'Help center and FAQ', color: 'from-slate-500 to-gray-500', href: '/support' },
    { icon: '⚙️', title: 'Settings', desc: 'Manage your account', color: 'from-gray-500 to-slate-600', href: '/settings' },
  ]

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-2xl shadow-lg">
                🥝
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#6C63FF]">
                  Dashboard
                </p>
                <h1 className="mt-2 text-2xl sm:text-4xl font-bold leading-tight text-[var(--foreground)]">
                  Welcome back,<br />
                  {user?.name?.split(' ')[0] ?? 'Learner'}
                </h1>
                <p className="mt-3 max-w-xl text-sm sm:text-base text-[var(--text-secondary)]">
                  Your learning workspace is ready with quick access tools, AI assistance, study rooms and progress tracking.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <span className="rounded-full bg-[#6C63FF]/10 px-4 py-2 text-sm font-semibold text-[#6C63FF]">
                {user?.role}
              </span>
              <button
                onClick={async () => { await logout(); router.push('/login') }}
                className="w-full sm:w-auto rounded-2xl bg-[#6C63FF] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]">
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Focus Timer', value: '⏱️', sub: 'Start session', href: '/focus' },
            { label: 'Achievements', value: '🏆', sub: 'View badges', href: '/achievements' },
            { label: 'Reports', value: '📊', sub: 'See progress', href: '/reports' },
            { label: 'Calendar', value: '📆', sub: 'View schedule', href: '/calendar' },
          ].map(stat => (
            <div key={stat.label} onClick={() => router.push(stat.href)}
              className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm cursor-pointer hover:-translate-y-1 transition-all hover:shadow-md text-center">
              <p style={{ fontSize: '28px', marginBottom: '4px' }}>{stat.value}</p>
              <p className="font-semibold text-sm text-[var(--foreground)]">{stat.label}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} onClick={() => router.push(card.href)}
              className="group rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer">
              <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${card.color} text-2xl shadow-md transition-transform group-hover:scale-110`}>
                {card.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--foreground)]">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                {card.desc}
              </p>
              <p className="mt-3 text-xs font-semibold text-[#6C63FF]">Open →</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}