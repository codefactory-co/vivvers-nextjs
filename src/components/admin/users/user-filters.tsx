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
import { Search, Filter, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { DateRange } from 'react-day-picker'

interface UserFilterState {
  search: string
  status: string
  role: string
  verificationStatus: string
  joinDateRange: DateRange | undefined
  lastActiveRange: DateRange | undefined
}

interface UserFiltersProps {
  filters: UserFilterState
  onFiltersChange: (filters: UserFilterState) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  isLoading?: boolean
}

const statusOptions = [
  { value: 'all', label: '전체 상태' },
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
  { value: 'suspended', label: '정지됨' },
  { value: 'banned', label: '차단됨' },
]

const roleOptions = [
  { value: 'all', label: '전체 역할' },
  { value: 'user', label: '일반 사용자' },
  { value: 'moderator', label: '모더레이터' },
  { value: 'admin', label: '관리자' },
]

const verificationOptions = [
  { value: 'all', label: '전체' },
  { value: 'verified', label: '인증됨' },
  { value: 'unverified', label: '미인증' },
  { value: 'pending', label: '인증 대기' },
]

export function UserFilters({ 
  filters, 
  onFiltersChange, 
  onApplyFilters, 
  onClearFilters, 
  isLoading = false 
}: UserFiltersProps) {
  const [isJoinDatePickerOpen, setIsJoinDatePickerOpen] = useState(false)
  const [isActivePickerOpen, setIsActivePickerOpen] = useState(false)

  const updateFilter = (key: keyof UserFilterState, value: unknown) => {
    const newFilters = { ...filters, [key]: value }
    onFiltersChange(newFilters)
  }

  const hasActiveFilters = filters.search || 
    filters.status !== 'all' || 
    filters.role !== 'all' || 
    filters.verificationStatus !== 'all' ||
    filters.joinDateRange?.from ||
    filters.lastActiveRange?.from

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return '날짜 선택'
    if (range.to) {
      return `${format(range.from, 'yy.MM.dd', { locale: ko })} - ${format(range.to, 'yy.MM.dd', { locale: ko })}`
    }
    return format(range.from, 'yy.MM.dd', { locale: ko })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* 첫 번째 줄: 검색 및 기본 필터 */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 검색 */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="사용자명, 이메일로 검색..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* 상태 필터 */}
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="w-full lg:w-40">
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
            
            {/* 역할 필터 */}
            <Select value={filters.role} onValueChange={(value) => updateFilter('role', value)}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 인증 상태 */}
            <Select value={filters.verificationStatus} onValueChange={(value) => updateFilter('verificationStatus', value)}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {verificationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 두 번째 줄: 날짜 필터 */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 가입일 필터 */}
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">가입일</label>
              <Popover open={isJoinDatePickerOpen} onOpenChange={setIsJoinDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDateRange(filters.joinDateRange)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={filters.joinDateRange}
                    onSelect={(range) => updateFilter('joinDateRange', range)}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 마지막 활동일 필터 */}
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">마지막 활동일</label>
              <Popover open={isActivePickerOpen} onOpenChange={setIsActivePickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDateRange(filters.lastActiveRange)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={filters.lastActiveRange}
                    onSelect={(range) => updateFilter('lastActiveRange', range)}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {hasActiveFilters ? '필터가 적용되었습니다' : '필터를 선택하세요'}
              </span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  활성 필터
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={onClearFilters} disabled={isLoading}>
                  필터 초기화
                </Button>
              )}
              <Button size="sm" onClick={onApplyFilters} disabled={isLoading}>
                {isLoading ? '적용 중...' : '필터 적용'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}