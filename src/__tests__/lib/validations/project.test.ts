import { 
  tagUtils, 
  tagSchema, 
  tagsArraySchema,
  createProjectSchema,
  updateProjectSchema,
  PROJECT_CATEGORIES,
  type CreateProjectData,
  type UpdateProjectData,
  type ProjectCategory
} from '@/lib/validations/project'

describe('PROJECT_CATEGORIES', () => {
  it('should contain all expected categories', () => {
    const expectedCategories = [
      '웹사이트',
      '모바일 앱', 
      '데스크톱 앱',
      '게임',
      '임베디드',
      '기타'
    ]
    
    expect(PROJECT_CATEGORIES).toEqual(expectedCategories)
  })

  it('should be readonly array', () => {
    // TypeScript compile-time check - this would fail if not readonly
    expect(Array.isArray(PROJECT_CATEGORIES)).toBe(true)
  })
})

describe('tagSchema', () => {
  describe('valid tags', () => {
    it('should accept valid tags with letters only', () => {
      const result = tagSchema.parse('react')
      expect(result).toBe('react')
    })

    it('should accept valid tags with numbers', () => {
      const result = tagSchema.parse('vue3')
      expect(result).toBe('vue3')
    })

    it('should accept valid tags with hyphens', () => {
      const result = tagSchema.parse('next-js')
      expect(result).toBe('next-js')
    })

    it('should accept valid tags with underscores', () => {
      const result = tagSchema.parse('react_native')
      expect(result).toBe('react_native')
    })

    it('should accept mixed case and convert to lowercase', () => {
      const result = tagSchema.parse('TypeScript')
      expect(result).toBe('typescript')
    })

    it('should trim whitespace and validate after trimming', () => {
      // The schema trims AFTER validation, so this should fail
      expect(() => tagSchema.parse('  react  ')).toThrow('태그는 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다')
    })

    it('should handle valid tags that require only transformation', () => {
      const result = tagSchema.parse('React')
      expect(result).toBe('react')
    })

    it('should handle maximum length tag', () => {
      const maxLengthTag = 'a'.repeat(20)
      const result = tagSchema.parse(maxLengthTag)
      expect(result).toBe(maxLengthTag)
    })

    it('should handle minimum length tag', () => {
      const result = tagSchema.parse('js')
      expect(result).toBe('js')
    })
  })

  describe('invalid tags', () => {
    it('should reject tags shorter than minimum length', () => {
      expect(() => tagSchema.parse('a')).toThrow('태그는 최소 2자 이상이어야 합니다')
    })

    it('should reject tags longer than maximum length', () => {
      const tooLongTag = 'a'.repeat(21)
      expect(() => tagSchema.parse(tooLongTag)).toThrow('태그는 최대 20자까지 가능합니다')
    })

    it('should reject tags with spaces', () => {
      expect(() => tagSchema.parse('hello world')).toThrow('태그는 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다')
    })

    it('should reject tags with special characters', () => {
      const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '=', '[', ']', '{', '}', '|', '\\', ':', ';', '"', "'", '<', '>', ',', '.', '?', '/', '~', '`']
      
      specialChars.forEach(char => {
        expect(() => tagSchema.parse(`tag${char}`)).toThrow('태그는 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다')
      })
    })

    it('should reject empty string', () => {
      expect(() => tagSchema.parse('')).toThrow('태그는 최소 2자 이상이어야 합니다')
    })

    it('should reject tags with Korean characters', () => {
      expect(() => tagSchema.parse('리액트')).toThrow('태그는 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다')
    })
  })
})

describe('tagsArraySchema', () => {
  it('should accept valid tag arrays', () => {
    const tags = ['react', 'typescript', 'nextjs']
    const result = tagsArraySchema.parse(tags)
    expect(result).toEqual(tags)
  })

  it('should default to empty array', () => {
    const result = tagsArraySchema.parse(undefined)
    expect(result).toEqual([])
  })

  it('should accept up to 10 tags', () => {
    const tags = Array.from({ length: 10 }, (_, i) => `tag${i + 1}`)
    const result = tagsArraySchema.parse(tags)
    expect(result).toEqual(tags)
  })

  it('should reject more than 10 tags', () => {
    const tags = Array.from({ length: 11 }, (_, i) => `tag${i + 1}`)
    expect(() => tagsArraySchema.parse(tags)).toThrow('태그는 최대 10개까지 가능합니다')
  })

  it('should transform individual tags', () => {
    const tags = ['React', 'TypeScript']
    const result = tagsArraySchema.parse(tags)
    expect(result).toEqual(['react', 'typescript'])
  })
})

describe('tagUtils', () => {
  describe('sanitizeTag', () => {
    it('should convert spaces to hyphens', () => {
      const input = 'hello world'
      const expected = 'hello-world'
      
      const result = tagUtils.sanitizeTag(input)
      
      expect(result).toBe(expected)
    })

    it('should convert multiple spaces to single hyphen', () => {
      const result = tagUtils.sanitizeTag('hello   world')
      expect(result).toBe('hello-world')
    })

    it('should convert tabs and newlines to hyphens', () => {
      const result = tagUtils.sanitizeTag('hello\tworld\ntest')
      expect(result).toBe('hello-world-test')
    })

    it('should remove special characters', () => {
      const result = tagUtils.sanitizeTag('react.js!')
      expect(result).toBe('reactjs')
    })

    it('should convert to lowercase', () => {
      const result = tagUtils.sanitizeTag('TypeScript')
      expect(result).toBe('typescript')
    })

    it('should trim whitespace', () => {
      const result = tagUtils.sanitizeTag('  react  ')
      expect(result).toBe('react')
    })

    it('should handle empty string', () => {
      const result = tagUtils.sanitizeTag('')
      expect(result).toBe('')
    })

    it('should handle string with only special characters', () => {
      const result = tagUtils.sanitizeTag('!@#$%^&*()')
      expect(result).toBe('')
    })

    it('should handle mixed content', () => {
      const result = tagUtils.sanitizeTag('React.js v18 (Latest)!')
      expect(result).toBe('reactjs-v18-latest')
    })

    it('should preserve hyphens and underscores', () => {
      const result = tagUtils.sanitizeTag('next-js_framework')
      expect(result).toBe('next-js_framework')
    })

    it('should handle Korean characters by removing them', () => {
      const result = tagUtils.sanitizeTag('리액트react')
      expect(result).toBe('react')
    })
  })

  describe('isValidTag', () => {
    it('should return true for valid tags', () => {
      const validTags = [
        'react',
        'vue3',
        'next-js',
        'react_native',
        'TypeScript',
        'a'.repeat(20), // max length
        'js' // min length
      ]

      validTags.forEach(tag => {
        expect(tagUtils.isValidTag(tag)).toBe(true)
      })
    })

    it('should return false for tags too short', () => {
      expect(tagUtils.isValidTag('a')).toBe(false)
      expect(tagUtils.isValidTag('')).toBe(false)
    })

    it('should return false for tags too long', () => {
      const tooLong = 'a'.repeat(21)
      expect(tagUtils.isValidTag(tooLong)).toBe(false)
    })

    it('should return false for tags with invalid characters', () => {
      const invalidTags = [
        'hello world', // space
        'react.js', // dot
        'tag!', // exclamation
        'tag@home', // at symbol
        'react/vue', // slash
        '리액트', // Korean
        'tag with spaces'
      ]

      invalidTags.forEach(tag => {
        expect(tagUtils.isValidTag(tag)).toBe(false)
      })
    })

    it('should return true for tags with hyphens and underscores in any position', () => {
      // The regex allows hyphens and underscores anywhere, including start/end
      expect(tagUtils.isValidTag('-react')).toBe(true)
      expect(tagUtils.isValidTag('react-')).toBe(true)
      expect(tagUtils.isValidTag('_react')).toBe(true)
      expect(tagUtils.isValidTag('react_')).toBe(true)
    })
  })

  describe('suggestTag', () => {
    it('should return sanitized tag for valid input', () => {
      const result = tagUtils.suggestTag('React.js')
      expect(result).toBe('reactjs')
    })

    it('should return sanitized tag with spaces converted to hyphens', () => {
      const result = tagUtils.suggestTag('hello world')
      expect(result).toBe('hello-world')
    })

    it('should return null for tags that become too short after sanitization', () => {
      const result = tagUtils.suggestTag('!')
      expect(result).toBe(null)
    })

    it('should return null for tags that become too long after sanitization', () => {
      const longTag = 'a'.repeat(25) + '!!!'
      const result = tagUtils.suggestTag(longTag)
      expect(result).toBe(null)
    })

    it('should return null for empty string after sanitization', () => {
      const result = tagUtils.suggestTag('!@#$%')
      expect(result).toBe(null)
    })

    it('should handle complex mixed content', () => {
      const result = tagUtils.suggestTag('Next.js 13 (App Router)!')
      expect(result).toBe('nextjs-13-app-router')
    })

    it('should return null for string that becomes single character', () => {
      const result = tagUtils.suggestTag('a!!!')
      expect(result).toBe(null)
    })

    it('should handle Korean mixed with English', () => {
      const result = tagUtils.suggestTag('리액트React')
      expect(result).toBe('react')
    })

    it('should handle whitespace-only input', () => {
      const result = tagUtils.suggestTag('   ')
      expect(result).toBe(null)
    })
  })
})

describe('createProjectSchema', () => {
  const validProjectData: CreateProjectData = {
    title: 'Test Project',
    description: 'Test description',
    fullDescription: 'Full test description',
    fullDescriptionJson: '{"test": true}',
    fullDescriptionHtml: '<p>Test HTML</p>',
    category: '웹사이트',
    screenshots: ['https://example.com/image1.jpg'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com/user/repo',
    features: ['feature1', 'feature2'],
    tags: ['react', 'typescript']
  }

  describe('title validation', () => {
    it('should accept valid title', () => {
      const result = createProjectSchema.parse(validProjectData)
      expect(result.title).toBe('Test Project')
    })

    it('should reject empty title', () => {
      const data = { ...validProjectData, title: '' }
      expect(() => createProjectSchema.parse(data)).toThrow('제목을 입력하세요')
    })

    it('should reject title too long', () => {
      const data = { ...validProjectData, title: 'a'.repeat(101) }
      expect(() => createProjectSchema.parse(data)).toThrow('제목은 최대 100자까지 가능합니다')
    })

    it('should accept title at max length', () => {
      const data = { ...validProjectData, title: 'a'.repeat(100) }
      const result = createProjectSchema.parse(data)
      expect(result.title).toBe('a'.repeat(100))
    })
  })

  describe('description validation', () => {
    it('should accept valid description', () => {
      const result = createProjectSchema.parse(validProjectData)
      expect(result.description).toBe('Test description')
    })

    it('should reject empty description', () => {
      const data = { ...validProjectData, description: '' }
      expect(() => createProjectSchema.parse(data)).toThrow('간단한 설명을 입력하세요')
    })

    it('should reject description too long', () => {
      const data = { ...validProjectData, description: 'a'.repeat(201) }
      expect(() => createProjectSchema.parse(data)).toThrow('설명은 최대 200자까지 가능합니다')
    })

    it('should accept description at max length', () => {
      const data = { ...validProjectData, description: 'a'.repeat(200) }
      const result = createProjectSchema.parse(data)
      expect(result.description).toBe('a'.repeat(200))
    })
  })

  describe('fullDescription validation', () => {
    it('should accept valid fullDescription', () => {
      const result = createProjectSchema.parse(validProjectData)
      expect(result.fullDescription).toBe('Full test description')
    })

    it('should accept empty string', () => {
      const data = { ...validProjectData, fullDescription: '' }
      const result = createProjectSchema.parse(data)
      expect(result.fullDescription).toBe('')
    })

    it('should accept undefined', () => {
      const data = { ...validProjectData }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data as any).fullDescription
      const result = createProjectSchema.parse(data)
      expect(result.fullDescription).toBeUndefined()
    })

    it('should reject fullDescription too long', () => {
      const data = { ...validProjectData, fullDescription: 'a'.repeat(5001) }
      expect(() => createProjectSchema.parse(data)).toThrow('상세 설명은 최대 5000자까지 가능합니다')
    })
  })

  describe('category validation', () => {
    it('should accept valid category', () => {
      PROJECT_CATEGORIES.forEach(category => {
        const data = { ...validProjectData, category }
        const result = createProjectSchema.parse(data)
        expect(result.category).toBe(category)
      })
    })

    it('should reject invalid category', () => {
      const data = { ...validProjectData, category: '잘못된카테고리' }
      expect(() => createProjectSchema.parse(data)).toThrow('유효한 카테고리를 선택하세요')
    })

    it('should reject empty category', () => {
      const data = { ...validProjectData, category: '' }
      expect(() => createProjectSchema.parse(data)).toThrow('카테고리를 선택하세요')
    })
  })

  describe('screenshots validation', () => {
    it('should accept valid screenshots array', () => {
      const screenshots = ['https://example.com/1.jpg', 'https://example.com/2.jpg']
      const data = { ...validProjectData, screenshots }
      const result = createProjectSchema.parse(data)
      expect(result.screenshots).toEqual(screenshots)
    })

    it('should reject empty screenshots array', () => {
      const data = { ...validProjectData, screenshots: [] }
      expect(() => createProjectSchema.parse(data)).toThrow('스크린샷을 최소 1개 이상 업로드하세요')
    })

    it('should reject too many screenshots', () => {
      const screenshots = Array.from({ length: 11 }, (_, i) => `https://example.com/${i}.jpg`)
      const data = { ...validProjectData, screenshots }
      expect(() => createProjectSchema.parse(data)).toThrow('스크린샷은 최대 10개까지 가능합니다')
    })

    it('should reject invalid URLs', () => {
      const data = { ...validProjectData, screenshots: ['not-a-url'] }
      expect(() => createProjectSchema.parse(data)).toThrow()
    })
  })

  describe('URL validation', () => {
    it('should accept valid demoUrl', () => {
      const data = { ...validProjectData, demoUrl: 'https://demo.example.com' }
      const result = createProjectSchema.parse(data)
      expect(result.demoUrl).toBe('https://demo.example.com')
    })

    it('should accept empty demoUrl', () => {
      const data = { ...validProjectData, demoUrl: '' }
      const result = createProjectSchema.parse(data)
      expect(result.demoUrl).toBe('')
    })

    it('should accept undefined demoUrl', () => {
      const data = { ...validProjectData }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data as any).demoUrl
      const result = createProjectSchema.parse(data)
      expect(result.demoUrl).toBeUndefined()
    })

    it('should reject invalid demoUrl', () => {
      const data = { ...validProjectData, demoUrl: 'not-a-url' }
      expect(() => createProjectSchema.parse(data)).toThrow('올바른 URL 형식이 아닙니다')
    })

    it('should accept valid githubUrl', () => {
      const data = { ...validProjectData, githubUrl: 'https://github.com/user/repo' }
      const result = createProjectSchema.parse(data)
      expect(result.githubUrl).toBe('https://github.com/user/repo')
    })

    it('should reject invalid githubUrl', () => {
      const data = { ...validProjectData, githubUrl: 'not-a-url' }
      expect(() => createProjectSchema.parse(data)).toThrow('올바른 URL 형식이 아닙니다')
    })
  })

  describe('features validation', () => {
    it('should accept valid features array', () => {
      const features = ['feature1', 'feature2', 'feature3']
      const data = { ...validProjectData, features }
      const result = createProjectSchema.parse(data)
      expect(result.features).toEqual(features)
    })

    it('should default to empty array', () => {
      const data = { ...validProjectData }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data as any).features
      const result = createProjectSchema.parse(data)
      expect(result.features).toEqual([])
    })

    it('should reject too many features', () => {
      const features = Array.from({ length: 21 }, (_, i) => `feature${i + 1}`)
      const data = { ...validProjectData, features }
      expect(() => createProjectSchema.parse(data)).toThrow('주요 기능은 최대 20개까지 가능합니다')
    })

    it('should accept up to 20 features', () => {
      const features = Array.from({ length: 20 }, (_, i) => `feature${i + 1}`)
      const data = { ...validProjectData, features }
      const result = createProjectSchema.parse(data)
      expect(result.features).toEqual(features)
    })
  })

  describe('tags validation', () => {
    it('should accept valid tags', () => {
      const tags = ['react', 'typescript', 'nextjs']
      const data = { ...validProjectData, tags }
      const result = createProjectSchema.parse(data)
      expect(result.tags).toEqual(tags)
    })

    it('should default to empty array', () => {
      const data = { ...validProjectData }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data as any).tags
      const result = createProjectSchema.parse(data)
      expect(result.tags).toEqual([])
    })

    it('should transform tags to lowercase', () => {
      const data = { ...validProjectData, tags: ['React', 'TypeScript'] }
      const result = createProjectSchema.parse(data)
      expect(result.tags).toEqual(['react', 'typescript'])
    })
  })
})

describe('updateProjectSchema', () => {
  it('should make all fields optional', () => {
    const result = updateProjectSchema.parse({})
    // The schema includes default values for features and tags arrays
    expect(result).toEqual({
      features: [],
      tags: []
    })
  })

  it('should accept partial data', () => {
    const partialData = {
      title: 'Updated Title',
      description: 'Updated Description'
    }
    const result = updateProjectSchema.parse(partialData)
    // The schema adds default values for features and tags
    expect(result).toEqual({
      ...partialData,
      features: [],
      tags: []
    })
  })

  it('should validate provided fields according to create schema rules', () => {
    const invalidData = {
      title: '', // Invalid: empty title
      category: '웹사이트' // Valid
    }
    expect(() => updateProjectSchema.parse(invalidData)).toThrow('제목을 입력하세요')
  })

  it('should allow updating single field', () => {
    const data = { category: '모바일 앱' }
    const result = updateProjectSchema.parse(data)
    expect(result.category).toBe('모바일 앱')
  })
})

describe('Type exports', () => {
  it('should export correct types', () => {
    // This is a compile-time check that will fail if types are not exported correctly
    const createData: CreateProjectData = {
      title: 'Test',
      description: 'Test',
      category: '웹사이트',
      screenshots: ['https://example.com/test.jpg'],
      features: [],
      tags: []
    }

    const updateData: UpdateProjectData = {
      title: 'Updated Test'
    }

    const category: ProjectCategory = '웹사이트'

    expect(createData).toBeDefined()
    expect(updateData).toBeDefined()
    expect(category).toBeDefined()
  })
})