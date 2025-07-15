"use client"

import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { CommentItem } from './comment-item'
import { CommentListSkeleton } from './comment-list-skeleton'
import { MessageCircle, ChevronDown } from 'lucide-react'
import type { CommentListProps, ProjectComment } from '@/types/comment'

interface ExtendedCommentListProps extends CommentListProps {
  onReplyCreated?: (reply: ProjectComment) => void
  onLike?: (commentId: string) => Promise<void> | void
}

export function CommentList({
  comments,
  isLoading = false,
  onLoadMore,
  hasMore = false,
  onReplyCreated,
  onLike
}: ExtendedCommentListProps) {
  // Mock current user ID for demo
  const currentUserId = "user-1"

  const handleLike = (commentId: string) => {
    if (onLike) {
      onLike(commentId)
    } else {
      console.log('좋아요:', commentId)
    }
  }

  const handleReply = (commentId: string) => {
    console.log('답글:', commentId)
  }

  const handleEdit = (commentId: string) => {
    console.log('수정:', commentId)
  }

  const handleDelete = (commentId: string) => {
    console.log('삭제:', commentId)
  }

  if (isLoading && comments.length === 0) {
    return <CommentListSkeleton />
  }

  if (!isLoading && comments.length === 0) {
    return (
      <EmptyState
        icon={<MessageCircle className="h-8 w-8" />}
        title="아직 댓글이 없습니다"
        description="첫 번째 댓글을 작성해보세요!"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* 댓글 목록 */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
            onLike={handleLike}
            onReply={handleReply}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReplyCreated={onReplyCreated}
          />
        ))}
      </div>

      {/* 더 보기 버튼 */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                로딩 중...
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                댓글 더 보기
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}