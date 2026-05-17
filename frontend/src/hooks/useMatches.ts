import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { matchesService, type Match } from '@/services/matches.service'
import toast from 'react-hot-toast'

export function useMatches(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['matches', page, limit],
    queryFn: () => matchesService.getMatches(page, limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export function useMatch(matchId: string) {
  return useQuery({
    queryKey: ['matches', matchId],
    queryFn: () => matchesService.getMatch(matchId),
    enabled: !!matchId,
  })
}

export function useUpdateMatchStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Match['status'] }) =>
      matchesService.updateMatchStatus(id, status),
    onSuccess: () => {
      toast.success('Match updated')
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
    onError: () => {
      toast.error('Failed to update match')
    },
  })
}

export function useDismissMatch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => matchesService.dismissMatch(id),
    onSuccess: () => {
      toast.success('Match dismissed')
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
    onError: () => {
      toast.error('Failed to dismiss match')
    },
  })
}