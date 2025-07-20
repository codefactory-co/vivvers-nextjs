'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Clock, Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

// 임시 데이터
const pendingProjects = [
  {
    id: '1',
    title: 'React 포트폴리오 사이트',
    author: {
      name: 'vivvers',
      avatar: '/avatars/01.png'
    },
    submittedAt: '2분 전',
    tags: ['React', 'TypeScript']
  },
  {
    id: '2',
    title: 'Vue.js 쇼핑몰 프로젝트',
    author: {
      name: 'coder123',
      avatar: '/avatars/02.png'
    },
    submittedAt: '15분 전',
    tags: ['Vue', 'Node.js']
  },
  {
    id: '3',
    title: 'Angular 관리자 대시보드',
    author: {
      name: 'developer',
      avatar: '/avatars/03.png'
    },
    submittedAt: '1시간 전',
    tags: ['Angular', 'TypeScript']
  },
]

const recentReports = [
  {
    id: '1',
    type: 'project',
    title: '부적절한 이미지 포함',
    reportedAt: '30분 전',
    severity: 'high' as const
  },
  {
    id: '2',
    type: 'user',
    title: '스팸 댓글 작성',
    reportedAt: '1시간 전',
    severity: 'medium' as const
  },
  {
    id: '3',
    type: 'project',
    title: '저작권 침해 의심',
    reportedAt: '2시간 전',
    severity: 'high' as const
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            승인 대기 프로젝트
          </CardTitle>
          <Badge variant="secondary">
            {pendingProjects.length}개
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingProjects.map((project) => (
          <div key={project.id} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={project.author.avatar} />
                <AvatarFallback>{project.author.name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{project.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {project.author.name} • {project.submittedAt}
                  </span>
                </div>
                <div className="flex gap-1 mt-1">
                  {project.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600 hover:text-green-700">
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t">
          <Link href="/admin/projects/pending">
            <Button variant="outline" className="w-full">
              전체 보기
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export function RecentReports() {
  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getSeverityText = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return '높음'
      case 'medium':
        return '보통'
      case 'low':
        return '낮음'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            최근 신고
          </CardTitle>
          <Badge variant="destructive">
            {recentReports.length}개
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentReports.map((report) => (
          <div key={report.id} className="flex items-center justify-between space-x-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{report.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getSeverityColor(report.severity)}`}
                >
                  {getSeverityText(report.severity)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {report.reportedAt}
                </span>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <div className="pt-2 border-t">
          <Link href="/admin/users/reports">
            <Button variant="outline" className="w-full">
              전체 보기
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}