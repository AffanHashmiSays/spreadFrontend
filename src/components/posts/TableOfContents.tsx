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
      my-6 rounded-xl transition-all duration-300 ease-in-out
      ${isOpen 
        ? 'bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-300/70 shadow-lg shadow-slate-200/40' 
        : 'bg-white border border-slate-300/70 hover:border-slate-400/70 hover:shadow-md shadow-sm'
      }
    `}>
      <div 
        className={`
          flex justify-between items-center cursor-pointer transition-all duration-200
          ${isOpen ? 'p-4 pb-3' : 'py-2.5 px-3 hover:bg-slate-50/50'}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2.5">
          <div className={`
            w-1.5 h-1.5 rounded-full transition-all duration-300
            ${isOpen ? 'bg-blue-500' : 'bg-slate-400'}
          `} />
          <h2 className={`
            font-medium transition-all duration-300
            ${isOpen 
              ? 'text-base text-slate-800' 
              : 'text-sm text-slate-600 group-hover:text-slate-800'
            }
          `}>
            Table of Contents
          </h2>
        </div>
        
        <div className={`
          p-0.5 rounded-full transition-all duration-300
          ${isOpen ? 'bg-blue-100/70' : 'bg-slate-100/70 hover:bg-slate-200/70'}
        `}>
          <svg
            className={`
              w-3.5 h-3.5 transform transition-transform duration-300
              ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-500'}
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="px-4 pb-4">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4" />
          
          <ul className="space-y-0.5 list-none not-prose" style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {headings.map((heading, index) => (
              <li key={heading.id} className="group list-none">
                <div style={getIndentationStyle(heading.level)}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleLinkClick(e, heading.id)}
                    className={`
                      inline-flex items-center py-2 px-3 rounded-lg text-sm
                      transition-all duration-200 ease-in-out
                      hover:bg-blue-50 hover:text-blue-700
                      hover:translate-x-1 border-l-2 border-transparent 
                      hover:border-blue-300 w-full
                      ${getTextStyle(heading.level)}
                    `}
                  >
                    <span className={`
                      mr-3 transition-all duration-200 flex-shrink-0
                      ${getBulletStyle(heading.level)}
                      group-hover:bg-blue-500
                    `} />
                    <span className="truncate">{heading.text}</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;