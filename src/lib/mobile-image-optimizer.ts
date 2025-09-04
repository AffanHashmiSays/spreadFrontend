// Mobile Image Optimization Utility
// Aggressive image optimization specifically for mobile devices

export interface MobileImageOptions {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  mobileQuality?: number;
  mobileWidth?: number;
  mobileHeight?: number;
}

// Enhanced mobile detection
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isSmallScreen = window.innerWidth <= 768;
  const isTouch = 'ontouchstart' in window;
  const connection = (navigator as any)?.connection;
  const isSlowConnection = connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g');
  
  return mobileRegex.test(userAgent) || isSmallScreen || isTouch || isSlowConnection;
};

// Get aggressive mobile image optimization parameters
export const getMobileImageParams = (options: Partial<MobileImageOptions>) => {
  const isMobile = isMobileDevice();
  
  if (!isMobile) {
    // Desktop: maintain high quality
    return {
      quality: options.quality || 75,
      width: options.width,
      height: options.height,
      format: options.format || 'webp',
    };
  }
  
  // Mobile: aggressive optimization
  const mobileQuality = options.mobileQuality || 60; // Aggressive quality reduction
  const maxMobileWidth = options.mobileWidth || Math.min(options.width || 800, 800);
  const maxMobileHeight = options.mobileHeight || Math.min(options.height || 600, 600);
  
  // Further reduce size based on screen size
  const screenWidth = window.innerWidth;
  let targetWidth = maxMobileWidth;
  let targetHeight = maxMobileHeight;
  
  if (screenWidth <= 480) {
    // Small mobile: very aggressive reduction
    targetWidth = Math.min(targetWidth, 400);
    targetHeight = Math.min(targetHeight, 300);
  } else if (screenWidth <= 640) {
    // Medium mobile: moderate reduction
    targetWidth = Math.min(targetWidth, 600);
    targetHeight = Math.min(targetHeight, 450);
  }
  
  return {
    quality: mobileQuality,
    width: targetWidth,
    height: targetHeight,
    format: 'webp', // Force WebP for mobile
  };
};

// Generate mobile-optimized image URL
export const getMobileOptimizedImageUrl = (src: string, options: Partial<MobileImageOptions> = {}): string => {
  if (!src) return '';
  
  const params = getMobileImageParams(options);
  
  // If it's already an external URL, try to add optimization parameters
  if (src.startsWith('http')) {
    try {
      const url = new URL(src);
      
      // For AWS S3 or other CDN providers, add transformation params
      if (url.hostname.includes('amazonaws.com') || url.hostname.includes('cloudfront')) {
        // Add transformation parameters for supported CDNs
        const searchParams = new URLSearchParams();
        if (params.width) searchParams.set('w', params.width.toString());
        if (params.height) searchParams.set('h', params.height.toString());
        if (params.quality) searchParams.set('q', params.quality.toString());
        if (params.format) searchParams.set('f', params.format);
        
        const paramString = searchParams.toString();
        return paramString ? `${src}?${paramString}` : src;
      }
    } catch (e) {
      console.debug('URL parsing error:', e);
    }
  }
  
  return src;
};

// Generate responsive srcSet for mobile
export const getMobileSrcSet = (src: string, options: Partial<MobileImageOptions> = {}): string => {
  if (!src) return '';
  
  const isMobile = isMobileDevice();
  if (!isMobile) return '';
  
  const baseMobileQuality = options.mobileQuality || 60;
  const mobileWidths = [320, 480, 640, 800];
  
  const srcSetEntries = mobileWidths.map(width => {
    const optimizedUrl = getMobileOptimizedImageUrl(src, {
      ...options,
      mobileWidth: width,
      mobileHeight: Math.round((options.height || 400) * (width / (options.width || 800))),
      mobileQuality: baseMobileQuality,
    });
    return `${optimizedUrl} ${width}w`;
  });
  
  return srcSetEntries.join(', ');
};

// Get mobile-specific sizes attribute
export const getMobileSizes = (): string => {
  const isMobile = isMobileDevice();
  if (!isMobile) return '';
  
  return '(max-width: 480px) 400px, (max-width: 640px) 600px, (max-width: 768px) 750px, 800px';
};

// Check if we should use aggressive mobile optimizations
export const shouldUseAggressiveMobileOptimizations = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const isMobile = isMobileDevice();
  const connection = (navigator as any)?.connection;
  const isSlowConnection = connection && 
    (connection.effectiveType === '2g' || 
     connection.effectiveType === 'slow-2g' || 
     connection.downlink < 1.5);
  
  return isMobile || isSlowConnection;
};