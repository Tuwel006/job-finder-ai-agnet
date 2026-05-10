export interface OAuthUserInfo {
  provider: string
  providerId: string
  email: string
  name?: string
  avatarUrl?: string
}

export interface OAuthTokens {
  accessToken: string
  expiresIn?: number
  refreshToken?: string
}

export interface IOAuthStrategy {
  readonly name: string
  getAuthorizationUrl(params: {
    clientId: string
    redirectUri: string
    codeChallenge: string
    state: string
  }): string
  exchangeCodeForTokens(params: {
    code: string
    codeVerifier: string
    clientId: string
    redirectUri: string
    clientSecret?: string
  }): Promise<OAuthTokens>
  getUserInfo(params: { accessToken: string }): Promise<OAuthUserInfo>
}