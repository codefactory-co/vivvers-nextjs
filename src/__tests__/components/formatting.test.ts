/**
 * @jest-environment jsdom
 */

import {
  formatDate,
  formatCount,
  formatAdditionalTagsCount,
  shouldShowAdditionalTags
} from '@/lib/utils/formatting'

describe('Formatting Utilities', () => {
  describe('formatDate', () => {
    beforeAll(() => {
      // Mock the locale to ensure consistent test results
      jest.spyOn(Date.prototype, 'toLocaleDateString').mockImplementation(function(this: Date, locale, options) {
        if (locale === 'ko-KR') {
          const year = this.getFullYear()
          const month = this.getMonth() + 1
          const day = this.getDate()
          
          // Simulate Korean locale formatting
          const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
          return `${year}. ${monthNames[this.getMonth()]} ${day}.`
        }
        return this.toLocaleDateString(locale, options)
      })
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('should format date in Korean locale', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date)
      expect(result).toBe('2024. 1월 15.')
    })

    it('should handle different months correctly', () => {
      const dates = [
        { date: new Date('2024-03-01'), expected: '2024. 3월 1.' },
        { date: new Date('2024-12-31'), expected: '2024. 12월 31.' },
        { date: new Date('2023-06-15'), expected: '2023. 6월 15.' }
      ]

      dates.forEach(({ date, expected }) => {
        expect(formatDate(date)).toBe(expected)
      })
    })

    it('should handle year boundaries', () => {
      const newYear = new Date('2025-01-01')
      const result = formatDate(newYear)
      expect(result).toBe('2025. 1월 1.')
    })
  })

  describe('formatCount', () => {
    it('should format small numbers without suffix', () => {
      expect(formatCount(0)).toBe('0')
      expect(formatCount(1)).toBe('1')
      expect(formatCount(42)).toBe('42')
      expect(formatCount(999)).toBe('999')
    })

    it('should format thousands with k suffix', () => {
      expect(formatCount(1000)).toBe('1k')
      expect(formatCount(1200)).toBe('1.2k')
      expect(formatCount(1500)).toBe('1.5k')
      expect(formatCount(9999)).toBe('10k')
      expect(formatCount(15600)).toBe('15.6k')
    })

    it('should remove .0 from k suffix', () => {
      expect(formatCount(2000)).toBe('2k')
      expect(formatCount(5000)).toBe('5k')
      expect(formatCount(10000)).toBe('10k')
    })

    it('should format millions with M suffix', () => {
      expect(formatCount(1000000)).toBe('1M')
      expect(formatCount(1200000)).toBe('1.2M')
      expect(formatCount(2500000)).toBe('2.5M')
      expect(formatCount(10000000)).toBe('10M')
    })

    it('should remove .0 from M suffix', () => {
      expect(formatCount(2000000)).toBe('2M')
      expect(formatCount(5000000)).toBe('5M')
      expect(formatCount(10000000)).toBe('10M')
    })

    it('should handle edge cases', () => {
      expect(formatCount(999999)).toBe('1000k')
      expect(formatCount(1000001)).toBe('1M')
    })

    it('should handle very large numbers', () => {
      expect(formatCount(1500000000)).toBe('1500M')
      expect(formatCount(2100000000)).toBe('2100M')
    })
  })

  describe('formatAdditionalTagsCount', () => {
    it('should return empty string when no additional tags', () => {
      expect(formatAdditionalTagsCount(3, 3)).toBe('')
      expect(formatAdditionalTagsCount(2, 3)).toBe('')
      expect(formatAdditionalTagsCount(1, 5)).toBe('')
    })

    it('should return correct additional count with + prefix', () => {
      expect(formatAdditionalTagsCount(5, 3)).toBe('+2')
      expect(formatAdditionalTagsCount(10, 3)).toBe('+7')
      expect(formatAdditionalTagsCount(4, 3)).toBe('+1')
    })

    it('should handle edge case of equal counts', () => {
      expect(formatAdditionalTagsCount(0, 0)).toBe('')
      expect(formatAdditionalTagsCount(1, 1)).toBe('')
    })

    it('should handle large differences', () => {
      expect(formatAdditionalTagsCount(100, 3)).toBe('+97')
      expect(formatAdditionalTagsCount(50, 5)).toBe('+45')
    })
  })

  describe('shouldShowAdditionalTags', () => {
    it('should return false when total tags <= visible count', () => {
      expect(shouldShowAdditionalTags(3, 3)).toBe(false)
      expect(shouldShowAdditionalTags(2, 3)).toBe(false)
      expect(shouldShowAdditionalTags(0, 5)).toBe(false)
      expect(shouldShowAdditionalTags(1, 5)).toBe(false)
    })

    it('should return true when total tags > visible count', () => {
      expect(shouldShowAdditionalTags(5, 3)).toBe(true)
      expect(shouldShowAdditionalTags(10, 3)).toBe(true)
      expect(shouldShowAdditionalTags(4, 3)).toBe(true)
    })

    it('should handle edge cases', () => {
      expect(shouldShowAdditionalTags(0, 0)).toBe(false)
      expect(shouldShowAdditionalTags(1, 0)).toBe(true)
    })

    it('should be consistent with formatAdditionalTagsCount', () => {
      const testCases = [
        { total: 5, visible: 3 },
        { total: 3, visible: 3 },
        { total: 2, visible: 5 },
        { total: 10, visible: 2 }
      ]

      testCases.forEach(({ total, visible }) => {
        const shouldShow = shouldShowAdditionalTags(total, visible)
        const formatResult = formatAdditionalTagsCount(total, visible)
        
        if (shouldShow) {
          expect(formatResult).not.toBe('')
          expect(formatResult).toMatch(/^\+\d+$/)
        } else {
          expect(formatResult).toBe('')
        }
      })
    })
  })
})