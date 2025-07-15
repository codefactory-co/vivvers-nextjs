'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ProjectDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 에러 로깅
    console.error('프로젝트 상세 페이지 오류:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">프로젝트를 불러올 수 없습니다</CardTitle>
            <CardDescription>
              프로젝트 정보를 가져오는 중 오류가 발생했습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                잠시 후 다시 시도해주세요.
              </p>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={reset}
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  다시 시도
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="w-full"
                >
                  이전 페이지로 돌아가기
                </Button>
              </div>
            </div>
            
            {/* 개발 환경에서만 에러 상세 정보 표시 */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  에러 상세 정보 (개발 환경에서만 표시)
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                  {error.message}
                  {error.stack && (
                    <>
                      {'\n\n'}
                      {error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}