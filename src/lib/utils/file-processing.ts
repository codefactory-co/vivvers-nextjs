/**
 * File processing utilities extracted from components for better testability
 */

/**
 * Separate files into image and non-image categories
 */
export function categorizeFiles(files: File[]): { imageFiles: File[]; nonImageFiles: File[] } {
  const imageFiles: File[] = []
  const nonImageFiles: File[] = []
  
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      imageFiles.push(file)
    } else {
      nonImageFiles.push(file)
    }
  }
  
  return { imageFiles, nonImageFiles }
}

/**
 * Find the next image file index in a file array starting from a given index
 */
export function findNextImageIndex(files: File[], startIndex: number): number {
  // Handle negative start index
  if (startIndex < 0) {
    return -1
  }
  
  for (let i = startIndex; i < files.length; i++) {
    if (files[i] && files[i].type.startsWith('image/')) {
      return i
    }
  }
  return -1
}

/**
 * Generate a unique file key for tracking upload progress
 */
export function generateFileKey(fileName: string, index: number): string {
  return `${fileName}-${index}`
}

/**
 * Validate if a file list contains valid files
 */
export function hasValidFiles(files: FileList | null): boolean {
  return !!(files && files.length > 0)
}

/**
 * Convert FileList to File array
 */
export function fileListToArray(files: FileList): File[] {
  return Array.from(files)
}

/**
 * Replace a file in an array at a specific index
 */
export function replaceFileAtIndex(files: File[], index: number, newFile: File): File[] {
  const newFiles = [...files]
  newFiles[index] = newFile
  return newFiles
}

/**
 * Remove a file from file URL array by index
 */
export function removeFileFromUrls(urls: string[], index: number): string[] {
  return urls.filter((_, i) => i !== index)
}

/**
 * Check if file processing should continue based on file types
 */
export function shouldProcessFiles(imageFiles: File[], nonImageFiles: File[]): boolean {
  return imageFiles.length > 0 || nonImageFiles.length > 0
}