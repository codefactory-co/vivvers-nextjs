/**
 * Pagination utilities extracted from components for better testability
 */

/**
 * Generate page numbers for pagination display
 * @param currentPage Current active page (1-indexed)
 * @param totalPages Total number of pages
 * @param maxVisiblePages Maximum number of visible page buttons
 * @returns Array of page numbers and ellipsis markers
 */
export function generatePageNumbers(
  currentPage: number, 
  totalPages: number, 
  maxVisiblePages: number = 7
): (number | string)[] {
  const pageNumbers: (number | string)[] = []

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

/**
 * Check if pagination should be displayed
 */
export function shouldShowPagination(totalPages: number): boolean {
  return totalPages > 1
}

/**
 * Check if previous button should be disabled
 */
export function isPreviousDisabled(currentPage: number): boolean {
  return currentPage <= 1
}

/**
 * Check if next button should be disabled
 */
export function isNextDisabled(currentPage: number, totalPages: number): boolean {
  return currentPage >= totalPages
}

/**
 * Get the next page number (clamped to valid range)
 */
export function getNextPage(currentPage: number, totalPages: number): number {
  // Handle invalid current page
  if (currentPage < 1) {
    return 1
  }
  return Math.min(currentPage + 1, totalPages)
}

/**
 * Get the previous page number (clamped to valid range)
 */
export function getPreviousPage(currentPage: number): number {
  return Math.max(currentPage - 1, 1)
}