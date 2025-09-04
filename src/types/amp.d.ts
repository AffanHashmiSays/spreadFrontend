declare namespace JSX {
  interface IntrinsicElements {
    'amp-img': React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
      layout?: 'responsive' | 'fixed' | 'fill' | 'fixed-height' | 'flex-item' | 'intrinsic' | 'nodisplay';
      fallback?: string;
      'data-priority'?: string;
      fetchpriority?: 'high' | 'low' | 'auto';
    };
    'amp-sidebar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
      id?: string;
      layout?: 'nodisplay';
      side?: 'left' | 'right';
    };
    button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
      on?: string;
    };
  }
}