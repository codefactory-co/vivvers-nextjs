'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ProjectGalleryProps {
  screenshots: string[]
  title: string
  className?: string
}

export function ProjectGallery({ screenshots, title, className }: ProjectGalleryProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const slides = screenshots.map((src) => ({ src }))

  const openLightbox = (imageIndex: number) => {
    setIndex(imageIndex)
    setOpen(true)
  }

  if (screenshots.length === 0) {
    return null
  }

  return (
    <>
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle>스크린샷</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {screenshots.map((screenshot, index) => (
              <div
                key={`gallery-${index}-${screenshot.slice(-20)}`}
                className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg bg-muted"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={screenshot}
                  alt={`${title} 스크린샷 ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="rounded-full bg-white/90 p-2">
                    <svg
                      className="h-6 w-6 text-gray-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        carousel={{ finite: true }}
        render={{
          buttonPrev: screenshots.length <= 1 ? () => null : undefined,
          buttonNext: screenshots.length <= 1 ? () => null : undefined,
        }}
      />
    </>
  )
}