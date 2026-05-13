import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { redis } from '../infrastructure/db/redis/redis_client.js'

interface HealthStatus {
  status: 'ok' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  services: {
    database: 'ok' | 'error'
    redis: 'ok' | 'error'
  }
}

interface HealthCheckResult {
  service: string
  status: 'ok' | 'error'
  responseTime?: number
  error?: string
}

const healthRouter: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Overall health check with service diagnostics
  fastify.get('/health', async (request, reply) => {
    const startTime = Date.now()
    const results: HealthCheckResult[] = []

    // Check database
    try {
      const dbStart = Date.now()
      await fastify.prisma.$queryRaw`SELECT 1`
      results.push({
        service: 'database',
        status: 'ok',
        responseTime: Date.now() - dbStart,
      })
    } catch (error: any) {
      results.push({
        service: 'database',
        status: 'error',
        error: error.message,
      })
    }

    // Check Redis
    try {
      const redisStart = Date.now()
      await redis.ping()
      results.push({
        service: 'redis',
        status: 'ok',
        responseTime: Date.now() - redisStart,
      })
    } catch (error: any) {
      results.push({
        service: 'redis',
        status: 'error',
        error: error.message,
      })
    }

    // Determine overall status
    const allOk = results.every((r) => r.status === 'ok')
    const anyError = results.some((r) => r.status === 'error')
    const overallStatus: HealthStatus['status'] = allOk ? 'ok' : anyError ? 'unhealthy' : 'degraded'

    const response: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: results.find((r) => r.service === 'database')?.status || 'error',
        redis: results.find((r) => r.service === 'redis')?.status || 'error',
      },
    }

    const statusCode = overallStatus === 'ok' ? 200 : overallStatus === 'degraded' ? 200 : 503
    return reply.status(statusCode).send(response)
  })

  // Kubernetes liveness probe - just checks if process is running
  fastify.get('/health/live', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }))

  // Kubernetes readiness probe - checks dependencies
  fastify.get('/health/ready', async (request, reply) => {
    try {
      // Must check both DB and Redis for readiness
      await Promise.all([
        fastify.prisma.$queryRaw`SELECT 1`,
        redis.ping(),
      ])
      return { status: 'ok', timestamp: new Date().toISOString() }
    } catch (error: any) {
      return reply.status(503).send({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
      })
    }
  })
}

export default healthRouter