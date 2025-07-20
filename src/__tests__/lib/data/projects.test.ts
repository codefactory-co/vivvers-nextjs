import {
  mockProjects,
  mockProjectDetails,
  getProjects,
  getFeaturedProjects,
  getProjectsByCategory,
  getProjectDetail
} from '@/lib/data/projects'

// Mock setTimeout for async tests
jest.useFakeTimers()

describe('lib/data/projects.ts', () => {
  beforeEach(() => {
    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
  })

  describe('createProjectTag helper (internal)', () => {
    // Note: This function is not exported, so we test it indirectly through the data
    it('should create tags that match general tag options when available', () => {
      const reactProject = mockProjects.find(p => p.tags.some(tag => tag.name === 'React'))
      expect(reactProject).toBeDefined()
      
      const reactTag = reactProject!.tags.find(tag => tag.name === 'React')
      expect(reactTag).toEqual({
        id: 'react',
        name: 'React'
      })
    })

    it('should create fallback tags for custom names not in general options', () => {
      // Find a project with custom tags like "디자인 시스템"
      const designSystemProject = mockProjects.find(p => 
        p.tags.some(tag => tag.name === '디자인 시스템')
      )
      expect(designSystemProject).toBeDefined()
      
      const designSystemTag = designSystemProject!.tags.find(tag => tag.name === '디자인 시스템')
      expect(designSystemTag).toEqual({
        id: '-', // Korean characters are removed by regex, leaving only hyphens
        name: '디자인 시스템'
      })
    })

    it('should handle special characters in tag names correctly', () => {
      // Find a project with special characters like "날씨 API"
      const weatherProject = mockProjects.find(p => 
        p.tags.some(tag => tag.name === '날씨 API')
      )
      expect(weatherProject).toBeDefined()
      
      const weatherTag = weatherProject!.tags.find(tag => tag.name === '날씨 API')
      expect(weatherTag).toEqual({
        id: '-api', // Korean characters removed, space becomes hyphen, 'API' becomes 'api'
        name: '날씨 API'
      })
    })

    it('should lowercase tag IDs consistently', () => {
      // Test that all tag IDs are lowercase
      const allTags = mockProjects.flatMap(project => project.tags)
      allTags.forEach(tag => {
        expect(tag.id).toBe(tag.id.toLowerCase())
      })
    })
  })

  describe('createProjectAuthor helper (internal)', () => {
    it('should create authors with consistent email format', () => {
      mockProjects.forEach(project => {
        const author = project.author
        expect(author.email).toBe(`${author.username}@example.com`)
      })
    })

    it('should create authors with null bio field', () => {
      mockProjects.forEach(project => {
        expect(project.author.bio).toBeNull()
      })
    })

    it('should create authors with required fields', () => {
      mockProjects.forEach(project => {
        const author = project.author
        expect(author).toMatchObject({
          id: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          avatarUrl: expect.any(String),
          bio: null
        })
      })
    })
  })

  describe('mockProjects data structure', () => {
    it('should contain expected number of projects', () => {
      expect(mockProjects).toHaveLength(10)
    })

    it('should have all projects with required fields', () => {
      mockProjects.forEach((project) => {
        expect(project).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          excerpt: expect.any(String),
          description: expect.any(String),
          category: expect.any(String),
          images: expect.any(Array),
          screenshots: expect.any(Array),
          author: expect.objectContaining({
            id: expect.any(String),
            username: expect.any(String),
            email: expect.any(String),
            avatarUrl: expect.any(String),
            bio: null
          }),
          tags: expect.any(Array),
          features: expect.any(Array),
          likes: expect.any(Array),
          likeCount: expect.any(Number),
          viewCount: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      })
    })

    it('should have unique project IDs', () => {
      const ids = mockProjects.map(p => p.id)
      const uniqueIds = [...new Set(ids)]
      expect(uniqueIds).toHaveLength(ids.length)
    })

    it('should have non-empty titles and descriptions', () => {
      mockProjects.forEach(project => {
        expect(project.title.trim()).toBeTruthy()
        expect(project.excerpt.trim()).toBeTruthy()
        expect(project.description.trim()).toBeTruthy()
      })
    })

    it('should have valid image and screenshot URLs', () => {
      mockProjects.forEach(project => {
        expect(project.images).toEqual(expect.arrayContaining([
          expect.stringMatching(/^https?:\/\//)
        ]))
        expect(project.screenshots).toEqual(expect.arrayContaining([
          expect.stringMatching(/^https?:\/\//)
        ]))
      })
    })

    it('should have valid like and view counts', () => {
      mockProjects.forEach(project => {
        expect(project.likeCount).toBeGreaterThanOrEqual(0)
        expect(project.viewCount).toBeGreaterThanOrEqual(0)
      })
    })

    it('should have valid dates', () => {
      mockProjects.forEach(project => {
        expect(project.createdAt).toBeInstanceOf(Date)
        expect(project.updatedAt).toBeInstanceOf(Date)
        expect(project.updatedAt.getTime()).toBeGreaterThanOrEqual(project.createdAt.getTime())
      })
    })

    it('should have some featured projects', () => {
      const featuredCount = mockProjects.filter(p => p.featured).length
      expect(featuredCount).toBeGreaterThan(0)
      expect(featuredCount).toBeLessThan(mockProjects.length) // Not all should be featured
    })

    it('should have diverse categories', () => {
      const categories = [...new Set(mockProjects.map(p => p.category))]
      expect(categories.length).toBeGreaterThan(3) // Should have multiple categories
    })

    it('should have tags for all projects', () => {
      mockProjects.forEach(project => {
        expect(project.tags.length).toBeGreaterThan(0)
        project.tags.forEach(tag => {
          expect(tag).toMatchObject({
            id: expect.any(String),
            name: expect.any(String)
          })
        })
      })
    })
  })

  describe('getProjects function', () => {
    it('should return paginated results with default parameters', () => {
      const result = getProjects()
      
      expect(result).toMatchObject({
        projects: expect.any(Array),
        totalProjects: mockProjects.length,
        totalPages: expect.any(Number),
        currentPage: 1,
        hasNextPage: expect.any(Boolean),
        hasPrevPage: false
      })
      
      expect(result.projects).toHaveLength(Math.min(12, mockProjects.length))
    })

    it('should handle first page correctly', () => {
      const result = getProjects(1, 5)
      
      expect(result.currentPage).toBe(1)
      expect(result.hasPrevPage).toBe(false)
      expect(result.hasNextPage).toBe(true)
      expect(result.projects).toHaveLength(5)
      expect(result.totalPages).toBe(Math.ceil(mockProjects.length / 5))
    })

    it('should handle middle page correctly', () => {
      const result = getProjects(2, 3)
      
      expect(result.currentPage).toBe(2)
      expect(result.hasPrevPage).toBe(true)
      expect(result.hasNextPage).toBe(true)
      expect(result.projects).toHaveLength(3)
      expect(result.projects[0]).toEqual(mockProjects[3]) // Second page, first item
    })

    it('should handle last page correctly', () => {
      const limit = 3
      const lastPage = Math.ceil(mockProjects.length / limit)
      const result = getProjects(lastPage, limit)
      
      expect(result.currentPage).toBe(lastPage)
      expect(result.hasPrevPage).toBe(true)
      expect(result.hasNextPage).toBe(false)
      
      const expectedItemsOnLastPage = mockProjects.length % limit || limit
      expect(result.projects).toHaveLength(expectedItemsOnLastPage)
    })

    it('should handle page beyond available data', () => {
      const result = getProjects(999, 12)
      
      expect(result.currentPage).toBe(999)
      expect(result.projects).toHaveLength(0)
      expect(result.hasNextPage).toBe(false)
      expect(result.hasPrevPage).toBe(true)
    })

    it('should calculate pagination correctly with various limits', () => {
      const testCases = [
        { limit: 1, expectedPages: mockProjects.length },
        { limit: 5, expectedPages: Math.ceil(mockProjects.length / 5) },
        { limit: 12, expectedPages: Math.ceil(mockProjects.length / 12) },
        { limit: 20, expectedPages: 1 }, // Larger than total items
      ]
      
      testCases.forEach(({ limit, expectedPages }) => {
        const result = getProjects(1, limit)
        expect(result.totalPages).toBe(expectedPages)
      })
    })

    it('should return projects in original order', () => {
      const result = getProjects(1, mockProjects.length)
      expect(result.projects).toEqual(mockProjects)
    })

    it('should handle zero limit gracefully', () => {
      const result = getProjects(1, 0)
      expect(result.projects).toHaveLength(0)
      expect(result.totalPages).toBe(Infinity)
    })

    it('should handle negative page numbers', () => {
      const result = getProjects(-1, 5)
      expect(result.currentPage).toBe(-1)
      // With page=-1, startIndex=-10, endIndex=-5, slice(-10, -5) returns projects from end
      expect(result.projects.length).toBeGreaterThan(0)
      expect(result.hasNextPage).toBe(true) // endIndex (-5) < total length (10)
      expect(result.hasPrevPage).toBe(false) // page (-1) is not > 1
    })
  })

  describe('getFeaturedProjects function', () => {
    it('should return only featured projects', () => {
      const featured = getFeaturedProjects()
      
      expect(featured.length).toBeGreaterThan(0)
      featured.forEach(project => {
        expect(project.featured).toBe(true)
      })
    })

    it('should return subset of all projects', () => {
      const featured = getFeaturedProjects()
      const allFeatured = mockProjects.filter(p => p.featured)
      
      expect(featured).toEqual(allFeatured)
      expect(featured.length).toBeLessThanOrEqual(mockProjects.length)
    })

    it('should maintain project structure', () => {
      const featured = getFeaturedProjects()
      
      featured.forEach(project => {
        expect(project).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          featured: true
        })
      })
    })

    it('should return projects in original order', () => {
      const featured = getFeaturedProjects()
      const originalFeatured = mockProjects.filter(p => p.featured)
      
      expect(featured).toEqual(originalFeatured)
    })
  })

  describe('getProjectsByCategory function', () => {
    it('should filter projects by exact category match', () => {
      const category = '웹 개발'
      const filtered = getProjectsByCategory(category)
      
      expect(filtered.length).toBeGreaterThan(0)
      filtered.forEach(project => {
        expect(project.category).toBe(category)
      })
    })

    it('should be case-insensitive', () => {
      const category = '웹 개발'
      const lowerCase = getProjectsByCategory(category.toLowerCase())
      const upperCase = getProjectsByCategory(category.toUpperCase())
      const mixed = getProjectsByCategory('웹 개발')
      
      expect(lowerCase).toEqual(mixed)
      expect(upperCase).toEqual(mixed)
    })

    it('should return empty array for non-existent category', () => {
      const filtered = getProjectsByCategory('비존재카테고리')
      expect(filtered).toEqual([])
    })

    it('should handle empty string category', () => {
      const filtered = getProjectsByCategory('')
      expect(filtered).toEqual([])
    })

    it('should return all projects with matching category', () => {
      // Count how many projects have each category
      const categoryCounts = mockProjects.reduce((acc, project) => {
        acc[project.category] = (acc[project.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      // Test each category
      Object.entries(categoryCounts).forEach(([category, expectedCount]) => {
        const filtered = getProjectsByCategory(category)
        expect(filtered).toHaveLength(expectedCount)
      })
    })

    it('should maintain project structure', () => {
      const category = mockProjects[0].category
      const filtered = getProjectsByCategory(category)
      
      filtered.forEach(project => {
        expect(project).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          category: expect.any(String)
        })
      })
    })

    it('should preserve original order within category', () => {
      const category = '웹 개발'
      const filtered = getProjectsByCategory(category)
      const originalOrder = mockProjects.filter(p => p.category === category)
      
      expect(filtered).toEqual(originalOrder)
    })
  })

  describe('mockProjectDetails data structure', () => {
    it('should contain detailed data for project ID "1"', () => {
      expect(mockProjectDetails['1']).toBeDefined()
      expect(mockProjectDetails['1']).toMatchObject({
        id: '1',
        fullDescription: expect.any(String),
        fullDescriptionHtml: expect.any(String),
        fullDescriptionJson: expect.any(String),
        screenshots: expect.any(Array),
        comments: expect.any(Array)
      })
    })

    it('should have extended screenshots array', () => {
      const detail = mockProjectDetails['1']
      expect(detail.screenshots.length).toBeGreaterThan(1)
      detail.screenshots.forEach(url => {
        expect(url).toMatch(/^https?:\/\//)
      })
    })

    it('should have structured comments with replies', () => {
      const detail = mockProjectDetails['1']
      expect(detail.comments.length).toBeGreaterThan(0)
      
      detail.comments.forEach(comment => {
        expect(comment).toMatchObject({
          id: expect.any(String),
          content: expect.any(String),
          projectId: expect.any(String),
          authorId: expect.any(String),
          parentId: null,
          likeCount: expect.any(Number),
          repliesCount: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          author: expect.objectContaining({
            id: expect.any(String),
            username: expect.any(String)
          }),
          isLiked: expect.any(Boolean)
        })
      })
    })

    it('should have valid reply structure in comments', () => {
      const detail = mockProjectDetails['1']
      const commentWithReplies = detail.comments.find(c => c.replies && c.replies.length > 0)
      
      if (commentWithReplies?.replies) {
        commentWithReplies.replies.forEach(reply => {
          expect(reply).toMatchObject({
            id: expect.any(String),
            content: expect.any(String),
            parentId: commentWithReplies.id,
            author: expect.objectContaining({
              id: expect.any(String),
              username: expect.any(String)
            })
          })
        })
      }
    })
  })

  describe('generateProjectDetail function (internal)', () => {
    // This function is not exported, so we test it indirectly through getProjectDetail
    it('should generate detailed description for projects not in mockProjectDetails', () => {
      return new Promise<void>((resolve) => {
        getProjectDetail('2').then(detail => {
          expect(detail).toBeDefined()
          expect(detail!.fullDescription).toContain(mockProjects[1].description)
          expect(detail!.fullDescription).toContain(mockProjects[1].category)
          expect(detail!.fullDescription).toContain('혁신적인 접근')
          resolve()
        })
        
        jest.runAllTimers()
      })
    })

    it('should generate screenshots for dynamic projects', () => {
      return new Promise<void>((resolve) => {
        getProjectDetail('3').then(detail => {
          expect(detail).toBeDefined()
          expect(detail!.screenshots.length).toBe(4)
          detail!.screenshots.forEach(url => {
            expect(url).toMatch(/^https:\/\/images\.unsplash\.com/)
          })
          resolve()
        })
        
        jest.runAllTimers()
      })
    })

    it('should generate mock comments with proper structure', () => {
      return new Promise<void>((resolve) => {
        getProjectDetail('4').then(detail => {
          expect(detail).toBeDefined()
          expect(detail!.comments.length).toBe(2)
          
          const [firstComment, secondComment] = detail!.comments
          
          // First comment should have no replies
          expect(firstComment.repliesCount).toBe(0)
          expect(firstComment.replies).toBeUndefined()
          
          // Second comment should have one reply
          expect(secondComment.repliesCount).toBe(1)
          expect(secondComment.replies).toHaveLength(1)
          expect(secondComment.replies![0].parentId).toBe(secondComment.id)
          
          resolve()
        })
        
        jest.runAllTimers()
      })
    })

    it('should include project tags in comment content', () => {
      return new Promise<void>((resolve) => {
        getProjectDetail('5').then(detail => {
          expect(detail).toBeDefined()
          const project = mockProjects.find(p => p.id === '5')!
          const commentWithTech = detail!.comments.find(c => 
            c.content.includes(project.tags[0]?.name || '기술')
          )
          expect(commentWithTech).toBeDefined()
          resolve()
        })
        
        jest.runAllTimers()
      })
    })

    it('should generate random but realistic like counts', () => {
      return new Promise<void>((resolve) => {
        Promise.all([
          getProjectDetail('6'),
          getProjectDetail('7'),
          getProjectDetail('8')
        ]).then(details => {
          details.forEach(detail => {
            expect(detail).toBeDefined()
            detail!.comments.forEach(comment => {
              expect(comment.likeCount).toBeGreaterThanOrEqual(1)
              expect(comment.likeCount).toBeLessThanOrEqual(10)
              
              if (comment.replies) {
                comment.replies.forEach(reply => {
                  expect(reply.likeCount).toBeGreaterThanOrEqual(1)
                  expect(reply.likeCount).toBeLessThanOrEqual(5)
                })
              }
            })
          })
          resolve()
        })
        
        jest.runAllTimers()
      })
    })
  })

  describe('getProjectDetail function', () => {
    it('should simulate API delay', () => {
      return new Promise<void>((resolve) => {
        const promise = getProjectDetail('1')
        
        promise.then(detail => {
          expect(detail).toBeDefined()
          resolve()
        })
        
        // Advance timers to resolve the setTimeout
        jest.runAllTimers()
      })
    })

    it('should return explicit detailed data when available', () => {
      return new Promise<void>((resolve) => {
        getProjectDetail('1').then(detail => {
          expect(detail).toBeDefined()
          expect(detail).toBe(mockProjectDetails['1'])
          resolve()
        })
        
        jest.runAllTimers()
      })
    })

    it('should generate detail for projects not in mockProjectDetails', () => {
      return new Promise<void>((resolve) => {
        getProjectDetail('2').then(detail => {
          expect(detail).toBeDefined()
          expect(detail!.id).toBe('2')
          expect(detail!.fullDescription).toBeDefined()
          expect(detail!.screenshots.length).toBe(4)
          expect(detail!.comments.length).toBe(2)
          resolve()
        })
        
        jest.runAllTimers()
      })
    })

    it('should return null for non-existent project ID', () => {
      return new Promise<void>((resolve) => {
        getProjectDetail('999').then(detail => {
          expect(detail).toBeNull()
          resolve()
        })
        
        jest.runAllTimers()
      })
    })

    it('should handle empty string ID', () => {
      return new Promise<void>((resolve) => {
        getProjectDetail('').then(detail => {
          expect(detail).toBeNull()
          resolve()
        })
        
        jest.runAllTimers()
      })
    })

    it('should return consistent results for same ID', () => {
      return new Promise<void>((resolve) => {
        Promise.all([
          getProjectDetail('3'),
          getProjectDetail('3')
        ]).then(([detail1, detail2]) => {
          expect(detail1).toBeDefined()
          expect(detail2).toBeDefined()
          expect(detail1!.id).toBe(detail2!.id)
          expect(detail1!.title).toBe(detail2!.title)
          resolve()
        })
        
        jest.runAllTimers()
      })
    })

    it('should preserve all original project properties', () => {
      return new Promise<void>((resolve) => {
        getProjectDetail('4').then(detail => {
          expect(detail).toBeDefined()
          const originalProject = mockProjects.find(p => p.id === '4')!
          
          // Check all original properties are preserved
          expect(detail!.id).toBe(originalProject.id)
          expect(detail!.title).toBe(originalProject.title)
          expect(detail!.excerpt).toBe(originalProject.excerpt)
          expect(detail!.description).toBe(originalProject.description)
          expect(detail!.category).toBe(originalProject.category)
          expect(detail!.author).toEqual(originalProject.author)
          expect(detail!.tags).toEqual(originalProject.tags)
          expect(detail!.features).toEqual(originalProject.features)
          expect(detail!.demoUrl).toBe(originalProject.demoUrl)
          expect(detail!.githubUrl).toBe(originalProject.githubUrl)
          expect(detail!.likeCount).toBe(originalProject.likeCount)
          expect(detail!.viewCount).toBe(originalProject.viewCount)
          expect(detail!.createdAt).toBe(originalProject.createdAt)
          expect(detail!.updatedAt).toBe(originalProject.updatedAt)
          
          resolve()
        })
        
        jest.runAllTimers()
      })
    })

    it('should add ProjectDetail specific properties', () => {
      return new Promise<void>((resolve) => {
        getProjectDetail('5').then(detail => {
          expect(detail).toBeDefined()
          
          // Check ProjectDetail specific properties
          expect(detail!.fullDescription).toBeDefined()
          expect(detail!.fullDescriptionHtml).toBeDefined()
          expect(detail!.fullDescriptionJson).toBeNull() // Generated details set this to null
          expect(detail!.comments).toBeDefined()
          expect(Array.isArray(detail!.comments)).toBe(true)
          
          resolve()
        })
        
        jest.runAllTimers()
      })
    })

    it('should handle multiple concurrent requests', () => {
      const promises = [
        getProjectDetail('1'),
        getProjectDetail('2'), 
        getProjectDetail('3'),
        getProjectDetail('999') // non-existent
      ]
      
      return new Promise<void>((resolve) => {
        Promise.all(promises).then(results => {
          expect(results[0]).toBeDefined() // Existing detailed
          expect(results[1]).toBeDefined() // Generated detail
          expect(results[2]).toBeDefined() // Generated detail
          expect(results[3]).toBeNull()    // Non-existent
          
          resolve()
        })
        
        jest.runAllTimers()
      })
    })
  })

  describe('Edge cases and boundary conditions', () => {
    it('should handle projects with minimal data', () => {
      // All projects should have complete data, but test edge cases
      mockProjects.forEach(project => {
        expect(project.tags.length).toBeGreaterThan(0)
        expect(project.features.length).toBeGreaterThan(0)
        expect(project.images.length).toBeGreaterThan(0)
      })
    })

    it('should handle projects with null optional URLs', () => {
      const projectsWithNullUrls = mockProjects.filter(p => p.demoUrl === null || p.githubUrl === null)
      expect(projectsWithNullUrls.length).toBeGreaterThan(0)
      
      projectsWithNullUrls.forEach(project => {
        // Should not break any functions
        expect(() => getProjectsByCategory(project.category)).not.toThrow()
      })
    })

    it('should handle very large page numbers in getProjects', () => {
      const result = getProjects(Number.MAX_SAFE_INTEGER, 10)
      expect(result.projects).toHaveLength(0)
      expect(result.hasNextPage).toBe(false)
      expect(result.hasPrevPage).toBe(true)
    })

    it('should handle zero and negative limits in getProjects', () => {
      const zeroResult = getProjects(1, 0)
      expect(zeroResult.projects).toHaveLength(0)
      expect(zeroResult.totalPages).toBe(Infinity) // Math.ceil(10/0) = Infinity
      
      const negativeResult = getProjects(1, -5)
      // With negative limit, slice(0, -5) returns projects from start to end-5
      expect(negativeResult.projects.length).toBeGreaterThan(0)
      expect(negativeResult.totalPages).toBe(Math.ceil(mockProjects.length / -5)) // Math.ceil(10/-5) = -2
    })

    it('should handle Unicode categories correctly', () => {
      const unicodeCategories = mockProjects.map(p => p.category).filter(cat => /[가-힣]/.test(cat))
      expect(unicodeCategories.length).toBeGreaterThan(0)
      
      unicodeCategories.forEach(category => {
        const filtered = getProjectsByCategory(category)
        expect(filtered.length).toBeGreaterThan(0)
      })
    })

    it('should maintain data integrity across multiple function calls', () => {
      // Call functions multiple times to ensure no mutation
      const originalLength = mockProjects.length
      
      getProjects(1, 5)
      getFeaturedProjects()
      getProjectsByCategory('웹 개발')
      
      expect(mockProjects).toHaveLength(originalLength)
      expect(mockProjects[0].title).toBe('모던 UI 디자인 시스템') // First project unchanged
    })
  })

  describe('Type safety and structure validation', () => {
    it('should match Project type structure', () => {
      mockProjects.forEach(project => {
        // Structural validation - TypeScript should catch these at compile time,
        // but we test runtime structure as well
        expect(typeof project.id).toBe('string')
        expect(typeof project.title).toBe('string')
        expect(typeof project.excerpt).toBe('string')
        expect(typeof project.description).toBe('string')
        expect(typeof project.category).toBe('string')
        expect(Array.isArray(project.images)).toBe(true)
        expect(Array.isArray(project.screenshots)).toBe(true)
        expect(Array.isArray(project.tags)).toBe(true)
        expect(Array.isArray(project.features)).toBe(true)
        expect(Array.isArray(project.likes)).toBe(true)
        expect(typeof project.likeCount).toBe('number')
        expect(typeof project.viewCount).toBe('number')
        expect(project.createdAt).toBeInstanceOf(Date)
        expect(project.updatedAt).toBeInstanceOf(Date)
      })
    })

    it('should match ProjectTag type structure', () => {
      const allTags = mockProjects.flatMap(p => p.tags)
      allTags.forEach(tag => {
        expect(typeof tag.id).toBe('string')
        expect(typeof tag.name).toBe('string')
      })
    })

    it('should match ProjectAuthor type structure', () => {
      mockProjects.forEach(project => {
        const author = project.author
        expect(typeof author.id).toBe('string')
        expect(typeof author.username).toBe('string')
        expect(typeof author.email).toBe('string')
        expect(typeof author.avatarUrl).toBe('string')
        expect(author.bio).toBeNull()
      })
    })

    it('should have ProjectDetail extend Project correctly', () => {
      return new Promise<void>((resolve) => {
        getProjectDetail('1').then(detail => {
          expect(detail).toBeDefined()
          
          // Should have all Project properties
          expect(detail).toMatchObject({
            id: expect.any(String),
            title: expect.any(String),
            excerpt: expect.any(String),
            description: expect.any(String),
            category: expect.any(String),
            images: expect.any(Array),
            screenshots: expect.any(Array),
            author: expect.any(Object),
            tags: expect.any(Array),
            features: expect.any(Array),
            likes: expect.any(Array),
            likeCount: expect.any(Number),
            viewCount: expect.any(Number),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          })
          
          // Should have additional ProjectDetail properties
          expect(detail).toMatchObject({
            fullDescription: expect.any(String),
            fullDescriptionHtml: expect.any(String),
            comments: expect.any(Array)
          })
          
          resolve()
        })
        
        jest.runAllTimers()
      })
    })
  })

  describe('Performance and optimization', () => {
    it('should not modify original data arrays', () => {
      const originalProjects = [...mockProjects]
      
      getProjects(1, 5)
      getFeaturedProjects()
      getProjectsByCategory('웹 개발')
      
      expect(mockProjects).toEqual(originalProjects)
    })

    it('should handle large pagination efficiently', () => {
      // Test that large page numbers don't cause performance issues
      const start = performance.now()
      getProjects(1000, 100)
      const end = performance.now()
      
      expect(end - start).toBeLessThan(10) // Should be very fast
    })

    it('should filter efficiently', () => {
      const start = performance.now()
      
      // Run multiple filter operations
      for (let i = 0; i < 100; i++) {
        getFeaturedProjects()
        getProjectsByCategory('웹 개발')
      }
      
      const end = performance.now()
      expect(end - start).toBeLessThan(50) // Should complete quickly
    })
  })
})