'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react'

// 임시 차트 데이터 (실제로는 차트 라이브러리 사용)
const mockChartData = {
  projects: [
    { date: '1/1', value: 20 },
    { date: '1/8', value: 35 },
    { date: '1/15', value: 45 },
    { date: '1/22', value: 38 },
    { date: '1/29', value: 52 },
  ],
  categories: [
    { name: 'React', value: 35, color: 'bg-blue-500' },
    { name: 'Vue', value: 25, color: 'bg-green-500' },
    { name: 'Angular', value: 20, color: 'bg-red-500' },
    { name: 'TypeScript', value: 15, color: 'bg-purple-500' },
    { name: '기타', value: 5, color: 'bg-gray-500' },
  ]
}

// 간단한 막대 차트 컴포넌트
function SimpleBarChart({ data }: { data: Array<{ date: string; value: number }> }) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>프로젝트 수</span>
        <span>날짜</span>
      </div>
      <div className="flex items-end justify-between gap-2 h-40">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div 
              className="bg-blue-500 rounded-t min-w-8 relative group cursor-pointer hover:bg-blue-600 transition-colors"
              style={{ height: `${(item.value / maxValue) * 120}px` }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {item.value}
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 간단한 도넛 차트 컴포넌트
function SimplePieChart({ data }: { data: Array<{ name: string; value: number; color: string }> }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="relative w-32 h-32">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{total}%</div>
              <div className="text-xs text-muted-foreground">전체</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm">{item.name}</span>
            </div>
            <div className="text-sm font-medium">{item.value}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartWidget() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            통계 분석
          </CardTitle>
          <Badge variant="outline" className="gap-1">
            <Calendar className="h-3 w-3" />
            최근 30일
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="projects" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              프로젝트 추이
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <PieChart className="h-4 w-4" />
              카테고리 분포
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">프로젝트 등록 추이</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  신규 프로젝트
                </div>
              </div>
              <SimpleBarChart data={mockChartData.projects} />
              <div className="text-sm text-muted-foreground text-center">
                지난 주 대비 <span className="font-medium text-green-600">+12%</span> 증가
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="categories" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">인기 기술 스택</h3>
              <SimplePieChart data={mockChartData.categories} />
              <div className="text-sm text-muted-foreground text-center">
                React가 가장 인기있는 기술 스택입니다
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}