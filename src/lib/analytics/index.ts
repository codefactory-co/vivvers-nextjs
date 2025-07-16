// Main analytics module - exports all analytics functionality
export * from './constants';
export * from './events';

// Re-export commonly used functions for convenience
export { 
  projectEvents, 
  searchEvents, 
  userEvents, 
  navigationEvents, 
  contentEvents 
} from './events';

// Type definitions for global gtag function
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, string | number | boolean | string[] | undefined>
    ) => void;
  }
}

// Utility function to check if analytics is enabled
export function isAnalyticsEnabled(): boolean {
  return (
    process.env.NODE_ENV === 'production' && 
    !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID &&
    typeof window !== 'undefined'
  );
}

// Utility function for custom event tracking
export function trackCustomEvent(eventName: string, parameters?: Record<string, string | number | boolean | string[] | undefined>) {
  if (!isAnalyticsEnabled()) {
    console.log(`[Analytics Debug] ${eventName}:`, parameters);
    return;
  }
  
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }
}