import { z } from 'zod'

export const oauthRedirectSchema = z.object({
  redirectUrl: z.string().url(),
  state: z.string(),
})

export type OAuthRedirectResponse = z.infer<typeof oauthRedirectSchema>