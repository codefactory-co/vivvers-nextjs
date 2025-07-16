/**
 * Tag processing utilities extracted from components for better testability
 */

/**
 * Parse comma-separated tags from input string
 */
export function parseCommaSeparatedTags(input: string): string[] {
  return input
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
}

/**
 * Check if a tag can be added to the current tag list
 */
export function canAddTag(
  tag: string, 
  currentTags: string[], 
  maxTags: number, 
  suggestTag: (tag: string) => string | null
): boolean {
  const suggestion = suggestTag(tag)
  return !!(suggestion && !currentTags.includes(suggestion) && currentTags.length < maxTags)
}

/**
 * Add a tag to the tag list if valid
 */
export function addTagToList(
  tag: string, 
  currentTags: string[], 
  maxTags: number, 
  suggestTag: (tag: string) => string | null
): { success: boolean; tags: string[]; addedTag?: string } {
  const suggestion = suggestTag(tag)
  
  if (suggestion && !currentTags.includes(suggestion) && currentTags.length < maxTags) {
    return {
      success: true,
      tags: [...currentTags, suggestion],
      addedTag: suggestion
    }
  }
  
  return {
    success: false,
    tags: currentTags
  }
}

/**
 * Remove a tag from the tag list by index
 */
export function removeTagFromList(tags: string[], indexToRemove: number): string[] {
  return tags.filter((_, index) => index !== indexToRemove)
}

/**
 * Process batch tag addition from comma-separated input
 */
export function processBatchTagAddition(
  input: string,
  currentTags: string[],
  maxTags: number,
  suggestTag: (tag: string) => string | null
): { tags: string[]; addedCount: number; validTags: string[] } {
  const newTags = parseCommaSeparatedTags(input)
  let updatedTags = [...currentTags]
  let addedCount = 0
  const validTags: string[] = []

  newTags.forEach(tag => {
    const result = addTagToList(tag, updatedTags, maxTags, suggestTag)
    if (result.success && result.addedTag) {
      updatedTags = result.tags
      addedCount++
      validTags.push(result.addedTag)
    }
  })

  return {
    tags: updatedTags,
    addedCount,
    validTags
  }
}