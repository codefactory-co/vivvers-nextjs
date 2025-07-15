'use client'

import React from 'react'
import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Heart, MessageSquare, Eye, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommunityPostCardProps } from '@/types/community'

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
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}

export const CommunityPostCard: React.FC<CommunityPostCardProps> = ({
  post,
  currentUserId,
  className
}) => {
  const isLiked = post.likes?.some(like => like.userId === currentUserId) || false
  const hasBestAnswer = post.comments?.some(comment => comment.isBestAnswer) || false

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={post.author.avatarUrl || undefined} 
                alt={post.author.username}
              />
              <AvatarFallback>
                {post.author.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">
                  {post.author.username}
                </span>
                {hasBestAnswer && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(new Date(post.createdAt))}
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <Link href={`/community/post/${post.id}`}>
          <h3 className="text-xl font-semibold mb-3 hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Content Preview */}
        <div className="text-muted-foreground mb-4 line-clamp-3">
          {post.content.substring(0, 200)}
          {post.content.length > 200 && '...'}
        </div>

        {/* Related Project */}
        {post.relatedProject && (
          <div className="mb-4">
            <Link 
              href={`/project/${post.relatedProjectId}`}
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              관련 프로젝트: {post.relatedProject.title}
            </Link>
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 5).map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.tag.name}
              </Badge>
            ))}
            {post.tags.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 5}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-6 py-4 bg-muted/30 border-t">
        <div className="flex items-center justify-between w-full">
          {/* Engagement Stats */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {/* Like Button/Count */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "p-0 h-auto text-xs hover:text-red-500",
                  isLiked && "text-red-500"
                )}
              >
                <Heart className={cn("w-4 h-4 mr-1", isLiked && "fill-current")} />
                {formatCount(post.likesCount)}
              </Button>
            </div>

            {/* Comments */}
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{formatCount(post.commentsCount)}</span>
            </div>

            {/* Views */}
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{formatCount(post.viewsCount)}</span>
            </div>
          </div>

          {/* Read More */}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/community/post/${post.id}`}>
              자세히 보기
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}