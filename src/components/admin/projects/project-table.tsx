'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Eye, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Flag, 
  Trash2,
  ExternalLink 
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface Project {
  id: string
  title: string
  description: string
  thumbnail: string
  author: {
    id: string
    name: string
    avatar: string
  }
  status: 'approved' | 'pending' | 'rejected' | 'reported'
  category: string
  tags: string[]
  createdAt: Date
  views: number
  likes: number
}

// 임시 데이터
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'React 포트폴리오 사이트',
    description: '개인 포트폴리오를 위한 React 기반 웹사이트',
    thumbnail: '/api/placeholder/300/200',
    author: {
      id: '1',
      name: 'vivvers',
      avatar: '/avatars/01.png'
    },
    status: 'approved',
    category: '웹 개발',
    tags: ['React', 'TypeScript', 'Tailwind'],
    createdAt: new Date('2024-01-15'),
    views: 1234,
    likes: 89
  },
  {
    id: '2',
    title: 'Vue.js 쇼핑몰 프로젝트',
    description: 'Vue.js로 만든 전자상거래 플랫폼',
    thumbnail: '/api/placeholder/300/200',
    author: {
      id: '2',
      name: 'coder123',
      avatar: '/avatars/02.png'
    },
    status: 'pending',
    category: '웹 개발',
    tags: ['Vue', 'Node.js', 'MongoDB'],
    createdAt: new Date('2024-01-14'),
    views: 567,
    likes: 34
  },
  {
    id: '3',
    title: 'Flutter 모바일 앱',
    description: '크로스 플랫폼 모바일 애플리케이션',
    thumbnail: '/api/placeholder/300/200',
    author: {
      id: '3',
      name: 'developer',
      avatar: '/avatars/03.png'
    },
    status: 'reported',
    category: '모바일 앱',
    tags: ['Flutter', 'Dart', 'Firebase'],
    createdAt: new Date('2024-01-13'),
    views: 789,
    likes: 56
  },
  {
    id: '4',
    title: 'Python 데이터 분석 도구',
    description: '머신러닝을 활용한 데이터 분석 플랫폼',
    thumbnail: '/api/placeholder/300/200',
    author: {
      id: '4',
      name: 'analyst',
      avatar: '/avatars/04.png'
    },
    status: 'approved',
    category: 'AI/ML',
    tags: ['Python', 'TensorFlow', 'Pandas'],
    createdAt: new Date('2024-01-12'),
    views: 2341,
    likes: 156
  },
  {
    id: '5',
    title: 'Angular 관리자 대시보드',
    description: '엔터프라이즈급 관리자 패널',
    thumbnail: '/api/placeholder/300/200',
    author: {
      id: '5',
      name: 'admin_dev',
      avatar: '/avatars/05.png'
    },
    status: 'rejected',
    category: '웹 개발',
    tags: ['Angular', 'TypeScript', 'RxJS'],
    createdAt: new Date('2024-01-11'),
    views: 123,
    likes: 12
  },
]

const getStatusBadge = (status: Project['status']) => {
  switch (status) {
    case 'approved':
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
          승인됨
        </Badge>
      )
    case 'pending':
      return (
        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400">
          승인 대기
        </Badge>
      )
    case 'rejected':
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">
          거부됨
        </Badge>
      )
    case 'reported':
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400">
          신고됨
        </Badge>
      )
  }
}

export function ProjectTable() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  const handleAction = (projectId: string, action: string) => {
    console.log(`Action ${action} for project ${projectId}`)
    // 실제 구현에서는 여기서 API 호출을 수행합니다
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProjects(mockProjects.map(p => p.id))
                    } else {
                      setSelectedProjects([])
                    }
                  }}
                />
              </TableHead>
              <TableHead>프로젝트</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>태그</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead>조회수</TableHead>
              <TableHead className="text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedProjects.includes(project.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProjects([...selectedProjects, project.id])
                      } else {
                        setSelectedProjects(selectedProjects.filter(id => id !== project.id))
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{project.title}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {project.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={project.author.avatar} />
                      <AvatarFallback>
                        {project.author.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{project.author.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(project.status)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{project.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap max-w-48">
                    {project.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {format(project.createdAt, 'yy.MM.dd', { locale: ko })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{project.views.toLocaleString()}</div>
                    <div className="text-muted-foreground">
                      좋아요 {project.likes}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>액션</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        상세 보기
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        사이트 방문
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {project.status === 'pending' && (
                        <>
                          <DropdownMenuItem 
                            className="text-green-600"
                            onClick={() => handleAction(project.id, 'approve')}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            승인하기
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleAction(project.id, 'reject')}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            거부하기
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem>
                        <Flag className="mr-2 h-4 w-4" />
                        신고하기
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        삭제하기
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 선택된 항목 액션 */}
      {selectedProjects.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted rounded-md">
          <span className="text-sm font-medium">
            {selectedProjects.length}개 프로젝트가 선택됨
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              일괄 승인
            </Button>
            <Button size="sm" variant="outline">
              일괄 거부
            </Button>
            <Button size="sm" variant="outline" className="text-red-600">
              일괄 삭제
            </Button>
          </div>
        </div>
      )}

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          총 {mockProjects.length}개 중 1-{mockProjects.length}개 표시
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            이전
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            다음
          </Button>
        </div>
      </div>
    </div>
  )
}