# Comment System Components

This directory contains the basic UI components for a comment system with the following features:

## Components

### 1. CommentForm
- **File**: `comment-form.tsx`
- **Purpose**: Comment input form with textarea and submit button
- **Features**:
  - Character count display (max 500 characters)
  - Loading state during submission
  - Validation and error handling
  - Support for both comments and replies

### 2. CommentList
- **File**: `comment-list.tsx`
- **Purpose**: Display list of comments with loading and empty states
- **Features**:
  - Loading skeleton
  - Empty state message
  - "Load more" functionality
  - Pagination support

### 3. CommentItem
- **File**: `comment-item.tsx`
- **Purpose**: Individual comment display with actions
- **Features**:
  - Author info (avatar, name, timestamp)
  - Like and reply functionality
  - Nested replies with indentation (max 3 levels)
  - Edit/Delete for comment owners
  - Time formatting (relative time)

### 4. CommentActions
- **File**: `comment-actions.tsx`
- **Purpose**: Action buttons for comments
- **Features**:
  - Like button with count
  - Reply button with count
  - Edit button (owner only)
  - Delete button (owner only)

### 5. CommentListSkeleton
- **File**: `comment-list-skeleton.tsx`
- **Purpose**: Loading skeleton for comment list
- **Features**:
  - Animated skeleton placeholders
  - Matches actual comment layout

### 6. CommentExample
- **File**: `comment-example.tsx`
- **Purpose**: Example usage of the comment system
- **Features**:
  - Complete comment system demonstration
  - Mock data integration
  - Form submission handling

## Usage

### Basic Usage

```tsx
import { CommentForm, CommentList } from '@/components/comment'

function ProjectComments({ projectId }: { projectId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: CommentFormData) => {
    // Handle comment submission
  }

  return (
    <div className="space-y-6">
      <CommentForm onSubmit={handleSubmit} />
      <CommentList 
        comments={comments} 
        isLoading={isLoading}
      />
    </div>
  )
}
```

### Example Page

Visit `/debug/comments` to see the comment system in action with mock data.

## Mock Data

The mock data and API functions are located in:
- `src/lib/mock-api/comments.ts` - Mock API functions
- `src/types/comment.ts` - TypeScript interfaces

## Types

### Comment Interface
```typescript
interface Comment {
  id: string
  content: string
  author: CommentAuthor
  likeCount: number
  repliesCount: number
  isLiked: boolean
  createdAt: Date
  replies?: Comment[]
}
```

### CommentAuthor Interface
```typescript
interface CommentAuthor {
  id: string
  username: string
  avatarUrl: string | null
}
```

## Features

- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Follows system theme
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Loading States**: Skeleton placeholders during data fetching
- **Error Handling**: Graceful error states
- **Nested Comments**: Support for replies with visual indentation
- **Real-time Updates**: Optimistic UI updates
- **Character Limits**: 500 character limit for comments

## Styling

- Uses Tailwind CSS for styling
- Follows shadcn/ui component patterns
- Consistent with existing design system
- Lucide React icons for actions

## Future Enhancements

- Real-time updates with WebSocket
- Emoji reactions
- Comment editing functionality
- Rich text support
- File attachments
- Comment moderation tools
- User mentions and notifications