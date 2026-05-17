import { z } from 'zod'

export const jobResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  companyLogo: z.string().nullable(),
  location: z.string(),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  remote: z.boolean(),
  salaryMin: z.number().nullable(),
  salaryMax: z.number().nullable(),
  description: z.string(),
  requirements: z.array(z.string()),
  postedAt: z.date(),
  url: z.string().nullable(),
  saved: z.boolean().optional(),
})

export type JobResponseDto = z.infer<typeof jobResponseSchema>