import { AdminBreadcrumb } from '@/components/admin/layout/admin-breadcrumb'
import { ProjectTable } from '@/components/admin/projects/project-table'
import { ProjectFilters } from '@/components/admin/projects/project-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FolderOpen, Filter, Download } from 'lucide-react'

export default function AdminProjectsPage() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumb />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderOpen className="h-8 w-8" />
            프로젝트 관리
          </h1>
          <p className="text-muted-foreground mt-2">
            등록된 프로젝트를 관리하고 검토합니다
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            내보내기
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            필터
          </Button>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 프로젝트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <Badge variant="secondary" className="mt-1">
              승인된 프로젝트
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              승인 대기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">45</div>
            <Badge variant="outline" className="mt-1">
              검토 필요
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              이번 주 신규
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">67</div>
            <Badge variant="outline" className="mt-1">
              +12% 증가
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              신고된 프로젝트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <Badge variant="destructive" className="mt-1">
              긴급 검토
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* 필터 */}
      <ProjectFilters />

      {/* 프로젝트 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>프로젝트 목록</CardTitle>
          <CardDescription>
            등록된 모든 프로젝트를 확인하고 관리할 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectTable />
        </CardContent>
      </Card>
    </div>
  )
}