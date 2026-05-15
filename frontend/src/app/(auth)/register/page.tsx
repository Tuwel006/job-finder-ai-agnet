import { RegisterForm } from '@/components/auth/RegisterForm'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { Text, Flex } from '@/components/ui'

export default function RegisterPage() {
  return (
    <div className="w-full">
      <Text variant="h2" className="text-center mb-2">
        Create Account
      </Text>
      <Text variant="body" className="text-center text-text-secondary mb-8">
        Start your job search journey
      </Text>
      <OAuthButtons />
      <Flex align="center" className="my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <Text variant="small" className="px-4 text-text-secondary">or</Text>
        <div className="flex-1 h-px bg-gray-200" />
      </Flex>
      <RegisterForm />
    </div>
  )
}