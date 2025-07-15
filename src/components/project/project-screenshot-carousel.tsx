'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProjectScreenshotCarouselProps {
  screenshots: string[]
  title: string
  className?: string
}

export function ProjectScreenshotCarousel({ 
  screenshots, 
  title, 
  className 
}: ProjectScreenshotCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps'
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const slides = screenshots.map((src) => ({ src }))

  if (screenshots.length === 0) {
    return null
  }

  return (
    <>
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">스크린샷</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollPrev}
              disabled={selectedIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollNext}
              disabled={selectedIndex >= screenshots.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="flex-none w-80 lg:w-96"
              >
                <div 
                  className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg bg-muted shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={screenshot}
                    alt={`${title} 스크린샷 ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 320px, 384px"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="rounded-full bg-white/90 p-3 shadow-lg">
                      <ZoomIn className="h-5 w-5 text-gray-900" />
                    </div>
                  </div>
                  
                  {/* 이미지 번호 표시 */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {index + 1} / {screenshots.length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 인디케이터 */}
        {screenshots.length > 1 && (
          <div className="flex justify-center gap-2">
            {screenshots.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === selectedIndex ? "bg-primary" : "bg-muted-foreground/30"
                )}
                onClick={() => emblaApi?.scrollTo(index)}
              />
            ))}
          </div>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
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