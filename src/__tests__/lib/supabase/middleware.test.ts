import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Mock dependencies
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn()
}))

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(),
    redirect: jest.fn()
  }
}))

// Type for mock user in tests
interface MockUser {
  id: string
  email: string
  user_metadata?: {
    profile_completed?: boolean
  }
}

const mockCreateServerClient = createServerClient as jest.MockedFunction<typeof createServerClient>
const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>

describe('Supabase Middleware', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://project.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'valid-anon-key'
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  const createMockRequest = (pathname: string, cookies: Record<string, string> = {}) => {
    const mockCookies = {
      getAll: jest.fn().mockReturnValue(
        Object.entries(cookies).map(([name, value]) => ({ name, value }))
      ),
      set: jest.fn()
    }

    return {
      nextUrl: { pathname, clone: jest.fn().mockReturnValue({ pathname }) },
      cookies: mockCookies
    } as unknown as NextRequest
  }

  const createMockSupabaseClient = (user: MockUser | null = null) => {
    return {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user },
          error: null
        })
      }
    }
  }

  describe('updateSession', () => {
    it('should allow access to public routes without authentication', async () => {
      const mockRequest = createMockRequest('/')
      const mockSupabaseClient = createMockSupabaseClient(null)
      const mockSupabaseResponse = NextResponse.next({ request: mockRequest })

      mockCreateServerClient.mockReturnValue(mockSupabaseClient)
      mockNextResponse.next.mockReturnValue(mockSupabaseResponse)

      const response = await updateSession(mockRequest)

      expect(response).toBe(mockSupabaseResponse)
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should redirect unauthenticated users from protected routes to signin', async () => {
      const mockRequest = createMockRequest('/profile/user123')
      const mockSupabaseClient = createMockSupabaseClient(null)
      const mockSupabaseResponse = NextResponse.next({ request: mockRequest })
      const mockRedirectResponse = NextResponse.redirect('http://localhost:3000/signin')

      mockCreateServerClient.mockReturnValue(mockSupabaseClient)
      mockNextResponse.next.mockReturnValue(mockSupabaseResponse)
      mockNextResponse.redirect.mockReturnValue(mockRedirectResponse)

      const response = await updateSession(mockRequest)

      expect(response).toBe(mockRedirectResponse)
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should redirect unauthenticated users from project upload to signin', async () => {
      const mockRequest = createMockRequest('/project/upload')
      const mockSupabaseClient = createMockSupabaseClient(null)
      const mockSupabaseResponse = NextResponse.next({ request: mockRequest })
      const mockRedirectResponse = NextResponse.redirect('http://localhost:3000/signin')

      mockCreateServerClient.mockReturnValue(mockSupabaseClient)
      mockNextResponse.next.mockReturnValue(mockSupabaseResponse)
      mockNextResponse.redirect.mockReturnValue(mockRedirectResponse)

      const response = await updateSession(mockRequest)

      expect(response).toBe(mockRedirectResponse)
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should redirect authenticated users from auth routes to home', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { profile_completed: true }
      }
      const mockRequest = createMockRequest('/signin')
      const mockSupabaseClient = createMockSupabaseClient(mockUser)
      const mockSupabaseResponse = NextResponse.next({ request: mockRequest })
      const mockRedirectResponse = NextResponse.redirect('http://localhost:3000/')

      mockCreateServerClient.mockReturnValue(mockSupabaseClient)
      mockNextResponse.next.mockReturnValue(mockSupabaseResponse)
      mockNextResponse.redirect.mockReturnValue(mockRedirectResponse)

      const response = await updateSession(mockRequest)

      expect(response).toBe(mockRedirectResponse)
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should redirect authenticated users from signup to home', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { profile_completed: true }
      }
      const mockRequest = createMockRequest('/signup')
      const mockSupabaseClient = createMockSupabaseClient(mockUser)
      const mockSupabaseResponse = NextResponse.next({ request: mockRequest })
      const mockRedirectResponse = NextResponse.redirect('http://localhost:3000/')

      mockCreateServerClient.mockReturnValue(mockSupabaseClient)
      mockNextResponse.next.mockReturnValue(mockSupabaseResponse)
      mockNextResponse.redirect.mockReturnValue(mockRedirectResponse)

      const response = await updateSession(mockRequest)

      expect(response).toBe(mockRedirectResponse)
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should redirect users without completed profile to onboarding', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { profile_completed: false }
      }
      const mockRequest = createMockRequest('/profile/user123')
      const mockSupabaseClient = createMockSupabaseClient(mockUser)
      const mockSupabaseResponse = NextResponse.next({ request: mockRequest })
      const mockRedirectResponse = NextResponse.redirect('http://localhost:3000/onboarding')

      mockCreateServerClient.mockReturnValue(mockSupabaseClient)
      mockNextResponse.next.mockReturnValue(mockSupabaseResponse)
      mockNextResponse.redirect.mockReturnValue(mockRedirectResponse)

      const response = await updateSession(mockRequest)

      expect(response).toBe(mockRedirectResponse)
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should redirect users without profile metadata to onboarding', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {}
      }
      const mockRequest = createMockRequest('/profile/user123')
      const mockSupabaseClient = createMockSupabaseClient(mockUser)
      const mockSupabaseResponse = NextResponse.next({ request: mockRequest })
      const mockRedirectResponse = NextResponse.redirect('http://localhost:3000/onboarding')

      mockCreateServerClient.mockReturnValue(mockSupabaseClient)
      mockNextResponse.next.mockReturnValue(mockSupabaseResponse)
      mockNextResponse.redirect.mockReturnValue(mockRedirectResponse)

      const response = await updateSession(mockRequest)

      expect(response).toBe(mockRedirectResponse)
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should not redirect from onboarding when user needs onboarding', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { profile_completed: false }
      }
      const mockRequest = createMockRequest('/onboarding')
      const mockSupabaseClient = createMockSupabaseClient(mockUser)
      const mockSupabaseResponse = NextResponse.next({ request: mockRequest })

      mockCreateServerClient.mockReturnValue(mockSupabaseClient)
      mockNextResponse.next.mockReturnValue(mockSupabaseResponse)

      const response = await updateSession(mockRequest)

      expect(response).toBe(mockSupabaseResponse)
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should redirect from onboarding when profile is completed', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { profile_completed: true }
      }
      const mockRequest = createMockRequest('/onboarding')
      const mockSupabaseClient = createMockSupabaseClient(mockUser)
      const mockSupabaseResponse = NextResponse.next({ request: mockRequest })
      const mockRedirectResponse = NextResponse.redirect('http://localhost:3000/')

      mockCreateServerClient.mockReturnValue(mockSupabaseClient)
      mockNextResponse.next.mockReturnValue(mockSupabaseResponse)
      mockNextResponse.redirect.mockReturnValue(mockRedirectResponse)

      const response = await updateSession(mockRequest)

      expect(response).toBe(mockRedirectResponse)
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should allow authenticated users with completed profile to access protected routes', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { profile_completed: true }
      }
      const mockRequest = createMockRequest('/profile/user123')
      const mockSupabaseClient = createMockSupabaseClient(mockUser)
      const mockSupabaseResponse = NextResponse.next({ request: mockRequest })

      mockCreateServerClient.mockReturnValue(mockSupabaseClient)
      mockNextResponse.next.mockReturnValue(mockSupabaseResponse)

      const response = await updateSession(mockRequest)

      expect(response).toBe(mockSupabaseResponse)
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should handle cookie operations correctly', async () => {
      const mockRequest = createMockRequest('/', { session: 'abc123' })
      const mockSupabaseClient = createMockSupabaseClient(null)
      
      // Create a mock response with proper cookies interface
      const mockSetCookie = jest.fn()
      const mockGetAllCookies = jest.fn()
      const mockSupabaseResponse = {
        cookies: {
          set: mockSetCookie,
          getAll: mockGetAllCookies
        }
      }

      mockCreateServerClient.mockReturnValue(mockSupabaseClient)
      mockNextResponse.next.mockReturnValue(mockSupabaseResponse)

      await updateSession(mockRequest)

      // Verify createServerClient was called with cookies config
      expect(mockCreateServerClient).toHaveBeenCalledWith(
        'https://project.supabase.co',
        'valid-anon-key',
        {
          cookies: {
            getAll: expect.any(Function),
            setAll: expect.any(Function)
          }
        }
      )

      // Test cookie operations
      const cookiesConfig = mockCreateServerClient.mock.calls[0][2].cookies

      // Test getAll
      const cookies = cookiesConfig.getAll()
      expect(cookies).toEqual([{ name: 'session', value: 'abc123' }])

      // Test setAll
      const cookiesToSet = [
        { name: 'new-cookie', value: 'new-value', options: { httpOnly: true } }
      ]
      cookiesConfig.setAll(cookiesToSet)

      expect(mockRequest.cookies.set).toHaveBeenCalledWith('new-cookie', 'new-value')
      expect(mockSetCookie).toHaveBeenCalledWith(
        'new-cookie',
        'new-value',
        { httpOnly: true }
      )
    })

    it('should identify route types correctly', async () => {
      const testCases = [
        { path: '/profile/user123', isProtected: true, isAuth: false, isOnboarding: false },
        { path: '/project/upload', isProtected: true, isAuth: false, isOnboarding: false },
        { path: '/signin', isProtected: false, isAuth: true, isOnboarding: false },
        { path: '/signup', isProtected: false, isAuth: true, isOnboarding: false },
        { path: '/onboarding', isProtected: false, isAuth: false, isOnboarding: true },
        { path: '/', isProtected: false, isAuth: false, isOnboarding: false },
        { path: '/project/abc123', isProtected: false, isAuth: false, isOnboarding: false }
      ]

      for (const testCase of testCases) {
        const mockRequest = createMockRequest(testCase.path)
        const mockSupabaseClient = createMockSupabaseClient(null)
        const mockSupabaseResponse = NextResponse.next({ request: mockRequest })

        mockCreateServerClient.mockReturnValue(mockSupabaseClient)
        mockNextResponse.next.mockReturnValue(mockSupabaseResponse)

        await updateSession(mockRequest)

        // Verify the route was processed correctly based on type
        if (testCase.isProtected) {
          expect(mockNextResponse.redirect).toHaveBeenCalled()
        } else {
          expect(mockNextResponse.redirect).not.toHaveBeenCalled()
        }

        jest.clearAllMocks()
      }
    })

    it('should handle undefined user metadata gracefully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com'
        // No user_metadata property
      }
      const mockRequest = createMockRequest('/profile/user123')
      const mockSupabaseClient = createMockSupabaseClient(mockUser)
      const mockSupabaseResponse = NextResponse.next({ request: mockRequest })
      const mockRedirectResponse = NextResponse.redirect('http://localhost:3000/onboarding')

      mockCreateServerClient.mockReturnValue(mockSupabaseClient)
      mockNextResponse.next.mockReturnValue(mockSupabaseResponse)
      mockNextResponse.redirect.mockReturnValue(mockRedirectResponse)

      const response = await updateSession(mockRequest)

      expect(response).toBe(mockRedirectResponse)
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should handle supabase auth error gracefully', async () => {
      const mockRequest = createMockRequest('/profile/user123')
      const mockSupabaseClient = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'Invalid token' }
          })
        }
      }
      const mockSupabaseResponse = NextResponse.next({ request: mockRequest })
      const mockRedirectResponse = NextResponse.redirect('http://localhost:3000/signin')

      mockCreateServerClient.mockReturnValue(mockSupabaseClient)
      mockNextResponse.next.mockReturnValue(mockSupabaseResponse)
      mockNextResponse.redirect.mockReturnValue(mockRedirectResponse)

      const response = await updateSession(mockRequest)

      expect(response).toBe(mockRedirectResponse)
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should handle URL cloning for redirects', async () => {
      const mockClonedUrl = { pathname: '/signin' }
      const mockRequest = createMockRequest('/profile/user123')
      mockRequest.nextUrl.clone = jest.fn().mockReturnValue(mockClonedUrl)

      const mockSupabaseClient = createMockSupabaseClient(null)
      const mockSupabaseResponse = NextResponse.next({ request: mockRequest })
      const mockRedirectResponse = NextResponse.redirect('http://localhost:3000/signin')

      mockCreateServerClient.mockReturnValue(mockSupabaseClient)
      mockNextResponse.next.mockReturnValue(mockSupabaseResponse)
      mockNextResponse.redirect.mockReturnValue(mockRedirectResponse)

      await updateSession(mockRequest)

      expect(mockRequest.nextUrl.clone).toHaveBeenCalled()
      expect(mockClonedUrl.pathname).toBe('/signin')
    })
  })
})