import { ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
          {project.liveUrl && (
            <Button asChild className="w-full">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
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

        {/* 기술 스택 */}
        <div>
          <h3 className="font-semibold mb-3">기술 스택</h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
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