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
  getAllTags,
  getAllCategories,
  getTagsByCategory,
  searchTags,
  type Tag,
  type Category
} from '@/lib/data/tags'
import { tagUtils } from '@/lib/validations/project'

interface TagCommandProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  className?: string
}

export function TagCommand({
  selectedTags,
  onTagsChange,
  placeholder = "태그를 검색하고 선택하세요",
  maxTags = 10,
  className
}: TagCommandProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  // 태그 카테고리
  const categories: Category[] = getAllCategories()
  const allTags: Tag[] = getAllTags()

  // 검색어로 필터링
  const filteredTags = search 
    ? searchTags(search)
    : allTags

  const filteredCategories = categories.map(category => ({
    ...category,
    tags: filteredTags.filter(tag => tag.categoryId === category.id)
  })).filter(category => category.tags.length > 0)

  const handleSelect = (tagSlug: string) => {
    if (selectedTags.includes(tagSlug)) {
      // 이미 선택된 태그라면 제거
      onTagsChange(selectedTags.filter(tag => tag !== tagSlug))
    } else if (selectedTags.length < maxTags) {
      // 태그 유효성 검사 후 추가
      const sanitizedTag = tagUtils.sanitizeTag(tagSlug)
      if (sanitizedTag && tagUtils.isValidTag(sanitizedTag)) {
        onTagsChange([...selectedTags, sanitizedTag])
      }
    }
  }

  const removeTag = (tagSlug: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagSlug))
  }

  const getTagLabel = (tagSlug: string): string => {
    const tag = allTags.find(t => t.slug === tagSlug)
    return tag?.name || tagSlug
  }

  const isSelected = (tagSlug: string) => selectedTags.includes(tagSlug)
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
              placeholder="태그를 검색하세요..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="w-full max-h-[300px]">
              <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
              {filteredCategories.map((category) => (
                <CommandGroup key={category.name} heading={category.name}>
                  {category.tags.map((tag) => (
                    <CommandItem
                      key={tag.slug}
                      value={tag.slug}
                      onSelect={() => handleSelect(tag.slug)}
                      disabled={!isSelected(tag.slug) && isMaxReached}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected(tag.slug) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div>
                          <div className="font-medium">{tag.name}</div>
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
            선택된 태그 ({selectedTags.length}/{maxTags})
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tagSlug) => (
              <Badge
                key={tagSlug}
                variant="secondary"
                className="px-2 py-1"
              >
                {getTagLabel(tagSlug)}
                <button
                  type="button"
                  onClick={() => removeTag(tagSlug)}
                  className="ml-1 hover:text-destructive focus:text-destructive"
                  aria-label={`${getTagLabel(tagSlug)} 제거`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}