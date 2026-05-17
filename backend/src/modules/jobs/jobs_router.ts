import type { FastifyInstance } from 'fastify'
import { JobsController } from './jobs_controller.js'
import { JobsService } from './jobs_service.js'
import { JobsRepository } from './jobs_repository.js'

async function authenticate(request: any, reply: any) {
  try {
    await request.jwtVerify()
  } catch (err) {
    // Allow unauthenticated access for job search
  }
}

export async function jobsRouter(fastify: FastifyInstance) {
  const jobsRepository = new JobsRepository(fastify.prisma)
  const jobsService = new JobsService(jobsRepository)
  const jobsController = new JobsController(jobsService)

  // Public routes (optional auth for saved status)
  fastify.get('/', async (request, reply) => {
    return jobsController.searchJobs(request as any, reply as any)
  })

  fastify.get('/saved', { onRequest: [authenticate] }, async (request, reply) => {
    return jobsController.getSavedJobs(request as any, reply as any)
  })

  fastify.get('/:id', async (request, reply) => {
    return jobsController.getJob(request as any, reply as any)
  })

  // Protected routes
  fastify.post('/:id/save', { onRequest: [authenticate] }, async (request, reply) => {
    return jobsController.saveJob(request as any, reply as any)
  })

  fastify.delete('/:id/save', { onRequest: [authenticate] }, async (request, reply) => {
    return jobsController.unsaveJob(request as any, reply as any)
  })
}