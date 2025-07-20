# Vivvers Admin 데이터베이스 연동 마이그레이션 계획

## 📋 개요

Vivvers 프로젝트의 `/admin/users` 페이지를 User 테이블에 어드민 필드를 직접 추가하여 데이터베이스와 연동하는 단계별 마이그레이션 계획입니다.

## 🎯 목표

- User 테이블에 어드민 필드 직접 추가
- 단일 테이블 기반 어드민 기능 구현
- 점진적 기능 확장 및 성능 최적화
- 타입 안전성과 확장성 확보

## 📊 현재 상황 분석

### ✅ 기존 DB에서 활용 가능한 필드
```typescript
interface ExistingUserData {
  id: string          // User.id
  username: string    // User.username
  email: string       // User.email
  avatar: string      // User.avatarUrl
  joinDate: Date      // User.createdAt
  bio: string         // User.bio (description으로 활용)
  projectCount: number // User.projects.length (계산)
}
```

### ➕ User 테이블에 추가할 어드민 필드
```typescript
interface AdditionalUserFields {
  status: 'active' | 'inactive' | 'suspended' | 'banned'  // 기본값: 'active'
  role: 'user' | 'moderator' | 'admin'                   // 기본값: 'user'
  verified: boolean                                       // 기본값: false
  lastActive: Date | null                                 // nullable, 계산된 값
  adminNotes: string | null                               // nullable
  // reportCount는 UserReport 테이블에서 계산하여 제공
}
```

## 🚀 Phase 1: User 테이블 스키마 확장 (1-2일)

### 목표
User 테이블에 어드민 필드를 추가하여 기본 어드민 기능 구현

### 구현 사항

#### 1. User 테이블 스키마 확장
```prisma
// prisma/schema.prisma - User 모델 업데이트

enum UserRole {
  user
  moderator
  admin
}

enum UserStatus {
  active
  inactive
  suspended
  banned
}

model User {
  id        String   @id @default(uuid()) @db.Uuid
  username  String   @unique
  email     String   @unique
  bio       String?
  avatarUrl String?  @map("avatar_url")
  
  // 기존 필드들...
  
  // 새로 추가되는 어드민 필드들
  role        UserRole   @default(user)
  status      UserStatus @default(active)
  verified    Boolean    @default(false)
  lastActive  DateTime?  @map("last_active")
  adminNotes  String?    @map("admin_notes")
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  // 기존 관계들...
  projects      Project[]
  projectLikes  ProjectLike[]
  comments      Comment[]
  
  @@index([role])
  @@index([status])
  @@index([verified])
  @@map("users")
}
```

#### 2. 마이그레이션 실행
```bash
# 마이그레이션 생성
npx prisma migrate dev --name add_admin_fields_to_user

# 클라이언트 재생성  
npx prisma generate
```

#### 3. 사용자 서비스 레이어
```typescript
// src/lib/admin/user-service.ts
import { prisma } from '@/lib/prisma/client'
import { UserRole, UserStatus } from '@prisma/client'

export interface UserFilters {
  search?: string
  role?: UserRole
  status?: UserStatus
  verified?: boolean
  limit?: number
  offset?: number
}

export interface AdminUser {
  id: string
  username: string
  email: string
  avatar: string
  joinDate: Date
  description: string | null
  projectCount: number
  role: UserRole
  status: UserStatus
  verified: boolean
  lastActive: Date | null
  adminNotes: string | null
  reportCount: number
}

export class AdminUserService {
  static async getUsers(filters: UserFilters): Promise<AdminUser[]> {
    const users = await prisma.user.findMany({
      include: { 
        projects: true,
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
  
  private static calculateLastActive(user: any): Date {
    // 프로젝트, 댓글 등의 최신 활동 기준으로 계산
    const activities = [
      user.updatedAt,
      ...user.projects.map((p: any) => p.updatedAt),
      ...user.comments.map((c: any) => c.createdAt)
    ]
    
    return new Date(Math.max(...activities.map(d => d.getTime())))
  }
  
  private static buildWhereClause(filters: UserFilters) {
    const where: any = {}
    
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
```

#### 4. Server Actions
```typescript
// src/lib/actions/admin/users.ts
'use server'

import { revalidatePath } from 'next/cache'
import { AdminUserService, UserFilters } from '@/lib/admin/user-service'
import { requireAdminPermission } from '@/lib/auth/admin'
import { UserRole, UserStatus } from '@prisma/client'

export async function getUsersAction(filters: UserFilters) {
  try {
    await requireAdminPermission()
    const users = await AdminUserService.getUsers(filters)
    return { success: true, data: users }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateUserStatusAction(userId: string, status: UserStatus) {
  try {
    const admin = await requireAdminPermission()
    
    await AdminUserService.updateUserStatus(userId, status)
    
    revalidatePath('/admin/users')
    return { success: true, message: '사용자 상태가 변경되었습니다' }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateUserRoleAction(userId: string, role: UserRole) {
  try {
    const admin = await requireAdminPermission()
    
    // 어드민만 어드민 역할 부여 가능
    if (role === 'admin' && admin.role !== 'admin') {
      throw new Error('어드민만 어드민 역할을 부여할 수 있습니다')
    }
    
    await AdminUserService.updateUserRole(userId, role)
    
    revalidatePath('/admin/users')
    return { success: true, message: '사용자 역할이 변경되었습니다' }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateUserVerificationAction(userId: string, verified: boolean) {
  try {
    await requireAdminPermission()
    
    await AdminUserService.updateUserVerification(userId, verified)
    
    revalidatePath('/admin/users')
    return { success: true, message: '사용자 인증 상태가 변경되었습니다' }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateAdminNotesAction(userId: string, adminNotes: string) {
  try {
    await requireAdminPermission()
    
    await AdminUserService.updateAdminNotes(userId, adminNotes)
    
    revalidatePath('/admin/users')
    return { success: true, message: '관리자 메모가 업데이트되었습니다' }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
```

#### 5. 권한 체크 시스템
```typescript
// src/lib/auth/admin.ts
import { prisma } from '@/lib/prisma/client'
import { supabase } from '@/lib/supabase/server'
import { UserRole, User } from '@prisma/client'

export async function getCurrentUser(): Promise<User | null> {
  // Supabase 인증에서 현재 사용자 가져오기
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  return await prisma.user.findUnique({
    where: { id: user.id }
  })
}

export async function isAdminOrModerator(user: User): Promise<boolean> {
  return user.role === UserRole.admin || user.role === UserRole.moderator
}

export async function requireAdminPermission(): Promise<User> {
  const user = await getCurrentUser()
  if (!user || !await isAdminOrModerator(user)) {
    throw new Error('관리자 권한이 필요합니다')
  }
  return user
}

export async function requireSpecificRole(requiredRole: UserRole): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('로그인이 필요합니다')
  }
  
  if (requiredRole === UserRole.admin && user.role !== UserRole.admin) {
    throw new Error('어드민 권한이 필요합니다')
  }
  
  if (requiredRole === UserRole.moderator && 
      user.role !== UserRole.admin && 
      user.role !== UserRole.moderator) {
    throw new Error('모더레이터 이상의 권한이 필요합니다')
  }
  
  return user
}
```

#### 6. 타입 정의
```typescript
// src/types/admin.ts
import { UserRole, UserStatus } from '@prisma/client'

export { UserRole, UserStatus }

export interface UserFilters {
  search?: string
  role?: UserRole
  status?: UserStatus
  verified?: boolean
  limit?: number
  offset?: number
}

export interface AdminUser {
  id: string
  username: string
  email: string
  avatar: string
  joinDate: Date
  description: string | null
  projectCount: number
  role: UserRole
  status: UserStatus
  verified: boolean
  lastActive: Date | null
  adminNotes: string | null
  reportCount: number
}
```

### Phase 1 완료 시 기능
- ✅ User 테이블에 enum 기반 어드민 필드 추가
- ✅ 사용자 목록 조회 및 표시 (User 테이블 기반)
- ✅ 기본 필터링 (이름, 이메일, 역할, 상태, 인증 상태)
- ✅ 동적 사용자 상태 변경 (enum: active/inactive/suspended/banned)
- ✅ 사용자 역할 관리 (enum: user/moderator/admin)
- ✅ 사용자 인증 상태 관리
- ✅ 관리자 메모 기능
- ✅ 프로젝트 수, 활동 통계 표시
- ✅ 권한 기반 접근 제어 (enum 타입 안전성)

---

## 🔧 Phase 2: 신고 및 활동 추적 시스템 추가 (1주)

### 목표
사용자 신고 시스템과 활동 추적 기능을 추가하여 완전한 어드민 시스템 구현

### 스키마 변경

#### 1. 신고 및 활동 추적 테이블 추가
```prisma
// prisma/schema.prisma에 추가
model UserReport {
  id         String   @id @default(uuid()) @db.Uuid
  reportedId String   @map("reported_id") @db.Uuid
  reporterId String   @map("reporter_id") @db.Uuid
  reason     String
  description String?
  status     String   @default("pending") // pending, reviewed, resolved, dismissed
  reviewedBy String?  @map("reviewed_by") @db.Uuid
  reviewedAt DateTime? @map("reviewed_at")
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  @@index([reportedId])
  @@index([reporterId])
  @@index([status])
  @@map("user_reports")
}

model UserActivity {
  id       String   @id @default(uuid()) @db.Uuid
  userId   String   @map("user_id") @db.Uuid
  action   String   // login, logout, project_create, project_update, comment_create, admin_action
  metadata Json?    // 추가 정보 (변경 내용, 대상 등)
  ipAddress String? @map("ip_address")
  userAgent String? @map("user_agent")
  
  createdAt DateTime @default(now()) @map("created_at")
  
  @@index([userId])
  @@index([action])
  @@index([createdAt])
  @@map("user_activities")
}
```

#### 2. 마이그레이션 실행
```bash
# 마이그레이션 생성
npx prisma migrate dev --name add_user_reports_and_activities

# 클라이언트 재생성
npx prisma generate
```

### 서비스 레이어 업데이트

#### 1. AdminUserService 신고 및 활동 기능 추가
```typescript
// lib/admin/user-service.ts (Phase 2 확장)
export class AdminUserService {
  // 기존 getUsers 메소드에 신고 수 추가
  static async getUsers(filters: UserFilters): Promise<AdminUser[]> {
    const users = await prisma.user.findMany({
      include: { 
        projects: true,
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
    
    // 신고 수 일괄 조회
    const userIds = users.map(u => u.id)
    const reportCounts = await this.getReportCounts(userIds)
    
    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatarUrl || '',
      joinDate: user.createdAt,
      description: user.bio,
      projectCount: user._count.projects,
      
      // User 테이블에서 직접 가져온 어드민 필드
      role: user.role as 'user' | 'moderator' | 'admin',
      status: user.status as 'active' | 'inactive' | 'suspended' | 'banned',
      verified: user.verified,
      lastActive: user.lastActive || this.calculateLastActive(user),
      adminNotes: user.adminNotes,
      
      // 신고 수 (UserReport 테이블에서 계산)
      reportCount: reportCounts.get(user.id) || 0
    }))
  }
  
  // 신고 관련 메소드들
  static async createUserReport(
    reportedId: string,
    reporterId: string,
    reason: string,
    description?: string
  ) {
    return await prisma.userReport.create({
      data: {
        reportedId,
        reporterId,
        reason,
        description
      }
    })
  }
  
  static async getReports(filters: ReportFilters = {}) {
    return await prisma.userReport.findMany({
      where: {
        status: filters.status,
        reportedId: filters.reportedId
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0
    })
  }
  
  static async updateReportStatus(
    reportId: string,
    status: 'pending' | 'reviewed' | 'resolved' | 'dismissed',
    reviewedBy: string
  ) {
    return await prisma.userReport.update({
      where: { id: reportId },
      data: {
        status,
        reviewedBy,
        reviewedAt: new Date()
      }
    })
  }
  
  // 활동 로깅 메소드들
  static async logActivity(
    userId: string,
    action: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ) {
    return await prisma.userActivity.create({
      data: {
        userId,
        action,
        metadata,
        ipAddress,
        userAgent
      }
    })
  }
  
  static async getRecentActivities(userId?: string, limit = 50) {
    return await prisma.userActivity.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }
  
  // lastActive 업데이트
  static async updateLastActive(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { lastActive: new Date() }
    })
  }
  
  private static async getReportCounts(userIds: string[]): Promise<Map<string, number>> {
    const reports = await prisma.userReport.groupBy({
      by: ['reportedId'],
      where: { 
        reportedId: { in: userIds },
        status: { in: ['pending', 'reviewed'] }
      },
      _count: { reportedId: true }
    })
    
    return new Map(reports.map(r => [r.reportedId, r._count.reportedId]))
  }
  
  // 기존 메소드들 유지...
}
```

#### 2. Server Actions 신고 및 활동 기능 추가
```typescript
// src/lib/actions/admin/users.ts (Phase 2 확장)

import { UserRole, UserStatus } from '@prisma/client'

// 신고 관련 액션들
export async function createUserReportAction(
  reportedId: string,
  reason: string,
  description?: string
) {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('로그인이 필요합니다')
    
    await AdminUserService.createUserReport(reportedId, user.id, reason, description)
    
    // 활동 로그 기록
    await AdminUserService.logActivity(user.id, 'user_report_create', {
      reportedId,
      reason
    })
    
    return { success: true, message: '신고가 접수되었습니다' }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateReportStatusAction(
  reportId: string,
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
) {
  try {
    const admin = await requireAdminPermission()
    
    await AdminUserService.updateReportStatus(reportId, status, admin.id)
    
    // 활동 로그 기록
    await AdminUserService.logActivity(admin.id, 'user_report_review', {
      reportId,
      newStatus: status
    })
    
    revalidatePath('/admin/reports')
    return { success: true, message: '신고 상태가 변경되었습니다' }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// 기존 액션들에 활동 로깅 추가
export async function updateUserStatusAction(userId: string, status: UserStatus) {
  try {
    const admin = await requireAdminPermission()
    
    await AdminUserService.updateUserStatus(userId, status)
    
    // 활동 로그 기록
    await AdminUserService.logActivity(admin.id, 'admin_user_status_update', {
      targetUserId: userId,
      newStatus: status
    })
    
    revalidatePath('/admin/users')
    return { success: true, message: '사용자 상태가 변경되었습니다' }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateUserRoleAction(userId: string, role: UserRole) {
  try {
    const admin = await requireAdminPermission()
    
    // 어드민만 어드민 역할 부여 가능
    if (role === UserRole.admin && admin.role !== UserRole.admin) {
      throw new Error('어드민만 어드민 역할을 부여할 수 있습니다')
    }
    
    await AdminUserService.updateUserRole(userId, role)
    
    // 활동 로그 기록
    await AdminUserService.logActivity(admin.id, 'admin_user_role_update', {
      targetUserId: userId,
      newRole: role
    })
    
    revalidatePath('/admin/users')
    return { success: true, message: '사용자 역할이 변경되었습니다' }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// 활동 조회 액션
export async function getRecentActivitiesAction(userId?: string) {
  try {
    await requireAdminPermission()
    
    const activities = await AdminUserService.getRecentActivities(userId)
    return { success: true, data: activities }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
```

### Phase 2 완료 시 기능
- ✅ 사용자 신고 시스템 (생성, 조회, 상태 변경)
- ✅ 활동 로그 기록 및 추적
- ✅ 신고 수 실시간 계산 및 표시
- ✅ 관리자 액션 모니터링
- ✅ 사용자별 활동 내역 조회
- ✅ 신고 관리 페이지 기능

---

## ⚡ Phase 3: 성능 최적화 및 고급 기능 (1개월)

### 목표
대용량 데이터 처리, 실시간 기능, 성능 최적화

### 1. Redis 캐싱 도입
```typescript
// lib/cache/redis.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

export class UserCache {
  static async getUserMeta(userId: string): Promise<UserMeta | null> {
    const cached = await redis.get(`user:meta:${userId}`)
    if (cached) return JSON.parse(cached)
    
    const meta = await prisma.userMeta.findUnique({ where: { userId } })
    if (meta) {
      await redis.setex(`user:meta:${userId}`, 3600, JSON.stringify(meta))
    }
    return meta
  }
  
  static async invalidateUserMeta(userId: string) {
    await redis.del(`user:meta:${userId}`)
  }
  
  static async updateLastActive(userId: string) {
    const now = new Date().toISOString()
    await redis.setex(`user:last_active:${userId}`, 300, now) // 5분 캐시
  }
}
```

### 2. 실시간 활동 추적
```typescript
// lib/middleware/activity-tracker.ts
export async function trackUserActivity(
  req: NextRequest,
  action: string,
  metadata?: Record<string, any>
) {
  const user = await getCurrentUser()
  if (!user) return
  
  // 비동기로 활동 기록 (성능 영향 최소화)
  Promise.resolve().then(async () => {
    await UserCache.updateLastActive(user.id)
    
    await prisma.userActivity.create({
      data: {
        id: generateUUID(),
        userId: user.id,
        action,
        metadata,
        ipAddress: req.ip,
        userAgent: req.headers.get('user-agent')
      }
    })
  })
}
```

### 3. 고급 검색 및 필터링
```typescript
// lib/admin/search.ts
export class UserSearchService {
  static async searchUsers(query: string, filters: AdvancedFilters) {
    // Elasticsearch 또는 PostgreSQL Full-Text Search 활용
    const searchResults = await prisma.$queryRaw`
      SELECT u.*, 
             ts_rank(to_tsvector('korean', u.username || ' ' || u.email), plainto_tsquery('korean', ${query})) as rank
      FROM users u
      WHERE to_tsvector('korean', u.username || ' ' || u.email) @@ plainto_tsquery('korean', ${query})
      ORDER BY rank DESC
      LIMIT 50
    `
    
    return searchResults
  }
}
```

### 4. 실시간 대시보드 업데이트
```typescript
// lib/admin/dashboard.ts
export class AdminDashboard {
  static async getRealtimeStats() {
    // Redis에서 실시간 통계 조회
    const [
      activeUsers,
      pendingReports,
      newSignups,
      totalUsers
    ] = await Promise.all([
      this.getActiveUserCount(),
      this.getPendingReportCount(),
      this.getNewSignupCount(),
      this.getTotalUserCount()
    ])
    
    return { activeUsers, pendingReports, newSignups, totalUsers }
  }
  
  private static async getActiveUserCount() {
    // 지난 24시간 내 활동한 사용자 수
    const count = await redis.scard('active_users:24h')
    return count
  }
}
```

### Phase 3 완료 시 기능
- ✅ Redis 기반 고성능 캐싱 (User 테이블 최적화)
- ✅ 실시간 사용자 활동 추적
- ✅ 고급 검색 엔진 (Full-Text Search)
- ✅ 실시간 대시보드 통계
- ✅ 대용량 데이터 최적화 처리
- ✅ 모니터링 및 알림 시스템

---

## 📈 성능 벤치마크 목표

| 기능 | Phase 1 | Phase 2 | Phase 3 |
|------|---------|---------|---------|
| 사용자 목록 로딩 | 2-3초 | 1-2초 | <500ms |
| 상태 변경 | N/A | 1-2초 | <200ms |
| 검색 | 3-5초 | 1-2초 | <100ms |
| 실시간 업데이트 | N/A | N/A | 실시간 |

## 🔒 보안 고려사항

### 데이터 보호
- 모든 어드민 작업 로그 기록
- 민감한 데이터 암호화 저장
- API 엔드포인트 권한 검증

### 접근 제어
```typescript
// lib/auth/permissions.ts
export const ADMIN_PERMISSIONS = {
  VIEW_USERS: 'admin.users.view',
  EDIT_USER_STATUS: 'admin.users.status.edit',
  EDIT_USER_ROLE: 'admin.users.role.edit',
  DELETE_USER: 'admin.users.delete',
  VIEW_REPORTS: 'admin.reports.view',
  RESOLVE_REPORTS: 'admin.reports.resolve'
} as const

export async function hasPermission(user: User, permission: string): Promise<boolean> {
  const meta = await AdminUserService.getUserMeta(user.id)
  
  const rolePermissions = {
    admin: Object.values(ADMIN_PERMISSIONS),
    moderator: [
      ADMIN_PERMISSIONS.VIEW_USERS,
      ADMIN_PERMISSIONS.EDIT_USER_STATUS,
      ADMIN_PERMISSIONS.VIEW_REPORTS,
      ADMIN_PERMISSIONS.RESOLVE_REPORTS
    ],
    user: []
  }
  
  return rolePermissions[meta.role]?.includes(permission) || false
}
```

## 🚨 롤백 계획

각 Phase별 롤백 전략:

### Phase 1 → 원상복구
- 설정 파일 제거
- Server Actions 비활성화
- UI 컴포넌트를 mock 데이터로 복원

### Phase 2 → Phase 1
```sql
-- 새로 추가된 테이블만 제거
DROP TABLE IF EXISTS user_activities;
DROP TABLE IF EXISTS user_reports;

-- User 테이블의 어드민 필드는 유지 (데이터 손실 방지)
-- 필요시 개별적으로 제거:
-- ALTER TABLE users DROP COLUMN role;
-- ALTER TABLE users DROP COLUMN status;
-- ALTER TABLE users DROP COLUMN verified;
-- ALTER TABLE users DROP COLUMN last_active;
-- ALTER TABLE users DROP COLUMN admin_notes;
```

### Phase 3 → Phase 2
- Redis 캐시 무효화
- 실시간 기능 비활성화
- 기본 데이터베이스 쿼리로 복원

## ✅ 체크리스트

### Phase 1 완료 확인
- [ ] User 테이블에 enum 기반 어드민 필드 추가 (UserRole, UserStatus enums)
- [ ] 마이그레이션 실행 및 Prisma 클라이언트 재생성
- [ ] AdminUserService 구현 (src/lib/admin/user-service.ts)
- [ ] Server Actions 구현 (src/lib/actions/admin/users.ts)
- [ ] 권한 체크 시스템 (src/lib/auth/admin.ts)
- [ ] 타입 정의 (src/types/admin.ts)
- [ ] 동적 사용자 상태/역할 변경 기능 (enum 타입 안전성)

### Phase 2 완료 확인
- [ ] UserReport, UserActivity 테이블 추가
- [ ] 신고 시스템 구현 (생성, 조회, 상태 변경)
- [ ] 활동 로그 기록 시스템
- [ ] 신고 수 계산 및 표시
- [ ] 관리자 액션 모니터링

### Phase 3 완료 확인
- [ ] Redis 캐싱 시스템 도입
- [ ] 실시간 활동 추적
- [ ] 고급 검색 엔진 구현
- [ ] 실시간 대시보드 통계
- [ ] 성능 최적화 완료

---

## 📞 지원 및 문의

마이그레이션 과정에서 문제가 발생하거나 추가 기능이 필요한 경우:

1. **기술적 이슈**: GitHub Issues 생성
2. **긴급 문제**: 개발팀 직접 연락
3. **기능 요청**: 제품 백로그에 추가

---

*이 문서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다.*