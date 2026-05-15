'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { registerSchema, RegisterInput } from '@/lib/validations/auth.schema'
import { useAuth } from '@/hooks/useAuth'
import { Button, Input, Flex, Text } from '@/components/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function RegisterForm() {
  const router = useRouter()
  const { register: registerUser, isLoading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    const success = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    })
    if (success) {
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        error={errors.name?.message}
        required
        {...register('name')}
      />

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
        placeholder="Create a strong password"
        error={errors.password?.message}
        required
        {...register('password')}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        required
        {...register('confirmPassword')}
      />

      <Text variant="caption" className="-mt-2 text-text-secondary">
        Must be 8+ chars with uppercase, lowercase, and a number.
      </Text>

      <Button
        type="submit"
        loading={isLoading}
        className="w-full"
        leftIcon={<UserPlus className="w-4 h-4" />}
      >
        Create Account
      </Button>

      <Text variant="small" className="text-center mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-secondary hover:underline font-medium">
          Sign in
        </Link>
      </Text>
    </form>
  )
}

export default RegisterForm