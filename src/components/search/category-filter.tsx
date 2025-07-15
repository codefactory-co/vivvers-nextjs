"use client";

import { cn } from "@/lib/utils";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";

export type ProjectCategory = "website" | "android" | "mobile" | "game" | "embedded" | "other";

interface CategoryFilterProps {
  selectedCategory: ProjectCategory | null;
  onCategoryChange: (category: ProjectCategory | null) => void;
  className?: string;
}

const categories: { value: ProjectCategory; label: string }[] = [
  { value: "website", label: "웹사이트" },
  { value: "android", label: "안드로이드" },
  { value: "mobile", label: "모바일" },
  { value: "game", label: "게임" },
  { value: "embedded", label: "임베디드" },
  { value: "other", label: "기타" },
];

export function CategoryFilter({ 
  selectedCategory, 
  onCategoryChange, 
  className 
}: CategoryFilterProps) {
  const allOptions: SelectOption[] = [
    { value: "all", label: "모든 카테고리" },
    ...categories
  ];

  const handleValueChange = (value: string) => {
    if (value === "all") {
      onCategoryChange(null);
    } else {
      onCategoryChange(value as ProjectCategory);
    }
  };

  const currentValue = selectedCategory || "all";

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-medium text-foreground">카테고리</h3>
      <CustomSelect
        options={allOptions}
        value={currentValue}
        onValueChange={handleValueChange}
        placeholder="카테고리 선택..."
      />
    </div>
  );
}