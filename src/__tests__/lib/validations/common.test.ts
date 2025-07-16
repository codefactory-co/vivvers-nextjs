import {
  emailSchema,
  urlSchema,
  uuidSchema,
  koreanNameSchema,
  shortTextSchema,
  mediumTextSchema,
  longTextSchema,
  dateSchema,
  dateStringSchema,
  positiveIntSchema,
  nonNegativeIntSchema,
  optionalStringSchema,
  supabaseIdSchema
} from '@/lib/validations/common'

describe('Common Validation Schemas', () => {
  describe('emailSchema', () => {
    describe('valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.kr',
        'firstname+lastname@example.org',
        'email@subdomain.example.com',
        'firstname.lastname@example.com',
        '1234567890@example.com',
        'email@example-one.com',
        '_______@example.com',
        'email@example.name',
        'email@example.museum',
        'email@example.co.jp'
      ]

      it.each(validEmails)('should accept valid email: %s', (email) => {
        const result = emailSchema.safeParse(email)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(email)
        }
      })
    })

    describe('invalid emails', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com',
        'test..test@example.com',
        'test@example',
        'test@.example.com',
        'test@example.',
        'test @example.com',
        'test@exam ple.com',
        '',
        '   ',
        'test@example..com',
        '.test@example.com',
        'test.@example.com'
      ]

      it.each(invalidEmails)('should reject invalid email: %s', (email) => {
        const result = emailSchema.safeParse(email)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('올바른 이메일 형식이 아닙니다')
        }
      })
    })

    it('should reject non-string values', () => {
      const nonStringValues = [123, null, undefined, {}, []]
      
      nonStringValues.forEach(value => {
        const result = emailSchema.safeParse(value)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('urlSchema', () => {
    describe('valid URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://example.com',
        'https://www.example.com',
        'https://subdomain.example.com',
        'https://example.com/path',
        'https://example.com/path?query=value',
        'https://example.com/path#fragment',
        'https://example.com:8080',
        'https://example.com/path/to/resource',
        'https://user:password@example.com',
        'ftp://ftp.example.com',
        'file:///path/to/file'
      ]

      it.each(validUrls)('should accept valid URL: %s', (url) => {
        const result = urlSchema.safeParse(url)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(url)
        }
      })
    })

    describe('invalid URLs', () => {
      const invalidUrls = [
        'not-a-url',
        'example.com',
        'www.example.com',
        '//example.com',
        'https://',
        'https://?',
        'https://#',
        'https:// example.com',
        '',
        '   ',
        'ht tp://example.com'
      ]

      it.each(invalidUrls)('should reject invalid URL: %s', (url) => {
        const result = urlSchema.safeParse(url)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('올바른 URL 형식이 아닙니다')
        }
      })
    })

    it('should reject non-string values', () => {
      const nonStringValues = [123, null, undefined, {}, []]
      
      nonStringValues.forEach(value => {
        const result = urlSchema.safeParse(value)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('uuidSchema', () => {
    describe('valid UUIDs', () => {
      const validUuids = [
        '123e4567-e89b-12d3-a456-426614174000',
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
        '00000000-0000-0000-0000-000000000000'
      ]

      it.each(validUuids)('should accept valid UUID: %s', (uuid) => {
        const result = uuidSchema.safeParse(uuid)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(uuid)
        }
      })
    })

    describe('invalid UUIDs', () => {
      const invalidUuids = [
        '123e4567-e89b-12d3-a456-42661417400', // too short
        '123e4567-e89b-12d3-a456-4266141740000', // too long
        '123e4567-e89b-12d3-a456-42661417400g', // invalid character
        '123e4567e89b12d3a456426614174000', // missing hyphens
        '123e4567-e89b-12d3-a456_426614174000', // underscore instead of hyphen
        'not-a-uuid',
        '',
        '   ',
        '123e4567-e89b-12d3-a456', // incomplete
        'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz' // invalid hex characters
      ]

      it.each(invalidUuids)('should reject invalid UUID: %s', (uuid) => {
        const result = uuidSchema.safeParse(uuid)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('올바른 UUID 형식이 아닙니다')
        }
      })
    })

    it('should reject non-string values', () => {
      const nonStringValues = [123, null, undefined, {}, []]
      
      nonStringValues.forEach(value => {
        const result = uuidSchema.safeParse(value)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('koreanNameSchema', () => {
    describe('valid Korean names', () => {
      const validNames = [
        '김철수',
        '이영희',
        '박지성',
        'John',
        'Jane',
        '김 철수', // space allowed
        '이 영 희', // multiple spaces
        '박지성김', // longer Korean name
        'John Doe', // English with space
        '김John', // mixed Korean-English
        '이Jane', // mixed Korean-English
        '최민수박', // 4 characters
        'Alexander' // longer English name (10 chars)
      ]

      it.each(validNames)('should accept valid name: %s', (name) => {
        const result = koreanNameSchema.safeParse(name)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(name)
        }
      })
    })

    describe('invalid Korean names - length constraints', () => {
      it('should reject names shorter than 2 characters', () => {
        const shortNames = ['김', 'A', '']
        
        shortNames.forEach(name => {
          const result = koreanNameSchema.safeParse(name)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues[0].message).toBe('이름은 최소 2자 이상이어야 합니다')
          }
        })
      })

      it('should reject names longer than 10 characters', () => {
        const longNames = [
          '김철수박영희이민수정동', // 11 Korean characters
          'VeryLongName', // 12 English characters
          '김철수박영희이민수정홍길동' // 13 Korean characters
        ]
        
        longNames.forEach(name => {
          const result = koreanNameSchema.safeParse(name)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues[0].message).toBe('이름은 최대 10자까지 가능합니다')
          }
        })
      })
    })

    describe('invalid Korean names - character restrictions', () => {
      const invalidNames = [
        '김철수123', // numbers
        '이영희!', // special characters
        '박지성@', // special characters
        '김-철수', // hyphen
        '이_영희', // underscore
        '박.지성', // period
        '김철수#', // hash
        '이영희$', // dollar sign
        '박지성%', // percent
        '김철수^', // caret
        '이영희&', // ampersand
        '박지성*', // asterisk
        '김철수()', // parentheses
        '이영희[]', // brackets
        '박지성{}', // braces
        '김철수|', // pipe
        '이영희\\', // backslash
        '박지성/', // forward slash
        '김철수?', // question mark
        '이영희<>', // angle brackets
        '박지성,', // comma
        '김철수;', // semicolon
        '이영희:', // colon
        "박지성'", // single quote
        '김철수"', // double quote
        '이영희`', // backtick
        '박지성~', // tilde
        '김철수+', // plus
        '이영희=', // equals
        '한글中文', // Chinese characters
        'ひらがな', // Japanese hiragana
        'カタカナ' // Japanese katakana
      ]

      it.each(invalidNames)('should reject invalid characters in name: %s', (name) => {
        const result = koreanNameSchema.safeParse(name)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('이름은 한글, 영문만 사용할 수 있습니다')
        }
      })
    })

    it('should reject non-string values', () => {
      const nonStringValues = [123, null, undefined, {}, []]
      
      nonStringValues.forEach(value => {
        const result = koreanNameSchema.safeParse(value)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('shortTextSchema', () => {
    it('should accept text within 100 character limit', () => {
      const validTexts = [
        '',
        'Short text',
        'A'.repeat(100), // exactly 100 characters
        'Medium length text with various characters and spaces',
        '한글 텍스트도 잘 동작해야 합니다',
        'Mixed 한글 and English text'
      ]

      validTexts.forEach(text => {
        const result = shortTextSchema.safeParse(text)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(text)
        }
      })
    })

    it('should reject text longer than 100 characters', () => {
      const longText = 'A'.repeat(101)
      const result = shortTextSchema.safeParse(longText)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('최대 100자까지 입력 가능합니다')
      }
    })

    it('should reject non-string values', () => {
      const nonStringValues = [123, null, undefined, {}, []]
      
      nonStringValues.forEach(value => {
        const result = shortTextSchema.safeParse(value)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('mediumTextSchema', () => {
    it('should accept text within 500 character limit', () => {
      const validTexts = [
        '',
        'Medium length text',
        'A'.repeat(500), // exactly 500 characters
        '한글로 작성된 중간 길이의 텍스트입니다. '.repeat(10)
      ]

      validTexts.forEach(text => {
        const result = mediumTextSchema.safeParse(text)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(text)
        }
      })
    })

    it('should reject text longer than 500 characters', () => {
      const longText = 'A'.repeat(501)
      const result = mediumTextSchema.safeParse(longText)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('최대 500자까지 입력 가능합니다')
      }
    })

    it('should reject non-string values', () => {
      const nonStringValues = [123, null, undefined, {}, []]
      
      nonStringValues.forEach(value => {
        const result = mediumTextSchema.safeParse(value)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('longTextSchema', () => {
    it('should accept text within 2000 character limit', () => {
      const validTexts = [
        '',
        'Long text content',
        'A'.repeat(2000), // exactly 2000 characters
        '매우 긴 한글 텍스트를 테스트합니다. '.repeat(50)
      ]

      validTexts.forEach(text => {
        const result = longTextSchema.safeParse(text)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(text)
        }
      })
    })

    it('should reject text longer than 2000 characters', () => {
      const longText = 'A'.repeat(2001)
      const result = longTextSchema.safeParse(longText)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('최대 2000자까지 입력 가능합니다')
      }
    })

    it('should reject non-string values', () => {
      const nonStringValues = [123, null, undefined, {}, []]
      
      nonStringValues.forEach(value => {
        const result = longTextSchema.safeParse(value)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('dateSchema', () => {
    it('should accept valid Date objects', () => {
      const validDates = [
        new Date(),
        new Date('2023-01-01'),
        new Date('2024-12-31T23:59:59Z'),
        new Date(0), // epoch
        new Date(2024, 0, 1), // January 1, 2024
      ]

      validDates.forEach(date => {
        const result = dateSchema.safeParse(date)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(date)
        }
      })
    })

    it('should reject non-Date values', () => {
      const nonDateValues = [
        '2023-01-01',
        123456789,
        'invalid-date',
        null,
        undefined,
        {},
        []
      ]
      
      nonDateValues.forEach(value => {
        const result = dateSchema.safeParse(value)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('dateStringSchema', () => {
    it('should accept valid ISO datetime strings', () => {
      const validDateStrings = [
        '2023-01-01T00:00:00Z',
        '2024-12-31T23:59:59.999Z',
        '2023-06-15T12:30:45.123Z',
        '2024-01-01T00:00:00.000Z'
      ]

      validDateStrings.forEach(dateString => {
        const result = dateStringSchema.safeParse(dateString)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(dateString)
        }
      })
    })

    it('should reject invalid datetime strings', () => {
      const invalidDateStrings = [
        '2023-01-01',
        '2023/01/01',
        'invalid-date',
        '2023-13-01T00:00:00Z', // invalid month
        '2023-01-32T00:00:00Z', // invalid day
        '2023-01-01T25:00:00Z', // invalid hour
        '',
        '   '
      ]

      invalidDateStrings.forEach(dateString => {
        const result = dateStringSchema.safeParse(dateString)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('올바른 날짜 형식이 아닙니다')
        }
      })
    })

    it('should reject non-string values', () => {
      const nonStringValues = [123, null, undefined, {}, [], new Date()]
      
      nonStringValues.forEach(value => {
        const result = dateStringSchema.safeParse(value)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('positiveIntSchema', () => {
    it('should accept positive integers', () => {
      const validNumbers = [1, 2, 100, 999, 1000000]

      validNumbers.forEach(num => {
        const result = positiveIntSchema.safeParse(num)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(num)
        }
      })
    })

    it('should reject zero', () => {
      const result = positiveIntSchema.safeParse(0)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('양의 정수여야 합니다')
      }
    })

    it('should reject negative numbers', () => {
      const negativeNumbers = [-1, -10, -100]

      negativeNumbers.forEach(num => {
        const result = positiveIntSchema.safeParse(num)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('양의 정수여야 합니다')
        }
      })
    })

    it('should reject decimal numbers', () => {
      const decimalNumbers = [1.5, 2.1, 0.5, -1.5]

      decimalNumbers.forEach(num => {
        const result = positiveIntSchema.safeParse(num)
        expect(result.success).toBe(false)
      })
    })

    it('should reject non-number values', () => {
      const nonNumberValues = ['1', '0', null, undefined, {}, [], true]
      
      nonNumberValues.forEach(value => {
        const result = positiveIntSchema.safeParse(value)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('nonNegativeIntSchema', () => {
    it('should accept zero and positive integers', () => {
      const validNumbers = [0, 1, 2, 100, 999, 1000000]

      validNumbers.forEach(num => {
        const result = nonNegativeIntSchema.safeParse(num)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(num)
        }
      })
    })

    it('should reject negative numbers', () => {
      const negativeNumbers = [-1, -10, -100]

      negativeNumbers.forEach(num => {
        const result = nonNegativeIntSchema.safeParse(num)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('0 이상의 정수여야 합니다')
        }
      })
    })

    it('should reject decimal numbers', () => {
      const decimalNumbers = [1.5, 2.1, 0.5, -1.5]

      decimalNumbers.forEach(num => {
        const result = nonNegativeIntSchema.safeParse(num)
        expect(result.success).toBe(false)
      })
    })

    it('should reject non-number values', () => {
      const nonNumberValues = ['1', '0', null, undefined, {}, [], true]
      
      nonNumberValues.forEach(value => {
        const result = nonNegativeIntSchema.safeParse(value)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('optionalStringSchema', () => {
    it('should accept strings', () => {
      const validStrings = ['hello', 'world', 'test string', '한글 텍스트']

      validStrings.forEach(str => {
        const result = optionalStringSchema.safeParse(str)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(str)
        }
      })
    })

    it('should accept empty string', () => {
      const result = optionalStringSchema.safeParse('')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('')
      }
    })

    it('should accept undefined', () => {
      const result = optionalStringSchema.safeParse(undefined)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBeUndefined()
      }
    })

    it('should reject non-string and non-undefined values', () => {
      const invalidValues = [123, null, {}, [], true]
      
      invalidValues.forEach(value => {
        const result = optionalStringSchema.safeParse(value)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('supabaseIdSchema', () => {
    it('should accept non-empty strings', () => {
      const validIds = [
        'user_123',
        'project_abc',
        '123e4567-e89b-12d3-a456-426614174000',
        'a',
        'very-long-supabase-id-string'
      ]

      validIds.forEach(id => {
        const result = supabaseIdSchema.safeParse(id)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(id)
        }
      })
    })

    it('should reject empty string', () => {
      const result = supabaseIdSchema.safeParse('')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Supabase ID가 필요합니다')
      }
    })

    it('should reject non-string values', () => {
      const nonStringValues = [123, null, undefined, {}, [], true]
      
      nonStringValues.forEach(value => {
        const result = supabaseIdSchema.safeParse(value)
        expect(result.success).toBe(false)
      })
    })
  })
})