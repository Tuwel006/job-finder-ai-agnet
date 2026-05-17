import type { FastifyInstance } from 'fastify'
import { MatchesController } from './matches_controller.js'
import { MatchesService } from './matches_service.js'
import { MatchesRepository } from './matches_repository.js'

async function authenticate(request: any, reply: any) {
  try {
    await request.jwtVerify()
  } catch (err) {
    throw new Error('Please log in to continue')
  }
}

export async function matchesRouter(fastify: FastifyInstance) {
  const matchesRepository = new MatchesRepository(fastify.prisma)
  const matchesService = new MatchesService(matchesRepository)
  const matchesController = new MatchesController(matchesService)

  // All routes are protected
  fastify.get('/', { onRequest: [authenticate] }, async (request, reply) => {
    return matchesController.getMatches(request as any, reply as any)
  })

  fastify.get('/:id', { onRequest: [authenticate] }, async (request, reply) => {
    return matchesController.getMatch(request as any, reply as any)
  })

  fastify.patch('/:id', { onRequest: [authenticate] }, async (request, reply) => {
    return matchesController.updateMatchStatus(request as any, reply as any)
  })

  fastify.delete('/:id', { onRequest: [authenticate] }, async (request, reply) => {
    return matchesController.dismissMatch(request as any, reply as any)
  })
}