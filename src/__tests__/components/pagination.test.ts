/**
 * @jest-environment jsdom
 */

import {
  generatePageNumbers,
  shouldShowPagination,
  isPreviousDisabled,
  isNextDisabled,
  getNextPage,
  getPreviousPage
} from '@/lib/utils/pagination'

describe('Pagination Utilities', () => {
  describe('generatePageNumbers', () => {
    it('should show all pages when total pages <= maxVisible', () => {
      expect(generatePageNumbers(1, 5, 7)).toEqual([1, 2, 3, 4, 5])
      expect(generatePageNumbers(3, 7, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
      expect(generatePageNumbers(1, 1, 7)).toEqual([1])
    })

    it('should show first pages with ellipsis when current page <= 3', () => {
      expect(generatePageNumbers(1, 10, 7)).toEqual([1, 2, 3, 4, 5, '...', 10])
      expect(generatePageNumbers(2, 10, 7)).toEqual([1, 2, 3, 4, 5, '...', 10])
      expect(generatePageNumbers(3, 10, 7)).toEqual([1, 2, 3, 4, 5, '...', 10])
    })

    it('should show last pages with ellipsis when current page >= totalPages - 2', () => {
      expect(generatePageNumbers(8, 10, 7)).toEqual([1, '...', 6, 7, 8, 9, 10])
      expect(generatePageNumbers(9, 10, 7)).toEqual([1, '...', 6, 7, 8, 9, 10])
      expect(generatePageNumbers(10, 10, 7)).toEqual([1, '...', 6, 7, 8, 9, 10])
    })

    it('should show current page with neighbors and ellipses when in middle', () => {
      expect(generatePageNumbers(5, 10, 7)).toEqual([1, '...', 4, 5, 6, '...', 10])
      expect(generatePageNumbers(6, 12, 7)).toEqual([1, '...', 5, 6, 7, '...', 12])
      expect(generatePageNumbers(7, 15, 7)).toEqual([1, '...', 6, 7, 8, '...', 15])
    })

    it('should handle custom maxVisiblePages', () => {
      expect(generatePageNumbers(1, 10, 5)).toEqual([1, 2, 3, 4, 5, '...', 10])
      expect(generatePageNumbers(5, 10, 5)).toEqual([1, '...', 4, 5, 6, '...', 10])
    })

    it('should handle edge cases', () => {
      expect(generatePageNumbers(1, 8, 7)).toEqual([1, 2, 3, 4, 5, '...', 8])
      expect(generatePageNumbers(4, 8, 7)).toEqual([1, '...', 3, 4, 5, '...', 8])
      expect(generatePageNumbers(8, 8, 7)).toEqual([1, '...', 4, 5, 6, 7, 8])
    })

    it('should not duplicate last page', () => {
      const result = generatePageNumbers(5, 10, 7)
      const lastPageCount = result.filter(page => page === 10).length
      expect(lastPageCount).toBe(1)
    })

    it('should always include first and last page (when total > maxVisible)', () => {
      const testCases = [
        { current: 1, total: 20 },
        { current: 10, total: 20 },
        { current: 20, total: 20 }
      ]

      testCases.forEach(({ current, total }) => {
        const result = generatePageNumbers(current, total, 7)
        expect(result).toContain(1)
        expect(result).toContain(total)
      })
    })
  })

  describe('shouldShowPagination', () => {
    it('should return false for single page or no pages', () => {
      expect(shouldShowPagination(0)).toBe(false)
      expect(shouldShowPagination(1)).toBe(false)
    })

    it('should return true for multiple pages', () => {
      expect(shouldShowPagination(2)).toBe(true)
      expect(shouldShowPagination(5)).toBe(true)
      expect(shouldShowPagination(100)).toBe(true)
    })

    it('should handle negative input gracefully', () => {
      expect(shouldShowPagination(-1)).toBe(false)
      expect(shouldShowPagination(-5)).toBe(false)
    })
  })

  describe('isPreviousDisabled', () => {
    it('should return true for first page', () => {
      expect(isPreviousDisabled(1)).toBe(true)
    })

    it('should return false for pages after first', () => {
      expect(isPreviousDisabled(2)).toBe(false)
      expect(isPreviousDisabled(5)).toBe(false)
      expect(isPreviousDisabled(100)).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isPreviousDisabled(0)).toBe(true)
      expect(isPreviousDisabled(-1)).toBe(true)
    })
  })

  describe('isNextDisabled', () => {
    it('should return true when on last page', () => {
      expect(isNextDisabled(5, 5)).toBe(true)
      expect(isNextDisabled(10, 10)).toBe(true)
      expect(isNextDisabled(1, 1)).toBe(true)
    })

    it('should return false when not on last page', () => {
      expect(isNextDisabled(1, 5)).toBe(false)
      expect(isNextDisabled(4, 5)).toBe(false)
      expect(isNextDisabled(9, 10)).toBe(false)
    })

    it('should return true when current page exceeds total', () => {
      expect(isNextDisabled(6, 5)).toBe(true)
      expect(isNextDisabled(15, 10)).toBe(true)
    })

    it('should handle edge cases', () => {
      expect(isNextDisabled(0, 5)).toBe(false)
      expect(isNextDisabled(1, 0)).toBe(true)
    })
  })

  describe('getNextPage', () => {
    it('should return next page when not at end', () => {
      expect(getNextPage(1, 5)).toBe(2)
      expect(getNextPage(3, 5)).toBe(4)
      expect(getNextPage(4, 5)).toBe(5)
    })

    it('should return same page when at end', () => {
      expect(getNextPage(5, 5)).toBe(5)
      expect(getNextPage(10, 10)).toBe(10)
      expect(getNextPage(1, 1)).toBe(1)
    })

    it('should clamp to total pages when current exceeds total', () => {
      expect(getNextPage(6, 5)).toBe(5)
      expect(getNextPage(15, 10)).toBe(10)
    })

    it('should handle edge cases', () => {
      expect(getNextPage(0, 5)).toBe(1)
      expect(getNextPage(-1, 5)).toBe(1)
    })
  })

  describe('getPreviousPage', () => {
    it('should return previous page when not at start', () => {
      expect(getPreviousPage(5)).toBe(4)
      expect(getPreviousPage(3)).toBe(2)
      expect(getPreviousPage(2)).toBe(1)
    })

    it('should return 1 when at start', () => {
      expect(getPreviousPage(1)).toBe(1)
    })

    it('should return 1 for invalid input', () => {
      expect(getPreviousPage(0)).toBe(1)
      expect(getPreviousPage(-1)).toBe(1)
      expect(getPreviousPage(-5)).toBe(1)
    })
  })

  describe('integration tests', () => {
    it('should work together for common pagination scenario', () => {
      const currentPage = 5
      const totalPages = 10

      expect(shouldShowPagination(totalPages)).toBe(true)
      expect(isPreviousDisabled(currentPage)).toBe(false)
      expect(isNextDisabled(currentPage, totalPages)).toBe(false)
      expect(getNextPage(currentPage, totalPages)).toBe(6)
      expect(getPreviousPage(currentPage)).toBe(4)
      
      const pageNumbers = generatePageNumbers(currentPage, totalPages)
      expect(pageNumbers).toContain(currentPage)
      expect(pageNumbers).toContain(1)
      expect(pageNumbers).toContain(totalPages)
    })

    it('should handle first page edge case', () => {
      const currentPage = 1
      const totalPages = 10

      expect(isPreviousDisabled(currentPage)).toBe(true)
      expect(isNextDisabled(currentPage, totalPages)).toBe(false)
      expect(getNextPage(currentPage, totalPages)).toBe(2)
      expect(getPreviousPage(currentPage)).toBe(1)
    })

    it('should handle last page edge case', () => {
      const currentPage = 10
      const totalPages = 10

      expect(isPreviousDisabled(currentPage)).toBe(false)
      expect(isNextDisabled(currentPage, totalPages)).toBe(true)
      expect(getNextPage(currentPage, totalPages)).toBe(10)
      expect(getPreviousPage(currentPage)).toBe(9)
    })
  })
})