'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => setVisible(true), 80)
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const px = (mousePos.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.012
  const py = (mousePos.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.012

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 30% 40%,#1a0533 0%,#080818 50%),radial-gradient(ellipse at 80% 80%,#0d1a3d 0%,transparent 60%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden', fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-22px)} }
        @keyframes gridMove { 0%{background-position:0 0} 100%{background-position:60px 60px} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(108,99,255,0.5)} 50%{box-shadow:0 0 50px rgba(236,72,153,0.7),0 0 80px rgba(108,99,255,0.4)} }
        @keyframes shimmer { 0%{left:-100%} 100%{left:200%} }
        @keyframes orb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-30px)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,40px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .loginBtn:hover { transform: translateY(-2px) !important; box-shadow: 0 16px 50px rgba(108,99,255,0.55) !important; }
        .inputField:focus { border-color: #6C63FF !important; box-shadow: 0 0 0 3px rgba(108,99,255,0.2) !important; outline: none !important; }
        .backBtn:hover { color: #6C63FF !important; }
      `}</style>

      {/* Grid bg */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(rgba(108,99,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,0.6) 1px,transparent 1px)', backgroundSize: '60px 60px', animation: 'gridMove 10s linear infinite' }} />

      {/* Orbs */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(108,99,255,0.25) 0%,transparent 70%)', animation: 'orb1 12s ease-in-out infinite', filter: 'blur(25px)' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,0.2) 0%,transparent 70%)', animation: 'orb2 15s ease-in-out infinite', filter: 'blur(30px)' }} />

      {/* Floating cards */}
      <div style={{ position: 'absolute', top: '20%', left: '5%', animation: 'float 6s ease-in-out infinite', zIndex: 2, transform: `translateX(${px * -1.2}px) translateY(${py * -1.2}px)`, transition: 'transform 0.15s ease' }}>
        <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', borderRadius: '16px', padding: '14px 18px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 40px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '22px' }}>🏆</span>
            <div>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Achievement</p>
              <p style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 700, margin: 0 }}>7 Day Streak! 🔥</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '25%', right: '4%', animation: 'float2 7s ease-in-out infinite', zIndex: 2, transform: `translateX(${px * 1.2}px) translateY(${py * 1.2}px)`, transition: 'transform 0.15s ease' }}>
        <div style={{ background: 'rgba(16,185,129,0.12)', backdropFilter: 'blur(16px)', borderRadius: '14px', padding: '12px 16px', border: '1px solid rgba(16,185,129,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981' }} />
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: 600, margin: 0 }}>342 students online</p>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '60%', left: '3%', animation: 'float 9s ease-in-out infinite 2s', zIndex: 2 }}>
        <div style={{ background: 'rgba(108,99,255,0.12)', backdropFilter: 'blur(16px)', borderRadius: '14px', padding: '12px 16px', border: '1px solid rgba(108,99,255,0.3)' }}>
          <p style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 600, margin: 0 }}>⭐ 4.9/5 Rating</p>
        </div>
      </div>

      {/* Main card */}
      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10, opacity: visible ? 1 : 0, animation: visible ? 'slideUp 0.8s ease both' : 'none' }}>

        {/* Back to home */}
        <button className="backBtn" onClick={() => router.push('/')}
          style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s', padding: 0 }}>
          ← Back to home
        </button>

        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(30px)', borderRadius: '28px', padding: '40px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px', animation: 'glow 3s ease-in-out infinite', boxShadow: '0 8px 32px rgba(108,99,255,0.4)' }}>K</div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>Welcome back</h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: '6px', fontSize: '14px' }}>Sign in to your Kiwilearn account</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', color: '#FCA5A5' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '8px', display: 'block', fontWeight: 500 }}>Email address</label>
              <input className="inputField" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', color: 'white', fontSize: '15px', boxSizing: 'border-box', transition: 'all 0.2s' }} />
            </div>

            <div>
              <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '8px', display: 'block', fontWeight: 500 }}>Password</label>
              <input className="inputField" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', color: 'white', fontSize: '15px', boxSizing: 'border-box', transition: 'all 0.2s' }} />
            </div>

            <button className="loginBtn" type="submit" disabled={isLoading}
              style={{ width: '100%', padding: '15px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', color: 'white', fontWeight: 700, fontSize: '16px', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, transition: 'all 0.3s ease', marginTop: '4px', position: 'relative', overflow: 'hidden' }}>
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Signing in...
                </span>
              ) : (
                <span style={{ position: 'relative', zIndex: 1 }}>Sign In →</span>
              )}
              {!isLoading && <div style={{ position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)', animation: 'shimmer 2.5s infinite' }} />}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>NEW HERE?</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <Link href="/register" style={{ textDecoration: 'none' }}>
            <button style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}>
              Create Free Account ✨
            </button>
          </Link>

        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '20px' }}>© 2026 Kiwilearn • Free forever</p>
      </div>
    </div>
  )
}