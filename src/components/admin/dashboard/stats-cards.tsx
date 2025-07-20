'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Users, FolderOpen, Clock, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardData {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  change: {
    value: string
    type: 'increase' | 'decrease' | 'neutral'
    label: string
  }
  description?: string
}

const statsData: StatCardData[] = [
  {
    title: '전체 프로젝트',
    value: '1,234',
    icon: FolderOpen,
    change: {
      value: '+5.2%',
      type: 'increase',
      label: '지난 30일 대비'
    },
    description: '승인된 프로젝트 수'
  },
  {
    title: '승인 대기',
    value: 45,
    icon: Clock,
    change: {
      value: '+12',
      type: 'increase',
      label: '새로운 요청'
    },
    description: '검토가 필요한 프로젝트'
  },
  {
    title: '활성 사용자',
    value: '892',
    icon: Users,
    change: {
      value: '+3.1%',
      type: 'increase',
      label: '지난 30일 대비'
    },
    description: '월간 활성 사용자'
  },
  {
    title: '월간 신규',
    value: 127,
    icon: UserPlus,
    change: {
      value: '+22%',
      type: 'increase',
      label: '지난달 대비'
    },
    description: '신규 가입자 수'
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        const isIncrease = stat.change.type === 'increase'
        const isDecrease = stat.change.type === 'decrease'
        
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn(
                'h-8 w-8 rounded-lg flex items-center justify-center',
                'bg-gradient-to-br from-blue-500 to-blue-600'
              )}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={isIncrease ? 'default' : isDecrease ? 'destructive' : 'secondary'}
                    className={cn(
                      'text-xs',
                      isIncrease && 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400',
                      isDecrease && 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                    )}
                  >
                    {isIncrease && <TrendingUp className="h-3 w-3 mr-1" />}
                    {isDecrease && <TrendingDown className="h-3 w-3 mr-1" />}
                    {stat.change.value}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {stat.change.label}
                  </span>
                </div>
                
                {stat.description && (
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                )}
              </div>
            </CardContent>
            
            {/* 배경 그라데이션 */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full transform translate-x-8 -translate-y-8" />
          </Card>
        )
      })}
    </div>
  )
}