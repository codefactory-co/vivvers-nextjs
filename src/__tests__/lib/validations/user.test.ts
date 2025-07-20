import { createUserSchema, updateUserSchema, usernameSchema, type CreateUserData, type UpdateUserData, type Username } from '@/lib/validations/user'

describe('User Validation Schemas', () => {
  describe('createUserSchema', () => {
    describe('valid data', () => {
      it('should validate correct user creation data', () => {
        const validData = {
          username: 'testuser123',
          bio: 'A passionate developer',
          avatar: 'https://example.com/avatar.jpg',
          email: 'test@example.com',
          supabaseUserId: 'user-123-abc'
        }

        const result = createUserSchema.safeParse(validData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(validData)
        }
      })

      it('should validate minimal required data', () => {
        const minimalData = {
          username: 'abc',
          email: 'test@example.com',
          supabaseUserId: 'user-123'
        }

        const result = createUserSchema.safeParse(minimalData)
        expect(result.success).toBe(true)
      })

      it('should accept empty string for avatar', () => {
        const dataWithEmptyAvatar = {
          username: 'testuser',
          email: 'test@example.com',
          supabaseUserId: 'user-123',
          avatar: ''
        }

        const result = createUserSchema.safeParse(dataWithEmptyAvatar)
        expect(result.success).toBe(true)
      })

      it('should accept maximum length bio', () => {
        const maxBio = 'a'.repeat(500)
        const dataWithMaxBio = {
          username: 'testuser',
          email: 'test@example.com',
          supabaseUserId: 'user-123',
          bio: maxBio
        }

        const result = createUserSchema.safeParse(dataWithMaxBio)
        expect(result.success).toBe(true)
      })
    })

    describe('invalid data', () => {
      it('should reject missing required fields', () => {
        const incompleteData = {
          username: 'testuser'
          // missing email and supabaseUserId
        }

        const result = createUserSchema.safeParse(incompleteData)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(2)
          expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true)
          expect(result.error.issues.some(issue => issue.path.includes('supabaseUserId'))).toBe(true)
        }
      })

      it('should reject invalid email format', () => {
        const invalidEmailData = {
          username: 'testuser',
          email: 'invalid-email',
          supabaseUserId: 'user-123'
        }

        const result = createUserSchema.safeParse(invalidEmailData)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('올바른 이메일 형식이 아닙니다')
        }
      })

      it('should reject empty supabaseUserId', () => {
        const emptySupabaseIdData = {
          username: 'testuser',
          email: 'test@example.com',
          supabaseUserId: ''
        }

        const result = createUserSchema.safeParse(emptySupabaseIdData)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Supabase 사용자 ID가 필요합니다')
        }
      })

      it('should reject bio longer than 500 characters', () => {
        const longBio = 'a'.repeat(501)
        const dataWithLongBio = {
          username: 'testuser',
          email: 'test@example.com',
          supabaseUserId: 'user-123',
          bio: longBio
        }

        const result = createUserSchema.safeParse(dataWithLongBio)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('자기소개는 최대 500자까지 가능합니다')
        }
      })

      it('should reject invalid avatar URL', () => {
        const invalidAvatarData = {
          username: 'testuser',
          email: 'test@example.com',
          supabaseUserId: 'user-123',
          avatar: 'not-a-url'
        }

        const result = createUserSchema.safeParse(invalidAvatarData)
        expect(result.success).toBe(false)
        if (!result.success) {
          // Due to .or(z.literal('')) structure, the error message is "Invalid input"
          expect(result.error.issues[0].message).toBe('Invalid input')
        }
      })
    })

    describe('username validation in createUserSchema', () => {
      it('should reject username shorter than 3 characters', () => {
        const shortUsernameData = {
          username: 'ab',
          email: 'test@example.com',
          supabaseUserId: 'user-123'
        }

        const result = createUserSchema.safeParse(shortUsernameData)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('사용자명은 최소 3자 이상이어야 합니다')
        }
      })

      it('should reject username longer than 20 characters', () => {
        const longUsernameData = {
          username: 'a'.repeat(21),
          email: 'test@example.com',
          supabaseUserId: 'user-123'
        }

        const result = createUserSchema.safeParse(longUsernameData)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('사용자명은 최대 20자까지 가능합니다')
        }
      })

      it('should reject username with special characters', () => {
        const specialCharUsernameData = {
          username: 'user@name!',
          email: 'test@example.com',
          supabaseUserId: 'user-123'
        }

        const result = createUserSchema.safeParse(specialCharUsernameData)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('사용자명은 영문, 숫자, 하이픈만 사용할 수 있습니다')
        }
      })
    })
  })

  describe('updateUserSchema', () => {
    describe('valid data', () => {
      it('should validate complete update data', () => {
        const validUpdateData = {
          username: 'newusername',
          bio: 'Updated bio',
          avatar: 'https://example.com/new-avatar.jpg',
          socialLinks: {
            github: 'https://github.com/user',
            linkedin: 'https://linkedin.com/in/user',
            portfolio: 'https://portfolio.com'
          },
          skills: ['JavaScript', 'TypeScript', 'React'],
          experience: 'Senior developer with 5 years experience',
          isPublic: true
        }

        const result = updateUserSchema.safeParse(validUpdateData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(validUpdateData)
        }
      })

      it('should validate empty object (all fields optional)', () => {
        const emptyData = {}

        const result = updateUserSchema.safeParse(emptyData)
        expect(result.success).toBe(true)
      })

      it('should validate partial updates', () => {
        const partialData = {
          bio: 'Just updating bio',
          isPublic: false
        }

        const result = updateUserSchema.safeParse(partialData)
        expect(result.success).toBe(true)
      })

      it('should accept empty strings for social links', () => {
        const dataWithEmptySocial = {
          socialLinks: {
            github: '',
            linkedin: '',
            portfolio: ''
          }
        }

        const result = updateUserSchema.safeParse(dataWithEmptySocial)
        expect(result.success).toBe(true)
      })

      it('should accept maximum skills array', () => {
        const maxSkills = Array.from({ length: 20 }, (_, i) => `Skill${i + 1}`)
        const dataWithMaxSkills = {
          skills: maxSkills
        }

        const result = updateUserSchema.safeParse(dataWithMaxSkills)
        expect(result.success).toBe(true)
      })

      it('should accept maximum length experience', () => {
        const maxExperience = 'a'.repeat(1000)
        const dataWithMaxExperience = {
          experience: maxExperience
        }

        const result = updateUserSchema.safeParse(dataWithMaxExperience)
        expect(result.success).toBe(true)
      })
    })

    describe('invalid data', () => {
      it('should reject bio longer than 500 characters', () => {
        const longBio = 'a'.repeat(501)
        const dataWithLongBio = {
          bio: longBio
        }

        const result = updateUserSchema.safeParse(dataWithLongBio)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('자기소개는 최대 500자까지 가능합니다')
        }
      })

      it('should reject invalid avatar URL', () => {
        const invalidAvatarData = {
          avatar: 'invalid-url'
        }

        const result = updateUserSchema.safeParse(invalidAvatarData)
        expect(result.success).toBe(false)
        if (!result.success) {
          // Due to .or(z.literal('')) structure, the error message is "Invalid input"
          expect(result.error.issues[0].message).toBe('Invalid input')
        }
      })

      it('should reject experience longer than 1000 characters', () => {
        const longExperience = 'a'.repeat(1001)
        const dataWithLongExperience = {
          experience: longExperience
        }

        const result = updateUserSchema.safeParse(dataWithLongExperience)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('경력은 최대 1000자까지 입력 가능합니다')
        }
      })

      it('should reject more than 20 skills', () => {
        const tooManySkills = Array.from({ length: 21 }, (_, i) => `Skill${i + 1}`)
        const dataWithTooManySkills = {
          skills: tooManySkills
        }

        const result = updateUserSchema.safeParse(dataWithTooManySkills)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('스킬은 최대 20개까지 입력 가능합니다')
        }
      })

      it('should reject empty skill strings', () => {
        const dataWithEmptySkill = {
          skills: ['JavaScript', '', 'React']
        }

        const result = updateUserSchema.safeParse(dataWithEmptySkill)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('스킬은 최소 1글자 이상이어야 합니다')
        }
      })
    })

    describe('social links validation', () => {
      it('should reject invalid GitHub URL', () => {
        const invalidGithubData = {
          socialLinks: {
            github: 'not-a-url'
          }
        }

        const result = updateUserSchema.safeParse(invalidGithubData)
        expect(result.success).toBe(false)
        if (!result.success) {
          // Due to .or(z.literal('')) structure, the error message is "Invalid input"
          expect(result.error.issues[0].message).toBe('Invalid input')
        }
      })

      it('should reject invalid LinkedIn URL', () => {
        const invalidLinkedinData = {
          socialLinks: {
            linkedin: 'invalid-url'
          }
        }

        const result = updateUserSchema.safeParse(invalidLinkedinData)
        expect(result.success).toBe(false)
        if (!result.success) {
          // Due to .or(z.literal('')) structure, the error message is "Invalid input"
          expect(result.error.issues[0].message).toBe('Invalid input')
        }
      })

      it('should reject invalid portfolio URL', () => {
        const invalidPortfolioData = {
          socialLinks: {
            portfolio: 'not-a-url'
          }
        }

        const result = updateUserSchema.safeParse(invalidPortfolioData)
        expect(result.success).toBe(false)
        if (!result.success) {
          // Due to .or(z.literal('')) structure, the error message is "Invalid input"
          expect(result.error.issues[0].message).toBe('Invalid input')
        }
      })

      it('should validate multiple valid social links', () => {
        const validSocialData = {
          socialLinks: {
            github: 'https://github.com/username',
            linkedin: 'https://www.linkedin.com/in/username',
            portfolio: 'https://www.portfolio.dev'
          }
        }

        const result = updateUserSchema.safeParse(validSocialData)
        expect(result.success).toBe(true)
      })

      it('should validate partial social links', () => {
        const partialSocialData = {
          socialLinks: {
            github: 'https://github.com/username'
            // linkedin and portfolio not provided
          }
        }

        const result = updateUserSchema.safeParse(partialSocialData)
        expect(result.success).toBe(true)
      })
    })

    describe('username validation in updateUserSchema', () => {
      it('should reject username shorter than 3 characters', () => {
        const shortUsernameData = {
          username: 'ab'
        }

        const result = updateUserSchema.safeParse(shortUsernameData)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('사용자명은 최소 3자 이상이어야 합니다')
        }
      })

      it('should reject username longer than 20 characters', () => {
        const longUsernameData = {
          username: 'a'.repeat(21)
        }

        const result = updateUserSchema.safeParse(longUsernameData)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('사용자명은 최대 20자까지 가능합니다')
        }
      })

      it('should reject username with special characters', () => {
        const specialCharUsernameData = {
          username: 'user@name!'
        }

        const result = updateUserSchema.safeParse(specialCharUsernameData)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('사용자명은 영문, 숫자, 하이픈만 사용할 수 있습니다')
        }
      })
    })
  })

  describe('usernameSchema', () => {
    describe('valid usernames', () => {
      it('should validate basic alphanumeric usernames', () => {
        const validUsernames = [
          'abc',
          'user123',
          'testuser',
          'username123',
          'ABC123',
          'a'.repeat(20) // maximum length
        ]

        validUsernames.forEach(username => {
          const result = usernameSchema.safeParse(username)
          expect(result.success).toBe(true)
        })
      })

      it('should validate usernames with hyphens', () => {
        const validUsernames = [
          'user-name',
          'test-user-123',
          'my-username',
          'user-123-test',
          'a-b-c',
          'username-'
        ]

        validUsernames.forEach(username => {
          const result = usernameSchema.safeParse(username)
          expect(result.success).toBe(true)
        })
      })

      it('should validate mixed case usernames', () => {
        const validUsernames = [
          'UserName',
          'TestUser123',
          'MyUserName',
          'User-Name-123',
          'ABC-def-123'
        ]

        validUsernames.forEach(username => {
          const result = usernameSchema.safeParse(username)
          expect(result.success).toBe(true)
        })
      })

      it('should validate boundary length usernames', () => {
        const minLength = 'abc' // 3 characters
        const maxLength = 'a'.repeat(20) // 20 characters

        expect(usernameSchema.safeParse(minLength).success).toBe(true)
        expect(usernameSchema.safeParse(maxLength).success).toBe(true)
      })
    })

    describe('invalid usernames', () => {
      it('should reject usernames shorter than 3 characters', () => {
        const invalidUsernames = ['', 'a', 'ab']

        invalidUsernames.forEach(username => {
          const result = usernameSchema.safeParse(username)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues[0].message).toBe('사용자명은 최소 3자 이상이어야 합니다')
          }
        })
      })

      it('should reject usernames longer than 20 characters', () => {
        const invalidUsernames = [
          'a'.repeat(21),
          'verylongusernamethatexceedslimit',
          'superlongusernametest123456'
        ]

        invalidUsernames.forEach(username => {
          const result = usernameSchema.safeParse(username)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues[0].message).toBe('사용자명은 최대 20자까지 가능합니다')
          }
        })
      })

      it('should reject usernames with spaces', () => {
        const invalidUsernames = [
          'user name',
          'test user',
          ' username',
          'username ',
          'user name 123'
        ]

        invalidUsernames.forEach(username => {
          const result = usernameSchema.safeParse(username)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues[0].message).toBe('사용자명은 영문, 숫자, 하이픈만 사용할 수 있습니다')
          }
        })
      })

      it('should reject usernames with special characters', () => {
        const invalidUsernames = [
          'user@name',
          'test.user',
          'user_name',
          'user+name',
          'user=name',
          'user[name]',
          'user{name}',
          'user(name)',
          'user*name',
          'user&name',
          'user%name',
          'user$name',
          'user#name',
          'user!name',
          'user?name',
          'user/name',
          'user\\name',
          'user|name',
          'user:name',
          'user;name',
          'user"name',
          "user'name",
          'user<name>',
          'user,name',
          'user`name',
          'user~name'
        ]

        invalidUsernames.forEach(username => {
          const result = usernameSchema.safeParse(username)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues[0].message).toBe('사용자명은 영문, 숫자, 하이픈만 사용할 수 있습니다')
          }
        })
      })

      it('should reject usernames with Unicode characters', () => {
        const invalidUsernames = [
          '사용자명',
          'ユーザー',
          'usér',
          'naïve',
          'café',
          'résumé'
        ]

        invalidUsernames.forEach(username => {
          const result = usernameSchema.safeParse(username)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues[0].message).toBe('사용자명은 영문, 숫자, 하이픈만 사용할 수 있습니다')
          }
        })
      })
    })

    describe('edge cases', () => {
      it('should handle null and undefined', () => {
        expect(usernameSchema.safeParse(null).success).toBe(false)
        expect(usernameSchema.safeParse(undefined).success).toBe(false)
      })

      it('should handle non-string types', () => {
        expect(usernameSchema.safeParse(123).success).toBe(false)
        expect(usernameSchema.safeParse(true).success).toBe(false)
        expect(usernameSchema.safeParse({}).success).toBe(false)
        expect(usernameSchema.safeParse([]).success).toBe(false)
      })

      it('should validate exact boundary cases', () => {
        // Exactly 3 characters
        expect(usernameSchema.safeParse('abc').success).toBe(true)
        expect(usernameSchema.safeParse('a23').success).toBe(true)
        expect(usernameSchema.safeParse('a-b').success).toBe(true)

        // Exactly 20 characters
        const exactly20 = 'a'.repeat(20)
        expect(usernameSchema.safeParse(exactly20).success).toBe(true)
        expect(exactly20.length).toBe(20)

        // Just over/under limits
        expect(usernameSchema.safeParse('ab').success).toBe(false)
        expect(usernameSchema.safeParse('a'.repeat(21)).success).toBe(false)
      })
    })

    describe('regex pattern validation', () => {
      it('should match regex pattern ^[a-zA-Z0-9-]+$', () => {
        // Valid characters
        expect(usernameSchema.safeParse('abc').success).toBe(true) // lowercase
        expect(usernameSchema.safeParse('ABC').success).toBe(true) // uppercase
        expect(usernameSchema.safeParse('123').success).toBe(true) // numbers
        expect(usernameSchema.safeParse('a-b').success).toBe(true) // hyphen
        expect(usernameSchema.safeParse('a1B-c2D').success).toBe(true) // mixed

        // Invalid characters (already tested above but confirming regex specifically)
        expect(usernameSchema.safeParse('a_b').success).toBe(false) // underscore
        expect(usernameSchema.safeParse('a.b').success).toBe(false) // dot
        expect(usernameSchema.safeParse('a b').success).toBe(false) // space
      })

      it('should allow consecutive hyphens', () => {
        expect(usernameSchema.safeParse('a--b').success).toBe(true)
        expect(usernameSchema.safeParse('a---b').success).toBe(true)
      })

      it('should allow hyphens at start and end', () => {
        expect(usernameSchema.safeParse('-abc').success).toBe(true)
        expect(usernameSchema.safeParse('abc-').success).toBe(true)
        expect(usernameSchema.safeParse('-abc-').success).toBe(true)
      })
    })
  })

  describe('type inference', () => {
    it('should infer correct types', () => {
      // This test verifies TypeScript type inference works correctly
      const createData: CreateUserData = {
        username: 'testuser',
        email: 'test@example.com',
        supabaseUserId: 'user-123'
      }

      const updateData: UpdateUserData = {
        username: 'newusername',
        bio: 'New bio'
      }

      const username: Username = 'validusername'

      // These should compile without TypeScript errors
      expect(typeof createData.username).toBe('string')
      expect(typeof updateData.username).toBe('string')
      expect(typeof username).toBe('string')
    })

    it('should have correct optional fields in UpdateUserData', () => {
      // All fields should be optional in UpdateUserData
      const emptyUpdate: UpdateUserData = {}
      const partialUpdate: UpdateUserData = {
        bio: 'Only bio update'
      }

      expect(emptyUpdate).toBeDefined()
      expect(partialUpdate).toBeDefined()
    })
  })
})