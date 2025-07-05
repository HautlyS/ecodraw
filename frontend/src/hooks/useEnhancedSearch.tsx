import { useState, useMemo, useCallback } from 'react';

interface SearchOptions {
  caseSensitive?: boolean;
  searchFields?: string[];
  debounceMs?: number;
  minLength?: number;
}

interface SearchResult<T> {
  items: T[];
  query: string;
  hasResults: boolean;
  resultCount: number;
  isSearching: boolean;
}

export function useEnhancedSearch<T>(
  items: T[],
  options: SearchOptions = {}
): [string, (query: string) => void, SearchResult<T>] {
  const {
    caseSensitive = false,
    searchFields = [],
    debounceMs = 300,
    minLength = 0,
  } = options;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Debounced search implementation
  const updateQuery = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (debounceMs > 0) {
      setIsDebouncing(true);
      const timeoutId = setTimeout(() => {
        setDebouncedQuery(query);
        setIsDebouncing(false);
      }, debounceMs);
      
      return () => clearTimeout(timeoutId);
    } else {
      setDebouncedQuery(query);
    }
  }, [debounceMs]);

  // Enhanced search logic
  const searchResult = useMemo((): SearchResult<T> => {
    const query = debouncedQuery.trim();
    
    // Return all items if query is too short
    if (query.length < minLength) {
      return {
        items,
        query,
        hasResults: true,
        resultCount: items.length,
        isSearching: false,
      };
    }

    const searchTerm = caseSensitive ? query : query.toLowerCase();
    
    const filteredItems = items.filter((item) => {
      // If no specific fields specified, search all string properties
      if (searchFields.length === 0) {
        return searchInAllFields(item, searchTerm, caseSensitive);
      }
      
      // Search in specified fields
      return searchFields.some(field => {
        const value = getNestedValue(item, field);
        if (typeof value === 'string') {
          const searchValue = caseSensitive ? value : value.toLowerCase();
          return searchValue.includes(searchTerm);
        }
        return false;
      });
    });

    return {
      items: filteredItems,
      query,
      hasResults: filteredItems.length > 0,
      resultCount: filteredItems.length,
      isSearching: isDebouncing,
    };
  }, [items, debouncedQuery, searchFields, caseSensitive, minLength, isDebouncing]);

  return [searchQuery, updateQuery, searchResult];
}

// Helper function to search in all string fields of an object
function searchInAllFields(item: any, searchTerm: string, caseSensitive: boolean): boolean {
  if (typeof item === 'string') {
    const value = caseSensitive ? item : item.toLowerCase();
    return value.includes(searchTerm);
  }
  
  if (typeof item === 'object' && item !== null) {
    return Object.values(item).some(value => 
      searchInAllFields(value, searchTerm, caseSensitive)
    );
  }
  
  return false;
}

// Helper function to get nested object values by dot notation
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object' ? current[key] : undefined;
  }, obj);
}

// Hook for search with highlighting
export function useSearchWithHighlight<T>(
  items: T[],
  options: SearchOptions & { highlightClassName?: string } = {}
) {
  const { highlightClassName = 'bg-yellow-200 dark:bg-yellow-900' } = options;
  const [query, setQuery, result] = useEnhancedSearch(items, options);

  const highlightText = useCallback((text: string, query: string): string => {
    if (!query || !text) return text;
    
    const searchTerm = options.caseSensitive ? query : query.toLowerCase();
    const textToSearch = options.caseSensitive ? text : text.toLowerCase();
    
    if (!textToSearch.includes(searchTerm)) return text;
    
    // Create regex for case-insensitive highlighting
    const regex = new RegExp(`(${escapeRegExp(query)})`, options.caseSensitive ? 'g' : 'gi');
    
    return text.replace(regex, `<span class="${highlightClassName}">$1</span>`);
  }, [options.caseSensitive, highlightClassName]);

  return {
    query,
    setQuery,
    result,
    highlightText,
  };
}

// Helper function to escape special regex characters
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Hook for fuzzy search (more advanced matching)
export function useFuzzySearch<T>(
  items: T[],
  options: SearchOptions & { 
    threshold?: number;
    includeScore?: boolean;
  } = {}
) {
  const { threshold = 0.6, includeScore = false } = options;
  const [query, setQuery] = useState('');

  const searchResult = useMemo(() => {
    if (!query.trim()) {
      return {
        items,
        query,
        hasResults: true,
        resultCount: items.length,
        isSearching: false,
      };
    }

    const searchTerm = options.caseSensitive ? query : query.toLowerCase();
    const results = items
      .map(item => {
        const score = calculateFuzzyScore(item, searchTerm, options);
        return { item, score };
      })
      .filter(({ score }) => score >= threshold)
      .sort((a, b) => b.score - a.score);

    return {
      items: includeScore ? results : results.map(r => r.item),
      query,
      hasResults: results.length > 0,
      resultCount: results.length,
      isSearching: false,
    };
  }, [items, query, options, threshold, includeScore]);

  return [query, setQuery, searchResult] as const;
}

// Simple fuzzy matching score calculation
function calculateFuzzyScore(item: any, searchTerm: string, options: SearchOptions): number {
  const searchFields = options.searchFields || [];
  let maxScore = 0;

  if (searchFields.length === 0) {
    maxScore = Math.max(maxScore, fuzzyMatchScore(JSON.stringify(item), searchTerm));
  } else {
    searchFields.forEach(field => {
      const value = getNestedValue(item, field);
      if (typeof value === 'string') {
        const fieldValue = options.caseSensitive ? value : value.toLowerCase();
        maxScore = Math.max(maxScore, fuzzyMatchScore(fieldValue, searchTerm));
      }
    });
  }

  return maxScore;
}

// Calculate fuzzy match score between two strings
function fuzzyMatchScore(text: string, pattern: string): number {
  if (pattern.length === 0) return 1;
  if (text.length === 0) return 0;

  let score = 0;
  let patternIndex = 0;
  let previousIndexInText = -1;

  for (let textIndex = 0; textIndex < text.length; textIndex++) {
    if (patternIndex < pattern.length && text[textIndex] === pattern[patternIndex]) {
      score += 1;
      
      // Bonus for consecutive matches
      if (previousIndexInText + 1 === textIndex) {
        score += 0.5;
      }
      
      previousIndexInText = textIndex;
      patternIndex++;
    }
  }

  // Normalize score
  const matchRatio = patternIndex / pattern.length;
  const lengthRatio = pattern.length / text.length;
  
  return matchRatio * lengthRatio;
}