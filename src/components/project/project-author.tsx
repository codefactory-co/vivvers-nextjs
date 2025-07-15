import Image from 'next/image'
import { UserPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { ProjectAuthor } from '@/types/project'
import { cn } from '@/lib/utils'

interface ProjectAuthorProps {
  author: ProjectAuthor
  className?: string
}

export function ProjectAuthor({ author, className }: ProjectAuthorProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>작성자</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <Image
            src={author.avatarUrl || '/default-avatar.png'}
            alt={author.username}
            width={60}
            height={60}
            className="rounded-full"
          />
          <div className="flex-1 space-y-3">
            <div>
              <p className="font-semibold">{author.username}</p>
              <p className="text-sm text-muted-foreground">@{author.username}</p>
              {author.bio && (
                <p className="text-sm text-muted-foreground mt-1">{author.bio}</p>
              )}
            </div>
            <Button size="sm" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              팔로우
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}