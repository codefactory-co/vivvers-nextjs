import { Suspense } from "react"
import { HeroSectionWrapper } from "@/components/hero/hero-section-wrapper"
import { ProjectGrid } from "@/components/project"
import { URLPagination } from "@/components/project/url-pagination"
import { getProjectsWithFilters } from "@/lib/actions/project/project-list"
import { createClient } from "@/lib/supabase/server"
import { PageViewTracker } from "@/components/analytics/page-view-tracker"

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: HomePageProps) {
  // Parse search parameters - only keep pagination
  const params = await searchParams
  const page = parseInt(params.page as string) || 1

  // Get current user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  // Get projects from database - no filters
  const { projects, totalPages } = await getProjectsWithFilters({
    sortBy: 'latest'
  }, page, 12)

  return (
    <>
      <PageViewTracker page="home" />
      {/* Hero Section */}
      <HeroSectionWrapper 
        size="lg"
        variant="centered"
      />
      
      {/* Project Grid Section */}
      <section data-section="projects" className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div>프로젝트 불러오는 중...</div>}>
          <ProjectGrid 
            projects={projects}
            currentUserId={currentUserId}
            loading={false}
          />
        </Suspense>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <URLPagination
              currentPage={page}
              totalPages={totalPages}
            />
          </div>
        )}
      </section>
    </>
  )
}