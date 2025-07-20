'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

const pathMap: Record<string, string> = {
  admin: '어드민',
  projects: '프로젝트 관리',
  pending: '승인 대기',
  reported: '신고된 프로젝트',
  users: '사용자 관리',
  suspended: '정지된 사용자',
  reports: '신고 관리',
  content: '콘텐츠 관리',
  tags: '태그 관리',
  categories: '카테고리 관리',
  posts: '커뮤니티 관리',
  analytics: '분석',
  logs: '시스템 로그',
  settings: '설정',
  site: '사이트 설정',
  admins: '관리자 계정',
}

export function AdminBreadcrumb() {
  const pathname = usePathname()
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    segments.forEach((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/')
      const label = pathMap[segment] || segment
      
      breadcrumbs.push({
        label,
        href: index === segments.length - 1 ? undefined : path
      })
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}