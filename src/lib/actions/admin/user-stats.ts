'use server'

import { prisma } from '@/lib/prisma/client'
import { requireAdminPermission } from '@/lib/auth/admin'
import { UserStatus } from '@prisma/client'

export interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersThisWeek: number
  suspendedUsers: number
  monthlyActiveUsers: number
}

export async function getUserStatsAction(): Promise<{ success: boolean; data?: UserStats; error?: string }> {
  try {
    await requireAdminPermission()
    
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    // 총 사용자 수
    const totalUsers = await prisma.user.count()
    
    // 활성 사용자 수
    const activeUsers = await prisma.user.count({
      where: { status: UserStatus.active }
    })
    
    // 이번 주 신규 가입자
    const newUsersThisWeek = await prisma.user.count({
      where: {
        createdAt: {
          gte: oneWeekAgo
        }
      }
    })
    
    // 정지된 사용자
    const suspendedUsers = await prisma.user.count({
      where: { status: UserStatus.suspended }
    })
    
    // 월간 활성 사용자 (최근 한 달 내 활동한 사용자)
    const monthlyActiveUsers = await prisma.user.count({
      where: {
        OR: [
          {
            lastActive: {
              gte: oneMonthAgo
            }
          },
          {
            updatedAt: {
              gte: oneMonthAgo
            }
          },
          {
            projects: {
              some: {
                updatedAt: {
                  gte: oneMonthAgo
                }
              }
            }
          },
          {
            comments: {
              some: {
                createdAt: {
                  gte: oneMonthAgo
                }
              }
            }
          }
        ]
      }
    })
    
    const stats: UserStats = {
      totalUsers,
      activeUsers,
      newUsersThisWeek,
      suspendedUsers,
      monthlyActiveUsers
    }
    
    return { success: true, data: stats }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}