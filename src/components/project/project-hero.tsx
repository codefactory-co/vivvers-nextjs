import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProjectHeroProps {
  title: string
  thumbnail: string
  className?: string
}

export function ProjectHero({ title, thumbnail, className }: ProjectHeroProps) {
  return (
    <div className={cn("relative h-[60vh] min-h-[400px] w-full overflow-hidden", className)}>
      <Image
        src={thumbnail}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <div className="mt-4 flex justify-center">
            <div className="animate-bounce">
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}