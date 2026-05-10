import type { FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from './auth_service.js'
import type { RegisterDto } from './dto/register.dto.js'
import type { LoginDto } from './dto/login.dto.js'

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(request: FastifyRequest<{ Body: RegisterDto }>, reply: FastifyReply) {
    const result = await this.authService.register(request.body)
    return reply.status(201).send(result)
  }

  async login(request: FastifyRequest<{ Body: LoginDto }>, reply: FastifyReply) {
    const result = await this.authService.login(request.body)
    return reply.send(result)
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