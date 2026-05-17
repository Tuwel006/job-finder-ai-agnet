import { z } from 'zod'

export const matchResponseSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  job: z.object({
    id: z.string(),
    title: z.string(),
    company: z.string(),
    companyLogo: z.string().nullable(),
    location: z.string(),
    type: z.string(),
    salary: z.string().nullable(),
    postedAt: z.date(),
  }),
  score: z.number(),
  reasons: z.array(z.string()),
  missingSkills: z.array(z.string()),
  createdAt: z.date(),
  status: z.enum(['new', 'viewed', 'applied', 'dismissed']),
})

export type MatchResponseDto = z.infer<typeof matchResponseSchema>