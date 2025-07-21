import {
  TAGS,
  CATEGORIES,
  getAllTags,
  getTagsByCategory,
  getTagBySlug,
  getAllCategories,
  getCategoryBySlug,
  searchTags,
  Tag,
  Category
} from '@/lib/data/tags'

describe('lib/data/tags.ts', () => {
  describe('getAllTags', () => {
    it('should return all mock tags', () => {
      const tags = getAllTags()
      expect(tags).toEqual(TAGS)
      expect(tags.length).toBeGreaterThan(0)
    })

    it('should return tags with required properties', () => {
      const tags = getAllTags()
      tags.forEach((tag: Tag) => {
        expect(tag).toHaveProperty('id')
        expect(tag).toHaveProperty('name')
        expect(tag).toHaveProperty('slug')
        expect(tag).toHaveProperty('projectCount')
        expect(tag).toHaveProperty('createdAt')
        expect(tag).toHaveProperty('updatedAt')
      })
    })
  })

  describe('getTagsByCategory', () => {
    it('should return tags for existing category', () => {
      const webDevTags = getTagsByCategory('1') // 웹 개발
      expect(webDevTags.length).toBeGreaterThan(0)
      webDevTags.forEach((tag: Tag) => {
        expect(tag.categoryId).toBe('1')
      })
    })

    it('should return empty array for non-existent category', () => {
      const tags = getTagsByCategory('nonexistent')
      expect(tags).toEqual([])
    })

    it('should return correct tags for mobile category', () => {
      const mobileTags = getTagsByCategory('2') // 모바일 앱
      expect(mobileTags.length).toBeGreaterThan(0)
      const tagNames = mobileTags.map((tag: Tag) => tag.name)
      expect(tagNames).toContain('React Native')
      expect(tagNames).toContain('Flutter')
    })
  })

  describe('getTagBySlug', () => {
    it('should return tag when slug exists', () => {
      const tag = getTagBySlug('react')
      expect(tag).toBeDefined()
      expect(tag?.slug).toBe('react')
      expect(tag?.name).toBe('React')
    })

    it('should return undefined when slug does not exist', () => {
      const tag = getTagBySlug('nonexistent')
      expect(tag).toBeUndefined()
    })
  })

  describe('getAllCategories', () => {
    it('should return all mock categories', () => {
      const categories = getAllCategories()
      expect(categories).toEqual(CATEGORIES)
      expect(categories.length).toBeGreaterThan(0)
    })

    it('should return categories with required properties', () => {
      const categories = getAllCategories()
      categories.forEach((category: Category) => {
        expect(category).toHaveProperty('id')
        expect(category).toHaveProperty('name')
        expect(category).toHaveProperty('slug')
        expect(category).toHaveProperty('projectCount')
        expect(category).toHaveProperty('createdAt')
        expect(category).toHaveProperty('updatedAt')
      })
    })
  })

  describe('getCategoryBySlug', () => {
    it('should return category when slug exists', () => {
      const category = getCategoryBySlug('web-development')
      expect(category).toBeDefined()
      expect(category?.slug).toBe('web-development')
      expect(category?.name).toBe('웹 개발')
    })

    it('should return undefined when slug does not exist', () => {
      const category = getCategoryBySlug('nonexistent')
      expect(category).toBeUndefined()
    })
  })

  describe('searchTags', () => {
    it('should find tags by name', () => {
      const tags = searchTags('React')
      expect(tags.length).toBeGreaterThan(0)
      const hasMatchingTag = tags.some((tag: Tag) => 
        tag.name.toLowerCase().includes('react')
      )
      expect(hasMatchingTag).toBe(true)
    })

    it('should find tags by slug', () => {
      const tags = searchTags('nextjs')
      expect(tags.length).toBeGreaterThan(0)
      const hasMatchingTag = tags.some((tag: Tag) => 
        tag.slug.toLowerCase().includes('nextjs')
      )
      expect(hasMatchingTag).toBe(true)
    })

    it('should return empty array for no matches', () => {
      const tags = searchTags('zzz-nonexistent-term-zzz')
      expect(tags).toEqual([])
    })

    it('should be case insensitive', () => {
      const lowercaseResults = searchTags('react')
      const uppercaseResults = searchTags('REACT')
      const mixedCaseResults = searchTags('React')
      
      expect(lowercaseResults).toEqual(uppercaseResults)
      expect(lowercaseResults).toEqual(mixedCaseResults)
    })

    it('should handle partial matches', () => {
      const tags = searchTags('java')
      expect(tags.length).toBeGreaterThan(0)
      const hasJavaScript = tags.some((tag: Tag) => tag.name === 'JavaScript')
      expect(hasJavaScript).toBe(true)
    })
  })

  describe('Data integrity', () => {
    it('should have consistent data types', () => {
      const tags = getAllTags()
      tags.forEach((tag: Tag) => {
        expect(typeof tag.id).toBe('string')
        expect(typeof tag.name).toBe('string')
        expect(typeof tag.slug).toBe('string')
        expect(typeof tag.projectCount).toBe('number')
        expect(tag.createdAt).toBeInstanceOf(Date)
        expect(tag.updatedAt).toBeInstanceOf(Date)
        
        if (tag.categoryId) {
          expect(typeof tag.categoryId).toBe('string')
        }
        if (tag.description) {
          expect(typeof tag.description).toBe('string')
        }
      })
    })

    it('should have unique tag IDs', () => {
      const tags = getAllTags()
      const ids = tags.map((tag: Tag) => tag.id)
      const uniqueIds = [...new Set(ids)]
      expect(ids.length).toBe(uniqueIds.length)
    })

    it('should have unique tag slugs', () => {
      const tags = getAllTags()
      const slugs = tags.map((tag: Tag) => tag.slug)
      const uniqueSlugs = [...new Set(slugs)]
      expect(slugs.length).toBe(uniqueSlugs.length)
    })

    it('should have unique category IDs', () => {
      const categories = getAllCategories()
      const ids = categories.map((category: Category) => category.id)
      const uniqueIds = [...new Set(ids)]
      expect(ids.length).toBe(uniqueIds.length)
    })

    it('should have unique category slugs', () => {
      const categories = getAllCategories()
      const slugs = categories.map((category: Category) => category.slug)
      const uniqueSlugs = [...new Set(slugs)]
      expect(slugs.length).toBe(uniqueSlugs.length)
    })

    it('should have valid category references', () => {
      const tags = getAllTags()
      const categories = getAllCategories()
      const categoryIds = categories.map((cat: Category) => cat.id)
      
      tags.forEach((tag: Tag) => {
        if (tag.categoryId) {
          expect(categoryIds).toContain(tag.categoryId)
        }
      })
    })
  })

  describe('Category-tag relationships', () => {
    it('should have correct tag distribution across categories', () => {
      const categories = getAllCategories()
      
      categories.forEach((category: Category) => {
        const categoryTags = getTagsByCategory(category.id)
        const expectedTags = TAGS.filter((tag: Tag) => tag.categoryId === category.id)
        expect(categoryTags).toEqual(expectedTags)
      })
    })

    it('should have consistent project counts', () => {
      const categories = getAllCategories()
      
      categories.forEach((category: Category) => {
        expect(category.projectCount).toBeGreaterThanOrEqual(0)
        expect(typeof category.projectCount).toBe('number')
      })
    })

    it('should have valid color codes for categories', () => {
      const categories = getAllCategories()
      
      categories.forEach((category: Category) => {
        if (category.color) {
          expect(category.color).toMatch(/^#[0-9A-F]{6}$/i)
        }
      })
    })
  })
})