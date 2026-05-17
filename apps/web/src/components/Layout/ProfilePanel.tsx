'use client'
import { X } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export function ProfilePanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user, logout } = useAuth()
  const router = useRouter()

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white dark:bg-[#1A1A2E] shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <button onClick={onClose} className="absolute top-4 right-4">
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center mt-8">
            <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">{user?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            <button
              onClick={async () => {
                await logout()
                router.push('/login')
              }}
              className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
