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
    const { io: ioClient } = await import('socket.io-client'); const s = ioClient(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'}/chat`)
    setSocket(s)

    s.on('newMessage', (msg: Message) => {
      setMessages(prev => [...prev, msg])
    })

    s.on('userTyping', ({ userName }: { userName: string }) => {
      setTypingUser(userName)
      setTimeout(() => setTypingUser(''), 2000)
    })

    s.on('userJoined', ({ userName }: { userName: string }) => {
      console.log(`${userName} joined`)
    })

    return () => { s.disconnect() }
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
    if (activeRoom && socket) {
      socket.emit('leaveRoom', { roomId: activeRoom.id })
    }
    setActiveRoom(room)
    fetchMessages(room.id)
    if (socket) {
      socket.emit('joinRoom', { roomId: room.id, userId: user.id, userName: user.name || 'User' })
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !activeRoom || !socket) return
    socket.emit('sendMessage', {
      roomId: activeRoom.id,
      userId: user.id,
      userName: user.name || 'User',
      content: newMessage.trim(),
    })
    setNewMessage('')
  }

  const handleTyping = () => {
    if (!activeRoom || !socket) return
    socket.emit('typing', { roomId: activeRoom.id, userName: user.name || 'User' })
    clearTimeout(typingTimeout.current)
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
      joinRoom(data)
    } catch {}
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ago`
  }

  const colors = ['#6C63FF', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899']
  const getColor = (name: string) => colors[name.charCodeAt(0) % colors.length]

  return (
    <div style={{ height: '100vh', backgroundColor: '#F8F9FA', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '16px 24px', backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => router.push('/dashboard')}
          style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>
          ←
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>💬 Messages</h1>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar — Room List */}
        <div style={{ width: '280px', backgroundColor: 'white', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #F3F4F6' }}>
            <button onClick={() => setShowNewRoom(!showNewRoom)}
              style={{ width: '100%', padding: '10px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
              + New Chat Room
            </button>
            {showNewRoom && (
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                <input
                  value={newRoomName}
                  onChange={e => setNewRoomName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && createRoom()}
                  placeholder="Room name..."
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', outline: 'none' }}
                />
                <button onClick={createRoom}
                  style={{ padding: '8px 12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>
                  ✓
                </button>
              </div>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {rooms.length === 0 ? (
              <div style={{ padding: '40px 16px', textAlign: 'center', color: '#9CA3AF' }}>
                <p style={{ fontSize: '32px' }}>💬</p>
                <p style={{ fontSize: '13px' }}>No rooms yet. Create one!</p>
              </div>
            ) : (
              rooms.map(room => (
                <div key={room.id} onClick={() => joinRoom(room)}
                  style={{
                    padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                    backgroundColor: activeRoom?.id === room.id ? '#6C63FF10' : 'transparent',
                    borderLeft: activeRoom?.id === room.id ? '3px solid #6C63FF' : '3px solid transparent',
                  }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: getColor(room.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>
                    {room.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>{room.name}</p>
                    <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {room.messages?.[0]?.content || 'No messages yet'}
                    </p>
                  </div>
                  {room.messages?.[0] && (
                    <span style={{ fontSize: '10px', color: '#9CA3AF', flexShrink: 0 }}>{timeAgo(room.messages[0].createdAt)}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {activeRoom ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Room Header */}
            <div style={{ padding: '16px 24px', backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: getColor(activeRoom.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                {activeRoom.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>{activeRoom.name}</p>
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '1px' }}>{activeRoom.members?.length || 0} members</p>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}>
                  <p style={{ fontSize: '40px' }}>👋</p>
                  <p style={{ fontWeight: 600, color: '#374151' }}>Start the conversation!</p>
                  <p style={{ fontSize: '13px' }}>Be the first to send a message</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.userId === user.id
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '8px' }}>
                      {!isMe && (
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: getColor(msg.userName), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
                          {msg.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ maxWidth: '65%' }}>
                        {!isMe && <p style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', marginLeft: '4px' }}>{msg.userName}</p>}
                        <div style={{
                          padding: '10px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          backgroundColor: isMe ? '#6C63FF' : 'white',
                          color: isMe ? 'white' : '#111827',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          fontSize: '14px', lineHeight: 1.5,
                        }}>
                          {msg.content}
                        </div>
                        <p style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '4px', textAlign: isMe ? 'right' : 'left' }}>{timeAgo(msg.createdAt)}</p>
                      </div>
                    </div>
                  )
                })
              )}
              {typingUser && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ padding: '10px 14px', borderRadius: '18px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{typingUser} is typing...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{ padding: '16px 24px', backgroundColor: 'white', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                value={newMessage}
                onChange={e => { setNewMessage(e.target.value); handleTyping() }}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Type a message..."
                style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', backgroundColor: '#F9FAFB' }}
              />
              <button onClick={sendMessage}
                style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: newMessage.trim() ? '#6C63FF' : '#E5E7EB', border: 'none', cursor: newMessage.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                ➤
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#9CA3AF' }}>
            <p style={{ fontSize: '60px' }}>💬</p>
            <p style={{ fontSize: '18px', fontWeight: 600, color: '#374151' }}>Select a room to start chatting</p>
            <p style={{ fontSize: '14px' }}>Or create a new chat room</p>
          </div>
        )}
      </div>
    </div>
  )
}
