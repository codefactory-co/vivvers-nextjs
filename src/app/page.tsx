"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero"
import { FilterPanel } from "@/components/search"
import { ProjectGrid, Pagination } from "@/components/project"
import { useFilters } from "@/hooks/use-filters"
import { useSearch } from "@/hooks/use-search"
import { getProjects } from "@/lib/data/projects"

// Available tags for filtering
const AVAILABLE_TAGS = [
  "React", "Vue", "Angular", "Next.js", "TypeScript", "JavaScript",
  "Python", "Django", "Flask", "Node.js", "Express", "MongoDB",
  "PostgreSQL", "MySQL", "Firebase", "Supabase", "Tailwind CSS",
  "Bootstrap", "Material UI", "Figma", "Adobe XD", "Unity", "Unreal Engine",
  "Flutter", "React Native", "Swift", "Kotlin", "Java", "C#", "C++",
  "Arduino", "Raspberry Pi", "IoT", "Machine Learning", "AI", "Deep Learning"
]

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1)
  const { searchState } = useSearch()
  const { 
    filters, 
    updateCategory, 
    updateTags, 
    updateSort 
  } = useFilters()
  
  // Get filtered projects based on current search and filters
  const { projects, totalPages, totalProjects } = getProjects(
    currentPage,
    12 // projects per page
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Hero Section */}
      <HeroSection 
        size="lg"
        variant="centered"
      />
      
      {/* Search & Filter Section */}
      <section className="border-b border-border bg-background/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <FilterPanel 
            selectedCategory={filters.category}
            onCategoryChange={updateCategory}
            availableTags={AVAILABLE_TAGS}
            selectedTags={filters.tags}
            onTagsChange={updateTags}
            sortBy={filters.sortBy}
            onSortChange={updateSort}
            resultCount={totalProjects}
          />
        </div>
      </section>
      
      {/* Project Grid Section */}
      <section className="container mx-auto px-4 py-8">
        <ProjectGrid 
          projects={projects}
          loading={false}
        />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>
    </>
  )
}