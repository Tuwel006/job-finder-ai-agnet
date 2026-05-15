'use client'

import { FcGoogle } from 'react-icons/fc'
import { BsLinkedin } from 'react-icons/bs'
import { TbBrandGithub } from 'react-icons/tb'
import { useAuth } from '@/hooks/useAuth'
import { Button, Flex } from '@/components/ui'
import toast from 'react-hot-toast'

export function OAuthButtons() {
  const { isLoading } = useAuth()

  const handleOAuthLogin = async (provider: 'google' | 'linkedin' | 'github') => {
    try {
      const { authService } = await import('@/services/auth.service')
      const response = await authService.initiateOAuth(provider)
      window.location.href = response.redirectUrl
    } catch (error) {
      console.error('OAuth initiation failed:', error)
      toast.error(`Failed to start ${provider} login`)
    }
  }

  return (
    <Flex direction="col" gap={3} className="w-full">
      <Button
        variant="outline"
        onClick={() => handleOAuthLogin('google')}
        disabled={isLoading}
        className="w-full h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        leftIcon={<FcGoogle className="w-5 h-5" />}
      >
        <span className="flex-1 text-left">Continue with Google</span>
      </Button>

      <Button
        variant="outline"
        onClick={() => handleOAuthLogin('linkedin')}
        disabled={isLoading}
        className="w-full h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        leftIcon={<BsLinkedin className="w-5 h-5 text-[#0A66C2]" />}
      >
        <span className="flex-1 text-left">Continue with LinkedIn</span>
      </Button>

      <Button
        variant="outline"
        onClick={() => handleOAuthLogin('github')}
        disabled={isLoading}
        className="w-full h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        leftIcon={<TbBrandGithub className="w-5 h-5" />}
      >
        <span className="flex-1 text-left">Continue with GitHub</span>
      </Button>
    </Flex>
  )
}

export default OAuthButtons