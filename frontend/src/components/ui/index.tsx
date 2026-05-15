'use client'

import * as React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Button component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg focus:ring-primary/50 shadow-sm',
      secondary: 'bg-secondary text-white hover:bg-secondary/90 hover:shadow-lg focus:ring-secondary/50 shadow-sm',
      outline: 'border-2 border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-text-primary focus:ring-gray-200',
      ghost: 'hover:bg-gray-100 text-text-primary',
      link: 'text-secondary hover:underline',
    }

    const sizes = {
      sm: 'text-sm px-4 py-2 gap-1.5',
      md: 'text-base px-5 py-3 gap-2',
      lg: 'text-lg px-6 py-4 gap-2.5',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!loading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)
Button.displayName = 'Button'

// Input component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-text-primary mb-2">
            {label}
            {props.required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed',
            'placeholder:text-text-secondary/60',
            error ? 'border-error focus:ring-error/20 focus:border-error' : 'hover:border-gray-300',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-error font-medium">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

// Card component
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('bg-surface rounded-2xl shadow-xl border border-gray-100 p-8', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

// Checkbox component
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  onChange?: (checked: boolean) => void
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, onChange, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className={cn(
            'w-4 h-4 rounded border-gray-200 text-secondary',
            'focus:ring-secondary focus:ring-offset-0 cursor-pointer',
            className
          )}
          ref={ref}
          onChange={(e) => onChange?.(e.target.checked)}
          {...props}
        />
        {label && <span className="text-sm text-text-secondary">{label}</span>}
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'

// Text component
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption'
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant = 'body', children, ...props }, ref) => {
    const variants = {
      h1: 'text-4xl font-bold text-text-primary',
      h2: 'text-2xl font-bold text-text-primary',
      h3: 'text-xl font-semibold text-text-primary',
      body: 'text-base text-text-primary',
      small: 'text-sm text-text-secondary',
      caption: 'text-xs text-text-secondary',
    }

    const Tag = variant === 'h1' || variant === 'h2' || variant === 'h3'
      ? variant as keyof JSX.IntrinsicElements
      : 'p'

    return React.createElement(Tag as any, { ref, className: cn(variants[variant], className), ...props }, children)
  }
)
Text.displayName = 'Text'

// Container component
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'full'
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'md', children, ...props }, ref) => {
    const sizes = {
      sm: 'max-w-sm mx-auto px-4',
      md: 'max-w-md mx-auto px-4',
      lg: 'max-w-lg mx-auto px-4',
      full: 'w-full px-4',
    }

    return (
      <div ref={ref} className={cn(sizes[size], className)} {...props}>
        {children}
      </div>
    )
  }
)
Container.displayName = 'Container'

// Flex component
export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col'
  justify?: 'start' | 'center' | 'end' | 'between'
  align?: 'start' | 'center' | 'end' | 'stretch'
  gap?: number | string
  wrap?: boolean
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction = 'row', justify = 'start', align = 'start', gap, wrap, children, ...props }, ref) => {
    const directions = { row: 'flex-row', col: 'flex-col' }
    const justifies = { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between' }
    const aligns = { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch' }

    const gapClass = gap ? (typeof gap === 'number' ? `gap-${gap}` : `gap-${gap}`) : ''

    return (
      <div
        ref={ref}
        className={cn('flex', directions[direction], justifies[justify], aligns[align], gap && `gap-${gap}`, wrap && 'flex-wrap', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Flex.displayName = 'Flex'

// Skeleton component
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('animate-pulse bg-gray-200 rounded-card', className)}
        {...props}
      />
    )
  }
)
Skeleton.displayName = 'Skeleton'

// Link component
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary'
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = 'secondary', children, ...props }, ref) => {
    const variants = {
      primary: 'text-primary hover:underline',
      secondary: 'text-secondary hover:underline font-medium',
    }

    return (
      <a ref={ref} className={cn(variants[variant], className)} {...props}>
        {children}
      </a>
    )
  }
)
Link.displayName = 'Link'

// Label component
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  error?: string
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, error, ...props }, ref) => {
    return (
      <label ref={ref} className={cn('block text-sm font-medium text-text-primary', className)} {...props}>
        {children}
        {required && <span className="text-error ml-0.5">*</span>}
        {error && <span className="text-error ml-1">{error}</span>}
      </label>
    )
  }
)
Label.displayName = 'Label'