import { MatchesRepository } from './matches_repository.js'
import { MatchResponseDto } from './dto/index.js'

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class MatchesService {
  constructor(private matchesRepository: MatchesRepository) {}

  async getMatches(userId: string, page = 1, limit = 20): Promise<PaginatedResult<MatchResponseDto>> {
    const { matches, total } = await this.matchesRepository.findByUser(userId, { page, limit })

    const data = matches.map((m) => ({
      id: m.id,
      jobId: m.jobId,
      job: {
        id: m.job.id,
        title: m.job.title,
        company: m.job.company,
        companyLogo: m.job.logoUrl,
        location: m.job.location || '',
        type: 'full-time', // Default
        salary: m.job.salaryRange,
        postedAt: m.job.fetchedAt,
      },
      score: Math.round(m.similarityScore * 100),
      reasons: m.matchReasons as string[],
      missingSkills: [] as string[],
      createdAt: m.createdAt,
      status: m.isApplied ? 'applied' as const : 'new' as const,
    }))

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getMatchById(userId: string, matchId: string): Promise<MatchResponseDto | null> {
    const match = await this.matchesRepository.findByUserAndId(userId, matchId)
    if (!match) return null

    return {
      id: match.id,
      jobId: match.jobId,
      job: {
        id: match.job.id,
        title: match.job.title,
        company: match.job.company,
        companyLogo: match.job.logoUrl,
        location: match.job.location || '',
        type: 'full-time',
        salary: match.job.salaryRange,
        postedAt: match.job.fetchedAt,
      },
      score: Math.round(match.similarityScore * 100),
      reasons: match.matchReasons as string[],
      missingSkills: [],
      createdAt: match.createdAt,
      status: match.isApplied ? 'applied' as const : 'new' as const,
    }
  }

  async updateMatchStatus(userId: string, matchId: string, status: 'new' | 'viewed' | 'applied' | 'dismissed'): Promise<void> {
    const match = await this.matchesRepository.findByUserAndId(userId, matchId)
    if (!match) {
      throw new Error('Match not found')
    }
    await this.matchesRepository.updateStatus(matchId, status)
  }

  async dismissMatch(userId: string, matchId: string): Promise<void> {
    const match = await this.matchesRepository.findByUserAndId(userId, matchId)
    if (!match) {
      throw new Error('Match not found')
    }
    await this.matchesRepository.delete(matchId)
  }
}