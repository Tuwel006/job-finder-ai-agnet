import { logger } from '../base/logger.js'

export abstract class BaseService {
  protected readonly logger = logger

  constructor(serviceName: string) {
    this.logger = logger.child({ service: serviceName })
  }

  protected logInfo(message: string, meta?: Record<string, unknown>) {
    this.logger.info(meta, message)
  }

  protected logError(message: string, error?: Error, meta?: Record<string, unknown>) {
    this.logger.error({ ...meta, error: error?.message, stack: error?.stack }, message)
  }

  protected logDebug(message: string, meta?: Record<string, unknown>) {
    this.logger.debug(meta, message)
  }
}