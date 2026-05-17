import { FastifyRequest, FastifyReply } from 'fastify'
import { JobsService } from './jobs_service.js'
import { SearchJobsDto } from './dto/index.js'
import { NotFoundError } from '../../core/base/errors.js'

export class JobsController {
  constructor(private jobsService: JobsService) {}

  async searchJobs(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.id
    const query = request.query as any

    const result = await this.jobsService.searchJobs(query, userId)
    return reply.send(result)
  }

  async getJob(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const userId = (request.user as any)?.id
    const { id } = request.params

    const job = await this.jobsService.getJobById(id, userId)
    if (!job) {
      throw new NotFoundError('Job not found')
    }

    return reply.send(job)
  }

  async getSavedJobs(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.id

    const jobs = await this.jobsService.getSavedJobs(userId)
    return reply.send({ data: jobs })
  }

  async saveJob(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const userId = (request.user as any)?.id
    const { id } = request.params

    await this.jobsService.saveJob(userId, id)
    return reply.send({ message: 'Job saved successfully' })
  }

  async unsaveJob(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const userId = (request.user as any)?.id
    const { id } = request.params

    await this.jobsService.unsaveJob(userId, id)
    return reply.send({ message: 'Job unsaved successfully' })
  }
}