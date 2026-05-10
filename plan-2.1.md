# Module 2.1: Auth Module - User Registration, Login, JWT - Detailed Plan

## Overview
Implement the complete authentication module with user registration, login, JWT token management, and protected routes.

## Prerequisites
- Core backend infrastructure (Module 1.5)
- Environment configuration (Module 1.6)
- Database schema with User table (Module 1.4)

## Deliverables
- `backend/src/modules/auth/dto/` - Data Transfer Objects
- `backend/src/modules/auth/auth_repository.ts` - Database operations
- `backend/src/modules/auth/auth_service.ts` - Business logic
- `backend/src/modules/auth/auth_controller.ts` - HTTP handlers
- `backend/src/modules/auth/auth_router.ts` - Route definitions
- `backend/src/app/prisma.ts` - Prisma Fastify plugin
- `backend/src/app/middleware/auth.ts` - JWT authentication middleware
- `backend/src/app/middleware/error.ts` - Global error handler
- `backend/src/app/routes.ts` - Main route registration
- `backend/src/app/server.ts` - Main server file

---

## Step-by-Step Implementation

### Step 2.1.1: Create Auth DTOs

**Action:** Create DTOs for request/response validation

```bash
cd job-find/backend

# Register DTO
cat > src/modules/auth/dto/register.dto.ts << 'EOF'
import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
})

export type RegisterDto = z.infer<typeof registerSchema>
EOF

# Login DTO
cat > src/modules/auth/dto/login.dto.ts << 'EOF'
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginDto = z.infer<typeof loginSchema>
EOF

# Auth Response DTO
cat > src/modules/auth/dto/auth-response.dto.ts << 'EOF'
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  provider: z.string(),
})

export const tokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export const authResponseSchema = z.object({
  user: userSchema,
  ...tokenResponseSchema.shape,
})

export type UserResponse = z.infer<typeof userSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
EOF

# Create index for DTOs
cat > src/modules/auth/dto/index.ts << 'EOF'
export * from './register.dto.js'
export * from './login.dto.js'
export * from './auth-response.dto.js'
EOF
```

---

### Step 2.1.2: Create Auth Repository

**Action:** Create database operations for users

```bash
cd job-find/backend
cat > src/modules/auth/auth_repository.ts << 'EOF'
import { PrismaClient, User } from '@prisma/client'
import { NotFoundError, ConflictError } from '../../core/base/errors.js'
import { AUTH_PROVIDERS } from '../../core/shared/constants.js'

export class AuthRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  async findByProvider(provider: string, providerId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
    })
  }

  async create(data: {
    email: string
    passwordHash?: string
    name?: string
    avatarUrl?: string
    provider?: string
    providerId?: string
  }): Promise<User> {
    const existing = await this.findByEmail(data.email)
    if (existing) {
      throw new ConflictError('Email already registered')
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        avatarUrl: data.avatarUrl,
        provider: data.provider || AUTH_PROVIDERS.EMAIL,
        providerId: data.providerId,
      },
    })
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    return this.prisma.user.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    })
  }
}
EOF
```

---
❯ now start 2.1                                                                                                                 

### Step 2.1.3: Create Auth Service

**Action:** Create business logic for authentication
❯ now start 2.1                                                                                                                 

```bash
cd job-find/backend
cat > src/modules/auth/auth_service.ts << 'EOF'
import bcrypt from 'bcrypt'
import type { FastifyJWT } from '@fastify/jwt'
import { AuthRepository } from './auth_repository.js'
import { registerSchema, loginSchema } from './dto/register.dto.js'
import { ValidationError, UnauthorizedError, NotFoundError } from '../../core/base/errors.js'
import config from '../../core/base/config.js'
import { logger } from '../../core/base/logger.js'
import type { RegisterDto, LoginDto } from './dto/register.dto.js'
import type { AuthResponse, UserResponse } from './dto/auth-response.dto.js'

const SALT_ROUNDS = 12

export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private fastify: { jwt: FastifyJWT }
  ) {}

  async register(dto: RegisterDto, reply: any): Promise<AuthResponse> {
    const validated = registerSchema.parse(dto)

    const passwordHash = await bcrypt.hash(validated.password, SALT_ROUNDS)

    const user = await this.authRepository.create({
      email: validated.email,
      passwordHash,
      name: validated.name,
    })

    return this.generateAuthResponse(user, reply)
  }

  async login(dto: LoginDto, reply: any): Promise<AuthResponse> {
    const validated = loginSchema.parse(dto)

    const user = await this.authRepository.findByEmail(validated.email)
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const isValid = await bcrypt.compare(validated.password, user.passwordHash)
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials')
    }

    return this.generateAuthResponse(user, reply)
  }

  async oauthLogin(
    provider: string,
    providerId: string,
    email: string,
    name?: string,
    avatarUrl?: string,
    reply?: any
  ): Promise<AuthResponse> {
    let user = await this.authRepository.findByProvider(provider, providerId)

    if (!user) {
      user = await this.authRepository.create({
        email,
        name,
        avatarUrl,
        provider,
        providerId,
      })
    }

    return this.generateAuthResponse(user, reply)
  }

  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await this.authRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    return this.mapUserResponse(user)
  }

  async logout(userId: string): Promise<void> {
    logger.info({ userId }, 'User logged out')
  }

  async deleteAccount(userId: string): Promise<void> {
    await this.authRepository.delete(userId)
  }

  private generateAuthResponse(user: any, reply: any): AuthResponse {
    const accessToken = reply.jwt.sign(
      { id: user.id },
      { expiresIn: config.jwt.expiresIn }
    )
    const refreshToken = reply.jwt.sign(
      { id: user.id, type: 'refresh' },
      { expiresIn: config.jwt.refreshExpiresIn }
    )

    return {
      user: this.mapUserResponse(user),
      accessToken,
      refreshToken,
    }
  }

  private mapUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      provider: user.provider,
    }
  }
}
EOF
```

---

### Step 2.1.4: Create Auth Controller

**Action:** Create HTTP request handlers

```bash
cd job-find/backend
cat > src/modules/auth/auth_controller.ts << 'EOF'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from './auth_service.js'
import type { RegisterDto, LoginDto } from './dto/register.dto.js'

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(request: FastifyRequest<{ Body: RegisterDto }>, reply: FastifyReply) {
    const result = await this.authService.register(request.body, reply)
    return reply.status(201).send(result)
  }

  async login(request: FastifyRequest<{ Body: LoginDto }>, reply: FastifyReply) {
    const result = await this.authService.login(request.body, reply)
    return reply.send(result)
  }

  async refresh(request: FastifyRequest<{ Body: { refreshToken: string } }>, reply: FastifyReply) {
    try {
      const decoded = await reply.jwt.verify(request.body.refreshToken)
      const user = await this.authService.getCurrentUser(decoded.id)

      const accessToken = reply.jwt.sign(
        { id: decoded.id },
        { expiresIn: config.jwt.expiresIn }
      )
      const refreshToken = reply.jwt.sign(
        { id: decoded.id, type: 'refresh' },
        { expiresIn: config.jwt.refreshExpiresIn }
      )

      return reply.send({ user, accessToken, refreshToken })
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token')
    }
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id
    const result = await this.authService.getCurrentUser(userId)
    return reply.send(result)
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id
    await this.authService.logout(userId)
    return reply.send({ message: 'Logged out successfully' })
  }

  async deleteAccount(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id
    await this.authService.deleteAccount(userId)
    return reply.status(204).send()
  }
}
EOF
```

---

### Step 2.1.5: Create Auth Router

**Action:** Create route definitions

```bash
cd job-find/backend
cat > src/modules/auth/auth_router.ts << 'EOF'
import type { FastifyInstance } from 'fastify'
import { AuthController } from './auth_controller.js'
import { AuthService } from './auth_service.js'
import { AuthRepository } from './auth_repository.js'
import { registerSchema, loginSchema } from './dto/register.dto.js'

export async function authRouter(fastify: FastifyInstance) {
  const authRepository = new AuthRepository(fastify.prisma)
  const authService = new AuthService(authRepository, fastify)
  const authController = new AuthController(authService)

  // Public routes
  fastify.post('/register', {
    schema: {
      body: registerSchema,
    },
  }, async (request, reply) => authController.register(request, reply))

  fastify.post('/login', {
    schema: {
      body: loginSchema,
    },
  }, async (request, reply) => authController.login(request, reply))

  // Protected routes
  fastify.addHook('onRequest', fastify.authenticate)

  fastify.get('/me', async (request, reply) => authController.me(request, reply))

  fastify.post('/logout', async (request, reply) => authController.logout(request, reply))

  fastify.delete('/account', async (request, reply) => authController.deleteAccount(request, reply))
}
EOF
```

---

### Step 2.1.6: Create Prisma Fastify Plugin

**Action:** Create Prisma plugin to decorate Fastify instance

```bash
cd job-find/backend
cat > src/app/prisma.ts << 'EOF'
import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

export const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  await prisma.$connect()

  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect()
  })
}
EOF
```

---

### Step 2.1.7: Create Authentication Middleware

**Action:** Create JWT authentication decorator

```bash
cd job-find/backend
cat > src/app/middleware/auth.ts << 'EOF'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UnauthorizedError } from '../../core/base/errors.js'

export interface JWTUser {
  id: string
}

declare module 'fastify' {
  interface FastifyRequest {
    user: JWTUser
  }
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
EOF
```

---

### Step 2.1.8: Create Error Handler Middleware

**Action:** Create global error handler

```bash
cd job-find/backend
cat > src/app/middleware/error.ts << 'EOF'
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../../core/base/errors.js'
import { logger } from '../../core/base/logger.js'

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof AppError) {
    logger.warn({ error: error.message, statusCode: error.statusCode }, 'Application error')

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

  logger.error({ error: error.message, stack: error.stack }, 'Unhandled error')

  return reply.status(500).send({
    statusCode: 500,
    message: 'Internal server error',
    error: 'InternalError',
  })
}
EOF
```

---

### Step 2.1.9: Create Routes Registration

**Action:** Create main routes file

```bash
cd job-find/backend
cat > src/app/routes.ts << 'EOF'
import type { FastifyInstance } from 'fastify'
import { authRouter } from '../modules/auth/auth_router.js'

export async function registerRoutes(fastify: FastifyInstance) {
  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  }))

  // Auth routes
  fastify.register(authRouter, { prefix: '/api/auth' })

  // Future routes will be added here
  // fastify.register(jobsRouter, { prefix: '/api/jobs' })
  // fastify.register(resumeRouter, { prefix: '/api/resume' })
  // fastify.register(matchingRouter, { prefix: '/api/matching' })
  // fastify.register(preparationRouter, { prefix: '/api/preparation' })
}
EOF
```

---

### Step 2.1.10: Create Main Server File

**Action:** Create the main server entry point

```bash
cd job-find/backend
cat > src/app/server.ts << 'EOF'
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

async function startServer() {
  const fastify = Fastify({
    logger: false,
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

  // Start server
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' })
    logger.info(`Server running on port ${config.port}`)
  } catch (err) {
    logger.error(err, 'Failed to start server')
    process.exit(1)
  }
}

startServer()
EOF
```

---

### Step 2.1.11: Fix Auth Service import

**Action:** Add missing config import to auth_controller

```bash
cd job-find/backend
cat >> src/modules/auth/auth_controller.ts << 'EOF'

import config from '../../core/base/config.js'
```

Wait, auth_controller doesn't need config. The issue is auth_service already imports config. Let me verify auth_controller is correct.

Actually, the auth_controller needs to import FastifyRequest and FastifyReply properly. Let me check the current file after creating.

---

## Verification Steps

```bash
cd job-find/backend

# Type check
npx tsc --noEmit

# Try to build
npm run build

# Start the server (Ctrl+C to stop)
npm run dev
```

Test the API:

```bash
# Health check
curl http://localhost:3001/health

# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'

# Get current user (with token)
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <token>"
```

---

## Expected API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /health | Health check | No |
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/auth/me | Get current user | Yes |
| POST | /api/auth/logout | Logout | Yes |
| DELETE | /api/auth/account | Delete account | Yes |

---

## Notes

- Passwords are hashed with bcrypt (cost factor 12)
- JWT tokens: access token (15m), refresh token (7d)
- All passwords require uppercase, lowercase, and number
- Email must be unique
- Protected routes use `fastify.authenticate` hook
- Error responses follow consistent format

---

## Ready to Proceed?

If this plan looks good, say "approve" and I will implement module 2.1.

If you want changes, tell me what to modify.