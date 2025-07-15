'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SortableScreenshotProps {
  id: string
  url: string
  index: number
  onRemove: (index: number) => void
}

export function SortableScreenshot({ id, url, index, onRemove }: SortableScreenshotProps) {
  const [isMobile, setIsMobile] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkMobile()
  }, [])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group transition-all duration-200 ease-out ${
        isDragging 
          ? 'opacity-50 scale-105 z-50 rotate-3' 
          : 'opacity-100 scale-100 rotate-0 hover:scale-105'
      }`}
    >
      <div className={`aspect-video rounded-lg overflow-hidden bg-muted border-2 transition-all duration-200 relative ${
        isDragging 
          ? 'border-primary shadow-lg' 
          : 'border-border hover:border-primary/50'
      }`}>
        <Image
          src={url}
          alt={`스크린샷 ${index + 1}`}
          fill
          className="object-cover"
          draggable={false}
        />
        
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={`absolute top-2 left-2 p-1 rounded bg-black/60 backdrop-blur-sm text-white cursor-grab transition-all duration-200 ${
            isDragging 
              ? 'cursor-grabbing opacity-100 scale-110' 
              : isMobile 
              ? 'opacity-70' 
              : 'opacity-0 group-hover:opacity-100 hover:bg-black/80'
          }`}
          aria-label="드래그하여 순서 변경"
          style={{
            touchAction: 'none',
            minWidth: isMobile ? '44px' : 'auto',
            minHeight: isMobile ? '44px' : 'auto',
          }}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Remove Button */}
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className={`absolute top-2 right-2 h-6 w-6 p-0 transition-opacity duration-200 ${
            isDragging 
              ? 'opacity-0' 
              : 'opacity-0 group-hover:opacity-100'
          }`}
          onClick={() => onRemove(index)}
          aria-label={`스크린샷 ${index + 1} 삭제`}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Order indicator */}
      <div className={`absolute bottom-2 left-2 px-2 py-1 text-xs rounded bg-black/60 backdrop-blur-sm text-white transition-all duration-200 ${
        isDragging ? 'opacity-0 scale-75' : 'opacity-60 group-hover:opacity-100 group-hover:scale-110'
      }`}>
        {index + 1}
      </div>
    </div>
  )
}