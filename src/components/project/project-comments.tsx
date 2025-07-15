'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CommentForm } from '@/components/comment/comment-form'
import { CommentList } from '@/components/comment/comment-list'
import { Comment, CommentFormData } from '@/types/comment'
import { cn, debounce } from '@/lib/utils'
import { getComments, createComment, createReply } from '@/lib/actions/comment'
import { toggleCommentLike } from '@/lib/actions/comment/comment-like'
import { useToast } from '@/hooks/use-toast'

interface ProjectCommentsProps {
  projectId: string
  initialComments?: Comment[]
  className?: string
}

export function ProjectComments({ 
  projectId, 
  initialComments = [], 
  className 
}: ProjectCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [likingComments, setLikingComments] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const loadComments = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getComments({
        projectId,
        page: 1,
        limit: 20,
        sortBy: 'latest'
      })
      
      if (result.success && result.data) {
        setComments(result.data.comments || [])
      } else {
        setComments(initialComments)
      }
    } catch (error) {
      console.error('댓글 로드 실패:', error)
      setComments(initialComments)
    } finally {
      setIsLoading(false)
    }
  }, [projectId, initialComments])

  // 컴포넌트 마운트시 최신 댓글 로드
  useEffect(() => {
    loadComments()
  }, [projectId, initialComments, loadComments])

  const handleCommentSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true)
    try {
      // Handle top-level comments
      if (!data.parentId) {
        const result = await createComment({
          projectId,
          content: data.content
        })
        
        if (result.success && result.data) {
          // 새 댓글을 목록 상단에 추가
          setComments(prev => [result.data!, ...prev])
        } else {
          throw new Error(result.error || '댓글 작성에 실패했습니다')
        }
      } else {
        // Handle replies (this shouldn't happen from main form, but just in case)
        const result = await createReply({
          content: data.content,
          parentId: data.parentId
        })
        
        if (result.success && result.data) {
          // Refresh comments to show the new reply
          await loadComments()
        } else {
          throw new Error(result.error || '답글 작성에 실패했습니다')
        }
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReplyCreated = async (reply: Comment) => {
    // Optimistically update the comments structure
    setComments(prev => {
      const updateCommentReplies = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === reply.parentId) {
            // Found the parent comment, add the reply
            return {
              ...comment,
              replies: [...(comment.replies || []), reply],
              repliesCount: comment.repliesCount + 1
            }
          } else if (comment.replies && comment.replies.length > 0) {
            // Recursively check nested replies
            return {
              ...comment,
              replies: updateCommentReplies(comment.replies)
            }
          }
          return comment
        })
      }
      
      return updateCommentReplies(prev)
    })
  }


  // Simplified comment like handler with server call + refresh
  const handleCommentLike = useCallback(async (commentId: string) => {
    // Prevent multiple likes on same comment
    if (likingComments.has(commentId)) {
      return
    }

    // Add to liking set to prevent double-clicks
    setLikingComments(prev => new Set([...prev, commentId]))

    try {
      const result = await toggleCommentLike({ commentId })
      
      if (result.success) {
        // Refresh comments to get updated like status
        await loadComments()
      } else {
        toast({
          title: "좋아요 실패",
          description: result.error || "좋아요 처리 중 오류가 발생했습니다.",
          variant: "destructive"
        })
      }
    } catch {
      toast({
        title: "네트워크 오류",
        description: "인터넷 연결을 확인하고 다시 시도해주세요.",
        variant: "destructive"
      })
    } finally {
      // Remove from liking set
      setLikingComments(prev => {
        const newSet = new Set(prev)
        newSet.delete(commentId)
        return newSet
      })
    }
  }, [loadComments, toast, likingComments])

  // Debounced like handler to prevent rapid clicking
  const debouncedLikeHandler = useRef(
    debounce(handleCommentLike, 300)
  ).current

  const handleLoadMore = () => {
    // Mock load more functionality
    console.log('Load more comments...')
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          댓글 ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 댓글 작성 폼 */}
        <CommentForm 
          onSubmit={handleCommentSubmit}
          isLoading={isSubmitting}
        />
        
        <Separator />
        
        {/* 댓글 목록 */}
        <CommentList 
          comments={comments}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          hasMore={false}
          onReplyCreated={handleReplyCreated}
          onLike={debouncedLikeHandler}
        />
      </CardContent>
    </Card>
  )
}