import type { FastifyInstance } from 'fastify'
import { ProfileController } from './profile_controller.js'
import { ProfileService } from './profile_service.js'
import { ProfileRepository } from './profile_repository.js'

async function authenticate(request: any, reply: any) {
  try {
    await request.jwtVerify()
  } catch (err) {
    throw new Error('Please log in to continue')
  }
}

export async function profileRouter(fastify: FastifyInstance) {
  const profileRepository = new ProfileRepository(fastify.prisma)
  const profileService = new ProfileService(profileRepository)
  const profileController = new ProfileController(profileService)

  // All routes are protected
  fastify.get('/', { onRequest: [authenticate] }, async (request, reply) => {
    return profileController.getProfile(request as any, reply as any)
  })

  fastify.patch('/', { onRequest: [authenticate] }, async (request, reply) => {
    return profileController.updateProfile(request as any, reply as any)
  })

  fastify.get('/resume', { onRequest: [authenticate] }, async (request, reply) => {
    return profileController.getResume(request as any, reply as any)
  })

  fastify.delete('/resume', { onRequest: [authenticate] }, async (request, reply) => {
    return profileController.deleteResume(request as any, reply as any)
  })
}