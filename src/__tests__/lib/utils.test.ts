import { cn, formatCount, debounce } from '@/lib/utils'

describe('utils.ts', () => {
  describe('cn (className utility)', () => {
    it('should merge classes correctly', () => {
      expect(cn('px-4', 'py-2', 'bg-blue-500')).toBe('px-4 py-2 bg-blue-500')
    })

    it('should handle conditional classes', () => {
      expect(cn('base-class', true && 'conditional-class')).toBe('base-class conditional-class')
      expect(cn('base-class', false && 'conditional-class')).toBe('base-class')
    })

    it('should handle object notation', () => {
      expect(cn('base-class', { 'active': true, 'disabled': false })).toBe('base-class active')
    })

    it('should merge conflicting Tailwind classes correctly', () => {
      // tailwind-merge should handle conflicting classes
      expect(cn('px-4', 'px-6')).toBe('px-6')
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })

    it('should handle undefined and null values', () => {
      expect(cn('base-class', undefined, null)).toBe('base-class')
      expect(cn(undefined, null, 'valid-class')).toBe('valid-class')
    })

    it('should handle empty input', () => {
      expect(cn()).toBe('')
      expect(cn('')).toBe('')
    })

    it('should handle arrays of classes', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
    })

    it('should handle complex mixed inputs', () => {
      const result = cn(
        'base-class',
        ['array-class1', 'array-class2'],
        { 'conditional-true': true, 'conditional-false': false },
        undefined,
        'final-class'
      )
      expect(result).toBe('base-class array-class1 array-class2 conditional-true final-class')
    })
  })

  describe('formatCount', () => {
    describe('millions formatting', () => {
      it('should format millions correctly', () => {
        expect(formatCount(1000000)).toBe('1M')
        expect(formatCount(1500000)).toBe('1.5M')
        expect(formatCount(2300000)).toBe('2.3M')
        expect(formatCount(10000000)).toBe('10M')
      })

      it('should handle exact million multiples', () => {
        expect(formatCount(2000000)).toBe('2M')
        expect(formatCount(5000000)).toBe('5M')
      })

      it('should handle large numbers', () => {
        expect(formatCount(999999999)).toBe('1000M')
        expect(formatCount(1234567890)).toBe('1234.6M')
      })
    })

    describe('thousands formatting', () => {
      it('should format thousands correctly', () => {
        expect(formatCount(1000)).toBe('1k')
        expect(formatCount(1200)).toBe('1.2k')
        expect(formatCount(1500)).toBe('1.5k')
        expect(formatCount(2300)).toBe('2.3k')
        expect(formatCount(10000)).toBe('10k')
      })

      it('should handle exact thousand multiples', () => {
        expect(formatCount(2000)).toBe('2k')
        expect(formatCount(5000)).toBe('5k')
        expect(formatCount(15000)).toBe('15k')
      })

      it('should handle edge cases near millions', () => {
        expect(formatCount(999000)).toBe('999k')
        expect(formatCount(999900)).toBe('999.9k')
        expect(formatCount(999999)).toBe('1000k')
      })
    })

    describe('numbers under 1000', () => {
      it('should return the number as string for values under 1000', () => {
        expect(formatCount(0)).toBe('0')
        expect(formatCount(1)).toBe('1')
        expect(formatCount(42)).toBe('42')
        expect(formatCount(100)).toBe('100')
        expect(formatCount(999)).toBe('999')
      })
    })

    describe('edge cases', () => {
      it('should handle negative numbers (current behavior)', () => {
        // Note: Current implementation doesn't format negative numbers with k/M suffixes
        // It only checks for >= thresholds, so negative numbers fall through to toString()
        expect(formatCount(-1)).toBe('-1')
        expect(formatCount(-1000)).toBe('-1000')
        expect(formatCount(-1500)).toBe('-1500')
        expect(formatCount(-1000000)).toBe('-1000000')
        expect(formatCount(-2500000)).toBe('-2500000')
      })

      it('should handle decimal inputs', () => {
        expect(formatCount(1500.7)).toBe('1.5k')
        expect(formatCount(2300.9)).toBe('2.3k')
        expect(formatCount(1200000.5)).toBe('1.2M')
      })

      it('should handle very small decimals', () => {
        expect(formatCount(0.5)).toBe('0.5')
        expect(formatCount(0.99)).toBe('0.99')
      })

      it('should remove trailing .0 from formatted numbers', () => {
        expect(formatCount(1000)).toBe('1k') // not "1.0k"
        expect(formatCount(2000)).toBe('2k') // not "2.0k"
        expect(formatCount(1000000)).toBe('1M') // not "1.0M"
        expect(formatCount(3000000)).toBe('3M') // not "3.0M"
      })
    })

    describe('boundary testing', () => {
      it('should handle boundary values correctly', () => {
        expect(formatCount(999)).toBe('999')
        expect(formatCount(1000)).toBe('1k')
        expect(formatCount(999999)).toBe('1000k')
        expect(formatCount(1000000)).toBe('1M')
      })
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.spyOn(global, 'setTimeout')
      jest.spyOn(global, 'clearTimeout')
    })

    afterEach(() => {
      jest.runOnlyPendingTimers()
      jest.useRealTimers()
      jest.restoreAllMocks()
    })

    it('should delay function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1000)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should cancel previous timeout on subsequent calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      // Fast-forward 500ms - function should not be called yet
      jest.advanceTimersByTime(500)
      expect(mockFn).not.toHaveBeenCalled()

      // Fast-forward another 500ms (total 1000ms) - function should be called once
      jest.advanceTimersByTime(500)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments correctly', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn('arg1', 'arg2', 123)
      jest.advanceTimersByTime(1000)

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123)
    })

    it('should handle different delay values', () => {
      const mockFn = jest.fn()
      const debouncedFn500 = debounce(mockFn, 500)
      const debouncedFn2000 = debounce(mockFn, 2000)

      debouncedFn500()
      debouncedFn2000()

      // After 500ms, first function should be called
      jest.advanceTimersByTime(500)
      expect(mockFn).toHaveBeenCalledTimes(1)

      // After another 1500ms (total 2000ms), second function should be called
      jest.advanceTimersByTime(1500)
      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    it('should handle rapid successive calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      // Call function 10 times rapidly
      for (let i = 0; i < 10; i++) {
        debouncedFn(i)
        jest.advanceTimersByTime(50) // Small intervals between calls
      }

      // Total time elapsed: 450ms, function should not be called yet
      expect(mockFn).not.toHaveBeenCalled()

      // Fast-forward to complete the debounce delay from the last call
      jest.advanceTimersByTime(1000)
      
      // Function should be called only once with the last arguments
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith(9)
    })

    it('should work with functions that have no parameters', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn()
      jest.advanceTimersByTime(1000)

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith()
    })

    it('should work with functions that return values', () => {
      const mockFn = jest.fn(() => 'return value')
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn()
      jest.advanceTimersByTime(1000)

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveReturnedWith('return value')
    })

    it('should handle complex argument types', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      const complexArgs = [
        { id: 1, name: 'test' },
        [1, 2, 3],
        null,
        undefined,
        'string'
      ]

      debouncedFn(...complexArgs)
      jest.advanceTimersByTime(1000)

      expect(mockFn).toHaveBeenCalledWith(...complexArgs)
    })

    it('should clear timeout when called multiple times', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn()
      expect(clearTimeout).toHaveBeenCalledTimes(0)

      debouncedFn()
      expect(clearTimeout).toHaveBeenCalledTimes(1)

      debouncedFn()
      expect(clearTimeout).toHaveBeenCalledTimes(2)
    })

    it('should handle zero delay', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 0)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(0)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })
})