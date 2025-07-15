"use client"

import { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { CommentActions } from './comment-actions'
import { CommentForm } from './comment-form'
import { cn } from '@/lib/utils'
import { createReply } from '@/lib/actions/comment'
import type { CommentItemProps, CommentFormData, ProjectComment } from '@/types/comment'

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) return '방금 전'
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`
  if (diffInHours < 24) return `${diffInHours}시간 전`
  if (diffInDays < 7) return `${diffInDays}일 전`
  
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function CommentItem({
  comment,
  currentUserId,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onReplyCreated,
  depth = 0
}: CommentItemProps & { onReplyCreated?: (reply: ProjectComment) => void }) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  
  const isOwner = currentUserId === comment.author.id
  const maxDepth = 3 // 최대 중첩 깊이
  const isMaxDepth = depth >= maxDepth

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm)
  }

  const handleReplySubmit = async (data: CommentFormData) => {
    setIsSubmittingReply(true)
    try {
      const result = await createReply({
        content: data.content,
        parentId: comment.id
      })
      
      if (result.success && result.data) {
        setShowReplyForm(false)
        // Trigger parent component to refresh comments
        if (onReplyCreated) {
          onReplyCreated(result.data.reply)
        }
      } else {
        throw new Error(result.error || '답글 작성에 실패했습니다')
      }
    } catch (error) {
      console.error('답글 작성 실패:', error)
      // You could add toast notification here
    } finally {
      setIsSubmittingReply(false)
    }
  }

  return (
    <div className={cn(
      "space-y-3",
      depth > 0 && "ml-6 pl-4 border-l-2 border-border"
    )}>
      {/* 댓글 본문 */}
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage 
            src={comment.author.avatarUrl || undefined} 
            alt={comment.author.username}
          />
          <AvatarFallback className="text-xs">
            {comment.author.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          {/* 작성자 정보 */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-foreground">
              {comment.author.username}
            </span>
            <span className="text-muted-foreground">
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
          
          {/* 댓글 내용 */}
          <div className="text-sm text-foreground leading-relaxed">
            {comment.content}
          </div>
          
          {/* 액션 버튼들 */}
          <CommentActions
            comment={comment}
            isOwner={isOwner}
            onLike={onLike}
            onReply={handleReplyClick}
            onEdit={onEdit}
            onDelete={onDelete}
            depth={depth}
          />
        </div>
      </div>

      {/* 답글 작성 폼 */}
      {showReplyForm && !isMaxDepth && (
        <div className="ml-11">
          <CommentForm
            onSubmit={handleReplySubmit}
            isLoading={isSubmittingReply}
            placeholder={`${comment.author.username}님에게 답글 작성...`}
            parentId={comment.id}
          />
        </div>
      )}

      {/* 대댓글들 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onLike={onLike}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onReplyCreated={onReplyCreated}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* 최대 깊이 알림 */}
      {showReplyForm && isMaxDepth && (
        <div className="ml-11 text-xs text-muted-foreground bg-muted/50 rounded-md p-2">
          답글은 최대 {maxDepth}단계까지만 가능합니다.
        </div>
      )}
    </div>
  )
}