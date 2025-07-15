# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL REMINDERS - MUST READ FIRST

### Code Quality Checks
**ALWAYS run these commands after ANY code changes:**
1. `npm run typecheck` - Check TypeScript errors
2. `npm run lint` - Check code style and potential issues

**NEVER complete a task without running both commands and fixing all errors.**

### Development Server Policy
**NEVER start or stop the development server without explicit user permission.**
- DO NOT run `npm run dev` unless user specifically requests it
- DO NOT stop existing development servers unless user asks
- ALWAYS ask for permission before starting/stopping servers

### Icon Usage Policy
**NEVER use emojis in code or documentation. ALWAYS use Lucide React icons.**
- Import icons from `lucide-react` package
- Use semantic icon names (e.g., `AlertTriangle`, `CheckCircle`, `Info`)
- Apply consistent sizing with Tailwind classes (e.g., `h-4 w-4`, `h-5 w-5`)
- Example: `<AlertTriangle className="h-5 w-5 text-red-500" />` instead of "🚨"

### Workflow
1. Make code changes
2. Run `npm run typecheck` 
3. Fix any TypeScript errors
4. Run `npm run lint`
5. Fix any linting issues
6. Only then consider the task complete

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack (fast refresh)
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code checking
- `npm run typecheck` - Check TypeScript errors without compilation

### Component Development
- `npx shadcn@latest add [component]` - Add shadcn/ui components
- Components are installed to `src/components/ui/`

## Project Architecture

### Framework Structure
This is a **Next.js 15 App Router** project with TypeScript, targeting a Korean audience for a project showcase platform called "Vivvers" (바이브 코딩 프로젝트 홍보 플랫폼).

### Key Architecture Patterns

**App Router Convention:**
- `src/app/layout.tsx` - Root layout with theme provider and Korean locale
- `src/app/page.tsx` - Home page component
- Use Server Components by default, Client Components only when necessary

**Component Organization:**
- `src/components/ui/` - shadcn/ui components (auto-generated)
- `src/components/` - Custom reusable components
- `src/lib/utils.ts` - Utility functions including `cn()` helper

**Styling System:**
- **Tailwind CSS v3** with custom design tokens via CSS variables
- **Dark mode default** with `next-themes` provider
- HSL color system with comprehensive theme variables
- `@apply` directives in `globals.css` for base styles

### Configuration Files

**Tailwind Configuration (`tailwind.config.js`):**
- Dark mode via `class` strategy
- Custom color palette using `hsl(var(--color))` pattern
- Border radius system with CSS custom properties
- Includes `tailwindcss-animate` plugin

**Component Configuration (`components.json`):**
- shadcn/ui configured with `@/` path aliases
- CSS variables enabled for theming
- Slate color scheme as base

**TypeScript Setup:**
- Path alias: `@/*` maps to `./src/*`
- Strict mode enabled
- ES2017 target

### Theme System

The project uses a sophisticated theme system:
- Light/dark modes with system preference detection
- CSS custom properties for all colors
- HSL values for better color manipulation
- `ThemeProvider` wraps the entire app in root layout

### Development Principles

**Server-First Approach:**
- Prioritize Server Components over Client Components
- Use `"use client"` directive only when necessary for interactivity
- **Prefer Server Actions** for form submissions and data mutations over API routes

**Type Safety:**
- Full TypeScript coverage
- Proper typing for all components and utilities
- **Zod** for schema validation and type inference

**Korean Localization:**
- HTML lang set to "ko"
- Korean metadata and content
- Consider Korean UX patterns

### Code Organization

**Import Patterns:**
```typescript
import { cn } from "@/lib/utils"           // Utility functions
import { Button } from "@/components/ui/button"  // UI components
import { ThemeProvider } from "@/components/theme-provider"  // Custom components
import { z } from "zod"                    // Schema validation
```

**Component Patterns:**
- Use functional components with TypeScript
- Leverage `cn()` utility for conditional class names
- Follow shadcn/ui patterns for consistency

### Current State

This is an early-stage project with:
- Complete development environment setup
- Theme system implementation
- Basic routing structure
- Hello World page as starting point

The codebase is ready for building the full project showcase platform with proper foundation for user authentication, project uploads, search functionality, and social features as outlined in the project vision.

## Project Structure Plan

### Folder Structure
```
src/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # 인증 관련 페이지 그룹
│   │   ├── signin/
│   │   └── signup/
│   ├── project/           # 개별 프로젝트 페이지
│   │   └── [id]/
│   ├── profile/           # 사용자 프로필
│   │   └── [username]/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx           # 메인 홈페이지 (프로젝트 목록 + 검색)
├── components/
│   ├── ui/                # shadcn/ui 컴포넌트
│   ├── common/            # 공통 컴포넌트
│   ├── auth/              # 인증 관련
│   ├── project/           # 프로젝트 관련
│   └── profile/           # 프로필 관련
├── lib/
│   ├── data/              # Mock 데이터
│   │   ├── projects.ts    # 프로젝트 목 데이터
│   │   ├── users.ts       # 사용자 목 데이터
│   │   └── categories.ts  # 카테고리/태그 목 데이터
│   ├── mock-api/          # Mock API 함수들
│   │   ├── projects.ts    # 프로젝트 관련 API 함수
│   │   ├── users.ts       # 사용자 관련 API 함수
│   │   └── auth.ts        # 인증 관련 API 함수
│   ├── validations.ts     # Zod 스키마 검증
│   ├── constants.ts       # 상수 정의
│   └── utils.ts           # 유틸리티 함수
├── hooks/                 # 커스텀 훅
├── types/                 # TypeScript 타입 정의
└── store/                 # 상태 관리
```

### Development Approach

**Mock Data Based Development:**
- Use realistic mock data for initial development
- Mock API functions with Promise-based async operations
- Local storage for data persistence simulation
- Easy transition to real backend APIs later

**Key Pages:**
- `/` - 홈페이지 (프로젝트 그리드 + 검색/필터)
- `/signin`, `/signup` - 인증 페이지
- `/project/[id]` - 프로젝트 상세 페이지
- `/profile/[username]` - 사용자 프로필 및 프로젝트 목록

**Component Strategy:**
- Server Components by default for pages
- Client Components only for interactive features
- Reusable component patterns following shadcn/ui conventions

## Naming Conventions

### File & Component Naming

**Component Files (kebab-case):**
```
src/components/ui/
├── button.tsx              # Button 컴포넌트
├── card.tsx                # Card 컴포넌트
├── badge.tsx               # Badge 컴포넌트
└── dialog.tsx              # Dialog 컴포넌트

src/components/project/
├── project-card.tsx        # ProjectCard 컴포넌트
├── project-grid.tsx        # ProjectGrid 컴포넌트
├── project-form.tsx        # ProjectForm 컴포넌트
└── image-carousel.tsx      # ImageCarousel 컴포넌트

src/components/forms/
├── search-bar.tsx          # SearchBar 컴포넌트
├── tag-input.tsx           # TagInput 컴포넌트
└── file-uploader.tsx       # FileUploader 컴포넌트
```

**Component Classes (PascalCase):**
```typescript
// project-card.tsx
export function ProjectCard() {}
export default ProjectCard

// search-bar.tsx  
export function SearchBar() {}
export default SearchBar

// file-uploader.tsx
export function FileUploader() {}
export default FileUploader
```

**Props Interfaces (PascalCase):**
```typescript
// project-card.tsx
interface ProjectCardProps {
  project: Project
  variant?: 'grid' | 'list' | 'featured'
  onLike?: () => void
}

// search-bar.tsx
interface SearchBarProps {
  placeholder?: string
  value?: string
  onSearch?: (value: string) => void
}
```

### Import/Export Patterns

**Individual Imports:**
```typescript
// kebab-case 파일명에서 PascalCase 컴포넌트 import
import { ProjectCard } from '@/components/project/project-card'
import { SearchBar } from '@/components/forms/search-bar'
import { Button } from '@/components/ui/button'
```

**Index File Exports:**
```typescript
// components/ui/index.ts
export { Button } from './button'
export { Card } from './card'
export { Badge } from './badge'

// components/project/index.ts  
export { ProjectCard } from './project-card'
export { ProjectGrid } from './project-grid'

// Usage
import { Button, Card, Badge } from '@/components/ui'
import { ProjectCard, ProjectGrid } from '@/components/project'
```

### Variable & Function Naming

**State Variables:**
```typescript
const [isLoading, setIsLoading] = useState(false)
const [projects, setProjects] = useState<Project[]>([])
const [selectedTags, setSelectedTags] = useState<string[]>([])
```

**Event Handlers:**
```typescript
const handleSubmit = () => {}
const handleProjectLike = () => {}
const handleTagSelect = () => {}

// Props로 전달될 때
onSubmit?: () => void
onProjectLike?: (id: string) => void
```

**Business Logic Functions:**
```typescript
function uploadProject() {}
function validateForm() {}
function getProjects() {}
function isValidEmail() {}
```

### File Structure Naming

**Pages (App Router - kebab-case):**
```
app/
├── projects/page.tsx
├── user-profile/page.tsx  
├── project-upload/page.tsx
```

**Utilities & Hooks (camelCase):**
```
lib/
├── utils.ts
├── validations.ts
hooks/
├── use-projects.ts
├── use-auth.ts
```

**Types & Constants:**
```markdown
// types (camelCase files, PascalCase interfaces)
types/
├── project.ts              # Project, ProjectStatus 타입
├── user.ts                 # User, UserProfile 타입

// constants (SCREAMING_SNAKE_CASE)
constants/
├── categories.ts           # PROJECT_CATEGORIES, API_ENDPOINTS
├── config.ts              # DEFAULT_PAGE_SIZE, MAX_IMAGE_COUNT
```

### Benefits of This Convention

- **File names**: kebab-case는 URL과 일치하고 Linux/Unix 시스템에서 안전
- **Component names**: PascalCase는 React 컨벤션 유지
- **IDE 친화적**: 파일 찾기와 자동완성이 쉬움
- **일관성**: 전체 프로젝트에서 예측 가능한 네이밍