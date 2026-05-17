import { FastifyRequest, FastifyReply } from 'fastify'
import { MatchesService } from './matches_service.js'
import { NotFoundError } from '../../core/base/errors.js'

export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  async getMatches(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.id
    const { page = '1', limit = '20' } = request.query as any

    const result = await this.matchesService.getMatches(userId, parseInt(page), parseInt(limit))
    return reply.send(result)
  }

  async getMatch(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const userId = (request.user as any)?.id
    const { id } = request.params

    const match = await this.matchesService.getMatchById(userId, id)
    if (!match) {
      throw new NotFoundError('Match not found')
    }

    return reply.send(match)
  }

  async updateMatchStatus(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const userId = (request.user as any)?.id
    const { id } = request.params
    const { status } = request.body as any

    await this.matchesService.updateMatchStatus(userId, id, status)
    return reply.send({ message: 'Match status updated' })
  }

  async dismissMatch(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const userId = (request.user as any)?.id
    const { id } = request.params

    await this.matchesService.dismissMatch(userId, id)
    return reply.send({ message: 'Match dismissed' })
  }
}