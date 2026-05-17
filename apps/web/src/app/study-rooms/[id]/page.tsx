'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function StudyRoomPage() {
  const [room, setRoom] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const intervalRef = useRef<any>(null)
  const router = useRouter()
  const params = useParams()
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''

  useEffect(() => {
    fetchRoom()
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  const fetchRoom = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-rooms/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setRoom(data)
      setTimeLeft(data.goalMinutes * 60)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const progress = room ? ((room.goalMinutes * 60 - timeLeft) / (room.goalMinutes * 60)) * 100 : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/study-rooms')} className="text-gray-300 hover:text-white mb-6 block">
          ← Back to Study Rooms
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{room?.name}</h1>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
            {room?.subject}
          </span>
        </div>

        {/* Pomodoro Timer */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center mb-6">
          <h2 className="text-gray-300 text-lg mb-4">🍅 Pomodoro Timer</h2>
          
          {/* Progress Circle */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke="url(#gradient)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6"/>
                  <stop offset="100%" stopColor="#ec4899"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
            >
              {isRunning ? '⏸ Pause' : '▶ Start'}
            </button>
            <button
              onClick={() => { setIsRunning(false); setTimeLeft(room?.goalMinutes * 60) }}
              className="px-8 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Members */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h2 className="text-white font-semibold text-lg mb-4">👥 Members ({room?.members?.length || 0})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {room?.members?.map((member: any) => (
              <div key={member.id} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  {member.user?.name?.charAt(0) || '?'}
                </div>
                <p className="text-white text-sm font-medium truncate">{member.user?.name || 'Member'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}