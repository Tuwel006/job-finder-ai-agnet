'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth_store'
import type { LoginRequest, RegisterRequest, User } from '@/types/auth'

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  login: (credentials: LoginRequest) => Promise<boolean>
  register: (data: RegisterRequest) => Promise<boolean>
  logout: () => Promise<void>
  clearError: () => void
  setAuth: (accessToken: string, refreshToken: string, user: any) => void
}

export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const store = useAuthStore()
  const { login: storeLogin, register: storeRegister, logout: storeLogout } = store

  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    const success = await storeLogin(credentials)
    if (success) {
      router.push('/dashboard')
    }
    return success
  }, [storeLogin, router])

  const register = useCallback(async (data: RegisterRequest): Promise<boolean> => {
    const success = await storeRegister(data)
    if (success) {
      router.push('/dashboard')
    }
    return success
  }, [storeRegister, router])

  const logout = useCallback(async (): Promise<void> => {
    await storeLogout()
    router.push('/login')
  }, [storeLogout, router])

  const clearError = useCallback(() => {
    store.clearError()
  }, [store])

  const setAuth = useCallback((accessToken: string, refreshToken: string, user: any) => {
    store.setAuth(accessToken, refreshToken, user)
  }, [store])

  return {
    user: store.user,
    isLoading: store.isLoading,
    isAuthenticated: store.isAuthenticated,
    error: store.error,
    login,
    register,
    logout,
    clearError,
    setAuth,
  }
}

export default useAuth