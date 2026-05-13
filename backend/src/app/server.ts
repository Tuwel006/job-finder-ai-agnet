import Fastify from 'fastify'
import cors from '@fastify/cors'
import compress from '@fastify/compress'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import { prismaPlugin } from './prisma.js'
import { registerRoutes } from './routes.js'
import { errorHandler } from './middleware/error.js'
import { authenticate } from './middleware/auth.js'
import config from '../core/base/config.js'
import { logger } from '../core/base/logger.js'

export async function createServer() {
  const fastify = Fastify({
    logger: {
      level: config.nodeEnv === 'development' ? 'debug' : 'info',
      transport: config.nodeEnv === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
    },
  })

  // Register CORS
  await fastify.register(cors, {
    origin: config.frontend.url,
    credentials: true,
  })

  // Register compression
  await fastify.register(compress)

  // Register rate limiting
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  // Register JWT
  await fastify.register(jwt, {
    secret: config.jwt.secret,
  })

  // Register Prisma
  await fastify.register(prismaPlugin)

  // Decorate with authenticate
  fastify.decorate('authenticate', authenticate)

  // Register error handler
  fastify.setErrorHandler(errorHandler)

  // Register routes
  await registerRoutes(fastify)

  return fastify
}

export async function startServer() {
  const fastify = await createServer()

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']
  for (const signal of signals) {
    process.on(signal, async () => {
      logger.info(`Received ${signal}, shutting down gracefully...`)
      await fastify.close()
      process.exit(0)
    })
  }

  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' })
    logger.info(`Server running on http://0.0.0.0:${config.port}`)
  } catch (err) {
    logger.error(err, 'Failed to start server')
    process.exit(1)
  }
}