'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Eye, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Project } from '@/types/project'
import { cn } from '@/lib/utils'

interface ProjectCardCompactProps {
  project: Project
  isOwner?: boolean
  className?: string
}

export function ProjectCardCompact({ project, isOwner = false, className }: ProjectCardCompactProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className={cn("group overflow-hidden hover:shadow-lg transition-all duration-300", className)}>
      <Link href={`/project/${project.id}`}>
        {/* 프로젝트 이미지 */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={project.images[0] || '/placeholder.jpg'}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* 카테고리 배지 */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs font-medium">
              {project.category}
            </Badge>
          </div>
          
          {/* 소유자 표시 (본인 프로젝트인 경우) */}
          {isOwner && (
            <div className="absolute top-2 right-2">
              <Badge variant="default" className="text-xs">
                내 프로젝트
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* 제목 */}
          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          
          {/* 설명 */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {project.excerpt}
          </p>
          
          {/* 태그 */}
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
          
          {/* 통계 정보 */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{project.likeCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{project.viewCount}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(project.createdAt)}</span>
            </div>
          </div>
          
          {/* 작성자 정보 (타인 프로젝트 표시 시에만) */}
          {!isOwner && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Avatar className="h-6 w-6">
                <AvatarImage src={project.author.avatarUrl || undefined} alt={project.author.username} />
                <AvatarFallback className="text-xs">
                  {project.author.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {project.author.username}
              </span>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}