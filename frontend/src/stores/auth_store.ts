import { create } from 'zustand'
import type { User } from '@/types/auth'
import { tokenService } from '@/services/auth.service'
import { authService } from '@/services/auth.service'
import type { LoginRequest, RegisterRequest } from '@/types/auth'
import toast from 'react-hot-toast'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

interface AuthActions {
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  login: (credentials: LoginRequest) => Promise<boolean>
  register: (data: RegisterRequest) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => void
  setAuth: (accessToken: string, refreshToken: string, user: User) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>((set, get) => ({
  // State
  user: null,
  isLoading: false,
  isAuthenticated: tokenService.isAuthenticated(),
  error: null,

  // Actions
  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  login: async (credentials: LoginRequest): Promise<boolean> => {
    const { setLoading, setError, setUser } = get()
    setLoading(true)
    setError(null)

    try {
      const response = await authService.login(credentials)
      tokenService.setTokens(response.accessToken, response.refreshToken)
      setUser(response.user)
      set({ isAuthenticated: true })
      toast.success('Successfully logged in!')
      return true
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Login failed'
      setError(message)
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  },

  register: async (data: RegisterRequest): Promise<boolean> => {
    const { setLoading, setError, setUser } = get()
    setLoading(true)
    setError(null)

    try {
      const response = await authService.register(data)
      tokenService.setTokens(response.accessToken, response.refreshToken)
      setUser(response.user)
      set({ isAuthenticated: true })
      toast.success('Account created successfully!')
      return true
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Registration failed'
      setError(message)
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  },

  logout: async (): Promise<void> => {
    const { setLoading, setUser } = get()
    setLoading(true)

    try {
      await authService.logout()
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      tokenService.clearTokens()
      setUser(null)
      set({ isAuthenticated: false })
      toast.success('Logged out successfully')
    }
  },

  checkAuth: () => {
    const isAuthenticated = tokenService.isAuthenticated()
    set({ isAuthenticated })
  },

  setAuth: (accessToken: string, refreshToken: string, user: User) => {
    tokenService.setTokens(accessToken, refreshToken)
    set({ user, isAuthenticated: true })
  },
}))

export default useAuthStore