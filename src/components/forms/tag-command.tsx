'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
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
import { 
  type TagOption, 
  type TagCategory,
  techStackCategories,
  generalTagCategories 
} from '@/lib/data/tags'
import { tagUtils } from '@/lib/validations/project'

interface TagCommandProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  type: 'techStack' | 'tags'
  className?: string
}

export function TagCommand({
  selectedTags,
  onTagsChange,
  placeholder = "태그를 검색하고 선택하세요",
  maxTags = 10,
  type,
  className
}: TagCommandProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  // 타입에 따라 적절한 카테고리 선택
  const categories: TagCategory[] = type === 'techStack' ? techStackCategories : generalTagCategories

  // 모든 태그 옵션을 평면화
  const allOptions: TagOption[] = categories.flatMap(category => category.tags)

  // 검색어로 필터링
  const filteredCategories = categories.map(category => ({
    ...category,
    tags: category.tags.filter(tag =>
      tag.label.toLowerCase().includes(search.toLowerCase()) ||
      tag.value.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(category => category.tags.length > 0)

  const handleSelect = (tagValue: string) => {
    if (selectedTags.includes(tagValue)) {
      // 이미 선택된 태그라면 제거
      onTagsChange(selectedTags.filter(tag => tag !== tagValue))
    } else if (selectedTags.length < maxTags) {
      // 태그 유효성 검사 후 추가
      const sanitizedTag = tagUtils.sanitizeTag(tagValue)
      if (sanitizedTag && tagUtils.isValidTag(sanitizedTag)) {
        onTagsChange([...selectedTags, sanitizedTag])
      }
    }
  }

  const removeTag = (tagValue: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagValue))
  }

  const getTagLabel = (tagValue: string): string => {
    const option = allOptions.find(opt => opt.value === tagValue)
    return option?.label || tagValue
  }

  const isSelected = (tagValue: string) => selectedTags.includes(tagValue)
  const isMaxReached = selectedTags.length >= maxTags

  return (
    <div className={cn("space-y-3", className)}>
      {/* 태그 선택 영역 */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={isMaxReached}
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
              <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
              {filteredCategories.map((category) => (
                <CommandGroup key={category.name} heading={category.name}>
                  {category.tags.map((tag) => (
                    <CommandItem
                      key={tag.value}
                      value={tag.value}
                      onSelect={() => handleSelect(tag.value)}
                      disabled={!isSelected(tag.value) && isMaxReached}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected(tag.value) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div>
                          <div className="font-medium">{tag.label}</div>
                          {tag.description && (
                            <div className="text-xs text-muted-foreground">
                              {tag.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
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
            {selectedTags.map((tagValue) => (
              <Badge
                key={tagValue}
                variant="secondary"
                className="px-2 py-1"
              >
                {getTagLabel(tagValue)}
                <button
                  type="button"
                  onClick={() => removeTag(tagValue)}
                  className="ml-1 hover:text-destructive focus:text-destructive"
                  aria-label={`${getTagLabel(tagValue)} 제거`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 추천 태그 (선택사항) */}
      {selectedTags.length === 0 && type === 'techStack' && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">인기 기술 스택</div>
          <div className="flex flex-wrap gap-2">
            {['react', 'nextjs', 'typescript', 'tailwindcss', 'nodejs'].map((popularTag) => {
              const option = allOptions.find(opt => opt.value === popularTag)
              return option ? (
                <Button
                  key={popularTag}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelect(popularTag)}
                  className="h-7 text-xs"
                >
                  {option.label}
                </Button>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}