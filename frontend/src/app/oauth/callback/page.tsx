'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Flex, Text, Spinner } from '@/components/ui'
import toast from 'react-hot-toast'
import { authService } from '@/services/auth.service'
import { useAuth } from '@/hooks/useAuth'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const { setAuth } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const requestStarted = useRef(false)

  useEffect(() => {
    if (requestStarted.current) return
    requestStarted.current = true

    const sessionId = new URLSearchParams(window.location.search).get('sessionId')
    const errorParam = new URLSearchParams(window.location.search).get('error')

    if (errorParam) {
      setError(errorParam)
      toast.error(`Authentication failed: ${errorParam}`)
      setTimeout(() => router.push('/login'), 3000)
      return
    }

    if (!sessionId) {
      setError('Invalid callback parameters')
      toast.error('Invalid OAuth callback')
      setTimeout(() => router.push('/login'), 3000)
      return
    }

    authService.getOAuthSession(sessionId)
      .then((data) => {
        setAuth(data.accessToken, data.refreshToken, data.user)
        toast.success(`Welcome, ${data.user.name}!`)
        router.push('/')
      })
      .catch((err) => {
        const message = err?.response?.data?.message || 'Authentication failed'
        setError(message)
        toast.error(message)
        setTimeout(() => router.push('/login'), 3000)
      })
  }, [router, setAuth])

  if (error) {
    return (
      <Flex direction="col" align="center" justify="center" className="min-h-[60vh]">
        <Text variant="h3" className="text-red-500 mb-2">
          Authentication Failed
        </Text>
        <Text variant="body" className="text-text-secondary">
          {error}
        </Text>
        <Text variant="small" className="text-text-secondary mt-4">
          Redirecting to login page...
        </Text>
      </Flex>
    )
  }

  return (
    <Flex direction="col" align="center" justify="center" className="min-h-[60vh]">
      <Spinner size="lg" />
      <Text variant="body" className="mt-4 text-text-secondary">
        Completing sign in...
      </Text>
    </Flex>
  )
}