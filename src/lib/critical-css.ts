// Critical CSS for mobile above-the-fold content
// This contains only the essential styles needed for LCP and FCP

export const mobileCriticalCSS = `
/* Critical mobile-first styles for above-the-fold content */
*,*::before,*::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
html,body{margin:0;padding:0;width:100%;overflow-x:hidden;height:100%}
body{font-family:'Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-display:swap;background-color:#fff;color:#111827;line-height:1.5}

/* Essential layout styles */
.flex{display:flex}
.flex-col{flex-direction:column}
.min-h-screen{min-height:100vh}
.w-full{width:100%}
.h-full{height:100%}
.max-w-7xl{max-width:80rem}
.mx-auto{margin-left:auto;margin-right:auto}
.py-6{padding-top:1.5rem;padding-bottom:1.5rem}
.px-3{padding-left:0.75rem;padding-right:0.75rem}
.mb-4{margin-bottom:1rem}
.mb-6{margin-bottom:1.5rem}
.pb-4{padding-bottom:1rem}
.border-b{border-bottom-width:1px}

/* Typography essentials */
.text-center{text-align:center}
.text-4xl{font-size:2.25rem;line-height:2.5rem}
.text-3xl{font-size:1.875rem;line-height:2.25rem}
.text-lg{font-size:1.125rem;line-height:1.75rem}
.font-bold{font-weight:700}
.font-extrabold{font-weight:800}
.font-serif{font-family:ui-serif,Georgia,Cambria,"Times New Roman",Times,serif}
.tracking-tight{letter-spacing:-0.025em}

/* Essential image styles */
.object-cover{object-fit:cover}
.rounded{border-radius:0.375rem}
.w-full{width:100%}
.h-80{height:20rem}
.relative{position:relative}
.overflow-hidden{overflow:hidden}
.opacity-0{opacity:0}
.opacity-100{opacity:1}
.transition-opacity{transition-property:opacity;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}

/* Mobile-specific optimizations */
@media (max-width: 768px) {
  .text-4xl{font-size:1.875rem;line-height:2.25rem}
  .text-3xl{font-size:1.5rem;line-height:2rem}
  .h-80{height:16rem}
  .px-3{padding-left:0.75rem;padding-right:0.75rem}
  .py-6{padding-top:1rem;padding-bottom:1rem}
  
  /* Mobile image optimization */
  .mobile-image-container{
    contain:layout style paint;
    content-visibility:auto;
  }
  
  .mobile-optimized{
    transform:translateZ(0);
    will-change:auto;
  }
  
  /* Reduced animation complexity */
  .transition-opacity{
    transition-duration:0.15s;
  }
  
  /* Mobile scrolling optimization */
  .mobile-scroll{
    -webkit-overflow-scrolling:touch;
    overscroll-behavior:contain;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  body{background-color:#111827;color:#f9fafb}
}

/* Performance optimization for images */
img{
  content-visibility:auto;
  contain-intrinsic-size:800px 400px;
}

/* Skeleton loading styles */
.animate-pulse{
  animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;
}

@keyframes pulse{
  0%,100%{opacity:1}
  50%{opacity:0.5}
}

.bg-gray-200{background-color:#e5e7eb}
.bg-gray-300{background-color:#d1d5db}
.bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}
.from-gray-200{--tw-gradient-from:#e5e7eb;--tw-gradient-to:rgb(229 231 235 / 0);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
.via-gray-300{--tw-gradient-to:rgb(209 213 219 / 0);--tw-gradient-stops:var(--tw-gradient-from),#d1d5db,var(--tw-gradient-to)}
.to-gray-200{--tw-gradient-to:#e5e7eb}

/* Critical prefers-reduced-motion support */
@media (prefers-reduced-motion: reduce) {
  .animate-pulse,.transition-opacity{animation:none;transition:none}
}
`;

export const injectCriticalCSS = () => {
  if (typeof window === 'undefined') return;
  
  // Check if critical CSS is already injected
  if (document.querySelector('#critical-css-mobile')) return;
  
  const style = document.createElement('style');
  style.id = 'critical-css-mobile';
  style.textContent = mobileCriticalCSS;
  
  // Insert before any other stylesheets for highest priority
  const firstLink = document.querySelector('link[rel="stylesheet"]');
  if (firstLink) {
    document.head.insertBefore(style, firstLink);
  } else {
    document.head.appendChild(style);
  }
};

export const shouldInjectCriticalCSS = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const isMobile = window.innerWidth <= 768;
  const connection = (navigator as any)?.connection;
  const isSlowConnection = connection && 
    (connection.effectiveType === '2g' || 
     connection.effectiveType === 'slow-2g' ||
     connection.downlink < 1.5);
  
  return isMobile || isSlowConnection;
};