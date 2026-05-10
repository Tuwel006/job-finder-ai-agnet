import type { Job, ParsedResume, MatchResult } from '../shared/types.js'

export interface MatchResultWithScore extends MatchResult {
  similarityScore: number
  matchReasons: string[]
}

export interface IMatchingService {
  calculateMatch(parsedResume: ParsedResume, job: Job): Promise<MatchResultWithScore>
  findMatchingJobs(parsedResume: ParsedResume, jobs: Job[]): Promise<MatchResultWithScore[]>
}