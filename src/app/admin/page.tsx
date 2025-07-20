import { AdminBreadcrumb } from '@/components/admin/layout/admin-breadcrumb'
import { StatsCards } from '@/components/admin/dashboard/stats-cards'
import { ChartWidget } from '@/components/admin/dashboard/chart-widget'
import { QuickActions, RecentReports } from '@/components/admin/dashboard/quick-actions'
import { RecentActivity } from '@/components/admin/dashboard/recent-activity'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumb />
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">대시보드</h1>
        <div className="text-sm text-muted-foreground">
          마지막 업데이트: {new Date().toLocaleString('ko-KR')}
        </div>
      </div>

      {/* 통계 카드 */}
      <StatsCards />

      {/* 차트 및 빠른 액션 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartWidget />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <RecentReports />
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <div className="space-y-6">
          {/* 시스템 상태나 추가 위젯을 여기에 배치할 수 있습니다 */}
        </div>
      </div>
    </div>
  )
}