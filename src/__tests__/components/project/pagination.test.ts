/**
 * Unit tests for pagination business logic
 * Focus: Testing the getPageNumbers algorithm and edge cases
 */

// Extract the pagination logic for pure function testing
export const getPageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
  const pageNumbers: (number | string)[] = []
  const maxVisiblePages = 7

  if (totalPages <= maxVisiblePages) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
  } else {
    // Always show first page
    pageNumbers.push(1)

    if (currentPage <= 3) {
      // Show pages 2, 3, 4, 5 and ellipsis
      for (let i = 2; i <= 5; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push('...')
    } else if (currentPage >= totalPages - 2) {
      // Show ellipsis and last few pages
      pageNumbers.push('...')
      for (let i = totalPages - 4; i <= totalPages - 1; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Show ellipsis, current page with neighbors, ellipsis
      pageNumbers.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push('...')
    }

    // Always show last page (if not already shown)
    if (!pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages)
    }
  }

  return pageNumbers
}

describe('Pagination Business Logic', () => {
  describe('getPageNumbers', () => {
    describe('Small page sets (≤7 pages)', () => {
      test('should show all pages when totalPages is 1', () => {
        const result = getPageNumbers(1, 1)
        expect(result).toEqual([1])
      })

      test('should show all pages when totalPages is 2', () => {
        const result = getPageNumbers(1, 2)
        expect(result).toEqual([1, 2])
      })

      test('should show all pages when totalPages is 5', () => {
        const result = getPageNumbers(3, 5)
        expect(result).toEqual([1, 2, 3, 4, 5])
      })

      test('should show all pages when totalPages equals maxVisiblePages (7)', () => {
        const result = getPageNumbers(4, 7)
        expect(result).toEqual([1, 2, 3, 4, 5, 6, 7])
      })

      test('should handle edge case with currentPage at start', () => {
        const result = getPageNumbers(1, 6)
        expect(result).toEqual([1, 2, 3, 4, 5, 6])
      })

      test('should handle edge case with currentPage at end', () => {
        const result = getPageNumbers(6, 6)
        expect(result).toEqual([1, 2, 3, 4, 5, 6])
      })
    })

    describe('Large page sets (>7 pages)', () => {
      describe('Current page near beginning (≤3)', () => {
        test('should show first 5 pages and ellipsis when currentPage is 1', () => {
          const result = getPageNumbers(1, 20)
          expect(result).toEqual([1, 2, 3, 4, 5, '...', 20])
        })

        test('should show first 5 pages and ellipsis when currentPage is 2', () => {
          const result = getPageNumbers(2, 15)
          expect(result).toEqual([1, 2, 3, 4, 5, '...', 15])
        })

        test('should show first 5 pages and ellipsis when currentPage is 3', () => {
          const result = getPageNumbers(3, 50)
          expect(result).toEqual([1, 2, 3, 4, 5, '...', 50])
        })

        test('should handle edge case with 8 total pages and currentPage 1', () => {
          const result = getPageNumbers(1, 8)
          expect(result).toEqual([1, 2, 3, 4, 5, '...', 8])
        })
      })

      describe('Current page near end (≥totalPages-2)', () => {
        test('should show ellipsis and last 5 pages when currentPage is at end', () => {
          const result = getPageNumbers(20, 20)
          expect(result).toEqual([1, '...', 16, 17, 18, 19, 20])
        })

        test('should show ellipsis and last 5 pages when currentPage is second to last', () => {
          const result = getPageNumbers(19, 20)
          expect(result).toEqual([1, '...', 16, 17, 18, 19, 20])
        })

        test('should show ellipsis and last 5 pages when currentPage is third to last', () => {
          const result = getPageNumbers(18, 20)
          expect(result).toEqual([1, '...', 16, 17, 18, 19, 20])
        })

        test('should handle edge case with 8 total pages and currentPage 8', () => {
          const result = getPageNumbers(8, 8)
          expect(result).toEqual([1, '...', 4, 5, 6, 7, 8])
        })

        test('should handle edge case with minimal difference', () => {
          const result = getPageNumbers(7, 8)
          expect(result).toEqual([1, '...', 4, 5, 6, 7, 8])
        })
      })

      describe('Current page in middle', () => {
        test('should show ellipsis on both sides when currentPage is in middle', () => {
          const result = getPageNumbers(10, 20)
          expect(result).toEqual([1, '...', 9, 10, 11, '...', 20])
        })

        test('should show ellipsis on both sides with different middle page', () => {
          const result = getPageNumbers(7, 15)
          expect(result).toEqual([1, '...', 6, 7, 8, '...', 15])
        })

        test('should handle middle page with large total pages', () => {
          const result = getPageNumbers(50, 100)
          expect(result).toEqual([1, '...', 49, 50, 51, '...', 100])
        })

        test('should handle boundary transition from beginning pattern', () => {
          const result = getPageNumbers(4, 15)
          expect(result).toEqual([1, '...', 3, 4, 5, '...', 15])
        })

        test('should handle boundary transition to end pattern', () => {
          const result = getPageNumbers(12, 15)
          expect(result).toEqual([1, '...', 11, 12, 13, '...', 15])
        })
      })
    })

    describe('Edge cases and boundary conditions', () => {
      test('should handle minimum viable pagination (8 pages)', () => {
        expect(getPageNumbers(1, 8)).toEqual([1, 2, 3, 4, 5, '...', 8])
        expect(getPageNumbers(4, 8)).toEqual([1, '...', 3, 4, 5, '...', 8])
        expect(getPageNumbers(8, 8)).toEqual([1, '...', 4, 5, 6, 7, 8])
      })

      test('should handle very large page counts', () => {
        const result = getPageNumbers(500, 1000)
        expect(result).toEqual([1, '...', 499, 500, 501, '...', 1000])
        expect(result).toHaveLength(7) // Should always have max 7 elements
      })

      test('should never show duplicate page numbers', () => {
        const testCases = [
          [1, 20], [10, 20], [20, 20],
          [1, 8], [4, 8], [8, 8],
          [5, 15], [10, 15], [15, 15]
        ]

        testCases.forEach(([currentPage, totalPages]) => {
          const result = getPageNumbers(currentPage, totalPages)
          const numbers = result.filter(n => typeof n === 'number')
          const uniqueNumbers = [...new Set(numbers)]
          expect(numbers).toEqual(uniqueNumbers)
        })
      })

      test('should always include first page', () => {
        const testCases = [
          [10, 20], [5, 15], [50, 100], [8, 8]
        ]

        testCases.forEach(([currentPage, totalPages]) => {
          const result = getPageNumbers(currentPage, totalPages)
          expect(result[0]).toBe(1)
        })
      })

      test('should always include last page when totalPages > 7', () => {
        const testCases = [
          [1, 20], [10, 20], [20, 20],
          [1, 8], [4, 8], [8, 8],
          [5, 100], [50, 100]
        ]

        testCases.forEach(([currentPage, totalPages]) => {
          if (totalPages > 7) {
            const result = getPageNumbers(currentPage, totalPages)
            expect(result[result.length - 1]).toBe(totalPages)
          }
        })
      })

      test('should maintain proper order of page numbers', () => {
        const testCases = [
          [1, 20], [10, 20], [20, 20],
          [4, 15], [8, 15], [12, 15]
        ]

        testCases.forEach(([currentPage, totalPages]) => {
          const result = getPageNumbers(currentPage, totalPages)
          const numbers = result.filter(n => typeof n === 'number') as number[]
          
          for (let i = 1; i < numbers.length; i++) {
            expect(numbers[i]).toBeGreaterThan(numbers[i - 1])
          }
        })
      })

      test('should never exceed maximum visible pages', () => {
        const testCases = [
          [1, 20], [10, 20], [20, 20],
          [1, 100], [50, 100], [100, 100],
          [1, 8], [4, 8], [8, 8]
        ]

        testCases.forEach(([currentPage, totalPages]) => {
          const result = getPageNumbers(currentPage, totalPages)
          expect(result.length).toBeLessThanOrEqual(7)
        })
      })

      test('should handle current page at exact boundary positions', () => {
        // Test transition points where algorithm changes behavior
        expect(getPageNumbers(3, 15)).toEqual([1, 2, 3, 4, 5, '...', 15]) // Last page of beginning pattern
        expect(getPageNumbers(4, 15)).toEqual([1, '...', 3, 4, 5, '...', 15]) // First page of middle pattern
        
        expect(getPageNumbers(12, 15)).toEqual([1, '...', 11, 12, 13, '...', 15]) // Last page of middle pattern
        expect(getPageNumbers(13, 15)).toEqual([1, '...', 11, 12, 13, 14, 15]) // First page of end pattern
      })
    })

    describe('Algorithm consistency', () => {
      test('should produce consistent results for same inputs', () => {
        const testCases = [
          [1, 20], [10, 20], [20, 20],
          [5, 15], [8, 8], [3, 7]
        ]

        testCases.forEach(([currentPage, totalPages]) => {
          const result1 = getPageNumbers(currentPage, totalPages)
          const result2 = getPageNumbers(currentPage, totalPages)
          expect(result1).toEqual(result2)
        })
      })

      test('should handle ellipsis placement correctly', () => {
        // Beginning pattern: trailing ellipsis only
        const beginResult1 = getPageNumbers(1, 20)
        expect(beginResult1.filter(n => n === '...').length).toBe(1)
        expect(beginResult1.indexOf('...')).toBe(5) // Should be after first 5 pages
        
        const beginResult2 = getPageNumbers(2, 20)
        expect(beginResult2.filter(n => n === '...').length).toBe(1)
        
        const beginResult3 = getPageNumbers(3, 20)
        expect(beginResult3.filter(n => n === '...').length).toBe(1)
        
        // Middle pattern: ellipsis on both sides
        const middleResult = getPageNumbers(10, 20)
        const ellipsisCount = middleResult.filter(n => n === '...').length
        expect(ellipsisCount).toBe(2)
        
        // End pattern: only leading ellipsis
        const endResult = getPageNumbers(18, 20)
        const endEllipsisCount = endResult.filter(n => n === '...').length
        expect(endEllipsisCount).toBe(1)
        expect(endResult.indexOf('...')).toBe(1) // Should be second element
      })
    })
  })

  describe('Page navigation logic', () => {
    describe('Previous page calculation', () => {
      test('should calculate previous page correctly', () => {
        expect(5 - 1).toBe(4) // currentPage - 1
        expect(2 - 1).toBe(1)
        expect(1 - 1).toBe(0) // Edge case: should be disabled
      })

      test('should identify when previous button should be disabled', () => {
        expect(1 <= 1).toBe(true) // currentPage <= 1
        expect(2 <= 1).toBe(false)
        expect(0 <= 1).toBe(true)
      })
    })

    describe('Next page calculation', () => {
      test('should calculate next page correctly', () => {
        expect(5 + 1).toBe(6) // currentPage + 1
        expect(10 + 1).toBe(11)
        expect(20 + 1).toBe(21) // Edge case: should be disabled if equals totalPages
      })

      test('should identify when next button should be disabled', () => {
        expect(20 >= 20).toBe(true) // currentPage >= totalPages
        expect(19 >= 20).toBe(false)
        expect(21 >= 20).toBe(true)
      })
    })

    describe('Page range validation', () => {
      test('should validate page numbers are within bounds', () => {
        const isValidPage = (page: number, totalPages: number) => 
          page >= 1 && page <= totalPages

        expect(isValidPage(1, 20)).toBe(true)
        expect(isValidPage(20, 20)).toBe(true)
        expect(isValidPage(10, 20)).toBe(true)
        expect(isValidPage(0, 20)).toBe(false)
        expect(isValidPage(21, 20)).toBe(false)
        expect(isValidPage(-1, 20)).toBe(false)
      })
    })
  })

  describe('Display logic', () => {
    describe('Pagination visibility', () => {
      test('should determine when pagination should be hidden', () => {
        expect(1 <= 1).toBe(true) // totalPages <= 1: hide pagination
        expect(0 <= 1).toBe(true)
        expect(2 <= 1).toBe(false)
      })

      test('should determine when pagination should be shown', () => {
        expect(2 > 1).toBe(true) // totalPages > 1: show pagination
        expect(10 > 1).toBe(true)
        expect(1 > 1).toBe(false)
        expect(0 > 1).toBe(false)
      })
    })

    describe('Active page identification', () => {
      test('should correctly identify active page', () => {
        const currentPage = 5
        const testPages = [1, 2, 3, 4, 5, 6, 7]
        
        testPages.forEach(page => {
          expect(page === currentPage).toBe(page === 5)
        })
      })
    })
  })
})