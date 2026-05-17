import { FastifyRequest, FastifyReply } from 'fastify'
import { ProfileService } from './profile_service.js'
import { NotFoundError } from '../../core/base/errors.js'

export class ProfileController {
  constructor(private profileService: ProfileService) {}

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.id

    const profile = await this.profileService.getProfile(userId)
    if (!profile) {
      throw new NotFoundError('User not found')
    }

    return reply.send(profile)
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.id
    const data = request.body as any

    const profile = await this.profileService.updateProfile(userId, data)
    if (!profile) {
      throw new NotFoundError('User not found')
    }

    return reply.send(profile)
  }

  async getResume(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.id

    const resume = await this.profileService.getResume(userId)
    return reply.send(resume || { message: 'No resume found' })
  }

  async deleteResume(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.id

    await this.profileService.deleteResume(userId)
    return reply.send({ message: 'Resume deleted successfully' })
  }
}