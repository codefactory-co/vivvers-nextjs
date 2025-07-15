import Image from 'next/image'
import { Calendar, Eye, Heart, ExternalLink, Github } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { ProjectDetail } from '@/types/project'
import { cn } from '@/lib/utils'

interface ProjectInfoHeaderProps {
  project: ProjectDetail
  className?: string
}

export function ProjectInfoHeader({ project, className }: ProjectInfoHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className={cn("bg-background border-b", className)}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* 프로젝트 썸네일/로고 */}
          <div className="w-full lg:w-48 xl:w-56">
            <div className="aspect-video relative overflow-hidden rounded-lg bg-muted shadow-sm">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 224px"
              />
            </div>
          </div>

          {/* 프로젝트 정보 */}
          <div className="flex-1 space-y-4">
            {/* 제목과 좋아요 버튼 */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex-1">
                {project.title}
              </h1>
              <Button variant="outline" size="sm" className="flex items-center gap-2 flex-shrink-0">
                <Heart className="h-4 w-4" />
                <span>{project.likeCount}</span>
              </Button>
            </div>

            {/* 짧은 설명 */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {project.description}
            </p>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-medium">
                {project.category}
              </Badge>
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* 통계 정보 */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{project.viewCount.toLocaleString()} 조회</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{project.likeCount} 좋아요</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(project.uploadDate)}</span>
              </div>
            </div>

            {/* 작성자 정보와 버튼들 */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <Avatar
                  src={project.author.avatar}
                  alt={project.author.name}
                  name={project.author.name}
                  size="md"
                />
                <div>
                  <p className="font-medium">{project.author.name}</p>
                  <p className="text-sm text-muted-foreground">@{project.author.username}</p>
                </div>
              </div>
              
              {/* 액션 버튼들 */}
              <div className="flex items-center gap-2">
                {project.liveUrl && (
                  <Button asChild size="sm">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      보러가기
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button asChild variant="outline" size="sm">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}