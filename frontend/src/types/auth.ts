export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  provider: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface OAuthRedirectResponse {
  redirectUrl: string
  state: string
}