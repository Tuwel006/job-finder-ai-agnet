import { PrismaClient } from '@prisma/client'

export class MatchesRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUser(userId: string, pagination: { page: number; limit: number }) {
    const [matches, total] = await Promise.all([
      this.prisma.match.findMany({
        where: { userId },
        include: {
          job: true,
        },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.match.count({ where: { userId } }),
    ])

    return { matches, total }
  }

  async findById(id: string) {
    return this.prisma.match.findUnique({
      where: { id },
      include: { job: true },
    })
  }

  async findByUserAndId(userId: string, matchId: string) {
    return this.prisma.match.findFirst({
      where: { id: matchId, userId },
      include: { job: true },
    })
  }

  async updateStatus(id: string, status: 'new' | 'viewed' | 'applied' | 'dismissed') {
    return this.prisma.match.update({
      where: { id },
      data: {
        isApplied: status === 'applied',
        appliedAt: status === 'applied' ? new Date() : undefined,
      },
    })
  }

  async delete(id: string) {
    return this.prisma.match.delete({ where: { id } })
  }
}