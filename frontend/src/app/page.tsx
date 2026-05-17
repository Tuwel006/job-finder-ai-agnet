'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { tokenService } from '@/services/auth.service'
import { Spinner } from '@/components/ui'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (tokenService.isAuthenticated()) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center space-y-4 animate-fade-in">
        {/* Logo */}
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 ring-4 ring-primary/10 animate-float">
          <span className="text-white font-bold text-3xl">J</span>
        </div>

        {/* Brand */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-primary tracking-tight">JobFind</h1>
          <p className="text-text-secondary text-sm">Loading your experience...</p>
        </div>

        {/* Spinner */}
        <div className="flex justify-center pt-4">
          <Spinner size="lg" className="text-primary/60" />
        </div>
      </div>
    </main>
  )
}