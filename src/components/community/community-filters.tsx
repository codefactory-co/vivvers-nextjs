'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, X } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { CommunitySearchParams } from '@/types/community'

interface CommunityFiltersProps {
  searchParams: CommunitySearchParams
}

export function CommunityFilters({ searchParams }: CommunityFiltersProps) {
  const router = useRouter()
  const params = useSearchParams()
  
  const [searchValue, setSearchValue] = useState(searchParams.q || '')
  const debouncedSearch = useDebounce(searchValue, 300)

  const updateSearchParams = useCallback((updates: Partial<CommunitySearchParams>) => {
    const newParams = new URLSearchParams(params)
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== '') {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    
    // Reset to first page when filters change
    if (Object.keys(updates).some(key => key !== 'page')) {
      newParams.delete('page')
    }
    
    router.push(`/community?${newParams.toString()}`)
  }, [params, router])

  // Handle search changes
  React.useEffect(() => {
    updateSearchParams({ q: debouncedSearch })
  }, [debouncedSearch, updateSearchParams])

  const handleSortChange = (sort: string) => {
    updateSearchParams({ sort })
  }

  const clearFilters = () => {
    setSearchValue('')
    router.push('/community')
  }

  const hasActiveFilters = searchParams.q || searchParams.sort || searchParams.tags

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시글 검색..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort */}
        <Select value={searchParams.sort || 'latest'} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">최신순</SelectItem>
            <SelectItem value="popular">인기순</SelectItem>
            <SelectItem value="mostCommented">댓글 많은 순</SelectItem>
            <SelectItem value="mostViewed">조회수 순</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={clearFilters}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">활성 필터:</span>
          
          {searchParams.q && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
              검색: {searchParams.q}
            </span>
          )}
          
          {searchParams.sort && searchParams.sort !== 'latest' && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
              {searchParams.sort === 'popular' && '인기순'}
              {searchParams.sort === 'mostCommented' && '댓글 많은 순'}
              {searchParams.sort === 'mostViewed' && '조회수 순'}
            </span>
          )}
          
          {searchParams.tags && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
              태그: {searchParams.tags}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// Fix React import issue
import React from 'react'