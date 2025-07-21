'use client'

import React, { useState } from 'react'
import { ProjectGrid, Pagination } from '@/components/project'
import { getAllProjects } from '@/lib/data/projects'

export const ProjectShowcase: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const projectsPerPage = 12
  const allProjects = getAllProjects()
  const startIndex = (currentPage - 1) * projectsPerPage
  const endIndex = startIndex + projectsPerPage
  const projects = allProjects.slice(startIndex, endIndex)
  const totalPages = Math.ceil(allProjects.length / projectsPerPage)

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        projects={projects as unknown as any}
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