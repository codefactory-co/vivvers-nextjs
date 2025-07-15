'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/editor/rich-text-editor'), {
  ssr: false,
})
import { Loader2, Send, X } from 'lucide-react'
import { CommunityCommentFormData, CommunityPostComment } from '@/types/community'
import { useToast } from '@/hooks/use-toast'
import { createComment } from '@/lib/actions/community'

interface CommunityCommentFormProps {
  postId: string
  parentId?: string
  onCancel: () => void
  onCommentAdded?: (comment: CommunityPostComment) => void
}

export function CommunityCommentForm({
  postId,
  parentId,
  onCancel,
  onCommentAdded
}: CommunityCommentFormProps) {
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<CommunityCommentFormData>({
    content: '',
    contentHtml: '',
    contentJson: '',
    parentId
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEditorChange = (html: string, text: string, json: string) => {
    setFormData(prev => ({
      ...prev,
      content: text,
      contentHtml: html,
      contentJson: json
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('[DEBUG] Comment form submit:', {
      postId,
      parentId,
      hasOnCommentAdded: !!onCommentAdded,
      contentLength: formData.content.length
    })
    
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
      const result = await createComment(postId, formData)

      if (result.success && result.data) {
        console.log('[DEBUG] Comment created successfully:', {
          commentId: result.data.comment.id,
          parentId: result.data.comment.parentId,
          isReply: !!result.data.comment.parentId
        })
        
        toast({
          title: '성공',
          description: parentId ? '답글이 작성되었습니다.' : '댓글이 작성되었습니다.',
        })
        
        // For replies, refresh the page to show the new comment
        if (parentId) {
          window.location.reload()
        } else {
          // For top-level comments, use the callback if available
          if (onCommentAdded) {
            console.log('[DEBUG] Calling onCommentAdded callback')
            onCommentAdded(result.data.comment)
          }
          
          // Reset form
          setFormData({
            content: '',
            contentHtml: '',
            contentJson: '',
            parentId
          })
          
          onCancel()
        }
      } else {
        throw new Error(result.error || '댓글 작성에 실패했습니다.')
      }
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
      <RichTextEditor
        content={formData.contentHtml}
        onChange={handleEditorChange}
        placeholder={parentId ? "답글을 작성하세요..." : "댓글을 작성하세요..."}
        mode="editor-only"
        height="200px"
        // No image upload for comments
      />

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

