import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { preparationService } from '@/services/preparation.service'
import toast from 'react-hot-toast'

export function usePreparationMaterials(matchId: string) {
  return useQuery({
    queryKey: ['preparation', matchId],
    queryFn: () => preparationService.getMaterials(matchId),
    enabled: !!matchId,
  })
}

export function useMarkQuestionPracticed() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ questionId, practiced }: { questionId: string; practiced: boolean }) =>
      preparationService.markQuestionPracticed(questionId, practiced),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preparation'] })
    },
    onError: () => {
      toast.error('Failed to update question')
    },
  })
}