import Image from 'next/image'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User } from '@/types/project'
import { cn } from '@/lib/utils'

interface ProjectAuthorProps {
  author: User
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
          <Link href={`/profile/${author.username}`}>
            <Image
              src={author.avatar}
              alt={author.name}
              width={60}
              height={60}
              className="rounded-full hover:opacity-80 transition-opacity"
            />
          </Link>
          <div className="flex-1 space-y-3">
            <div>
              <Link 
                href={`/profile/${author.username}`}
                className="font-semibold hover:underline"
              >
                {author.name}
              </Link>
              <p className="text-sm text-muted-foreground">@{author.username}</p>
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