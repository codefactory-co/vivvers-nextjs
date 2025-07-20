'use client'

import { useState, useTransition } from 'react'
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
  UserCheck, 
  UserX, 
  Shield, 
  ShieldOff,
  Mail,
  MessageSquare,
  Ban,
  UserCog
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { AdminUser } from '@/lib/admin/user-service'
import { updateUserStatusAction, updateUserRoleAction, updateUserVerificationAction } from '@/lib/actions/admin/users'
import { UserRole, UserStatus } from '@prisma/client'
import { useToast } from '@/hooks/use-toast'

interface UserTableProps {
  initialUsers: AdminUser[]
}

const getStatusBadge = (status: UserStatus) => {
  switch (status) {
    case UserStatus.active:
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
          활성
        </Badge>
      )
    case UserStatus.inactive:
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400">
          비활성
        </Badge>
      )
    case UserStatus.suspended:
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">
          정지됨
        </Badge>
      )
    case UserStatus.banned:
      return (
        <Badge className="bg-black text-white hover:bg-black dark:bg-red-600 dark:text-white">
          차단됨
        </Badge>
      )
  }
}

const getRoleBadge = (role: UserRole) => {
  switch (role) {
    case UserRole.admin:
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400">
          관리자
        </Badge>
      )
    case UserRole.moderator:
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">
          모더레이터
        </Badge>
      )
    case UserRole.user:
      return (
        <Badge variant="outline">
          사용자
        </Badge>
      )
  }
}

export function UserTable({ initialUsers }: UserTableProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleAction = async (userId: string, action: string) => {
    startTransition(async () => {
      try {
        let result

        switch (action) {
          case 'suspend':
            result = await updateUserStatusAction(userId, UserStatus.suspended)
            break
          case 'activate':
            result = await updateUserStatusAction(userId, UserStatus.active)
            break
          case 'ban':
            result = await updateUserStatusAction(userId, UserStatus.banned)
            break
          case 'promote-moderator':
            result = await updateUserRoleAction(userId, UserRole.moderator)
            break
          case 'demote-user':
            result = await updateUserRoleAction(userId, UserRole.user)
            break
          case 'verify':
            result = await updateUserVerificationAction(userId, true)
            break
          case 'unverify':
            result = await updateUserVerificationAction(userId, false)
            break
          default:
            console.log(`Action ${action} for user ${userId}`)
            return
        }

        if (result?.success) {
          toast({
            title: '성공',
            description: result.message || '작업이 완료되었습니다'
          })
          
          // 로컬 상태 업데이트
          setUsers(prev => prev.map(user => {
            if (user.id === userId) {
              const updatedUser = { ...user }
              switch (action) {
                case 'suspend':
                  updatedUser.status = UserStatus.suspended
                  break
                case 'activate':
                  updatedUser.status = UserStatus.active
                  break
                case 'ban':
                  updatedUser.status = UserStatus.banned
                  break
                case 'promote-moderator':
                  updatedUser.role = UserRole.moderator
                  break
                case 'demote-user':
                  updatedUser.role = UserRole.user
                  break
                case 'verify':
                  updatedUser.verified = true
                  break
                case 'unverify':
                  updatedUser.verified = false
                  break
              }
              return updatedUser
            }
            return user
          }))
        } else {
          toast({
            title: '오류',
            description: result?.error || '작업 중 오류가 발생했습니다',
            variant: 'destructive'
          })
        }
      } catch {
        toast({
          title: '오류',
          description: '작업 중 오류가 발생했습니다',
          variant: 'destructive'
        })
      }
    })
  }

  const getLastActiveText = (lastActive: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - lastActive.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return '오늘'
    if (diffDays === 1) return '어제'
    if (diffDays < 7) return `${diffDays}일 전`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`
    return format(lastActive, 'yy.MM.dd', { locale: ko })
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
                      setSelectedUsers(users.map(u => u.id))
                    } else {
                      setSelectedUsers([])
                    }
                  }}
                />
              </TableHead>
              <TableHead>사용자</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>역할</TableHead>
              <TableHead>인증</TableHead>
              <TableHead>가입일</TableHead>
              <TableHead>마지막 활동</TableHead>
              <TableHead>프로젝트</TableHead>
              <TableHead>신고</TableHead>
              <TableHead className="text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id])
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback>
                        {user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {user.username}
                        {user.verified && (
                          <UserCheck className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </div>
                      {user.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {user.description}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(user.status)}
                </TableCell>
                <TableCell>
                  {getRoleBadge(user.role)}
                </TableCell>
                <TableCell>
                  {user.verified ? (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">
                      인증됨
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-orange-600">
                      미인증
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {format(user.joinDate, 'yy.MM.dd', { locale: ko })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {user.lastActive ? getLastActiveText(user.lastActive) : '알 수 없음'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">
                    {user.projectCount}개
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {user.reportCount > 0 ? (
                      <Badge variant="destructive" className="text-xs">
                        {user.reportCount}건
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">없음</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>사용자 관리</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        프로필 보기
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        이메일 보내기
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        메시지 보내기
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === UserStatus.active ? (
                        <DropdownMenuItem 
                          className="text-orange-600"
                          onClick={() => handleAction(user.id, 'suspend')}
                          disabled={isPending}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          계정 정지
                        </DropdownMenuItem>
                      ) : user.status === UserStatus.suspended ? (
                        <DropdownMenuItem 
                          className="text-green-600"
                          onClick={() => handleAction(user.id, 'activate')}
                          disabled={isPending}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          정지 해제
                        </DropdownMenuItem>
                      ) : null}
                      {user.role === UserRole.user && (
                        <DropdownMenuItem
                          onClick={() => handleAction(user.id, 'promote-moderator')}
                          disabled={isPending}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          모더레이터 승급
                        </DropdownMenuItem>
                      )}
                      {user.role === UserRole.moderator && (
                        <DropdownMenuItem
                          onClick={() => handleAction(user.id, 'demote-user')}
                          disabled={isPending}
                        >
                          <ShieldOff className="mr-2 h-4 w-4" />
                          일반 사용자로 강등
                        </DropdownMenuItem>
                      )}
                      {!user.verified && (
                        <DropdownMenuItem
                          onClick={() => handleAction(user.id, 'verify')}
                          disabled={isPending}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          인증 승인
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleAction(user.id, 'ban')}
                        disabled={isPending}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        계정 차단
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
      {selectedUsers.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted rounded-md">
          <span className="text-sm font-medium">
            {selectedUsers.length}명의 사용자가 선택됨
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              일괄 이메일
            </Button>
            <Button size="sm" variant="outline">
              <UserCog className="mr-2 h-4 w-4" />
              역할 변경
            </Button>
            <Button size="sm" variant="outline" className="text-red-600">
              <UserX className="mr-2 h-4 w-4" />
              일괄 정지
            </Button>
          </div>
        </div>
      )}

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          총 {users.length}명 중 1-{users.length}명 표시
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