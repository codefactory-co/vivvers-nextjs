/**
 * @jest-environment jsdom
 */

import { tagUtils } from '@/lib/validations/project'

/**
 * Tests for TagInput component business logic
 * These test the validation and suggestion logic used in the TagInput component
 */
describe('TagInput Component Business Logic', () => {
  describe('Tag Validation', () => {
    it('should validate correct tags', () => {
      expect(tagUtils.isValidTag('react')).toBe(true)
      expect(tagUtils.isValidTag('vue-js')).toBe(true)
      expect(tagUtils.isValidTag('web_dev')).toBe(true)
      expect(tagUtils.isValidTag('nextjs13')).toBe(true)
    })

    it('should reject invalid tags', () => {
      expect(tagUtils.isValidTag('a')).toBe(false) // Too short
      expect(tagUtils.isValidTag('')).toBe(false) // Empty
      expect(tagUtils.isValidTag('react js')).toBe(false) // Spaces
      expect(tagUtils.isValidTag('react!')).toBe(false) // Special chars
      expect(tagUtils.isValidTag('react.js')).toBe(false) // Dots
    })

    it('should handle edge cases', () => {
      expect(tagUtils.isValidTag('ab')).toBe(true) // Minimum length
      expect(tagUtils.isValidTag('a')).toBe(false) // Below minimum
      expect(tagUtils.isValidTag('   ')).toBe(false) // Whitespace only
      expect(tagUtils.isValidTag('react-')).toBe(true) // Ending with hyphen
      expect(tagUtils.isValidTag('-react')).toBe(true) // Starting with hyphen
    })
  })

  describe('Tag Suggestions', () => {
    it('should suggest valid alternatives for invalid tags', () => {
      expect(tagUtils.suggestTag('React JS')).toBe('react-js')
      expect(tagUtils.suggestTag('Vue.js')).toBe('vuejs')
      expect(tagUtils.suggestTag('Node JS')).toBe('node-js')
      expect(tagUtils.suggestTag('TypeScript!')).toBe('typescript')
    })

    it('should return same tag if already valid', () => {
      expect(tagUtils.suggestTag('react')).toBe('react')
      expect(tagUtils.suggestTag('vue-js')).toBe('vue-js')
      expect(tagUtils.suggestTag('web_dev')).toBe('web_dev')
    })

    it('should handle case normalization', () => {
      expect(tagUtils.suggestTag('REACT')).toBe('react')
      expect(tagUtils.suggestTag('VueJS')).toBe('vuejs')
      expect(tagUtils.suggestTag('TypeScript')).toBe('typescript')
    })

    it('should return null for tags that cannot be fixed', () => {
      expect(tagUtils.suggestTag('')).toBe(null)
      expect(tagUtils.suggestTag('a')).toBe(null)
      expect(tagUtils.suggestTag('   ')).toBe(null)
      expect(tagUtils.suggestTag('!@#$')).toBe(null)
    })

    it('should handle multiple transformations', () => {
      expect(tagUtils.suggestTag('  React.js!! ')).toBe('reactjs')
      expect(tagUtils.suggestTag('Node JS 2023')).toBe('node-js-2023')
      expect(tagUtils.suggestTag('Vue 3.0')).toBe('vue-30')
    })
  })

  describe('Validation Messages Logic', () => {
    it('should provide correct validation state for valid tags', () => {
      const validTags = ['react', 'vue-js', 'web_dev']
      
      validTags.forEach(tag => {
        const isValid = tagUtils.isValidTag(tag)
        const suggestion = tagUtils.suggestTag(tag)
        
        expect(isValid).toBe(true)
        expect(suggestion).toBe(tag) // Should return same tag
      })
    })

    it('should provide suggestion messages for fixable tags', () => {
      const testCases = [
        { input: 'React JS', expected: 'react-js' },
        { input: 'Vue.js', expected: 'vuejs' },
        { input: 'TypeScript!', expected: 'typescript' }
      ]

      testCases.forEach(({ input, expected }) => {
        const isValid = tagUtils.isValidTag(input)
        const suggestion = tagUtils.suggestTag(input)
        
        expect(isValid).toBe(false)
        expect(suggestion).toBe(expected)
        expect(suggestion).not.toBe(input) // Should be different from input
      })
    })

    it('should identify unfixable tags', () => {
      const unfixableTags = ['', 'a', '!@#', '   ']
      
      unfixableTags.forEach(tag => {
        const isValid = tagUtils.isValidTag(tag)
        const suggestion = tagUtils.suggestTag(tag)
        
        expect(isValid).toBe(false)
        expect(suggestion).toBe(null)
      })
    })
  })

  describe('Tag Handling Scenarios', () => {
    it('should simulate handleKeyDown logic', () => {
      const processTagInput = (inputValue: string, currentTags: string[], maxTags: number) => {
        const suggestion = tagUtils.suggestTag(inputValue)
        
        if (suggestion && !currentTags.includes(suggestion) && currentTags.length < maxTags) {
          return {
            success: true,
            newTags: [...currentTags, suggestion],
            addedTag: suggestion
          }
        }
        
        return {
          success: false,
          newTags: currentTags,
          addedTag: null
        }
      }

      // Valid new tag
      let result = processTagInput('react', [], 5)
      expect(result.success).toBe(true)
      expect(result.newTags).toEqual(['react'])

      // Duplicate tag
      result = processTagInput('react', ['react'], 5)
      expect(result.success).toBe(false)
      expect(result.newTags).toEqual(['react'])

      // Max tags reached
      result = processTagInput('vue', ['react', 'angular', 'svelte'], 3)
      expect(result.success).toBe(false)

      // Tag with transformation
      result = processTagInput('React JS', [], 5)
      expect(result.success).toBe(true)
      expect(result.newTags).toEqual(['react-js'])
    })

    it('should simulate comma-separated input processing', () => {
      const processCommaSeparatedInput = (
        inputValue: string, 
        currentTags: string[], 
        maxTags: number
      ) => {
        const newTags = inputValue.split(',').map(tag => tag.trim()).filter(Boolean)
        const updatedTags = [...currentTags]
        let addedCount = 0

        for (const tag of newTags) {
          const suggestion = tagUtils.suggestTag(tag)
          if (suggestion && !updatedTags.includes(suggestion) && updatedTags.length < maxTags) {
            updatedTags.push(suggestion)
            addedCount++
          }
        }

        return {
          tags: updatedTags,
          addedCount,
          hadValidTags: addedCount > 0
        }
      }

      // Multiple valid tags
      let result = processCommaSeparatedInput('react,vue,angular', [], 5)
      expect(result.tags).toEqual(['react', 'vue', 'angular'])
      expect(result.addedCount).toBe(3)
      expect(result.hadValidTags).toBe(true)

      // Mixed valid and invalid
      result = processCommaSeparatedInput('react,a,vue', [], 5)
      expect(result.tags).toEqual(['react', 'vue'])
      expect(result.addedCount).toBe(2)

      // With transformations
      result = processCommaSeparatedInput('React JS,Vue.js', [], 5)
      expect(result.tags).toEqual(['react-js', 'vuejs'])
      expect(result.addedCount).toBe(2)

      // Max tags limit
      result = processCommaSeparatedInput('react,vue,angular', [], 2)
      expect(result.tags).toEqual(['react', 'vue'])
      expect(result.addedCount).toBe(2)
    })

    it('should handle real-time validation feedback', () => {
      const getValidationFeedback = (inputValue: string) => {
        if (!inputValue.trim()) {
          return { message: null, isValid: null }
        }

        const isValid = tagUtils.isValidTag(inputValue)
        const suggestion = tagUtils.suggestTag(inputValue)

        if (isValid) {
          return { message: null, isValid: true }
        } else if (suggestion && suggestion !== inputValue) {
          return { 
            message: `"${suggestion}" 으로 변경됩니다`, 
            isValid: false 
          }
        } else if (!suggestion) {
          return { 
            message: '유효하지 않은 태그입니다', 
            isValid: false 
          }
        } else {
          return { 
            message: '태그는 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다', 
            isValid: false 
          }
        }
      }

      // Empty input
      expect(getValidationFeedback('')).toEqual({ message: null, isValid: null })

      // Valid tag
      expect(getValidationFeedback('react')).toEqual({ message: null, isValid: true })

      // Tag with suggestion
      expect(getValidationFeedback('React JS')).toEqual({ 
        message: '"react-js" 으로 변경됩니다', 
        isValid: false 
      })

      // Invalid tag that can't be fixed
      expect(getValidationFeedback('a')).toEqual({ 
        message: '유효하지 않은 태그입니다', 
        isValid: false 
      })
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle unicode and special characters gracefully', () => {
      expect(tagUtils.suggestTag('react🔥')).toBe('react')
      expect(tagUtils.suggestTag('한글태그')).toBe(null)
      expect(tagUtils.suggestTag('تقنية')).toBe(null)
    })

    it('should handle very long inputs', () => {
      const longTag = 'a'.repeat(100)
      const suggestion = tagUtils.suggestTag(longTag)
      
      // Should be truncated or rejected based on validation rules
      if (suggestion) {
        expect(suggestion.length).toBeLessThanOrEqual(20) // Assuming max length is 20
      }
    })

    it('should handle malformed inputs', () => {
      const malformedInputs = [
        '   react   ',
        '\treact\n',
        'react\0',
        'react\u200B' // Zero-width space
      ]

      malformedInputs.forEach(input => {
        const suggestion = tagUtils.suggestTag(input)
        if (suggestion) {
          expect(suggestion).toBe('react')
        }
      })
    })
  })
})