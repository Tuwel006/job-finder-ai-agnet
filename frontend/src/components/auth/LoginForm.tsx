'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock } from 'lucide-react'
import { loginSchema, LoginInput } from '@/lib/validations/auth.schema'
import { useAuth } from '@/hooks/useAuth'
import { Button, Input, Checkbox, Flex, Text } from '@/components/ui'
import Link from 'next/link'

export function LoginForm() {
  const { login, isLoading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    await login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        required
        leftIcon={<Mail className="w-3.5 h-3.5" />}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        error={errors.password?.message}
        required
        leftIcon={<Lock className="w-3.5 h-3.5" />}
        {...register('password')}
      />

      <Flex justify="between" align="center" className="py-1">
        <Checkbox label="Remember" />
        <Link href="/forgot-password" className="text-[11px] text-secondary hover:text-secondary/80">
          Forgot?
        </Link>
      </Flex>

      <Button
        type="submit"
        loading={isLoading}
        className="w-full h-8 text-xs font-semibold"
      >
        Sign In
      </Button>

      <Text variant="caption" className="text-center text-text-secondary text-[11px]">
        No account?{' '}
        <Link href="/register" className="text-secondary hover:text-secondary/80 font-medium">
          Sign up
        </Link>
      </Text>
    </form>
  )
}

export default LoginForm