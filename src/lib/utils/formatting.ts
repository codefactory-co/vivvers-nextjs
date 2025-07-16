/**
 * Formatting utilities extracted from components for better testability
 */

/**
 * Format date to Korean locale format
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Format count with K/M suffixes (e.g., 1200 -> "1.2k", 1500000 -> "1.5M")
 */
export function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
  }
  return count.toString()
}

/**
 * Generate display text for additional tags count
 */
export function formatAdditionalTagsCount(totalTags: number, visibleCount: number): string {
  const additionalCount = totalTags - visibleCount
  return additionalCount > 0 ? `+${additionalCount}` : ''
}

/**
 * Check if a count should show additional tags indicator
 */
export function shouldShowAdditionalTags(totalTags: number, visibleCount: number): boolean {
  return totalTags > visibleCount
}