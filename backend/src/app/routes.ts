import type { FastifyInstance } from 'fastify'
import { authRouter } from '../modules/auth/auth_router.js'
import healthRouter from './health.js'

export async function registerRoutes(fastify: FastifyInstance) {
  // Health check routes (no prefix)
  fastify.register(healthRouter)

  // Auth routes
  fastify.register(authRouter, { prefix: '/api/auth' })

  // Future routes will be added here
  // fastify.register(jobsRouter, { prefix: '/api/jobs' })
  // fastify.register(resumeRouter, { prefix: '/api/resume' })
  // fastify.register(matchingRouter, { prefix: '/api/matching' })
  // fastify.register(preparationRouter, { prefix: '/api/preparation' })
}