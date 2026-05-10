import type { SearchQuery } from '../interfaces/i_job_provider.js'
import type { Job } from '../shared/types.js'
import { BaseService } from './base_service.js'

export abstract class BaseProvider extends BaseService {
  abstract readonly name: string

  abstract searchJobs(query: SearchQuery): Promise<Job[]>
  abstract extractJobDetails(url: string): Promise<Job>
}