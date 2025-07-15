import { getCommunityPosts } from '@/lib/services/community'
import { CommunityPostGrid } from './community-post-grid'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'
import { CommunitySearchParams } from '@/types/community'
import { getUser } from '@/lib/supabase/server'
import Link from 'next/link'

interface CommunityFeedProps {
  searchParams: CommunitySearchParams
}

export async function CommunityFeed({ searchParams }: CommunityFeedProps) {
  const user = await getUser()
  
  const filters = {
    search: searchParams.q,
    tags: searchParams.tags?.split(','),
    sortBy: (searchParams.sort as 'latest' | 'popular' | 'mostCommented' | 'mostViewed') || 'latest',
  }

  const page = parseInt(searchParams.page || '1')
  const pageSize = 10

  try {
    const result = await getCommunityPosts({
      filters,
      page,
      pageSize
    })

    if (result.posts.length === 0) {
      return (
        <EmptyState
          icon={<MessageSquare className="w-full h-full" />}
          title="게시글이 없습니다"
          description={filters.search 
            ? "검색 조건에 맞는 게시글을 찾을 수 없습니다."
            : "첫 번째 게시글을 작성해보세요!"
          }
          action={
            <Button asChild>
              <Link href="/community/new">
                새 글 작성
              </Link>
            </Button>
          }
        />
      )
    }

    return (
      <div className="space-y-6">
        <CommunityPostGrid
          posts={result.posts}
          currentUserId={user?.id}
        />
        
        {/* Pagination would go here */}
        {result.hasMore && (
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              더 많은 게시글이 있습니다. 페이지네이션을 구현할 예정입니다.
            </p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Failed to load community posts:', error)
    
    return (
      <EmptyState
        icon={<MessageSquare className="w-full h-full" />}
        title="게시글을 불러올 수 없습니다"
        description="일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        variant="error"
      />
    )
  }
}