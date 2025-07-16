"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { searchEvents } from "@/lib/analytics";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  resultsCount?: number;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search projects...",
  className,
  resultsCount
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the search input with 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
      
      // Track search event when user finishes typing
      if (localValue.trim() && localValue !== value) {
        searchEvents.search({
          search_query: localValue.trim(),
          results_count: resultsCount,
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value, resultsCount]);

  // Update local value when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className={cn("relative w-full", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      />
    </div>
  );
}