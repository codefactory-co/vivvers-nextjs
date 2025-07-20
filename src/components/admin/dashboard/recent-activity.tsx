'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, CheckCircle, XCircle, UserPlus, AlertTriangle, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityItem {
  id: string
  type: 'approval' | 'rejection' | 'signup' | 'report' | 'system'
  title: string
  description: string
  timestamp: string
  user?: string
}

const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'approval',
    title: '프로젝트 승인',
    description: 'React 포트폴리오 사이트가 승인되었습니다',
    timestamp: '5분 전',
    user: 'vivvers'
  },
  {
    id: '2',
    type: 'signup',
    title: '신규 사용자',
    description: 'developer123님이 가입했습니다',
    timestamp: '12분 전',
    user: 'developer123'
  },
  {
    id: '3',
    type: 'rejection',
    title: '프로젝트 거부',
    description: '부적절한 콘텐츠로 인해 거부되었습니다',
    timestamp: '25분 전',
    user: 'test_user'
  },
  {
    id: '4',
    type: 'report',
    title: '신고 접수',
    description: '스팸 댓글에 대한 신고가 접수되었습니다',
    timestamp: '1시간 전',
    user: 'reporter'
  },
  {
    id: '5',
    type: 'system',
    title: '시스템 업데이트',
    description: '서버 점검이 완료되었습니다',
    timestamp: '2시간 전'
  },
  {
    id: '6',
    type: 'approval',
    title: '프로젝트 승인',
    description: 'Vue.js 쇼핑몰이 승인되었습니다',
    timestamp: '3시간 전',
    user: 'vue_dev'
  },
]

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'approval':
      return CheckCircle
    case 'rejection':
      return XCircle
    case 'signup':
      return UserPlus
    case 'report':
      return AlertTriangle
    case 'system':
      return Settings
    default:
      return Activity
  }
}

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'approval':
      return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
    case 'rejection':
      return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
    case 'signup':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
    case 'report':
      return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400'
    case 'system':
      return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400'
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          최근 활동
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type)
            const colorClass = getActivityColor(activity.type)
            
            return (
              <div key={activity.id} className="relative">
                {index < activities.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
                )}
                
                <div className="flex gap-3">
                  <div className={cn('h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0', colorClass)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    
                    {activity.user && (
                      <Badge variant="outline" className="text-xs">
                        @{activity.user}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t text-center">
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            모든 활동 보기
          </button>
        </div>
      </CardContent>
    </Card>
  )
}