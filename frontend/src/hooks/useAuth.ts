'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authService, tokenService } from '@/services/auth.service'
import type { LoginRequest, RegisterRequest, User } from '@/types/auth'

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<boolean>
  register: (data: RegisterRequest) => Promise<boolean>
  logout: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isAuthenticated = tokenService.isAuthenticated()

  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await authService.login(credentials)
      tokenService.setTokens(response.accessToken, response.refreshToken)
      setUser(response.user)
      toast.success('Successfully logged in!')
      return true
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Login failed'
      toast.error(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (data: RegisterRequest): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await authService.register(data)
      tokenService.setTokens(response.accessToken, response.refreshToken)
      setUser(response.user)
      toast.success('Account created successfully!')
      return true
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Registration failed'
      toast.error(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      await authService.logout()
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      tokenService.clearTokens()
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/login')
      setIsLoading(false)
    }
  }, [router])

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  }
}

export default useAuth