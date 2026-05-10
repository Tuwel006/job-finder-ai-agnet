import type { ParsedResume } from '../shared/types.js'

export interface ResumeParsedEvent {
  profileId: string
  userId: string
  parsedData: ParsedResume
  timestamp: Date
}