/**
 * @jest-environment jsdom
 */

import {
  parseCommaSeparatedTags,
  canAddTag,
  addTagToList,
  removeTagFromList,
  processBatchTagAddition
} from '@/lib/utils/tags'

describe('Tag Processing Utilities', () => {
  // Mock suggest tag function for testing
  const mockSuggestTag = (tag: string): string | null => {
    if (!tag.trim()) return null
    // Simple mock: convert to lowercase and replace spaces with hyphens
    const cleaned = tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
    return cleaned.length >= 2 ? cleaned : null
  }

  describe('parseCommaSeparatedTags', () => {
    it('should parse simple comma-separated tags', () => {
      expect(parseCommaSeparatedTags('react,vue,angular')).toEqual(['react', 'vue', 'angular'])
      expect(parseCommaSeparatedTags('javascript,typescript')).toEqual(['javascript', 'typescript'])
    })

    it('should handle spaces around commas', () => {
      expect(parseCommaSeparatedTags('react, vue, angular')).toEqual(['react', 'vue', 'angular'])
      expect(parseCommaSeparatedTags('react , vue , angular')).toEqual(['react', 'vue', 'angular'])
    })

    it('should filter out empty tags', () => {
      expect(parseCommaSeparatedTags('react,,vue,,')).toEqual(['react', 'vue'])
      expect(parseCommaSeparatedTags('react, , vue, ')).toEqual(['react', 'vue'])
    })

    it('should handle single tag', () => {
      expect(parseCommaSeparatedTags('react')).toEqual(['react'])
      expect(parseCommaSeparatedTags(' react ')).toEqual(['react'])
    })

    it('should handle empty input', () => {
      expect(parseCommaSeparatedTags('')).toEqual([])
      expect(parseCommaSeparatedTags(' ')).toEqual([])
      expect(parseCommaSeparatedTags(',')).toEqual([])
    })

    it('should preserve tag content with spaces', () => {
      expect(parseCommaSeparatedTags('web development,mobile app')).toEqual(['web development', 'mobile app'])
    })
  })

  describe('canAddTag', () => {
    it('should return true for valid new tag', () => {
      expect(canAddTag('react', [], 5, mockSuggestTag)).toBe(true)
      expect(canAddTag('Vue', ['react'], 5, mockSuggestTag)).toBe(true)
    })

    it('should return false for invalid tag', () => {
      expect(canAddTag('a', [], 5, mockSuggestTag)).toBe(false) // Too short
      expect(canAddTag('', [], 5, mockSuggestTag)).toBe(false) // Empty
      expect(canAddTag('   ', [], 5, mockSuggestTag)).toBe(false) // Whitespace only
    })

    it('should return false for duplicate tag', () => {
      expect(canAddTag('react', ['react'], 5, mockSuggestTag)).toBe(false)
      expect(canAddTag('React', ['react'], 5, mockSuggestTag)).toBe(false) // Case insensitive via mock
    })

    it('should return false when max tags reached', () => {
      const maxTags = ['tag1', 'tag2', 'tag3']
      expect(canAddTag('react', maxTags, 3, mockSuggestTag)).toBe(false)
    })

    it('should handle suggestion transformation', () => {
      expect(canAddTag('React JS', [], 5, mockSuggestTag)).toBe(true) // Will become 'react-js'
      expect(canAddTag('React JS', ['react-js'], 5, mockSuggestTag)).toBe(false) // Duplicate after transformation
    })
  })

  describe('addTagToList', () => {
    it('should add valid tag to list', () => {
      const result = addTagToList('react', [], 5, mockSuggestTag)
      expect(result.success).toBe(true)
      expect(result.tags).toEqual(['react'])
      expect(result.addedTag).toBe('react')
    })

    it('should transform tag using suggestion', () => {
      const result = addTagToList('React JS', [], 5, mockSuggestTag)
      expect(result.success).toBe(true)
      expect(result.tags).toEqual(['react-js'])
      expect(result.addedTag).toBe('react-js')
    })

    it('should not add invalid tag', () => {
      const result = addTagToList('a', [], 5, mockSuggestTag)
      expect(result.success).toBe(false)
      expect(result.tags).toEqual([])
      expect(result.addedTag).toBeUndefined()
    })

    it('should not add duplicate tag', () => {
      const result = addTagToList('react', ['react'], 5, mockSuggestTag)
      expect(result.success).toBe(false)
      expect(result.tags).toEqual(['react'])
      expect(result.addedTag).toBeUndefined()
    })

    it('should not add tag when max reached', () => {
      const currentTags = ['tag1', 'tag2', 'tag3']
      const result = addTagToList('react', currentTags, 3, mockSuggestTag)
      expect(result.success).toBe(false)
      expect(result.tags).toEqual(currentTags)
      expect(result.addedTag).toBeUndefined()
    })

    it('should maintain existing tags order', () => {
      const currentTags = ['vue', 'angular']
      const result = addTagToList('react', currentTags, 5, mockSuggestTag)
      expect(result.success).toBe(true)
      expect(result.tags).toEqual(['vue', 'angular', 'react'])
    })
  })

  describe('removeTagFromList', () => {
    it('should remove tag at specified index', () => {
      const tags = ['react', 'vue', 'angular']
      expect(removeTagFromList(tags, 1)).toEqual(['react', 'angular'])
      expect(removeTagFromList(tags, 0)).toEqual(['vue', 'angular'])
      expect(removeTagFromList(tags, 2)).toEqual(['react', 'vue'])
    })

    it('should handle single tag removal', () => {
      expect(removeTagFromList(['react'], 0)).toEqual([])
    })

    it('should handle invalid index gracefully', () => {
      const tags = ['react', 'vue']
      expect(removeTagFromList(tags, -1)).toEqual(tags)
      expect(removeTagFromList(tags, 5)).toEqual(tags)
    })

    it('should not mutate original array', () => {
      const originalTags = ['react', 'vue', 'angular']
      const result = removeTagFromList(originalTags, 1)
      expect(originalTags).toEqual(['react', 'vue', 'angular'])
      expect(result).toEqual(['react', 'angular'])
    })
  })

  describe('processBatchTagAddition', () => {
    it('should process multiple valid tags', () => {
      const result = processBatchTagAddition('react,vue,angular', [], 5, mockSuggestTag)
      expect(result.tags).toEqual(['react', 'vue', 'angular'])
      expect(result.addedCount).toBe(3)
      expect(result.validTags).toEqual(['react', 'vue', 'angular'])
    })

    it('should handle mixed valid and invalid tags', () => {
      const result = processBatchTagAddition('react,a,vue,b', [], 5, mockSuggestTag)
      expect(result.tags).toEqual(['react', 'vue'])
      expect(result.addedCount).toBe(2)
      expect(result.validTags).toEqual(['react', 'vue'])
    })

    it('should respect max tags limit', () => {
      const result = processBatchTagAddition('react,vue,angular,svelte', [], 2, mockSuggestTag)
      expect(result.tags).toEqual(['react', 'vue'])
      expect(result.addedCount).toBe(2)
      expect(result.validTags).toEqual(['react', 'vue'])
    })

    it('should skip duplicates', () => {
      const result = processBatchTagAddition('react,vue,react', [], 5, mockSuggestTag)
      expect(result.tags).toEqual(['react', 'vue'])
      expect(result.addedCount).toBe(2)
      expect(result.validTags).toEqual(['react', 'vue'])
    })

    it('should append to existing tags', () => {
      const result = processBatchTagAddition('react,vue', ['angular'], 5, mockSuggestTag)
      expect(result.tags).toEqual(['angular', 'react', 'vue'])
      expect(result.addedCount).toBe(2)
      expect(result.validTags).toEqual(['react', 'vue'])
    })

    it('should handle transformations', () => {
      const result = processBatchTagAddition('React JS,Vue 3', [], 5, mockSuggestTag)
      expect(result.tags).toEqual(['react-js', 'vue-3'])
      expect(result.addedCount).toBe(2)
      expect(result.validTags).toEqual(['react-js', 'vue-3'])
    })

    it('should handle empty input', () => {
      const result = processBatchTagAddition('', ['existing'], 5, mockSuggestTag)
      expect(result.tags).toEqual(['existing'])
      expect(result.addedCount).toBe(0)
      expect(result.validTags).toEqual([])
    })

    it('should handle spaces and empty tags', () => {
      const result = processBatchTagAddition('react, , vue, ', [], 5, mockSuggestTag)
      expect(result.tags).toEqual(['react', 'vue'])
      expect(result.addedCount).toBe(2)
      expect(result.validTags).toEqual(['react', 'vue'])
    })

    it('should stop adding when max reached during processing', () => {
      const result = processBatchTagAddition(
        'react,vue,angular,svelte,nextjs', 
        ['existing1', 'existing2'], 
        4, 
        mockSuggestTag
      )
      expect(result.tags).toEqual(['existing1', 'existing2', 'react', 'vue'])
      expect(result.addedCount).toBe(2)
      expect(result.validTags).toEqual(['react', 'vue'])
    })
  })

  describe('integration scenarios', () => {
    it('should handle realistic tag management workflow', () => {
      let tags: string[] = []
      
      // Add initial tags
      let result = addTagToList('react', tags, 5, mockSuggestTag)
      tags = result.tags
      expect(tags).toEqual(['react'])

      // Batch add more tags
      const batchResult = processBatchTagAddition('vue,angular', tags, 5, mockSuggestTag)
      tags = batchResult.tags
      expect(tags).toEqual(['react', 'vue', 'angular'])

      // Remove middle tag
      tags = removeTagFromList(tags, 1)
      expect(tags).toEqual(['react', 'angular'])

      // Try to add duplicate (should fail)
      result = addTagToList('react', tags, 5, mockSuggestTag)
      expect(result.success).toBe(false)
      expect(result.tags).toEqual(['react', 'angular'])

      // Add new tag with transformation
      result = addTagToList('Next JS', tags, 5, mockSuggestTag)
      expect(result.success).toBe(true)
      expect(result.tags).toEqual(['react', 'angular', 'next-js'])
    })
  })
})