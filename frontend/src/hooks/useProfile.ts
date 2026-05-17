import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService, type UpdateProfileData } from '@/services/profile.service'
import toast from 'react-hot-toast'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileData) => profileService.updateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated')
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: () => {
      toast.error('Failed to update profile')
    },
  })
}

export function useResume() {
  return useQuery({
    queryKey: ['resume'],
    queryFn: () => profileService.getResume(),
  })
}

export function useDeleteResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => profileService.deleteResume(),
    onSuccess: () => {
      toast.success('Resume deleted')
      queryClient.invalidateQueries({ queryKey: ['resume', 'profile'] })
    },
    onError: () => {
      toast.error('Failed to delete resume')
    },
  })
}