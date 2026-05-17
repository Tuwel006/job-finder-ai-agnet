import { RegisterForm } from '@/components/auth/RegisterForm'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { Text, Flex } from '@/components/ui'

export default function RegisterPage() {
  return (
    <div className="w-full space-y-3">
      {/* Header - Compact */}
      <div className="text-center space-y-0.5">
        <Text variant="h3" className="text-text-primary">
          Create Account
        </Text>
        <Text variant="caption" className="text-text-secondary">
          Join JobFind today
        </Text>
      </div>

      {/* OAuth Buttons - Small icons in a row */}
      <OAuthButtons />

      {/* Divider - Very compact */}
      <Flex align="center">
        <div className="flex-1 h-px bg-gray-200" />
        <Text variant="caption" className="px-2 text-text-secondary/40 text-[10px]">
          or
        </Text>
        <div className="flex-1 h-px bg-gray-200" />
      </Flex>

      {/* Register Form */}
      <RegisterForm />
    </div>
  )
}