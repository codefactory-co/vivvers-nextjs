import { AdminBreadcrumb } from '@/components/admin/layout/admin-breadcrumb'
import { UserTable } from '@/components/admin/users/user-table'
import { UserFilters } from '@/components/admin/users/user-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Download, Filter } from 'lucide-react'
import { getUserStatsAction } from '@/lib/actions/admin/user-stats'
import { getUsersAction } from '@/lib/actions/admin/users'

export default async function AdminUsersPage() {
  // 사용자 통계 데이터 가져오기
  const statsResult = await getUserStatsAction()
  const stats = statsResult.success ? statsResult.data : null
  
  // 초기 사용자 목록 가져오기
  const usersResult = await getUsersAction({})
  const users = usersResult.success && usersResult.data ? usersResult.data : []
  
  return (
    <div className="space-y-6">
      <AdminBreadcrumb />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            사용자 관리
          </h1>
          <p className="text-muted-foreground mt-2">
            플랫폼 사용자를 관리하고 모니터링합니다
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            사용자 내보내기
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            고급 필터
          </Button>
        </div>
      </div>

      {/* 사용자 통계 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 사용자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString() || '0'}</div>
            <Badge variant="secondary" className="mt-1">
              총 사용자
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              월간 활성 사용자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.monthlyActiveUsers.toLocaleString() || '0'}</div>
            <Badge variant="outline" className="mt-1">
              월간 활성
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              신규 가입자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.newUsersThisWeek.toLocaleString() || '0'}</div>
            <Badge variant="outline" className="mt-1">
              이번 주
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              정지된 사용자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.suspendedUsers.toLocaleString() || '0'}</div>
            <Badge variant="destructive" className="mt-1">
              정지된 계정
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* 필터 */}
      <UserFilters />

      {/* 사용자 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>사용자 목록</CardTitle>
          <CardDescription>
            등록된 모든 사용자를 확인하고 관리할 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable initialUsers={users} />
        </CardContent>
      </Card>
    </div>
  )
}