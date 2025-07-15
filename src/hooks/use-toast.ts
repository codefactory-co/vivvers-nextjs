import { useState, useCallback } from 'react'

export interface ToastMessage {
  title: string
  description: string
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info'
}

export function useToast() {
  const [toasts, setToasts] = useState<(ToastMessage & { id: string })[]>([])

  const toast = useCallback((message: ToastMessage) => {
    const id = Math.random().toString(36).slice(2)
    const toastWithId = { ...message, id }
    
    setToasts(prev => [...prev, toastWithId])
    
    // 5초 후 자동 제거
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
    
    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return {
    toast,
    dismiss,
    toasts
  }
}