import bcrypt from 'bcrypt'
import { AuthRepository } from './auth_repository.js'
import { registerSchema } from './dto/register.dto.js'
import { loginSchema } from './dto/login.dto.js'
import type { RegisterDto } from './dto/register.dto.js'
import type { LoginDto } from './dto/login.dto.js'
import { UnauthorizedError, NotFoundError } from '../../core/base/errors.js'
import { logger } from '../../core/base/logger.js'
import type { AuthResponse, UserResponse } from './dto/auth-response.dto.js'

const SALT_ROUNDS = 12

export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtSign: (payload: object, options?: { expiresIn: string }) => string
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    logger.info({ email: dto.email }, 'Register called - STEP 1')
    const validated = registerSchema.parse(dto)
    logger.info('STEP 1 passed - schema validated')

    logger.info('STEP 2: Hash password')
    let passwordHash: string
    try {
      passwordHash = await bcrypt.hash(validated.password, SALT_ROUNDS)
      logger.info('STEP 2 passed - hash:', passwordHash.substring(0, 20) + '...')
    } catch (hashError) {
      logger.error({ error: hashError }, 'STEP 2 FAILED - hash error')
      throw hashError
    }

    logger.info('STEP 3: Call repository create')
    let user
    try {
      user = await this.authRepository.create({
        email: validated.email,
        passwordHash,
        name: validated.name,
      })
      logger.info({ user }, 'STEP 3 passed - user created')
    } catch (createError) {
      logger.error({ error: createError }, 'STEP 3 FAILED - create error')
      throw createError
    }

    logger.info('STEP 4: Generate auth response')
    const result = this.generateAuthResponse(user)
    logger.info('STEP 4 passed')

    return result
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const validated = loginSchema.parse(dto)

    const user = await this.authRepository.findByEmail(validated.email)
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const isValid = await bcrypt.compare(validated.password, user.passwordHash)
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials')
    }

    return this.generateAuthResponse(user)
  }

  async oauthLogin(
    provider: string,
    providerId: string,
    email: string,
    name?: string,
    avatarUrl?: string
  ): Promise<AuthResponse> {
    let user = await this.authRepository.findByProvider(provider, providerId)

    if (!user) {
      user = await this.authRepository.create({
        email,
        name,
        avatarUrl,
        provider,
        providerId,
      })
    }

    return this.generateAuthResponse(user)
  }

  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await this.authRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    return this.mapUserResponse(user)
  }

  async logout(userId: string): Promise<void> {
    logger.info({ userId }, 'User logged out')
  }

  async deleteAccount(userId: string): Promise<void> {
    await this.authRepository.delete(userId)
  }

  private generateAuthResponse(user: any): AuthResponse {
    const accessToken = this.jwtSign(
      { id: user.id },
      { expiresIn: '15m' }
    )
    const refreshToken = this.jwtSign(
      { id: user.id, type: 'refresh' },
      { expiresIn: '7d' }
    )

    return {
      user: this.mapUserResponse(user),
      accessToken,
      refreshToken,
    }
  }

  private mapUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      provider: user.provider || 'email',
    }
  }
}