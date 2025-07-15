'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  variant?: 'default' | 'search' | 'error' | 'maintenance'
  size?: 'sm' | 'md' | 'lg'
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  variant = 'default',
  size = 'md'
}) => {
  const variantStyles = {
    default: 'text-gray-500',
    search: 'text-blue-500',
    error: 'text-red-500',
    maintenance: 'text-yellow-500'
  }

  const sizeStyles = {
    sm: {
      container: 'py-8 px-4',
      icon: 'h-12 w-12',
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'space-y-3'
    },
    md: {
      container: 'py-12 px-6',
      icon: 'h-16 w-16',
      title: 'text-xl',
      description: 'text-base',
      spacing: 'space-y-4'
    },
    lg: {
      container: 'py-16 px-8',
      icon: 'h-20 w-20',
      title: 'text-2xl',
      description: 'text-lg',
      spacing: 'space-y-6'
    }
  }

  const currentSize = sizeStyles[size]

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center max-w-md mx-auto',
      currentSize.container,
      currentSize.spacing
    )}>
      <div className={cn(
        'flex items-center justify-center rounded-full bg-gray-100 mb-2',
        currentSize.icon,
        variantStyles[variant]
      )}>
        {icon}
      </div>
      
      <h3 className={cn('font-semibold text-gray-900', currentSize.title)}>
        {title}
      </h3>
      
      <p className={cn('text-gray-600 max-w-sm', currentSize.description)}>
        {description}
      </p>
      
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  )
}