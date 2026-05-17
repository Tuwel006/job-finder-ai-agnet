import { JobsRepository } from './jobs_repository.js'
import { SearchJobsDto } from './dto/index.js'

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface JobResponse {
  id: string
  title: string
  company: string
  companyLogo: string | null
  location: string
  type: string
  remote: boolean
  salaryMin: number | null
  salaryMax: number | null
  description: string
  requirements: string[]
  postedAt: Date
  url: string | null
  saved: boolean
}

export class JobsService {
  constructor(private jobsRepository: JobsRepository) {}

  async searchJobs(dto: SearchJobsDto, userId?: string): Promise<PaginatedResult<JobResponse>> {
    const { jobs, total } = await this.jobsRepository.findMany(
      {
        query: dto.query,
        location: dto.location,
      },
      { page: dto.page, limit: dto.limit }
    )

    // Check saved status for each job if user is authenticated
    const jobsWithSaved = await Promise.all(
      jobs.map(async (job) => {
        let saved = false
        if (userId) {
          saved = await this.jobsRepository.isJobSaved(userId, job.id)
        }
        return {
          id: job.id,
          title: job.title,
          company: job.company,
          companyLogo: job.logoUrl,
          location: job.location || '',
          type: 'full-time', // Default type since schema doesn't have it
          remote: false, // Default since schema doesn't have it
          salaryMin: null,
          salaryMax: null,
          description: job.description || '',
          requirements: job.keywords || [],
          postedAt: job.fetchedAt,
          url: job.applyUrl,
          saved,
        }
      })
    )

    return {
      data: jobsWithSaved,
      total,
      page: dto.page,
      limit: dto.limit,
      totalPages: Math.ceil(total / dto.limit),
    }
  }

  async getJobById(id: string, userId?: string): Promise<JobResponse | null> {
    const job = await this.jobsRepository.findById(id)
    if (!job) return null

    let saved = false
    if (userId) {
      saved = await this.jobsRepository.isJobSaved(userId, job.id)
    }

    return {
      id: job.id,
      title: job.title,
      company: job.company,
      companyLogo: job.logoUrl,
      location: job.location || '',
      type: 'full-time',
      remote: false,
      salaryMin: null,
      salaryMax: null,
      description: job.description || '',
      requirements: job.keywords || [],
      postedAt: job.fetchedAt,
      url: job.applyUrl,
      saved,
    }
  }

  async getSavedJobs(userId: string): Promise<JobResponse[]> {
    const savedMatches = await this.jobsRepository.findSavedByUser(userId)
    return savedMatches.map((m) => ({
      id: m.job.id,
      title: m.job.title,
      company: m.job.company,
      companyLogo: m.job.logoUrl,
      location: m.job.location || '',
      type: 'full-time',
      remote: false,
      salaryMin: null,
      salaryMax: null,
      description: m.job.description || '',
      requirements: m.job.keywords || [],
      postedAt: m.job.fetchedAt,
      url: m.job.applyUrl,
      saved: true,
    }))
  }

  async saveJob(userId: string, jobId: string): Promise<void> {
    // Get user's resume profile
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    const resumeProfile = await prisma.resumeProfile.findFirst({
      where: { userId, deletedAt: null },
    })
    if (!resumeProfile) {
      throw new Error('No resume profile found')
    }
    await this.jobsRepository.saveJob(userId, jobId, resumeProfile.id)
  }

  async unsaveJob(userId: string, jobId: string): Promise<void> {
    await this.jobsRepository.unsaveJob(userId, jobId)
  }
}