import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobsService, type Job, type SearchFilters } from '@/services/jobs.service'
import toast from 'react-hot-toast'

export function useJobs(filters: SearchFilters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsService.searchJobs(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => jobsService.getJob(id),
    enabled: !!id,
  })
}

export function useSavedJobs() {
  return useQuery({
    queryKey: ['jobs', 'saved'],
    queryFn: () => jobsService.getSavedJobs(),
  })
}

export function useSaveJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (jobId: string) => jobsService.saveJob(jobId),
    onSuccess: () => {
      toast.success('Job saved')
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
    onError: () => {
      toast.error('Failed to save job')
    },
  })
}

export function useUnsaveJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (jobId: string) => jobsService.unsaveJob(jobId),
    onSuccess: () => {
      toast.success('Job removed from saved')
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
    onError: () => {
      toast.error('Failed to unsave job')
    },
  })
}