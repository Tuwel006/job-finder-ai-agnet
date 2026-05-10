import { z } from 'zod'

export const oauthCallbackSchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
})

export const oauthInitiateSchema = z.object({
  provider: z.enum(['google', 'linkedin', 'github']),
})

export type OAuthCallbackDto = z.infer<typeof oauthCallbackSchema>
export type OAuthInitiateDto = z.infer<typeof oauthInitiateSchema>