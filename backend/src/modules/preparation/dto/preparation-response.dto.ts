import { z } from 'zod'

export const preparationResponseSchema = z.object({
  id: z.string(),
  matchId: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string().nullable(),
    type: z.enum(['behavioral', 'technical', ' situational']),
    practiced: z.boolean(),
  })),
  companyInsights: z.array(z.string()),
  tips: z.array(z.string()),
  createdAt: z.date(),
})

export type PreparationResponseDto = z.infer<typeof preparationResponseSchema>