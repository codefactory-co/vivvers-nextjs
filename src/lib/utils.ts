import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format numbers for display (e.g., 1200 -> "1.2k", 1500000 -> "1.5M")
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
 * Debounce function to limit the rate of function execution
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}