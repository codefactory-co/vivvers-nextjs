"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProjectCategory } from "@/components/search/category-filter";
import type { SortOption } from "@/components/search/sort-selector";

export interface FilterState {
  category: ProjectCategory | null;
  tags: string[];
  sortBy: SortOption;
}

export interface UseFiltersReturn {
  filters: FilterState;
  updateCategory: (category: ProjectCategory | null) => void;
  updateTags: (tags: string[]) => void;
  updateSort: (sort: SortOption) => void;
  clearFilters: () => void;
  isFiltered: boolean;
}

const defaultFilters: FilterState = {
  category: null,
  tags: [],
  sortBy: "latest",
};

export function useFilters(): UseFiltersReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const category = searchParams.get("category") as ProjectCategory | null;
    const tagsParam = searchParams.get("tags");
    const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];
    const sortBy = (searchParams.get("sort") as SortOption) || "latest";

    return {
      category: category && ["website", "android", "mobile", "game", "embedded", "other"].includes(category) 
        ? category 
        : null,
      tags,
      sortBy: ["latest", "popular", "updated"].includes(sortBy) ? sortBy : "latest",
    };
  });

  // Update URL when filters change
  const updateURL = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams();
    
    if (newFilters.category) {
      params.set("category", newFilters.category);
    }
    
    if (newFilters.tags.length > 0) {
      params.set("tags", newFilters.tags.join(","));
    }
    
    if (newFilters.sortBy !== "latest") {
      params.set("sort", newFilters.sortBy);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    
    router.replace(newUrl, { scroll: false });
  }, [router]);

  // Update category filter
  const updateCategory = useCallback((category: ProjectCategory | null) => {
    const newFilters = { ...filters, category };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [filters, updateURL]);

  // Update tags filter
  const updateTags = useCallback((tags: string[]) => {
    const newFilters = { ...filters, tags };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [filters, updateURL]);

  // Update sort option
  const updateSort = useCallback((sortBy: SortOption) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [filters, updateURL]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    router.replace(window.location.pathname, { scroll: false });
  }, [router]);

  // Check if any filters are applied
  const isFiltered = filters.category !== null || 
                    filters.tags.length > 0 || 
                    filters.sortBy !== "latest";

  // Sync with URL changes (browser back/forward)
  useEffect(() => {
    const category = searchParams.get("category") as ProjectCategory | null;
    const tagsParam = searchParams.get("tags");
    const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];
    const sortBy = (searchParams.get("sort") as SortOption) || "latest";

    const urlFilters: FilterState = {
      category: category && ["website", "android", "mobile", "game", "embedded", "other"].includes(category) 
        ? category 
        : null,
      tags,
      sortBy: ["latest", "popular", "updated"].includes(sortBy) ? sortBy : "latest",
    };

    // Only update state if different from current state
    if (JSON.stringify(urlFilters) !== JSON.stringify(filters)) {
      setFilters(urlFilters);
    }
  }, [searchParams, filters]);

  return {
    filters,
    updateCategory,
    updateTags,
    updateSort,
    clearFilters,
    isFiltered,
  };
}