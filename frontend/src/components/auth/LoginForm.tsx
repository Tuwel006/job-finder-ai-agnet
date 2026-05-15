'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn } from 'lucide-react'
import { loginSchema, LoginInput } from '@/lib/validations/auth.schema'
import { useAuth } from '@/hooks/useAuth'
import { Button, Input, Checkbox, Flex, Text } from '@/components/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    const success = await login(data)
    if (success) {
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={errors.password?.message}
        required
        {...register('password')}
      />

      <Flex justify="between" align="center">
        <Checkbox label="Remember me" />
        <Link href="/forgot-password" className="text-sm text-secondary hover:underline font-medium">
          Forgot password?
        </Link>
      </Flex>

      <Button
        type="submit"
        loading={isLoading}
        className="w-full"
        leftIcon={<LogIn className="w-4 h-4" />}
      >
        Sign In
      </Button>

      <Text variant="small" className="text-center mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-secondary hover:underline font-medium">
          Sign up
        </Link>
      </Text>
    </form>
  )
}

export default LoginForm