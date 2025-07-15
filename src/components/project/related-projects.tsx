import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Heart } from 'lucide-react'
import { Project } from '@/types/project'
import { cn } from '@/lib/utils'

interface RelatedProjectsProps {
  projects: Project[]
  className?: string
}

function RelatedProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/project/${project.id}`} className="block group">
      <div className="space-y-3">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-sm leading-tight group-hover:underline line-clamp-2">
            {project.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>{project.likeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{project.viewCount}</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {project.category}
          </Badge>
        </div>
      </div>
    </Link>
  )
}

export function RelatedProjects({ projects, className }: RelatedProjectsProps) {
  if (projects.length === 0) {
    return null
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>관련 프로젝트</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
          {projects.slice(0, 4).map((project) => (
            <RelatedProjectCard key={project.id} project={project} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}