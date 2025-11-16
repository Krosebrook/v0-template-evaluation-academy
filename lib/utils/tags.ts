/**
 * Shared utilities for tag management in forms
 */

/**
 * Add a tag to the tags array if it doesn't already exist and max limit not reached
 */
export function addTag(tags: string[], newTag: string, maxTags = 10): string[] {
  const trimmedTag = newTag.trim()
  if (!trimmedTag || tags.includes(trimmedTag) || tags.length >= maxTags) {
    return tags
  }
  return [...tags, trimmedTag]
}

/**
 * Remove a tag from the tags array
 */
export function removeTag(tags: string[], tagToRemove: string): string[] {
  return tags.filter((tag) => tag !== tagToRemove)
}
