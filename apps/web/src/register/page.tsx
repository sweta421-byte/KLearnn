'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT' as 'STUDENT' | 'TEACHER' | 'PARENT',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await register(formData.email, formData.password, formData.name, formData.role)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🥝</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Join KiwiLearn</h1>
          <p className="text-gray-300 mt-2">Create your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">I am a...</label>
            <div className="grid grid-cols-3 gap-2">
              {(['STUDENT', 'TEACHER', 'PARENT'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({...formData, role})}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    formData.role === role
                      ? 'bg-green-500 text-white'
                      : 'bg-white/5 text-gray-300 border border-white/20 hover:bg-white/10'
                  }`}
                >
                  {role === 'STUDENT' ? '📚 Student' : role === 'TEACHER' ? '👩‍🏫 Teacher' : '👪 Parent'}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-green-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}