import Link from 'next/link'
import { Calendar, Eye, Heart, ExternalLink, Github, Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ShareButton } from '@/components/ui/share-button'
import { ProjectLikeButton } from '@/components/project/project-like-button'
import { ProjectDetail } from '@/types/project'
import { cn } from '@/lib/utils'

interface ProjectInfoHeaderProps {
  project: ProjectDetail
  currentUserId?: string
  initialIsLiked?: boolean
  className?: string
}

export function ProjectInfoHeader({ project, currentUserId, initialIsLiked = false, className }: ProjectInfoHeaderProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isOwner = currentUserId === project.author.id

  return (
    <div className={cn("bg-background border-b", className)}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* 프로젝트 정보 */}
          <div className="space-y-4">
            {/* 제목과 좋아요 버튼 */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex-1">
                {project.title}
              </h1>
              <ProjectLikeButton
                projectId={project.id}
                initialIsLiked={initialIsLiked}
                initialLikeCount={project.likeCount}
                currentUserId={currentUserId}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              />
            </div>

            {/* 짧은 설명 */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {project.excerpt}
            </p>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-medium">
                {project.category}
              </Badge>
              {project.tags?.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
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
                <span>{formatDate(project.createdAt)}</span>
              </div>
            </div>

            {/* 작성자 정보와 버튼들 */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={project.author.avatarUrl || undefined} alt={project.author.username} />
                  <AvatarFallback>
                    {project.author.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{project.author.username}</p>
                  <p className="text-sm text-muted-foreground">@{project.author.username}</p>
                </div>
              </div>
              
              {/* 액션 버튼들 */}
              <div className="flex items-center gap-2">
                {isOwner && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/project/edit/${project.id}`} className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      수정
                    </Link>
                  </Button>
                )}
                {project.demoUrl && (
                  <Button asChild size="sm">
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
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
                <ShareButton
                  url={`/project/${project.id}`}
                  title={project.title}
                  description={project.excerpt}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}