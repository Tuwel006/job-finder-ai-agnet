import { PrismaClient } from '@prisma/client'

export class ProfileRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
        resumeProfiles: {
          where: { deletedAt: null },
          select: {
            id: true,
            parsedJson: true,
            resumeScore: true,
          },
          take: 1,
        },
      },
    })
  }

  async update(id: string, data: {
    name?: string
    email?: string
  }) {
    return this.prisma.user.update({
      where: { id },
      data,
    })
  }

  async getResume(userId: string) {
    return this.prisma.resumeProfile.findFirst({
      where: { userId, deletedAt: null },
    })
  }

  async deleteResume(userId: string) {
    // Soft delete - set deletedAt
    return this.prisma.resumeProfile.updateMany({
      where: { userId, deletedAt: null },
      data: { deletedAt: new Date() },
    })
  }
}