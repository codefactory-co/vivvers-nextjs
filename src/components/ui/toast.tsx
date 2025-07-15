'use client'

import React, { useState, useEffect } from 'react'
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  title: string
  description: string
  action?: React.ReactNode
  duration?: number
  closable?: boolean
  onClose?: () => void
}

export const Toast: React.FC<ToastProps> = ({
  variant = 'default',
  title,
  description,
  action,
  duration = 5000,
  closable = true,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  const variantStyles = {
    default: 'bg-white border-gray-200 text-gray-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900'
  }

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-sm max-w-md',
        variantStyles[variant]
      )}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-sm opacity-90 mt-1">{description}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
      {closable && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}