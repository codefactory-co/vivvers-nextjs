# lib/ Directory Guide

This directory contains core utility functions, data management, and business logic for the Vivvers platform.

## ⚠️ CRITICAL WARNINGS - READ FIRST

### Prisma Client Policy
**🚨 NEVER create new Prisma clients. ALWAYS use the existing client from lib/prisma/client.ts.**
- **NEVER use `new PrismaClient()` directly in any file**
- **ALWAYS import from `@/lib/prisma/client`** 
- **NEVER use dynamic imports like `const { PrismaClient } = await import('@prisma/client')`**
- The centralized client ensures proper connection pooling and prevents connection leaks
- All database operations must go through the shared client instance

```typescript
// ❌ WRONG - Never do this
const prisma = new PrismaClient()
const { PrismaClient } = await import('@prisma/client')
const prisma = new PrismaClient()

// ✅ CORRECT - Always do this  
import { prisma } from '@/lib/prisma/client'
```

## Directory Structure

```
lib/
├── supabase/          # Supabase 관련 기능
│   ├── client.ts      # 브라우저용 Supabase 클라이언트
│   ├── server.ts      # 서버용 Supabase 클라이언트
│   ├── middleware.ts  # Supabase 미들웨어
│   └── storage.ts     # 파일 업로드/삭제 함수
├── data/              # Mock data for development
├── mock-api/          # API simulation functions
├── validations/       # Zod schemas (domain-separated)
│   ├── user.ts        # User 관련 스키마
│   ├── project.ts     # Project 관련 스키마
│   ├── auth.ts        # 인증 관련 스키마
│   ├── common.ts      # 공통 스키마 (email, url 등)
│   └── index.ts       # 모든 스키마 export
├── constants.ts       # Application constants
└── utils.ts           # Utility functions
```

## Key Principles

### Mock Data Strategy
- **Development-first**: All features start with mock data
- **Realistic data**: Use Korean names, realistic scenarios
- **Easy migration**: Structure matches future PostgreSQL schema
- **Type safety**: All data follows TypeScript interfaces

### API Pattern
- **Promise-based**: All mock API functions return Promises
- **Network simulation**: Include realistic delays (300-600ms)
- **Error handling**: Simulate real API error scenarios
- **CRUD operations**: Complete Create, Read, Update, Delete functionality

### Validation Strategy
- **Domain separation**: Organize Zod schemas by feature/domain
- **Reusable components**: Common schemas in `common.ts`
- **Server Actions**: Validate data in Server Actions before processing
- **Type inference**: Leverage Zod's type inference for TypeScript

## Validation Structure

### Domain-Specific Schemas
```typescript
// lib/validations/user.ts
export const userSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  bio: z.string().max(500).optional(),
  // ...
})

// lib/validations/project.ts  
export const projectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000),
  // ...
})
```

### Reusable Common Schemas
```typescript
// lib/validations/common.ts
export const emailSchema = z.string().email()
export const urlSchema = z.string().url()
export const uuidSchema = z.string().uuid()
```

### Convenient Exports
```typescript
// lib/validations/index.ts
export * from './user'
export * from './project'
export * from './auth'
export * from './common'

// Usage
import { userSchema, projectSchema } from '@/lib/validations'
```

## Usage Examples

### Mock API Usage
```typescript
import { getUsers, getUserByUsername } from '@/lib/mock-api/users'

// In Server Component
const users = await getUsers()

// In Server Action or API route
const user = await getUserByUsername('kimcoder')
```

### Validation Usage
```typescript
import { userSchema, emailSchema } from '@/lib/validations'

// Validate form data
const result = userSchema.safeParse(formData)
if (!result.success) {
  // Handle validation errors
}

// Use common schemas
const emailResult = emailSchema.safeParse(email)
```

## Development Workflow

1. **Define types** in `/types/` first
2. **Create mock data** in `/data/`
3. **Build API functions** in `/mock-api/`
4. **Add validation schemas** in `/validations/` (domain-separated)
5. **Use in components** via Server Components or Server Actions

## Prisma Integration Structure

When ready to integrate Prisma database:

```
lib/
├── prisma/
│   ├── client.ts           # Prisma client setup
│   ├── schema.prisma       # Database schema definition
│   └── seed.ts             # Database seeding
├── actions/                # Server Actions (domain + verb pattern)
│   ├── project/
│   │   ├── project-create.ts
│   │   ├── project-update.ts
│   │   ├── project-delete.ts
│   │   ├── project-like.ts
│   │   └── index.ts
│   ├── user/
│   │   ├── user-update-profile.ts
│   │   ├── user-follow.ts
│   │   └── index.ts
│   ├── auth/
│   │   ├── auth-signin.ts
│   │   ├── auth-signup.ts
│   │   └── index.ts
│   └── index.ts
├── services/               # Database access layer
│   ├── project.ts          # Project CRUD operations
│   ├── user.ts             # User CRUD operations
│   └── auth.ts             # Authentication operations
```

### Migration Path from Mock to Prisma

1. **Phase 1**: Add Prisma schema and client setup
2. **Phase 2**: Create services layer for database operations
3. **Phase 3**: Replace mock-api with Server Actions
4. **Phase 4**: Update components to use Server Actions
5. **Phase 5**: Remove mock-api and data directories

## Migration Path

When moving to real backend:
1. Replace mock-api functions with real API calls
2. Update data structures if needed (camelCase ↔ snake_case)
3. Keep validation schemas (they work with real APIs)
4. Update constants for production URLs/configs

## Benefits of This Structure

- **Easy to find**: Domain-specific schemas are clearly organized
- **Reusable**: Common patterns extracted to `common.ts`
- **Maintainable**: Each domain has its own validation file
- **Scalable**: Easy to add new domains without cluttering
- **IDE-friendly**: Better autocomplete and navigation