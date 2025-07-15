# lib/ Directory Guide

This directory contains core utility functions, data management, and business logic for the Vivvers platform.

## Directory Structure

```
lib/
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