'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { tokenService } from '@/services/auth.service'

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
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">JobFind</h1>
        <p className="text-text-secondary mt-2">Loading...</p>
      </div>
    </main>
  )
}