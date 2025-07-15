'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import TiptapEditor from '@/components/editor/tiptap-editor'
import { Loader2, Send, X } from 'lucide-react'
import { CommunityCommentFormData } from '@/types/community'
import { useToast } from '@/hooks/use-toast'

interface CommunityCommentFormProps {
  postId: string
  parentId?: string
  onCancel: () => void
}

export function CommunityCommentForm({
  parentId,
  onCancel
}: CommunityCommentFormProps) {
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<CommunityCommentFormData>({
    content: '',
    contentHtml: '',
    contentJson: null,
    parentId
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content: content,
      contentHtml: content,
      contentJson: null
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.content.trim()) {
      toast({
        title: '오류',
        description: '댓글 내용을 입력해주세요.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Implement comment creation action
      await createCommunityComment()

      // This will be implemented when we create the comment service
      // toast({
      //   title: '성공',
      //   description: parentId ? '답글이 작성되었습니다.' : '댓글이 작성되었습니다.',
      // })
      
      // onCommentAdded(result.data!.comment)
      
      // Reset form
      setFormData({
        content: '',
        contentHtml: '',
        contentJson: null,
        parentId
      })
    } catch (error) {
      console.error('Failed to create comment:', error)
      toast({
        title: '오류',
        description: error instanceof Error ? error.message : '댓글 작성에 실패했습니다.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Editor */}
      <div className="border rounded-md">
        <TiptapEditor
          content={formData.content}
          onChange={handleEditorChange}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          size="sm"
        >
          <X className="h-4 w-4 mr-2" />
          취소
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.content.trim()}
          size="sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              작성 중...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {parentId ? '답글 작성' : '댓글 작성'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

// Placeholder function - this should be implemented as a server action
async function createCommunityComment() {
  // TODO: Implement this server action
  return {
    success: false,
    error: 'Comment creation not implemented yet'
  }
}