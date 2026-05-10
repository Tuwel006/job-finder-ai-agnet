import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { AuthController } from './auth_controller.js'
import { AuthService } from './auth_service.js'
import { AuthRepository } from './auth_repository.js'
import { OAuthService } from './oauth_service.js'
import { RefreshTokenService } from './refresh_token_service.js'
import { UnauthorizedError } from '../../core/base/errors.js'
import { logger } from '../../core/base/logger.js'
import { oauthCallbackSchema } from './dto/oauth-callback.dto.js'
import { z } from 'zod'

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    throw new UnauthorizedError('Please log in to continue')
  }
}

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
})

export async function authRouter(fastify: FastifyInstance) {
  const authRepository = new AuthRepository(fastify.prisma)
  const refreshTokenService = new RefreshTokenService(fastify.prisma)

  // Pass jwt.sign directly to service
  const authService = new AuthService(authRepository, (payload, options) =>
    fastify.jwt.sign(payload, options)
  )
  const authController = new AuthController(authService)

  // OAuth service with jwt signing function
  const oauthService = new OAuthService(authRepository, (payload, options) =>
    fastify.jwt.sign(payload, options)
  )

  // Public routes - NO auth hook
  fastify.post('/register', async (request, reply) => {
    return authController.register(request as any, reply)
  })

  fastify.post('/login', async (request, reply) => {
    return authController.login(request as any, reply)
  })

  // Refresh token endpoint (public - uses refresh token itself for auth)
  fastify.post('/refresh', async (request, reply) => {
    const parsed = refreshTokenSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ message: 'Refresh token required' })
    }

    try {
      const jwtSign = (payload: object, options?: { expiresIn: string }) =>
        fastify.jwt.sign(payload, options)
      const tokenPair = await refreshTokenService.refreshTokens(parsed.data.refreshToken, jwtSign)
      return reply.send(tokenPair)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Token refresh failed'
      return reply.status(401).send({ message })
    }
  })

  // OAuth routes
  fastify.get('/oauth/:provider', async (request, reply) => {
    const { provider } = request.params as { provider: string }
    if (!['google', 'linkedin', 'github'].includes(provider)) {
      return reply.status(400).send({ message: 'Invalid OAuth provider' })
    }

    try {
      const { redirectUrl, state } = await oauthService.initiateOAuth(provider)
      return reply.send({ redirectUrl, state })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'OAuth initiation failed'
      return reply.status(400).send({ message })
    }
  })

  fastify.get('/oauth/:provider/callback', async (request, reply) => {
    const { provider } = request.params as { provider: string }
    const { code, state } = request.query as { code?: string; state?: string }

    const parsed = oauthCallbackSchema.safeParse({ code, state })
    if (!parsed.success) {
      return reply.status(400).send({
        message: 'Invalid callback parameters',
        details: parsed.error.format(),
      })
    }

    try {
      const result = await oauthService.handleCallback(provider, parsed.data.code, parsed.data.state)
      return reply.send(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'OAuth callback failed'
      logger.error({ error: message, provider }, 'OAuth callback error')
      return reply.status(400).send({ message })
    }
  })

  // Protected routes - WITH auth hook
  fastify.get('/me', { onRequest: [authenticate] }, async (request, reply) => {
    return authController.me(request as any, reply)
  })

  fastify.post('/logout', { onRequest: [authenticate] }, async (request, reply) => {
    const userId = (request.user as any).id
    await refreshTokenService.revokeAllUserTokens(userId)
    return reply.send({ message: 'Logged out successfully' })
  })

  fastify.delete('/account', { onRequest: [authenticate] }, async (request, reply) => {
    return authController.deleteAccount(request as any, reply)
  })
}