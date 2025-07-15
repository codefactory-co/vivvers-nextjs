import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen">
      {/* Project Info Header Skeleton */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Screenshots Carousel Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-full h-96 rounded-lg" />
      </div>
      
      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Project Description Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            {/* Features Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-2/3" />
                ))}
              </div>
            </div>
            
            {/* Comments Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}