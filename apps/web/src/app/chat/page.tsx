'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Socket = any

interface Message {
  id: string
  roomId: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

interface Room {
  id: string
  name: string
  members: { userId: string; userName: string }[]
  messages: Message[]
}

export default function ChatPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [activeRoom, setActiveRoom] = useState<Room | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [newRoomName, setNewRoomName] = useState('')
  const [showNewRoom, setShowNewRoom] = useState(false)
  const [typingUser, setTypingUser] = useState('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeout = useRef<any>(null)
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {}

  useEffect(() => {
    fetchRooms()
    import('socket.io-client').then(({ io }) => {
      const s = io(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/chat`)
      setSocket(s)
      s.on('newMessage', (msg: Message) => setMessages(prev => [...prev, msg]))
      s.on('userTyping', ({ userName }: { userName: string }) => {
        setTypingUser(userName)
        setTimeout(() => setTypingUser(''), 2000)
      })
    })
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/rooms`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setRooms(Array.isArray(data) ? data : [])
    } catch {}
  }

  const fetchMessages = async (roomId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/rooms/${roomId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch {}
  }

  const joinRoom = (room: Room) => {
    setActiveRoom(room)
    fetchMessages(room.id)
    if (socket) socket.emit('joinRoom', { roomId: room.id, userId: user.id, userName: user.name || 'User' })
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !activeRoom || !socket) return
    socket.emit('sendMessage', { roomId: activeRoom.id, userId: user.id, userName: user.name || 'User', content: newMessage.trim() })
    setNewMessage('')
  }

  const createRoom = async () => {
    if (!newRoomName.trim()) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newRoomName, members: [] })
      })
      const data = await res.json()
      setRooms(prev => [data, ...prev])
      setNewRoomName('')
      setShowNewRoom(false)
    } catch {}
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ago`
  }

  const colors = ['#6C63FF', '#10B981', '#F59E0B', '#EF4444', '#3B82F6']
  const getColor = (name: string) => colors[name.charCodeAt(0) % colors.length]

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8F9FA' }}>
      <div style={{ padding: '16px 24px', backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>?</button>
        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>?? Messages</h1>
      </div>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: '280px', backgroundColor: 'white', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px' }}>
            <button onClick={() => setShowNewRoom(!showNewRoom)} style={{ width: '100%', padding: '10px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>+ New Room</button>
            {showNewRoom && (
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                <input value={newRoomName} onChange={e => setNewRoomName(e.target.value)} onKeyDown={e => e.key === 'Enter' && createRoom()} placeholder="Room name..." style={{ flex: 1, padding: '8px 12px', borderRadius: '10px', border: '1px solid #E5E7EB', outline: 'none' }} />
                <button onClick={createRoom} style={{ padding: '8px 12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>?</button>
              </div>
            )}
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {rooms.map(room => (
              <div key={room.id} onClick={() => joinRoom(room)} style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: activeRoom?.id === room.id ? '#6C63FF10' : 'transparent', borderLeft: activeRoom?.id === room.id ? '3px solid #6C63FF' : '3px solid transparent' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: getColor(room.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{room.name.charAt(0).toUpperCase()}</div>
                <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{room.name}</p>
              </div>
            ))}
          </div>
        </div>
        {activeRoom ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 24px', backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' }}>
              <p style={{ fontWeight: 700, margin: 0 }}>{activeRoom.name}</p>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map(msg => {
                const isMe = msg.userId === user.id
                return (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: '8px' }}>
                    <div style={{ padding: '10px 14px', borderRadius: '18px', backgroundColor: isMe ? '#6C63FF' : 'white', color: isMe ? 'white' : '#111827', maxWidth: '65%' }}>{msg.content}</div>
                  </div>
                )
              })}
              {typingUser && <p style={{ fontSize: '12px', color: '#9CA3AF' }}>{typingUser} is typing...</p>}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: '16px', backgroundColor: 'white', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '12px' }}>
              <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid #E5E7EB', outline: 'none' }} />
              <button onClick={sendMessage} style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#6C63FF', border: 'none', cursor: 'pointer', color: 'white', fontSize: '18px' }}>?</button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#9CA3AF' }}>
            <p style={{ fontSize: '60px' }}>??</p>
            <p style={{ fontWeight: 600, color: '#374151' }}>Select a room to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
