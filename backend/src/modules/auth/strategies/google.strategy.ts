import { IOAuthStrategy, OAuthTokens, OAuthUserInfo } from './oauth.strategy.js'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

export class GoogleStrategy implements IOAuthStrategy {
  readonly name = 'google'

  getAuthorizationUrl(params: {
    clientId: string
    redirectUri: string
    codeChallenge: string
    state: string
  }): string {
    const searchParams = new URLSearchParams({
      client_id: params.clientId,
      redirect_uri: params.redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      state: params.state,
      code_challenge: params.codeChallenge,
      code_challenge_method: 'S256',
      access_type: 'online',
    })

    return `${GOOGLE_AUTH_URL}?${searchParams.toString()}`
  }

  async exchangeCodeForTokens(params: {
    code: string
    codeVerifier: string
    clientId: string
    redirectUri: string
    clientSecret?: string
  }): Promise<OAuthTokens> {
    const bodyParams: Record<string, string> = {
      client_id: params.clientId,
      code: params.code,
      code_verifier: params.codeVerifier,
      grant_type: 'authorization_code',
      redirect_uri: params.redirectUri,
    }

    // Google requires client_secret for token exchange in production
    // but it should work without it for test users in development
    if (params.clientSecret) {
      bodyParams.client_secret = params.clientSecret
    }

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(bodyParams),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Google token exchange failed: ${error}`)
    }

    const data = await response.json() as {
      access_token: string
      expires_in?: number
      refresh_token?: string
    }
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      refreshToken: data.refresh_token,
    }
  }

  async getUserInfo(params: { accessToken: string }): Promise<OAuthUserInfo> {
    const response = await fetch(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get Google user info')
    }

    const data = await response.json() as {
      sub: string
      email: string
      name?: string
      picture?: string
    }
    return {
      provider: 'google',
      providerId: data.sub,
      email: data.email,
      name: data.name,
      avatarUrl: data.picture,
    }
  }
}