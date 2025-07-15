"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Send } from 'lucide-react'
import type { CommentFormProps, CommentFormData } from '@/types/comment'

export function CommentForm({ 
  onSubmit, 
  isLoading = false, 
  placeholder = "댓글을 입력하세요...",
  parentId 
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const maxLength = 500
  const remainingChars = maxLength - content.length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      const formData: CommentFormData = { 
        content: content.trim(),
        parentId 
      }
      await onSubmit(formData)
      setContent('')
    } catch (error) {
      console.error('댓글 작성 실패:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isDisabled = !content.trim() || isSubmitting || isLoading || remainingChars < 0

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "min-h-[80px] resize-none pr-4",
            remainingChars < 0 && "border-destructive focus-visible:ring-destructive"
          )}
          disabled={isLoading}
          maxLength={maxLength + 50} // 약간의 여유를 둠
        />
        <div className={cn(
          "absolute bottom-2 right-2 text-xs",
          remainingChars < 0 ? "text-destructive" : 
          remainingChars < 50 ? "text-orange-500" : "text-muted-foreground"
        )}>
          {remainingChars}자 남음
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isDisabled}
          className={cn(
            "gap-2",
            parentId ? "h-8 px-3 text-xs" : "h-9 px-4"
          )}
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {parentId ? "답글 작성 중..." : "댓글 작성 중..."}
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {parentId ? "답글 작성" : "댓글 작성"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}