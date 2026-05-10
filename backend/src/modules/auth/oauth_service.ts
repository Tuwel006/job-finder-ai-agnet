import { AuthRepository } from './auth_repository.js'
import { GoogleStrategy, LinkedInStrategy, GitHubStrategy, IOAuthStrategy } from './strategies/index.js'
import { generateCodeVerifier, generateCodeChallenge, generateState } from './utils/pkce.js'
import { redis } from '../../infrastructure/db/redis/redis_client.js'
import config from '../../core/base/config.js'
import { logger } from '../../core/base/logger.js'
import type { AuthResponse } from './dto/auth-response.dto.js'

const OAUTH_STATE_PREFIX = 'oauth:state:'
const OAUTH_VERIFIER_PREFIX = 'oauth:verifier:'
const OAUTH_STATE_TTL = 300 // 5 minutes

export class OAuthService {
  private strategies: Map<string, IOAuthStrategy>
  private jwtSign: (payload: object, options?: { expiresIn: string }) => string

  constructor(
    private authRepository: AuthRepository,
    jwtSign: (payload: object, options?: { expiresIn: string }) => string
  ) {
    this.strategies = new Map<string, IOAuthStrategy>([
      ['google', new GoogleStrategy()],
      ['linkedin', new LinkedInStrategy()],
      ['github', new GitHubStrategy()],
    ])
    this.jwtSign = jwtSign
  }

  async initiateOAuth(provider: string): Promise<{ redirectUrl: string; state: string }> {
    const strategy = this.strategies.get(provider)
    if (!strategy) {
      throw new Error(`Unsupported OAuth provider: ${provider}`)
    }

    const clientId = this.getClientId(provider)
    const redirectUri = this.getCallbackUrl(provider)

    // Generate PKCE parameters
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    const state = generateState()

    // Store state and verifier in Redis
    await redis.setex(`${OAUTH_STATE_PREFIX}${state}`, OAUTH_STATE_TTL, provider)
    await redis.setex(`${OAUTH_VERIFIER_PREFIX}${state}`, OAUTH_STATE_TTL, codeVerifier)

    // Generate authorization URL
    const redirectUrl = strategy.getAuthorizationUrl({
      clientId,
      redirectUri,
      codeChallenge,
      state,
    })

    logger.info({ provider, state }, 'OAuth flow initiated')

    return { redirectUrl, state }
  }

  async handleCallback(
    provider: string,
    code: string,
    state: string
  ): Promise<AuthResponse> {
    // Validate state
    const storedProvider = await redis.get(`${OAUTH_STATE_PREFIX}${state}`)
    if (!storedProvider || storedProvider !== provider) {
      throw new Error('Invalid OAuth state')
    }

    // Get code verifier
    const codeVerifier = await redis.get(`${OAUTH_VERIFIER_PREFIX}${state}`)
    if (!codeVerifier) {
      throw new Error('OAuth state expired or invalid')
    }

    // Clean up state and verifier
    await redis.del(`${OAUTH_STATE_PREFIX}${state}`)
    await redis.del(`${OAUTH_VERIFIER_PREFIX}${state}`)

    const strategy = this.strategies.get(provider)
    if (!strategy) {
      throw new Error(`Unsupported OAuth provider: ${provider}`)
    }

    const clientId = this.getClientId(provider)
    const redirectUri = this.getCallbackUrl(provider)

    // Exchange code for tokens
    const tokens = await strategy.exchangeCodeForTokens({
      code,
      codeVerifier,
      clientId,
      redirectUri,
      clientSecret: this.getClientSecret(provider),
    })

    // Get user info
    const userInfo = await strategy.getUserInfo({ accessToken: tokens.accessToken })

    logger.info({ provider, email: userInfo.email }, 'OAuth user info retrieved')

    // Find or create user
    let user = await this.authRepository.findByProvider(provider, userInfo.providerId)

    if (!user) {
      user = await this.authRepository.create({
        email: userInfo.email,
        name: userInfo.name,
        avatarUrl: userInfo.avatarUrl,
        provider: provider,
        providerId: userInfo.providerId,
      })
      logger.info({ userId: user.id, provider }, 'OAuth user created')
    }

    // Generate JWT tokens
    const accessToken = this.jwtSign({ id: user.id }, { expiresIn: '15m' })
    const refreshToken = this.jwtSign({ id: user.id, type: 'refresh' }, { expiresIn: '7d' })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        provider: user.provider || provider,
      },
      accessToken,
      refreshToken,
    }
  }

  private getClientId(provider: string): string {
    const clientIds: Record<string, string> = {
      google: config.oauth.google.clientId,
      linkedin: config.oauth.linkedin.clientId,
      github: config.oauth.github.clientId,
    }
    const clientId = clientIds[provider]
    if (!clientId) {
      throw new Error(`${provider} OAuth not configured`)
    }
    return clientId
  }

  private getClientSecret(provider: string): string {
    const clientSecrets: Record<string, string> = {
      google: config.oauth.google.clientSecret,
      linkedin: config.oauth.linkedin.clientSecret,
      github: config.oauth.github.clientSecret,
    }
    return clientSecrets[provider] || ''
  }

  private getCallbackUrl(provider: string): string {
    return `${config.oauth.callbackUrl}/${provider}/callback`
  }
}