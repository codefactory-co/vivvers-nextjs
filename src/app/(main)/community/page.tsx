import { Suspense } from 'react'
import { Metadata } from 'next'
import { CommunityFeed } from '@/components/community/community-feed'
import { CommunityHeader } from '@/components/community/community-header'
import { CommunityFilters } from '@/components/community/community-filters'
import { CommunitySearchParams } from '@/types/community'

export const metadata: Metadata = {
  title: '커뮤니티 - Vivvers',
  description: '개발자들과 소통하고 질문을 나누는 커뮤니티 공간입니다.',
}

interface CommunityPageProps {
  searchParams: Promise<CommunitySearchParams>
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const resolvedSearchParams = await searchParams
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <CommunityHeader />
        
        {/* Filters */}
        <div className="mb-6">
          <Suspense fallback={<div className="h-12 bg-muted rounded animate-pulse" />}>
            <CommunityFilters searchParams={resolvedSearchParams} />
          </Suspense>
        </div>

        {/* Main Content */}
        <div>
          <Suspense fallback={<div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>}>
            <CommunityFeed searchParams={resolvedSearchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}