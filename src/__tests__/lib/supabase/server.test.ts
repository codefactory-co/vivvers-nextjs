import { createClient, getUser } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Mock dependencies
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn()
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn()
}))

const mockCreateServerClient = createServerClient as jest.MockedFunction<typeof createServerClient>
const mockCookies = cookies as jest.MockedFunction<typeof cookies>

describe('Supabase Server Configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://project.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid-anon-key'
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('createClient', () => {
    it('should create server client with proper cookie configuration', async () => {
      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([
          { name: 'session', value: 'abc123' }
        ]),
        set: jest.fn()
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = {
        auth: { getUser: jest.fn() }
      }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const client = await createClient()

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

      expect(client).toBe(mockSupabaseClient)
    })

    it('should handle cookie getAll operation', async () => {
      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([
          { name: 'session', value: 'abc123' },
          { name: 'refresh', value: 'def456' }
        ]),
        set: jest.fn()
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = { auth: { getUser: jest.fn() } }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      await createClient()

      // Get the cookies config from the call
      const cookiesConfig = mockCreateServerClient.mock.calls[0][2].cookies
      const result = cookiesConfig.getAll()

      expect(mockCookieStore.getAll).toHaveBeenCalled()
      expect(result).toEqual([
        { name: 'session', value: 'abc123' },
        { name: 'refresh', value: 'def456' }
      ])
    })

    it('should handle cookie setAll operation successfully', async () => {
      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([]),
        set: jest.fn()
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = { auth: { getUser: jest.fn() } }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      await createClient()

      // Get the cookies config from the call
      const cookiesConfig = mockCreateServerClient.mock.calls[0][2].cookies
      
      const cookiesToSet = [
        { name: 'session', value: 'new-session', options: { httpOnly: true } },
        { name: 'refresh', value: 'new-refresh', options: { secure: true } }
      ]

      // Should not throw error
      expect(() => cookiesConfig.setAll(cookiesToSet)).not.toThrow()

      expect(mockCookieStore.set).toHaveBeenCalledWith('session', 'new-session', { httpOnly: true })
      expect(mockCookieStore.set).toHaveBeenCalledWith('refresh', 'new-refresh', { secure: true })
    })

    it('should handle cookie setAll operation errors gracefully', async () => {
      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([]),
        set: jest.fn().mockImplementation(() => {
          throw new Error('Cannot set cookies in Server Component')
        })
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = { auth: { getUser: jest.fn() } }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      await createClient()

      // Get the cookies config from the call
      const cookiesConfig = mockCreateServerClient.mock.calls[0][2].cookies
      
      const cookiesToSet = [
        { name: 'session', value: 'new-session', options: {} }
      ]

      // Should not throw error - should catch and ignore
      expect(() => cookiesConfig.setAll(cookiesToSet)).not.toThrow()
    })

    it('should handle empty cookies array', async () => {
      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([]),
        set: jest.fn()
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = { auth: { getUser: jest.fn() } }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      await createClient()

      // Get the cookies config from the call
      const cookiesConfig = mockCreateServerClient.mock.calls[0][2].cookies
      
      expect(() => cookiesConfig.setAll([])).not.toThrow()
      expect(mockCookieStore.set).not.toHaveBeenCalled()
    })
  })

  describe('getUser', () => {
    it('should return user from supabase auth', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { username: 'testuser' }
      }

      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([]),
        set: jest.fn()
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null
          })
        }
      }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const user = await getUser()

      expect(user).toBe(mockUser)
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
    })

    it('should return null when user is not authenticated', async () => {
      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([]),
        set: jest.fn()
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: null
          })
        }
      }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const user = await getUser()

      expect(user).toBeNull()
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
    })

    it('should return null when auth returns error', async () => {
      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([]),
        set: jest.fn()
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'Invalid token' }
          })
        }
      }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const user = await getUser()

      expect(user).toBeNull()
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
    })

    it('should handle undefined user data', async () => {
      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([]),
        set: jest.fn()
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: undefined },
            error: null
          })
        }
      }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const user = await getUser()

      expect(user).toBeUndefined()
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
    })
  })
})