'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HtmlContentRenderer } from '@/components/content/html-content-renderer'
import { cn } from '@/lib/utils'

interface ProjectDescriptionProps {
  description: string
  descriptionHtml?: string
  className?: string
}

export function ProjectDescription({ description, descriptionHtml, className }: ProjectDescriptionProps) {
  const hasHtmlContent = descriptionHtml && descriptionHtml.trim() !== ''

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>프로젝트 소개</CardTitle>
      </CardHeader>
      <CardContent>
        {hasHtmlContent ? (
          // HTML 렌더링 (TipTap 스타일과 동일)
          <HtmlContentRenderer 
            htmlContent={descriptionHtml} 
            enableSyntaxHighlighting={true}
            className="mt-0 p-0" // Card padding과 중복 방지
          />
        ) : (
          // 플레인 텍스트 렌더링 (기존 방식)
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {description.split('\n')
              .map((paragraph, index) => ({ paragraph: paragraph.trim(), originalIndex: index }))
              .filter(({ paragraph }) => paragraph)
              .map(({ paragraph, originalIndex }) => (
                <p key={originalIndex} className="mb-4 last:mb-0 leading-relaxed">
                  {paragraph}
                </p>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}