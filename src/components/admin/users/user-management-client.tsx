'use client'

import { useState, useTransition } from 'react'
import { UserFilters } from './user-filters'
import { UserTable } from './user-table'
import { getUsersAction } from '@/lib/actions/admin/users'
import { AdminUser } from '@/lib/admin/user-service'
import { UserRole, UserStatus } from '@prisma/client'
import type { DateRange } from 'react-day-picker'
import { useToast } from '@/hooks/use-toast'

interface UserFilterState {
  search: string
  status: string
  role: string
  verificationStatus: string
  joinDateRange: DateRange | undefined
  lastActiveRange: DateRange | undefined
}

interface UserManagementClientProps {
  initialUsers: AdminUser[]
}

export function UserManagementClient({ initialUsers }: UserManagementClientProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [filters, setFilters] = useState<UserFilterState>({
    search: '',
    status: 'all',
    role: 'all',
    verificationStatus: 'all',
    joinDateRange: undefined,
    lastActiveRange: undefined,
  })
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const applyFilters = () => {
    startTransition(async () => {
      try {
        // 필터 조건을 getUsersAction에 맞는 형태로 변환
        const userFilters = {
          search: filters.search || undefined,
          status: filters.status !== 'all' ? (filters.status as UserStatus) : undefined,
          role: filters.role !== 'all' ? (filters.role as UserRole) : undefined,
          verified: filters.verificationStatus === 'verified' ? true : 
                   filters.verificationStatus === 'unverified' ? false : undefined,
          joinDateFrom: filters.joinDateRange?.from,
          joinDateTo: filters.joinDateRange?.to,
          lastActiveFrom: filters.lastActiveRange?.from,
          lastActiveTo: filters.lastActiveRange?.to,
        }

        const result = await getUsersAction(userFilters)
        
        if (result.success && result.data) {
          setUsers(result.data)
          toast({
            title: '필터 적용됨',
            description: `${result.data.length}명의 사용자가 조회되었습니다`
          })
        } else {
          toast({
            title: '오류',
            description: result.error || '필터 적용 중 오류가 발생했습니다',
            variant: 'destructive'
          })
        }
      } catch {
        toast({
          title: '오류',
          description: '필터 적용 중 오류가 발생했습니다',
          variant: 'destructive'
        })
      }
    })
  }

  const clearFilters = () => {
    const resetFilters = {
      search: '',
      status: 'all',
      role: 'all',
      verificationStatus: 'all',
      joinDateRange: undefined,
      lastActiveRange: undefined,
    }
    
    setFilters(resetFilters)
    
    // 필터 초기화 시 전체 사용자 다시 로드
    startTransition(async () => {
      const result = await getUsersAction({})
      if (result.success && result.data) {
        setUsers(result.data)
      }
    })
  }

  return (
    <div className="space-y-6">
      <UserFilters 
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        isLoading={isPending}
      />
      <UserTable initialUsers={users} />
    </div>
  )
}