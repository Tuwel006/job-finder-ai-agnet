import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../../core/base/errors.js'
import { ZodError } from 'zod'
import { logger } from '../../core/base/logger.js'

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  // Log error details
  logger.error({
    error: error.message,
    stack: error.stack,
    code: error.code,
    statusCode: error.statusCode,
    url: request.url,
    method: request.method,
  }, 'Request error')

  // Handle AppError (custom application errors)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      message: error.message,
      error: error.constructor.name,
    })
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const formattedErrors: Record<string, string[]> = {}
    error.errors.forEach((err) => {
      const path = err.path.join('.')
      if (!formattedErrors[path]) {
        formattedErrors[path] = []
      }
      formattedErrors[path].push(err.message)
    })

    return reply.status(400).send({
      statusCode: 400,
      message: 'Validation error',
      error: 'ValidationError',
      details: formattedErrors,
    })
  }

  // Handle Fastify validation errors (e.g., from route schemas)
  if (error.validation) {
    return reply.status(400).send({
      statusCode: 400,
      message: 'Validation error',
      error: 'ValidationError',
      details: error.validation,
    })
  }

  // Handle Prisma errors
  if (error.code && error.code.startsWith('P')) {
    const prismaErrors: Record<string, { statusCode: number; message: string }> = {
      P2002: { statusCode: 409, message: 'A record with this value already exists' },
      P2003: { statusCode: 400, message: 'Invalid reference' },
      P2025: { statusCode: 404, message: 'Record not found' },
    }

    const prismaError = prismaErrors[error.code]
    if (prismaError) {
      return reply.status(prismaError.statusCode).send({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        error: 'PrismaError',
        code: error.code,
      })
    }

    return reply.status(400).send({
      statusCode: 400,
      message: 'Database error',
      error: 'PrismaError',
      code: error.code,
    })
  }

  // Return more helpful message in development
  const message = process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'

  return reply.status(error.statusCode || 500).send({
    statusCode: error.statusCode || 500,
    message,
    error: 'InternalError',
  })
}