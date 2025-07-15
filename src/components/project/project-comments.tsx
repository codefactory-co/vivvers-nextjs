import { Heart, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar } from '@/components/ui/avatar'
import { Comment } from '@/types/project'
import { cn } from '@/lib/utils'

interface ProjectCommentsProps {
  comments: Comment[]
  className?: string
}

function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={cn("space-y-3", isReply && "ml-8 border-l-2 border-muted pl-4")}>
      <div className="flex items-start gap-3">
        <Avatar
          src={comment.author.avatar}
          alt={comment.author.name}
          name={comment.author.name}
          size="md"
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">@{comment.author.username}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-sm leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
              <Heart className="mr-1 h-3 w-3" />
              {comment.likeCount > 0 && <span className="text-xs">{comment.likeCount}</span>}
            </Button>
            {!isReply && (
              <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                <MessageCircle className="mr-1 h-3 w-3" />
                <span className="text-xs">답글</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3 mt-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  )
}

export function ProjectComments({ comments, className }: ProjectCommentsProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>댓글 {comments.length > 0 && `(${comments.length})`}</CardTitle>
      </CardHeader>
      <CardContent>
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>아직 댓글이 없습니다.</p>
            <p className="text-sm">첫 번째 댓글을 남겨보세요!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment, index) => (
              <div key={comment.id}>
                <CommentItem comment={comment} />
                {index < comments.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}