import { PrismaClient } from '@prisma/client'

export class PreparationRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUserAndMatchId(userId: string, matchId: string) {
    return this.prisma.match.findFirst({
      where: {
        id: matchId,
        userId,
      },
      include: {
        job: true,
        resumeProfile: true,
      },
    })
  }

  async findMaterialByUserAndMatchId(userId: string, matchId: string) {
    // Find match to get jobId
    const match = await this.prisma.match.findFirst({
      where: { id: matchId, userId },
    })
    if (!match) return null

    return this.prisma.preparationMaterial.findFirst({
      where: {
        userId,
        jobId: match.jobId,
      },
    })
  }

  async upsertMaterial(userId: string, jobId: string, type: string, content: any) {
    return this.prisma.preparationMaterial.upsert({
      where: {
        userId_jobId_type: {
          userId,
          jobId,
          type,
        },
      },
      create: {
        userId,
        jobId,
        type,
        content,
      },
      update: {
        content,
      },
    })
  }

  async findQuestionById(id: string) {
    // This would need to be stored in content JSON
    return null
  }

  async updateQuestionPracticed(prepId: string, questionIndex: number, practiced: boolean) {
    const prep = await this.prisma.preparationMaterial.findUnique({
      where: { id: prepId },
    })
    if (!prep) return null

    const content = prep.content as any
    if (content.questions && content.questions[questionIndex]) {
      content.questions[questionIndex].practiced = practiced
    }

    return this.prisma.preparationMaterial.update({
      where: { id: prepId },
      data: { content },
    })
  }
}