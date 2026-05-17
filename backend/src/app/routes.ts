import type { FastifyInstance } from 'fastify'
import { authRouter } from '../modules/auth/auth_router.js'
import { jobsRouter } from '../modules/jobs/jobs_router.js'
import { matchesRouter } from '../modules/matches/matches_router.js'
import { profileRouter } from '../modules/profile/profile_router.js'
import { preparationRouter } from '../modules/preparation/preparation_router.js'
import healthRouter from './health.js'

export async function registerRoutes(fastify: FastifyInstance) {
  // Health check routes (no prefix)
  fastify.register(healthRouter)

  // Auth routes
  fastify.register(authRouter, { prefix: '/api/auth' })

  // Jobs routes
  fastify.register(jobsRouter, { prefix: '/api/jobs' })

  // Matches routes
  fastify.register(matchesRouter, { prefix: '/api/matches' })

  // Profile routes
  fastify.register(profileRouter, { prefix: '/api/profile' })

  // Preparation routes
  fastify.register(preparationRouter, { prefix: '/api/preparation' })
}