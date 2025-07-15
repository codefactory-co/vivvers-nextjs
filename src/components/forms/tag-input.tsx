'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X, AlertCircle, CheckCircle } from 'lucide-react'
import { tagUtils } from '@/lib/validations/project'

interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  disabled?: boolean
}

export function TagInput({ tags, onTagsChange, placeholder = "태그를 입력하세요", maxTags = 10, disabled = false }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validateAndSuggest = (value: string) => {
    if (!value.trim()) {
      setValidationMessage(null)
      setIsValid(null)
      return
    }

    const isValidTag = tagUtils.isValidTag(value)
    const suggestion = tagUtils.suggestTag(value)

    if (isValidTag) {
      setValidationMessage(null)
      setIsValid(true)
    } else if (suggestion && suggestion !== value) {
      setValidationMessage(`"${suggestion}" 으로 변경됩니다`)
      setIsValid(false)
    } else if (!suggestion) {
      setValidationMessage('유효하지 않은 태그입니다')
      setIsValid(false)
    } else {
      setValidationMessage('태그는 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다')
      setIsValid(false)
    }
  }

  const addTag = (tagValue: string) => {
    const suggestion = tagUtils.suggestTag(tagValue)
    if (suggestion && !tags.includes(suggestion) && tags.length < maxTags) {
      onTagsChange([...tags, suggestion])
      return true
    }
    return false
  }

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(inputValue)
      setInputValue('')
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.includes(',')) {
      const newTags = value.split(',').map(tag => tag.trim()).filter(Boolean)
      newTags.forEach(tag => addTag(tag))
      setInputValue('')
    } else {
      setInputValue(value)
    }
  }

  return (
    <div className="space-y-2">
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length >= maxTags ? `최대 ${maxTags}개까지 입력 가능` : placeholder}
        disabled={disabled || tags.length >= maxTags}
      />
      
      <div className="text-xs text-muted-foreground">
        Enter, 쉼표(,)로 태그를 추가할 수 있습니다 ({tags.length}/{maxTags})
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={tag} variant="secondary" className="px-2 py-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}