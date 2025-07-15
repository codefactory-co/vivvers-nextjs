'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Plus } from 'lucide-react'
import { CommunityCommentList } from './community-comment-list'
import { CommunityCommentForm } from './community-comment-form'
import { CommunityPostComment } from '@/types/community'

interface CommunityCommentSectionProps {
  postId: string
  comments: CommunityPostComment[]
  currentUserId?: string
  postAuthorId: string
}

export function CommunityCommentSection({
  postId,
  comments: initialComments,
  currentUserId,
  postAuthorId
}: CommunityCommentSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [showCommentForm, setShowCommentForm] = useState(false)

  const handleCommentAdded = (newComment: CommunityPostComment) => {
    // Add the new comment to the list
    setComments(prev => [...prev, newComment])
    setShowCommentForm(false)
  }

  const handleBestAnswer = (commentId: string) => {
    // Handle best answer selection
    setComments(prev => prev.map(comment => ({
      ...comment,
      isBestAnswer: comment.id === commentId ? !comment.isBestAnswer : false
    })))
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-5 w-5" />
            댓글 ({comments.length})
          </CardTitle>
          
          {currentUserId && !showCommentForm && (
            <Button
              onClick={() => setShowCommentForm(true)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              댓글 작성
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Comment Form */}
        {showCommentForm && currentUserId && (
          <div className="p-4 bg-muted/30 rounded-lg mb-6">
            <CommunityCommentForm
              postId={postId}
              onCancel={() => setShowCommentForm(false)}
              onCommentAdded={handleCommentAdded}
            />
          </div>
        )}

        {/* Login prompt for guests */}
        {!currentUserId && comments.length === 0 && (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              댓글을 작성하려면 로그인해주세요.
            </p>
            <Button asChild>
              <a href="/signin">로그인</a>
            </Button>
          </div>
        )}

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-6">
            <CommunityCommentList
              comments={comments}
              currentUserId={currentUserId}
              postAuthorId={postAuthorId}
              onBestAnswer={currentUserId === postAuthorId ? handleBestAnswer : undefined}
            />
          </div>
        ) : (
          currentUserId && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>아직 댓글이 없습니다.</p>
              <p className="text-sm">첫 번째 댓글을 작성해보세요!</p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}