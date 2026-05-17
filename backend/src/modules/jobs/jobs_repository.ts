import { PrismaClient } from '@prisma/client'

export class JobsRepository {
  constructor(private prisma: PrismaClient) {}

  async findMany(filters: {
    query?: string
    location?: string
  }, pagination: { page: number; limit: number }) {
    const where: any = {}

    if (filters.query) {
      where.OR = [
        { title: { contains: filters.query, mode: 'insensitive' } },
        { company: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
      ]
    }

    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' }
    }

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { fetchedAt: 'desc' },
      }),
      this.prisma.job.count({ where }),
    ])

    return { jobs, total }
  }

  async findById(id: string) {
    return this.prisma.job.findUnique({ where: { id } })
  }

  async findSavedByUser(userId: string) {
    return this.prisma.match.findMany({
      where: { userId, isSaved: true },
      include: { job: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async saveJob(userId: string, jobId: string, resumeProfileId: string) {
    // Check if match exists and update isSaved
    const existingMatch = await this.prisma.match.findFirst({
      where: { userId, jobId },
    })

    if (existingMatch) {
      return this.prisma.match.update({
        where: { id: existingMatch.id },
        data: { isSaved: true },
      })
    }

    // Create new match as saved
    return this.prisma.match.create({
      data: {
        userId,
        jobId,
        resumeProfileId,
        similarityScore: 0,
        matchReasons: [],
        isSaved: true,
      },
    })
  }

  async unsaveJob(userId: string, jobId: string) {
    return this.prisma.match.updateMany({
      where: { userId, jobId, isSaved: true },
      data: { isSaved: false },
    })
  }

  async isJobSaved(userId: string, jobId: string): Promise<boolean> {
    const saved = await this.prisma.match.findFirst({
      where: { userId, jobId, isSaved: true },
    })
    return !!saved
  }
}