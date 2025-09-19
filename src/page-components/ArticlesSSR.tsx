'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Post, Category, Tag } from '../types/post';
import dynamic from 'next/dynamic';

// Dynamic imports for components used conditionally
const Carousel = dynamic(() => import('../components/ui/carousel').then(mod => ({ default: mod.Carousel })), { ssr: false });
const CarouselContent = dynamic(() => import('../components/ui/carousel').then(mod => ({ default: mod.CarouselContent })), { ssr: false });
const CarouselItem = dynamic(() => import('../components/ui/carousel').then(mod => ({ default: mod.CarouselItem })), { ssr: false });
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '../components/ui/navigation-menu';
import { useAuth } from '../lib/auth';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LazyImage } from '../components/ui/LazyImage';
import { SearchBar } from '../components/ui/SearchBar';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { ImagePreloader } from '../components/ImagePreloader';

// Simple skeleton component
const SkeletonPost: React.FC = () => (
  <div className="w-full flex flex-col gap-2 animate-pulse">
    <div className="w-full h-48 bg-zinc-300 dark:bg-zinc-700 rounded" />
    <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-3/4" />
    <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-1/2" />
  </div>
);

const placeholderImg = 'https://placehold.co/600x400?text=No+Image';
const imageBaseUrl = 'https://spreadtheword.fr';

function extractFirstImage(html: string): string | null {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"'>]+)["']/i);
  return match ? match[1] : null;
}

function getPostImage(post: Post): string | null {
  // Use image_urls array (posts are already filtered to have this)
  if (Array.isArray(post.image_urls) && post.image_urls.length > 0) {
    const imagePath = post.image_urls[0];
    if (imagePath.startsWith('http')) {
      return imagePath; // Already a full URL
    }
    return `${imageBaseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  }
  
  return null;
}

function getPostImageWithFallbacks(post: Post): string[] {
  // Return all available image URLs for fallback
  if (Array.isArray(post.image_urls) && post.image_urls.length > 0) {
    return post.image_urls.map(imagePath => {
      if (imagePath.startsWith('http')) {
        return imagePath; // Already a full URL
      }
      return `${imageBaseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    });
  }
  
  return [];
}

// Helper to strip HTML and get first N words
function getExcerptFromContent(html: string, wordCount = 15): string {
  if (!html) return '';
  // Use regex to strip HTML tags consistently on both server and client
    const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return text.split(/\s+/).slice(0, wordCount).join(' ') + (text.split(/\s+/).length > wordCount ? '...' : '');
}

interface Pagination {
  currentPage: number;
  totalPages: number;
}

interface ArticlesSSRProps {
  initialPosts: Post[];
  initialCategories: Category[];
  initialTags: Tag[];
  initialPagination: Pagination;
}

export default function ArticlesSSR({ initialPosts, initialCategories, initialTags, initialPagination }: ArticlesSSRProps) {
  const router = useRouter();
  const [allPosts, setAllPosts] = useState<Post[]>(initialPosts || []);
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  const [tags, setTags] = useState<Tag[]>(initialTags || []);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { user } = useAuth();

  // Navigation scroll state
  const navRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Helper functions for getting category and tag names
  const getCategoryNames = (cats: any[]) =>
    cats.map(cat => typeof cat === 'string' ? categories.find(c => c._id === cat)?.name : cat.name)
        .filter(Boolean)
        .filter(name => name !== 'DIVERTISSEMENT'); // Exclude DIVERTISSEMENT category
  const getTagNames = (tagsArr: any[]) =>
    tagsArr.map(tag => typeof tag === 'string' ? tags.find(t => t.id === tag)?.name : tag.name).filter(Boolean);

  // Initialize posts from pre-filtered server data and handle search
  // Infinite scroll logic
  const fetchMorePosts = async () => {
    if (isLoading || pagination.currentPage >= pagination.totalPages) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextPage = pagination.currentPage + 1;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/posts?page=${nextPage}&limit=20`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const newData = await response.json();
      const newPosts = newData.data || [];

      setAllPosts(prev => [...prev, ...newPosts]);
      setPosts(prev => [...prev, ...newPosts]);
      setPagination(newData.pagination);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Intersection observer for infinite loading
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting && !isLoading && !searchQuery.trim()) {
          fetchMorePosts();
        }
      },
      { rootMargin: '1000px' }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef.current, isLoading, pagination, searchQuery]);

  // Initialize posts from pre-filtered server data and handle search
  useEffect(() => {
    // When a search is active, only show filtered results from the currently loaded posts
    if (searchQuery.trim() && searchQuery.trim().length >= 2) {
      const searchTerm = searchQuery.toLowerCase().trim();
      const searchWords = searchTerm.split(' ').filter(word => word.length > 1); // Only words with 2+ characters
      
      const filteredPosts = allPosts.filter(post => {
        const title = post.title.toLowerCase();
        const content = post.content.toLowerCase();
        const excerpt = (post.excerpt || '').toLowerCase();
        const categoryNames = getCategoryNames(post.categoryIds).map(cat => cat.toLowerCase()).join(' ');
        const tagNames = getTagNames(post.tagIds).map(tag => tag.toLowerCase()).join(' ');
        
        // Combine all searchable text
        const searchableText = `${title} ${content} ${excerpt} ${categoryNames} ${tagNames}`;
        
        // Check if all search words are present (AND logic)
        return searchWords.every(word => searchableText.includes(word));
      });
      
      // Sort results by relevance (exact title matches first, then title contains, then content)
      const sortedPosts = filteredPosts.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        
        // Exact title match gets highest priority
        const aExactTitle = aTitle === searchTerm ? 3 : 0;
        const bExactTitle = bTitle === searchTerm ? 3 : 0;
        
        // Title starts with search term gets second priority
        const aTitleStarts = aTitle.startsWith(searchTerm) ? 2 : 0;
        const bTitleStarts = bTitle.startsWith(searchTerm) ? 2 : 0;
        
        // Title contains search term gets third priority
        const aTitleContains = aTitle.includes(searchTerm) ? 1 : 0;
        const bTitleContains = bTitle.includes(searchTerm) ? 1 : 0;
        
        const aScore = aExactTitle + aTitleStarts + aTitleContains;
        const bScore = bExactTitle + bTitleStarts + bTitleContains;
        
        return bScore - aScore;
      });
      
      setPosts(sortedPosts);
    } else {
      // When search is cleared, restore all loaded posts
      setPosts(allPosts);
    }
  }, [allPosts, searchQuery, categories, tags]);

  useEffect(() => {
    setMounted(true);
    // Check initial scroll state after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      checkScrollState();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Check scroll state when categories change
  useEffect(() => {
    if (categories.length > 0) {
      const timer = setTimeout(() => {
        checkScrollState();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [categories]);

  const checkScrollState = () => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
      const hasOverflow = scrollWidth > clientWidth;
      
      // Debug logging (remove in production)
      console.log('Scroll Debug:', {
        scrollLeft,
        scrollWidth,
        clientWidth,
        hasOverflow,
        categoriesCount: parentCategories.length
      });
      
      setShowLeftArrow(scrollLeft > 5); // Small threshold for better UX
      setShowRightArrow(hasOverflow && scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scrollLeft = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Function to handle dashboard navigation based on user role
  const handleDashboardNavigation = () => {
    if (!user) return;
    
    if (user.role === 'USER') {
      router.push('/dashboard/posts');
    } else {
      router.push('/dashboard');
    }
  };

  // Filter parent categories (those without parentId) - include DIVERTISSEMENT in navigation
  const parentCategories = categories.filter(category => 
    !category.parentId // This handles null, undefined, empty string, etc.
  );

  // Filter out posts that belong to DIVERTISSEMENT category
  const postsWithoutDivertissement = posts.filter(post => {
    if (!post.categoryIds) return true;
    
    return !post.categoryIds.some((catId: any) => {
      const categoryObj = typeof catId === 'string' 
        ? categories.find(c => c._id === catId)
        : catId;
      return categoryObj?.name === 'DIVERTISSEMENT';
    });
  });

  // Chunk posts for repeating structure
  const chunkSections = (arr: Post[], chunkSize: number, sliderSize: number) => {
    const sections = [];
    let i = 0;
    while (i < arr.length) {
      const section = arr.slice(i, i + chunkSize);
      i += chunkSize;
      const slider = arr.slice(i, i + sliderSize);
      i += sliderSize;
      sections.push({ section, slider });
    }
    return sections;
  };

  // Each section: 1 main, 2 small, headlines; then a slider of 4
  const sections = chunkSections(postsWithoutDivertissement, 3, 4);

  // Helper to get sidebar headlines (next 4 posts after the 3 in section)
  const getSidebarStories = (startIdx: number) => postsWithoutDivertissement.slice(startIdx + 3, startIdx + 7);

  // After the first main+2+headlines+carousel, show a modern 3-column layout for the next up to 11 posts (or fewer if not enough)
  const modernStartIdx = 3 + 4; // skip first 3 (main+2) and 4 (carousel)
  const modernPosts = postsWithoutDivertissement.slice(modernStartIdx, modernStartIdx + 11); // 1+3+1+2+1+3 = 11
  // Left: 1 large + 3 small, Center: 1 extra-large + 2 small, Right: 1 large + 3 small
  // Removed hardcoded layout variables - now using dynamic category-based content
  // Posts after the modern 3-column layout
  const afterModernIdx = modernStartIdx + modernPosts.length;
  const remainingPosts = postsWithoutDivertissement.slice(afterModernIdx);

  // Get posts for dynamic categories instead of hardcoded sections
  const getPostsForCategory = (categoryId: string, limit: number = 2) => {
    const filteredPosts = postsWithoutDivertissement.filter(post => {
      if (!post.categoryIds) return false;
      
      // Handle both string IDs and object IDs
      return post.categoryIds.some((catId: any) => {
        const id = typeof catId === 'string' ? catId : catId._id || catId.id;
        return id === categoryId;
      });
    }).slice(0, limit);
    return filteredPosts;
  };

  // Find categories with posts for dynamic sections
  // Filter out DIVERTISSEMENT category and find ACTUALITÉS or other suitable categories
  const availableCategories = categories.filter(c => !c.name.toLowerCase().includes('divertissement'));
  const actualitesCategory = availableCategories.find(c => c.name.toLowerCase().includes('actualit'));
  const firstCategory = actualitesCategory || availableCategories.find(c => getPostsForCategory(c._id, 1).length > 0) || availableCategories[0];
  const secondCategory = availableCategories.find(c => c._id !== firstCategory?._id && getPostsForCategory(c._id, 1).length > 0) || availableCategories[1];
  const thirdCategory = availableCategories.find(c => c._id !== firstCategory?._id && c._id !== secondCategory?._id && getPostsForCategory(c._id, 1).length > 0) || availableCategories[2];
  const firstCategoryPosts = firstCategory ? getPostsForCategory(firstCategory._id, 5) : [];
  const secondCategoryPosts = secondCategory ? getPostsForCategory(secondCategory._id, 5) : [];
  const thirdCategoryPosts = thirdCategory ? getPostsForCategory(thirdCategory._id, 5) : [];

  // Handle image load error - placeholder function (logic moved to backend)
  const handleImageError = (postId: string) => {
    // Image error handling moved to backend
  };

  // Handle search query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Debounce utility (moved inside component)
  function debounce(fn: (...args: any[]) => void, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const debouncedCheckScrollState = useCallback(debounce(checkScrollState, 100), [categories]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 w-full overflow-x-hidden">
      {/* Preload critical images for better LCP */}
      {sections.length > 0 && sections[0].section[0] && getPostImage(sections[0].section[0]) && (
        <ImagePreloader 
          imageUrl={getPostImage(sections[0].section[0])!} 
          priority={true}
          preloadMultiple={
            // Preload first 3 images from the first section
            sections[0].section.slice(0, 3)
              .map(post => getPostImage(post))
              .filter(Boolean) as string[]
          }
        />
      )}
      <div className="flex-grow w-full">
        <div className="w-full max-w-7xl mx-auto py-6 px-3 sm:px-4 md:px-6 lg:px-8 min-w-0 pt-0">
          {/* Header */}

<header className={`w-full bg-[#708238] py-3 mb-6 ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
  {/* Top Bar: Logo and Ad */}
  <div className="flex justify-between items-center px-4 md:px-10">
    {/* Logo */}
    <div className="flex items-center space-x-2">
      <div className="text-white text-2xl font-bold tracking-tight">
        <Link href="/">
          Spread  <span className="font-normal">The Word</span>
        </Link>
      </div>
    </div>

    {/* Ad Space */}
    <div className="hidden md:block">
      {/* Replace with actual ad if needed */}
      <div className="bg-white text-black px-4 py-2 rounded shadow text-sm">
        Publicité / Ad Space
      </div>
    </div>
  </div>

  {/* Category Navbar */}
  <nav className="mt-4 border-t border-white/20 pt-2">
    <div className="flex overflow-x-auto px-4 md:px-10 space-x-4">
      <Link href="/" className="text-sm font-medium whitespace-nowrap hover:underline text-white">
        MAISON
      </Link>
      {parentCategories.map((category) => (
        <Link
          key={category._id}
          href={`/${category.slug}`}
          className="text-sm font-medium whitespace-nowrap hover:underline text-white"
        >
          {category.name}
        </Link>
      ))}
    </div>
  </nav>
</header>

          {/* Search Results Indicator */}
          {searchQuery && searchQuery.trim().length >= 2 && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Résultats de recherche pour "{searchQuery}"
                  </h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    {posts.length} article{posts.length !== 1 ? 's' : ''} trouvé{posts.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleSearch('')}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm font-medium"
                >
                  Effacer la recherche
                </button>
              </div>
            </div>
          )}
          
          {posts.length === 0 && searchQuery && searchQuery.trim().length >= 2 && (
            <div className="text-center py-12">
              <div className="text-zinc-500 dark:text-zinc-400 text-lg mb-2">
                Aucun article trouvé pour "{searchQuery}"
              </div>
              <p className="text-zinc-400 dark:text-zinc-500 text-sm">
                Essayez avec d'autres mots-clés ou effacez la recherche pour voir tous les articles.
              </p>
            </div>
          )}
          
          {/* Search Results Layout */}
          {searchQuery && searchQuery.trim().length >= 2 && posts.length > 0 && (
            <div className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                  <div key={post._id || post.id} className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {getPostImage(post) && (
                      <LazyImage
                        src={getPostImage(post)!}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                        imageUrls={getPostImageWithFallbacks(post)}
                        onError={() => handleImageError(post._id || post.id)}
                      />
                    )}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        <Link href={`/${post.slug}`} className="hover:underline underline-offset-2 transition-all text-zinc-900 dark:text-zinc-100">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 mb-3 flex-1">
                        {getExcerptFromContent(post.content, 25)}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {getCategoryNames(post.categoryIds).slice(0, 2).map((name, index) => (
                          <Badge key={`cat-${post._id || post.id}-${name}-${index}`} variant="outline" className="text-xs">{name}</Badge>
                        ))}
                        {getTagNames(post.tagIds).slice(0, 2).map((name, index) => (
                          <Badge key={`tag-${post._id || post.id}-${name}-${index}`} variant="default" className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">#{name}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {new Date(post.createdAt).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                        <Button asChild size="sm" variant="outline" className="text-xs">
                          <Link href={`/${post.slug}`}>
                            Lire la suite
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Normal Layout - Only show when no search is active */}
          {(!searchQuery || searchQuery.trim().length < 2) && (
            <>
          {/* First main+2+headlines section */}
         {/* First section */}

{sections.length > 0 && (() => {
  const { section } = sections[0];
  const topPosts = section.slice(0, 3); // Change to exactly 3 posts

  return (
    <div className="mb-16">
      {/* 3 column grid with interactive hover effects */}
      <div className="flex h-[500px] gap-2">
        {topPosts.map((post, index) => (
          <div 
            key={post._id || post.id} 
            className="relative overflow-hidden group cursor-pointer transition-all duration-500 ease-out hover:flex-[2] flex-1"
          >
            {/* Background image */}
            {getPostImage(post) && (
              <LazyImage
                src={getPostImage(post)!}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                imageUrls={getPostImageWithFallbacks(post)}
                onError={() => handleImageError(post._id || post.id)}
              />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content overlay */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              {/* Category */}
              {getCategoryNames(post.categoryIds).slice(0,1).map((name, index) => (
                <span 
                  key={`hero-cat-${post._id || post.id}-${name}-${index}`} 
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-sm mb-3 ${
                    name.toLowerCase() === firstCategory?.name?.toLowerCase() ? "bg-green-500" :
                name.toLowerCase() === secondCategory?.name?.toLowerCase() ? "bg-pink-500" :
                name.toLowerCase() === initialCategories[3]?.name?.toLowerCase() ? "bg-orange-500" :
                    name.toLowerCase() === "sports" ? "bg-red-600" :
                    "bg-indigo-600"
                  }`}
                >
                  {name}
                </span>
              ))}

              {/* Title - shows more on hover */}
              <h3 className="text-xl font-bold leading-snug line-clamp-3 group-hover:line-clamp-4 transition-all duration-300">
                <Link href={`/${post.slug}`} className="hover:underline underline-offset-2">
                  {post.title}
                </Link>
              </h3>

              {/* Excerpt - only shows on hover */}
              <p className="text-sm text-gray-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                {getExcerptFromContent(post.content, 20)}
              </p>

              {/* Meta row */}
              <div className="mt-3 flex items-center gap-6 text-sm text-gray-300">
                <span>{new Date(post.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
})()}

 {/* 2nd section */}

{/* Dynamic Post Sections */}
        <div className="mb-16">
          {/* Breaking News + Media of the day row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Breaking News - Takes 2/3 width */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="bg-red-600 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide inline-block">
                  {firstCategory?.name || 'Actualités'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {firstCategoryPosts.map((post, index) => (
                  <div key={post._id || post.id} className="group cursor-pointer">
                    {getPostImage(post) && (
                      <div className="relative overflow-hidden rounded mb-4">
                        <LazyImage
                          src={getPostImage(post)!}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          imageUrls={getPostImageWithFallbacks(post)}
                          onError={() => handleImageError(post._id || post.id)}
                        />
                      </div>
                    )}
                    
                    {/* Tags and reading time instead of category badge */}
                    <div className="mb-3 flex items-center gap-2 flex-wrap">
                      {/* Show tags */}
                      {getTagNames(post.tagIds).slice(0, 2).map((name, index) => (
                        <span 
                          key={`section-tag-${post._id || post.id}-${name}-${index}`} 
                          className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                        >
                          #{name}
                        </span>
                      ))}
                      {/* Reading time */}
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{Math.max(1, Math.ceil(post.content?.replace(/<[^>]*>/g, '').split(' ').length / 200))} min de lecture</span>
                      </span>
                    </div>

                    {/* Title and excerpt */}
                    <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/${post.slug}`} className="hover:underline underline-offset-2">
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                      {getExcerptFromContent(post.content, 25)}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{new Date(post.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span>By Unknown</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Media of the day - Takes 1/3 width */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h2 className="bg-gray-800 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide inline-block">
                  {secondCategory?.name || 'Médias'}
                </h2>
              </div>
              <div className="space-y-6">
                {secondCategoryPosts.map((post, index) => (
                  <div key={post._id || post.id} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded mb-3">
                      {getPostImage(post) && (
                        <LazyImage
                          src={getPostImage(post)!}
                          alt={post.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                          imageUrls={getPostImageWithFallbacks(post)}
                          onError={() => handleImageError(post._id || post.id)}
                        />
                      )}

                    </div>
                    <h4 className="font-semibold text-sm leading-tight group-hover:text-blue-600 transition-colors">
                      <Link href={`/${post.slug}`} className="hover:underline underline-offset-2">
                        {post.title}
                      </Link>
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Entertainment section - 3 equal columns */}
          <div className="border-t pt-8">
            <div className="mb-6">
              <h2 className="bg-purple-600 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide inline-block">
                {thirdCategory?.name || 'Important'}
              </h2>
              {/* Dynamic subcategories based on available tags */}
              {tags.length > 0 && (
                <div className="flex gap-4 mt-3 text-sm">
                  {tags.filter(tag => tag.name.toLowerCase() !== 'romeo').slice(0, 3).map((tag, index) => (
                    <span 
                      key={`tag-${tag.id}-${index}`} 
                      className={`cursor-pointer hover:underline ${
                        index === 0 ? 'text-purple-600 font-semibold' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {thirdCategoryPosts.map((post, index) => (
                <div key={post._id || post.id} className="group cursor-pointer">
                  {getPostImage(post) && (
                    <div className="relative overflow-hidden rounded mb-4">
                      <LazyImage
                        src={getPostImage(post)!}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        imageUrls={getPostImageWithFallbacks(post)}
                        onError={() => handleImageError(post._id || post.id)}
                      />
                    </div>
                  )}
                  
                  {/* Category */}
                 

                  <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-purple-600 transition-colors">
                    <Link href={`/${post.slug}`} className="hover:underline underline-offset-2">
                      {post.title}
                    </Link>
                  </h3>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                    <span>{new Date(post.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span>2 Min de Lecture</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

          {/* Advertisement container */}
          <div className="my-12 w-full">
            <div className="w-full max-w-7xl mx-auto bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg flex flex-col items-center py-8">
              <AdPlaceholder width={1200} height={120} className="w-full max-w-5xl" />
            </div>
          </div>

          {/* Three Category Columns Section */}
          <div className="border-t pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* First Category Column */}
              <div>
                <div className="bg-green-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide inline-block mb-4">
                  {firstCategory?.name || 'ACTUALITÉS'}
                </div>
                
                {/* Featured Article */}
                {firstCategoryPosts[0] && (
                  <div className="mb-6 group cursor-pointer">
                    {getPostImage(firstCategoryPosts[0]) && (
                      <div className="relative overflow-hidden rounded mb-3">
                        <LazyImage
                          src={getPostImage(firstCategoryPosts[0])!}
                          alt={firstCategoryPosts[0].title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          imageUrls={getPostImageWithFallbacks(firstCategoryPosts[0])}
                          onError={() => handleImageError(firstCategoryPosts[0].id)}
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-green-600 transition-colors">
                      <Link href={`/${firstCategoryPosts[0].slug}`} className="hover:underline underline-offset-2">
                        {firstCategoryPosts[0].title}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>⏱</span>
                      <span>{new Date(firstCategoryPosts[0].createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                )}

                {/* Additional Articles */}
                <div className="space-y-4">
                  {firstCategoryPosts.slice(1).map((post, index) => (
                    <div key={post._id || post.id} className="flex gap-3 items-start group cursor-pointer">
                      {getPostImage(post) && (
                        <LazyImage
                          src={getPostImage(post)!}
                          alt={post.title}
                          className="w-16 h-12 object-cover rounded flex-shrink-0"
                          imageUrls={getPostImageWithFallbacks(post)}
                          onError={() => handleImageError(post._id || post.id)}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">{firstCategory?.name || 'ACTUALITÉS'}</span>
                        <h4 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-green-600 transition-colors">
                          <Link href={`/${post.slug}`} className="hover:underline underline-offset-2">
                            {post.title}
                          </Link>
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Second Category Column */}
              <div>
                <div className="bg-pink-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide inline-block mb-4">
                  {secondCategory?.name || 'DERNIÈRES'}
                </div>
                
                {/* Featured Article */}
                {secondCategoryPosts[0] && (
                  <div className="mb-6 group cursor-pointer">
                    {getPostImage(secondCategoryPosts[0]) && (
                      <div className="relative overflow-hidden rounded mb-3">
                        <LazyImage
                          src={getPostImage(secondCategoryPosts[0])!}
                          alt={secondCategoryPosts[0].title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          imageUrls={getPostImageWithFallbacks(secondCategoryPosts[0])}
                          onError={() => handleImageError(secondCategoryPosts[0].id)}
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-pink-600 transition-colors">
                      <Link href={`/${secondCategoryPosts[0].slug}`} className="hover:underline underline-offset-2">
                        {secondCategoryPosts[0].title}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>⏱</span>
                      <span>{new Date(secondCategoryPosts[0].createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                )}

                {/* Additional Articles */}
                <div className="space-y-4">
                  {secondCategoryPosts.slice(1).map((post, index) => (
                    <div key={post._id || post.id} className="flex gap-3 items-start group cursor-pointer">
                      {getPostImage(post) && (
                        <LazyImage
                          src={getPostImage(post)!}
                          alt={post.title}
                          className="w-16 h-12 object-cover rounded flex-shrink-0"
                          imageUrls={getPostImageWithFallbacks(post)}
                          onError={() => handleImageError(post._id || post.id)}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-pink-600 font-semibold uppercase tracking-wide">{secondCategory?.name || 'DERNIÈRES'}</span>
                        <h4 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-pink-600 transition-colors">
                          <Link href={`/${post.slug}`} className="hover:underline underline-offset-2">
                            {post.title}
                          </Link>
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Third Category Column */}
              <div>
                <div className="bg-orange-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide inline-block mb-4">
                  {thirdCategory?.name || 'IMPORTANT'}
                </div>
                
                {/* Featured Article */}
                {thirdCategoryPosts[0] && (
                  <div className="mb-6 group cursor-pointer">
                    {getPostImage(thirdCategoryPosts[0]) && (
                      <div className="relative overflow-hidden rounded mb-3">
                        <LazyImage
                          src={getPostImage(thirdCategoryPosts[0])!}
                          alt={thirdCategoryPosts[0].title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          imageUrls={getPostImageWithFallbacks(thirdCategoryPosts[0])}
                          onError={() => handleImageError(thirdCategoryPosts[0].id)}
                        />

                      </div>
                    )}
                    <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-orange-600 transition-colors">
                      <Link href={`/${thirdCategoryPosts[0].slug}`} className="hover:underline underline-offset-2">
                        {thirdCategoryPosts[0].title}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>⏱</span>
                      <span>{new Date(thirdCategoryPosts[0].createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                )}

                {/* Third Category Small Articles */}
                <div className="space-y-4">
                  {thirdCategoryPosts.slice(1, 5).map((post, index) => (
                    <div key={post._id || post.id} className="flex gap-3 items-start group cursor-pointer">
                      {getPostImage(post) && (
                        <LazyImage
                          src={getPostImage(post)!}
                          alt={post.title}
                          className="w-16 h-12 object-cover rounded flex-shrink-0"
                          imageUrls={getPostImageWithFallbacks(post)}
                          onError={() => handleImageError(post._id || post.id)}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-orange-600 font-semibold uppercase tracking-wide">{thirdCategory?.name || 'IMPORTANT'}</span>
                        <h4 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                          <Link href={`/${post.slug}`} className="hover:underline underline-offset-2">
                            {post.title}
                          </Link>
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Reviews Section */}
            <div className="mt-16 border-t pt-8">
              <div className="mb-6">
                <h2 className="bg-gray-800 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide inline-block">
                  Meilleures Critiques
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {remainingPosts.slice(0, 3).map((post, index) => (
                  <div key={post._id || post.id} className="group cursor-pointer">
                    {getPostImage(post) && (
                      <div className="relative overflow-hidden rounded mb-4">
                        <LazyImage
                          src={getPostImage(post)!}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          imageUrls={getPostImageWithFallbacks(post)}
                          onError={() => handleImageError(post._id || post.id)}
                        />
                      </div>
                    )}
                    
                    {/* Tags and metadata instead of category badges */}
                    <div className="mb-3 flex items-center gap-2 flex-wrap">
                      {/* Show tags instead of categories */}
                      {getTagNames(post.tagIds).slice(0, 2).map((name, index) => (
                        <span 
                          key={`grid-tag-${post._id || post.id}-${name}-${index}`} 
                          className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          #{name}
                        </span>
                      ))}
                      {/* Reading time estimate */}
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <span>📖</span>
                        <span>{Math.max(1, Math.ceil(post.content?.replace(/<[^>]*>/g, '').split(' ').length / 200))} min</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/${post.slug}`} className="hover:underline underline-offset-2">
                        {post.title}
                      </Link>
                    </h3>
                    
                    {/* Rating stars */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={`${post._id || post.id}-star-${i}`} className="text-yellow-400 text-sm">★</span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">2 Min de Lecture</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular This Week Section */}
            <div className="mt-16">
              <div className="mb-6">
                <h2 className="bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-wide inline-block">
                  Populaire Cette Semaine
                </h2>
              </div>
              
              {/* Top 4 featured articles with large images */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {remainingPosts.slice(3, 7).map((post, index) => (
                  <div key={post._id || post.id} className="group cursor-pointer">
                    {getPostImage(post) && (
                      <div className="relative overflow-hidden rounded mb-3">
                        <LazyImage
                          src={getPostImage(post)!}
                          alt={post.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                          imageUrls={getPostImageWithFallbacks(post)}
                          onError={() => handleImageError(post._id || post.id)}
                        />
                        <div className="absolute top-2 left-2">
                          {getCategoryNames(post.categoryIds).slice(0,1).map((name, index) => (
                            <span 
                              key={`overlay-cat-${post._id || post.id}-${name}-${index}`} 
                              className={`text-xs font-bold px-2 py-1 uppercase tracking-wide ${
                                name.toLowerCase().includes('sport') ? 'bg-red-600 text-white' :
                                name.toLowerCase() === initialCategories[3]?.name?.toLowerCase() ? 'bg-orange-500 text-white' :
                name.toLowerCase() === secondCategory?.name?.toLowerCase() ? 'bg-pink-500 text-white' :
                                name.toLowerCase().includes('tech') ? 'bg-blue-600 text-white' :
                                'bg-gray-700 text-white'
                              }`}
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <h3 className="text-base font-bold leading-tight group-hover:text-blue-600 transition-colors">
                      <Link href={`/${post.slug}`} className="hover:underline underline-offset-2">
                        {post.title}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <span>⏱</span>
                      <span>1 week ago</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Below articles organized by category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Sports Column */}
                <div className="space-y-3">
                  {remainingPosts.slice(7, 10).map((post, index) => (
                    <div key={post._id || post.id} className="group cursor-pointer">
                      <div className="mb-1">
                        <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">FEATURED</span>
                      </div>
                      <h4 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-red-600 transition-colors mb-1">
                        <Link href={`/${post.slug}`} className="hover:underline underline-offset-2">
                          {post.title}
                        </Link>
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>⏱</span>
                        <span>1 week ago</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Food & Drinks Column */}
                <div className="space-y-3">
                  {remainingPosts.slice(10, 13).map((post, index) => (
                    <div key={post._id || post.id} className="group cursor-pointer">
                      <div className="mb-1">
                        <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">{initialCategories[3]?.name || 'IMPORTANT'}</span>
                      </div>
                      <h4 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors mb-1">
                        <Link href={`/${post.slug}`} className="hover:underline underline-offset-2">
                          {post.title}
                        </Link>
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>⏱</span>
                        <span>1 week ago</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Technology Column */}
                <div className="space-y-3">
                  {remainingPosts.slice(13, 16).map((post, index) => (
                    <div key={post._id || post.id} className="group cursor-pointer">
                      <div className="mb-1">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">TRENDING</span>
                      </div>
                      <h4 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                        <Link href={`/${post.slug}`} className="hover:underline underline-offset-2">
                          {post.title}
                        </Link>
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>⏱</span>
                        <span>1 week ago</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Entertainment Column */}
                <div className="space-y-3">
                  {remainingPosts.slice(16, 19).map((post, index) => (
                    <div key={post._id || post.id} className="group cursor-pointer">
                     
                      <h4 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors mb-1">
                        <Link href={`/${post.slug}`} className="hover:underline underline-offset-2">
                          {post.title}
                        </Link>
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>⏱</span>
                        <span>1 week ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        

          {/* More posts after ad banner, in modern 3-column layout chunks */}
          {/* Vertical List Layout for Remaining Posts */}
{remainingPosts.length > 19 && (
  <div className=" mt-16">
    <div className="space-y-6">
      {remainingPosts.slice(19).map((post, index) => (
        <div key={post._id || post.id} className="flex gap-4 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0 group">
          {/* Article Image */}
          <div className="flex-shrink-0">
            {getPostImage(post) && (
              <LazyImage
                src={getPostImage(post)!}
                alt={post.title}
                className="w-48 h-32 object-cover rounded group-hover:scale-105 transition-transform duration-500"
                imageUrls={getPostImageWithFallbacks(post)}
                onError={() => handleImageError(post._id || post.id)}
              />
            )}
          </div>
          
          {/* Article Content */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Category Tag */}
            <div className="mb-2">
              {getCategoryNames(post.categoryIds).slice(0,1).map((name, index) => (
                <span 
                  key={`sidebar-cat-${post._id || post.id}-${name}-${index}`} 
                  className={`text-xs font-bold uppercase tracking-wide ${
                    name.toLowerCase().includes('tech') ? 'text-blue-600' :
                    name.toLowerCase().includes('sport') ? 'text-red-600' :
                    name.toLowerCase().includes('entertainment') ? 'text-purple-600' :
                    name.toLowerCase() === secondCategory?.name?.toLowerCase() ? 'text-pink-600' :
                name.toLowerCase() === initialCategories[3]?.name?.toLowerCase() ? 'text-orange-600' :
                name.toLowerCase() === firstCategory?.name?.toLowerCase() ? 'text-green-600' :
                    'text-gray-600'
                  }`}
                >
                  {name}
                </span>
              ))}
            </div>
            
            {/* Article Title */}
            <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-blue-600 transition-colors">
              <Link href={`/${post.slug}`} className="hover:underline underline-offset-2">
                {post.title}
              </Link>
            </h3>
            
            {/* Article Excerpt */}
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
              {getExcerptFromContent(post.content, 30)}
            </p>
            
            {/* Meta Information */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <span>⏱</span>
                <span>1 week ago</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    
    {/* Load More Button */}
    <div className="text-center mt-8">
      <button 
        onClick={fetchMorePosts}
        disabled={isLoading || pagination.currentPage >= pagination.totalPages}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-8 py-3 rounded font-medium transition-colors"
      >
        {isLoading ? 'Chargement...' : 'CHARGER PLUS'}
      </button>
    </div>
  </div>
)}
            </>
          )} 
        {/* loading skeletons */}
        {isLoading && !searchQuery.trim() && (
          <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonPost key={`skeleton-${i}`} />
            ))}
          </div>
        )}
        {/* sentinel for infinite scroll */}
        <div ref={loaderRef} className="h-px w-full" />
        </div>
      </div>
    </div>
  );
}