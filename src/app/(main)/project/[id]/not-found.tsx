import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Home } from 'lucide-react'
import Link from 'next/link'

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">프로젝트를 찾을 수 없습니다</CardTitle>
            <CardDescription>
              요청하신 프로젝트가 존재하지 않거나 삭제되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                다른 프로젝트를 확인해보세요.
              </p>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    홈으로 돌아가기
                  </Link>
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
            
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                프로젝트가 삭제되었다고 생각되시나요?
              </p>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                문의하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}