"use client";

import { useCallback, useState } from "react";

export interface SearchState {
  query: string;
  isSearching: boolean;
}

export interface UseSearchReturn {
  searchState: SearchState;
  updateSearchQuery: (query: string) => void;
  clearSearch: () => void;
  setIsSearching: (isSearching: boolean) => void;
}

export function useSearch(initialQuery: string = ""): UseSearchReturn {
  const [searchState, setSearchState] = useState<SearchState>({
    query: initialQuery,
    isSearching: false,
  });

  const updateSearchQuery = useCallback((query: string) => {
    setSearchState(prev => ({
      ...prev,
      query: query.trim(),
    }));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      query: "",
    }));
  }, []);

  const setIsSearching = useCallback((isSearching: boolean) => {
    setSearchState(prev => ({
      ...prev,
      isSearching,
    }));
  }, []);

  return {
    searchState,
    updateSearchQuery,
    clearSearch,
    setIsSearching,
  };
}