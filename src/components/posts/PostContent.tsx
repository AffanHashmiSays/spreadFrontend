'use client';

import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import TableOfContents from './TableOfContents';

interface Heading {
    id: string;
    text: string;
    level: number;
}

interface PostContentProps {
    content: string;
    headings: Heading[];
}

const PostContent: React.FC<PostContentProps> = ({ content, headings }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            const firstImage = contentRef.current.querySelector('img');
            
            // Create a container for the TOC that will be moved
            const tocContainer = document.createElement('div');
            tocContainer.id = 'toc-dynamic-container';

            if (firstImage && firstImage.parentNode) {
                // Insert the container after the first image
                firstImage.parentNode.insertBefore(tocContainer, firstImage.nextSibling);

                // Use the modern createRoot API to render the React component
                const root = createRoot(tocContainer);
                root.render(<TableOfContents headings={headings} />);
            } else {
                // Optional: Handle case where there is no image. 
                // For now, it simply won't render the TOC if no image is found.
            }
        }
        // Clean up the dynamically created container when the component unmounts or content changes
        return () => {
            const dynamicContainer = document.getElementById('toc-dynamic-container');
            if (dynamicContainer) {
                // The container is simply removed. React 18's root handling doesn't require explicit unmount.
                dynamicContainer.remove();
            }
        };
    }, [content, headings]);

    // The content is rendered here with the original styling classes restored.
    // The TOC is injected dynamically via the useEffect hook.
    return (
        <div
            ref={contentRef}
            className="prose prose-lg dark:prose-invert max-w-none
                [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-4 [&_ul]:pl-2
                [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-4 [&_ol]:pl-2
                [&_li]:my-2 [&_li]:pl-1
                [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-3
                [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2
                [&_p]:my-4 [&_p]:leading-7
                [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800
                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-4
                [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-gray-300 [&_table]:text-sm
                [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:px-2 [&_th]:py-2 [&_th]:font-bold
                [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_td]:py-2
                dark:[&_blockquote]:border-gray-600
                dark:[&_a]:text-blue-400 dark:hover:[&_a]:text-blue-300
                dark:[&_table]:border-gray-600
                dark:[&_th]:border-gray-600 dark:[&_th]:bg-gray-700
                dark:[&_td]:border-gray-600"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default PostContent;
