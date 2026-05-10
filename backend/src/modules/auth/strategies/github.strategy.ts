import { IOAuthStrategy, OAuthTokens, OAuthUserInfo } from './oauth.strategy.js'

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const GITHUB_USERINFO_URL = 'https://api.github.com/user'
const GITHUB_EMAILS_URL = 'https://api.github.com/user/emails'

export class GitHubStrategy implements IOAuthStrategy {
  readonly name = 'github'

  getAuthorizationUrl(params: {
    clientId: string
    redirectUri: string
    codeChallenge: string
    state: string
  }): string {
    const searchParams = new URLSearchParams({
      client_id: params.clientId,
      redirect_uri: params.redirectUri,
      scope: 'user:email',
      state: params.state,
      code_challenge: params.codeChallenge,
      code_challenge_method: 'S256',
    })

    return `${GITHUB_AUTH_URL}?${searchParams.toString()}`
  }

  async exchangeCodeForTokens(params: {
    code: string
    codeVerifier: string
    clientId: string
    redirectUri: string
  }): Promise<OAuthTokens> {
    const response = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
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
      throw new Error(`GitHub token exchange failed: ${error}`)
    }

    const data = await response.json() as {
      access_token: string
    }
    return {
      accessToken: data.access_token,
      expiresIn: undefined,
      refreshToken: undefined,
    }
  }

  async getUserInfo(params: { accessToken: string }): Promise<OAuthUserInfo> {
    const userResponse = await fetch(GITHUB_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    })

    if (!userResponse.ok) {
      throw new Error('Failed to get GitHub user info')
    }

    const userData = await userResponse.json() as {
      id: number
      name?: string
      login: string
      avatar_url?: string
      email?: string
    }

    let email = userData.email
    if (!email) {
      const emailsResponse = await fetch(GITHUB_EMAILS_URL, {
        headers: {
          Authorization: `Bearer ${params.accessToken}`,
          Accept: 'application/vnd.github+json',
        },
      })

      if (emailsResponse.ok) {
        const emails = await emailsResponse.json() as Array<{
          email: string
          primary: boolean
          verified: boolean
        }>
        const primaryEmail = emails.find((e) => e.primary && e.verified)
        email = primaryEmail?.email || emails[0]?.email
      }
    }

    if (!email) {
      throw new Error('GitHub account has no accessible email')
    }

    return {
      provider: 'github',
      providerId: String(userData.id),
      email,
      name: userData.name || userData.login,
      avatarUrl: userData.avatar_url,
    }
  }
}