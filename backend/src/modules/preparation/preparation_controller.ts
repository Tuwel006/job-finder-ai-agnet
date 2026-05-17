import { FastifyRequest, FastifyReply } from 'fastify'
import { PreparationService } from './preparation_service.js'
import { NotFoundError } from '../../core/base/errors.js'

export class PreparationController {
  constructor(private preparationService: PreparationService) {}

  async getPreparationMaterials(request: FastifyRequest<{ Params: { matchId: string } }>, reply: FastifyReply) {
    const userId = (request.user as any)?.id
    const { matchId } = request.params

    const prep = await this.preparationService.getPreparationMaterials(userId, matchId)
    if (!prep) {
      throw new NotFoundError('Preparation materials not found')
    }

    return reply.send(prep)
  }

  async markQuestionPracticed(request: FastifyRequest<{ Params: { prepId: string; questionIndex: string } }>, reply: FastifyReply) {
    const { prepId, questionIndex } = request.params
    const { practiced } = request.body as any

    await this.preparationService.markQuestionPracticed(
      (request.user as any)?.id,
      prepId,
      parseInt(questionIndex),
      practiced
    )
    return reply.send({ message: 'Question updated' })
  }
}