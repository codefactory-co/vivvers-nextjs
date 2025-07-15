'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface CtaButtonsProps {
  primaryText?: string
  secondaryText?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'center' | 'stacked'
}

export const CtaButtons: React.FC<CtaButtonsProps> = ({
  primaryText = '프로젝트 둘러보기',
  secondaryText = '내 프로젝트 업로드하기',
  onPrimaryClick,
  onSecondaryClick,
  className,
  size = 'md',
  variant = 'default'
}) => {
  const sizeStyles = {
    sm: {
      button: 'px-4 py-2 text-sm',
      spacing: 'gap-3'
    },
    md: {
      button: 'px-6 py-3 text-base',
      spacing: 'gap-4'
    },
    lg: {
      button: 'px-8 py-4 text-lg',
      spacing: 'gap-6'
    }
  }

  const variantStyles = {
    default: 'flex flex-col sm:flex-row items-center justify-center',
    center: 'flex flex-col sm:flex-row items-center justify-center',
    stacked: 'flex flex-col items-center'
  }

  const currentSize = sizeStyles[size]

  return (
    <div className={cn(
      variantStyles[variant],
      currentSize.spacing,
      className
    )}>
      {/* Primary CTA Button */}
      <button
        onClick={onPrimaryClick}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold',
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90 active:bg-primary/95',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'shadow-sm hover:shadow-md',
          currentSize.button
        )}
      >
        {primaryText}
      </button>

      {/* Secondary CTA Button */}
      <button
        onClick={onSecondaryClick}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold',
          'bg-secondary text-secondary-foreground border border-border',
          'hover:bg-secondary/80 active:bg-secondary/90',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          currentSize.button
        )}
      >
        {secondaryText}
      </button>
    </div>
  )
}