'use client'

import React, { useState } from 'react'
import { ProjectGrid, Pagination } from '@/components/project'
import { getProjects } from '@/lib/data/projects'

export const ProjectShowcase: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const projectsPerPage = 12
  const { projects, totalPages } = getProjects(currentPage, projectsPerPage)

  const handlePageChange = async (page: number) => {
    setLoading(true)
    setCurrentPage(page)
    
    // Simulate loading delay (remove in real implementation)
    await new Promise(resolve => setTimeout(resolve, 500))
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      {/* Projects Grid */}
      <ProjectGrid
        projects={projects}
        loading={loading}
        className="min-h-[800px]"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}