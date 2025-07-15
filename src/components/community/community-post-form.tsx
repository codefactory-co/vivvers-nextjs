'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/editor/rich-text-editor'), {
  ssr: false,
})
import { TagCommandDB } from '@/components/forms/tag-command-db'
import { createPostAndRedirect } from '@/lib/actions/community'
import { CommunityPostFormData } from '@/types/community'
import { Loader2, Send } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CommunityPostFormProps {
  userId: string
}

export function CommunityPostForm({}: CommunityPostFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<CommunityPostFormData>({
    title: '',
    content: '',
    contentHtml: '',
    contentJson: '',
    tags: []
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

  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({
      ...prev,
      tags
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast({
        title: '오류',
        description: '제목을 입력해주세요.',
        variant: 'destructive'
      })
      return
    }

    if (!formData.content.trim()) {
      toast({
        title: '오류',
        description: '내용을 입력해주세요.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createPostAndRedirect(formData)
      
      if (!result.success) {
        throw new Error(result.error || '게시글 작성에 실패했습니다.')
      }

      toast({
        title: '성공',
        description: '게시글이 작성되었습니다.',
      })
      
      // Redirect is handled by createPostAndRedirect
    } catch (error) {
      console.error('Failed to create post:', error)
      toast({
        title: '오류',
        description: error instanceof Error ? error.message : '게시글 작성에 실패했습니다.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/community')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">제목 *</Label>
        <Input
          id="title"
          placeholder="게시글 제목을 입력하세요"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          disabled={isSubmitting}
          className="text-lg"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label>내용 *</Label>
        <RichTextEditor
          content={formData.contentHtml}
          onChange={handleEditorChange}
          placeholder="커뮤니티 게시글 내용을 작성하세요..."
          mode="editor-only"
          height="400px"
          imageUpload={{
            enabled: true,
            bucket: 'community-posts',
            directory: 'posts',
            maxSize: 10 * 1024 * 1024, // 10MB
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
            maxFiles: 15
          }}
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>태그</Label>
        <TagCommandDB
          selectedTags={formData.tags}
          onTagsChange={handleTagsChange}
          placeholder="관련 태그를 검색하세요 (예: React, JavaScript)"
          maxTags={10}
          type="tags"
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">
          태그를 통해 다른 사용자들이 게시글을 쉽게 찾을 수 있습니다.
        </p>
      </div>


      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              게시 중...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              게시하기
            </>
          )}
        </Button>
      </div>
    </form>
  )
}