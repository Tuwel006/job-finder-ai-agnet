import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { PrismaClient, RefreshToken } from '@prisma/client'
import { UnauthorizedError } from '../../core/base/errors.js'
import { logger } from '../../core/base/logger.js'

const SALT_ROUNDS = 12

export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface TokenPayload {
  userId: string
  type: 'access' | 'refresh'
}

export class RefreshTokenService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Hash a refresh token for secure storage
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  /**
   * Generate a cryptographically secure random token
   */
  private generateToken(): string {
    return crypto.randomBytes(32).toString('base64url')
  }

  /**
   * Create new token pair for a user
   */
  async createTokenPair(
    userId: string,
    jwtSign: (payload: object, options?: { expiresIn: string }) => string
  ): Promise<TokenPair> {
    const refreshToken = this.generateToken()
    const refreshTokenHash = this.hashToken(refreshToken)

    // Refresh token expires in 7 days
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Store hashed refresh token
    await this.prisma.refreshToken.create({
      data: {
        tokenHash: refreshTokenHash,
        userId,
        expiresAt,
      },
    })

    // Generate access token
    const accessToken = jwtSign({ id: userId }, { expiresIn: '15m' })

    // Generate refresh token with embedded userId for quick validation
    const refreshTokenJwt = jwtSign({ id: userId, type: 'refresh', jti: refreshTokenHash }, { expiresIn: '7d' })

    logger.info({ userId }, 'Token pair created')

    return {
      accessToken,
      refreshToken: refreshTokenJwt,
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    }
  }

  /**
   * Refresh tokens - validate old token and issue new pair
   */
  async refreshTokens(
    refreshTokenJwt: string,
    jwtSign: (payload: object, options?: { expiresIn: string }) => string
  ): Promise<TokenPair> {
    // Parse the refresh token to get the token hash
    // In production, you'd decode the JWT to get jti (token hash)
    // For simplicity, we'll validate the token content directly
    const payload = this.decodeRefreshToken(refreshTokenJwt)

    if (!payload || payload.type !== 'refresh') {
      throw new UnauthorizedError('Invalid refresh token')
    }

    const userId = payload.id as string
    const tokenHash = payload.jti as string

    // Find and validate the stored token
    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    })

    if (!storedToken) {
      throw new UnauthorizedError('Refresh token expired or revoked')
    }

    // Revoke the old token (rotation)
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    })

    // Create new token pair
    return this.createTokenPair(userId, jwtSign)
  }

  /**
   * Decode refresh token payload (without verification - for token lookup)
   */
  private decodeRefreshToken(token: string): Record<string, unknown> | null {
    try {
      // Split the JWT and decode the payload
      const parts = token.split('.')
      if (parts.length !== 3) return null

      const payload = Buffer.from(parts[1], 'base64url').toString('utf-8')
      return JSON.parse(payload)
    } catch {
      return null
    }
  }

  /**
   * Revoke all refresh tokens for a user (logout from all devices)
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
    logger.info({ userId }, 'All refresh tokens revoked')
  }

  /**
   * Revoke a specific token
   */
  async revokeToken(tokenHash: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  }

  /**
   * Clean up expired tokens (remove old revoked/expired tokens)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { revokedAt: { not: null, lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }, // Revoked tokens older than 7 days
        ],
      },
    })
    logger.info({ deleted: result.count }, 'Expired tokens cleaned up')
    return result.count
  }

  /**
   * Validate a refresh token without creating new tokens
   */
  async validateToken(refreshTokenJwt: string): Promise<{ userId: string } | null> {
    const payload = this.decodeRefreshToken(refreshTokenJwt)

    if (!payload || payload.type !== 'refresh') {
      return null
    }

    const userId = payload.id as string
    const tokenHash = payload.jti as string

    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    })

    if (!storedToken) {
      return null
    }

    return { userId }
  }
}