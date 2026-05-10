import { IOAuthStrategy, OAuthTokens, OAuthUserInfo } from './oauth.strategy.js'

const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization'
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken'
const LINKEDIN_USERINFO_URL = 'https://api.linkedin.com/v2/userinfo'

export class LinkedInStrategy implements IOAuthStrategy {
  readonly name = 'linkedin'

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
    })

    return `${LINKEDIN_AUTH_URL}?${searchParams.toString()}`
  }

  async exchangeCodeForTokens(params: {
    code: string
    codeVerifier: string
    clientId: string
    redirectUri: string
  }): Promise<OAuthTokens> {
    const response = await fetch(LINKEDIN_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: params.clientId,
        code: params.code,
        code_verifier: params.codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: params.redirectUri,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`LinkedIn token exchange failed: ${error}`)
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
    const response = await fetch(LINKEDIN_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get LinkedIn user info')
    }

    const data = await response.json() as {
      sub: string
      email: string
      name?: string
      picture?: string
    }
    return {
      provider: 'linkedin',
      providerId: data.sub,
      email: data.email,
      name: data.name,
      avatarUrl: data.picture,
    }
  }
}