/**
 * Enhanced search utilities with case-insensitive and fuzzy matching
 */

export interface SearchableItem {
  id: string;
  name: string;
  category?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Normalize string for search comparison
 */
export function normalizeSearchString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .trim();
}

/**
 * Calculate similarity between two strings using Levenshtein distance
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const normalized1 = normalizeSearchString(str1);
  const normalized2 = normalizeSearchString(str2);
  
  if (normalized1 === normalized2) return 1;
  if (normalized1.length === 0 || normalized2.length === 0) return 0;
  
  const maxLength = Math.max(normalized1.length, normalized2.length);
  const distance = levenshteinDistance(normalized1, normalized2);
  
  return (maxLength - distance) / maxLength;
}

/**
 * Levenshtein distance algorithm
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => 
    Array(str1.length + 1).fill(null)
  );
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Check if search term matches item with fuzzy matching
 */
export function matchesSearch(item: SearchableItem, searchTerm: string): boolean {
  if (!searchTerm.trim()) return true;
  
  const normalizedTerm = normalizeSearchString(searchTerm);
  const fields = [item.name, item.category, item.description].filter(Boolean);
  
  return fields.some(field => {
    const normalizedField = normalizeSearchString(field || '');
    
    // Exact match
    if (normalizedField.includes(normalizedTerm)) return true;
    
    // Fuzzy match with threshold
    const similarity = calculateSimilarity(normalizedField, normalizedTerm);
    return similarity >= 0.6;
  });
}

/**
 * Filter and sort items based on search term
 */
export function searchItems<T extends SearchableItem>(
  items: T[],
  searchTerm: string,
  options: {
    threshold?: number;
    maxResults?: number;
    sortByRelevance?: boolean;
  } = {}
): T[] {
  const { threshold = 0.3, maxResults = 100, sortByRelevance = true } = options;
  
  if (!searchTerm.trim()) return items;
  
  const normalizedTerm = normalizeSearchString(searchTerm);
  
  // Filter and calculate relevance scores
  const results = items
    .map(item => {
      const fields = [item.name, item.category, item.description].filter(Boolean);
      let maxScore = 0;
      let hasExactMatch = false;
      
      fields.forEach(field => {
        const normalizedField = normalizeSearchString(field || '');
        
        // Check for exact substring match
        if (normalizedField.includes(normalizedTerm)) {
          hasExactMatch = true;
          maxScore = Math.max(maxScore, 1);
        } else {
          // Calculate fuzzy similarity
          const similarity = calculateSimilarity(normalizedField, normalizedTerm);
          maxScore = Math.max(maxScore, similarity);
        }
      });
      
      return {
        item,
        score: maxScore,
        hasExactMatch
      };
    })
    .filter(result => result.score >= threshold)
    .slice(0, maxResults);
  
  // Sort by relevance if requested
  if (sortByRelevance) {
    results.sort((a, b) => {
      // Exact matches first
      if (a.hasExactMatch && !b.hasExactMatch) return -1;
      if (!a.hasExactMatch && b.hasExactMatch) return 1;
      
      // Then by score
      if (a.score !== b.score) return b.score - a.score;
      
      // Finally by name
      return a.item.name.localeCompare(b.item.name);
    });
  }
  
  return results.map(result => result.item);
}

/**
 * Debounced search function
 */
export function createDebouncedSearch<T extends SearchableItem>(
  searchFn: (items: T[], term: string) => T[],
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout;
  
  return function debouncedSearch(
    items: T[],
    term: string,
    callback: (results: T[]) => void
  ) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      const results = searchFn(items, term);
      callback(results);
    }, delay);
  };
}

/**
 * Highlight search term in text
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text;
  
  const normalizedTerm = normalizeSearchString(searchTerm);
  const normalizedText = normalizeSearchString(text);
  
  const index = normalizedText.indexOf(normalizedTerm);
  if (index === -1) return text;
  
  // Find the original text position accounting for normalization
  const originalIndex = findOriginalIndex(text, normalizedText, index);
  const originalLength = findOriginalLength(text, originalIndex, normalizedTerm.length);
  
  return (
    text.substring(0, originalIndex) +
    `<mark>${text.substring(originalIndex, originalIndex + originalLength)}</mark>` +
    text.substring(originalIndex + originalLength)
  );
}

function findOriginalIndex(original: string, normalized: string, normalizedIndex: number): number {
  let originalIndex = 0;
  let normalizedPosition = 0;
  
  while (normalizedPosition < normalizedIndex && originalIndex < original.length) {
    const char = original[originalIndex];
    const normalizedChar = normalizeSearchString(char);
    
    if (normalizedChar.length > 0) {
      normalizedPosition += normalizedChar.length;
    }
    originalIndex++;
  }
  
  return originalIndex;
}

function findOriginalLength(original: string, startIndex: number, normalizedLength: number): number {
  let length = 0;
  let normalizedCount = 0;
  
  while (normalizedCount < normalizedLength && startIndex + length < original.length) {
    const char = original[startIndex + length];
    const normalizedChar = normalizeSearchString(char);
    
    if (normalizedChar.length > 0) {
      normalizedCount += normalizedChar.length;
    }
    length++;
  }
  
  return length;
}
