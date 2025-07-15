'use client'

import React from 'react'
import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Heart, MessageSquare, Eye, ArrowLeft, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { togglePostLike } from '@/lib/actions/community'
import { CommunityPost } from '@/types/community'
import { useToast } from '@/hooks/use-toast'
import { HtmlContentRenderer } from '@/components/content/html-content-renderer'

interface CommunityPostDetailProps {
  post: CommunityPost
  currentUserId?: string
}

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

export function CommunityPostDetail({ post, currentUserId }: CommunityPostDetailProps) {
  const { toast } = useToast()
  const isLiked = post.likes?.some(like => like.userId === currentUserId) || false
  const [likeCount, setLikeCount] = React.useState(post.likesCount)
  const [isLikeLoading, setIsLikeLoading] = React.useState(false)

  const handleLike = async () => {
    if (!currentUserId) {
      toast({
        title: '로그인 필요',
        description: '좋아요를 누르려면 로그인해주세요.',
        variant: 'destructive'
      })
      return
    }

    setIsLikeLoading(true)
    try {
      const result = await togglePostLike(post.id)
      if (result.success && result.data) {
        setLikeCount(result.data.likeCount)
        toast({
          title: result.data.isLiked ? '좋아요!' : '좋아요 취소',
          description: result.data.isLiked ? '게시글에 좋아요를 눌렀습니다.' : '좋아요를 취소했습니다.',
        })
      } else {
        throw new Error(result.error)
      }
    } catch {
      toast({
        title: '오류',
        description: '좋아요 처리에 실패했습니다.',
        variant: 'destructive'
      })
    } finally {
      setIsLikeLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/community" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          커뮤니티로 돌아가기
        </Link>
      </Button>

      <Card>
        <CardHeader className="pb-4">
          {/* Author Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage 
                  src={post.author.avatarUrl || undefined} 
                  alt={post.author.username}
                />
                <AvatarFallback>
                  {post.author.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {post.author.username}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatTimeAgo(new Date(post.createdAt))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{formatCount(post.viewsCount)}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mt-4">
            {post.title}
          </h1>

          {/* Related Project */}
          {post.relatedProject && (
            <div className="mt-3">
              <Link 
                href={`/project/${post.relatedProjectId}`}
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                관련 프로젝트: {post.relatedProject.title}
              </Link>
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.tag.name}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Content */}
          {post.contentHtml && post.contentHtml.trim() !== '' ? (
            <HtmlContentRenderer 
              htmlContent={post.contentHtml} 
              enableSyntaxHighlighting={true}
              className="mt-0 p-0 mb-6" // Card padding과 중복 방지
            />
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
              {post.content.split('\n')
                .map((paragraph, index) => ({ paragraph: paragraph.trim(), originalIndex: index }))
                .filter(({ paragraph }) => paragraph)
                .map(({ paragraph, originalIndex }) => (
                  <p key={originalIndex} className="mb-4 last:mb-0 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center space-x-4">
              {/* Like Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLikeLoading}
                className={cn(
                  "text-sm hover:text-red-500",
                  isLiked && "text-red-500"
                )}
              >
                <Heart className={cn("w-4 h-4 mr-2", isLiked && "fill-current")} />
                좋아요 {formatCount(likeCount)}
              </Button>

              {/* Comments Count */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                <span>댓글 {formatCount(post.commentsCount)}</span>
              </div>
            </div>

            {/* Share Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                toast({
                  title: '링크 복사됨',
                  description: '게시글 링크가 클립보드에 복사되었습니다.',
                })
              }}
            >
              공유하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}