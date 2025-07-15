# Comment CRUD Server Actions

This directory contains comprehensive server actions for comment CRUD operations in the Vivvers project showcase platform.

## Files Overview

### 1. `comment-create.ts`
- **Purpose**: Create new comments and replies
- **Features**:
  - User authentication validation
  - Project existence check
  - Parent comment validation for replies
  - UUID generation for comment IDs
  - Automatic repliesCount increment for parent comments
  - Proper error handling with typed responses

### 2. `comment-get.ts`
- **Purpose**: Retrieve comments with pagination and filtering
- **Features**:
  - Paginated comment retrieval
  - Multiple sorting options (latest, oldest, mostLiked)
  - User like status integration
  - Nested replies support (up to 3 replies preloaded)
  - Performance optimized queries
  - Support for both main comments and specific parent replies

### 3. `comment-update.ts`
- **Purpose**: Update existing comment content
- **Features**:
  - Author authorization check
  - Content validation
  - Duplicate content prevention
  - Proper error handling

### 4. `comment-delete.ts`
- **Purpose**: Delete comments with cascade handling
- **Features**:
  - Author authorization check
  - Cascade deletion of replies
  - Automatic like cleanup
  - Parent comment repliesCount update
  - Transaction-based operations for data consistency

### 5. `comment-like.ts`
- **Purpose**: Toggle comment likes
- **Features**:
  - Like/unlike functionality
  - Like count updates
  - User authentication required
  - Prevents duplicate likes

### 6. `index.ts`
- **Purpose**: Central export file for all comment actions
- **Features**:
  - Clean imports for consumers
  - Type exports for TypeScript support

## Validation Schema

### `src/lib/validations/comment.ts`
- **commentContentSchema**: 1-500 characters with trim
- **createCommentSchema**: Content, projectId, optional parentId
- **updateCommentSchema**: Comment ID and new content
- **deleteCommentSchema**: Comment ID
- **getCommentsSchema**: Pagination and sorting parameters
- **commentLikeSchema**: Comment ID for like operations

## Types and Interfaces

### Response Types
- `CreateCommentResponse`: Success/error with comment data
- `GetCommentsResponse`: Success/error with paginated comments
- `UpdateCommentResponse`: Success/error with updated comment
- `DeleteCommentResponse`: Success/error with deletion stats
- `CommentLikeResponse`: Success/error with like status

### Data Types
- `CommentWithAuthor`: Full comment with author information
- `CommentsResponse`: Paginated comments with metadata

## Usage Examples

### Create a Comment
```typescript
import { createComment } from '@/lib/actions/comment'

const result = await createComment({
  content: "Great project!",
  projectId: "project-uuid",
  parentId: null // or parent comment ID for replies
})
```

### Get Comments
```typescript
import { getProjectComments } from '@/lib/actions/comment'

const result = await getProjectComments({
  projectId: "project-uuid",
  page: 1,
  limit: 10,
  sortBy: 'latest'
})
```

### Update Comment
```typescript
import { updateComment } from '@/lib/actions/comment'

const result = await updateComment({
  id: "comment-uuid",
  content: "Updated content"
})
```

### Delete Comment
```typescript
import { deleteComment } from '@/lib/actions/comment'

const result = await deleteComment({
  id: "comment-uuid"
})
```

### Toggle Like
```typescript
import { toggleCommentLike } from '@/lib/actions/comment'

const result = await toggleCommentLike({
  commentId: "comment-uuid"
})
```

## Security Features

- **Authentication**: All operations require valid user authentication
- **Authorization**: Users can only edit/delete their own comments
- **Validation**: All inputs are validated using Zod schemas
- **SQL Injection**: Protected by Prisma ORM
- **Rate Limiting**: Can be added at the API level

## Performance Optimizations

- **Selective Queries**: Only fetch required fields
- **Pagination**: Efficient pagination with skip/take
- **Nested Queries**: Optimized includes for author and like data
- **Transactions**: Ensure data consistency for complex operations
- **Indexing**: Database indexes on key fields (projectId, authorId, etc.)

## Error Handling

All actions return standardized response objects with:
- `success`: Boolean indicating operation success
- `data`: Result data (if successful)
- `error`: Error message (if failed)

Error types handled:
- Validation errors (Zod)
- Database errors (Prisma)
- Authentication errors
- Authorization errors
- Not found errors

## Dependencies

- `@/lib/supabase/server`: User authentication
- `@/lib/prisma/client`: Database operations
- `@/lib/validations/comment`: Input validation
- `zod`: Schema validation
- `crypto.randomUUID()`: UUID generation

## Testing Considerations

The actions are designed to be easily testable with:
- Mock Supabase authentication
- Mock Prisma database operations
- Clear input/output interfaces
- Isolated business logic

## Future Enhancements

- Comment reactions (beyond likes)
- Comment threading levels
- Comment moderation features
- Rich text content support
- Comment notifications
- Bulk operations