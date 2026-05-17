'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function FocusTimerPage() {
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const [showComplete, setShowComplete] = useState(false)
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState<{id: string, text: string, done: boolean}[]>([])
  const [newTask, setNewTask] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const modes = {
    focus: { label: '🎯 Focus', time: 25 * 60, color: '#6C63FF' },
    short: { label: '☕ Short Break', time: 5 * 60, color: '#10B981' },
    long: { label: '🌴 Long Break', time: 15 * 60, color: '#3B82F6' },
  }

  useEffect(() => {
    setTimeLeft(modes[mode].time)
    setIsRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [mode])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setIsRunning(false)
            if (mode === 'focus') {
              setSessions(s => s + 1)
              setTotalFocusTime(t => t + 25)
              setShowComplete(true)
              setTimeout(() => setShowComplete(false), 4000)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, mode])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100
  const circumference = 2 * Math.PI * 120

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(modes[mode].time)
  }

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return
    setTasks([...tasks, { id: Date.now().toString(), text: newTask, done: false }])
    setNewTask('')
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? {...t, done: !t.done} : t))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', padding: '24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
            ← Back to Dashboard
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>⏱️ Focus Timer</h1>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>Stay focused with Pomodoro technique</p>
        </div>

        {showComplete && (
          <div style={{ padding: '16px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '12px', marginBottom: '24px', textAlign: 'center', fontSize: '16px', fontWeight: 600 }}>
            🎉 Focus session complete! Take a break!
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>

          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', backgroundColor: 'white', padding: '8px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {Object.entries(modes).map(([key, val]) => (
                <button key={key} onClick={() => setMode(key as any)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                    backgroundColor: mode === key ? val.color : 'transparent',
                    color: mode === key ? 'white' : '#6B7280',
                  }}>
                  {val.label}
                </button>
              ))}
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '48px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <input type="text" value={task} onChange={(e) => setTask(e.target.value)}
                placeholder="What are you working on?"
                style={{ width: '100%', padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', marginBottom: '40px', textAlign: 'center', boxSizing: 'border-box' }} />

              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '40px' }}>
                <svg width="280" height="280" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="140" cy="140" r="120" fill="none" stroke="#F3F4F6" strokeWidth="12" />
                  <circle cx="140" cy="140" r="120" fill="none"
                    stroke={modes[mode].color} strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (progress / 100) * circumference}
                    strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <p style={{ fontSize: '52px', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-2px' }}>
                    {formatTime(timeLeft)}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>{modes[mode].label}</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button onClick={handleReset}
                  style={{ padding: '14px 28px', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '15px' }}>
                  ↺ Reset
                </button>
                <button onClick={() => setIsRunning(!isRunning)}
                  style={{ padding: '14px 48px', backgroundColor: modes[mode].color, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '16px' }}>
                  {isRunning ? '⏸ Pause' : '▶ Start'}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '16px' }}>
              {[
                { label: 'Sessions', value: sessions, icon: '🎯' },
                { label: 'Focus Time', value: `${totalFocusTime}m`, icon: '⏱️' },
                { label: 'Tasks Done', value: tasks.filter(t => t.done).length, icon: '✅' },
              ].map(stat => (
                <div key={stat.label} style={{ backgroundColor: 'white', borderRadius: '14px', padding: '16px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <p style={{ fontSize: '22px', marginBottom: '4px' }}>{stat.icon}</p>
                  <p style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>{stat.value}</p>
                  <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>📋 Session Tasks</h3>

            <form onSubmit={addTask} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a task..."
                style={{ flex: 1, padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px' }} />
              <button type="submit"
                style={{ padding: '10px 14px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                +
              </button>
            </form>

            {tasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280' }}>
                <p style={{ fontSize: '32px' }}>📝</p>
                <p style={{ fontSize: '14px' }}>Add tasks to track during your focus session!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tasks.map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', backgroundColor: t.done ? '#F0FDF4' : '#F9FAFB', border: `1px solid ${t.done ? '#86EFAC' : '#E5E7EB'}` }}>
                    <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#6C63FF' }} />
                    <span style={{ flex: 1, fontSize: '13px', color: t.done ? '#6B7280' : '#111827', textDecoration: t.done ? 'line-through' : 'none' }}>
                      {t.text}
                    </span>
                    <button onClick={() => deleteTask(t.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '14px' }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#F5F3FF', borderRadius: '12px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#6C63FF', marginBottom: '8px' }}>🍅 Pomodoro Technique</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { step: '1', text: '25 min focus session', color: '#6C63FF' },
                  { step: '2', text: '5 min short break', color: '#10B981' },
                  { step: '3', text: 'After 4 sessions: 15 min long break', color: '#3B82F6' },
                ].map(s => (
                  <div key={s.step} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: s.color, color: 'white', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.step}</span>
                    <span style={{ fontSize: '12px', color: '#374151' }}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}