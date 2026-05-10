import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../../core/base/errors.js'
import { logger } from '../../core/base/logger.js'

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  // Log all error details
  logger.error({
    error: error.message,
    stack: error.stack,
    code: error.code,
    statusCode: error.statusCode
  }, 'Request error')

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      message: error.message,
      error: error.constructor.name,
    })
  }

  if (error.validation) {
    return reply.status(400).send({
      statusCode: 400,
      message: 'Validation error',
      error: 'ValidationError',
      details: error.validation,
    })
  }

  // Return more helpful message in development
  const message = process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'

  return reply.status(500).send({
    statusCode: 500,
    message,
    error: 'InternalError',
  })
}