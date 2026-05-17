import type { FastifyInstance } from 'fastify'
import { PreparationController } from './preparation_controller.js'
import { PreparationService } from './preparation_service.js'
import { PreparationRepository } from './preparation_repository.js'

async function authenticate(request: any, reply: any) {
  try {
    await request.jwtVerify()
  } catch (err) {
    throw new Error('Please log in to continue')
  }
}

export async function preparationRouter(fastify: FastifyInstance) {
  const preparationRepository = new PreparationRepository(fastify.prisma)
  const preparationService = new PreparationService(preparationRepository)
  const preparationController = new PreparationController(preparationService)

  // All routes are protected
  fastify.get('/:matchId', { onRequest: [authenticate] }, async (request, reply) => {
    return preparationController.getPreparationMaterials(request as any, reply as any)
  })

  fastify.patch('/questions/:prepId/:questionIndex', { onRequest: [authenticate] }, async (request, reply) => {
    return preparationController.markQuestionPracticed(request as any, reply as any)
  })
}