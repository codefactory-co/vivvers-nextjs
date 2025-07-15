import { Suspense } from "react"
import { HeroSectionWrapper } from "@/components/hero/hero-section-wrapper"
import { ProjectGrid } from "@/components/project"
import { URLPagination } from "@/components/project/url-pagination"
import { getProjectsWithFilters } from "@/lib/actions/project/project-list"
import { ClientFilterWrapper } from "@/components/search/client-filter-wrapper"
import { createClient } from "@/lib/supabase/server"

// Available tags for filtering
const AVAILABLE_TAGS = [
  "React", "Vue", "Angular", "Next.js", "TypeScript", "JavaScript",
  "Python", "Django", "Flask", "Node.js", "Express", "MongoDB",
  "PostgreSQL", "MySQL", "Firebase", "Supabase", "Tailwind CSS",
  "Bootstrap", "Material UI", "Figma", "Adobe XD", "Unity", "Unreal Engine",
  "Flutter", "React Native", "Swift", "Kotlin", "Java", "C#", "C++",
  "Arduino", "Raspberry Pi", "IoT", "Machine Learning", "AI", "Deep Learning"
]

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: HomePageProps) {
  // Parse search parameters
  const params = await searchParams
  const page = parseInt(params.page as string) || 1
  const category = params.category as string
  const tags = params.tags ? 
    (Array.isArray(params.tags) ? params.tags : [params.tags]) : 
    []
  const sortBy = (params.sortBy as 'latest' | 'popular' | 'updated') || 'latest'
  const search = params.search as string

  // Get current user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  // Get projects from database
  const { projects, totalPages, totalCount } = await getProjectsWithFilters({
    category,
    tags,
    sortBy,
    search
  }, page, 12)

  return (
    <>
      {/* Hero Section */}
      <HeroSectionWrapper 
        size="lg"
        variant="centered"
      />
      
      {/* Search & Filter Section */}
      <section className="border-b border-border bg-background/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ClientFilterWrapper
              availableTags={AVAILABLE_TAGS}
              resultCount={totalCount}
              initialFilters={{
                category,
                tags,
                sortBy,
                search
              }}
            />
          </Suspense>
        </div>
      </section>
      
      {/* Project Grid Section */}
      <section data-section="projects" className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading projects...</div>}>
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