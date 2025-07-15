# Project Display Components

A comprehensive set of React components for displaying project cards, grids, and pagination for the Vivvers homepage.

## Components Overview

### 1. ProjectCard (`project-card.tsx`)

Individual project card component with:
- Project thumbnail image with hover effects
- Project title, description (2 lines max)
- Author avatar and name
- Category badge and upload date
- Tags display (max 3 visible)
- Like and view counts with icons
- Featured project badge
- Responsive design with hover animations

```tsx
import { ProjectCard } from '@/components/project'

<ProjectCard 
  project={projectData} 
  className="optional-custom-class"
/>
```

### 2. ProjectGrid (`project-grid.tsx`)

Responsive grid layout component:
- 4 columns on desktop (xl)
- 3 columns on large screens (lg)
- 2 columns on tablets (md)
- 1 column on mobile
- Loading state support
- Empty state handling
- Auto-adjusting card heights

```tsx
import { ProjectGrid } from '@/components/project'

<ProjectGrid 
  projects={projectsArray}
  loading={isLoading}
  className="optional-custom-class"
/>
```

### 3. ProjectSkeleton (`project-skeleton.tsx`)

Loading skeleton for project cards:
- Matches ProjectCard layout exactly
- Animated pulse effect
- Configurable count
- Responsive design

```tsx
import { ProjectSkeleton } from '@/components/project'

<ProjectSkeleton 
  count={12}
  className="optional-custom-class"
/>
```

### 4. Pagination (`pagination.tsx`)

Advanced pagination component:
- Smart page number display with ellipsis
- Previous/Next navigation
- Accessible keyboard navigation
- Page info display
- Responsive design

```tsx
import { Pagination } from '@/components/project'

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  className="optional-custom-class"
/>
```

## Data Structure

### Project Type Definition

```typescript
interface Project {
  id: string
  title: string
  description: string
  thumbnail: string
  author: User
  category: string
  tags: string[]
  likeCount: number
  viewCount: number
  uploadDate: string
  featured?: boolean
}

interface User {
  id: string
  name: string
  username: string
  avatar: string
}
```

## Mock Data

50 realistic projects are available in `/src/lib/data/projects.ts`:

```typescript
import { getProjects, getFeaturedProjects, mockProjects } from '@/lib/data/projects'

// Get paginated projects
const { projects, totalPages, currentPage } = getProjects(1, 12)

// Get featured projects only
const featured = getFeaturedProjects()

// Get all projects
const all = mockProjects
```

## Usage Example

```tsx
'use client'

import React, { useState } from 'react'
import { ProjectGrid, Pagination } from '@/components/project'
import { getProjects } from '@/lib/data/projects'

export const ProjectPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const { projects, totalPages } = getProjects(currentPage, 12)

  const handlePageChange = (page: number) => {
    setLoading(true)
    setCurrentPage(page)
    // Fetch new data...
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      <ProjectGrid 
        projects={projects} 
        loading={loading} 
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
```

## Styling & Design System

- Uses existing Tailwind CSS design system
- Follows established color tokens (card, border, muted, etc.)
- Responsive breakpoints: mobile → tablet (md) → desktop (lg) → large (xl)
- Dark mode support through CSS custom properties
- Hover animations and transitions
- Accessible focus states

## Features

### ProjectCard Features:
- ✅ Responsive thumbnail with aspect ratio 16:10
- ✅ Hover effects (scale transform, shadow increase)
- ✅ Category badges
- ✅ Tag display with overflow handling
- ✅ Like/view count formatting (1.2k for 1200)
- ✅ Author avatar and name
- ✅ Upload date formatting
- ✅ Featured badge for special projects
- ✅ Accessible markup

### ProjectGrid Features:
- ✅ Responsive grid layout
- ✅ Loading skeleton integration
- ✅ Empty state with custom EmptyState component
- ✅ Equal height cards
- ✅ Proper spacing and gaps

### Pagination Features:
- ✅ Smart ellipsis for large page counts
- ✅ Keyboard navigation support
- ✅ Previous/Next buttons with icons
- ✅ Current page highlighting
- ✅ Page info display
- ✅ Disabled states
- ✅ Accessible ARIA labels

## File Structure

```
src/
├── components/
│   └── project/
│       ├── index.ts              # Barrel exports
│       ├── project-card.tsx      # Individual card
│       ├── project-grid.tsx      # Grid layout
│       ├── project-skeleton.tsx  # Loading state
│       ├── pagination.tsx        # Pagination
│       ├── example-usage.tsx     # Example implementation
│       └── README.md            # This file
├── types/
│   └── project.ts               # TypeScript definitions
└── lib/
    └── data/
        └── projects.ts          # Mock data & helpers
```

## Browser Support

- ✅ Modern browsers with CSS Grid support
- ✅ WebKit line-clamp for text truncation
- ✅ CSS custom properties for theming
- ✅ Next.js Image optimization

## Performance Considerations

- Uses Next.js Image component for optimized loading
- Responsive image sizing with `sizes` attribute
- CSS-only animations (transform, opacity)
- Efficient re-renders with proper key props
- Lazy loading for images below the fold