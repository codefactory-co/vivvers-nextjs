// Community types for the ultra-minimal community system

export interface CommunityPost {
  id: string
  title: string
  content: string
  contentHtml: string | null
  contentJson: unknown
  
  // 메타데이터
  viewsCount: number
  likesCount: number
  commentsCount: number
  
  // 관계
  authorId: string
  author: {
    id: string
    username: string
    avatarUrl: string | null
  }
  
  // 선택적 프로젝트 연결
  relatedProjectId: string | null
  relatedProject?: {
    id: string
    title: string
  } | null
  
  // 관련 데이터
  tags: CommunityPostTag[]
  likes: CommunityPostLike[]
  comments: CommunityPostComment[]
  
  createdAt: Date
  updatedAt: Date
}

export interface CommunityPostLike {
  id: string
  userId: string
  postId: string
  user: {
    id: string
    username: string
    avatarUrl: string | null
  }
  createdAt: Date
}

export interface CommunityPostComment {
  id: string
  content: string
  contentHtml: string | null
  contentJson: unknown
  
  // 관계
  postId: string
  authorId: string
  parentId: string | null
  
  author: {
    id: string
    username: string
    avatarUrl: string | null
  }
  
  // 상태
  likesCount: number
  repliesCount: number
  isBestAnswer: boolean
  
  // 관련 데이터
  replies: CommunityPostComment[]
  likes: CommunityPostCommentLike[]
  
  createdAt: Date
  updatedAt: Date
}

export interface CommunityPostCommentLike {
  id: string
  userId: string
  commentId: string
  user: {
    id: string
    username: string
    avatarUrl: string | null
  }
  createdAt: Date
}

export interface CommunityPostTag {
  id: string
  postId: string
  tagId: string
  tag: {
    id: string
    name: string
    slug: string
  }
  createdAt: Date
}

// Form types
export interface CommunityPostFormData {
  title: string
  content: string
  contentHtml: string
  contentJson: unknown
  tags: string[]
  relatedProjectId?: string
}

export interface CommunityCommentFormData {
  content: string
  contentHtml: string
  contentJson: unknown
  parentId?: string
}

// Props interfaces
export interface CommunityPostCardProps {
  post: CommunityPost
  currentUserId?: string
  className?: string
}

export interface CommunityPostGridProps {
  posts: CommunityPost[]
  currentUserId?: string
  loading?: boolean
  className?: string
}

export interface CommunityCommentItemProps {
  comment: CommunityPostComment
  currentUserId?: string
  onLike?: (commentId: string) => void
  onReply?: (commentId: string) => void
  onEdit?: (commentId: string) => void
  onDelete?: (commentId: string) => void
  onBestAnswer?: (commentId: string) => void
  depth?: number
}

export interface CommunityCommentListProps {
  comments: CommunityPostComment[]
  currentUserId?: string
  postAuthorId?: string  // For best answer selection
  onCommentLike?: (commentId: string) => void
  onCommentReply?: (commentId: string) => void
  onCommentEdit?: (commentId: string) => void
  onCommentDelete?: (commentId: string) => void
  onBestAnswer?: (commentId: string) => void
  loading?: boolean
  className?: string
}

// Filter and search types
export interface CommunityFilters {
  search?: string
  tags?: string[]
  sortBy?: 'latest' | 'popular' | 'mostCommented' | 'mostViewed'
  authorId?: string
  relatedProjectId?: string
}

export interface CommunitySearchParams {
  q?: string
  tags?: string
  sort?: string
  author?: string
  project?: string
  page?: string
}

// Response types for API
export interface CommunityPostsResponse {
  posts: CommunityPost[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface CommunityCommentsResponse {
  comments: CommunityPostComment[]
  total: number
}

// Action result types
export interface CommunityPostActionResult {
  success: boolean
  data?: {
    post: CommunityPost
  }
  error?: string
}

export interface CommunityCommentActionResult {
  success: boolean
  data?: {
    comment: CommunityPostComment
  }
  error?: string
}

export interface CommunityLikeActionResult {
  success: boolean
  data?: {
    isLiked: boolean
    likeCount: number
  }
  error?: string
}

// Extended user type with community stats
export interface UserWithCommunityStats {
  id: string
  username: string
  avatarUrl: string | null
  bio: string | null
  communityPostsCount: number
  helpfulAnswersCount: number
}