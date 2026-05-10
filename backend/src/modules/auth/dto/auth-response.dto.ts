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