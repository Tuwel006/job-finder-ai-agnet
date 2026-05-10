import { PrismaClient, User } from '@prisma/client'
import { NotFoundError, ConflictError } from '../../core/base/errors.js'
import { AUTH_PROVIDERS } from '../../core/shared/constants.js'

export class AuthRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  async findByProvider(provider: string, providerId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
    })
  }

  async create(data: {
    email: string
    passwordHash?: string
    name?: string
    avatarUrl?: string
    provider?: string
    providerId?: string
  }): Promise<User> {
    const existing = await this.findByEmail(data.email)
    if (existing) {
      throw new ConflictError('Email already registered')
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        avatarUrl: data.avatarUrl,
        provider: data.provider || AUTH_PROVIDERS.EMAIL,
        providerId: data.providerId,
      },
    })
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    return this.prisma.user.update({
      where: { id },
      data: data as any,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    })
  }
}