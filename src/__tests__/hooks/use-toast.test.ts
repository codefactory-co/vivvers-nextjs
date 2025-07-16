import { renderHook, act } from '@testing-library/react'
import { useToast, ToastMessage } from '@/hooks/use-toast'

describe('useToast', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('Initial State', () => {
    it('should initialize with empty toasts array', () => {
      const { result } = renderHook(() => useToast())
      
      expect(result.current.toasts).toEqual([])
    })

    it('should provide toast, dismiss, and toasts properties', () => {
      const { result } = renderHook(() => useToast())
      
      expect(typeof result.current.toast).toBe('function')
      expect(typeof result.current.dismiss).toBe('function')
      expect(Array.isArray(result.current.toasts)).toBe(true)
    })
  })

  describe('Toast Creation', () => {
    it('should create a toast with basic message', () => {
      const { result } = renderHook(() => useToast())
      const message: ToastMessage = {
        title: 'Test Title',
        description: 'Test Description'
      }

      act(() => {
        result.current.toast(message)
      })

      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0].title).toBe(message.title)
      expect(result.current.toasts[0].description).toBe(message.description)
      expect(typeof result.current.toasts[0].id).toBe('string')
      expect(result.current.toasts[0].id.length).toBeGreaterThan(0)
    })

    it('should create a toast with variant', () => {
      const { result } = renderHook(() => useToast())
      const message: ToastMessage = {
        title: 'Success Toast',
        description: 'Operation completed successfully',
        variant: 'success'
      }

      act(() => {
        result.current.toast(message)
      })

      expect(result.current.toasts[0].title).toBe(message.title)
      expect(result.current.toasts[0].description).toBe(message.description)
      expect(result.current.toasts[0].variant).toBe('success')
      expect(typeof result.current.toasts[0].id).toBe('string')
    })

    it('should return the generated toast ID', () => {
      const { result } = renderHook(() => useToast())
      const message: ToastMessage = {
        title: 'Test',
        description: 'Test'
      }

      let toastId: string
      act(() => {
        toastId = result.current.toast(message)
      })

      expect(typeof toastId!).toBe('string')
      expect(toastId!.length).toBeGreaterThan(0)
      expect(result.current.toasts[0].id).toBe(toastId!)
    })

    it('should generate unique IDs for multiple toasts', () => {
      const { result } = renderHook(() => useToast())
      
      const message1: ToastMessage = { title: 'Toast 1', description: 'First toast' }
      const message2: ToastMessage = { title: 'Toast 2', description: 'Second toast' }

      let id1: string = ''
      let id2: string = ''
      act(() => {
        id1 = result.current.toast(message1)
        id2 = result.current.toast(message2)
      })

      // Check that IDs are different
      expect(id1).not.toBe(id2)
      expect(result.current.toasts).toHaveLength(2)
      expect(result.current.toasts[0].id).toBe(id1)
      expect(result.current.toasts[1].id).toBe(id2)
      
      // Verify both toasts have the expected content
      expect(result.current.toasts[0].title).toBe('Toast 1')
      expect(result.current.toasts[1].title).toBe('Toast 2')
    })

    it('should handle all toast variants', () => {
      const { result } = renderHook(() => useToast())
      const variants = ['default', 'success', 'warning', 'destructive', 'info'] as const
      
      variants.forEach((variant) => {
        act(() => {
          result.current.toast({
            title: `${variant} toast`,
            description: `${variant} description`,
            variant
          })
        })
      })

      expect(result.current.toasts).toHaveLength(5)
      variants.forEach((variant, index) => {
        expect(result.current.toasts[index].variant).toBe(variant)
      })
    })
  })

  describe('Auto-dismissal', () => {
    it('should auto-remove toast after 5 seconds', () => {
      const { result } = renderHook(() => useToast())
      const message: ToastMessage = {
        title: 'Auto-dismiss Toast',
        description: 'This should disappear after 5 seconds'
      }

      act(() => {
        result.current.toast(message)
      })

      expect(result.current.toasts).toHaveLength(1)

      // Fast-forward 4.9 seconds - toast should still be there
      act(() => {
        jest.advanceTimersByTime(4900)
      })
      expect(result.current.toasts).toHaveLength(1)

      // Fast-forward to 5 seconds - toast should be removed
      act(() => {
        jest.advanceTimersByTime(100)
      })
      expect(result.current.toasts).toHaveLength(0)
    })

    it('should handle multiple toasts with independent timers', () => {
      const { result } = renderHook(() => useToast())

      // Add first toast
      act(() => {
        result.current.toast({ title: 'First', description: 'First toast' })
      })

      // Fast-forward 2 seconds
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Add second toast (should have 5 seconds from now)
      act(() => {
        result.current.toast({ title: 'Second', description: 'Second toast' })
      })

      expect(result.current.toasts).toHaveLength(2)

      // Fast-forward 3 more seconds (total 5 seconds from first toast)
      act(() => {
        jest.advanceTimersByTime(3000)
      })

      // First toast should be removed, second should remain
      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0].title).toBe('Second')

      // Fast-forward 2 more seconds (5 seconds from second toast)
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Both toasts should be removed
      expect(result.current.toasts).toHaveLength(0)
    })

    it('should not crash if toast is already removed when timer fires', () => {
      const { result } = renderHook(() => useToast())
      
      let toastId: string
      act(() => {
        toastId = result.current.toast({
          title: 'Test',
          description: 'Will be manually dismissed'
        })
      })

      // Manually dismiss the toast
      act(() => {
        result.current.dismiss(toastId)
      })

      expect(result.current.toasts).toHaveLength(0)

      // Fast-forward past auto-dismiss time - should not crash
      expect(() => {
        act(() => {
          jest.advanceTimersByTime(5000)
        })
      }).not.toThrow()

      expect(result.current.toasts).toHaveLength(0)
    })
  })

  describe('Manual Dismissal', () => {
    it('should manually dismiss a toast by ID', () => {
      const { result } = renderHook(() => useToast())
      
      let toastId: string
      act(() => {
        toastId = result.current.toast({
          title: 'Dismissible Toast',
          description: 'This can be manually dismissed'
        })
      })

      expect(result.current.toasts).toHaveLength(1)

      act(() => {
        result.current.dismiss(toastId)
      })

      expect(result.current.toasts).toHaveLength(0)
    })

    it('should dismiss specific toast from multiple toasts', () => {
      const { result } = renderHook(() => useToast())
      
      let id1: string = ''
      let id2: string = ''
      let id3: string = ''
      act(() => {
        id1 = result.current.toast({ title: 'Toast 1', description: 'First' })
        id2 = result.current.toast({ title: 'Toast 2', description: 'Second' })
        id3 = result.current.toast({ title: 'Toast 3', description: 'Third' })
      })

      expect(result.current.toasts).toHaveLength(3)

      // Dismiss middle toast
      act(() => {
        result.current.dismiss(id2)
      })

      expect(result.current.toasts).toHaveLength(2)
      expect(result.current.toasts[0].id).toBe(id1)
      expect(result.current.toasts[1].id).toBe(id3)
      expect(result.current.toasts[0].title).toBe('Toast 1')
      expect(result.current.toasts[1].title).toBe('Toast 3')
    })

    it('should handle dismissing non-existent toast gracefully', () => {
      const { result } = renderHook(() => useToast())
      
      act(() => {
        result.current.toast({ title: 'Existing', description: 'This exists' })
      })

      expect(result.current.toasts).toHaveLength(1)

      // Try to dismiss a toast that doesn't exist
      expect(() => {
        act(() => {
          result.current.dismiss('non-existent-id')
        })
      }).not.toThrow()

      // Original toast should still be there
      expect(result.current.toasts).toHaveLength(1)
    })

    it('should handle dismissing already dismissed toast', () => {
      const { result } = renderHook(() => useToast())
      
      let toastId: string
      act(() => {
        toastId = result.current.toast({ title: 'Test', description: 'Test' })
      })

      // Dismiss once
      act(() => {
        result.current.dismiss(toastId)
      })

      expect(result.current.toasts).toHaveLength(0)

      // Dismiss again - should not crash
      expect(() => {
        act(() => {
          result.current.dismiss(toastId)
        })
      }).not.toThrow()

      expect(result.current.toasts).toHaveLength(0)
    })
  })

  describe('Queue Management', () => {
    it('should handle rapid toast creation', () => {
      const { result } = renderHook(() => useToast())
      
      const toastIds: string[] = []
      
      // Create 5 toasts rapidly
      act(() => {
        for (let i = 0; i < 5; i++) {
          const id = result.current.toast({
            title: `Toast ${i + 1}`,
            description: `Description ${i + 1}`
          })
          toastIds.push(id)
        }
      })

      expect(result.current.toasts).toHaveLength(5)
      
      // Check that all toasts have unique IDs
      const ids = result.current.toasts.map(t => t.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(5)
      
      // Verify all IDs are present
      toastIds.forEach(id => {
        expect(ids).toContain(id)
      })
    })

    it('should maintain toast order (FIFO)', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'First', description: 'First toast' })
        result.current.toast({ title: 'Second', description: 'Second toast' })
        result.current.toast({ title: 'Third', description: 'Third toast' })
      })

      const toasts = result.current.toasts
      expect(toasts[0].title).toBe('First')
      expect(toasts[1].title).toBe('Second')
      expect(toasts[2].title).toBe('Third')
    })

    it('should handle mixed manual and auto dismissal', () => {
      const { result } = renderHook(() => useToast())
      
      let secondId: string
      
      // Add first toast
      act(() => {
        result.current.toast({ title: 'First', description: 'Auto-dismiss' })
      })

      // Fast-forward 2 seconds
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Add second toast
      act(() => {
        secondId = result.current.toast({ title: 'Second', description: 'Manual dismiss' })
      })

      expect(result.current.toasts).toHaveLength(2)

      // Manually dismiss second toast
      act(() => {
        result.current.dismiss(secondId)
      })

      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0].title).toBe('First')

      // Fast-forward remaining time for first toast (3 more seconds)
      act(() => {
        jest.advanceTimersByTime(3000)
      })

      expect(result.current.toasts).toHaveLength(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty title and description', () => {
      const { result } = renderHook(() => useToast())
      
      act(() => {
        result.current.toast({ title: '', description: '' })
      })

      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0].title).toBe('')
      expect(result.current.toasts[0].description).toBe('')
    })

    it('should handle undefined variant (should default)', () => {
      const { result } = renderHook(() => useToast())
      
      act(() => {
        result.current.toast({
          title: 'No Variant',
          description: 'This has no variant specified'
        })
      })

      expect(result.current.toasts[0].variant).toBeUndefined()
    })

    it('should handle special characters in title and description', () => {
      const { result } = renderHook(() => useToast())
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      
      act(() => {
        result.current.toast({
          title: `Title with ${specialChars}`,
          description: `Description with ${specialChars}`
        })
      })

      expect(result.current.toasts[0].title).toBe(`Title with ${specialChars}`)
      expect(result.current.toasts[0].description).toBe(`Description with ${specialChars}`)
    })

    it('should handle very long strings', () => {
      const { result } = renderHook(() => useToast())
      const longString = 'A'.repeat(1000)
      
      act(() => {
        result.current.toast({
          title: longString,
          description: longString
        })
      })

      expect(result.current.toasts[0].title).toBe(longString)
      expect(result.current.toasts[0].description).toBe(longString)
    })
  })

  describe('Memory Management', () => {
    it('should clean up timers when component unmounts', () => {
      const { result, unmount } = renderHook(() => useToast())
      
      act(() => {
        result.current.toast({ title: 'Test', description: 'Test' })
      })

      expect(result.current.toasts).toHaveLength(1)

      // Unmount the hook
      unmount()

      // Fast-forward past auto-dismiss time
      act(() => {
        jest.advanceTimersByTime(5000)
      })

      // No errors should occur due to proper cleanup
      expect(jest.getTimerCount()).toBe(0)
    })

    it('should handle multiple toasts with timers on unmount', () => {
      const { result, unmount } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Toast 1', description: 'First' })
        result.current.toast({ title: 'Toast 2', description: 'Second' })
        result.current.toast({ title: 'Toast 3', description: 'Third' })
      })

      expect(result.current.toasts).toHaveLength(3)
      expect(jest.getTimerCount()).toBe(3)

      // Unmount should clear all timers
      unmount()

      // Fast-forward - no errors should occur
      expect(() => {
        act(() => {
          jest.advanceTimersByTime(10000)
        })
      }).not.toThrow()
    })
  })

  describe('Function Stability', () => {
    it('should maintain stable function references', () => {
      const { result, rerender } = renderHook(() => useToast())
      
      const initialToast = result.current.toast
      const initialDismiss = result.current.dismiss

      // Force re-render
      rerender()

      expect(result.current.toast).toBe(initialToast)
      expect(result.current.dismiss).toBe(initialDismiss)
    })

    it('should maintain function stability with state changes', () => {
      const { result } = renderHook(() => useToast())
      
      const initialToast = result.current.toast
      const initialDismiss = result.current.dismiss

      // Add a toast (state change)
      act(() => {
        result.current.toast({ title: 'Test', description: 'Test' })
      })

      // Functions should remain the same
      expect(result.current.toast).toBe(initialToast)
      expect(result.current.dismiss).toBe(initialDismiss)
    })
  })

  describe('ID Generation', () => {
    it('should generate IDs that are strings with reasonable length', () => {
      const { result } = renderHook(() => useToast())
      
      let toastId: string
      act(() => {
        toastId = result.current.toast({ title: 'Test', description: 'Test' })
      })

      expect(typeof toastId!).toBe('string')
      expect(toastId!.length).toBeGreaterThan(0)
      expect(toastId!.length).toBeLessThan(50) // Reasonable upper bound
    })

    it('should generate different IDs for consecutive toasts', () => {
      const { result } = renderHook(() => useToast())
      
      const ids: string[] = []
      act(() => {
        // Create multiple toasts in rapid succession
        for (let i = 0; i < 10; i++) {
          const id = result.current.toast({ title: `Toast ${i}`, description: `Desc ${i}` })
          ids.push(id)
        }
      })

      // All IDs should be unique
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(10)
    })
  })
})