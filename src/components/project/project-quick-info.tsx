import { ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectDetail } from '@/types/project'
import { cn } from '@/lib/utils'

interface ProjectQuickInfoProps {
  project: ProjectDetail
  className?: string
}

export function ProjectQuickInfo({ project, className }: ProjectQuickInfoProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>프로젝트 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 링크 버튼들 */}
        <div className="space-y-2">
          {project.demoUrl && (
            <Button asChild className="w-full">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                라이브 데모 보기
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button asChild variant="outline" className="w-full">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub 저장소
              </a>
            </Button>
          )}
        </div>


        {/* 통계 */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {project.likeCount}
            </div>
            <div className="text-sm text-muted-foreground">좋아요</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {project.viewCount.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">조회수</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}