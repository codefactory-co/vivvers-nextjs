import { renderHook, act } from '@testing-library/react'
import { useSearch } from '@/hooks/use-search'
import { useDebounce } from '@/hooks/use-debounce'

describe('useSearch hook', () => {
  describe('initialization', () => {
    it('should initialize with default empty query', () => {
      const { result } = renderHook(() => useSearch())
      
      expect(result.current.searchState.query).toBe('')
      expect(result.current.searchState.isSearching).toBe(false)
    })

    it('should initialize with provided initial query', () => {
      const initialQuery = 'initial search'
      const { result } = renderHook(() => useSearch(initialQuery))
      
      expect(result.current.searchState.query).toBe(initialQuery)
      expect(result.current.searchState.isSearching).toBe(false)
    })

    it('should not trim initial query on initialization', () => {
      // Note: The useSearch hook only trims on updateSearchQuery, not on initialization
      const initialQuery = '  spaced query  '
      const { result } = renderHook(() => useSearch(initialQuery))
      
      expect(result.current.searchState.query).toBe('  spaced query  ')
    })
  })

  describe('updateSearchQuery', () => {
    it('should update query correctly', () => {
      const { result } = renderHook(() => useSearch())
      
      act(() => {
        result.current.updateSearchQuery('new search query')
      })
      
      expect(result.current.searchState.query).toBe('new search query')
      expect(result.current.searchState.isSearching).toBe(false)
    })

    it('should trim whitespace from query', () => {
      const { result } = renderHook(() => useSearch())
      
      act(() => {
        result.current.updateSearchQuery('  trimmed query  ')
      })
      
      expect(result.current.searchState.query).toBe('trimmed query')
    })

    it('should handle empty string after trimming', () => {
      const { result } = renderHook(() => useSearch())
      
      act(() => {
        result.current.updateSearchQuery('   ')
      })
      
      expect(result.current.searchState.query).toBe('')
    })

    it('should handle special characters in query', () => {
      const { result } = renderHook(() => useSearch())
      const specialQuery = 'search@#$%^&*()query'
      
      act(() => {
        result.current.updateSearchQuery(specialQuery)
      })
      
      expect(result.current.searchState.query).toBe(specialQuery)
    })

    it('should handle unicode characters', () => {
      const { result } = renderHook(() => useSearch())
      const unicodeQuery = '한글 검색어 🔍'
      
      act(() => {
        result.current.updateSearchQuery(unicodeQuery)
      })
      
      expect(result.current.searchState.query).toBe(unicodeQuery)
    })

    it('should not affect isSearching state', () => {
      const { result } = renderHook(() => useSearch())
      
      act(() => {
        result.current.setIsSearching(true)
      })
      
      act(() => {
        result.current.updateSearchQuery('new query')
      })
      
      expect(result.current.searchState.query).toBe('new query')
      expect(result.current.searchState.isSearching).toBe(true)
    })
  })

  describe('clearSearch', () => {
    it('should clear the search query', () => {
      const { result } = renderHook(() => useSearch('initial query'))
      
      act(() => {
        result.current.clearSearch()
      })
      
      expect(result.current.searchState.query).toBe('')
      expect(result.current.searchState.isSearching).toBe(false)
    })

    it('should not affect isSearching state', () => {
      const { result } = renderHook(() => useSearch('initial query'))
      
      act(() => {
        result.current.setIsSearching(true)
      })
      
      act(() => {
        result.current.clearSearch()
      })
      
      expect(result.current.searchState.query).toBe('')
      expect(result.current.searchState.isSearching).toBe(true)
    })

    it('should work when query is already empty', () => {
      const { result } = renderHook(() => useSearch())
      
      act(() => {
        result.current.clearSearch()
      })
      
      expect(result.current.searchState.query).toBe('')
      expect(result.current.searchState.isSearching).toBe(false)
    })
  })

  describe('setIsSearching', () => {
    it('should update searching state to true', () => {
      const { result } = renderHook(() => useSearch())
      
      act(() => {
        result.current.setIsSearching(true)
      })
      
      expect(result.current.searchState.isSearching).toBe(true)
      expect(result.current.searchState.query).toBe('')
    })

    it('should update searching state to false', () => {
      const { result } = renderHook(() => useSearch())
      
      act(() => {
        result.current.setIsSearching(true)
      })
      
      act(() => {
        result.current.setIsSearching(false)
      })
      
      expect(result.current.searchState.isSearching).toBe(false)
    })

    it('should not affect query state', () => {
      const { result } = renderHook(() => useSearch('test query'))
      
      act(() => {
        result.current.setIsSearching(true)
      })
      
      expect(result.current.searchState.query).toBe('test query')
      expect(result.current.searchState.isSearching).toBe(true)
    })

    it('should handle multiple toggles', () => {
      const { result } = renderHook(() => useSearch())
      
      act(() => {
        result.current.setIsSearching(true)
      })
      expect(result.current.searchState.isSearching).toBe(true)
      
      act(() => {
        result.current.setIsSearching(false)
      })
      expect(result.current.searchState.isSearching).toBe(false)
      
      act(() => {
        result.current.setIsSearching(true)
      })
      expect(result.current.searchState.isSearching).toBe(true)
    })
  })

  describe('function stability', () => {
    it('should maintain stable function references', () => {
      const { result, rerender } = renderHook(() => useSearch())
      
      const initialUpdateSearchQuery = result.current.updateSearchQuery
      const initialClearSearch = result.current.clearSearch
      const initialSetIsSearching = result.current.setIsSearching
      
      rerender()
      
      expect(result.current.updateSearchQuery).toBe(initialUpdateSearchQuery)
      expect(result.current.clearSearch).toBe(initialClearSearch)
      expect(result.current.setIsSearching).toBe(initialSetIsSearching)
    })
  })

  describe('complex scenarios', () => {
    it('should handle rapid consecutive updates', () => {
      const { result } = renderHook(() => useSearch())
      
      act(() => {
        result.current.updateSearchQuery('query1')
        result.current.updateSearchQuery('query2')
        result.current.updateSearchQuery('query3')
      })
      
      expect(result.current.searchState.query).toBe('query3')
    })

    it('should handle interleaved operations', () => {
      const { result } = renderHook(() => useSearch())
      
      act(() => {
        result.current.updateSearchQuery('initial query')
        result.current.setIsSearching(true)
        result.current.updateSearchQuery('updated query')
        result.current.setIsSearching(false)
        result.current.clearSearch()
      })
      
      expect(result.current.searchState.query).toBe('')
      expect(result.current.searchState.isSearching).toBe(false)
    })
  })
})

describe('useDebounce hook', () => {
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

  describe('basic functionality', () => {
    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 1000))
      
      expect(result.current).toBe('initial')
    })

    it('should debounce value changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 1000 } }
      )
      
      expect(result.current).toBe('initial')
      
      // Update value
      rerender({ value: 'updated', delay: 1000 })
      expect(result.current).toBe('initial') // Should not update immediately
      
      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      expect(result.current).toBe('updated')
    })

    it('should cancel previous timeout on rapid changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 1000 } }
      )
      
      // Multiple rapid updates
      rerender({ value: 'update1', delay: 1000 })
      rerender({ value: 'update2', delay: 1000 })
      rerender({ value: 'final', delay: 1000 })
      
      expect(result.current).toBe('initial')
      
      // Only the final value should be applied after delay
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      expect(result.current).toBe('final')
    })

    it('should handle different delay values', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      )
      
      rerender({ value: 'updated', delay: 500 })
      
      // Should not update after 250ms
      act(() => {
        jest.advanceTimersByTime(250)
      })
      expect(result.current).toBe('initial')
      
      // Should update after full 500ms
      act(() => {
        jest.advanceTimersByTime(250)
      })
      expect(result.current).toBe('updated')
    })
  })

  describe('data type handling', () => {
    it('should handle string values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 1000),
        { initialProps: { value: 'initial string' } }
      )
      
      rerender({ value: 'updated string' })
      
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      expect(result.current).toBe('updated string')
    })

    it('should handle number values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 1000),
        { initialProps: { value: 42 } }
      )
      
      rerender({ value: 99 })
      
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      expect(result.current).toBe(99)
    })

    it('should handle boolean values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 1000),
        { initialProps: { value: false } }
      )
      
      rerender({ value: true })
      
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      expect(result.current).toBe(true)
    })

    it('should handle object values', () => {
      const initialObject = { id: 1, name: 'initial' }
      const updatedObject = { id: 2, name: 'updated' }
      
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 1000),
        { initialProps: { value: initialObject } }
      )
      
      rerender({ value: updatedObject })
      
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      expect(result.current).toEqual(updatedObject)
    })

    it('should handle array values', () => {
      const initialArray = [1, 2, 3]
      const updatedArray = [4, 5, 6]
      
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 1000),
        { initialProps: { value: initialArray } }
      )
      
      rerender({ value: updatedArray })
      
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      expect(result.current).toEqual(updatedArray)
    })

    it('should handle null and undefined values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 1000),
        { initialProps: { value: null as null | undefined } }
      )
      
      rerender({ value: undefined })
      
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      expect(result.current).toBeUndefined()
    })
  })

  describe('delay handling', () => {
    it('should handle zero delay', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 0),
        { initialProps: { value: 'initial' } }
      )
      
      rerender({ value: 'updated' })
      
      act(() => {
        jest.advanceTimersByTime(0)
      })
      
      expect(result.current).toBe('updated')
    })

    it('should handle very large delays', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 10000),
        { initialProps: { value: 'initial' } }
      )
      
      rerender({ value: 'updated' })
      
      // Should not update after 5 seconds
      act(() => {
        jest.advanceTimersByTime(5000)
      })
      expect(result.current).toBe('initial')
      
      // Should update after full 10 seconds
      act(() => {
        jest.advanceTimersByTime(5000)
      })
      expect(result.current).toBe('updated')
    })

    it('should handle changing delay values', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 1000 } }
      )
      
      rerender({ value: 'updated', delay: 2000 })
      
      // Should not update after 1 second (old delay)
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      expect(result.current).toBe('initial')
      
      // Should update after 2 seconds (new delay)
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      expect(result.current).toBe('updated')
    })
  })

  describe('timer management', () => {
    it('should clear timeouts properly', () => {
      const { rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 1000 } }
      )
      
      // First rerender triggers setTimeout and clearTimeout (for cleanup of previous effect)
      rerender({ value: 'update1', delay: 1000 })
      expect(clearTimeout).toHaveBeenCalledTimes(1)
      
      rerender({ value: 'update2', delay: 1000 })
      expect(clearTimeout).toHaveBeenCalledTimes(2)
      
      rerender({ value: 'update3', delay: 1000 })
      expect(clearTimeout).toHaveBeenCalledTimes(3)
    })

    it('should clean up on unmount', () => {
      const { unmount, rerender } = renderHook(
        ({ value }) => useDebounce(value, 1000),
        { initialProps: { value: 'initial' } }
      )
      
      rerender({ value: 'updated' })
      
      const clearTimeoutCallsBefore = jest.mocked(clearTimeout).mock.calls.length
      
      unmount()
      
      expect(clearTimeout).toHaveBeenCalledTimes(clearTimeoutCallsBefore + 1)
    })
  })

  describe('edge cases', () => {
    it('should handle rapid changes during timer execution', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 1000),
        { initialProps: { value: 'initial' } }
      )
      
      // Start with multiple rapid changes
      for (let i = 1; i <= 10; i++) {
        rerender({ value: `update${i}` })
        act(() => {
          jest.advanceTimersByTime(50)
        })
      }
      
      expect(result.current).toBe('initial')
      
      // Complete the debounce delay
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      expect(result.current).toBe('update10')
    })

    it('should handle same value updates', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 1000),
        { initialProps: { value: 'same' } }
      )
      
      rerender({ value: 'same' })
      rerender({ value: 'same' })
      
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      expect(result.current).toBe('same')
    })

    it('should handle value changes to same initial value', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 1000),
        { initialProps: { value: 'initial' } }
      )
      
      rerender({ value: 'different' })
      rerender({ value: 'initial' })
      
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      expect(result.current).toBe('initial')
    })
  })
})

describe('useSearch and useDebounce integration', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should work together for debounced search', () => {
    const { result } = renderHook(() => {
      const search = useSearch()
      const debouncedQuery = useDebounce(search.searchState.query, 500)
      return { search, debouncedQuery }
    })
    
    expect(result.current.debouncedQuery).toBe('')
    
    // Update search query
    act(() => {
      result.current.search.updateSearchQuery('test query')
    })
    
    // Query should update immediately in search state
    expect(result.current.search.searchState.query).toBe('test query')
    // But debounced query should not update yet
    expect(result.current.debouncedQuery).toBe('')
    
    // After debounce delay
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    expect(result.current.debouncedQuery).toBe('test query')
  })

  it('should handle rapid typing with debounced search', () => {
    const { result } = renderHook(() => {
      const search = useSearch()
      const debouncedQuery = useDebounce(search.searchState.query, 300)
      return { search, debouncedQuery }
    })
    
    // Simulate rapid typing
    const queries = ['r', 're', 'rea', 'reac', 'react']
    
    queries.forEach(query => {
      act(() => {
        result.current.search.updateSearchQuery(query)
        jest.advanceTimersByTime(50)
      })
    })
    
    // Search state should have final value
    expect(result.current.search.searchState.query).toBe('react')
    // Debounced should still be empty
    expect(result.current.debouncedQuery).toBe('')
    
    // Complete debounce delay
    act(() => {
      jest.advanceTimersByTime(300)
    })
    
    expect(result.current.debouncedQuery).toBe('react')
  })

  it('should handle search clear with debounce', () => {
    const { result } = renderHook(() => {
      const search = useSearch('initial')
      const debouncedQuery = useDebounce(search.searchState.query, 500)
      return { search, debouncedQuery }
    })
    
    // Initial state
    expect(result.current.search.searchState.query).toBe('initial')
    expect(result.current.debouncedQuery).toBe('initial')
    
    // Update query
    act(() => {
      result.current.search.updateSearchQuery('new query')
    })
    
    // Clear before debounce completes
    act(() => {
      jest.advanceTimersByTime(250)
      result.current.search.clearSearch()
    })
    
    expect(result.current.search.searchState.query).toBe('')
    
    // Complete remaining debounce time
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    expect(result.current.debouncedQuery).toBe('')
  })

  it('should maintain search loading state independently of debounce', () => {
    const { result } = renderHook(() => {
      const search = useSearch()
      const debouncedQuery = useDebounce(search.searchState.query, 500)
      return { search, debouncedQuery }
    })
    
    // Set searching state
    act(() => {
      result.current.search.setIsSearching(true)
      result.current.search.updateSearchQuery('test')
    })
    
    expect(result.current.search.searchState.isSearching).toBe(true)
    expect(result.current.search.searchState.query).toBe('test')
    expect(result.current.debouncedQuery).toBe('')
    
    // Complete debounce
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // Loading state should be independent
    expect(result.current.search.searchState.isSearching).toBe(true)
    expect(result.current.debouncedQuery).toBe('test')
  })
})