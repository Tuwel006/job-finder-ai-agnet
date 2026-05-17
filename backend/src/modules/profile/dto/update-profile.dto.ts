import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
})

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>