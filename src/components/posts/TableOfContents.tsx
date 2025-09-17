// 'use client';

// import React, { useState } from 'react';

// interface Heading {
//   id: string;
//   text: string;
//   level: number;
// }

// interface TableOfContentsProps {
//   headings: Heading[];
// }

// const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
//   const [isOpen, setIsOpen] = useState(true);

//   if (!headings || headings.length === 0) {
//     return null;
//   }

//   const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
//     e.preventDefault();
//     const element = document.getElementById(id);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   const getPaddingForLevel = (level: number) => {
//     switch (level) {
//       case 1: return 'pl-0';
//       case 2: return 'pl-8';
//       case 3: return 'pl-12';
//       case 4: return 'pl-16';
//       case 5: return 'pl-20';
//       case 6: return 'pl-24';
//       default: return 'pl-0';
//     }
//   };

//   return (
//     <div className={`
//       my-6 rounded-xl transition-all duration-300 ease-in-out
//       ${isOpen 
//         ? 'bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/60 shadow-lg shadow-slate-200/40' 
//         : 'bg-white border border-slate-200/40 hover:border-slate-300/60 hover:shadow-md shadow-sm'
//       }
//     `}>
//       <div 
//         className={`
//           flex justify-between items-center cursor-pointer transition-all duration-200
//           ${isOpen ? 'p-5 pb-3' : 'p-4 hover:bg-slate-50/50'}
//         `}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className="flex items-center space-x-3">
//           <div className={`
//             w-2 h-2 rounded-full transition-all duration-300
//             ${isOpen ? 'bg-blue-500' : 'bg-slate-400'}
//           `} />
//           <h2 className={`
//             font-semibold transition-all duration-300
//             ${isOpen 
//               ? 'text-lg text-slate-800' 
//               : 'text-base text-slate-600 group-hover:text-slate-800'
//             }
//           `}>
//             Table of Contents
//           </h2>
//         </div>
        
//         <div className={`
//           p-1 rounded-full transition-all duration-300
//           ${isOpen ? 'bg-blue-100/70' : 'bg-slate-100/70 hover:bg-slate-200/70'}
//         `}>
//           <svg
//             className={`
//               w-4 h-4 transform transition-transform duration-300
//               ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-500'}
//             `}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//           </svg>
//         </div>
//       </div>
      
//       <div className={`
//         overflow-hidden transition-all duration-500 ease-in-out
//         ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
//       `}>
//         <div className="px-5 pb-5">
//           <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4" />
          
//           <ul className="space-y-1 list-none not-prose" style={{ listStyleType: 'none', paddingLeft: 0 }}>
//             {headings.map((heading, index) => (
//               <li key={heading.id} className={`${getPaddingForLevel(heading.level)} group list-none`}>
//                 <a
//                   href={`#${heading.id}`}
//                   onClick={(e) => handleLinkClick(e, heading.id)}
//                   className={`
//                     inline-flex items-center py-2 px-3 rounded-lg text-sm
//                     transition-all duration-200 ease-in-out
//                     hover:bg-blue-50 hover:text-blue-700
//                     text-slate-600 hover:translate-x-1
//                     border-l-2 border-transparent hover:border-blue-300
//                     ${heading.level === 1 ? 'font-medium' : 'font-normal'}
//                   `}
//                 >
//                   <span className={`
//                     w-1.5 h-1.5 rounded-full mr-2 transition-all duration-200
//                     ${heading.level === 1 ? 'bg-slate-400' : 'bg-slate-300'}
//                     group-hover:bg-blue-500
//                   `} />
//                   {heading.text}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TableOfContents;


'use client';

import React, { useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!headings || headings.length === 0) {
    return null;
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getIndentationStyle = (level: number) => {
    // Calculate indentation based on heading level
    const baseIndent = 0;
    const indentPerLevel = 20; // 20px per level
    const marginLeft = baseIndent + (level - 1) * indentPerLevel;
    
    return {
      marginLeft: `${marginLeft}px`,
    };
  };

  const getBulletStyle = (level: number) => {
    // Different bullet styles for different levels
    switch (level) {
      case 1:
        return 'w-2 h-2 bg-slate-500 rounded-full';
      case 2:
        return 'w-1.5 h-1.5 bg-slate-400 rounded-full';
      case 3:
        return 'w-1 h-1 bg-slate-400 rounded-full';
      case 4:
        return 'w-1 h-1 bg-slate-300 rounded-sm';
      case 5:
        return 'w-0.5 h-0.5 bg-slate-300 rounded-full';
      case 6:
        return 'w-0.5 h-0.5 bg-slate-300 rounded-full';
      default:
        return 'w-1.5 h-1.5 bg-slate-400 rounded-full';
    }
  };

  const getTextStyle = (level: number) => {
    switch (level) {
      case 1:
        return 'font-semibold text-slate-800';
      case 2:
        return 'font-medium text-slate-700';
      case 3:
        return 'font-normal text-slate-600';
      default:
        return 'font-normal text-slate-500';
    }
  };

  return (
    <div className={`
      my-8 relative group transition-all duration-500 ease-out
      ${isOpen ? 'transform-gpu' : ''}
    `}>
      {/* Animated background glow */}
      <div className={`
        absolute -inset-1 rounded-2xl transition-all duration-500
        ${isOpen 
          ? 'bg-gradient-to-r from-gray-400/20 via-gray-500/20 to-gray-600/20 blur-sm opacity-100' 
          : 'bg-gradient-to-r from-slate-200/50 to-slate-300/50 blur-sm opacity-0 group-hover:opacity-100'
        }
      `} />
      
      {/* Main container */}
      <div className={`
        relative rounded-2xl transition-all duration-500 ease-out backdrop-blur-xl
        ${isOpen 
          ? 'bg-gradient-to-br from-white/95 via-gray-50/90 to-gray-100/80 border border-gray-200/60 shadow-2xl shadow-gray-500/10' 
          : 'bg-white/80 border border-slate-200/50 hover:border-gray-300/50 hover:shadow-xl shadow-lg hover:bg-white/90'
        }
        transform-gpu hover:scale-[1.01] active:scale-[0.99]
      `}>
        
        {/* Header */}
        <div 
          className={`
            flex justify-between items-center cursor-pointer transition-all duration-300
            ${isOpen ? 'p-6 pb-4' : 'px-5 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-100/30'}
            rounded-t-2xl relative overflow-hidden
          `}
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Animated background on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 to-gray-600/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          
          <div className="flex items-center space-x-4 relative z-10">
            {/* Animated icon */}
            <div className={`
              relative w-10 h-10 rounded-xl transition-all duration-500 flex items-center justify-center
              ${isOpen 
                ? 'bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg shadow-gray-500/30' 
                : 'bg-gradient-to-br from-slate-400 to-slate-500 group-hover:from-gray-600 group-hover:to-gray-800'
              }
            `}>
              <svg 
                className={`w-5 h-5 text-white transition-all duration-300 ${
                  isOpen ? 'scale-110' : 'scale-100 group-hover:scale-110'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              
              {/* Pulse animation when open */}
              {isOpen && (
                <div className="absolute inset-0 rounded-xl bg-gray-400 animate-ping opacity-20" />
              )}
            </div>
            
            {/* Title with enhanced typography */}
            <div className="flex flex-col">
              <h2 className={`
                font-bold transition-all duration-300 leading-tight
                ${isOpen 
                  ? 'text-xl bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent' 
                  : 'text-lg text-slate-700 group-hover:text-slate-800'
                }
              `}>
                Table des matières
              </h2>
            </div>
            
            {/* Enhanced counter badge */}
            <div className={`
              relative px-2 py-1.5 rounded-full text-xs font-bold transition-all duration-300 mt-2
              ${isOpen 
                ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300/50 shadow-sm' 
                : 'bg-slate-100/80 text-slate-600 group-hover:bg-gray-100/80 group-hover:text-gray-700'
              }
              transform hover:scale-110
            `}>
              {headings.length}
              {isOpen && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              )}
            </div>
          </div>
          
          {/* Enhanced toggle button */}
          <div className={`
            relative p-3 rounded-xl transition-all duration-300 group/toggle
            ${isOpen 
              ? 'bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner' 
              : 'bg-slate-100/70 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200'
            }
            transform hover:scale-110 active:scale-95
          `}>
            <svg
              className={`
                w-5 h-5 transform transition-all duration-500 ease-out
                ${isOpen ? 'rotate-180 text-gray-700' : 'text-slate-500 group-hover/toggle:text-gray-700'}
              `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-xl bg-gray-400/20 scale-0 group-hover/toggle:scale-100 transition-transform duration-300" />
          </div>
        </div>
        
        {/* Content area with enhanced animations */}
        <div className={`
          overflow-hidden transition-all duration-700 ease-out
          ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="px-6 pb-6">
            {/* Decorative separator */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-transparent via-gray-200/60 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <div className="bg-gradient-to-r from-gray-500 to-gray-600 w-12 h-0.5 rounded-full" />
              </div>
            </div>
            
            {/* Scrollable content with enhanced styling */}
            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 pr-3">
              <div className="space-y-2">
                {headings.map((heading, index) => (
                  <div 
                    key={heading.id} 
                    className="group/item transform transition-all duration-300 hover:scale-[1.02]"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      ...getIndentationStyle(heading.level)
                    }}
                  >
                    <a
                      href={`#${heading.id}`}
                      onClick={(e) => handleLinkClick(e, heading.id)}
                      className={`
                        relative flex items-center py-3 px-4 rounded-xl text-sm
                        transition-all duration-300 ease-out group/link
                        hover:bg-gradient-to-r hover:from-gray-50/80 hover:via-gray-100/60 hover:to-gray-200/40
                        hover:text-gray-900 hover:shadow-lg hover:shadow-gray-500/10
                        border border-transparent hover:border-gray-200/50
                        text-black dark:text-gray-100 hover:text-gray-900 dark:hover:text-white
                        overflow-hidden backdrop-blur-sm
                        transform hover:translate-x-2 active:scale-95
                      `}
                    >
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 via-gray-600/5 to-gray-700/5 opacity-0 group-hover/link:opacity-100 transition-all duration-300" />
                      
                      {/* Enhanced bullet point */}
                      <div className="relative mr-4 flex-shrink-0">
                        <span className={`
                          block transition-all duration-300 relative z-10
                          ${getBulletStyle(heading.level)}
                          group-hover/link:bg-gradient-to-r group-hover/link:from-gray-500 group-hover/link:to-gray-600
                          group-hover/link:shadow-lg group-hover/link:shadow-gray-500/30
                          transform group-hover/link:scale-125
                        `} />
                        
                        {/* Pulse ring on hover */}
                        <div className="absolute inset-0 rounded-full bg-gray-400/30 scale-0 group-hover/link:scale-150 group-hover/link:opacity-0 transition-all duration-500" />
                      </div>
                      
                      {/* Text content */}
                      <span className="relative z-10 flex-1 truncate font-medium transition-all duration-300 group-hover/link:text-gray-900">
                        {heading.text}
                      </span>
                      
                      {/* Hover indicator */}
                      <div className="ml-2 opacity-0 group-hover/link:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/link:translate-x-0">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/link:opacity-100 group-hover/link:animate-pulse transition-opacity duration-500" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
