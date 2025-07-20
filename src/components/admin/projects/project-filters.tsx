'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Search, Filter, Calendar as CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { DateRange } from 'react-day-picker'

interface FilterState {
  search: string
  status: string
  category: string
  dateRange: DateRange | undefined
  tags: string[]
}

const statusOptions = [
  { value: 'all', label: '전체 상태' },
  { value: 'approved', label: '승인됨' },
  { value: 'pending', label: '승인 대기' },
  { value: 'rejected', label: '거부됨' },
  { value: 'reported', label: '신고됨' },
]

const categoryOptions = [
  { value: 'all', label: '전체 카테고리' },
  { value: 'web', label: '웹 개발' },
  { value: 'mobile', label: '모바일 앱' },
  { value: 'desktop', label: '데스크톱 앱' },
  { value: 'game', label: '게임' },
  { value: 'ai', label: 'AI/ML' },
  { value: 'blockchain', label: '블록체인' },
]

const popularTags = ['React', 'Vue', 'Angular', 'TypeScript', 'Node.js', 'Python', 'Java', 'Go']

export function ProjectFilters() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    category: 'all',
    dateRange: undefined,
    tags: []
  })

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const updateFilter = (key: keyof FilterState, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      updateFilter('tags', [...filters.tags, tag])
    }
  }

  const removeTag = (tag: string) => {
    updateFilter('tags', filters.tags.filter(t => t !== tag))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      category: 'all',
      dateRange: undefined,
      tags: []
    })
  }

  const hasActiveFilters = filters.search || 
    filters.status !== 'all' || 
    filters.category !== 'all' || 
    filters.dateRange?.from || 
    filters.tags.length > 0

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* 검색 및 기본 필터 */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 검색 */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="프로젝트명, 작성자, 태그로 검색..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* 상태 필터 */}
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* 카테고리 필터 */}
            <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* 날짜 범위 */}
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full lg:w-64 justify-start gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      `${format(filters.dateRange.from, 'yy.MM.dd', { locale: ko })} - ${format(filters.dateRange.to, 'yy.MM.dd', { locale: ko })}`
                    ) : (
                      format(filters.dateRange.from, 'yy.MM.dd', { locale: ko })
                    )
                  ) : (
                    '날짜 선택'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={filters.dateRange}
                  onSelect={(range) => updateFilter('dateRange', range)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* 태그 필터 */}
          <div className="space-y-2">
            <div className="text-sm font-medium">인기 태그</div>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => filters.tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* 선택된 태그 */}
          {filters.tags.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">선택된 태그</div>
              <div className="flex flex-wrap gap-2">
                {filters.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {hasActiveFilters ? '필터가 적용되었습니다' : '필터를 선택하세요'}
              </span>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                필터 초기화
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}