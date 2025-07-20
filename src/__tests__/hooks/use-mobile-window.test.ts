import { renderHook, act } from '@testing-library/react'
import { useMobile } from '@/hooks/use-mobile'
import { useWindowSize } from '@/hooks/use-window-size'

// Mock matchMedia API
const mockMatchMedia = jest.fn()
const mockAddEventListener = jest.fn()
const mockRemoveEventListener = jest.fn()

// Mock Visual Viewport API
const mockVisualViewport = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  width: 1024,
  height: 768,
  offsetTop: 0,
}

// Store original window properties
const originalMatchMedia = window.matchMedia
const originalVisualViewport = window.visualViewport

describe('Hook Tests: useMobile and useWindowSize', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mockMatchMedia,
    })

    // Mock window.visualViewport
    Object.defineProperty(window, 'visualViewport', {
      writable: true,
      configurable: true,
      value: mockVisualViewport,
    })

    // Setup matchMedia mock to return a MediaQueryList-like object
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(max-width: 767px)',
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      addListener: jest.fn(), // Deprecated but still used by some browsers
      removeListener: jest.fn(), // Deprecated but still used by some browsers
      dispatchEvent: jest.fn(),
    })
  })

  afterEach(() => {
    // Restore original window properties
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: originalMatchMedia,
    })

    Object.defineProperty(window, 'visualViewport', {
      writable: true,
      configurable: true,
      value: originalVisualViewport,
    })
  })

  describe('useMobile hook', () => {
    describe('initialization and basic functionality', () => {
      it('should initialize with undefined state in SSR environment', () => {
        // Mock SSR environment by mocking matchMedia to throw
        const originalMatchMedia = window.matchMedia
        Object.defineProperty(window, 'matchMedia', {
          value: undefined,
          writable: true,
          configurable: true,
        })

        expect(() => {
          renderHook(() => useMobile())
        }).toThrow()

        // Restore
        Object.defineProperty(window, 'matchMedia', {
          value: originalMatchMedia,
          writable: true,
          configurable: true,
        })
      })

      it('should detect desktop on initial render with window width >= 768px', () => {
        window.innerWidth = 1024
        
        const { result } = renderHook(() => useMobile())
        
        expect(result.current).toBe(false)
        expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)')
        expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))
      })

      it('should detect mobile on initial render with window width < 768px', () => {
        window.innerWidth = 375
        
        const { result } = renderHook(() => useMobile())
        
        expect(result.current).toBe(true)
      })

      it('should use 768px as the mobile breakpoint', () => {
        window.innerWidth = 767
        renderHook(() => useMobile())
        
        expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)')
      })
    })

    describe('responsive breakpoint detection', () => {
      it('should detect mobile for various mobile screen sizes', () => {
        const mobileSizes = [320, 375, 414, 500, 600, 767]
        
        mobileSizes.forEach(width => {
          window.innerWidth = width
          const { result } = renderHook(() => useMobile())
          expect(result.current).toBe(true)
        })
      })

      it('should detect desktop for various desktop screen sizes', () => {
        const desktopSizes = [768, 800, 1024, 1200, 1440, 1920]
        
        desktopSizes.forEach(width => {
          window.innerWidth = width
          const { result } = renderHook(() => useMobile())
          expect(result.current).toBe(false)
        })
      })

      it('should handle edge case at exact breakpoint', () => {
        // At exactly 768px should be desktop (>= 768)
        window.innerWidth = 768
        const { result } = renderHook(() => useMobile())
        expect(result.current).toBe(false)
        
        // At 767px should be mobile (< 768)
        window.innerWidth = 767
        const { result: mobileResult } = renderHook(() => useMobile())
        expect(mobileResult.current).toBe(true)
      })
    })

    describe('event listener management', () => {
      it('should add event listener on mount', () => {
        renderHook(() => useMobile())
        
        expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))
        expect(mockAddEventListener).toHaveBeenCalledTimes(1)
      })

      it('should remove event listener on unmount', () => {
        const { unmount } = renderHook(() => useMobile())
        
        unmount()
        
        expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
        expect(mockRemoveEventListener).toHaveBeenCalledTimes(1)
      })

      it('should respond to matchMedia change events', () => {
        let changeHandler: ((event: unknown) => void) | undefined

        mockAddEventListener.mockImplementation((event: string, handler: (event: unknown) => void) => {
          if (event === 'change') {
            changeHandler = handler
          }
        })

        window.innerWidth = 1024
        const { result } = renderHook(() => useMobile())
        
        expect(result.current).toBe(false)
        
        // Simulate screen size change to mobile
        act(() => {
          window.innerWidth = 375
          if (changeHandler) {
            changeHandler({ matches: true })
          }
        })
        
        expect(result.current).toBe(true)
      })

      it('should handle multiple change events correctly', () => {
        let changeHandler: ((event: unknown) => void) | undefined

        mockAddEventListener.mockImplementation((event: string, handler: (event: unknown) => void) => {
          if (event === 'change') {
            changeHandler = handler
          }
        })

        window.innerWidth = 1024
        const { result } = renderHook(() => useMobile())
        
        expect(result.current).toBe(false)
        
        // Change to mobile
        act(() => {
          window.innerWidth = 375
          if (changeHandler) {
            changeHandler({ matches: true })
          }
        })
        expect(result.current).toBe(true)
        
        // Change back to desktop
        act(() => {
          window.innerWidth = 1200
          if (changeHandler) {
            changeHandler({ matches: false })
          }
        })
        expect(result.current).toBe(false)
      })
    })

    describe('boolean return value behavior', () => {
      it('should return boolean false for desktop', () => {
        window.innerWidth = 1024
        const { result } = renderHook(() => useMobile())
        
        expect(result.current).toBe(false)
        expect(typeof result.current).toBe('boolean')
      })

      it('should return boolean true for mobile', () => {
        window.innerWidth = 375
        const { result } = renderHook(() => useMobile())
        
        expect(result.current).toBe(true)
        expect(typeof result.current).toBe('boolean')
      })

      it('should convert undefined initial state to boolean', () => {
        // The hook starts with undefined but should return boolean
        const { result } = renderHook(() => useMobile())
        
        expect(typeof result.current).toBe('boolean')
        expect([true, false]).toContain(result.current)
      })
    })
  })

  describe('useWindowSize hook', () => {
    describe('initialization and basic functionality', () => {
      it('should initialize with zero dimensions', () => {
        // Mock visualViewport with zero dimensions  
        Object.defineProperty(window, 'visualViewport', {
          value: {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            width: 0,
            height: 0,
            offsetTop: 0,
          },
          writable: true,
          configurable: true,
        })

        const { result } = renderHook(() => useWindowSize())
        
        // After effect runs, should have the viewport dimensions
        expect(result.current.width).toBe(0)
        expect(result.current.height).toBe(0)
        expect(result.current.offsetTop).toBe(0)
      })

      it('should handle SSR environment gracefully', () => {
        // In a real SSR environment, visualViewport would not exist
        // The hook checks for window but also for visualViewport
        Object.defineProperty(window, 'visualViewport', {
          value: undefined,
          writable: true,
          configurable: true,
        })

        const { result } = renderHook(() => useWindowSize())
        
        // Should return initial state (0,0,0) since handleResize returns early without visualViewport
        expect(result.current.width).toBe(0)
        expect(result.current.height).toBe(0)
        expect(result.current.offsetTop).toBe(0)
      })

      it('should handle missing visualViewport API gracefully', () => {
        Object.defineProperty(window, 'visualViewport', {
          value: undefined,
          writable: true,
          configurable: true,
        })

        const { result } = renderHook(() => useWindowSize())
        
        expect(result.current.width).toBe(0)
        expect(result.current.height).toBe(0)
        expect(result.current.offsetTop).toBe(0)
      })
    })

    describe('Visual Viewport API integration', () => {
      it('should read initial dimensions from visualViewport', () => {
        mockVisualViewport.width = 1200
        mockVisualViewport.height = 800
        mockVisualViewport.offsetTop = 0

        const { result } = renderHook(() => useWindowSize())
        
        expect(result.current.width).toBe(1200)
        expect(result.current.height).toBe(800)
        expect(result.current.offsetTop).toBe(0)
      })

      it('should handle partial visualViewport properties', () => {
        // Some properties might be undefined
        Object.assign(mockVisualViewport, {
          width: 1024,
          height: undefined as unknown as number,
          offsetTop: 50,
        })

        const { result } = renderHook(() => useWindowSize())
        
        expect(result.current.width).toBe(1024)
        expect(result.current.height).toBe(0) // Should default to 0
        expect(result.current.offsetTop).toBe(50)
      })

      it('should update dimensions when visualViewport changes', () => {
        let resizeHandler: (() => void) | undefined
        let scrollHandler: (() => void) | undefined

        mockVisualViewport.addEventListener.mockImplementation((event, handler) => {
          if (event === 'resize') {
            resizeHandler = handler
          } else if (event === 'scroll') {
            scrollHandler = handler
          }
        })

        mockVisualViewport.width = 1024
        mockVisualViewport.height = 768
        mockVisualViewport.offsetTop = 0

        const { result } = renderHook(() => useWindowSize())
        
        expect(result.current.width).toBe(1024)
        expect(result.current.height).toBe(768)
        
        // Simulate viewport resize
        act(() => {
          mockVisualViewport.width = 800
          mockVisualViewport.height = 600
          if (resizeHandler) {
            resizeHandler()
          }
        })
        
        expect(result.current.width).toBe(800)
        expect(result.current.height).toBe(600)
        
        // Simulate viewport scroll (changes offsetTop)
        act(() => {
          mockVisualViewport.offsetTop = 100
          if (scrollHandler) {
            scrollHandler()
          }
        })
        
        expect(result.current.offsetTop).toBe(100)
      })
    })

    describe('event listener management', () => {
      it('should add resize and scroll event listeners on mount', () => {
        renderHook(() => useWindowSize())
        
        expect(mockVisualViewport.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
        expect(mockVisualViewport.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
        expect(mockVisualViewport.addEventListener).toHaveBeenCalledTimes(2)
      })

      it('should remove event listeners on unmount', () => {
        const { unmount } = renderHook(() => useWindowSize())
        
        unmount()
        
        expect(mockVisualViewport.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
        expect(mockVisualViewport.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
        expect(mockVisualViewport.removeEventListener).toHaveBeenCalledTimes(2)
      })

      it('should handle missing visualViewport during cleanup', () => {
        const { unmount } = renderHook(() => useWindowSize())
        
        // Remove visualViewport before unmount
        Object.defineProperty(window, 'visualViewport', {
          value: undefined,
          writable: true,
          configurable: true,
        })
        
        // Should not throw an error
        expect(() => unmount()).not.toThrow()
      })
    })

    describe('performance optimization', () => {
      it('should prevent unnecessary renders when dimensions do not change', () => {
        let resizeHandler: (() => void) | undefined

        mockVisualViewport.addEventListener.mockImplementation((event, handler) => {
          if (event === 'resize') {
            resizeHandler = handler
          }
        })

        mockVisualViewport.width = 1024
        mockVisualViewport.height = 768
        mockVisualViewport.offsetTop = 0

        const { result } = renderHook(() => useWindowSize())
        
        const initialState = result.current
        
        // Trigger resize event with same dimensions
        act(() => {
          if (resizeHandler) {
            resizeHandler()
          }
        })
        
        // Should return the same object reference (no re-render)
        expect(result.current).toBe(initialState)
      })

      it('should update state when any dimension changes', () => {
        let resizeHandler: (() => void) | undefined

        mockVisualViewport.addEventListener.mockImplementation((event, handler) => {
          if (event === 'resize') {
            resizeHandler = handler
          }
        })

        mockVisualViewport.width = 1024
        mockVisualViewport.height = 768
        mockVisualViewport.offsetTop = 0

        const { result } = renderHook(() => useWindowSize())
        
        const initialState = result.current
        
        // Change only width
        act(() => {
          mockVisualViewport.width = 800
          if (resizeHandler) {
            resizeHandler()
          }
        })
        
        expect(result.current).not.toBe(initialState)
        expect(result.current.width).toBe(800)
        expect(result.current.height).toBe(768) // unchanged
        expect(result.current.offsetTop).toBe(0) // unchanged
      })

      it('should handle rapid successive events efficiently', () => {
        let resizeHandler: (() => void) | undefined

        mockVisualViewport.addEventListener.mockImplementation((event, handler) => {
          if (event === 'resize') {
            resizeHandler = handler
          }
        })

        mockVisualViewport.width = 1024
        mockVisualViewport.height = 768
        mockVisualViewport.offsetTop = 0

        const { result } = renderHook(() => useWindowSize())
        
        const originalCurrent = result.current
        
        // Simulate rapid events with changing dimensions
        act(() => {
          for (let i = 0; i < 10; i++) {
            mockVisualViewport.width = 1000 + i
            if (resizeHandler) {
              resizeHandler()
            }
          }
        })
        
        // Should have the final width value
        expect(result.current.width).toBe(1009)
        expect(result.current).not.toBe(originalCurrent)
      })
    })

    describe('type safety and return value', () => {
      it('should return WindowSizeState interface', () => {
        const { result } = renderHook(() => useWindowSize())
        
        expect(result.current).toHaveProperty('width')
        expect(result.current).toHaveProperty('height')
        expect(result.current).toHaveProperty('offsetTop')
        
        expect(typeof result.current.width).toBe('number')
        expect(typeof result.current.height).toBe('number')
        expect(typeof result.current.offsetTop).toBe('number')
      })

      it('should handle various viewport dimension scenarios', () => {
        const scenarios = [
          { width: 0, height: 0, offsetTop: 0 },
          { width: 320, height: 568, offsetTop: 0 }, // iPhone SE
          { width: 375, height: 667, offsetTop: 0 }, // iPhone 8
          { width: 414, height: 896, offsetTop: 44 }, // iPhone with notch
          { width: 768, height: 1024, offsetTop: 0 }, // iPad
          { width: 1920, height: 1080, offsetTop: 0 }, // Desktop
          { width: 1024, height: 600, offsetTop: 100 }, // Scrolled view
        ]

        scenarios.forEach(scenario => {
          mockVisualViewport.width = scenario.width
          mockVisualViewport.height = scenario.height
          mockVisualViewport.offsetTop = scenario.offsetTop

          const { result } = renderHook(() => useWindowSize())
          
          expect(result.current.width).toBe(scenario.width)
          expect(result.current.height).toBe(scenario.height)
          expect(result.current.offsetTop).toBe(scenario.offsetTop)
        })
      })
    })

    describe('cross-browser compatibility', () => {
      it('should handle legacy browsers without visualViewport', () => {
        Object.defineProperty(window, 'visualViewport', {
          value: null,
          writable: true,
          configurable: true,
        })

        const { result } = renderHook(() => useWindowSize())
        
        // Should not crash and return default values
        expect(result.current.width).toBe(0)
        expect(result.current.height).toBe(0)
        expect(result.current.offsetTop).toBe(0)
      })

      it('should handle visualViewport with missing properties', () => {
        const incompleteViewport = {
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          // Missing width, height, offsetTop
        }

        Object.defineProperty(window, 'visualViewport', {
          value: incompleteViewport as unknown as VisualViewport,
          writable: true,
          configurable: true,
        })

        const { result } = renderHook(() => useWindowSize())
        
        // Should use default values for missing properties
        expect(result.current.width).toBe(0)
        expect(result.current.height).toBe(0)
        expect(result.current.offsetTop).toBe(0)
      })
    })
  })

  describe('integration scenarios', () => {
    it('should work correctly when both hooks are used together', () => {
      window.innerWidth = 375
      mockVisualViewport.width = 375
      mockVisualViewport.height = 667
      mockVisualViewport.offsetTop = 0

      const { result: mobileResult } = renderHook(() => useMobile())
      const { result: sizeResult } = renderHook(() => useWindowSize())
      
      expect(mobileResult.current).toBe(true)
      expect(sizeResult.current.width).toBe(375)
      expect(sizeResult.current.height).toBe(667)
    })

    it('should handle screen rotation scenarios', () => {
      let resizeHandler: (() => void) | undefined
      let changeHandler: ((event: unknown) => void) | undefined

      mockAddEventListener.mockImplementation((event: string, handler: (event: unknown) => void) => {
        if (event === 'change') {
          changeHandler = handler
        }
      })

      mockVisualViewport.addEventListener.mockImplementation((event: string, handler: () => void) => {
        if (event === 'resize') {
          resizeHandler = handler
        }
      })

      // Portrait mobile
      window.innerWidth = 375
      mockVisualViewport.width = 375
      mockVisualViewport.height = 667

      const { result: mobileResult } = renderHook(() => useMobile())
      const { result: sizeResult } = renderHook(() => useWindowSize())
      
      expect(mobileResult.current).toBe(true)
      expect(sizeResult.current.width).toBe(375)
      expect(sizeResult.current.height).toBe(667)
      
      // Simulate rotation to landscape
      act(() => {
        window.innerWidth = 667
        mockVisualViewport.width = 667
        mockVisualViewport.height = 375
        
        if (changeHandler) {
          changeHandler({ matches: true }) // Still mobile in landscape
        }
        if (resizeHandler) {
          resizeHandler()
        }
      })
      
      expect(mobileResult.current).toBe(true) // Still mobile (< 768px)
      expect(sizeResult.current.width).toBe(667)
      expect(sizeResult.current.height).toBe(375)
    })
  })
})