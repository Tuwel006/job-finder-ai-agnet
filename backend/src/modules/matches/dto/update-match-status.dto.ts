import { z } from 'zod'

export const updateMatchStatusSchema = z.object({
  status: z.enum(['new', 'viewed', 'applied', 'dismissed']),
})

export type UpdateMatchStatusDto = z.infer<typeof updateMatchStatusSchema>