import { FastifyPluginAsync } from 'fastify'
import rateLimit from '@fastify/rate-limit'

export const rateLimitPlugin: FastifyPluginAsync = async (fastify) => {
  // Default rate limit for public endpoints
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: (request, context) => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded, retry in ${context.after}`,
      retryAfter: context.after,
    }),
  })
}

// Auth-specific rate limiter (stricter)
export const authRateLimit = {
  max: 10,
  timeWindow: '1 minute',
  errorResponseBuilder: (request: any, context: any) => ({
    statusCode: 429,
    error: 'Too Many Requests',
    message: `Too many authentication attempts, retry in ${context.after}`,
    retryAfter: context.after,
  }),
}

// Stricter limit for password-related operations
export const passwordRateLimit = {
  max: 5,
  timeWindow: '15 minutes',
  errorResponseBuilder: (request: any, context: any) => ({
    statusCode: 429,
    error: 'Too Many Requests',
    message: `Too many password reset attempts, retry in ${context.after}`,
    retryAfter: context.after,
  }),
}

// OAuth rate limit (prevent abuse)
export const oauthRateLimit = {
  max: 20,
  timeWindow: '1 minute',
  errorResponseBuilder: (request: any, context: any) => ({
    statusCode: 429,
    error: 'Too Many Requests',
    message: `Too many OAuth requests, retry in ${context.after}`,
    retryAfter: context.after,
  }),
}