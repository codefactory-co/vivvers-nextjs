'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, FolderOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProjectCardCompact } from '@/components/project/project-card-compact'
import { getProjectsByUserId, type GetProjectsByUserIdResult } from '@/lib/actions/project/project-user'
import { Project } from '@/types/project'
import { cn } from '@/lib/utils'

interface ProfileProjectsSectionProps {
  userId: string
  isOwner: boolean
  className?: string
}

export function ProfileProjectsSection({ userId, isOwner, className }: ProfileProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const result: GetProjectsByUserIdResult = await getProjectsByUserId(userId, {
          page: 1,
          limit: 9,
          sortBy: 'latest'
        })
        
        if (result.success && result.data) {
          setProjects(result.data.projects)
          setTotalCount(result.data.totalCount)
        } else {
          setError(result.error || '프로젝트를 불러올 수 없습니다')
        }
      } catch (err) {
        console.error('프로젝트 로딩 오류:', err)
        setError('프로젝트를 불러오는 중 오류가 발생했습니다')
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      loadProjects()
    }
  }, [userId])

  const renderEmptyState = () => {
    if (isOwner) {
      return (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">아직 프로젝트가 없습니다</h3>
          <p className="text-muted-foreground mb-6">
            첫 번째 프로젝트를 만들어서 포트폴리오를 시작해보세요
          </p>
          <Button asChild>
            <Link href="/project/new" className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              첫 프로젝트 만들기
            </Link>
          </Button>
        </div>
      )
    } else {
      return (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            아직 공개된 프로젝트가 없습니다
          </p>
        </div>
      )
    }
  }

  const renderLoadingState = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-muted rounded-lg aspect-video mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>
              {isOwner ? '내 프로젝트' : '프로젝트'} ({totalCount})
            </span>
          </CardTitle>
          {isOwner && totalCount > 0 && (
            <Button asChild variant="outline" size="sm">
              <Link href="/project/new" className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                새 프로젝트
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              다시 시도
            </Button>
          </div>
        ) : isLoading ? (
          renderLoadingState()
        ) : projects.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCardCompact
                  key={project.id}
                  project={project}
                  isOwner={isOwner}
                />
              ))}
            </div>
            
            {/* 더 많은 프로젝트가 있을 때 더보기 버튼 */}
            {totalCount > projects.length && (
              <div className="text-center mt-8">
                <Button variant="outline">
                  더 보기 ({totalCount - projects.length}개 더)
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}