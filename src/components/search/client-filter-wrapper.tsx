"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { FilterPanel } from "./filter-panel"
import { ProjectCategory } from "./category-filter"

interface ClientFilterWrapperProps {
  availableTags: string[]
  resultCount: number
  initialFilters: {
    category?: string
    tags?: string[]
    sortBy?: 'latest' | 'popular' | 'updated'
    search?: string
  }
}

export function ClientFilterWrapper({ 
  availableTags, 
  resultCount, 
  initialFilters 
}: ClientFilterWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateURL = useCallback((newFilters: Record<string, string | string[] | undefined>) => {
    const params = new URLSearchParams(searchParams)
    
    // Clear page when filters change
    params.delete('page')
    
    // Update each filter parameter
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        params.delete(key)
      } else if (Array.isArray(value)) {
        params.delete(key)
        value.forEach(v => params.append(key, v))
      } else {
        params.set(key, value)
      }
    })

    router.push(`?${params.toString()}`)
  }, [router, searchParams])

  const handleCategoryChange = useCallback((category: ProjectCategory | null) => {
    updateURL({ category: category || undefined })
  }, [updateURL])

  const handleTagsChange = useCallback((tags: string[]) => {
    updateURL({ tags })
  }, [updateURL])

  const handleSortChange = useCallback((sortBy: 'latest' | 'popular' | 'updated') => {
    updateURL({ sortBy })
  }, [updateURL])

  const handleSearchChange = useCallback((search: string) => {
    updateURL({ search: search || undefined })
  }, [updateURL])

  return (
    <FilterPanel
      selectedCategory={(initialFilters.category as ProjectCategory) || null}
      onCategoryChange={handleCategoryChange}
      availableTags={availableTags}
      selectedTags={initialFilters.tags || []}
      onTagsChange={handleTagsChange}
      sortBy={initialFilters.sortBy || 'latest'}
      onSortChange={handleSortChange}
      resultCount={resultCount}
      searchQuery={initialFilters.search || ''}
      onSearchChange={handleSearchChange}
    />
  )
}