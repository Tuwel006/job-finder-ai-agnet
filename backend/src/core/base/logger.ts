import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pino = require('pino')

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = pino({
  level: isDevelopment ? 'debug' : 'info',
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
})

export const createChildLogger = (context: Record<string, unknown>) => {
  return logger.child(context)
}