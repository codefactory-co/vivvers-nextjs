import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ProjectDescriptionProps {
  description: string
  className?: string
}

export function ProjectDescription({ description, className }: ProjectDescriptionProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>프로젝트 소개</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {description.split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                {paragraph.trim()}
              </p>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  )
}