import { createRequire } from 'module'
import config from '../../../core/base/config.js'

const require = createRequire(import.meta.url)
const Redis = require('ioredis')

export const redis = new Redis(config.redis.url)

redis.on('error', (err: Error) => {
  console.error('Redis connection error:', err)
})

redis.on('connect', () => {
  console.log('Redis connected')
})

export default redis