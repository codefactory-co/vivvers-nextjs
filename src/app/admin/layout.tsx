import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminHeader } from '@/components/admin/layout/admin-header'
import { AdminSidebar } from '@/components/admin/layout/admin-sidebar'
import { requireAdminPermission } from '@/lib/auth/admin'

export const metadata: Metadata = {
  title: 'Vivvers Admin',
  description: 'Vivvers 관리자 패널',
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  try {
    // Server-side permission check - runs on every admin page load
    await requireAdminPermission()
  } catch (error) {
    const errorMessage = (error as Error).message
    
    // If user is not logged in, redirect to signin
    if (errorMessage.includes('로그인이 필요합니다')) {
      redirect('/signin?redirect=/admin')
    }
    
    // If user doesn't have admin permissions, redirect to unauthorized page
    if (errorMessage.includes('관리자 권한이 필요합니다')) {
      redirect('/unauthorized')
    }
    
    // For any other error, redirect to signin as fallback
    redirect('/signin?redirect=/admin')
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 lg:pl-64">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}