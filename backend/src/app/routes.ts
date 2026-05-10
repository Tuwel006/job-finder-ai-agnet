import type { FastifyInstance } from 'fastify'
import { authRouter } from '../modules/auth/auth_router.js'

export async function registerRoutes(fastify: FastifyInstance) {
  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  }))

  // Auth routes
  fastify.register(authRouter, { prefix: '/api/auth' })

  // Future routes will be added here
  // fastify.register(jobsRouter, { prefix: '/api/jobs' })
  // fastify.register(resumeRouter, { prefix: '/api/resume' })
  // fastify.register(matchingRouter, { prefix: '/api/matching' })
  // fastify.register(preparationRouter, { prefix: '/api/preparation' })
}