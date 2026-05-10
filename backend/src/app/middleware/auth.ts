import { FastifyRequest, FastifyReply } from 'fastify'
import { UnauthorizedError } from '../../core/base/errors.js'

export interface JWTUser {
  id: string
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    throw new UnauthorizedError('Please log in to continue')
  }
}

// Helper to get user ID from request
export function getUserId(request: FastifyRequest): string {
  const user = request.user as JWTUser
  return user.id
}