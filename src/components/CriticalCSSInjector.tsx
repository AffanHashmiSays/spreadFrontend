'use client';

import { useEffect } from 'react';
import { injectCriticalCSS, shouldInjectCriticalCSS } from '@/lib/critical-css';

interface CriticalCSSInjectorProps {
  enableMobileCriticalCSS?: boolean;
}

export function CriticalCSSInjector({ 
  enableMobileCriticalCSS = true 
}: CriticalCSSInjectorProps) {
  
  useEffect(() => {
    if (!enableMobileCriticalCSS) return;
    
    // Inject critical CSS as early as possible for mobile users
    if (shouldInjectCriticalCSS()) {
      injectCriticalCSS();
    }
  }, [enableMobileCriticalCSS]);

  return null; // This component doesn't render anything
}