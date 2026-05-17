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
      primary: 'bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.02] focus:ring-primary/50',
      secondary: 'bg-gradient-to-r from-secondary to-secondary/90 text-white hover:shadow-xl hover:shadow-secondary/20 hover:scale-[1.02] focus:ring-secondary/50',
      outline: 'border-2 border-gray-200 bg-white/80 backdrop-blur-sm hover:border-gray-300 hover:bg-white hover:shadow-lg hover:scale-[1.02] text-text-primary focus:ring-gray-200 transition-all duration-200',
      ghost: 'hover:bg-gray-100/80 backdrop-blur-sm text-text-primary hover:shadow-sm',
      link: 'text-secondary hover:underline hover:text-secondary/80',
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
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-semibold text-text-primary">
            {label}
            {props.required && <span className="text-secondary ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary/50 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm',
              leftIcon && 'pl-8',
              rightIcon && 'pr-8',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              error
                ? 'border-error/50 focus:border-error focus:ring-error/20 bg-error/5'
                : 'focus:border-primary/50 focus:ring-primary/20',
              'hover:border-gray-300 hover:shadow-sm',
              'disabled:opacity-50 disabled:bg-gray-50/50 disabled:cursor-not-allowed disabled:hover:shadow-none',
              'placeholder:text-text-secondary/50',
              'text-text-primary font-medium',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary/50">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs font-medium text-error/90 flex items-center gap-1 mt-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
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
        className={cn(
          'bg-white rounded-xl shadow-lg border border-gray-100 p-5',
          className
        )}
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
      <label className="flex items-center gap-1.5 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            className={cn(
              'w-4 h-4 rounded border border-gray-200',
              'text-secondary bg-white',
              'focus:ring-1 focus:ring-secondary/20 focus:ring-offset-1 focus:ring-offset-white',
              'cursor-pointer transition-all duration-200',
              'checked:bg-secondary checked:border-secondary',
              'hover:border-secondary/50',
              className
            )}
            ref={ref}
            onChange={(e) => onChange?.(e.target.checked)}
            {...props}
          />
          <svg className="w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none opacity-0 checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {label && <span className="text-[11px] text-text-secondary group-hover:text-text-primary transition-colors">{label}</span>}
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
      h1: 'text-4xl font-bold text-text-primary tracking-tight leading-tight',
      h2: 'text-2xl font-bold text-text-primary tracking-tight leading-snug',
      h3: 'text-xl font-semibold text-text-primary tracking-normal leading-snug',
      body: 'text-base text-text-primary leading-relaxed',
      small: 'text-sm text-text-secondary leading-relaxed',
      caption: 'text-xs text-text-secondary/70 leading-relaxed tracking-wide',
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
      primary: 'text-primary hover:text-primary/80 font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary/60 hover:after:w-full after:transition-all',
      secondary: 'text-secondary hover:text-secondary/80 font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-secondary/60 hover:after:w-full after:transition-all',
    }

    return (
      <a ref={ref} className={cn('relative', variants[variant], className)} {...props}>
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

// Spinner component
export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg'
}

export const Spinner = ({ className, size = 'md', ...props }: SpinnerProps) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <svg
      className={cn('animate-spin text-primary', sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}