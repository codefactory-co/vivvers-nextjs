# Prisma Convention Guide

이 파일은 Vivvers 프로젝트의 Prisma 사용 규칙과 컨벤션을 정의합니다.

## 네이밍 컨벤션

### Model 네이밍
- **PascalCase** 사용
- 단수형으로 명명
- `@map`을 사용하여 PostgreSQL snake_case 테이블명으로 매핑

```prisma
model User {
  // fields...
  @@map("users")
}

model ProjectComment {
  // fields...
  @@map("project_comments")
}
```

### Property 네이밍
- **camelCase** 사용 (TypeScript/JavaScript 컨벤션)
- `@map`을 사용하여 PostgreSQL snake_case 컬럼명으로 매핑

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  firstName String?  @map("first_name")
  lastName  String?  @map("last_name")
  avatarUrl String?  @map("avatar_url")
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  @@map("users")
}
```

### Foreign Key 네이밍
- 관계 필드: camelCase (예: `authorId`)
- 데이터베이스 컬럼: snake_case (예: `author_id`)

```prisma
model Project {
  id       String @id @default(cuid())
  title    String
  authorId String @map("author_id")
  
  author   User   @relation(fields: [authorId], references: [id])
  
  @@map("projects")
}
```

## 필드 타입 컨벤션

### ID 필드
- `String` 타입 사용
- `@id` 만 설정 (자동 생성 없음)
- 애플리케이션에서 UUID v7 생성하여 삽입
- UUID v7은 시간 순서가 보장되어 성능상 유리

```prisma
model User {
  id String @id
  // ...
}
```

**UUID v7 생성은 애플리케이션 레벨에서 처리:**
```typescript
import { uuidv7 } from 'uuidv7'

// Server Action이나 Service에서
const userId = uuidv7()
await prisma.user.create({
  data: {
    id: userId,
    email: "user@example.com"
  }
})
```

### 타임스탬프 필드
- `createdAt`: `@default(now())` 사용
- `updatedAt`: `@updatedAt` 사용
- 모든 모델에 기본 포함

```prisma
model User {
  // other fields...
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
}
```

### 배열 필드
- PostgreSQL 배열 타입 활용
- 단순한 리스트는 배열로, 복잡한 관계는 별도 테이블로

```prisma
model Project {
  tags      String[] // 간단한 태그 리스트
  images    String[] // 이미지 URL 리스트
  techStack String[] @map("tech_stack") // 기술 스택 리스트
}
```

### 옵셔널 필드
- `?` 마크로 nullable 표시
- 비즈니스 로직에 따라 필수/선택 구분

```prisma
model User {
  email    String  @unique        // 필수
  bio      String?                // 선택
  avatarUrl String? @map("avatar_url") // 선택
}
```

## 인덱스 및 제약조건

### Unique 제약조건
- 단일 필드: `@unique`
- 복합 필드: `@@unique`

```prisma
model User {
  email    String @unique
  username String @unique
}

model Like {
  userId    String @map("user_id")
  projectId String @map("project_id")
  
  @@unique([userId, projectId])
  @@map("likes")
}
```

### 인덱스
- 자주 검색되는 필드에 `@@index` 추가
- 복합 인덱스는 쿼리 패턴에 맞게 구성

```prisma
model Project {
  category  String
  createdAt DateTime @default(now()) @map("created_at")
  
  @@index([category])
  @@index([createdAt])
  @@map("projects")
}
```

## 관계 정의

### One-to-Many 관계
```prisma
model User {
  id       String    @id
  projects Project[]
  
  @@map("users")
}

model Project {
  id       String @id
  authorId String @map("author_id")
  
  author   User   @relation(fields: [authorId], references: [id])
  
  @@map("projects")
}
```

### Many-to-Many 관계
- 명시적 중간 테이블 사용 (암시적 관계보다 제어력 높음)

```prisma
model User {
  id    String @id @default(cuid())
  likes Like[]
  
  @@map("users")
}

model Project {
  id    String @id @default(cuid())
  likes Like[]
  
  @@map("projects")
}

model Like {
  id        String @id
  userId    String @map("user_id")
  projectId String @map("project_id")
  
  user    User    @relation(fields: [userId], references: [id])
  project Project @relation(fields: [projectId], references: [id])
  
  createdAt DateTime @default(now()) @map("created_at")
  
  @@unique([userId, projectId])
  @@map("likes")
}
```

## 마이그레이션 컨벤션

### 마이그레이션 네이밍
```bash
# 개발 환경
npx prisma migrate dev --name add_user_bio

# 프로덕션 배포
npx prisma migrate deploy
```

### 스키마 변경 시 순서
1. `schema.prisma` 수정
2. `npx prisma generate` - 클라이언트 재생성
3. `npx prisma migrate dev` - 마이그레이션 생성/적용
4. 타입 체크 및 코드 업데이트

## 성능 최적화

### 쿼리 최적화
- `select`로 필요한 필드만 선택
- `include`/`select`로 관계 데이터 제어
- 페이지네이션에 `cursor` 기반 방식 사용

```typescript
// 좋은 예
const projects = await prisma.project.findMany({
  select: {
    id: true,
    title: true,
    author: {
      select: {
        username: true,
        avatarUrl: true
      }
    }
  },
  take: 20,
  cursor: { id: lastProjectId }
})
```

### N+1 쿼리 방지
- `include`로 관련 데이터 미리 로드
- 필요한 경우에만 관계 데이터 포함

## 보안 고려사항

### 데이터 검증
- Prisma 스키마는 데이터베이스 레벨 제약조건
- 애플리케이션 레벨에서 Zod로 추가 검증 필요

### 민감 데이터
- 비밀번호, API 키 등은 별도 처리
- `@@map`으로 컬럼명 숨기기 가능

## 파일 구조

```
prisma/
├── schema.prisma           # 메인 스키마 파일
├── migrations/             # 자동 생성된 마이그레이션
│   ├── 20240101000000_init/
│   └── migration_lock.toml
├── seed.ts                 # 데이터 시딩 (필요시)
└── CLAUDE.md              # 이 컨벤션 가이드
```

## 주의사항

1. **스키마 수정 시 마이그레이션 필수**
   - 직접 데이터베이스 수정하지 말것
   - 항상 `prisma migrate` 사용

2. **프로덕션 마이그레이션 주의**
   - 백업 후 마이그레이션 실행
   - 대용량 데이터 변경 시 단계적 접근

3. **관계 설정 시 순환 참조 주의**
   - 필요한 경우 관계 이름 명시
   - 양방향 관계에서 `@relation(name: "...")`

## 확장 가능한 Like 시스템 설계

여러 모델에 대한 좋아요 기능을 구현할 때 사용하는 패턴입니다.

### 개별 테이블 방식 (추천)

각 리소스별로 별도의 Like 테이블을 생성하는 방식입니다.

**네이밍 컨벤션:**
- Model: `{ResourceName}Like` (PascalCase)
- Table: `{resource_name}_likes` (snake_case)

```prisma
// 프로젝트 좋아요
model ProjectLike {
  id        String @id
  userId    String @map("user_id")
  projectId String @map("project_id")
  
  user    User    @relation(fields: [userId], references: [id])
  project Project @relation(fields: [projectId], references: [id])
  
  createdAt DateTime @default(now()) @map("created_at")
  
  @@unique([userId, projectId])
  @@map("project_likes")
}

// 댓글 좋아요
model CommentLike {
  id        String @id
  userId    String @map("user_id")
  commentId String @map("comment_id")
  
  user    User    @relation(fields: [userId], references: [id])
  comment Comment @relation(fields: [commentId], references: [id])
  
  createdAt DateTime @default(now()) @map("created_at")
  
  @@unique([userId, commentId])
  @@map("comment_likes")
}

// 사용자 팔로우 (Like 시스템의 확장)
model UserFollow {
  id         String @id
  followerId String @map("follower_id")
  followeeId String @map("followee_id")
  
  follower User @relation("UserFollows", fields: [followerId], references: [id])
  followee User @relation("UserFollowed", fields: [followeeId], references: [id])
  
  createdAt DateTime @default(now()) @map("created_at")
  
  @@unique([followerId, followeeId])
  @@map("user_follows")
}
```

**관련 모델 관계 정의:**
```prisma
model User {
  id String @id
  
  // Like 관계들
  projectLikes ProjectLike[]
  commentLikes CommentLike[]
  
  // Follow 관계들
  following UserFollow[] @relation("UserFollows")
  followers UserFollow[] @relation("UserFollowed")
  
  @@map("users")
}

model Project {
  id    String        @id
  likes ProjectLike[]
  
  @@map("projects")
}

model Comment {
  id    String      @id
  likes CommentLike[]
  
  @@map("comments")
}
```

### 통합 테이블 방식 (대안)

하나의 테이블로 모든 Like를 관리하는 방식입니다.

```prisma
model Like {
  id         String @id
  userId     String @map("user_id")
  targetType String @map("target_type")   // "project", "comment", "user"
  targetId   String @map("target_id")
  
  user User @relation(fields: [userId], references: [id])
  
  createdAt DateTime @default(now()) @map("created_at")
  
  @@unique([userId, targetType, targetId])
  @@index([targetType, targetId])
  @@map("likes")
}
```

### 각 방식의 장단점

**개별 테이블 방식 (추천):**

**장점:**
- 타입 안전성 보장 (TypeScript에서 완전한 타입 추론)
- 각 관계에 특화된 제약조건 설정 가능
- 성능 최적화 용이 (인덱스, 파티셔닝)
- 스키마가 명확하고 이해하기 쉬움
- 각 도메인별 비즈니스 로직 분리 가능

**단점:**
- 테이블 수 증가
- 공통 로직 중복 가능성

**통합 테이블 방식:**

**장점:**
- 단일 테이블로 관리 용이
- 새로운 Like 대상 추가 시 스키마 변경 불필요

**단점:**
- 타입 안전성 부족
- 복잡한 제약조건 설정 어려움
- 성능 최적화 제한적

### 확장 예시

새로운 좋아요 대상이 추가될 때:

```prisma
// 포스트 좋아요 추가
model PostLike {
  id     String @id
  userId String @map("user_id")
  postId String @map("post_id")
  
  user User @relation(fields: [userId], references: [id])
  post Post @relation(fields: [postId], references: [id])
  
  createdAt DateTime @default(now()) @map("created_at")
  
  @@unique([userId, postId])
  @@map("post_likes")
}
```

### 권장사항

1. **개별 테이블 방식 사용** - 타입 안전성과 성능을 위해
2. **일관된 네이밍** - `{Resource}Like` → `{resource}_likes` 패턴 유지
3. **적절한 인덱스** - `@@unique([userId, targetId])` 필수
4. **타임스탬프** - `createdAt` 포함으로 좋아요 시점 추적