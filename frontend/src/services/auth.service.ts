import { api } from '@/lib/api'
import type { User, AuthResponse, LoginRequest, RegisterRequest, OAuthRedirectResponse } from '@/types/auth'

// Types for API responses
export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RegisterResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface LogoutResponse {
  success: boolean
}

export interface ErrorResponse {
  message: string
  code?: string
}

// Auth Service - all auth-related API calls
export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/api/auth/login', credentials)
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>('/api/auth/register', data)
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    return api.post<RefreshTokenResponse>(
      '/api/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    )
  },

  /**
   * Initiate OAuth login with a provider
   */
  initiateOAuth: async (provider: 'google' | 'linkedin' | 'github'): Promise<OAuthRedirectResponse> => {
    return api.get<OAuthRedirectResponse>(`/api/auth/oauth/${provider}`)
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<LogoutResponse> => {
    return api.post<LogoutResponse>('/api/auth/logout')
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    return api.get<User>('/api/auth/me')
  },

  /**
   * Get OAuth session by session ID
   */
  getOAuthSession: async (sessionId: string): Promise<LoginResponse> => {
    return api.get<LoginResponse>(`/api/auth/oauth/session/${sessionId}`)
  },
}

// Token management helpers
export const tokenService = {
  /**
   * Store tokens in localStorage
   */
  setTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    }
  },

  /**
   * Get tokens from localStorage
   */
  getTokens: () => {
    if (typeof window === 'undefined') {
      return { accessToken: null, refreshToken: null }
    }
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    }
  },

  /**
   * Clear tokens from localStorage
   */
  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('accessToken')
  },
}

export default authService