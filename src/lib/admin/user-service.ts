import { prisma } from '@/lib/prisma/client'
import { UserRole, UserStatus } from '@prisma/client'
import type { UserFilters, AdminUser } from '@/types/admin'

export type { UserFilters, AdminUser }

export class AdminUserService {
  static async getUsers(filters: UserFilters): Promise<AdminUser[]> {
    const users = await prisma.user.findMany({
      include: { 
        projects: { select: { updatedAt: true } },
        comments: { select: { createdAt: true } },
        _count: { 
          select: { 
            projects: true,
            projectLikes: true,
            comments: true
          } 
        }
      },
      where: this.buildWhereClause(filters),
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0
    })
    
    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatarUrl || '',
      joinDate: user.createdAt,
      description: user.bio,
      projectCount: user._count.projects,
      
      // User 테이블에서 직접 가져온 어드민 필드 (enum 타입)
      role: user.role,
      status: user.status,
      verified: user.verified,
      lastActive: user.lastActive || this.calculateLastActive(user),
      adminNotes: user.adminNotes,
      
      // Phase 2에서 UserReport 테이블 추가 후 구현
      reportCount: 0
    }))
  }
  
  static async updateUserStatus(userId: string, status: UserStatus) {
    return await prisma.user.update({
      where: { id: userId },
      data: { 
        status,
        updatedAt: new Date()
      }
    })
  }
  
  static async updateUserRole(userId: string, role: UserRole) {
    return await prisma.user.update({
      where: { id: userId },
      data: { 
        role,
        updatedAt: new Date()
      }
    })
  }
  
  static async updateUserVerification(userId: string, verified: boolean) {
    return await prisma.user.update({
      where: { id: userId },
      data: { 
        verified,
        updatedAt: new Date()
      }
    })
  }
  
  static async updateAdminNotes(userId: string, adminNotes: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { 
        adminNotes,
        updatedAt: new Date()
      }
    })
  }
  
  private static calculateLastActive(user: {
    updatedAt: Date
    projects: { updatedAt: Date }[]
    comments: { createdAt: Date }[]
  }): Date {
    // 프로젝트, 댓글 등의 최신 활동 기준으로 계산
    const activities = [
      user.updatedAt,
      ...user.projects.map((p) => p.updatedAt),
      ...user.comments.map((c) => c.createdAt)
    ]
    
    return new Date(Math.max(...activities.map(d => d.getTime())))
  }
  
  private static buildWhereClause(filters: UserFilters) {
    const where: {
      OR?: { username?: { contains: string; mode: 'insensitive' }; email?: { contains: string; mode: 'insensitive' } }[]
      role?: UserRole
      status?: UserStatus
      verified?: boolean
    } = {}
    
    if (filters.search) {
      where.OR = [
        { username: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ]
    }
    
    if (filters.role) {
      where.role = filters.role
    }
    
    if (filters.status) {
      where.status = filters.status
    }
    
    if (filters.verified !== undefined) {
      where.verified = filters.verified
    }
    
    return where
  }
}