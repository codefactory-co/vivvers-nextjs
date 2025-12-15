/**
 * @jest-environment jsdom
 */

import {
  categorizeFiles,
  findNextImageIndex,
  generateFileKey,
  hasValidFiles,
  fileListToArray,
  replaceFileAtIndex,
  removeFileFromUrls,
  shouldProcessFiles
} from '@/lib/utils/file-processing'

describe('File Processing Utilities', () => {
  // Mock file creation helper
  const createMockFile = (name: string, type: string): File => {
    return new File(['mock content'], name, { type })
  }

  // Mock FileList creation helper
  const createMockFileList = (files: File[]): FileList => {
    const fileList = {
      length: files.length,
      item: (index: number) => files[index] || null,
      [Symbol.iterator]: function* () {
        for (let i = 0; i < files.length; i++) {
          yield files[i]
        }
      }
    }
    
    // Add indexed access
    files.forEach((file, index) => {
      Object.defineProperty(fileList, index, {
        value: file,
        enumerable: true
      })
    })

    return fileList as FileList
  }

  describe('categorizeFiles', () => {
    it('should separate image and non-image files correctly', () => {
      const files = [
        createMockFile('image1.jpg', 'image/jpeg'),
        createMockFile('document.pdf', 'application/pdf'),
        createMockFile('image2.png', 'image/png'),
        createMockFile('video.mp4', 'video/mp4'),
        createMockFile('image3.gif', 'image/gif')
      ]

      const result = categorizeFiles(files)

      expect(result.imageFiles).toHaveLength(3)
      expect(result.imageFiles.map(f => f.name)).toEqual(['image1.jpg', 'image2.png', 'image3.gif'])
      
      expect(result.nonImageFiles).toHaveLength(2)
      expect(result.nonImageFiles.map(f => f.name)).toEqual(['document.pdf', 'video.mp4'])
    })

    it('should handle all image files', () => {
      const files = [
        createMockFile('image1.jpg', 'image/jpeg'),
        createMockFile('image2.png', 'image/png'),
        createMockFile('image3.webp', 'image/webp')
      ]

      const result = categorizeFiles(files)

      expect(result.imageFiles).toHaveLength(3)
      expect(result.nonImageFiles).toHaveLength(0)
    })

    it('should handle all non-image files', () => {
      const files = [
        createMockFile('document.pdf', 'application/pdf'),
        createMockFile('video.mp4', 'video/mp4'),
        createMockFile('audio.mp3', 'audio/mpeg')
      ]

      const result = categorizeFiles(files)

      expect(result.imageFiles).toHaveLength(0)
      expect(result.nonImageFiles).toHaveLength(3)
    })

    it('should handle empty file array', () => {
      const result = categorizeFiles([])

      expect(result.imageFiles).toHaveLength(0)
      expect(result.nonImageFiles).toHaveLength(0)
    })

    it('should handle edge case MIME types', () => {
      const files = [
        createMockFile('image.svg', 'image/svg+xml'),
        createMockFile('file.bin', 'application/octet-stream'),
        createMockFile('image.bmp', 'image/bmp')
      ]

      const result = categorizeFiles(files)

      expect(result.imageFiles).toHaveLength(2)
      expect(result.imageFiles.map(f => f.name)).toEqual(['image.svg', 'image.bmp'])
      expect(result.nonImageFiles).toHaveLength(1)
      expect(result.nonImageFiles[0].name).toBe('file.bin')
    })
  })

  describe('findNextImageIndex', () => {
    it('should find next image file from start index', () => {
      const files = [
        createMockFile('doc.pdf', 'application/pdf'),
        createMockFile('image1.jpg', 'image/jpeg'),
        createMockFile('video.mp4', 'video/mp4'),
        createMockFile('image2.png', 'image/png')
      ]

      expect(findNextImageIndex(files, 0)).toBe(1)
      expect(findNextImageIndex(files, 1)).toBe(1)
      expect(findNextImageIndex(files, 2)).toBe(3)
      expect(findNextImageIndex(files, 3)).toBe(3)
    })

    it('should return -1 when no image found', () => {
      const files = [
        createMockFile('doc.pdf', 'application/pdf'),
        createMockFile('video.mp4', 'video/mp4'),
        createMockFile('audio.mp3', 'audio/mpeg')
      ]

      expect(findNextImageIndex(files, 0)).toBe(-1)
      expect(findNextImageIndex(files, 1)).toBe(-1)
    })

    it('should return -1 when start index exceeds array length', () => {
      const files = [
        createMockFile('image.jpg', 'image/jpeg')
      ]

      expect(findNextImageIndex(files, 1)).toBe(-1)
      expect(findNextImageIndex(files, 5)).toBe(-1)
    })

    it('should handle empty array', () => {
      expect(findNextImageIndex([], 0)).toBe(-1)
    })

    it('should handle negative start index', () => {
      const files = [
        createMockFile('image.jpg', 'image/jpeg')
      ]

      expect(findNextImageIndex(files, -1)).toBe(-1)
    })
  })

  describe('generateFileKey', () => {
    it('should generate unique file keys', () => {
      expect(generateFileKey('image.jpg', 0)).toBe('image.jpg-0')
      expect(generateFileKey('document.pdf', 1)).toBe('document.pdf-1')
      expect(generateFileKey('video.mp4', 5)).toBe('video.mp4-5')
    })

    it('should handle special characters in filename', () => {
      expect(generateFileKey('my file (1).jpg', 0)).toBe('my file (1).jpg-0')
      expect(generateFileKey('file-with-dashes.pdf', 2)).toBe('file-with-dashes.pdf-2')
    })

    it('should handle empty filename', () => {
      expect(generateFileKey('', 0)).toBe('-0')
    })

    it('should handle negative index', () => {
      expect(generateFileKey('file.txt', -1)).toBe('file.txt--1')
    })
  })

  describe('hasValidFiles', () => {
    it('should return true for valid FileList with files', () => {
      const files = createMockFileList([
        createMockFile('image.jpg', 'image/jpeg')
      ])

      expect(hasValidFiles(files)).toBe(true)
    })

    it('should return false for empty FileList', () => {
      const files = createMockFileList([])
      expect(hasValidFiles(files)).toBe(false)
    })

    it('should return false for null FileList', () => {
      expect(hasValidFiles(null)).toBe(false)
    })

    it('should return false for undefined FileList', () => {
      expect(hasValidFiles(undefined as unknown as FileList | null)).toBe(false)
    })
  })

  describe('fileListToArray', () => {
    it('should convert FileList to array', () => {
      const mockFiles = [
        createMockFile('file1.jpg', 'image/jpeg'),
        createMockFile('file2.pdf', 'application/pdf')
      ]
      const fileList = createMockFileList(mockFiles)

      const result = fileListToArray(fileList)

      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('file1.jpg')
      expect(result[1].name).toBe('file2.pdf')
    })

    it('should handle empty FileList', () => {
      const fileList = createMockFileList([])
      const result = fileListToArray(fileList)

      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(0)
    })

    it('should preserve file order', () => {
      const mockFiles = [
        createMockFile('first.jpg', 'image/jpeg'),
        createMockFile('second.png', 'image/png'),
        createMockFile('third.gif', 'image/gif')
      ]
      const fileList = createMockFileList(mockFiles)

      const result = fileListToArray(fileList)

      expect(result.map(f => f.name)).toEqual(['first.jpg', 'second.png', 'third.gif'])
    })
  })

  describe('replaceFileAtIndex', () => {
    it('should replace file at specified index', () => {
      const originalFiles = [
        createMockFile('file1.jpg', 'image/jpeg'),
        createMockFile('file2.png', 'image/png'),
        createMockFile('file3.gif', 'image/gif')
      ]
      const newFile = createMockFile('replaced.webp', 'image/webp')

      const result = replaceFileAtIndex(originalFiles, 1, newFile)

      expect(result).toHaveLength(3)
      expect(result[0].name).toBe('file1.jpg')
      expect(result[1].name).toBe('replaced.webp')
      expect(result[2].name).toBe('file3.gif')
    })

    it('should not mutate original array', () => {
      const originalFiles = [
        createMockFile('file1.jpg', 'image/jpeg'),
        createMockFile('file2.png', 'image/png')
      ]
      const newFile = createMockFile('replaced.webp', 'image/webp')

      const result = replaceFileAtIndex(originalFiles, 0, newFile)

      expect(originalFiles[0].name).toBe('file1.jpg')
      expect(result[0].name).toBe('replaced.webp')
      expect(result).not.toBe(originalFiles)
    })

    it('should handle edge indices', () => {
      const files = [createMockFile('file.jpg', 'image/jpeg')]
      const newFile = createMockFile('new.png', 'image/png')

      const result = replaceFileAtIndex(files, 0, newFile)
      expect(result[0].name).toBe('new.png')
    })
  })

  describe('removeFileFromUrls', () => {
    it('should remove URL at specified index', () => {
      const urls = ['url1.jpg', 'url2.png', 'url3.gif']
      
      expect(removeFileFromUrls(urls, 1)).toEqual(['url1.jpg', 'url3.gif'])
      expect(removeFileFromUrls(urls, 0)).toEqual(['url2.png', 'url3.gif'])
      expect(removeFileFromUrls(urls, 2)).toEqual(['url1.jpg', 'url2.png'])
    })

    it('should handle single URL removal', () => {
      const urls = ['single.jpg']
      expect(removeFileFromUrls(urls, 0)).toEqual([])
    })

    it('should handle invalid index gracefully', () => {
      const urls = ['url1.jpg', 'url2.png']
      
      expect(removeFileFromUrls(urls, -1)).toEqual(urls)
      expect(removeFileFromUrls(urls, 5)).toEqual(urls)
    })

    it('should not mutate original array', () => {
      const originalUrls = ['url1.jpg', 'url2.png', 'url3.gif']
      const result = removeFileFromUrls(originalUrls, 1)

      expect(originalUrls).toEqual(['url1.jpg', 'url2.png', 'url3.gif'])
      expect(result).toEqual(['url1.jpg', 'url3.gif'])
      expect(result).not.toBe(originalUrls)
    })
  })

  describe('shouldProcessFiles', () => {
    it('should return true when image files exist', () => {
      const imageFiles = [createMockFile('image.jpg', 'image/jpeg')]
      const nonImageFiles: File[] = []

      expect(shouldProcessFiles(imageFiles, nonImageFiles)).toBe(true)
    })

    it('should return true when non-image files exist', () => {
      const imageFiles: File[] = []
      const nonImageFiles = [createMockFile('doc.pdf', 'application/pdf')]

      expect(shouldProcessFiles(imageFiles, nonImageFiles)).toBe(true)
    })

    it('should return true when both types exist', () => {
      const imageFiles = [createMockFile('image.jpg', 'image/jpeg')]
      const nonImageFiles = [createMockFile('doc.pdf', 'application/pdf')]

      expect(shouldProcessFiles(imageFiles, nonImageFiles)).toBe(true)
    })

    it('should return false when no files exist', () => {
      const imageFiles: File[] = []
      const nonImageFiles: File[] = []

      expect(shouldProcessFiles(imageFiles, nonImageFiles)).toBe(false)
    })
  })

  describe('integration scenarios', () => {
    it('should handle complete file processing workflow', () => {
      // Start with mixed files
      const files = [
        createMockFile('image1.jpg', 'image/jpeg'),
        createMockFile('doc.pdf', 'application/pdf'),
        createMockFile('image2.png', 'image/png')
      ]

      // Categorize files
      const { imageFiles, nonImageFiles } = categorizeFiles(files)
      expect(imageFiles).toHaveLength(2)
      expect(nonImageFiles).toHaveLength(1)

      // Check if we should process
      expect(shouldProcessFiles(imageFiles, nonImageFiles)).toBe(true)

      // Find next image for processing
      expect(findNextImageIndex(files, 0)).toBe(0)
      expect(findNextImageIndex(files, 1)).toBe(2)

      // Generate keys for tracking
      const keys = files.map((file, index) => generateFileKey(file.name, index))
      expect(keys).toEqual(['image1.jpg-0', 'doc.pdf-1', 'image2.png-2'])

      // Simulate file replacement (like after cropping)
      const croppedFile = createMockFile('cropped.webp', 'image/webp')
      const updatedFiles = replaceFileAtIndex(files, 0, croppedFile)
      expect(updatedFiles[0].name).toBe('cropped.webp')

      // Simulate URL management
      let urls = ['url1.jpg', 'url2.pdf', 'url3.png']
      urls = removeFileFromUrls(urls, 1)
      expect(urls).toEqual(['url1.jpg', 'url3.png'])
    })

    it('should handle FileList conversion and validation', () => {
      const mockFiles = [
        createMockFile('valid1.jpg', 'image/jpeg'),
        createMockFile('valid2.pdf', 'application/pdf')
      ]
      const fileList = createMockFileList(mockFiles)

      // Validate FileList
      expect(hasValidFiles(fileList)).toBe(true)
      expect(hasValidFiles(null)).toBe(false)

      // Convert to array for processing
      const fileArray = fileListToArray(fileList)
      expect(fileArray).toHaveLength(2)
      expect(fileArray[0].name).toBe('valid1.jpg')
    })
  })
})