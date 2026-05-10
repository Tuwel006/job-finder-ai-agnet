import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { AuthController } from './auth_controller.js'
import { AuthService } from './auth_service.js'
import { AuthRepository } from './auth_repository.js'
import { UnauthorizedError } from '../../core/base/errors.js'

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    throw new UnauthorizedError('Please log in to continue')
  }
}

export async function authRouter(fastify: FastifyInstance) {
  const authRepository = new AuthRepository(fastify.prisma)
  // Pass jwt.sign directly to service
  const authService = new AuthService(authRepository, (payload, options) =>
    fastify.jwt.sign(payload, options)
  )
  const authController = new AuthController(authService)

  // Public routes - NO auth hook
  fastify.post('/register', async (request, reply) => {
    return authController.register(request as any, reply)
  })

  fastify.post('/login', async (request, reply) => {
    return authController.login(request as any, reply)
  })

  // Protected routes - WITH auth hook
  fastify.get('/me', { onRequest: [authenticate] }, async (request, reply) => {
    return authController.me(request as any, reply)
  })

  fastify.post('/logout', { onRequest: [authenticate] }, async (request, reply) => {
    return authController.logout(request as any, reply)
  })

  fastify.delete('/account', { onRequest: [authenticate] }, async (request, reply) => {
    return authController.deleteAccount(request as any, reply)
  })
}