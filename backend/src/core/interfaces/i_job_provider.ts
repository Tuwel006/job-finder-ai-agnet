import type { Job, SearchQuery } from '../shared/types.js'

export type { SearchQuery }

export interface IJobProvider {
  name: string
  searchJobs(query: SearchQuery): Promise<Job[]>
  extractJobDetails(url: string): Promise<Job>
}