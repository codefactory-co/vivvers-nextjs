// Mock createBrowserClient before importing
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn()
}))

import { createClient } from '@/lib/supabase/client'
import { createBrowserClient } from '@supabase/ssr'

const mockCreateBrowserClient = createBrowserClient as jest.MockedFunction<typeof createBrowserClient>

describe('Supabase Client Configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('createClient', () => {
    it('should create client with valid environment variables', () => {
      const mockClient = { from: jest.fn() }
      mockCreateBrowserClient.mockReturnValue(mockClient)

      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://project.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'

      const client = createClient()

      expect(mockCreateBrowserClient).toHaveBeenCalledWith(
        'https://project.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
      )
      expect(client).toBe(mockClient)
    })

    it('should throw error when SUPABASE_URL is missing', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = ''
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid-key'

      expect(() => createClient()).toThrow(
        'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
      )
    })

    it('should throw error when SUPABASE_ANON_KEY is missing', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://project.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = ''

      expect(() => createClient()).toThrow(
        'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
      )
    })

    it('should throw error when both environment variables are missing', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      expect(() => createClient()).toThrow(
        'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
      )
    })

    it('should handle undefined environment variables', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = undefined
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = undefined

      expect(() => createClient()).toThrow(
        'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
      )
    })

    it('should handle null environment variables', () => {
      // @ts-ignore - testing runtime behavior
      process.env.NEXT_PUBLIC_SUPABASE_URL = null
      // @ts-ignore - testing runtime behavior
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = null

      expect(() => createClient()).toThrow(
        'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
      )
    })

    it('should work with URL containing special characters', () => {
      const mockClient = { from: jest.fn() }
      mockCreateBrowserClient.mockReturnValue(mockClient)

      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc-123_test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiJ9'

      const client = createClient()

      expect(mockCreateBrowserClient).toHaveBeenCalledWith(
        'https://abc-123_test.supabase.co',
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiJ9'
      )
      expect(client).toBe(mockClient)
    })

    it('should work with whitespace trimming in environment variables', () => {
      const mockClient = { from: jest.fn() }
      mockCreateBrowserClient.mockReturnValue(mockClient)

      process.env.NEXT_PUBLIC_SUPABASE_URL = '  https://project.supabase.co  '
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '  valid-key  '

      const client = createClient()

      // Should pass the values as-is since no trimming is implemented
      expect(mockCreateBrowserClient).toHaveBeenCalledWith(
        '  https://project.supabase.co  ',
        '  valid-key  '
      )
      expect(client).toBe(mockClient)
    })
  })
})