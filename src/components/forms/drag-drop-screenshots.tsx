'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableScreenshot } from './sortable-screenshot'

interface DragDropScreenshotsProps {
  screenshots: string[]
  onReorder: (newOrder: string[]) => void
  onRemove: (index: number) => void
  maxItems?: number
}

export function DragDropScreenshots({ 
  screenshots, 
  onReorder, 
  onRemove, 
  maxItems = 10 
}: DragDropScreenshotsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device for touch optimizations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: isMobile ? 5 : 8,
        delay: isMobile ? 200 : 0,
        tolerance: isMobile ? 5 : 2,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = screenshots.findIndex((item, index) => `screenshot-${index}` === active.id)
      const newIndex = screenshots.findIndex((item, index) => `screenshot-${index}` === over?.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(screenshots, oldIndex, newIndex)
        onReorder(newOrder)
      }
    }

    setActiveId(null)
  }

  const handleRemove = (index: number) => {
    onRemove(index)
  }

  if (screenshots.length === 0) {
    return null
  }

  const activeScreenshot = activeId 
    ? screenshots.find((_, index) => `screenshot-${index}` === activeId)
    : null

  const activeIndex = activeId 
    ? screenshots.findIndex((_, index) => `screenshot-${index}` === activeId)
    : -1

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">선택된 파일:</p>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={screenshots.map((_, index) => `screenshot-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {screenshots.map((url, index) => (
              <SortableScreenshot
                key={`screenshot-${index}`}
                id={`screenshot-${index}`}
                url={url}
                index={index}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeScreenshot ? (
            <div className="aspect-video rounded-lg overflow-hidden bg-muted border-2 border-primary shadow-2xl opacity-90">
              <img
                src={activeScreenshot}
                alt={`스크린샷 ${activeIndex + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {screenshots.length > 0 && maxItems && (
        <p className="text-xs text-muted-foreground">
          {screenshots.length}/{maxItems} 개 파일 ({maxItems - screenshots.length}개 더 추가 가능)
        </p>
      )}
    </div>
  )
}