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
    <Flex justify="center" gap={2} className="w-full">
      <Button
        variant="outline"
        onClick={() => handleOAuthLogin('google')}
        disabled={isLoading}
        className="w-10 h-10 rounded-lg border-gray-200 hover:bg-gray-50 p-0 flex items-center justify-center"
        title="Sign in with Google"
      >
        <FcGoogle className="w-5 h-5" />
      </Button>

      <Button
        variant="outline"
        onClick={() => handleOAuthLogin('linkedin')}
        disabled={isLoading}
        className="w-10 h-10 rounded-lg border-gray-200 hover:bg-gray-50 p-0 flex items-center justify-center"
        title="Sign in with LinkedIn"
      >
        <BsLinkedin className="w-5 h-5 text-[#0A66C2]" />
      </Button>

      <Button
        variant="outline"
        onClick={() => handleOAuthLogin('github')}
        disabled={isLoading}
        className="w-10 h-10 rounded-lg border-gray-200 hover:bg-gray-50 p-0 flex items-center justify-center"
        title="Sign in with GitHub"
      >
        <TbBrandGithub className="w-5 h-5" />
      </Button>
    </Flex>
  )
}

export default OAuthButtons