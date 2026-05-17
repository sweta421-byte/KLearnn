'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    if (!isLoading && user) router.push('/dashboard')
  }, [user, isLoading, router])

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouse)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setActiveFeature(prev => (prev + 1) % 8), 2500)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#080818' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#6C63FF', borderRightColor: '#EC4899', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  if (user) return null

  const features = [
    { icon: '🤖', title: 'AI Doubt Helper', desc: 'Instant AI-powered answers to any academic question', color: '#8B5CF6' },
    { icon: '📚', title: 'Study Rooms', desc: 'Real-time collaborative study with focus timers', color: '#6366F1' },
    { icon: '📝', title: 'Notes Marketplace', desc: 'Discover and share top student notes', color: '#EC4899' },
    { icon: '🎓', title: 'Online Courses', desc: 'Structured lessons with progress tracking', color: '#14B8A6' },
    { icon: '📈', title: 'Analytics', desc: 'Deep insights into your learning journey', color: '#F97316' },
    { icon: '🏆', title: 'Achievements', desc: 'Badges, streaks and leaderboard rankings', color: '#F59E0B' },
    { icon: '👩‍🏫', title: 'Teacher Connect', desc: 'Personalized guidance from expert teachers', color: '#10B981' },
    { icon: '🛡️', title: 'Safe Learning', desc: 'Secure environment for all students', color: '#3B82F6' },
  ]

  const stats = [
    { value: '10K+', label: 'Students', icon: '👨‍🎓' },
    { value: '500+', label: 'Teachers', icon: '👩‍🏫' },
    { value: '50K+', label: 'Notes', icon: '📝' },
    { value: '99%', label: 'Satisfaction', icon: '⭐' },
  ]

  const testimonials = [
    { name: 'Priya Sharma', grade: 'Class 12', text: 'Scored 95% in boards! The AI doubt helper answered everything instantly.', avatar: 'P', color: '#8B5CF6' },
    { name: 'Rahul Verma', grade: 'Class 10', text: 'Study rooms made group study so productive and fun!', avatar: 'R', color: '#EC4899' },
    { name: 'Ananya Singh', grade: 'Class 11', text: 'Notes marketplace saved hours every week. Best platform ever!', avatar: 'A', color: '#14B8A6' },
  ]

  const px = (mousePos.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.015
  const py = (mousePos.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.015

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden', background: '#080818' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-18px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-24px)} }
        @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes slideUp { from{opacity:0;transform:translateY(50px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes orb1 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(50px,-30px)} 66%{transform:translate(-20px,40px)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-40px,20px)} 66%{transform:translate(30px,-50px)} }
        @keyframes shimmer { 0%{left:-100%} 100%{left:200%} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(108,99,255,0.4)} 50%{box-shadow:0 0 50px rgba(236,72,153,0.6),0 0 80px rgba(108,99,255,0.3)} }
        @keyframes gridMove { 0%{background-position:0 0} 100%{background-position:60px 60px} }
        @keyframes ringRotate { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes ringRotateR { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(-360deg)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .hoverCard:hover { transform: translateY(-8px) scale(1.02) !important; }
        .ctaBtn:hover { transform: translateY(-3px) scale(1.03) !important; box-shadow: 0 20px 60px rgba(108,99,255,0.55) !important; }
        .navBtn:hover { opacity: 0.85 !important; transform: scale(1.04) !important; }
        .statCard:hover { transform: translateY(-6px) !important; }
        .testCard:hover { transform: translateY(-8px) !important; }
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#080818} ::-webkit-scrollbar-thumb{background:linear-gradient(#6C63FF,#EC4899);border-radius:3px}
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: scrolled ? 'rgba(8,8,24,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(108,99,255,0.2)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '18px', animation: 'glow 3s ease-in-out infinite' }}>K</div>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>Kiwilearn</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="navBtn" onClick={() => router.push('/login')}
            style={{ padding: '10px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.06)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}>
            Login
          </button>
          <button className="navBtn" onClick={() => router.push('/register')}
            style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 20px rgba(108,99,255,0.4)', transition: 'all 0.2s' }}>
            Get Started Free ✨
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 20% 50%,#1a0533 0%,#080818 50%),radial-gradient(ellipse at 80% 20%,#0d1a3d 0%,transparent 60%)', position: 'relative', overflow: 'hidden', padding: '120px 24px 80px' }}>

        {/* Grid bg */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(rgba(108,99,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,0.6) 1px,transparent 1px)', backgroundSize: '60px 60px', animation: 'gridMove 10s linear infinite' }} />

        {/* Orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '8%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(108,99,255,0.28) 0%,transparent 70%)', animation: 'orb1 14s ease-in-out infinite', filter: 'blur(25px)' }} />
        <div style={{ position: 'absolute', bottom: '8%', right: '8%', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,0.22) 0%,transparent 70%)', animation: 'orb2 18s ease-in-out infinite', filter: 'blur(35px)' }} />

        {/* Floating card 1 - top right */}
        <div style={{ position: 'absolute', top: '18%', right: '6%', animation: 'float 6s ease-in-out infinite', zIndex: 2 }}>
          <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', transform: `rotateY(-12deg) rotateX(6deg) translateX(${px * 1.5}px) translateY(${py * 1.5}px)`, transition: 'transform 0.15s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg,#8B5CF6,#6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🤖</div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>AI Assistant</p>
                <p style={{ fontSize: '13px', color: 'white', fontWeight: 600, margin: 0 }}>Doubt Solved! ✅</p>
              </div>
            </div>
            <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)' }}>
              <div style={{ height: '100%', width: '85%', borderRadius: '2px', background: 'linear-gradient(90deg,#6C63FF,#EC4899)' }} />
            </div>
          </div>
        </div>

        {/* Floating card 2 - bottom left */}
        <div style={{ position: 'absolute', bottom: '22%', left: '5%', animation: 'float2 7s ease-in-out infinite', zIndex: 2 }}>
          <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', transform: `rotateY(12deg) rotateX(-6deg) translateX(${px * -1.2}px) translateY(${py * -1.2}px)`, transition: 'transform 0.15s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px' }}>🏆</span>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>Achievement Unlocked</p>
                <p style={{ fontSize: '13px', color: '#F59E0B', fontWeight: 700, margin: 0 }}>7 Day Streak! 🔥</p>
              </div>
            </div>
          </div>
        </div>

        {/* Online badge */}
        <div style={{ position: 'absolute', top: '32%', left: '4%', animation: 'float 8s ease-in-out infinite 2s', zIndex: 2 }}>
          <div style={{ background: 'rgba(16,185,129,0.15)', backdropFilter: 'blur(16px)', borderRadius: '14px', padding: '10px 16px', border: '1px solid rgba(16,185,129,0.35)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <p style={{ fontSize: '12px', color: '#10B981', fontWeight: 600, margin: 0 }}>342 students online</p>
            </div>
          </div>
        </div>

        {/* Rating badge */}
        <div style={{ position: 'absolute', bottom: '32%', right: '4%', animation: 'float2 9s ease-in-out infinite 1s', zIndex: 2 }}>
          <div style={{ background: 'rgba(236,72,153,0.15)', backdropFilter: 'blur(16px)', borderRadius: '14px', padding: '10px 16px', border: '1px solid rgba(236,72,153,0.35)' }}>
            <p style={{ fontSize: '12px', color: '#EC4899', fontWeight: 600, margin: 0 }}>⭐ 4.9/5 from 10K+ students</p>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ textAlign: 'center', maxWidth: '820px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(108,99,255,0.18)', border: '1px solid rgba(108,99,255,0.38)', borderRadius: '30px', padding: '8px 20px', marginBottom: '32px', backdropFilter: 'blur(10px)', opacity: visible ? 1 : 0, animation: visible ? 'fadeIn 0.8s ease' : 'none' }}>
            <span>🚀</span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>India's #1 AI-Powered Learning Platform</span>
            <span style={{ background: 'linear-gradient(90deg,#6C63FF,#EC4899)', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', color: 'white', fontWeight: 700 }}>NEW</span>
          </div>

          <h1 style={{ fontSize: 'clamp(46px, 7.5vw, 78px)', fontWeight: 900, lineHeight: 1.05, marginBottom: '24px', letterSpacing: '-2px', opacity: visible ? 1 : 0, animation: visible ? 'slideUp 1s ease 0.2s both' : 'none' }}>
            <span style={{ color: 'white', display: 'block' }}>The Future of</span>
            <span style={{ background: 'linear-gradient(135deg,#6C63FF 0%,#EC4899 50%,#F59E0B 100%)', backgroundSize: '200% 200%', animation: 'gradShift 4s ease infinite', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'block' }}>Student Learning</span>
          </h1>

          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto 48px', opacity: visible ? 1 : 0, animation: visible ? 'slideUp 1s ease 0.4s both' : 'none' }}>
            AI tutoring, collaborative study rooms, notes marketplace, and analytics — all in one beautiful platform.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', opacity: visible ? 1 : 0, animation: visible ? 'slideUp 1s ease 0.6s both' : 'none' }}>
            <button className="ctaBtn" onClick={() => router.push('/register')}
              style={{ padding: '18px 44px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', color: 'white', fontWeight: 800, cursor: 'pointer', fontSize: '16px', boxShadow: '0 8px 40px rgba(108,99,255,0.4)', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}>
              <span style={{ position: 'relative', zIndex: 1 }}>🎓 Start Learning Free</span>
              <div style={{ position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)', animation: 'shimmer 2.5s infinite' }} />
            </button>
            <button className="ctaBtn" onClick={() => router.push('/login')}
              style={{ padding: '18px 44px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.06)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '16px', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }}>
              Login →
            </button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginTop: '20px', letterSpacing: '0.06em' }}>✨ FREE FOREVER &nbsp;•&nbsp; 23 FEATURES &nbsp;•&nbsp; NO CREDIT CARD</p>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', animation: 'bounce 2s ease-in-out infinite' }}>
          <div style={{ width: '28px', height: '46px', border: '2px solid rgba(255,255,255,0.18)', borderRadius: '14px', display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
            <div style={{ width: '4px', height: '8px', background: 'linear-gradient(#6C63FF,#EC4899)', borderRadius: '2px', animation: 'float 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ background: 'linear-gradient(180deg,#080818 0%,#0d0d24 100%)', padding: '80px 48px', borderTop: '1px solid rgba(108,99,255,0.12)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
          {stats.map((stat, i) => (
            <div key={stat.label} className="statCard"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '32px 20px', textAlign: 'center', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,#6C63FF,#EC4899)' }} />
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>{stat.icon}</div>
              <p style={{ fontSize: '42px', fontWeight: 900, margin: 0, letterSpacing: '-2px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{stat.value}</p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '6px', fontWeight: 500 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ background: '#0d0d24', padding: '120px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#6C63FF', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '14px' }}>FEATURES</p>
            <h2 style={{ fontSize: 'clamp(34px,5vw,52px)', fontWeight: 900, color: 'white', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '14px' }}>
              Everything to <span style={{ background: 'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>excel</span>
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.4)', maxWidth: '460px', margin: '0 auto' }}>23 powerful features for effective and fun learning</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
            {/* Active feature card */}
            <div style={{ background: `linear-gradient(135deg,${features[activeFeature].color}25,${features[activeFeature].color}08)`, border: `1px solid ${features[activeFeature].color}44`, borderRadius: '32px', padding: '48px', transition: 'all 0.5s ease', boxShadow: `0 30px 80px ${features[activeFeature].color}20` }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>{features[activeFeature].icon}</div>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: 'white', marginBottom: '12px' }}>{features[activeFeature].title}</h3>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '28px' }}>{features[activeFeature].desc}</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                {features.map((_, i) => (
                  <div key={i} onClick={() => setActiveFeature(i)} style={{ height: '4px', flex: 1, borderRadius: '2px', background: i === activeFeature ? features[activeFeature].color : 'rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.3s' }} />
                ))}
              </div>
            </div>

            {/* Feature grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {features.map((f, i) => (
                <div key={i} className="hoverCard" onClick={() => setActiveFeature(i)}
                  style={{ background: i === activeFeature ? `${f.color}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${i === activeFeature ? f.color + '55' : 'rgba(255,255,255,0.07)'}`, borderRadius: '16px', padding: '18px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                  <div style={{ fontSize: '26px', marginBottom: '8px' }}>{f.icon}</div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'white', margin: 0 }}>{f.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background: 'linear-gradient(180deg,#0d0d24,#080818)', padding: '120px 48px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#EC4899', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '14px' }}>HOW IT WORKS</p>
            <h2 style={{ fontSize: 'clamp(34px,5vw,52px)', fontWeight: 900, color: 'white', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
              Up and running in <span style={{ background: 'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>3 minutes</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '32px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '56px', left: '18%', right: '18%', height: '2px', background: 'linear-gradient(90deg,#6C63FF,#EC4899)', opacity: 0.25 }} />
            {[
              { step: '01', icon: '✍️', title: 'Create Account', desc: 'Sign up free in 30 seconds. No credit card needed.', color: '#6C63FF' },
              { step: '02', icon: '🎯', title: 'Set Your Goals', desc: 'Tell us your subjects, grade and learning goals.', color: '#8B5CF6' },
              { step: '03', icon: '🚀', title: 'Start Learning', desc: 'Access AI tutor, study rooms, notes and more!', color: '#EC4899' },
            ].map((item, i) => (
              <div key={item.step} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '88px', height: '88px', borderRadius: '28px', background: `linear-gradient(135deg,${item.color}33,${item.color}11)`, border: `1px solid ${item.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px', margin: '0 auto 24px', boxShadow: `0 20px 50px ${item.color}22`, animation: `float ${6 + i}s ease-in-out infinite ${i * 1.5}s` }}>{item.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: item.color, letterSpacing: '0.15em', marginBottom: '10px' }}>STEP {item.step}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'white', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ background: '#080818', padding: '120px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#F59E0B', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '14px' }}>TESTIMONIALS</p>
            <h2 style={{ fontSize: 'clamp(34px,5vw,52px)', fontWeight: 900, color: 'white', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
              Students <span style={{ background: 'linear-gradient(135deg,#EC4899,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>love</span> Kiwilearn
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="testCard" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '32px', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,${t.color},transparent)` }} />
                <div style={{ display: 'flex', gap: '3px', marginBottom: '18px' }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#F59E0B', fontSize: '15px' }}>★</span>)}
                </div>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: '24px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg,${t.color},${t.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '17px', boxShadow: `0 4px 16px ${t.color}44` }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'white', margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{t.grade}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg,#0d0020,#0a0a2e 50%,#1a0010)', padding: '120px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(108,99,255,0.12)' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(108,99,255,0.18) 0%,transparent 70%)', transform: 'translate(-50%,-50%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '480px', height: '480px', border: '1px solid rgba(108,99,255,0.1)', borderRadius: '50%', animation: 'ringRotate 25s linear infinite' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '680px', height: '680px', border: '1px solid rgba(236,72,153,0.07)', borderRadius: '50%', animation: 'ringRotateR 35s linear infinite' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#6C63FF', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px' }}>GET STARTED TODAY</p>
          <h2 style={{ fontSize: 'clamp(38px,6vw,62px)', fontWeight: 900, color: 'white', marginBottom: '20px', letterSpacing: '-2px', lineHeight: 1.1 }}>
            Ready to transform<br />your learning? 🚀
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.5)', marginBottom: '48px', maxWidth: '460px', margin: '0 auto 48px' }}>
            Join 10,000+ students already learning smarter.
          </p>
          <button className="ctaBtn" onClick={() => router.push('/register')}
            style={{ padding: '20px 56px', borderRadius: '18px', border: 'none', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', color: 'white', fontWeight: 800, cursor: 'pointer', fontSize: '18px', boxShadow: '0 8px 40px rgba(108,99,255,0.4)', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>🎓 Start Learning Free Today</span>
            <div style={{ position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)', animation: 'shimmer 2s infinite' }} />
          </button>
          <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: '13px', marginTop: '20px', letterSpacing: '0.08em' }}>✨ FREE &nbsp;•&nbsp; 23 FEATURES &nbsp;•&nbsp; NO CREDIT CARD</p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#040410', padding: '36px 48px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '16px' }}>K</div>
            <span style={{ fontSize: '17px', fontWeight: 800, color: 'white' }}>Kiwilearn</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: '13px' }}>© 2026 Kiwilearn. The Future of Student Learning.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Contact'].map(link => (
              <span key={link} style={{ color: 'rgba(255,255,255,0.28)', fontSize: '13px', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#6C63FF')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}>
                {link}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}