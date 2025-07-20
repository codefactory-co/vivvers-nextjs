'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Tag, 
  BarChart3, 
  Settings,
  Clock,
  AlertTriangle,
  UserX,
  Flag,
  Hash,
  Grid3X3,
  MessageSquare,
  PieChart,
  Activity,
  Shield,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    title: '대시보드',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: '프로젝트 관리',
    href: '/admin/projects',
    icon: FolderOpen,
    children: [
      {
        title: '승인 대기',
        href: '/admin/projects/pending',
        icon: Clock,
        badge: 12,
      },
      {
        title: '전체 목록',
        href: '/admin/projects',
        icon: Grid3X3,
      },
      {
        title: '신고된 프로젝트',
        href: '/admin/projects/reported',
        icon: Flag,
        badge: 3,
      },
    ],
  },
  {
    title: '사용자 관리',
    href: '/admin/users',
    icon: Users,
    children: [
      {
        title: '전체 사용자',
        href: '/admin/users',
        icon: Users,
      },
      {
        title: '정지된 사용자',
        href: '/admin/users/suspended',
        icon: UserX,
        badge: 2,
      },
      {
        title: '신고 관리',
        href: '/admin/users/reports',
        icon: AlertTriangle,
        badge: 5,
      },
    ],
  },
  {
    title: '콘텐츠 관리',
    href: '/admin/content',
    icon: Tag,
    children: [
      {
        title: '태그 관리',
        href: '/admin/content/tags',
        icon: Hash,
      },
      {
        title: '카테고리 관리',
        href: '/admin/content/categories',
        icon: Grid3X3,
      },
      {
        title: '커뮤니티 관리',
        href: '/admin/content/posts',
        icon: MessageSquare,
      },
    ],
  },
  {
    title: '분석',
    href: '/admin/analytics',
    icon: BarChart3,
    children: [
      {
        title: '사용자 통계',
        href: '/admin/analytics/users',
        icon: PieChart,
      },
      {
        title: '프로젝트 통계',
        href: '/admin/analytics/projects',
        icon: BarChart3,
      },
      {
        title: '시스템 로그',
        href: '/admin/analytics/logs',
        icon: Activity,
      },
    ],
  },
  {
    title: '설정',
    href: '/admin/settings',
    icon: Settings,
    children: [
      {
        title: '사이트 설정',
        href: '/admin/settings/site',
        icon: Settings,
      },
      {
        title: '관리자 계정',
        href: '/admin/settings/admins',
        icon: Shield,
      },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [openItems, setOpenItems] = useState<string[]>(['프로젝트 관리'])

  const toggleItem = (title: string) => {
    setOpenItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string, isExact: boolean = false) => {
    if (href === '/admin') {
      // 대시보드는 정확히 일치해야 함
      return pathname === '/admin'
    }
    
    if (isExact) {
      // 자식 메뉴는 정확히 일치해야 함
      return pathname === href
    }
    
    // 부모 메뉴는 prefix 매칭 (하지만 더 구체적인 하위 경로 제외)
    return pathname.startsWith(href) && pathname !== '/admin'
  }

  const isParentActive = (item: NavItem) => {
    if (!item.children) return false
    
    // 자식 메뉴 중 하나라도 활성화되어 있으면 부모도 활성화
    return item.children.some(child => pathname === child.href)
  }

  const renderNavItem = (item: NavItem, depth = 0) => {
    const Icon = item.icon
    const hasChildren = item.children && item.children.length > 0
    const isOpen = openItems.includes(item.title)
    
    // depth가 0이면 부모 메뉴, 0보다 크면 자식 메뉴
    const active = depth === 0 
      ? (hasChildren ? isParentActive(item) : isActive(item.href)) 
      : isActive(item.href, true) // 자식 메뉴는 exact match

    if (hasChildren) {
      return (
        <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleItem(item.title)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 px-3 py-2 h-10',
                depth > 0 && 'pl-6',
                active && 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {item.badge}
                </Badge>
              )}
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.children?.map(child => renderNavItem(child, depth + 1))}
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <Link key={item.href} href={item.href}>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 px-3 py-2 h-10',
            depth > 0 && 'pl-6',
            active && 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="flex-1 text-left">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {item.badge}
            </Badge>
          )}
        </Button>
      </Link>
    )
  }

  return (
    <>
      {/* 데스크톱 사이드바 */}
      <aside className="fixed inset-y-16 left-0 z-40 hidden w-64 border-r bg-background lg:block">
        <div className="flex h-full flex-col">
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map(item => renderNavItem(item))}
          </nav>
          
          {/* 하단 정보 */}
          <div className="border-t p-4">
            <div className="text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>활성 사용자</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>대기 중</span>
                <span className="font-medium text-orange-500">17</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 모바일 오버레이 (필요시 구현) */}
    </>
  )
}