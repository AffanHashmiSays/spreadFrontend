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
    relatedPosts?: any[];
}

const PostContent: React.FC<PostContentProps> = ({ content, headings, relatedPosts = [] }) => {
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

            // Inject related posts individually throughout the content
            if (relatedPosts && relatedPosts.length > 0) {
                const paragraphs = contentRef.current.querySelectorAll('p');
                const totalParagraphs = paragraphs.length;
                
                // Distribute posts throughout the content
                const postsToShow = Math.min(relatedPosts.length, 3);
                const insertPositions = [];
                
                if (totalParagraphs >= 3) {
                    // Calculate positions to insert posts (after 3rd, 6th, 9th paragraphs, etc.)
                    for (let i = 0; i < postsToShow; i++) {
                        const position = 2 + (i * 3); // 2 (3rd para), 5 (6th para), 8 (9th para)
                        if (position < totalParagraphs) {
                            insertPositions.push(position);
                        }
                    }
                    
                    // Insert posts in reverse order to maintain correct positions
                    insertPositions.reverse().forEach((position, index) => {
                        const postIndex = postsToShow - 1 - index;
                        const post = relatedPosts[postIndex];
                        const targetParagraph = paragraphs[position];
                        
                        // Create individual related post container
                        const relatedContainer = document.createElement('div');
                        relatedContainer.className = `related-post-container-${postIndex}`;
                        relatedContainer.innerHTML = `
                            <div class="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 bg-black rounded-full flex-shrink-0"></div>
                                    <div>
                                    <a href="/${post.slug}" class="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-semibold text-sm leading-tight no-underline hover:underline block">
                                            ${post.title}
                                    </a>
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        // Insert after the target paragraph
                        targetParagraph.parentNode?.insertBefore(relatedContainer, targetParagraph.nextSibling);
                    });
                }
            }
        }
        // Clean up the dynamically created containers when the component unmounts or content changes
        return () => {
            const dynamicContainer = document.getElementById('toc-dynamic-container');
            if (dynamicContainer) {
                dynamicContainer.remove();
            }
            // Clean up all related post containers
            for (let i = 0; i < 3; i++) {
                const relatedContainer = document.querySelector(`.related-post-container-${i}`);
                if (relatedContainer) {
                    relatedContainer.remove();
                }
            }
        };
    }, [content, headings, relatedPosts]);

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
                [&_a]:text-black [&_a]:underline hover:[&_a]:text-gray-700
                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-4
                [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-gray-300 [&_table]:text-sm
                [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:px-2 [&_th]:py-2 [&_th]:font-bold
                [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_td]:py-2
                dark:[&_blockquote]:border-gray-600
                dark:[&_a]:text-white dark:hover:[&_a]:text-gray-300
                dark:[&_table]:border-gray-600
                dark:[&_th]:border-gray-600 dark:[&_th]:bg-gray-700
                dark:[&_td]:border-gray-600"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default PostContent;
