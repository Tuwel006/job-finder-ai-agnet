import { z } from 'zod'

export const markQuestionPracticedSchema = z.object({
  practiced: z.boolean(),
})

export type MarkQuestionPracticedDto = z.infer<typeof markQuestionPracticedSchema>