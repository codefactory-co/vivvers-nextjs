"use client";

import { cn } from "@/lib/utils";
import { CategoryFilter, type ProjectCategory } from "./category-filter";
import { TagFilter } from "./tag-filter";
import { SortSelector, type SortOption } from "./sort-selector";

interface FilterPanelProps {
  // Category filter
  selectedCategory: ProjectCategory | null;
  onCategoryChange: (category: ProjectCategory | null) => void;
  
  // Tag filter
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  
  // Sort selector
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  
  // Result count
  resultCount: number;
  
  className?: string;
}

export function FilterPanel({
  selectedCategory,
  onCategoryChange,
  availableTags,
  selectedTags,
  onTagsChange,
  sortBy,
  onSortChange,
  resultCount,
  className
}: FilterPanelProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {resultCount}개의 프로젝트를 찾았습니다
        </p>
      </div>

      {/* Filters in one row */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Category filter */}
        <div className="min-w-[160px]">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>

        {/* Tag filter */}
        {availableTags.length > 0 && (
          <div className="min-w-[200px] flex-1">
            <TagFilter
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagsChange={onTagsChange}
            />
          </div>
        )}

        {/* Sort selector */}
        <div className="min-w-[140px]">
          <div className="space-y-2">
            <label htmlFor="sort-selector" className="text-sm font-medium text-foreground">
              정렬 기준
            </label>
            <SortSelector
              value={sortBy}
              onChange={onSortChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}