"use client";

import { cn } from "@/lib/utils";
import { CustomMultiSelect, MultiSelectOption } from "@/components/ui/custom-multi-select";

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  className?: string;
}

export function TagFilter({ 
  availableTags, 
  selectedTags, 
  onTagsChange, 
  className 
}: TagFilterProps) {
  const tagOptions: MultiSelectOption[] = availableTags.map(tag => ({
    value: tag,
    label: tag
  }));

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-medium text-foreground">태그</h3>
      <CustomMultiSelect
        options={tagOptions}
        value={selectedTags}
        onValueChange={onTagsChange}
        placeholder="태그 선택..."
        maxDisplay={2}
      />
    </div>
  );
}