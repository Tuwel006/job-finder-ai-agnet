'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, User } from 'lucide-react'
import { registerSchema, RegisterInput } from '@/lib/validations/auth.schema'
import { useAuth } from '@/hooks/useAuth'
import { Button, Input, Text } from '@/components/ui'
import Link from 'next/link'

export function RegisterForm() {
  const { register: registerUser, isLoading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        error={errors.name?.message}
        required
        leftIcon={<User className="w-3.5 h-3.5" />}
        {...register('name')}
      />

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
        placeholder="Min 8 chars"
        error={errors.password?.message}
        required
        leftIcon={<Lock className="w-3.5 h-3.5" />}
        {...register('password')}
      />

      <Input
        label="Confirm"
        type="password"
        placeholder="Confirm password"
        error={errors.confirmPassword?.message}
        required
        leftIcon={<Lock className="w-3.5 h-3.5" />}
        {...register('confirmPassword')}
      />

      <Button
        type="submit"
        loading={isLoading}
        className="w-full h-8 text-xs font-semibold"
      >
        Create Account
      </Button>

      <Text variant="caption" className="text-center text-text-secondary text-[11px]">
        Have account?{' '}
        <Link href="/login" className="text-secondary hover:text-secondary/80 font-medium">
          Sign in
        </Link>
      </Text>
    </form>
  )
}

export default RegisterForm