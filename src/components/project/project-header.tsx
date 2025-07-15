import { Heart, Share, Bookmark, Eye, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProjectDetail } from '@/types/project'
import { cn } from '@/lib/utils'

interface ProjectHeaderProps {
  project: ProjectDetail
  className?: string
}

export function ProjectHeader({ project, className }: ProjectHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{project.category}</Badge>
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Heart className="mr-2 h-4 w-4" />
            {project.likeCount}
          </Button>
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>{project.viewCount.toLocaleString()} 조회</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(project.uploadDate)}</span>
        </div>
      </div>
    </div>
  )
}