import * as validationsIndex from '@/lib/validations/index'

describe('Validations Index', () => {
  it('should export validation schemas from common', () => {
    expect(validationsIndex.uuidSchema).toBeDefined()
    expect(validationsIndex.emailSchema).toBeDefined()
  })

  it('should export validation schemas from project', () => {
    expect(validationsIndex.tagSchema).toBeDefined()
    expect(validationsIndex.PROJECT_CATEGORIES).toBeDefined()
  })

  it('should export validation schemas from user', () => {
    expect(validationsIndex.createUserSchema).toBeDefined()
    expect(validationsIndex.updateUserSchema).toBeDefined()
  })

  it('should export validation schemas from comment', () => {
    expect(validationsIndex.projectCommentContentSchema).toBeDefined()
    expect(validationsIndex.createProjectCommentSchema).toBeDefined()
  })

  it('should have correct schema structure', () => {
    // Test that imported schemas are actual Zod schemas
    expect(typeof validationsIndex.uuidSchema.parse).toBe('function')
    expect(typeof validationsIndex.emailSchema.parse).toBe('function')
    expect(typeof validationsIndex.tagSchema.parse).toBe('function')
    expect(typeof validationsIndex.createUserSchema.parse).toBe('function')
  })

  it('should validate UUID schema works correctly', () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000'
    const result = validationsIndex.uuidSchema.safeParse(validUUID)
    expect(result.success).toBe(true)
  })

  it('should validate email schema works correctly', () => {
    const validEmail = 'test@example.com'
    const result = validationsIndex.emailSchema.safeParse(validEmail)
    expect(result.success).toBe(true)
  })

  it('should validate tag schema works correctly', () => {
    const validTag = 'react'
    const result = validationsIndex.tagSchema.safeParse(validTag)
    expect(result.success).toBe(true)
  })

  it('should validate user creation schema works correctly', () => {
    const validUserData = {
      username: 'testuser123',
      email: 'test@example.com',
      supabaseUserId: 'supabase-id-123'
    }
    const result = validationsIndex.createUserSchema.safeParse(validUserData)
    expect(result.success).toBe(true)
  })
})