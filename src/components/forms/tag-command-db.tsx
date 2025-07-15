'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { searchTags, getPopularTags } from '@/lib/actions/tag'
import { useDebounce } from '@/hooks/use-debounce'
import { tagUtils } from '@/lib/validations/project'

interface TagCommandDBProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  type: 'techStack' | 'tags'
  className?: string
  disabled?: boolean
}

interface TagData {
  id: string
  name: string
  usageCount: number
}

export function TagCommandDB({
  selectedTags,
  onTagsChange,
  placeholder = "태그를 검색하고 선택하세요",
  maxTags = 10,
  type,
  className,
  disabled = false
}: TagCommandDBProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [tags, setTags] = useState<TagData[]>([])
  const [popularTags, setPopularTags] = useState<TagData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPopular, setIsLoadingPopular] = useState(false)
  
  const debouncedSearch = useDebounce(search, 300)

  // 인기 태그 로드
  useEffect(() => {
    const loadPopularTags = async () => {
      if (popularTags.length === 0) {
        setIsLoadingPopular(true)
        try {
          const result = await getPopularTags(5)
          if (result.success && result.data) {
            setPopularTags(result.data)
          }
        } catch (error) {
          console.error('인기 태그 로드 실패:', error)
        } finally {
          setIsLoadingPopular(false)
        }
      }
    }
    
    if (open && popularTags.length === 0) {
      loadPopularTags()
    }
  }, [open, popularTags.length])

  // 디바운스된 검색어로 태그 검색
  useEffect(() => {
    const searchTagsFromDB = async (query: string) => {
      if (!query.trim()) {
        setTags([])
        return
      }

      setIsLoading(true)
      try {
        const result = await searchTags({ 
          query: query.trim(), 
          limit: 20,
          offset: 0 
        })
        
        if (result.success && result.data) {
          setTags(result.data.tags)
        }
      } catch (error) {
        console.error('태그 검색 실패:', error)
        setTags([])
      } finally {
        setIsLoading(false)
      }
    }

    searchTagsFromDB(debouncedSearch)
  }, [debouncedSearch])

  const handleSelect = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      // 이미 선택된 태그라면 제거
      onTagsChange(selectedTags.filter(tag => tag !== tagName))
    } else if (selectedTags.length < maxTags) {
      // 태그 유효성 검사 후 추가
      const sanitizedTag = tagUtils.sanitizeTag(tagName)
      if (sanitizedTag && tagUtils.isValidTag(sanitizedTag)) {
        onTagsChange([...selectedTags, sanitizedTag])
      }
    }
    // 태그 선택 후 팝오버 닫기 및 검색 초기화
    setOpen(false)
    setSearch('')
  }

  const removeTag = (tagName: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagName))
  }

  const isSelected = (tagName: string) => selectedTags.includes(tagName)
  const isMaxReached = selectedTags.length >= maxTags

  // 검색 결과와 인기 태그를 합친 표시용 태그 목록
  const displayTags = search.trim() ? tags : popularTags

  return (
    <div className={cn("space-y-3", className)}>
      {/* 태그 선택 영역 */}
      <Popover open={open} onOpenChange={(newOpen) => {
        setOpen(newOpen)
        // 팝오버가 닫힐 때 검색 초기화
        if (!newOpen) {
          setSearch('')
        }
      }}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled || isMaxReached}
          >
            <span className="truncate">
              {isMaxReached 
                ? `최대 ${maxTags}개 선택됨`
                : placeholder
              }
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 min-w-[300px] max-w-[600px]" 
          align="start"
          style={{ 
            width: 'var(--radix-popover-trigger-width, 100%)',
            maxWidth: '90vw'
          }}
        >
          <Command className="w-full">
            <CommandInput 
              placeholder={`${type === 'techStack' ? '기술 스택' : '태그'}을 검색하세요...`}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="w-full max-h-[300px]">
              {isLoading || isLoadingPopular ? (
                <div className="py-6 text-center text-sm">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                  검색 중...
                </div>
              ) : displayTags.length === 0 && search.trim() ? (
                <CommandGroup>
                  <CommandItem
                    value={search.trim()}
                    onSelect={() => handleSelect(search.trim())}
                    disabled={!isSelected(search.trim()) && isMaxReached}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected(search.trim()) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div>
                        <div className="font-medium">{search.trim()}</div>
                        <div className="text-xs text-muted-foreground">
                          0개 프로젝트에서 사용
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                </CommandGroup>
              ) : displayTags.length === 0 ? (
                <CommandEmpty>
                  태그가 없습니다.
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {displayTags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.name}
                      onSelect={() => handleSelect(tag.name)}
                      disabled={!isSelected(tag.name) && isMaxReached}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected(tag.name) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div>
                          <div className="font-medium">{tag.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {tag.usageCount}개 프로젝트에서 사용
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* 선택된 태그 표시 */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            선택된 {type === 'techStack' ? '기술 스택' : '태그'} ({selectedTags.length}/{maxTags})
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tagName) => (
              <Badge
                key={tagName}
                variant="secondary"
                className="px-2 py-1"
              >
                {tagName}
                <button
                  type="button"
                  onClick={() => removeTag(tagName)}
                  className="ml-1 hover:text-destructive focus:text-destructive"
                  aria-label={`${tagName} 제거`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 추천 태그 (선택사항) */}
      {selectedTags.length === 0 && type === 'techStack' && !search.trim() && popularTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {popularTags.slice(0, 5).map((tag) => (
              <Button
                key={tag.id}
                variant="outline"
                size="sm"
                onClick={() => handleSelect(tag.name)}
                className="h-7 text-xs"
                disabled={isMaxReached}
              >
                {tag.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}