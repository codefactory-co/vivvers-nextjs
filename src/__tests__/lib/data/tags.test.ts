import {
  generalTagOptions,
  generalTagCategories,
  type TagOption,
  type TagCategory
} from '@/lib/data/tags'

describe('Tags Data', () => {
  describe('generalTagOptions', () => {
    it('should be an array of TagOption objects', () => {
      expect(Array.isArray(generalTagOptions)).toBe(true)
      expect(generalTagOptions.length).toBeGreaterThan(0)

      generalTagOptions.forEach(tag => {
        expect(tag).toHaveProperty('value')
        expect(tag).toHaveProperty('label')
        expect(tag).toHaveProperty('category')
        expect(typeof tag.value).toBe('string')
        expect(typeof tag.label).toBe('string')
        expect(typeof tag.category).toBe('string')
        
        if (tag.description) {
          expect(typeof tag.description).toBe('string')
        }
      })
    })

    it('should contain all expected categories', () => {
      const categories = [...new Set(generalTagOptions.map(tag => tag.category))]
      
      expect(categories).toContain('목적')
      expect(categories).toContain('난이도')
      expect(categories).toContain('특징')
      expect(categories).toContain('분야')
    })

    it('should have unique values', () => {
      const values = generalTagOptions.map(tag => tag.value)
      const uniqueValues = [...new Set(values)]
      
      expect(values.length).toBe(uniqueValues.length)
    })

    it('should have valid value formats (kebab-case)', () => {
      generalTagOptions.forEach(tag => {
        // Should be kebab-case: lowercase letters, numbers, hyphens
        expect(tag.value).toMatch(/^[a-z0-9-]+$/)
        expect(tag.value).not.toMatch(/^-|-$/) // Should not start or end with hyphen
        expect(tag.value).not.toMatch(/--/) // Should not have consecutive hyphens
      })
    })

    it('should have non-empty labels and descriptions', () => {
      generalTagOptions.forEach(tag => {
        expect(tag.label.trim()).toBeTruthy()
        
        if (tag.description) {
          expect(tag.description.trim()).toBeTruthy()
        }
      })
    })

    it('should contain expected purpose tags', () => {
      const purposeTags = generalTagOptions.filter(tag => tag.category === '목적')
      const purposeValues = purposeTags.map(tag => tag.value)

      expect(purposeValues).toContain('portfolio')
      expect(purposeValues).toContain('side-project')
      expect(purposeValues).toContain('learning')
      expect(purposeValues).toContain('commercial')
      expect(purposeValues).toContain('open-source')
      expect(purposeValues).toContain('hackathon')
    })

    it('should contain expected difficulty tags', () => {
      const difficultyTags = generalTagOptions.filter(tag => tag.category === '난이도')
      const difficultyValues = difficultyTags.map(tag => tag.value)

      expect(difficultyValues).toContain('beginner')
      expect(difficultyValues).toContain('intermediate')
      expect(difficultyValues).toContain('advanced')
    })

    it('should contain expected feature tags', () => {
      const featureTags = generalTagOptions.filter(tag => tag.category === '특징')
      const featureValues = featureTags.map(tag => tag.value)

      expect(featureValues).toContain('responsive')
      expect(featureValues).toContain('realtime')
      expect(featureValues).toContain('mobile-first')
      expect(featureValues).toContain('pwa')
      expect(featureValues).toContain('seo-optimized')
      expect(featureValues).toContain('accessibility')
      expect(featureValues).toContain('dark-mode')
      expect(featureValues).toContain('multilingual')
    })

    it('should contain expected domain tags', () => {
      const domainTags = generalTagOptions.filter(tag => tag.category === '분야')
      const domainValues = domainTags.map(tag => tag.value)

      expect(domainValues).toContain('e-commerce')
      expect(domainValues).toContain('social')
      expect(domainValues).toContain('education')
      expect(domainValues).toContain('healthcare')
      expect(domainValues).toContain('finance')
      expect(domainValues).toContain('entertainment')
      expect(domainValues).toContain('productivity')
      expect(domainValues).toContain('news')
      expect(domainValues).toContain('travel')
      expect(domainValues).toContain('food')
    })

    it('should have Korean labels for appropriate tags', () => {
      const koreanTags = generalTagOptions.filter(tag => 
        /[가-힣]/.test(tag.label)
      )

      expect(koreanTags.length).toBeGreaterThan(0)

      // Check some specific Korean labels
      const portfolioTag = generalTagOptions.find(tag => tag.value === 'portfolio')
      expect(portfolioTag?.label).toBe('포트폴리오')

      const beginnerTag = generalTagOptions.find(tag => tag.value === 'beginner')
      expect(beginnerTag?.label).toBe('초급')

      const responsiveTag = generalTagOptions.find(tag => tag.value === 'responsive')
      expect(responsiveTag?.label).toBe('반응형')
    })

    it('should have descriptive descriptions for all tags', () => {
      generalTagOptions.forEach(tag => {
        expect(tag.description).toBeDefined()
        expect(tag.description).toBeTruthy()
        expect(tag.description!.length).toBeGreaterThanOrEqual(5)
      })
    })
  })

  describe('generalTagCategories', () => {
    it('should be an array of TagCategory objects', () => {
      expect(Array.isArray(generalTagCategories)).toBe(true)
      expect(generalTagCategories.length).toBe(4)

      generalTagCategories.forEach(category => {
        expect(category).toHaveProperty('name')
        expect(category).toHaveProperty('tags')
        expect(typeof category.name).toBe('string')
        expect(Array.isArray(category.tags)).toBe(true)
      })
    })

    it('should contain all expected category names', () => {
      const categoryNames = generalTagCategories.map(cat => cat.name)
      
      expect(categoryNames).toContain('목적')
      expect(categoryNames).toContain('난이도')
      expect(categoryNames).toContain('특징')
      expect(categoryNames).toContain('분야')
    })

    it('should have tags that match their category', () => {
      generalTagCategories.forEach(category => {
        category.tags.forEach(tag => {
          expect(tag.category).toBe(category.name)
        })
      })
    })

    it('should contain all tags from generalTagOptions', () => {
      const allCategoryTags = generalTagCategories.flatMap(cat => cat.tags)
      
      expect(allCategoryTags.length).toBe(generalTagOptions.length)

      // Check that every tag from generalTagOptions is in categories
      generalTagOptions.forEach(originalTag => {
        const foundTag = allCategoryTags.find(tag => tag.value === originalTag.value)
        expect(foundTag).toBeDefined()
        expect(foundTag).toEqual(originalTag)
      })
    })

    it('should have proper category grouping', () => {
      // Check purpose category
      const purposeCategory = generalTagCategories.find(cat => cat.name === '목적')
      expect(purposeCategory).toBeDefined()
      expect(purposeCategory!.tags.length).toBeGreaterThan(0)
      expect(purposeCategory!.tags.every(tag => tag.category === '목적')).toBe(true)

      // Check difficulty category
      const difficultyCategory = generalTagCategories.find(cat => cat.name === '난이도')
      expect(difficultyCategory).toBeDefined()
      expect(difficultyCategory!.tags.length).toBe(3) // beginner, intermediate, advanced
      expect(difficultyCategory!.tags.every(tag => tag.category === '난이도')).toBe(true)

      // Check features category
      const featuresCategory = generalTagCategories.find(cat => cat.name === '특징')
      expect(featuresCategory).toBeDefined()
      expect(featuresCategory!.tags.length).toBeGreaterThan(0)
      expect(featuresCategory!.tags.every(tag => tag.category === '특징')).toBe(true)

      // Check domain category
      const domainCategory = generalTagCategories.find(cat => cat.name === '분야')
      expect(domainCategory).toBeDefined()
      expect(domainCategory!.tags.length).toBeGreaterThan(0)
      expect(domainCategory!.tags.every(tag => tag.category === '분야')).toBe(true)
    })

    it('should have unique tag values within each category', () => {
      generalTagCategories.forEach(category => {
        const values = category.tags.map(tag => tag.value)
        const uniqueValues = [...new Set(values)]
        
        expect(values.length).toBe(uniqueValues.length)
      })
    })

    it('should have consistent filtering logic', () => {
      // Test that the filtering logic works correctly
      const purposeTags = generalTagOptions.filter(tag => tag.category === '목적')
      const purposeCategory = generalTagCategories.find(cat => cat.name === '목적')
      
      expect(purposeCategory!.tags).toEqual(purposeTags)

      const difficultyTags = generalTagOptions.filter(tag => tag.category === '난이도')
      const difficultyCategory = generalTagCategories.find(cat => cat.name === '난이도')
      
      expect(difficultyCategory!.tags).toEqual(difficultyTags)

      const featureTags = generalTagOptions.filter(tag => tag.category === '특징')
      const featuresCategory = generalTagCategories.find(cat => cat.name === '특징')
      
      expect(featuresCategory!.tags).toEqual(featureTags)

      const domainTags = generalTagOptions.filter(tag => tag.category === '분야')
      const domainCategory = generalTagCategories.find(cat => cat.name === '분야')
      
      expect(domainCategory!.tags).toEqual(domainTags)
    })

    it('should maintain tag order within categories', () => {
      generalTagCategories.forEach(category => {
        const originalCategoryTags = generalTagOptions.filter(tag => tag.category === category.name)
        
        expect(category.tags).toEqual(originalCategoryTags)
      })
    })

    it('should have non-empty categories', () => {
      generalTagCategories.forEach(category => {
        expect(category.tags.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Data integrity', () => {
    it('should have consistent tag objects across arrays', () => {
      // Test that tags in categories are exact references to tags in generalTagOptions
      generalTagCategories.forEach(category => {
        category.tags.forEach(categoryTag => {
          const originalTag = generalTagOptions.find(tag => tag.value === categoryTag.value)
          expect(originalTag).toBeDefined()
          
          // Check all properties match
          expect(categoryTag.value).toBe(originalTag!.value)
          expect(categoryTag.label).toBe(originalTag!.label)
          expect(categoryTag.category).toBe(originalTag!.category)
          expect(categoryTag.description).toBe(originalTag!.description)
        })
      })
    })

    it('should not have missing or extra tags in categories', () => {
      const allCategoryTags = generalTagCategories.flatMap(cat => cat.tags)
      const allCategoryValues = allCategoryTags.map(tag => tag.value).sort()
      const allOriginalValues = generalTagOptions.map(tag => tag.value).sort()
      
      expect(allCategoryValues).toEqual(allOriginalValues)
    })

    it('should handle edge cases in tag data', () => {
      // Check for potential issues with special characters
      generalTagOptions.forEach(tag => {
        expect(tag.value).not.toContain(' ') // No spaces in values
        expect(tag.value).not.toContain('.') // No dots in values
        expect(tag.value).not.toMatch(/[A-Z]/) // No uppercase in values
        
        expect(tag.label.trim()).toBe(tag.label) // No leading/trailing whitespace
        
        if (tag.description) {
          expect(tag.description.trim()).toBe(tag.description) // No leading/trailing whitespace
        }
      })
    })
  })
})