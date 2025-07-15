import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCommunityPostById } from '@/lib/services/community'
import { getUser } from '@/lib/supabase/server'
import { CommunityPostDetail } from '@/components/community/community-post-detail'
import { CommunityCommentSection } from '@/components/community/community-comment-section'

interface CommunityPostPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: CommunityPostPageProps): Promise<Metadata> {
  const resolvedParams = await params
  try {
    const post = await getCommunityPostById(resolvedParams.id)
    
    if (!post) {
      return {
        title: '게시글을 찾을 수 없습니다 - Vivvers'
      }
    }

    return {
      title: `${post.title} - 커뮤니티 - Vivvers`,
      description: post.content.substring(0, 160),
    }
  } catch {
    return {
      title: '게시글을 찾을 수 없습니다 - Vivvers'
    }
  }
}

export default async function CommunityPostPage({ params }: CommunityPostPageProps) {
  const resolvedParams = await params
  const [post, user] = await Promise.all([
    getCommunityPostById(resolvedParams.id),
    getUser()
  ])

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Post Detail */}
        <div className="mb-8">
          <CommunityPostDetail 
            post={post} 
            currentUserId={user?.id}
          />
        </div>

        {/* Comments Section */}
        <div>
          <CommunityCommentSection
            postId={post.id}
            comments={post.comments || []}
            currentUserId={user?.id}
            postAuthorId={post.authorId}
          />
        </div>
      </div>
    </div>
  )
}