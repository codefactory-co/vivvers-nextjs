import Link from 'next/link'
import { AlertTriangle, Home } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            접근 권한이 없습니다
          </h1>
          <p className="text-muted-foreground">
            이 페이지에 접근하려면 관리자 권한이 필요합니다.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Home className="h-4 w-4" />
            홈으로 돌아가기
          </Link>
          
          <div className="text-sm text-muted-foreground">
            관리자 권한이 필요하다면 시스템 관리자에게 문의하세요.
          </div>
        </div>
      </div>
    </div>
  )
}