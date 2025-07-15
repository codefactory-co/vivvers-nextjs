'use client'

import React from 'react'
import { PaginationProps } from '@/types/project'
import { cn } from '@/lib/utils'

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
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

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) {
    return null
  }

  return (
    <nav
      className={cn('flex items-center justify-center space-x-2', className)}
      aria-label="Pagination Navigation"
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
          'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
        )}
        aria-label="Go to previous page"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-sm text-muted-foreground"
              >
                ...
              </span>
            )
          }

          const isActive = pageNumber === currentPage

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber as number)}
              className={cn(
                'flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors',
                'border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-accent hover:text-accent-foreground'
              )}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          'flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
          'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
        )}
        aria-label="Go to next page"
      >
        Next
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Page Info */}
      <div className="hidden sm:flex items-center text-sm text-muted-foreground ml-4">
        Page {currentPage} of {totalPages}
      </div>
    </nav>
  )
}